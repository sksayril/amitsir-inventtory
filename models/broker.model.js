const mongoose = require('mongoose');

const brokerSchema = new mongoose.Schema({
  brokerName: {
    type: String,
    required: [true, 'Broker Name is required'],
    trim: true,
    maxlength: [100, 'Broker Name cannot exceed 100 characters']
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
brokerSchema.index({ brokerName: 1 });
brokerSchema.index({ createdBy: 1 });

// Static method to find by Broker Name
brokerSchema.statics.findByBrokerName = function(brokerName) {
  return this.findOne({ brokerName: { $regex: brokerName, $options: 'i' } });
};

// Instance method to get broker info
brokerSchema.methods.toJSON = function() {
  const brokerObject = this.toObject();
  return brokerObject;
};

module.exports = mongoose.model('Broker', brokerSchema);
