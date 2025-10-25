import { NextResponse } from 'next/server';
import { uploadToCloudinary } from '../../../../lib/cloudinary';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only images are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size too large. Maximum 10MB allowed.' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename for Cloudinary
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const publicId = `product_${timestamp}_${originalName.split('.')[0]}`;

    // Upload to Cloudinary
    const result = await uploadToCloudinary(buffer, 'products', publicId);

    return NextResponse.json(
      {
        success: true,
        imageUrl: result.secure_url,
        publicId: result.public_id,
        filename: result.public_id, // For backward compatibility
        message: 'Image uploaded successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { error: 'Error uploading image', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE endpoint to remove images from Cloudinary
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');
    const publicId = searchParams.get('publicId');

    // Support both filename (for backward compatibility) and publicId
    const imageId = publicId || filename;

    if (!imageId) {
      return NextResponse.json(
        { error: 'Filename or publicId is required' },
        { status: 400 }
      );
    }

    // Import deleteFromCloudinary function
    const { deleteFromCloudinary, extractPublicId } = await import('../../../../lib/cloudinary');

    let cloudinaryPublicId = imageId;

    // If it looks like a URL, extract the public ID
    if (imageId.includes('cloudinary.com')) {
      cloudinaryPublicId = extractPublicId(imageId);
    }

    // Delete from Cloudinary
    const result = await deleteFromCloudinary(cloudinaryPublicId);

    return NextResponse.json(
      {
        success: true,
        message: 'Image deleted successfully',
        result,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json(
      { error: 'Error deleting image', details: error.message },
      { status: 500 }
    );
  }
}

