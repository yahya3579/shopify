import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import Product from '../../../../models/Product';

// GET - Search products for collection
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const limit = parseInt(searchParams.get('limit')) || 4;
    const sortBy = searchParams.get('sortBy') || 'CREATED_DESC';

    let query = { status: 'Active' };

    // Search by title if search query provided
    if (search.trim()) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    // Determine sort order
    let sortOptions = {};
    switch (sortBy) {
      case 'ALPHA_ASC':
        sortOptions = { title: 1 };
        break;
      case 'ALPHA_DESC':
        sortOptions = { title: -1 };
        break;
      case 'PRICE_ASC':
        sortOptions = { price: 1 };
        break;
      case 'PRICE_DESC':
        sortOptions = { price: -1 };
        break;
      case 'CREATED':
        sortOptions = { createdAt: 1 };
        break;
      case 'CREATED_DESC':
      case 'BEST_SELLING':
      default:
        sortOptions = { createdAt: -1 };
        break;
    }

    const products = await Product.find(query)
      .select('title media price status sku')
      .sort(sortOptions)
      .limit(limit);

    return NextResponse.json({
      success: true,
      data: products,
      total: products.length,
    });
  } catch (error) {
    console.error('Error searching products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to search products', details: error.message },
      { status: 500 }
    );
  }
}

