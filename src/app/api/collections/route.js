import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import Collection from '../../../models/Collection';

// GET - Fetch all collections
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    let query = {};

    // Filter by status if provided
    if (status) {
      query.status = status;
    }

    // Search by title or description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const collections = await Collection.find(query)
      .populate('products', 'title media price')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Collection.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: collections,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Error fetching collections:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch collections', details: error.message },
      { status: 500 }
    );
  }
}

// POST - Create a new collection
export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();

    // Create collection
    const collection = await Collection.create(body);

    return NextResponse.json({
      success: true,
      data: collection,
      message: 'Collection created successfully',
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating collection:', error);

    if (error.name === 'ValidationError') {
      return NextResponse.json({
        success: false,
        message: error.message,
        errors: error.errors,
      }, { status: 400 });
    }

    if (error.code === 11000) {
      return NextResponse.json({
        success: false,
        message: 'Collection with this handle already exists',
      }, { status: 409 });
    }

    return NextResponse.json({
      success: false,
      message: 'Failed to create collection',
      error: error.message,
    }, { status: 500 });
  }
}

