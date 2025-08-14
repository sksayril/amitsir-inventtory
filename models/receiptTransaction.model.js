const mongoose = require('mongoose');

const receiptTransactionSchema = new mongoose.Schema({
  receiptNumber: {
    type: String,
    required: [true, 'Receipt Number is required'],
    unique: true,
    trim: true,
    maxlength: [50, 'Receipt Number cannot exceed 50 characters']
  },
  receiptDate: {
    type: Date,
    required: [true, 'Receipt Date is required'],
    default: Date.now
  },
  creditParty: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CreditParty',
      required: [true, 'Credit Party is required']
    },
    partyName: {
      type: String,
      required: [true, 'Credit Party Name is required']
    },
    country: {
      type: String,
      required: [true, 'Country is required']
    },
    port: {
      type: String,
      required: [true, 'Port is required']
    }
  },
  billNumber: {
    type: String,
    required: [true, 'Bill Number is required'],
    trim: true,
    maxlength: [50, 'Bill Number cannot exceed 50 characters']
  },
  billAmount: {
    type: Number,
    required: [true, 'Bill Amount is required'],
    min: [0, 'Bill Amount cannot be negative']
  },
  receiptAmount: {
    type: Number,
    required: [true, 'Receipt Amount is required'],
    min: [0, 'Receipt Amount cannot be negative']
  },
  inrAmount: {
    type: Number,
    required: [true, 'INR Amount is required'],
    min: [0, 'INR Amount cannot be negative']
  },
  currency: {
    type: String,
    enum: ['INR', 'USD', 'EUR', 'GBP'],
    default: 'INR'
  },
  exchangeRate: {
    type: Number,
    min: [0, 'Exchange Rate cannot be negative'],
    default: 1
  },
  utrNumber: {
    type: String,
    required: [true, 'UTR Number is required'],
    trim: true,
    maxlength: [100, 'UTR Number cannot exceed 100 characters']
  },
  // Note: salesTransaction field removed since bill validation is disabled
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
receiptTransactionSchema.index({ receiptNumber: 1 });
receiptTransactionSchema.index({ receiptDate: 1 });
receiptTransactionSchema.index({ billNumber: 1 });
receiptTransactionSchema.index({ 'creditParty._id': 1 });
// Note: salesTransaction index removed since bill validation is disabled
receiptTransactionSchema.index({ utrNumber: 1 });
receiptTransactionSchema.index({ createdBy: 1 });

// Static method to find by Receipt Number
receiptTransactionSchema.statics.findByReceiptNumber = function(receiptNumber) {
  return this.findOne({ receiptNumber: receiptNumber });
};

// Static method to find by Bill Number
receiptTransactionSchema.statics.findByBillNumber = function(billNumber) {
  return this.find({ billNumber: billNumber });
};

// Static method to find by Date Range
receiptTransactionSchema.statics.findByDateRange = function(startDate, endDate) {
  return this.find({
    receiptDate: {
      $gte: startDate,
      $lte: endDate
    }
  });
};

// Static method to find by Credit Party
receiptTransactionSchema.statics.findByCreditParty = function(creditPartyId) {
  return this.find({ 'creditParty._id': creditPartyId });
};

// Static method to find pending bills
receiptTransactionSchema.statics.findPendingBills = function() {
  return this.aggregate([
    {
      $group: {
        _id: '$billNumber',
        totalReceived: { $sum: '$inrAmount' }
      }
    }
  ]);
};

// Instance method to get transaction info
receiptTransactionSchema.methods.toJSON = function() {
  const transactionObject = this.toObject();
  return transactionObject;
};

module.exports = mongoose.model('ReceiptTransaction', receiptTransactionSchema);
