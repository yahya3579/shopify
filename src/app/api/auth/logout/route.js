import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // Clear the token by setting an expired cookie
    const response = NextResponse.json(
      { message: 'Logout successful' },
      { status: 200 }
    );

    // Set cookie to expire immediately
    response.cookies.set('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/'
    });

    return response;

  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
