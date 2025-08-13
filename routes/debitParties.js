const express = require('express');
const DebitParty = require('../models/debitParty.model');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   POST /debit-parties
// @desc    Create a new debit party
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const {
      partyName,
      partyAddress1,
      partyAddress2,
      partyAddress3,
      pinCode,
      gstNo,
      panNo,
      iecNo,
      epcgLicNo,
      epcgLicDate,
      epcgLicExpiryReminder,
      ...additionalFields
    } = req.body;

    // Check if party with same name already exists
    const existingParty = await DebitParty.findByPartyName(partyName);
    if (existingParty) {
      return res.status(400).json({
        success: false,
        message: 'Party with this name already exists'
      });
    }

    // Check if party with same GST Number already exists (if provided)
    if (gstNo) {
      const existingGstNo = await DebitParty.findByGstNo(gstNo);
      if (existingGstNo) {
        return res.status(400).json({
          success: false,
          message: 'Party with this GST Number already exists'
        });
      }
    }

    // Check if party with same PAN Number already exists (if provided)
    if (panNo) {
      const existingPanNo = await DebitParty.findByPanNo(panNo);
      if (existingPanNo) {
        return res.status(400).json({
          success: false,
          message: 'Party with this PAN Number already exists'
        });
      }
    }

    // Create new debit party
    const debitParty = new DebitParty({
      partyName,
      partyAddress1,
      partyAddress2,
      partyAddress3,
      pinCode,
      gstNo,
      panNo,
      iecNo,
      epcgLicNo,
      epcgLicDate,
      epcgLicExpiryReminder,
      createdBy: req.user._id,
      ...additionalFields // Allow additional custom fields
    });

    await debitParty.save();

    // Populate creator details
    await debitParty.populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'Debit party created successfully',
      data: debitParty.toJSON()
    });

  } catch (error) {
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      const fieldName = field.charAt(0).toUpperCase() + field.slice(1);
      return res.status(400).json({
        success: false,
        message: `Party with this ${fieldName} already exists`
      });
    }

    console.error('Create debit party error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   GET /debit-parties
// @desc    Get all debit parties (with pagination and filtering)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const isActive = req.query.isActive;

    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};
    
    if (search) {
      filter.$or = [
        { partyName: { $regex: search, $options: 'i' } },
        { gstNo: { $regex: search, $options: 'i' } },
        { panNo: { $regex: search, $options: 'i' } },
        { iecNo: { $regex: search, $options: 'i' } }
      ];
    }

    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }

    // Get debit parties with pagination
    const debitParties = await DebitParty.find(filter)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await DebitParty.countDocuments(filter);

    res.json({
      success: true,
      data: debitParties,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    });

  } catch (error) {
    console.error('Get debit parties error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   GET /debit-parties/:id
// @desc    Get debit party by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const debitParty = await DebitParty.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    if (!debitParty) {
      return res.status(404).json({
        success: false,
        message: 'Debit party not found'
      });
    }

    res.json({
      success: true,
      data: debitParty.toJSON()
    });

  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid debit party ID'
      });
    }

    console.error('Get debit party error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   PUT /debit-parties/:id
// @desc    Update debit party
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const {
      partyName,
      partyAddress1,
      partyAddress2,
      partyAddress3,
      pinCode,
      gstNo,
      panNo,
      iecNo,
      epcgLicNo,
      epcgLicDate,
      epcgLicExpiryReminder,
      isActive,
      ...additionalFields
    } = req.body;

    // Check if debit party exists
    const existingDebitParty = await DebitParty.findById(req.params.id);
    if (!existingDebitParty) {
      return res.status(404).json({
        success: false,
        message: 'Debit party not found'
      });
    }

    // Check for duplicate party name (if changed)
    if (partyName && partyName !== existingDebitParty.partyName) {
      const duplicateParty = await DebitParty.findByPartyName(partyName);
      if (duplicateParty) {
        return res.status(400).json({
          success: false,
          message: 'Party with this name already exists'
        });
      }
    }

    // Check for duplicate GST Number (if changed)
    if (gstNo && gstNo !== existingDebitParty.gstNo) {
      const duplicateGstNo = await DebitParty.findByGstNo(gstNo);
      if (duplicateGstNo) {
        return res.status(400).json({
          success: false,
          message: 'Party with this GST Number already exists'
        });
      }
    }

    // Check for duplicate PAN Number (if changed)
    if (panNo && panNo !== existingDebitParty.panNo) {
      const duplicatePanNo = await DebitParty.findByPanNo(panNo);
      if (duplicatePanNo) {
        return res.status(400).json({
          success: false,
          message: 'Party with this PAN Number already exists'
        });
      }
    }

    // Update debit party
    const updatedDebitParty = await DebitParty.findByIdAndUpdate(
      req.params.id,
      {
        partyName,
        partyAddress1,
        partyAddress2,
        partyAddress3,
        pinCode,
        gstNo,
        panNo,
        iecNo,
        epcgLicNo,
        epcgLicDate,
        epcgLicExpiryReminder,
        isActive,
        updatedBy: req.user._id,
        ...additionalFields // Allow additional custom fields
      },
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email')
     .populate('updatedBy', 'name email');

    res.json({
      success: true,
      message: 'Debit party updated successfully',
      data: updatedDebitParty.toJSON()
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

    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      const fieldName = field.charAt(0).toUpperCase() + field.slice(1);
      return res.status(400).json({
        success: false,
        message: `Party with this ${fieldName} already exists`
      });
    }

    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid debit party ID'
      });
    }

    console.error('Update debit party error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   DELETE /debit-parties/:id
// @desc    Delete debit party
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const debitParty = await DebitParty.findById(req.params.id);

    if (!debitParty) {
      return res.status(404).json({
        success: false,
        message: 'Debit party not found'
      });
    }

    await DebitParty.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Debit party deleted successfully'
    });

  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid debit party ID'
      });
    }

    console.error('Delete debit party error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   GET /debit-parties/search/name/:partyName
// @desc    Search debit party by name
// @access  Private
router.get('/search/name/:partyName', auth, async (req, res) => {
  try {
    const debitParties = await DebitParty.find({
      partyName: { $regex: req.params.partyName, $options: 'i' }
    })
    .populate('createdBy', 'name email')
    .populate('updatedBy', 'name email');

    res.json({
      success: true,
      data: debitParties
    });

  } catch (error) {
    console.error('Search debit party by name error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   GET /debit-parties/search/gst/:gstNo
// @desc    Search debit party by GST Number
// @access  Private
router.get('/search/gst/:gstNo', auth, async (req, res) => {
  try {
    const debitParty = await DebitParty.findByGstNo(req.params.gstNo)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    if (!debitParty) {
      return res.status(404).json({
        success: false,
        message: 'Debit party not found'
      });
    }

    res.json({
      success: true,
      data: debitParty.toJSON()
    });

  } catch (error) {
    console.error('Search debit party by GST error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
