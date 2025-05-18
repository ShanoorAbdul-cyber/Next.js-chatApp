import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

// POST: Create or reuse conversation
export async function POST(request) {
  try {
    const { userId1, userId2, userName1, userName2 } = await request.json();

    if (!userId1 || !userId2 ) {
      return NextResponse.json({ message: 'Missing user data' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    const existing = await db.collection('conversations').findOne({
      participants: { $all: [userId1, userId2], $size: 2 }
    });

    if (existing) {
      return NextResponse.json(
        { message: 'Conversation already exists', conversationId: existing._id },
        { status: 200 }
      );
    }

    const result = await db.collection('conversations').insertOne({
      participants: [userId1, userId2],
      userNames: {
        [userId1]: userName1,
        [userId2]: userName2
      },
      messages: [],
      createdAt: new Date()
    });

    return NextResponse.json(
      { message: 'Conversation created', conversationId: result.insertedId},
      { status: 201 }
    );
  } catch (err) {
    console.error('POST /api/conversations error:', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// GET: Fetch conversations for a user
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ message: 'Missing userId' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    const conversations = await db.collection('conversations').find({
      participants: userId
    }).toArray();

    // Return with other user's ID and name
    const formatted = conversations.map(conv => {
      const otherUserId = conv.participants.find(p => p !== userId);
      return {
        _id: conv._id,
        userId: otherUserId,
        username: conv.userNames?.[otherUserId] || 'Unknown',
        createdAt: conv.createdAt
      };
    });

    return NextResponse.json(formatted, { status: 200 });
  } catch (err) {
    console.error('GET /api/conversations error:', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
