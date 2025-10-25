import { NextResponse } from 'next/server';
import connectDB from '../../../../../lib/mongodb';
import Product from '../../../../../models/Product';

export async function GET(request, { params }) {
  try {
    // Connect to database
    await connectDB();

    const { id } = await params;

    // Find product by ID
    const product = await Product.findById(id);
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: product,
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

export async function PUT(request, { params }) {
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

    const { id } = await params;

    // Check if product exists
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Parse request body
    const body = await request.json();

    // Prepare update data
    const updateData = {
      ...(body.title && { title: body.title }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.media && { media: body.media }),
      ...(body.category !== undefined && { category: body.category }),
      ...(body.price !== undefined && { price: parseFloat(body.price) }),
      ...(body.compareAtPrice !== undefined && { 
        compareAtPrice: body.compareAtPrice ? parseFloat(body.compareAtPrice) : null 
      }),
      ...(body.costPerItem !== undefined && { 
        costPerItem: body.costPerItem ? parseFloat(body.costPerItem) : null 
      }),
      ...(body.inventoryTracked !== undefined && { inventoryTracked: body.inventoryTracked }),
      ...(body.inventory && { inventory: body.inventory }),
      ...(body.sku !== undefined && { sku: body.sku }),
      ...(body.barcode !== undefined && { barcode: body.barcode }),
      ...(body.physicalProduct !== undefined && { physicalProduct: body.physicalProduct }),
      ...(body.weight && { weight: body.weight }),
      ...(body.variants && { variants: body.variants }),
      ...(body.status && { status: body.status }),
      ...(body.publishingChannels && { publishingChannels: body.publishingChannels }),
      ...(body.productType !== undefined && { productType: body.productType }),
      ...(body.vendor !== undefined && { vendor: body.vendor }),
      ...(body.collections && { collections: body.collections }),
      ...(body.tags && { tags: body.tags }),
      ...(body.themeTemplate && { themeTemplate: body.themeTemplate }),
      // updatedBy: session?.user?.id, // Uncomment if using authentication
    };

    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Product updated successfully',
        product: updatedProduct,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating product:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { error: 'Validation failed', details: errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Error updating product', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
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

    const { id } = await params;

    // Check if product exists
    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Delete product
    await Product.findByIdAndDelete(id);

    return NextResponse.json(
      {
        success: true,
        message: 'Product deleted successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Error deleting product', details: error.message },
      { status: 500 }
    );
  }
}

