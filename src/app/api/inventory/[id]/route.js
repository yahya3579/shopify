import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import Inventory from '../../../../models/Inventory';

// GET - Fetch single inventory item
export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    
    const inventoryItem = await Inventory.findById(id)
      .populate('product', 'title media sku variants');
    
    if (!inventoryItem) {
      return NextResponse.json(
        { success: false, error: 'Inventory item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: inventoryItem },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching inventory item:', error);
    return NextResponse.json(
      { success: false, error: 'Error fetching inventory item', details: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update inventory item
export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    
    const inventoryItem = await Inventory.findById(id);
    
    if (!inventoryItem) {
      return NextResponse.json(
        { success: false, error: 'Inventory item not found' },
        { status: 404 }
      );
    }

    // Update fields
    const updateData = {};
    
    if (body.onHand !== undefined) updateData.onHand = Math.max(0, parseInt(body.onHand) || 0);
    if (body.available !== undefined) updateData.available = Math.max(0, parseInt(body.available) || 0);
    if (body.committed !== undefined) updateData.committed = Math.max(0, parseInt(body.committed) || 0);
    if (body.unavailable !== undefined) updateData.unavailable = Math.max(0, parseInt(body.unavailable) || 0);
    if (body.incoming !== undefined) updateData.incoming = Math.max(0, parseInt(body.incoming) || 0);
    if (body.location !== undefined) updateData.location = body.location;
    
    updateData.lastUpdated = new Date();

    const updatedItem = await Inventory.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('product', 'title media sku variants');

    return NextResponse.json(
      { success: true, data: updatedItem, message: 'Inventory updated successfully' },
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

// DELETE - Delete inventory item
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    
    const inventoryItem = await Inventory.findById(id);
    
    if (!inventoryItem) {
      return NextResponse.json(
        { success: false, error: 'Inventory item not found' },
        { status: 404 }
      );
    }

    await Inventory.findByIdAndDelete(id);

    return NextResponse.json(
      { success: true, message: 'Inventory item deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting inventory:', error);
    return NextResponse.json(
      { success: false, error: 'Error deleting inventory', details: error.message },
      { status: 500 }
    );
  }
}

