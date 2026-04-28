import { NextRequest, NextResponse } from 'next/server';
import { userService } from '@/lib/services/userService';
import { withAuth, getAuthContext, AuthLevel } from '@/lib/middleware/auth.middleware';
import { errorResponse, successResponse, ErrorCodes, StatusCodes } from '@/lib/middleware/standardResponse';

/**
 * DELETE /api/user
 * Deletes the current authenticated user from both Supabase Auth and Prisma
 */
export const DELETE = withAuth(async (request: NextRequest) => {
  const authContext = getAuthContext(request);
  if (!authContext) {
    return errorResponse(
      ErrorCodes.UNAUTHORIZED,
      'Authentication required',
      StatusCodes.UNAUTHORIZED
    );
  }

  try {
    await userService.delete(authContext.userId);
    return successResponse({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('[User API] Error deleting user:', error);
    return errorResponse(
      ErrorCodes.INTERNAL_ERROR,
      'Failed to delete user',
      StatusCodes.INTERNAL_ERROR
    );
  }
}, AuthLevel.AUTHENTICATED);
