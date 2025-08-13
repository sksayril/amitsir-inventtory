const express = require('express');
const Company = require('../models/company.model');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   POST /companies
// @desc    Create a new company
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const {
      firmId,
      companyName,
      firmAddress1,
      firmAddress2,
      firmAddress3,
      pinCode,
      gstNo,
      panNo,
      contactNo,
      emailId
    } = req.body;

    // Check if company with same FIRM ID already exists
    const existingFirmId = await Company.findByFirmId(firmId);
    if (existingFirmId) {
      return res.status(400).json({
        success: false,
        message: 'Company with this FIRM ID already exists'
      });
    }

    // Check if company with same GST Number already exists
    const existingGstNo = await Company.findByGstNo(gstNo);
    if (existingGstNo) {
      return res.status(400).json({
        success: false,
        message: 'Company with this GST Number already exists'
      });
    }

    // Check if company with same PAN Number already exists
    const existingPanNo = await Company.findByPanNo(panNo);
    if (existingPanNo) {
      return res.status(400).json({
        success: false,
        message: 'Company with this PAN Number already exists'
      });
    }

    // Check if company with same email already exists
    const existingEmail = await Company.findOne({ emailId: emailId.toLowerCase() });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: 'Company with this Email ID already exists'
      });
    }

    // Create new company
    const company = new Company({
      firmId,
      companyName,
      firmAddress1,
      firmAddress2,
      firmAddress3,
      pinCode,
      gstNo,
      panNo,
      contactNo,
      emailId,
      createdBy: req.user._id
    });

    await company.save();

    // Populate creator details
    await company.populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'Company created successfully',
      data: company.toJSON()
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
        message: `Company with this ${fieldName} already exists`
      });
    }

    console.error('Create company error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   GET /companies
// @desc    Get all companies (with pagination and filtering)
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
        { firmId: { $regex: search, $options: 'i' } },
        { companyName: { $regex: search, $options: 'i' } },
        { gstNo: { $regex: search, $options: 'i' } },
        { panNo: { $regex: search, $options: 'i' } },
        { emailId: { $regex: search, $options: 'i' } }
      ];
    }

    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }

    // Get companies with pagination
    const companies = await Company.find(filter)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await Company.countDocuments(filter);

    res.json({
      success: true,
      data: companies,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    });

  } catch (error) {
    console.error('Get companies error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   GET /companies/:id
// @desc    Get company by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const company = await Company.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    res.json({
      success: true,
      data: company.toJSON()
    });

  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid company ID'
      });
    }

    console.error('Get company error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   PUT /companies/:id
// @desc    Update company
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const {
      firmId,
      companyName,
      firmAddress1,
      firmAddress2,
      firmAddress3,
      pinCode,
      gstNo,
      panNo,
      contactNo,
      emailId,
      isActive
    } = req.body;

    // Check if company exists
    const existingCompany = await Company.findById(req.params.id);
    if (!existingCompany) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    // Check for duplicate FIRM ID (if changed)
    if (firmId && firmId !== existingCompany.firmId) {
      const duplicateFirmId = await Company.findByFirmId(firmId);
      if (duplicateFirmId) {
        return res.status(400).json({
          success: false,
          message: 'Company with this FIRM ID already exists'
        });
      }
    }

    // Check for duplicate GST Number (if changed)
    if (gstNo && gstNo !== existingCompany.gstNo) {
      const duplicateGstNo = await Company.findByGstNo(gstNo);
      if (duplicateGstNo) {
        return res.status(400).json({
          success: false,
          message: 'Company with this GST Number already exists'
        });
      }
    }

    // Check for duplicate PAN Number (if changed)
    if (panNo && panNo !== existingCompany.panNo) {
      const duplicatePanNo = await Company.findByPanNo(panNo);
      if (duplicatePanNo) {
        return res.status(400).json({
          success: false,
          message: 'Company with this PAN Number already exists'
        });
      }
    }

    // Check for duplicate Email ID (if changed)
    if (emailId && emailId !== existingCompany.emailId) {
      const duplicateEmail = await Company.findOne({ emailId: emailId.toLowerCase() });
      if (duplicateEmail) {
        return res.status(400).json({
          success: false,
          message: 'Company with this Email ID already exists'
        });
      }
    }

    // Update company
    const updatedCompany = await Company.findByIdAndUpdate(
      req.params.id,
      {
        firmId,
        companyName,
        firmAddress1,
        firmAddress2,
        firmAddress3,
        pinCode,
        gstNo,
        panNo,
        contactNo,
        emailId,
        isActive,
        updatedBy: req.user._id
      },
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email')
     .populate('updatedBy', 'name email');

    res.json({
      success: true,
      message: 'Company updated successfully',
      data: updatedCompany.toJSON()
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
        message: `Company with this ${fieldName} already exists`
      });
    }

    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid company ID'
      });
    }

    console.error('Update company error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   DELETE /companies/:id
// @desc    Delete company
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    await Company.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Company deleted successfully'
    });

  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid company ID'
      });
    }

    console.error('Delete company error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   GET /companies/search/firm-id/:firmId
// @desc    Search company by FIRM ID
// @access  Private
router.get('/search/firm-id/:firmId', auth, async (req, res) => {
  try {
    const company = await Company.findByFirmId(req.params.firmId)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    res.json({
      success: true,
      data: company.toJSON()
    });

  } catch (error) {
    console.error('Search company by FIRM ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   GET /companies/search/gst/:gstNo
// @desc    Search company by GST Number
// @access  Private
router.get('/search/gst/:gstNo', auth, async (req, res) => {
  try {
    const company = await Company.findByGstNo(req.params.gstNo)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    res.json({
      success: true,
      data: company.toJSON()
    });

  } catch (error) {
    console.error('Search company by GST error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
