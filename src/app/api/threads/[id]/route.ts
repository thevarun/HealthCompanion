import { and, eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { db } from '@/libs/DB';
import { logger } from '@/libs/Logger';
import { createClient } from '@/libs/supabase/server';
import { threads } from '@/models/Schema';

// Zod schema for PATCH /api/threads/[id] request validation
const updateThreadSchema = z.object({
  title: z.string().optional(),
  lastMessagePreview: z.string().optional(),
});

/**
 * PATCH /api/threads/[id]
 * Updates title and/or last_message_preview of a thread
 *
 * Acceptance Criteria:
 * - AC #7: Updates title and last_message_preview
 * - AC #10: Returns 401 for unauthenticated requests
 */
export async function PATCH(
  request: NextRequest,
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

    // Parse and validate request body
    const body = await request.json();
    const validationResult = updateThreadSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: validationResult.error.errors,
        },
        { status: 400 },
      );
    }

    const { title, lastMessagePreview } = validationResult.data;

    // Build update object dynamically (only include provided fields)
    const updateData: Record<string, any> = {
      updatedAt: new Date(),
    };

    if (title !== undefined) {
      updateData.title = title;
    }

    if (lastMessagePreview !== undefined) {
      updateData.lastMessagePreview = lastMessagePreview;
    }

    // Get thread ID from params
    const { id } = await params;

    // Update thread record, verify user ownership
    const [updatedThread] = await db
      .update(threads)
      .set(updateData)
      .where(and(eq(threads.id, id), eq(threads.userId, user.id)))
      .returning();

    // Return 404 if thread not found or not owned by user
    if (!updatedThread) {
      return NextResponse.json(
        {
          error: 'Thread not found or access denied',
          code: 'NOT_FOUND',
        },
        { status: 404 },
      );
    }

    return NextResponse.json({ thread: updatedThread });
  } catch (error: any) {
    logger.error({ error }, 'PATCH /api/threads/[id] error');

    return NextResponse.json(
      { error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/threads/[id]
 * Permanently removes a thread
 *
 * Acceptance Criteria:
 * - AC #9: Removes thread permanently
 * - AC #10: Returns 401 for unauthenticated requests
 */
export async function DELETE(
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

    // Delete thread, verify user ownership
    const [deletedThread] = await db
      .delete(threads)
      .where(and(eq(threads.id, id), eq(threads.userId, user.id)))
      .returning();

    // Return 404 if thread not found or not owned by user
    if (!deletedThread) {
      return NextResponse.json(
        {
          error: 'Thread not found or access denied',
          code: 'NOT_FOUND',
        },
        { status: 404 },
      );
    }

    // Return 204 No Content on success
    return new Response(null, { status: 204 });
  } catch (error: any) {
    logger.error({ error }, 'DELETE /api/threads/[id] error');

    return NextResponse.json(
      { error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 },
    );
  }
}
