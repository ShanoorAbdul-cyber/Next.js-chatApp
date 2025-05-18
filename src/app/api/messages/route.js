import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

// POST /api/messages
export async function POST(request) {
  try {
    const { conversationId, senderId, text } = await request.json();

    if (!conversationId || !senderId || !text) {
      return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    const message = {
      senderId,
      text,
      timestamp: new Date()
    };

    await db.collection('conversations').updateOne(
      { _id: new ObjectId(conversationId) },
      { $push: { messages: message } }
    );

    return NextResponse.json({ message: 'Message sent' }, { status: 200 });
  } catch (err) {
    console.error('POST /api/messages error:', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}


// GET /api/messages?conversationId=xyz
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('conversationId');

    if (!conversationId) {
      return NextResponse.json({ message: 'Missing conversationId' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    const convo = await db.collection('conversations').findOne({
      _id: new ObjectId(conversationId)
    });

    if (!convo) {
      return NextResponse.json({ message: 'Conversation not found' }, { status: 404 });
    }

    return NextResponse.json(convo.messages || [], { status: 200 });
  } catch (err) {
    console.error('GET /api/messages error:', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

