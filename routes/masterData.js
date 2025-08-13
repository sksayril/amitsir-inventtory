const express = require('express');
const Item = require('../models/item.model');
const CreditParty = require('../models/creditParty.model');
const Broker = require('../models/broker.model');
const CHA = require('../models/cha.model');
const SalesTransaction = require('../models/salesTransaction.model');
const PurchaseTransaction = require('../models/purchaseTransaction.model');
const ReceiptTransaction = require('../models/receiptTransaction.model');
const { auth } = require('../middleware/auth');

const router = express.Router();

// ==================== ITEM MASTER ROUTES ====================

// Create Item
router.post('/items', auth, async (req, res) => {
  try {
    const {
      itemName,
      itemHsn,
      itemQty,
      itemUnits,
      itemRate,
      remarks,
      ...additionalFields
    } = req.body;

    // Check if item with same name already exists
    const existingItem = await Item.findByItemName(itemName);
    if (existingItem) {
      return res.status(400).json({
        success: false,
        message: 'Item with this name already exists'
      });
    }

    const item = new Item({
      itemName,
      itemHsn,
      itemQty,
      itemUnits,
      itemRate,
      remarks,
      createdBy: req.user._id,
      ...additionalFields
    });

    await item.save();
    await item.populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'Item created successfully',
      data: item.toJSON()
    });

  } catch (error) {
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    console.error('Create item error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get All Items
router.get('/items', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const isActive = req.query.isActive;

    const skip = (page - 1) * limit;
    const filter = {};
    
    if (search) {
      filter.$or = [
        { itemName: { $regex: search, $options: 'i' } },
        { itemHsn: { $regex: search, $options: 'i' } }
      ];
    }

    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }

    const items = await Item.find(filter)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Item.countDocuments(filter);

    res.json({
      success: true,
      data: items,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    });

  } catch (error) {
    console.error('Get items error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get Item by ID
router.get('/items/:id', auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    res.json({
      success: true,
      data: item.toJSON()
    });

  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid item ID'
      });
    }

    console.error('Get item error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update Item
router.put('/items/:id', auth, async (req, res) => {
  try {
    const {
      itemName,
      itemHsn,
      itemQty,
      itemUnits,
      itemRate,
      remarks,
      isActive,
      ...additionalFields
    } = req.body;

    const existingItem = await Item.findById(req.params.id);
    if (!existingItem) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    if (itemName && itemName !== existingItem.itemName) {
      const duplicateItem = await Item.findByItemName(itemName);
      if (duplicateItem) {
        return res.status(400).json({
          success: false,
          message: 'Item with this name already exists'
        });
      }
    }

    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      {
        itemName,
        itemHsn,
        itemQty,
        itemUnits,
        itemRate,
        remarks,
        isActive,
        updatedBy: req.user._id,
        ...additionalFields
      },
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email')
     .populate('updatedBy', 'name email');

    res.json({
      success: true,
      message: 'Item updated successfully',
      data: updatedItem.toJSON()
    });

  } catch (error) {
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    console.error('Update item error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete Item
router.delete('/items/:id', auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    await Item.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Item deleted successfully'
    });

  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid item ID'
      });
    }

    console.error('Delete item error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// ==================== CREDIT PARTY ROUTES ====================

// Create Credit Party
router.post('/credit-parties', auth, async (req, res) => {
  try {
    const {
      partyName,
      partyAddress1,
      partyAddress2,
      partyAddress3,
      pinCode,
      country,
      port,
      ...additionalFields
    } = req.body;

    const existingParty = await CreditParty.findByPartyName(partyName);
    if (existingParty) {
      return res.status(400).json({
        success: false,
        message: 'Party with this name already exists'
      });
    }

    const creditParty = new CreditParty({
      partyName,
      partyAddress1,
      partyAddress2,
      partyAddress3,
      pinCode,
      country,
      port,
      createdBy: req.user._id,
      ...additionalFields
    });

    await creditParty.save();
    await creditParty.populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'Credit party created successfully',
      data: creditParty.toJSON()
    });

  } catch (error) {
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    console.error('Create credit party error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get All Credit Parties
router.get('/credit-parties', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const isActive = req.query.isActive;

    const skip = (page - 1) * limit;
    const filter = {};
    
    if (search) {
      filter.$or = [
        { partyName: { $regex: search, $options: 'i' } },
        { country: { $regex: search, $options: 'i' } },
        { port: { $regex: search, $options: 'i' } }
      ];
    }

    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }

    const creditParties = await CreditParty.find(filter)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await CreditParty.countDocuments(filter);

    res.json({
      success: true,
      data: creditParties,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    });

  } catch (error) {
    console.error('Get credit parties error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get Credit Party by ID
router.get('/credit-parties/:id', auth, async (req, res) => {
  try {
    const creditParty = await CreditParty.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    if (!creditParty) {
      return res.status(404).json({
        success: false,
        message: 'Credit party not found'
      });
    }

    res.json({
      success: true,
      data: creditParty.toJSON()
    });

  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid credit party ID'
      });
    }

    console.error('Get credit party error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update Credit Party
router.put('/credit-parties/:id', auth, async (req, res) => {
  try {
    const {
      partyName,
      partyAddress1,
      partyAddress2,
      partyAddress3,
      pinCode,
      country,
      port,
      isActive,
      ...additionalFields
    } = req.body;

    const existingCreditParty = await CreditParty.findById(req.params.id);
    if (!existingCreditParty) {
      return res.status(404).json({
        success: false,
        message: 'Credit party not found'
      });
    }

    if (partyName && partyName !== existingCreditParty.partyName) {
      const duplicateParty = await CreditParty.findByPartyName(partyName);
      if (duplicateParty) {
        return res.status(400).json({
          success: false,
          message: 'Party with this name already exists'
        });
      }
    }

    const updatedCreditParty = await CreditParty.findByIdAndUpdate(
      req.params.id,
      {
        partyName,
        partyAddress1,
        partyAddress2,
        partyAddress3,
        pinCode,
        country,
        port,
        isActive,
        updatedBy: req.user._id,
        ...additionalFields
      },
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email')
     .populate('updatedBy', 'name email');

    res.json({
      success: true,
      message: 'Credit party updated successfully',
      data: updatedCreditParty.toJSON()
    });

  } catch (error) {
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    console.error('Update credit party error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete Credit Party
router.delete('/credit-parties/:id', auth, async (req, res) => {
  try {
    const creditParty = await CreditParty.findById(req.params.id);

    if (!creditParty) {
      return res.status(404).json({
        success: false,
        message: 'Credit party not found'
      });
    }

    await CreditParty.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Credit party deleted successfully'
    });

  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid credit party ID'
      });
    }

    console.error('Delete credit party error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// ==================== BROKER ROUTES ====================

// Create Broker
router.post('/brokers', auth, async (req, res) => {
  try {
    const {
      brokerName,
      ...additionalFields
    } = req.body;

    const existingBroker = await Broker.findByBrokerName(brokerName);
    if (existingBroker) {
      return res.status(400).json({
        success: false,
        message: 'Broker with this name already exists'
      });
    }

    const broker = new Broker({
      brokerName,
      createdBy: req.user._id,
      ...additionalFields
    });

    await broker.save();
    await broker.populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'Broker created successfully',
      data: broker.toJSON()
    });

  } catch (error) {
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    console.error('Create broker error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get All Brokers
router.get('/brokers', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const isActive = req.query.isActive;

    const skip = (page - 1) * limit;
    const filter = {};
    
    if (search) {
      filter.brokerName = { $regex: search, $options: 'i' };
    }

    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }

    const brokers = await Broker.find(filter)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Broker.countDocuments(filter);

    res.json({
      success: true,
      data: brokers,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    });

  } catch (error) {
    console.error('Get brokers error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get Broker by ID
router.get('/brokers/:id', auth, async (req, res) => {
  try {
    const broker = await Broker.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    if (!broker) {
      return res.status(404).json({
        success: false,
        message: 'Broker not found'
      });
    }

    res.json({
      success: true,
      data: broker.toJSON()
    });

  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid broker ID'
      });
    }

    console.error('Get broker error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update Broker
router.put('/brokers/:id', auth, async (req, res) => {
  try {
    const {
      brokerName,
      isActive,
      ...additionalFields
    } = req.body;

    const existingBroker = await Broker.findById(req.params.id);
    if (!existingBroker) {
      return res.status(404).json({
        success: false,
        message: 'Broker not found'
      });
    }

    if (brokerName && brokerName !== existingBroker.brokerName) {
      const duplicateBroker = await Broker.findByBrokerName(brokerName);
      if (duplicateBroker) {
        return res.status(400).json({
          success: false,
          message: 'Broker with this name already exists'
        });
      }
    }

    const updatedBroker = await Broker.findByIdAndUpdate(
      req.params.id,
      {
        brokerName,
        isActive,
        updatedBy: req.user._id,
        ...additionalFields
      },
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email')
     .populate('updatedBy', 'name email');

    res.json({
      success: true,
      message: 'Broker updated successfully',
      data: updatedBroker.toJSON()
    });

  } catch (error) {
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    console.error('Update broker error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete Broker
router.delete('/brokers/:id', auth, async (req, res) => {
  try {
    const broker = await Broker.findById(req.params.id);

    if (!broker) {
      return res.status(404).json({
        success: false,
        message: 'Broker not found'
      });
    }

    await Broker.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Broker deleted successfully'
    });

  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid broker ID'
      });
    }

    console.error('Delete broker error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// ==================== CHA ROUTES ====================

// Create CHA
router.post('/chas', auth, async (req, res) => {
  try {
    const {
      chaName,
      ...additionalFields
    } = req.body;

    const existingCHA = await CHA.findByChaName(chaName);
    if (existingCHA) {
      return res.status(400).json({
        success: false,
        message: 'CHA with this name already exists'
      });
    }

    const cha = new CHA({
      chaName,
      createdBy: req.user._id,
      ...additionalFields
    });

    await cha.save();
    await cha.populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'CHA created successfully',
      data: cha.toJSON()
    });

  } catch (error) {
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    console.error('Create CHA error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get All CHAs
router.get('/chas', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const isActive = req.query.isActive;

    const skip = (page - 1) * limit;
    const filter = {};
    
    if (search) {
      filter.chaName = { $regex: search, $options: 'i' };
    }

    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }

    const chas = await CHA.find(filter)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await CHA.countDocuments(filter);

    res.json({
      success: true,
      data: chas,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    });

  } catch (error) {
    console.error('Get CHAs error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get CHA by ID
router.get('/chas/:id', auth, async (req, res) => {
  try {
    const cha = await CHA.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    if (!cha) {
      return res.status(404).json({
        success: false,
        message: 'CHA not found'
      });
    }

    res.json({
      success: true,
      data: cha.toJSON()
    });

  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid CHA ID'
      });
    }

    console.error('Get CHA error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update CHA
router.put('/chas/:id', auth, async (req, res) => {
  try {
    const {
      chaName,
      isActive,
      ...additionalFields
    } = req.body;

    const existingCHA = await CHA.findById(req.params.id);
    if (!existingCHA) {
      return res.status(404).json({
        success: false,
        message: 'CHA not found'
      });
    }

    if (chaName && chaName !== existingCHA.chaName) {
      const duplicateCHA = await CHA.findByChaName(chaName);
      if (duplicateCHA) {
        return res.status(400).json({
          success: false,
          message: 'CHA with this name already exists'
        });
      }
    }

    const updatedCHA = await CHA.findByIdAndUpdate(
      req.params.id,
      {
        chaName,
        isActive,
        updatedBy: req.user._id,
        ...additionalFields
      },
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email')
     .populate('updatedBy', 'name email');

    res.json({
      success: true,
      message: 'CHA updated successfully',
      data: updatedCHA.toJSON()
    });

  } catch (error) {
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    console.error('Update CHA error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete CHA
router.delete('/chas/:id', auth, async (req, res) => {
  try {
    const cha = await CHA.findById(req.params.id);

    if (!cha) {
      return res.status(404).json({
        success: false,
        message: 'CHA not found'
      });
    }

    await CHA.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'CHA deleted successfully'
    });

  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid CHA ID'
      });
    }

    console.error('Delete CHA error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
