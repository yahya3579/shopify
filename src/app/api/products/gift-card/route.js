import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import Product from '../../../../models/Product';

export async function POST(request) {
  try {
    // Connect to database
    await connectDB();

    // Parse request body
    const body = await request.json();

    // Validate required fields
    if (!body.title) {
      return NextResponse.json(
        { error: 'Gift card product title is required' },
        { status: 400 }
      );
    }

    if (!body.denominations || body.denominations.length === 0) {
      return NextResponse.json(
        { error: 'At least one denomination is required' },
        { status: 400 }
      );
    }

    // Validate denominations
    const validDenominations = body.denominations
      .filter(d => d && parseFloat(d) > 0)
      .map(d => parseFloat(d));

    if (validDenominations.length === 0) {
      return NextResponse.json(
        { error: 'At least one valid denomination is required' },
        { status: 400 }
      );
    }

    // Prepare gift card product data
    const productData = {
      title: body.title,
      description: body.description || '',
      category: 'Gift Cards',
      price: Math.min(...validDenominations), // Set price to lowest denomination
      isGiftCard: true,
      denominations: validDenominations,
      giftCardTemplate: body.giftCardTemplate || 'gift_card',
      status: body.status || 'Active',
      publishingChannels: ['Online Store', 'Point of Sale'],
      productType: body.productType || 'Gift Card',
      vendor: body.vendor || '',
      tags: body.tags ? body.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
      themeTemplate: body.themeTemplate || 'Default product',
      physicalProduct: false, // Gift cards are digital
      inventoryTracked: false, // Gift cards don't need inventory tracking
      media: body.media || [],
      // createdBy: session?.user?.id, // Uncomment if using authentication
    };

    // Create gift card product
    const product = await Product.create(productData);

    return NextResponse.json(
      {
        success: true,
        message: 'Gift card product created successfully',
        product,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating gift card product:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { error: 'Validation failed', details: errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Error creating gift card product', details: error.message },
      { status: 500 }
    );
  }
}
