import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import Product from '../../../../models/Product';

export async function POST(request) {
  try {
    // Connect to database
    await connectDB();

    // Get session for user authentication (if using NextAuth)
    // const session = await getServerSession();
    // if (!session) {
    //   return NextResponse.json(
    //     { error: 'Unauthorized' },
    //     { status: 401 }
    //   );
    // }

    // Parse request body
    const body = await request.json();

    // Validate required fields
    if (!body.title) {
      return NextResponse.json(
        { error: 'Product title is required' },
        { status: 400 }
      );
    }

    if (!body.price || body.price < 0) {
      return NextResponse.json(
        { error: 'Valid price is required' },
        { status: 400 }
      );
    }

    // Prepare product data
    const productData = {
      title: body.title,
      description: body.description || '',
      media: body.media || [],
      category: body.category || '',
      price: parseFloat(body.price),
      compareAtPrice: body.compareAtPrice ? parseFloat(body.compareAtPrice) : null,
      costPerItem: body.costPerItem ? parseFloat(body.costPerItem) : null,
      inventoryTracked: body.inventoryTracked || false,
      inventory: body.inventory || [{ location: 'Shop location', quantity: 0 }],
      sku: body.sku || '',
      barcode: body.barcode || '',
      physicalProduct: body.physicalProduct || false,
      weight: body.weight || { value: 0, unit: 'kg' },
      variants: body.variants || [],
      status: body.status || 'Draft',
      publishingChannels: body.publishingChannels || ['Online Store', 'Point of Sale'],
      productType: body.productType || '',
      vendor: body.vendor || '',
      collections: body.collections || [],
      tags: body.tags || [],
      themeTemplate: body.themeTemplate || 'Default product',
      // createdBy: session?.user?.id, // Uncomment if using authentication
    };

    // Create product
    const product = await Product.create(productData);

    return NextResponse.json(
      {
        success: true,
        message: 'Product created successfully',
        product,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating product:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { error: 'Validation failed', details: errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Error creating product', details: error.message },
      { status: 500 }
    );
  }
}

