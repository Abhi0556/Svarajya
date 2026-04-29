import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth, getAuthContext, AuthLevel } from '@/lib/middleware/auth.middleware';
import { withErrorHandler } from '@/lib/middleware/error.middleware';
import {
  successResponse,
  errorResponse,
  ErrorCodes,
  StatusCodes,
  handlePrismaError,
} from '@/lib/middleware/standardResponse';

/**
 * GET /api/identity/settings
 * Get user identity/vault settings
 */
async function getHandler(request: NextRequest): Promise<NextResponse> {
  const authContext = getAuthContext(request);
  if (!authContext) {
    return errorResponse(ErrorCodes.UNAUTHORIZED, 'Authentication required', StatusCodes.UNAUTHORIZED);
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: authContext.userId },
      select: { settings: true }
    });

    if (!user) {
        return errorResponse(ErrorCodes.NOT_FOUND, 'User not found', StatusCodes.NOT_FOUND);
    }

    return successResponse(user.settings || {});
  } catch (error) {
    console.error('[Settings GET]', error);
    return handlePrismaError(error);
  }
}

/**
 * POST /api/identity/settings
 * Update user identity/vault settings
 */
async function postHandler(request: NextRequest): Promise<NextResponse> {
  const authContext = getAuthContext(request);
  if (!authContext) {
    return errorResponse(ErrorCodes.UNAUTHORIZED, 'Authentication required', StatusCodes.UNAUTHORIZED);
  }

  try {
    const data = await request.json();
    
    // Get existing settings to merge
    const user = await prisma.user.findUnique({
        where: { id: authContext.userId },
        select: { settings: true }
    });

    const currentSettings = (user?.settings as Record<string, any>) || {};
    const newSettings = { ...currentSettings, ...data };

    const updatedUser = await prisma.user.update({
      where: { id: authContext.userId },
      data: {
        settings: newSettings
      },
      select: { settings: true }
    });

    return successResponse(updatedUser.settings);
  } catch (error) {
    console.error('[Settings POST]', error);
    return handlePrismaError(error);
  }
}

export const GET = withAuth(withErrorHandler(getHandler), AuthLevel.AUTHENTICATED);
export const POST = withAuth(withErrorHandler(postHandler), AuthLevel.AUTHENTICATED);
