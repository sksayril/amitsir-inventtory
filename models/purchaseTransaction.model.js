const mongoose = require('mongoose');

const purchaseTransactionSchema = new mongoose.Schema({
  transactionNumber: {
    type: String,
    required: [true, 'Transaction Number is required'],
    unique: true,
    trim: true,
    maxlength: [50, 'Transaction Number cannot exceed 50 characters']
  },
  transactionDate: {
    type: Date,
    required: [true, 'Transaction Date is required'],
    default: Date.now
  },
  debitParty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DebitParty',
    required: [true, 'Debit Party is required']
  },
  creditParty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CreditParty',
    required: [true, 'Credit Party is required']
  },
  items: [{
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
      required: [true, 'Item is required']
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0, 'Quantity cannot be negative']
    },
    rate: {
      type: Number,
      required: [true, 'Rate is required'],
      min: [0, 'Rate cannot be negative']
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount cannot be negative']
    }
  }],
  totalAmount: {
    type: Number,
    required: [true, 'Total Amount is required'],
    min: [0, 'Total Amount cannot be negative']
  },
  currency: {
    type: String,
    enum: ['INR', 'USD', 'EUR', 'GBP'],
    default: 'INR'
  },
  broker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Broker'
  },
  cha: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CHA'
  },
  status: {
    type: String,
    enum: ['draft', 'pending', 'approved', 'completed', 'cancelled'],
    default: 'draft'
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
purchaseTransactionSchema.index({ transactionNumber: 1 });
purchaseTransactionSchema.index({ transactionDate: 1 });
purchaseTransactionSchema.index({ debitParty: 1 });
purchaseTransactionSchema.index({ creditParty: 1 });
purchaseTransactionSchema.index({ status: 1 });
purchaseTransactionSchema.index({ createdBy: 1 });

// Static method to find by Transaction Number
purchaseTransactionSchema.statics.findByTransactionNumber = function(transactionNumber) {
  return this.findOne({ transactionNumber: transactionNumber });
};

// Static method to find by Date Range
purchaseTransactionSchema.statics.findByDateRange = function(startDate, endDate) {
  return this.find({
    transactionDate: {
      $gte: startDate,
      $lte: endDate
    }
  });
};

// Instance method to get transaction info
purchaseTransactionSchema.methods.toJSON = function() {
  const transactionObject = this.toObject();
  return transactionObject;
};

module.exports = mongoose.model('PurchaseTransaction', purchaseTransactionSchema);
