import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import Collection from '../../../../models/Collection';

// GET - Fetch single collection by ID
export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const collection = await Collection.findById(id).populate('products', 'title media price status');

    if (!collection) {
      return NextResponse.json(
        { success: false, error: 'Collection not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: collection,
    });
  } catch (error) {
    console.error('Error fetching collection:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch collection', details: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update collection
export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();

    const collection = await Collection.findById(id);

    if (!collection) {
      return NextResponse.json(
        { success: false, error: 'Collection not found' },
        { status: 404 }
      );
    }

    // Update collection
    const updatedCollection = await Collection.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      success: true,
      data: updatedCollection,
      message: 'Collection updated successfully',
    });
  } catch (error) {
    console.error('Error updating collection:', error);

    if (error.name === 'ValidationError') {
      return NextResponse.json({
        success: false,
        message: error.message,
        errors: error.errors,
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      message: 'Failed to update collection',
      error: error.message,
    }, { status: 500 });
  }
}

// DELETE - Delete collection
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const collection = await Collection.findById(id);

    if (!collection) {
      return NextResponse.json(
        { success: false, error: 'Collection not found' },
        { status: 404 }
      );
    }

    await Collection.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: 'Collection deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting collection:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete collection', details: error.message },
      { status: 500 }
    );
  }
}

