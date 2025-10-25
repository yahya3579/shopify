import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import Product from '../../../../models/Product';

export async function GET(request) {
  try {
    // Connect to database
    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    // Build query based on filters
    let query = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    // Fetch all products
    const products = await Product.find(query).sort({ createdAt: -1 });

    // Convert products to CSV format
    const csvHeaders = [
      'Title',
      'Description',
      'Category',
      'Price',
      'Compare At Price',
      'Cost Per Item',
      'SKU',
      'Barcode',
      'Inventory Tracked',
      'Quantity',
      'Physical Product',
      'Weight Value',
      'Weight Unit',
      'Status',
      'Product Type',
      'Vendor',
      'Tags',
      'Theme Template',
      'Publishing Channels',
      'Is Gift Card',
      'Denominations',
      'Gift Card Template',
      'Media URLs',
      'Created At'
    ];

    const csvRows = products.map(product => [
      `"${(product.title || '').replace(/"/g, '""')}"`,
      `"${(product.description || '').replace(/"/g, '""')}"`,
      `"${product.category || ''}"`,
      product.price || 0,
      product.compareAtPrice || '',
      product.costPerItem || '',
      `"${product.sku || ''}"`,
      `"${product.barcode || ''}"`,
      product.inventoryTracked ? 'TRUE' : 'FALSE',
      product.inventory && product.inventory.length > 0 ? product.inventory[0].quantity || 0 : 0,
      product.physicalProduct ? 'TRUE' : 'FALSE',
      product.weight?.value || 0,
      product.weight?.unit || 'kg',
      product.status || 'Draft',
      `"${product.productType || ''}"`,
      `"${product.vendor || ''}"`,
      `"${(product.tags || []).join(', ')}"`,
      `"${product.themeTemplate || 'Default product'}"`,
      `"${(product.publishingChannels || []).join(', ')}"`,
      product.isGiftCard ? 'TRUE' : 'FALSE',
      `"${(product.denominations || []).join(', ')}"`,
      `"${product.giftCardTemplate || ''}"`,
      `"${(product.media || []).map(m => m.url).join(', ')}"`,
      new Date(product.createdAt).toISOString()
    ]);

    // Combine headers and rows
    const csvContent = [csvHeaders.join(','), ...csvRows.map(row => row.join(','))].join('\n');

    // Create filename with timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `products-export-${timestamp}.csv`;

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Error exporting products:', error);
    return NextResponse.json(
      { error: 'Error exporting products', details: error.message },
      { status: 500 }
    );
  }
}
