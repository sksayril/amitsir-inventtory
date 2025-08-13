const mongoose = require('mongoose');

const chaSchema = new mongoose.Schema({
  chaName: {
    type: String,
    required: [true, 'CHA Name is required'],
    trim: true,
    maxlength: [100, 'CHA Name cannot exceed 100 characters']
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
chaSchema.index({ chaName: 1 });
chaSchema.index({ createdBy: 1 });

// Static method to find by CHA Name
chaSchema.statics.findByChaName = function(chaName) {
  return this.findOne({ chaName: { $regex: chaName, $options: 'i' } });
};

// Instance method to get CHA info
chaSchema.methods.toJSON = function() {
  const chaObject = this.toObject();
  return chaObject;
};

module.exports = mongoose.model('CHA', chaSchema);
