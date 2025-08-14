const express = require('express');
const ReceiptTransaction = require('../models/receiptTransaction.model');
// Note: SalesTransaction import removed since bill validation is disabled
const CreditParty = require('../models/creditParty.model');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Helper function to convert USD to INR
const convertUSDToINR = (usdAmount, exchangeRate) => {
  return usdAmount * exchangeRate;
};

// Helper function to generate receipt number
const generateReceiptNumber = async () => {
  try {
    const latestReceipt = await ReceiptTransaction.findOne()
      .sort({ receiptNumber: -1 });
    
    let sequenceNumber = 1;
    if (latestReceipt) {
      const match = latestReceipt.receiptNumber.match(/\d+$/);
      if (match) {
        sequenceNumber = parseInt(match[0]) + 1;
      }
    }
    
    return `RCP${sequenceNumber.toString().padStart(6, '0')}`;
  } catch (error) {
    console.error('Error generating receipt number:', error);
    throw new Error('Failed to generate receipt number');
  }
};

// @route   POST /receipt-transactions
// @desc    Create a new receipt transaction
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const {
      receiptDate,
      creditPartyId,
      billNumber,
      billAmount,
      receiptAmount,
      currency,
      exchangeRate,
      utrNumber,
      remarks,
      ...additionalFields
    } = req.body;

    // Validate required fields
    if (!receiptDate || !creditPartyId || !billNumber || !receiptAmount || !currency) {
      return res.status(400).json({
        success: false,
        message: 'Receipt date, credit party, bill number, receipt amount, and currency are required'
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

    // Note: Bill number validation removed - users can pass any bill number

    // Calculate INR amount if currency is USD
    let inrAmount = receiptAmount;
    if (currency === 'USD' && exchangeRate) {
      inrAmount = convertUSDToINR(receiptAmount, exchangeRate);
    }

    // Generate receipt number
    const receiptNumber = await generateReceiptNumber();

    // Create receipt transaction
    const receiptTransaction = new ReceiptTransaction({
      receiptNumber,
      receiptDate: new Date(receiptDate),
      creditParty: {
        _id: creditParty._id,
        partyName: creditParty.partyName,
        country: creditParty.country,
        port: creditParty.port
      },
      billNumber,
      billAmount,
      receiptAmount,
      inrAmount,
      currency,
      exchangeRate: exchangeRate || 1,
      utrNumber,
      remarks,
             // Note: salesTransaction reference removed since bill validation is disabled
      createdBy: req.user._id,
      ...additionalFields
    });

    await receiptTransaction.save();

         // Populate references
     await receiptTransaction.populate([
       { path: 'creditParty._id', select: 'partyName country port' },
       { path: 'createdBy', select: 'name email' }
     ]);

    res.status(201).json({
      success: true,
      message: 'Receipt transaction created successfully',
      data: receiptTransaction.toJSON()
    });

  } catch (error) {
    console.error('Create receipt transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   GET /receipt-transactions
// @desc    Get all receipt transactions with pagination and filtering
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const creditPartyId = req.query.creditPartyId;
    const billNumber = req.query.billNumber;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const currency = req.query.currency;
    const isActive = req.query.isActive;

    const skip = (page - 1) * limit;
    const filter = {};

    // Build filter object
    if (search) {
      filter.$or = [
        { receiptNumber: { $regex: search, $options: 'i' } },
        { billNumber: { $regex: search, $options: 'i' } },
        { utrNumber: { $regex: search, $options: 'i' } },
        { 'creditParty.partyName': { $regex: search, $options: 'i' } }
      ];
    }

    if (creditPartyId) filter['creditParty._id'] = creditPartyId;
    if (billNumber) filter.billNumber = billNumber;
    if (currency) filter.currency = currency;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    // Date range filter
    if (startDate || endDate) {
      filter.receiptDate = {};
      if (startDate) filter.receiptDate.$gte = new Date(startDate);
      if (endDate) filter.receiptDate.$lte = new Date(endDate);
    }

    // Get receipt transactions with pagination
    const receiptTransactions = await ReceiptTransaction.find(filter)
      .populate([
        { path: 'creditParty._id', select: 'partyName country port' },
        { path: 'createdBy', select: 'name email' },
        { path: 'updatedBy', select: 'name email' }
      ])
      .sort({ receiptDate: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await ReceiptTransaction.countDocuments(filter);

    res.json({
      success: true,
      data: receiptTransactions,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    });

  } catch (error) {
    console.error('Get receipt transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   GET /receipt-transactions/:id
// @desc    Get receipt transaction by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const receiptTransaction = await ReceiptTransaction.findById(req.params.id)
      .populate([
        { path: 'creditParty._id', select: 'partyName country port' },
        { path: 'createdBy', select: 'name email' },
        { path: 'updatedBy', select: 'name email' }
      ]);

    if (!receiptTransaction) {
      return res.status(404).json({
        success: false,
        message: 'Receipt transaction not found'
      });
    }

    res.json({
      success: true,
      data: receiptTransaction.toJSON()
    });

  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid receipt transaction ID'
      });
    }

    console.error('Get receipt transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   PUT /receipt-transactions/:id
// @desc    Update receipt transaction
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const {
      receiptDate,
      creditPartyId,
      billNumber,
      billAmount,
      receiptAmount,
      currency,
      exchangeRate,
      utrNumber,
      remarks,
      isActive,
      ...additionalFields
    } = req.body;

    // Check if receipt transaction exists
    const existingReceipt = await ReceiptTransaction.findById(req.params.id);
    if (!existingReceipt) {
      return res.status(404).json({
        success: false,
        message: 'Receipt transaction not found'
      });
    }

    let updateData = {};

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

         // Update bill number if provided (no validation)
     if (billNumber) {
       updateData.billNumber = billNumber;
       // Note: salesTransaction reference removed since bill validation is disabled
     }

    // Update amounts if provided
    if (receiptAmount !== undefined) {
      updateData.receiptAmount = receiptAmount;
      
      // Recalculate INR amount if currency is USD
      if (currency === 'USD' && exchangeRate) {
        updateData.inrAmount = convertUSDToINR(receiptAmount, exchangeRate);
      }
    }

    // Update other fields
    if (receiptDate) updateData.receiptDate = new Date(receiptDate);
    if (billAmount !== undefined) updateData.billAmount = billAmount;
    if (currency) updateData.currency = currency;
    if (exchangeRate !== undefined) updateData.exchangeRate = exchangeRate;
    if (utrNumber !== undefined) updateData.utrNumber = utrNumber;
    if (remarks !== undefined) updateData.remarks = remarks;
    if (typeof isActive === 'boolean') updateData.isActive = isActive;
    if (Object.keys(additionalFields).length > 0) {
      Object.assign(updateData, additionalFields);
    }

    updateData.updatedBy = req.user._id;

    // Update receipt transaction
    const updatedReceipt = await ReceiptTransaction.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate([
      { path: 'creditParty._id', select: 'partyName country port' },
      { path: 'createdBy', select: 'name email' },
      { path: 'updatedBy', select: 'name email' }
    ]);

    res.json({
      success: true,
      message: 'Receipt transaction updated successfully',
      data: updatedReceipt.toJSON()
    });

  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid receipt transaction ID'
      });
    }

    console.error('Update receipt transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   DELETE /receipt-transactions/:id
// @desc    Delete receipt transaction
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const receiptTransaction = await ReceiptTransaction.findById(req.params.id);

    if (!receiptTransaction) {
      return res.status(404).json({
        success: false,
        message: 'Receipt transaction not found'
      });
    }

    await ReceiptTransaction.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Receipt transaction deleted successfully'
    });

  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid receipt transaction ID'
      });
    }

    console.error('Delete receipt transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   GET /receipt-transactions/search/bill-number/:billNumber
// @desc    Search receipt transactions by bill number
// @access  Private
router.get('/search/bill-number/:billNumber', auth, async (req, res) => {
  try {
    const receiptTransactions = await ReceiptTransaction.find({
      billNumber: { $regex: req.params.billNumber, $options: 'i' }
    }).populate([
      { path: 'creditParty._id', select: 'partyName country port' },
      { path: 'createdBy', select: 'name email' }
    ]);

    res.json({
      success: true,
      data: receiptTransactions
    });

  } catch (error) {
    console.error('Search receipt transactions by bill number error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   GET /receipt-transactions/credit-party/:creditPartyId
// @desc    Get all receipt transactions for a specific credit party
// @access  Private
router.get('/credit-party/:creditPartyId', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const receiptTransactions = await ReceiptTransaction.find({
      'creditParty._id': req.params.creditPartyId
    })
      .populate([
        { path: 'creditParty._id', select: 'partyName country port' },
        { path: 'createdBy', select: 'name email' }
      ])
      .sort({ receiptDate: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await ReceiptTransaction.countDocuments({
      'creditParty._id': req.params.creditPartyId
    });

    res.json({
      success: true,
      data: receiptTransactions,
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
        message: 'Invalid credit party ID'
      });
    }

    console.error('Get receipt transactions by credit party error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   GET /receipt-transactions/bill-adjustment/:billNumber
// @desc    Get bill adjustment summary for pending and received payments
// @access  Private
router.get('/bill-adjustment/:billNumber', auth, async (req, res) => {
  try {
    // Find all receipt transactions for this bill
    const receiptTransactions = await ReceiptTransaction.find({
      billNumber: req.params.billNumber
    }).sort({ receiptDate: 1 });

    if (receiptTransactions.length === 0) {
      return res.json({
        success: true,
        data: {
          billNumber: req.params.billNumber,
          billDetails: {
            company: 'Not specified',
            debitParty: 'Not specified',
            creditParty: 'Not specified',
            billDate: 'Not specified',
            totalAmount: 0,
            currency: 'Not specified'
          },
          paymentSummary: {
            totalBillAmount: 0,
            totalReceivedAmount: 0,
            pendingAmount: 0,
            isFullyPaid: true,
            paymentStatus: 'No Receipts'
          },
          currencyBreakdown: {},
          receiptTransactions: []
        }
      });
    }

    // Calculate totals from receipt data only
    const totalReceivedAmount = receiptTransactions.reduce((sum, receipt) => {
      return sum + (receipt.currency === 'USD' ? receipt.inrAmount : receipt.receiptAmount);
    }, 0);

    // Group receipts by currency
    const receiptsByCurrency = {};
    receiptTransactions.forEach(receipt => {
      if (!receiptsByCurrency[receipt.currency]) {
        receiptsByCurrency[receipt.currency] = [];
      }
      receiptsByCurrency[receipt.currency].push(receipt);
    });

    // Calculate currency-wise totals
    const currencyTotals = {};
    Object.keys(receiptsByCurrency).forEach(currency => {
      currencyTotals[currency] = receiptsByCurrency[currency].reduce((sum, receipt) => {
        return sum + receipt.receiptAmount;
      }, 0);
    });

    res.json({
      success: true,
      data: {
        billNumber: req.params.billNumber,
        billDetails: {
          company: 'Not specified (bill validation disabled)',
          debitParty: 'Not specified (bill validation disabled)',
          creditParty: 'Not specified (bill validation disabled)',
          billDate: 'Not specified (bill validation disabled)',
          totalAmount: 'Not specified (bill validation disabled)',
          currency: 'Not specified (bill validation disabled)'
        },
        paymentSummary: {
          totalBillAmount: 'Not specified (bill validation disabled)',
          totalReceivedAmount,
          pendingAmount: 'Not specified (bill validation disabled)',
          isFullyPaid: 'Not specified (bill validation disabled)',
          paymentStatus: 'Receipts Only (No Bill Validation)'
        },
        currencyBreakdown: currencyTotals,
        receiptTransactions: receiptTransactions.map(receipt => ({
          receiptNumber: receipt.receiptNumber,
          receiptDate: receipt.receiptDate,
          amount: receipt.receiptAmount,
          currency: receipt.currency,
          inrAmount: receipt.inrAmount,
          utrNumber: receipt.utrNumber,
          remarks: receipt.remarks
        }))
      }
    });

  } catch (error) {
    console.error('Get bill adjustment error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   GET /receipt-transactions/pending-bills
// @desc    Get all pending bills with payment status (based on receipt data only)
// @access  Private
router.get('/pending-bills', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const creditPartyId = req.query.creditPartyId;

    const filter = {};
    if (creditPartyId) filter['creditParty._id'] = creditPartyId;

    // Get all receipt transactions grouped by bill number
    const allReceipts = await ReceiptTransaction.find(filter)
      .sort({ receiptDate: -1 });

    // Group receipts by bill number
    const billsByNumber = {};
    allReceipts.forEach(receipt => {
      if (!billsByNumber[receipt.billNumber]) {
        billsByNumber[receipt.billNumber] = [];
      }
      billsByNumber[receipt.billNumber].push(receipt);
    });

    // Convert to array and calculate payment status
    const billsWithPaymentStatus = Object.keys(billsByNumber).map(billNumber => {
      const receipts = billsByNumber[billNumber];
      const totalReceived = receipts.reduce((sum, receipt) => {
        return sum + (receipt.currency === 'USD' ? receipt.inrAmount : receipt.receiptAmount);
      }, 0);

      // Since we don't have bill amounts, we can't determine if fully paid
      // We'll show all bills with receipts as "Receipts Only"
      return {
        billNumber: billNumber,
        billDate: receipts[0]?.receiptDate || 'Not specified',
        company: 'Not specified (bill validation disabled)',
        debitParty: 'Not specified (bill validation disabled)',
        creditParty: receipts[0]?.creditParty?.partyName || 'Not specified',
        totalAmount: 'Not specified (bill validation disabled)',
        currency: 'Mixed (from receipts)',
        totalReceived: totalReceived,
        pendingAmount: 'Not specified (bill validation disabled)',
        paymentStatus: 'Receipts Only (No Bill Validation)',
        lastReceiptDate: receipts.length > 0 ? Math.max(...receipts.map(r => r.receiptDate)) : null
      };
    });

    // Apply pagination
    const total = billsWithPaymentStatus.length;
    const paginatedBills = billsWithPaymentStatus.slice(skip, skip + limit);

    res.json({
      success: true,
      data: paginatedBills,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    });

  } catch (error) {
    console.error('Get pending bills error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
