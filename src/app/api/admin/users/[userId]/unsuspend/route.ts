import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import {
  forbiddenError,
  internalError,
  invalidRequestError,
  logApiError,
  unauthorizedError,
} from '@/libs/api/errors';
import { isAdmin } from '@/libs/auth/isAdmin';
import { createAdminClient } from '@/libs/supabase/admin';
import { createClient } from '@/libs/supabase/server';
import { isValidUuid } from '@/utils/validation';

/**
 * POST /api/admin/users/[userId]/unsuspend
 *
 * Unsuspends a user by clearing ban_duration.
 * Requires admin authentication.
 */
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    // 1. Verify admin session
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return unauthorizedError();
    }

    if (!isAdmin(user)) {
      return forbiddenError('Admin access required');
    }

    // 2. Get userId from params
    const { userId } = await params;

    // Validate userId format
    if (!isValidUuid(userId)) {
      return invalidRequestError('Invalid user ID format');
    }

    // 3. Unsuspend user using admin client
    const supabaseAdmin = createAdminClient();
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
      userId,
      { ban_duration: 'none' },
    );

    if (error) {
      logApiError(error, {
        endpoint: `/api/admin/users/${userId}/unsuspend`,
        method: 'POST',
        userId: user.id,
        metadata: { targetUserId: userId },
      });
      return internalError(error.message || 'Failed to unsuspend user');
    }

    // 4. Return success with updated user data
    return NextResponse.json({
      success: true,
      user: data.user,
    });
  } catch (error) {
    logApiError(error, {
      endpoint: '/api/admin/users/[userId]/unsuspend',
      method: 'POST',
    });
    return internalError();
  }
}
