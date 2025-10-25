import { NextResponse } from 'next/server';
import connectDB from '../../../../../lib/mongodb';
import Inventory from '../../../../../models/Inventory';
import Product from '../../../../../models/Product';

// GET or CREATE - Get inventory for a product (create if doesn't exist)
export async function GET(request, { params }) {
  try {
    await connectDB();
    const { productId } = await params;
    
    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    // Try to find existing inventory
    let inventoryItem = await Inventory.findOne({ product: productId })
      .populate('product', 'title media sku variants');
    
    // If doesn't exist, create it
    if (!inventoryItem) {
      inventoryItem = await Inventory.create({
        product: productId,
        location: 'Shop location',
        onHand: 0,
        available: 0,
        committed: 0,
        unavailable: 0,
        incoming: 0,
        sku: product.sku || ''
      });
      
      inventoryItem = await Inventory.findById(inventoryItem._id)
        .populate('product', 'title media sku variants');
    }

    return NextResponse.json(
      { success: true, data: inventoryItem },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching/creating inventory:', error);
    return NextResponse.json(
      { success: false, error: 'Error fetching inventory', details: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update inventory for a product
export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { productId } = await params;
    const body = await request.json();
    
    // Find or create inventory item
    let inventoryItem = await Inventory.findOne({ product: productId });
    
    if (!inventoryItem) {
      // Create if doesn't exist
      const product = await Product.findById(productId);
      if (!product) {
        return NextResponse.json(
          { success: false, error: 'Product not found' },
          { status: 404 }
        );
      }

      inventoryItem = await Inventory.create({
        product: productId,
        location: 'Shop location',
        onHand: parseInt(body.onHand) || 0,
        available: parseInt(body.available) || 0,
        committed: parseInt(body.committed) || 0,
        unavailable: parseInt(body.unavailable) || 0,
        incoming: parseInt(body.incoming) || 0,
        sku: product.sku || ''
      });
    } else {
      // Update existing
      const updateData = {};
      
      if (body.onHand !== undefined) updateData.onHand = Math.max(0, parseInt(body.onHand) || 0);
      if (body.available !== undefined) updateData.available = Math.max(0, parseInt(body.available) || 0);
      if (body.committed !== undefined) updateData.committed = Math.max(0, parseInt(body.committed) || 0);
      if (body.unavailable !== undefined) updateData.unavailable = Math.max(0, parseInt(body.unavailable) || 0);
      if (body.incoming !== undefined) updateData.incoming = Math.max(0, parseInt(body.incoming) || 0);
      
      updateData.lastUpdated = new Date();

      inventoryItem = await Inventory.findByIdAndUpdate(
        inventoryItem._id,
        updateData,
        { new: true, runValidators: true }
      );
    }

    const populatedItem = await Inventory.findById(inventoryItem._id)
      .populate('product', 'title media sku variants');

    return NextResponse.json(
      { success: true, data: populatedItem, message: 'Inventory updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating inventory:', error);
    return NextResponse.json(
      { success: false, error: 'Error updating inventory', details: error.message },
      { status: 500 }
    );
  }
}

