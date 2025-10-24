import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import { ObjectId } from 'mongodb';

export async function GET(request) {
  try {
    console.log('API /auth/me called');
    
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    console.log('Auth header:', authHeader ? 'Present' : 'Missing');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('No valid auth header');
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    console.log('Token received:', token.substring(0, 20) + '...');
    
    const decoded = verifyToken(token);
    console.log('Decoded token:', decoded);

    if (!decoded) {
      console.log('Token verification failed');
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const client = await clientPromise;
    const db = client.db('shopify-auth');
    const usersCollection = db.collection('users');

    console.log('Searching for user with ID:', decoded.userId);

    // Find user by ID
    const user = await usersCollection.findOne({ 
      _id: new ObjectId(decoded.userId),
      isActive: true 
    });

    console.log('User found:', user ? 'Yes' : 'No');

    if (!user) {
      console.log('User not found in database');
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user;
    
    return NextResponse.json(
      {
        user: userWithoutPassword
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
