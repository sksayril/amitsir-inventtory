const express = require('express');
const SalesTransaction = require('../models/salesTransaction.model');
const Company = require('../models/company.model');
const DebitParty = require('../models/debitParty.model');
const CreditParty = require('../models/creditParty.model');
const Item = require('../models/item.model');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Helper function to generate bill number
const generateBillNumber = async (companyName) => {
  try {
    // Get initial letters of company name
    const initials = companyName
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('');
    
    // Find the latest transaction for this company
    const latestTransaction = await SalesTransaction.findOne({
      'company.companyName': companyName
    }).sort({ createdAt: -1 });
    
    let sequenceNumber = 1;
    if (latestTransaction) {
      // Extract sequence number from existing bill number
      const existingNumber = latestTransaction.transactionNumber;
      const match = existingNumber.match(/\d+$/);
      if (match) {
        sequenceNumber = parseInt(match[0]) + 1;
      }
    }
    
    return `${initials}${sequenceNumber.toString().padStart(4, '0')}`;
  } catch (error) {
    console.error('Error generating bill number:', error);
    throw new Error('Failed to generate bill number');
  }
};

// Helper function to generate AI covering notes
const generateCoveringNotes = (transactionData) => {
  const { company, debitParty, creditParty, items, totalAmount, currency } = transactionData;
  
  let notes = `Subject: Sales Transaction - ${company.companyName} to ${creditParty.partyName}\n\n`;
  notes += `Dear ${creditParty.partyName},\n\n`;
  notes += `We are pleased to confirm the sales transaction details as follows:\n\n`;
  notes += `**Transaction Summary:**\n`;
  notes += `• Company: ${company.companyName}\n`;
  notes += `• Debit Party: ${debitParty.partyName}\n`;
  notes += `• Credit Party: ${creditParty.partyName}\n`;
  notes += `• Total Amount: ${currency} ${totalAmount.toLocaleString()}\n\n`;
  
  notes += `**Items Included:**\n`;
  items.forEach((item, index) => {
    notes += `${index + 1}. ${item.item.itemName} - Qty: ${item.quantity} ${item.item.itemUnits} @ ${currency} ${item.rate} = ${currency} ${item.amount.toLocaleString()}\n`;
    if (item.description) {
      notes += `   Description: ${item.description}\n`;
    }
  });
  
  notes += `\n**Terms & Conditions:**\n`;
  notes += `• Payment terms: As per agreed terms\n`;
  notes += `• Delivery: As per agreed schedule\n`;
  notes += `• Quality: As per specifications\n\n`;
  
  notes += `Please confirm receipt of this transaction and contact us for any queries.\n\n`;
  notes += `Best regards,\n${company.companyName}`;
  
  return notes;
};

