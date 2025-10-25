import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '../../../../lib/mongodb';
import GiftCard from '../../../../models/GiftCard';
import User from '../../../../models/User';
import { verifyAuth } from '../../../../lib/auth';

// GET single gift card by ID
export async function GET(request, { params }) {
  try {
    // Connect to database
    await connectDB();

    const { id } = await params;
    
    console.log('Received gift card ID:', id);
    console.log('Is valid ObjectId:', mongoose.Types.ObjectId.isValid(id));

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid gift card ID format' },
        { status: 400 }
      );
    }

    // Find gift card by ID
    const giftCard = await GiftCard.findById(id)
      .populate('createdBy', 'firstName lastName email')
      .populate('updatedBy', 'firstName lastName email')
      .populate({ path: 'comments.author', select: 'firstName lastName', strictPopulate: false });

    console.log('Gift card found:', giftCard ? 'Yes' : 'No');

    if (!giftCard) {
      return NextResponse.json(
        { error: 'Gift card not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: giftCard,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching gift card:', error);
    return NextResponse.json(
      { error: 'Error fetching gift card', details: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update a gift card
export async function PUT(request, { params }) {
  try {
    // Connect to database
    await connectDB();

    // Verify authentication (optional - uncomment if needed)
    // const user = await verifyAuth(request);
    // if (!user) {
    //   return NextResponse.json(
    //     { error: 'Unauthorized' },
    //     { status: 401 }
    //   );
    // }

    const { id } = await params;

    // Check if gift card exists
    const existingGiftCard = await GiftCard.findById(id);
    if (!existingGiftCard) {
      return NextResponse.json(
        { error: 'Gift card not found' },
        { status: 404 }
      );
    }

    // Parse request body
    const body = await request.json();

    // Validate gift card code uniqueness if being updated
    if (body.giftCardCode && body.giftCardCode !== existingGiftCard.giftCardCode) {
      const duplicateCode = await GiftCard.findOne({ 
        giftCardCode: body.giftCardCode,
        _id: { $ne: id }
      });
      
      if (duplicateCode) {
        return NextResponse.json(
          { error: 'Gift card code already exists' },
          { status: 400 }
        );
      }
    }

    // Validate expiration date if being updated
    if (body.expirationType === 'set-expiration' && body.expirationDate) {
      const expirationDate = new Date(body.expirationDate);
      if (expirationDate < new Date()) {
        return NextResponse.json(
          { error: 'Expiration date cannot be in the past' },
          { status: 400 }
        );
      }
    }

    // Prepare update data
    const updateData = {};

    // Gift card code
    if (body.giftCardCode !== undefined) {
      updateData.giftCardCode = body.giftCardCode;
    }

    // Initial value - be careful with this
    if (body.initialValue !== undefined && body.initialValue > 0) {
      updateData.initialValue = parseFloat(body.initialValue);
    }

    // Currency
    if (body.currency !== undefined) {
      updateData.currency = body.currency;
    }

    // Expiration type and date
    if (body.expirationType !== undefined) {
      updateData.expirationType = body.expirationType;
      
      if (body.expirationType === 'set-expiration' && body.expirationDate) {
        updateData.expirationDate = new Date(body.expirationDate);
      } else if (body.expirationType === 'no-expiration') {
        updateData.expirationDate = null;
      }
    } else if (body.expirationDate !== undefined) {
      // Update only expiration date if expirationType is already set-expiration
      if (existingGiftCard.expirationType === 'set-expiration') {
        updateData.expirationDate = new Date(body.expirationDate);
      }
    }

    // Customer information
    if (body.customer !== undefined) {
      updateData.customer = {
        firstName: body.customer.firstName !== undefined 
          ? body.customer.firstName 
          : existingGiftCard.customer.firstName,
        lastName: body.customer.lastName !== undefined 
          ? body.customer.lastName 
          : existingGiftCard.customer.lastName,
        email: body.customer.email !== undefined 
          ? body.customer.email 
          : existingGiftCard.customer.email,
        phone: body.customer.phone !== undefined 
          ? body.customer.phone 
          : existingGiftCard.customer.phone,
      };
    }

    // Notes
    if (body.notes !== undefined) {
      updateData.notes = body.notes;
    }

    // Status (active/deactivated)
    if (body.status !== undefined) {
      // Validate status value
      if (!['active', 'deactivated'].includes(body.status)) {
        return NextResponse.json(
          { error: 'Invalid status. Must be "active" or "deactivated"' },
          { status: 400 }
        );
      }
      updateData.status = body.status;
    }
    
    // Prepare update instructions
    let updateOps = {};
    
    // Handle comment deletion
    if (body.deleteCommentIndex !== undefined && typeof body.deleteCommentIndex === 'number') {
      const commentIndex = body.deleteCommentIndex;
      
      // Validate comment index
      if (commentIndex < 0 || commentIndex >= existingGiftCard.comments.length) {
        return NextResponse.json(
          { error: 'Invalid comment index' },
          { status: 400 }
        );
      }
      
      // Remove comment at specified index
      updateOps.$unset = {};
      updateOps.$unset[`comments.${commentIndex}`] = 1;
      
      // After unsetting, we need to pull null values to compact the array
      const updatedGiftCard = await GiftCard.findByIdAndUpdate(
        id,
        updateOps,
        { new: true }
      );
      
      // Pull null values to compact array
      const finalGiftCard = await GiftCard.findByIdAndUpdate(
        id,
        { $pull: { comments: null } },
        { new: true, runValidators: true }
      )
        .populate('createdBy', 'firstName lastName email')
        .populate('updatedBy', 'firstName lastName email')
        .populate({ path: 'comments.author', select: 'firstName lastName', strictPopulate: false });
      
      return NextResponse.json(
        {
          success: true,
          message: 'Comment deleted successfully',
          data: finalGiftCard,
        },
        { status: 200 }
      );
    }
    
    // Handle adding new comment
    if (
      body.comment !== undefined &&
      typeof body.comment === 'string' &&
      body.comment.trim() !== ''
    ) {
      const newComment = {
        authorName: body.authorName || 'Staff',
        text: body.comment.trim(),
        createdAt: new Date(),
      };
      updateOps.$push = { comments: newComment };
    }
    
    if (Object.keys(updateData).length > 0) {
      updateOps.$set = updateData;
    }
    if (Object.keys(updateOps).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }
    // Atomically update & return the new gift card, including the new comment
    const updatedGiftCard = await GiftCard.findByIdAndUpdate(
      id,
      updateOps,
      { new: true, runValidators: true }
    )
      .populate('createdBy', 'firstName lastName email')
      .populate('updatedBy', 'firstName lastName email')
      .populate({ path: 'comments.author', select: 'firstName lastName', strictPopulate: false });
    return NextResponse.json(
      {
        success: true,
        message: 'Gift card updated successfully',
        data: updatedGiftCard,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating gift card:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { error: 'Validation failed', details: errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Error updating gift card', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete a gift card
export async function DELETE(request, { params }) {
  try {
    // Connect to database
    await connectDB();

    // Verify authentication (optional - uncomment if needed)
    // const user = await verifyAuth(request);
    // if (!user) {
    //   return NextResponse.json(
    //     { error: 'Unauthorized' },
    //     { status: 401 }
    //   );
    // }

    const { id } = await params;

    // Check if gift card exists
    const giftCard = await GiftCard.findById(id);
    if (!giftCard) {
      return NextResponse.json(
        { error: 'Gift card not found' },
        { status: 404 }
      );
    }

    // Optional: Check if gift card has been used before allowing deletion
    if (giftCard.currentBalance < giftCard.initialValue) {
      return NextResponse.json(
        { 
          error: 'Cannot delete a gift card that has been used. Consider deactivating it instead.',
          suggestion: 'Use PUT request to update status to "deactivated"'
        },
        { status: 400 }
      );
    }

    // Delete gift card
    await GiftCard.findByIdAndDelete(id);

    return NextResponse.json(
      {
        success: true,
        message: 'Gift card deleted successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting gift card:', error);
    return NextResponse.json(
      { error: 'Error deleting gift card', details: error.message },
      { status: 500 }
    );
  }
}

