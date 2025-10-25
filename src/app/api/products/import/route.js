import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import Product from '../../../../models/Product';
import { verifyAuth } from '../../../../lib/auth';

export async function POST(request) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request);
    if (!authResult.success) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Connect to database
    await connectDB();

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Check if file is CSV
    if (!file.name.endsWith('.csv')) {
      return NextResponse.json({ error: 'File must be a CSV' }, { status: 400 });
    }

    // Read file content
    const text = await file.text();
    const lines = text.split('\n').filter(line => line.trim());

    if (lines.length < 2) {
      return NextResponse.json({ error: 'CSV must have at least a header row and one data row' }, { status: 400 });
    }

    // Parse CSV header
    const headerLine = lines[0];
    const headers = parseCSVLine(headerLine);

    // Expected headers based on AddProduct form fields
    const expectedHeaders = [
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

    // Validate headers
    const missingHeaders = expectedHeaders.filter(expected => !headers.includes(expected));
    if (missingHeaders.length > 0) {
      return NextResponse.json({ 
        error: `Missing required headers: ${missingHeaders.join(', ')}`,
        expectedHeaders,
        receivedHeaders: headers
      }, { status: 400 });
    }

    let imported = 0;
    let skipped = 0;
    const errors = [];

    // Process each data row
    for (let i = 1; i < lines.length; i++) {
      try {
        const line = lines[i];
        if (!line.trim()) continue;

        const values = parseCSVLine(line);
        
        // Create product object from CSV data
        const productData = {
          title: cleanValue(values[headers.indexOf('Title')]),
          description: cleanValue(values[headers.indexOf('Description')]),
          category: cleanValue(values[headers.indexOf('Category')]),
          price: parseFloat(values[headers.indexOf('Price')]) || 0,
          compareAtPrice: values[headers.indexOf('Compare At Price')] ? parseFloat(values[headers.indexOf('Compare At Price')]) : null,
          costPerItem: values[headers.indexOf('Cost Per Item')] ? parseFloat(values[headers.indexOf('Cost Per Item')]) : null,
          sku: cleanValue(values[headers.indexOf('SKU')]),
          barcode: cleanValue(values[headers.indexOf('Barcode')]),
          inventoryTracked: values[headers.indexOf('Inventory Tracked')] === 'TRUE',
          inventory: values[headers.indexOf('Inventory Tracked')] === 'TRUE' ? 
            [{ location: 'Shop location', quantity: parseInt(values[headers.indexOf('Quantity')]) || 0 }] : [],
          physicalProduct: values[headers.indexOf('Physical Product')] === 'TRUE',
          weight: values[headers.indexOf('Physical Product')] === 'TRUE' ? {
            value: parseFloat(values[headers.indexOf('Weight Value')]) || 0,
            unit: values[headers.indexOf('Weight Unit')] || 'kg'
          } : { value: 0, unit: 'kg' },
          status: values[headers.indexOf('Status')] || 'Draft',
          productType: cleanValue(values[headers.indexOf('Product Type')]),
          vendor: cleanValue(values[headers.indexOf('Vendor')]),
          tags: values[headers.indexOf('Tags')] ? 
            values[headers.indexOf('Tags')].split(',').map(tag => tag.trim()).filter(tag => tag) : [],
          themeTemplate: values[headers.indexOf('Theme Template')] || 'Default product',
          publishingChannels: values[headers.indexOf('Publishing Channels')] ? 
            values[headers.indexOf('Publishing Channels')].split(',').map(channel => channel.trim()) : 
            ['Online Store', 'Point of Sale'],
          isGiftCard: values[headers.indexOf('Is Gift Card')] === 'TRUE',
          denominations: values[headers.indexOf('Denominations')] ? 
            values[headers.indexOf('Denominations')].split(',').map(d => d.trim()).filter(d => d) : [],
          giftCardTemplate: values[headers.indexOf('Gift Card Template')] || 'gift_card',
          media: values[headers.indexOf('Media URLs')] ? 
            values[headers.indexOf('Media URLs')].split(',').map(url => ({ url: url.trim(), type: 'image' })).filter(m => m.url) : [],
          variants: [],
          createdBy: authResult.user._id,
          updatedBy: authResult.user._id
        };

        // Validate required fields
        if (!productData.title) {
          errors.push(`Row ${i + 1}: Title is required`);
          skipped++;
          continue;
        }

        if (!productData.price || productData.price <= 0) {
          errors.push(`Row ${i + 1}: Valid price is required`);
          skipped++;
          continue;
        }

        // Check if product with same title already exists
        const existingProduct = await Product.findOne({ title: productData.title });
        if (existingProduct) {
          errors.push(`Row ${i + 1}: Product with title "${productData.title}" already exists`);
          skipped++;
          continue;
        }

        // Create product
        const product = new Product(productData);
        await product.save();
        imported++;

      } catch (error) {
        console.error(`Error processing row ${i + 1}:`, error);
        errors.push(`Row ${i + 1}: ${error.message}`);
        skipped++;
      }
    }

    return NextResponse.json({
      success: true,
      imported,
      skipped,
      errors: errors.slice(0, 10), // Limit errors to first 10
      message: `Successfully imported ${imported} products. ${skipped > 0 ? `${skipped} rows were skipped.` : ''}`
    });

  } catch (error) {
    console.error('Error importing products:', error);
    return NextResponse.json(
      { error: 'Error importing products', details: error.message },
      { status: 500 }
    );
  }
}

// Helper function to parse CSV line handling quoted values
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        // Escaped quote
        current += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // End of field
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  // Add last field
  result.push(current);
  
  return result;
}

// Helper function to clean CSV values
function cleanValue(value) {
  if (!value) return '';
  return value.replace(/^"|"$/g, '').trim();
}
