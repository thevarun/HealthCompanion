import { and, eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { db } from '@/libs/DB';
import { logger } from '@/libs/Logger';
import { createClient } from '@/libs/supabase/server';
import { threads } from '@/models/Schema';

/**
 * PATCH /api/threads/[id]/archive
 * Toggles the archived status of a thread
 *
 * Acceptance Criteria:
 * - AC #8: Toggles archive status
 * - AC #10: Returns 401 for unauthenticated requests
 */
export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<Response> {
  try {
    // Validate Supabase session
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    // Return 401 for unauthorized requests
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized', code: 'AUTH_REQUIRED' },
        { status: 401 },
      );
    }

    // Get thread ID from params
    const { id } = await params;

    // First, fetch the current thread to get its archived status
    const [currentThread] = await db
      .select()
      .from(threads)
      .where(and(eq(threads.id, id), eq(threads.userId, user.id)));

    if (!currentThread) {
      return NextResponse.json(
        {
          error: 'Thread not found or access denied',
          code: 'NOT_FOUND',
        },
        { status: 404 },
      );
    }

    // Toggle the archived status
    const [updatedThread] = await db
      .update(threads)
      .set({
        archived: !currentThread.archived,
        updatedAt: new Date(),
      })
      .where(and(eq(threads.id, id), eq(threads.userId, user.id)))
      .returning();

    return NextResponse.json({ thread: updatedThread });
  } catch (error: any) {
    logger.error({ error }, 'PATCH /api/threads/[id]/archive error');

    return NextResponse.json(
      { error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 },
    );
  }
}
