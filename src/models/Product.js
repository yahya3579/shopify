import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  // Basic Information
  title: {
    type: String,
    required: [true, 'Product title is required'],
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  
  // Media
  media: [{
    url: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['image', 'video', '3d'],
      default: 'image',
    },
    alt: {
      type: String,
      default: '',
    },
  }],
  
  // Category
  category: {
    type: String,
    default: '',
  },
  
  // Pricing
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0,
  },
  compareAtPrice: {
    type: Number,
    default: null,
  },
  costPerItem: {
    type: Number,
    default: null,
  },
  
  // Inventory
  inventoryTracked: {
    type: Boolean,
    default: false,
  },
  inventory: [{
    location: {
      type: String,
      default: 'Shop location',
    },
    quantity: {
      type: Number,
      default: 0,
      min: 0,
    },
  }],
  sku: {
    type: String,
    default: '',
  },
  barcode: {
    type: String,
    default: '',
  },
  
  // Shipping
  physicalProduct: {
    type: Boolean,
    default: false,
  },
  weight: {
    value: {
      type: Number,
      default: 0,
    },
    unit: {
      type: String,
      enum: ['lb', 'oz', 'kg', 'g'],
      default: 'kg',
    },
  },
  
  // Variants
  variants: [{
    optionName: {
      type: String,
      required: true,
    },
    optionValues: [{
      type: String,
      required: true,
    }],
  }],
  
  // Status
  status: {
    type: String,
    enum: ['Active', 'Draft'],
    default: 'Draft',
  },
  
  // Publishing
  publishingChannels: [{
    type: String,
    enum: ['Online Store', 'Point of Sale'],
  }],
  
  // Product Organization
  productType: {
    type: String,
    default: '',
  },
  vendor: {
    type: String,
    default: '',
  },
  collections: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Collection',
  }],
  tags: [{
    type: String,
  }],
  
  // Theme Template
  themeTemplate: {
    type: String,
    default: 'Default product',
  },
  
  // Gift Card specific fields
  isGiftCard: {
    type: Boolean,
    default: false,
  },
  denominations: [{
    type: Number,
    min: 0,
  }],
  giftCardTemplate: {
    type: String,
    default: 'gift_card',
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

// Indexes for better query performance
ProductSchema.index({ title: 'text', description: 'text' });
ProductSchema.index({ category: 1 });
ProductSchema.index({ status: 1 });
ProductSchema.index({ createdAt: -1 });

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);

