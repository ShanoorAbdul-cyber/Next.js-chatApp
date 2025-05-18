import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import jwt from 'jsonwebtoken'; 

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    const client = await clientPromise;
    const db = client.db();
    const users = db.collection('users');

    const user = await users.findOne(
      { email, password },
      { projection: { password: 0 } }
    );

    if (!user) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    const token = jwt.sign(
      { id: user._id.toString(), name: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return NextResponse.json(
      { message: 'Logged in successfully', user, token },
      { status: 200 }
    );
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
