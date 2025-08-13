const mongoose = require('mongoose');

const debitPartySchema = new mongoose.Schema({
  partyName: {
    type: String,
    required: [true, 'Party Name is required'],
    trim: true,
    maxlength: [100, 'Party Name cannot exceed 100 characters']
  },
  partyAddress1: {
    type: String,
    required: [true, 'Party Address 1 is required'],
    trim: true,
    maxlength: [100, 'Party Address 1 cannot exceed 100 characters']
  },
  partyAddress2: {
    type: String,
    trim: true,
    maxlength: [100, 'Party Address 2 cannot exceed 100 characters']
  },
  partyAddress3: {
    type: String,
    trim: true,
    maxlength: [100, 'Party Address 3 cannot exceed 100 characters']
  },
  pinCode: {
    type: String,
    required: [true, 'PIN Code is required'],
    trim: true,
    match: [/^[1-9][0-9]{5}$/, 'Please enter a valid 6-digit PIN code']
  },
  gstNo: {
    type: String,
    trim: true,
    uppercase: true,
    match: [/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 'Please enter a valid GST number']
  },
  panNo: {
    type: String,
    trim: true,
    uppercase: true,
    match: [/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Please enter a valid PAN number']
  },
  iecNo: {
    type: String,
    trim: true,
    uppercase: true,
    maxlength: [20, 'IEC Number cannot exceed 20 characters']
  },
  epcgLicNo: {
    lic1: {
      type: String,
      trim: true,
      maxlength: [50, 'License 1 cannot exceed 50 characters']
    },
    lic2: {
      type: String,
      trim: true,
      maxlength: [50, 'License 2 cannot exceed 50 characters']
    },
    lic3: {
      type: String,
      trim: true,
      maxlength: [50, 'License 3 cannot exceed 50 characters']
    }
  },
  epcgLicDate: {
    type: Date
  },
  epcgLicExpiryReminder: {
    type: Date
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
  timestamps: true,
  strict: false // Allow additional fields
});

// Index for better query performance
debitPartySchema.index({ partyName: 1 });
debitPartySchema.index({ gstNo: 1 });
debitPartySchema.index({ panNo: 1 });
debitPartySchema.index({ iecNo: 1 });
debitPartySchema.index({ createdBy: 1 });

// Static method to find by Party Name
debitPartySchema.statics.findByPartyName = function(partyName) {
  return this.findOne({ partyName: { $regex: partyName, $options: 'i' } });
};

// Static method to find by GST Number
debitPartySchema.statics.findByGstNo = function(gstNo) {
  return this.findOne({ gstNo: gstNo.toUpperCase() });
};

// Static method to find by PAN Number
debitPartySchema.statics.findByPanNo = function(panNo) {
  return this.findOne({ panNo: panNo.toUpperCase() });
};

// Instance method to get party info
debitPartySchema.methods.toJSON = function() {
  const partyObject = this.toObject();
  return partyObject;
};

module.exports = mongoose.model('DebitParty', debitPartySchema);
