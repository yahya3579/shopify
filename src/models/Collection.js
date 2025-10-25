import mongoose from 'mongoose';

const CollectionSchema = new mongoose.Schema({
  // Basic Information
  title: {
    type: String,
    required: [true, 'Collection title is required'],
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  
  // Handle/Slug for URL
  handle: {
    type: String,
    unique: true,
    trim: true,
    lowercase: true,
  },
  
  // Collection Type
  collectionType: {
    type: String,
    enum: ['manual', 'smart'],
    default: 'manual',
  },
  
  // Conditions for smart collections
  conditions: [{
    field: {
      type: String,
      enum: ['title', 'type', 'vendor', 'tag', 'price', 'weight', 'inventory'],
    },
    operator: {
      type: String,
      enum: ['equals', 'contains', 'starts_with', 'ends_with', 'greater_than', 'less_than'],
    },
    value: {
      type: String,
    },
  }],
  
  // Manual products (for manual collections)
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  }],
  
  // Sort order for products
  sortBy: {
    type: String,
    enum: ['BEST_SELLING', 'ALPHA_ASC', 'ALPHA_DESC', 'PRICE_DESC', 'PRICE_ASC', 'CREATED_DESC', 'CREATED', 'MANUAL'],
    default: 'BEST_SELLING',
  },
  
  // Image
  image: {
    url: {
      type: String,
      default: '',
    },
    alt: {
      type: String,
      default: '',
    },
  },
  
  // Theme template
  themeTemplate: {
    type: String,
    default: 'Default collection',
  },
  
  // Status
  status: {
    type: String,
    enum: ['Active', 'Draft'],
    default: 'Draft',
  },
  
  // Metadata
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

// Indexes
CollectionSchema.index({ title: 'text', description: 'text' });
CollectionSchema.index({ handle: 1 });
CollectionSchema.index({ status: 1 });
CollectionSchema.index({ createdAt: -1 });

// Generate handle from title before saving
CollectionSchema.pre('save', function(next) {
  if (this.isModified('title') && !this.handle) {
    this.handle = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }
  next();
});

export default mongoose.models.Collection || mongoose.model('Collection', CollectionSchema);

