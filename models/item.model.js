const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: [true, 'Item Name is required'],
    trim: true,
    maxlength: [100, 'Item Name cannot exceed 100 characters']
  },
  itemHsn: {
    type: String,
    required: [true, 'Item HSN is required'],
    trim: true,
    maxlength: [20, 'Item HSN cannot exceed 20 characters']
  },
  itemQty: {
    type: Number,
    required: [true, 'Item Quantity is required'],
    min: [0, 'Item Quantity cannot be negative']
  },
  itemUnits: {
    type: String,
    required: [true, 'Item Units is required'],
    trim: true,
    enum: ['mtr', 'sqm', 'kg', 'pcs', 'ltr', 'box', 'carton', 'dozen', 'pair', 'set', 'unit'],
    default: 'pcs'
  },
  itemRate: {
    inr: {
      type: Number,
      required: [true, 'Item Rate in INR is required'],
      min: [0, 'Item Rate cannot be negative']
    },
    usd: {
      type: Number,
      min: [0, 'Item Rate cannot be negative']
    }
  },
  remarks: {
    type: String,
    trim: true,
    maxlength: [500, 'Remarks cannot exceed 500 characters']
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
itemSchema.index({ itemName: 1 });
itemSchema.index({ itemHsn: 1 });
itemSchema.index({ createdBy: 1 });

// Static method to find by Item Name
itemSchema.statics.findByItemName = function(itemName) {
  return this.findOne({ itemName: { $regex: itemName, $options: 'i' } });
};

// Static method to find by HSN Code
itemSchema.statics.findByHsn = function(hsn) {
  return this.findOne({ itemHsn: hsn });
};

// Instance method to get item info
itemSchema.methods.toJSON = function() {
  const itemObject = this.toObject();
  return itemObject;
};

module.exports = mongoose.model('Item', itemSchema);
