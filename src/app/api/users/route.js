import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const users = await db.collection('users').find({}, { projection: { password: 0 } }).toArray();

    return NextResponse.json(users, { status: 200 });
  } catch (err) {
    console.error('Error fetching users:', err);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
