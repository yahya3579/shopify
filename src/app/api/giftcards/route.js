import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import GiftCard from '../../../models/GiftCard';
import { verifyAuth } from '../../../lib/auth';

// GET all gift cards with filtering, pagination, and search
export async function GET(request) {
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

    const { searchParams } = new URL(request.url);

    // Pagination
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;

    // Filtering
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const customerEmail = searchParams.get('customerEmail');
    const expirationType = searchParams.get('expirationType');

    // Build query
    let query = {};

    if (status) {
      query.status = status;
    }

    if (expirationType) {
      query.expirationType = expirationType;
    }

    if (customerEmail) {
      query['customer.email'] = customerEmail;
    }

    if (search) {
      query.$or = [
        { giftCardCode: { $regex: search, $options: 'i' } },
        { 'customer.firstName': { $regex: search, $options: 'i' } },
        { 'customer.lastName': { $regex: search, $options: 'i' } },
        { 'customer.email': { $regex: search, $options: 'i' } },
        { notes: { $regex: search, $options: 'i' } },
      ];
    }

    // Execute query with pagination
    const giftCards = await GiftCard.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('createdBy', 'email name')
      .populate('updatedBy', 'email name');

    // Get total count for pagination
    const total = await GiftCard.countDocuments(query);

    // Calculate summary statistics
    const stats = await GiftCard.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalBalance: { $sum: '$currentBalance' },
          totalInitialValue: { $sum: '$initialValue' },
          activeCount: {
            $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
          },
          usedCount: {
            $sum: { $cond: [{ $eq: ['$status', 'used'] }, 1, 0] }
          },
          expiredCount: {
            $sum: { $cond: [{ $eq: ['$status', 'expired'] }, 1, 0] }
          },
        }
      }
    ]);

    return NextResponse.json(
      {
        success: true,
        data: giftCards,
        total: total,
        page: page,
        limit: limit,
        totalPages: Math.ceil(total / limit),
        stats: stats.length > 0 ? stats[0] : {
          totalBalance: 0,
          totalInitialValue: 0,
          activeCount: 0,
          usedCount: 0,
          expiredCount: 0,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching gift cards:', error);
    return NextResponse.json(
      { error: 'Error fetching gift cards', details: error.message },
      { status: 500 }
    );
  }
}

// POST - Create a new gift card
export async function POST(request) {
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

    const body = await request.json();

    // Validate required fields
    if (!body.giftCardCode) {
      return NextResponse.json(
        { error: 'Gift card code is required' },
        { status: 400 }
      );
    }

    if (!body.initialValue || body.initialValue <= 0) {
      return NextResponse.json(
        { error: 'Initial value must be greater than 0' },
        { status: 400 }
      );
    }

    // Check if gift card code already exists
    const existingGiftCard = await GiftCard.findOne({ giftCardCode: body.giftCardCode });
    if (existingGiftCard) {
      return NextResponse.json(
        { error: 'Gift card code already exists' },
        { status: 400 }
      );
    }

    // Validate expiration date if expirationType is set-expiration
    if (body.expirationType === 'set-expiration') {
      if (!body.expirationDate) {
        return NextResponse.json(
          { error: 'Expiration date is required when expiration type is set-expiration' },
          { status: 400 }
        );
      }

      const expirationDate = new Date(body.expirationDate);
      if (expirationDate < new Date()) {
        return NextResponse.json(
          { error: 'Expiration date cannot be in the past' },
          { status: 400 }
        );
      }
    }

    // Create gift card data
    const giftCardData = {
      giftCardCode: body.giftCardCode,
      initialValue: body.initialValue,
      currentBalance: body.initialValue,
      currency: body.currency || 'Rs',
      expirationType: body.expirationType || 'set-expiration',
      expirationDate: body.expirationType === 'set-expiration' ? new Date(body.expirationDate) : null,
      customer: {
        firstName: body.customer?.firstName || '',
        lastName: body.customer?.lastName || '',
        email: body.customer?.email || '',
        phone: body.customer?.phone || '',
      },
      notes: body.notes || '',
      status: 'active',
      // createdBy: user._id, // Uncomment if using authentication
    };

    // Create new gift card
    const giftCard = await GiftCard.create(giftCardData);

    return NextResponse.json(
      {
        success: true,
        message: 'Gift card created successfully',
        data: giftCard,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating gift card:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { error: 'Validation error', details: errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Error creating gift card', details: error.message },
      { status: 500 }
    );
  }
}

