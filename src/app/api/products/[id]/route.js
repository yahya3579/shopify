import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import Product from '../../../../models/Product';

// GET single product by ID
export async function GET(request, { params }) {
  try {
    // Connect to database
    await connectDB();

    const { id } = params;

    // Find product by ID
    const product = await Product.findById(id).populate('collections', 'name');

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        product,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Error fetching product', details: error.message },
      { status: 500 }
    );
  }
}

