const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  firmId: {
    type: String,
    required: [true, 'FIRM ID is required'],
    unique: true,
    trim: true,
    uppercase: true,
    minlength: [3, 'FIRM ID must be at least 3 characters long'],
    maxlength: [20, 'FIRM ID cannot exceed 20 characters']
  },
  firmAddress1: {
    type: String,
    required: [true, 'Firm Address 1 is required'],
    trim: true,
    maxlength: [100, 'Firm Address 1 cannot exceed 100 characters']
  },
  firmAddress2: {
    type: String,
    trim: true,
    maxlength: [100, 'Firm Address 2 cannot exceed 100 characters']
  },
  firmAddress3: {
    type: String,
    trim: true,
    maxlength: [100, 'Firm Address 3 cannot exceed 100 characters']
  },
  pinCode: {
    type: String,
    required: [true, 'PIN Code is required'],
    trim: true,
    match: [/^[1-9][0-9]{5}$/, 'Please enter a valid 6-digit PIN code']
  },
  gstNo: {
    type: String,
    required: [true, 'GST Number is required'],
    trim: true,
    uppercase: true,
    match: [/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 'Please enter a valid GST number']
  },
  panNo: {
    type: String,
    required: [true, 'PAN Number is required'],
    trim: true,
    uppercase: true,
    match: [/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Please enter a valid PAN number']
  },
  contactNo: {
    type: String,
    required: [true, 'Contact Number is required'],
    trim: true,
    match: [/^[6-9]\d{9}$/, 'Please enter a valid 10-digit contact number']
  },
  emailId: {
    type: String,
    required: [true, 'Email ID is required'],
    trim: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email address'
    ]
  },
  companyName: {
    type: String,
    required: [true, 'Company Name is required'],
    trim: true,
    maxlength: [100, 'Company Name cannot exceed 100 characters']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Index for better query performance
companySchema.index({ firmId: 1 });
companySchema.index({ gstNo: 1 });
companySchema.index({ panNo: 1 });
companySchema.index({ emailId: 1 });
companySchema.index({ createdBy: 1 });

// Static method to find by FIRM ID
companySchema.statics.findByFirmId = function(firmId) {
  return this.findOne({ firmId: firmId.toUpperCase() });
};

// Static method to find by GST Number
companySchema.statics.findByGstNo = function(gstNo) {
  return this.findOne({ gstNo: gstNo.toUpperCase() });
};

// Static method to find by PAN Number
companySchema.statics.findByPanNo = function(panNo) {
  return this.findOne({ panNo: panNo.toUpperCase() });
};

// Instance method to get company info
companySchema.methods.toJSON = function() {
  const companyObject = this.toObject();
  return companyObject;
};

module.exports = mongoose.model('Company', companySchema);
