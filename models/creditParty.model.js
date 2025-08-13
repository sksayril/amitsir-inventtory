const mongoose = require('mongoose');

const creditPartySchema = new mongoose.Schema({
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
  country: {
    type: String,
    required: [true, 'Country is required'],
    trim: true,
    maxlength: [50, 'Country cannot exceed 50 characters']
  },
  port: {
    type: String,
    required: [true, 'Port is required'],
    trim: true,
    maxlength: [50, 'Port cannot exceed 50 characters']
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
creditPartySchema.index({ partyName: 1 });
creditPartySchema.index({ country: 1 });
creditPartySchema.index({ port: 1 });
creditPartySchema.index({ createdBy: 1 });

// Static method to find by Party Name
creditPartySchema.statics.findByPartyName = function(partyName) {
  return this.findOne({ partyName: { $regex: partyName, $options: 'i' } });
};

// Static method to find by Country
creditPartySchema.statics.findByCountry = function(country) {
  return this.find({ country: { $regex: country, $options: 'i' } });
};

// Static method to find by Port
creditPartySchema.statics.findByPort = function(port) {
  return this.find({ port: { $regex: port, $options: 'i' } });
};

// Instance method to get party info
creditPartySchema.methods.toJSON = function() {
  const partyObject = this.toObject();
  return partyObject;
};

module.exports = mongoose.model('CreditParty', creditPartySchema);
