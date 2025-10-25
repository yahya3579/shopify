import mongoose from 'mongoose';

const GiftCardSchema = new mongoose.Schema({
  // Gift Card Details
  giftCardCode: {
    type: String,
    required: [true, 'Gift card code is required'],
    unique: true,
    trim: true,
    index: true,
  },
  
  // Value
  initialValue: {
    type: Number,
    required: [true, 'Initial value is required'],
    min: [0, 'Initial value cannot be negative'],
  },
  currentBalance: {
    type: Number,
    required: true,
    min: [0, 'Current balance cannot be negative'],
  },
  currency: {
    type: String,
    default: 'Rs',
  },
  
  // Expiration
  expirationType: {
    type: String,
    enum: ['no-expiration', 'set-expiration'],
    default: 'set-expiration',
    required: true,
  },
  expirationDate: {
    type: Date,
    default: null,
    validate: {
      validator: function(value) {
        // If expirationType is 'set-expiration', expirationDate is required
        if (this.expirationType === 'set-expiration') {
          return value != null;
        }
        return true;
      },
      message: 'Expiration date is required when expiration type is set-expiration',
    },
  },
  
  // Customer Information
  customer: {
    firstName: {
      type: String,
      default: '',
    },
    lastName: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      default: '',
    },
  },
  
  // Notes
  notes: {
    type: String,
    default: '',
    maxlength: [5000, 'Notes cannot exceed 5000 characters'],
  },
  
  // Status
  status: {
    type: String,
    enum: ['active', 'used', 'expired', 'deactivated'],
    default: 'active',
    index: true,
  },
  
  // Transaction History
  transactions: [{
    type: {
      type: String,
      enum: ['created', 'used', 'refund', 'adjustment'],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    balanceAfter: {
      type: Number,
      required: true,
    },
    orderId: {
      type: String,
      default: null,
    },
    note: {
      type: String,
      default: '',
    },
    date: {
      type: Date,
      default: Date.now,
    },
  }],
  
  // Comments
  comments: [{
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    authorName: {
      type: String,
      default: 'Staff',
    },
    text: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
  
  // Metadata
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  
  // Deactivate reason (if deactivated)
  disableReason: {
    type: String,
    default: '',
  },
  disabledAt: {
    type: Date,
    default: null,
  },
  
}, {
  timestamps: true,
});

// Indexes for better query performance
GiftCardSchema.index({ giftCardCode: 1 });
GiftCardSchema.index({ status: 1 });
GiftCardSchema.index({ 'customer.email': 1 });
GiftCardSchema.index({ createdAt: -1 });
GiftCardSchema.index({ expirationDate: 1 });

// Virtual to check if gift card is expired
GiftCardSchema.virtual('isExpired').get(function() {
  if (this.expirationType === 'no-expiration') {
    return false;
  }
  if (this.expirationDate && new Date() > this.expirationDate) {
    return true;
  }
  return false;
});

// Method to check if gift card is usable
GiftCardSchema.methods.isUsable = function() {
  if (this.status !== 'active') {
    return false;
  }
  if (this.currentBalance <= 0) {
    return false;
  }
  if (this.isExpired) {
    return false;
  }
  return true;
};

// Method to use gift card
GiftCardSchema.methods.use = function(amount, orderId = null, note = '') {
  if (!this.isUsable()) {
    throw new Error('Gift card is not usable');
  }
  if (amount > this.currentBalance) {
    throw new Error('Insufficient balance');
  }
  
  this.currentBalance -= amount;
  
  // Add transaction
  this.transactions.push({
    type: 'used',
    amount: -amount,
    balanceAfter: this.currentBalance,
    orderId: orderId,
    note: note,
  });
  
  // Update status if balance is zero
  if (this.currentBalance === 0) {
    this.status = 'used';
  }
  
  return this.save();
};

// Pre-save hook to update status based on expiration
GiftCardSchema.pre('save', function(next) {
  // Check if gift card is expired and update status
  if (this.expirationType === 'set-expiration' && 
      this.expirationDate && 
      new Date() > this.expirationDate && 
      this.status === 'active') {
    this.status = 'expired';
  }
  
  // Ensure currentBalance is set to initialValue on creation
  if (this.isNew && !this.currentBalance) {
    this.currentBalance = this.initialValue;
    
    // Add initial transaction
    this.transactions.push({
      type: 'created',
      amount: this.initialValue,
      balanceAfter: this.currentBalance,
      note: 'Gift card created',
    });
  }
  
  next();
});

export default mongoose.models.GiftCard || mongoose.model('GiftCard', GiftCardSchema);

