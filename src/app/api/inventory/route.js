import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import Inventory from '../../../models/Inventory';
import Product from '../../../models/Product';

// GET - Fetch all inventory items
export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 100;
    const skip = (page - 1) * limit;
    const search = searchParams.get('search');
    const location = searchParams.get('location');

    let query = {};
    
    if (location) {
      query.location = location;
    }

    if (search) {
      query.$or = [
        { sku: { $regex: search, $options: 'i' } }
      ];
    }

    const inventoryItems = await Inventory.find(query)
      .populate('product', 'title media sku variants')
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Inventory.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: inventoryItems,
      total: total,
      page: page,
      limit: limit,
      totalPages: Math.ceil(total / limit),
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching inventory:', error);
    return NextResponse.json(
      { success: false, error: 'Error fetching inventory', details: error.message },
      { status: 500 }
    );
  }
}

// POST - Create inventory item for a product
export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    
    const { productId, location, onHand, available, committed, unavailable, incoming } = body;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    // Check if inventory already exists for this product and location
    const existingInventory = await Inventory.findOne({
      product: productId,
      location: location || 'Shop location'
    });

    if (existingInventory) {
      return NextResponse.json(
        { success: false, error: 'Inventory already exists for this product and location' },
        { status: 400 }
      );
    }

    // Create new inventory item
    const inventoryItem = await Inventory.create({
      product: productId,
      location: location || 'Shop location',
      onHand: onHand || 0,
      available: available || 0,
      committed: committed || 0,
      unavailable: unavailable || 0,
      incoming: incoming || 0,
      sku: product.sku
    });

    const populatedItem = await Inventory.findById(inventoryItem._id)
      .populate('product', 'title media sku variants');

    return NextResponse.json(
      { success: true, data: populatedItem },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating inventory:', error);
    return NextResponse.json(
      { success: false, error: 'Error creating inventory', details: error.message },
      { status: 500 }
    );
  }
}

