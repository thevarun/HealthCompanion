import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { createDifyClient } from '@/libs/dify/client';
import { createClient } from '@/libs/supabase/server';

/**
 * GET /api/chat/messages
 * Fetches conversation message history from Dify
 * Requires authentication and conversation_id query parameter
 */
export async function GET(request: Request) {
  try {
    // Auth check
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get conversation_id from query params
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('conversation_id');

    if (!conversationId) {
      return NextResponse.json(
        { error: 'conversation_id required' },
        { status: 400 },
      );
    }

    // Fetch message history from Dify
    // User ID must match the user who created the conversation
    const difyClient = createDifyClient();
    const response = await difyClient.getMessages(conversationId, user.id);

    return NextResponse.json(response);
  } catch (error) {
    console.error('Failed to fetch messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 },
    );
  }
}
