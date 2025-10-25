import mongoose from 'mongoose';

const { Schema } = mongoose;

const inventoryItemSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
    index: true
  },
  location: {
    type: String,
    default: 'Shop location',
    required: true
  },
  // Available: quantity that can be sold
  available: {
    type: Number,
    default: 0,
    min: 0
  },
  // On hand: physical inventory count
  onHand: {
    type: Number,
    default: 0,
    min: 0
  },
  // Committed: quantity reserved for orders
  committed: {
    type: Number,
    default: 0,
    min: 0
  },
  // Unavailable: damaged, returned, or otherwise unavailable
  unavailable: {
    type: Number,
    default: 0,
    min: 0
  },
  // Incoming: quantity expected from suppliers
  incoming: {
    type: Number,
    default: 0,
    min: 0
  },
  // SKU for quick lookup
  sku: {
    type: String,
    index: true
  },
  // Variant information if applicable
  variant: {
    optionName: String,
    optionValue: String
  },
  // Audit trail
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, { 
  timestamps: true 
});

// Compound index for efficient queries
inventoryItemSchema.index({ product: 1, location: 1 });

// Virtual for calculating total inventory
inventoryItemSchema.virtual('total').get(function() {
  return this.onHand;
});

// Pre-save hook to validate inventory logic
inventoryItemSchema.pre('save', function(next) {
  // Available should not exceed on hand minus committed
  const maxAvailable = this.onHand - this.committed;
  if (this.available > maxAvailable) {
    this.available = Math.max(0, maxAvailable);
  }
  
  this.lastUpdated = new Date();
  next();
});

const Inventory = mongoose.models.Inventory || mongoose.model('Inventory', inventoryItemSchema);

export default Inventory;