// @route   POST /sales-transactions
// @desc    Create a new sales transaction
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const {
      companyId,
      debitPartyId,
      creditPartyId,
      transactionDate,
      items,
      currency,
      brokerId,
      chaId,
      remarks,
      ...additionalFields
    } = req.body;

    // Validate required fields
    if (!companyId || !debitPartyId || !creditPartyId || !transactionDate || !items || !Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        message: 'Company, debit party, credit party, transaction date, and items are required'
      });
    }

    // Validate items array
    if (items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one item is required'
      });
    }

    // Fetch company details
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(400).json({
        success: false,
        message: 'Company not found'
      });
    }

    // Fetch debit party details
    const debitParty = await DebitParty.findById(debitPartyId);
    if (!debitParty) {
      return res.status(400).json({
        success: false,
        message: 'Debit party not found'
      });
    }

    // Fetch credit party details
    const creditParty = await CreditParty.findById(creditPartyId);
    if (!creditParty) {
      return res.status(400).json({
        success: false,
        message: 'Credit party not found'
      });
    }

    // Validate and process items
    let totalAmount = 0;
    const processedItems = [];

    for (const itemData of items) {
      const { itemId, quantity, rate, description } = itemData;
      
      if (!itemId || !quantity || !rate) {
        return res.status(400).json({
          success: false,
          message: 'Item ID, quantity, and rate are required for all items'
        });
      }

      // Fetch item details
      const item = await Item.findById(itemId);
      if (!item) {
        return res.status(400).json({
          success: false,
          message: `Item with ID ${itemId} not found`
        });
      }

      const amount = quantity * rate;
      totalAmount += amount;

      processedItems.push({
        item: itemId,
        quantity,
        rate,
        amount,
        description: description || ''
      });
    }

    // Generate bill number
    const billNumber = await generateBillNumber(company.companyName);

    // Create sales transaction
    const salesTransaction = new SalesTransaction({
      transactionNumber: billNumber,
      transactionDate: new Date(transactionDate),
      company: {
        _id: company._id,
        companyName: company.companyName,
        firmId: company.firmId,
        gstNo: company.gstNo
      },
      debitParty: {
        _id: debitParty._id,
        partyName: debitParty.partyName,
        gstNo: debitParty.gstNo,
        panNo: debitParty.panNo,
        iecNo: debitParty.iecNo,
        epcgLicNo: debitParty.epcgLicNo
      },
      creditParty: {
        _id: creditParty._id,
        partyName: creditParty.partyName,
        country: creditParty.country,
        port: creditParty.port
      },
      items: processedItems,
      totalAmount,
      currency: currency || 'INR',
      broker: brokerId,
      cha: chaId,
      remarks,
      coveringNotes: generateCoveringNotes({
        company,
        debitParty,
        creditParty,
        items: processedItems,
        totalAmount,
        currency: currency || 'INR'
      }),
      createdBy: req.user._id,
      ...additionalFields
    });

    await salesTransaction.save();

    // Populate references
    await salesTransaction.populate([
      { path: 'company._id', select: 'companyName firmId gstNo' },
      { path: 'debitParty._id', select: 'partyName gstNo panNo iecNo epcgLicNo' },
      { path: 'creditParty._id', select: 'partyName country port' },
      { path: 'items.item', select: 'itemName itemHsn itemUnits' },
      { path: 'broker', select: 'brokerName' },
      { path: 'cha', select: 'chaName' },
      { path: 'createdBy', select: 'name email' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Sales transaction created successfully',
      data: salesTransaction.toJSON()
    });

  } catch (error) {
    console.error('Create sales transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   GET /sales-transactions
// @desc    Get all sales transactions with pagination and filtering
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const companyId = req.query.companyId;
    const debitPartyId = req.query.debitPartyId;
    const creditPartyId = req.query.creditPartyId;
    const status = req.query.status;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const isActive = req.query.isActive;

    const skip = (page - 1) * limit;
    const filter = {};

    // Build filter object
    if (search) {
      filter.$or = [
        { transactionNumber: { $regex: search, $options: 'i' } },
        { 'company.companyName': { $regex: search, $options: 'i' } },
        { 'debitParty.partyName': { $regex: search, $options: 'i' } },
        { 'creditParty.partyName': { $regex: search, $options: 'i' } }
      ];
    }

    if (companyId) filter['company._id'] = companyId;
    if (debitPartyId) filter['debitParty._id'] = debitPartyId;
    if (creditPartyId) filter['creditParty._id'] = creditPartyId;
    if (status) filter.status = status;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    // Date range filter
    if (startDate || endDate) {
      filter.transactionDate = {};
      if (startDate) filter.transactionDate.$gte = new Date(startDate);
      if (endDate) filter.transactionDate.$lte = new Date(endDate);
    }

    // Get sales transactions with pagination
    const salesTransactions = await SalesTransaction.find(filter)
      .populate([
        { path: 'company._id', select: 'companyName firmId gstNo' },
        { path: 'debitParty._id', select: 'partyName gstNo panNo iecNo epcgLicNo' },
        { path: 'creditParty._id', select: 'partyName country port' },
        { path: 'items.item', select: 'itemName itemHsn itemUnits' },
        { path: 'broker', select: 'brokerName' },
        { path: 'cha', select: 'chaName' },
        { path: 'createdBy', select: 'name email' },
        { path: 'updatedBy', select: 'name email' }
      ])
      .sort({ transactionDate: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await SalesTransaction.countDocuments(filter);

    res.json({
      success: true,
      data: salesTransactions,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    });

  } catch (error) {
    console.error('Get sales transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   GET /sales-transactions/:id
// @desc    Get sales transaction by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const salesTransaction = await SalesTransaction.findById(req.params.id)
      .populate([
        { path: 'company._id', select: 'companyName firmId gstNo' },
        { path: 'debitParty._id', select: 'partyName gstNo panNo iecNo epcgLicNo' },
        { path: 'creditParty._id', select: 'partyName country port' },
        { path: 'items.item', select: 'itemName itemHsn itemUnits' },
        { path: 'broker', select: 'brokerName' },
        { path: 'cha', select: 'chaName' },
        { path: 'createdBy', select: 'name email' },
        { path: 'updatedBy', select: 'name email' }
      ]);

    if (!salesTransaction) {
      return res.status(404).json({
        success: false,
        message: 'Sales transaction not found'
      });
    }

    res.json({
      success: true,
      data: salesTransaction.toJSON()
    });

  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid sales transaction ID'
      });
    }

    console.error('Get sales transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   PUT /sales-transactions/:id
// @desc    Update sales transaction
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const {
      companyId,
      debitPartyId,
      creditPartyId,
      transactionDate,
      items,
      currency,
      brokerId,
      chaId,
      remarks,
      status,
      isActive,
      ...additionalFields
    } = req.body;

    // Check if sales transaction exists
    const existingTransaction = await SalesTransaction.findById(req.params.id);
    if (!existingTransaction) {
      return res.status(404).json({
        success: false,
        message: 'Sales transaction not found'
      });
    }

    // Validate required fields if updating
    if (items && !Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        message: 'Items must be an array'
      });
    }

    let updateData = {};
    let totalAmount = existingTransaction.totalAmount;

    // Update company if provided
    if (companyId) {
      const company = await Company.findById(companyId);
      if (!company) {
        return res.status(400).json({
          success: false,
          message: 'Company not found'
        });
      }
      updateData.company = {
        _id: company._id,
        companyName: company.companyName,
        firmId: company.firmId,
        gstNo: company.gstNo
      };
    }

    // Update debit party if provided
    if (debitPartyId) {
      const debitParty = await DebitParty.findById(debitPartyId);
      if (!debitParty) {
        return res.status(400).json({
          success: false,
          message: 'Debit party not found'
        });
      }
      updateData.debitParty = {
        _id: debitParty._id,
        partyName: debitParty.partyName,
        gstNo: debitParty.gstNo,
        panNo: debitParty.panNo,
        iecNo: debitParty.iecNo,
        epcgLicNo: debitParty.epcgLicNo
      };
    }

    // Update credit party if provided
    if (creditPartyId) {
      const creditParty = await CreditParty.findById(creditPartyId);
      if (!creditParty) {
        return res.status(400).json({
          success: false,
          message: 'Credit party not found'
        });
      }
      updateData.creditParty = {
        _id: creditParty._id,
        partyName: creditParty.partyName,
        country: creditParty.country,
        port: creditParty.port
      };
    }

    // Update items if provided
    if (items) {
      if (items.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'At least one item is required'
        });
      }

      const processedItems = [];
      totalAmount = 0;

      for (const itemData of items) {
        const { itemId, quantity, rate, description } = itemData;
        
        if (!itemId || !quantity || !rate) {
          return res.status(400).json({
            success: false,
            message: 'Item ID, quantity, and rate are required for all items'
          });
        }

        const item = await Item.findById(itemId);
        if (!item) {
          return res.status(400).json({
            success: false,
            message: `Item with ID ${itemId} not found`
          });
        }

        const amount = quantity * rate;
        totalAmount += amount;

        processedItems.push({
          item: itemId,
          quantity,
          rate,
          amount,
          description: description || ''
        });
      }

      updateData.items = processedItems;
      updateData.totalAmount = totalAmount;
    }

    // Update other fields
    if (transactionDate) updateData.transactionDate = new Date(transactionDate);
    if (currency) updateData.currency = currency;
    if (brokerId !== undefined) updateData.broker = brokerId;
    if (chaId !== undefined) updateData.cha = chaId;
    if (remarks !== undefined) updateData.remarks = remarks;
    if (status) updateData.status = status;
    if (typeof isActive === 'boolean') updateData.isActive = isActive;
    if (Object.keys(additionalFields).length > 0) {
      Object.assign(updateData, additionalFields);
    }

    // Regenerate covering notes if any major fields changed
    if (items || companyId || debitPartyId || creditPartyId) {
      const company = updateData.company || existingTransaction.company;
      const debitParty = updateData.debitParty || existingTransaction.debitParty;
      const creditParty = updateData.creditParty || existingTransaction.creditParty;
      const finalItems = updateData.items || existingTransaction.items;
      const finalCurrency = updateData.currency || existingTransaction.currency;

      updateData.coveringNotes = generateCoveringNotes({
        company,
        debitParty,
        creditParty,
        items: finalItems,
        totalAmount,
        currency: finalCurrency
      });
    }

    updateData.updatedBy = req.user._id;

    // Update sales transaction
    const updatedTransaction = await SalesTransaction.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate([
      { path: 'company._id', select: 'companyName firmId gstNo' },
      { path: 'debitParty._id', select: 'partyName gstNo panNo iecNo epcgLicNo' },
      { path: 'creditParty._id', select: 'partyName country port' },
      { path: 'items.item', select: 'itemName itemHsn itemUnits' },
      { path: 'broker', select: 'brokerName' },
      { path: 'cha', select: 'chaName' },
      { path: 'createdBy', select: 'name email' },
      { path: 'updatedBy', select: 'name email' }
    ]);

    res.json({
      success: true,
      message: 'Sales transaction updated successfully',
      data: updatedTransaction.toJSON()
    });

  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid sales transaction ID'
      });
    }

    console.error('Update sales transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   DELETE /sales-transactions/:id
// @desc    Delete sales transaction
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const salesTransaction = await SalesTransaction.findById(req.params.id);

    if (!salesTransaction) {
      return res.status(404).json({
        success: false,
        message: 'Sales transaction not found'
      });
    }

    await SalesTransaction.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Sales transaction deleted successfully'
    });

  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid sales transaction ID'
      });
    }

    console.error('Delete sales transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   GET /sales-transactions/search/bill-number/:billNumber
// @desc    Search sales transaction by bill number
// @access  Private
router.get('/search/bill-number/:billNumber', auth, async (req, res) => {
  try {
    const salesTransaction = await SalesTransaction.findOne({
      transactionNumber: { $regex: req.params.billNumber, $options: 'i' }
    }).populate([
      { path: 'company._id', select: 'companyName firmId gstNo' },
      { path: 'debitParty._id', select: 'partyName gstNo panNo iecNo epcgLicNo' },
      { path: 'creditParty._id', select: 'partyName country port' },
      { path: 'items.item', select: 'itemName itemHsn itemUnits' },
      { path: 'broker', select: 'brokerName' },
      { path: 'cha', select: 'chaName' },
      { path: 'createdBy', select: 'name email' },
      { path: 'updatedBy', select: 'name email' }
    ]);

    if (!salesTransaction) {
      return res.status(404).json({
        success: false,
        message: 'Sales transaction not found'
      });
    }

    res.json({
      success: true,
      data: salesTransaction.toJSON()
    });

  } catch (error) {
    console.error('Search sales transaction by bill number error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   GET /sales-transactions/company/:companyId
// @desc    Get all sales transactions for a specific company
// @access  Private
router.get('/company/:companyId', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const salesTransactions = await SalesTransaction.find({
      'company._id': req.params.companyId
    })
      .populate([
        { path: 'company._id', select: 'companyName firmId gstNo' },
        { path: 'debitParty._id', select: 'partyName gstNo panNo iecNo epcgLicNo' },
        { path: 'creditParty._id', select: 'partyName country port' },
        { path: 'items.item', select: 'itemName itemHsn itemUnits' },
        { path: 'broker', select: 'brokerName' },
        { path: 'cha', select: 'chaName' },
        { path: 'createdBy', select: 'name email' }
      ])
      .sort({ transactionDate: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await SalesTransaction.countDocuments({
      'company._id': req.params.companyId
    });

    res.json({
      success: true,
      data: salesTransactions,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    });

  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid company ID'
      });
    }

    console.error('Get sales transactions by company error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
