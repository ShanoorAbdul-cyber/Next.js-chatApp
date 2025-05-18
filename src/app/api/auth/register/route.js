import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request) {
  const { username, email, password } = await request.json();
  const client = await clientPromise;
  const db = client.db();
  const users = db.collection('users');

  // 1) check existing
  if (await users.findOne({ email })) {
    return NextResponse.json(
      { message: 'User already exists' },
      { status: 400 }
    );
  }

  // 2) insert new
  await users.insertOne({ username, email, password });
  return NextResponse.json(
    { message: 'User Registered Successfully' },
    { status: 201 }
  );
}
