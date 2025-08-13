const mongoose = require('mongoose');

const receiptTransactionSchema = new mongoose.Schema({
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
  party: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DebitParty', // Can be either debit or credit party
    required: [true, 'Party is required']
  },
  partyType: {
    type: String,
    enum: ['debit', 'credit'],
    required: [true, 'Party Type is required']
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount cannot be negative']
  },
  currency: {
    type: String,
    enum: ['INR', 'USD', 'EUR', 'GBP'],
    default: 'INR'
  },
  paymentMode: {
    type: String,
    enum: ['cash', 'cheque', 'bank_transfer', 'online', 'card'],
    required: [true, 'Payment Mode is required']
  },
  referenceNumber: {
    type: String,
    trim: true,
    maxlength: [50, 'Reference Number cannot exceed 50 characters']
  },
  bankDetails: {
    bankName: {
      type: String,
      trim: true,
      maxlength: [100, 'Bank Name cannot exceed 100 characters']
    },
    accountNumber: {
      type: String,
      trim: true,
      maxlength: [50, 'Account Number cannot exceed 50 characters']
    },
    ifscCode: {
      type: String,
      trim: true,
      maxlength: [20, 'IFSC Code cannot exceed 20 characters']
    }
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled'],
    default: 'pending'
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
receiptTransactionSchema.index({ transactionNumber: 1 });
receiptTransactionSchema.index({ transactionDate: 1 });
receiptTransactionSchema.index({ party: 1 });
receiptTransactionSchema.index({ partyType: 1 });
receiptTransactionSchema.index({ status: 1 });
receiptTransactionSchema.index({ createdBy: 1 });

// Static method to find by Transaction Number
receiptTransactionSchema.statics.findByTransactionNumber = function(transactionNumber) {
  return this.findOne({ transactionNumber: transactionNumber });
};

// Static method to find by Date Range
receiptTransactionSchema.statics.findByDateRange = function(startDate, endDate) {
  return this.find({
    transactionDate: {
      $gte: startDate,
      $lte: endDate
    }
  });
};

// Static method to find by Party
receiptTransactionSchema.statics.findByParty = function(partyId) {
  return this.find({ party: partyId });
};

// Instance method to get transaction info
receiptTransactionSchema.methods.toJSON = function() {
  const transactionObject = this.toObject();
  return transactionObject;
};

module.exports = mongoose.model('ReceiptTransaction', receiptTransactionSchema);
