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
 * GET /api/identity/links
 * Get all identity links for current user
 */
async function getHandler(request: NextRequest): Promise<NextResponse> {
  const authContext = getAuthContext(request);
  if (!authContext) {
    return errorResponse(ErrorCodes.UNAUTHORIZED, 'Authentication required', StatusCodes.UNAUTHORIZED);
  }

  try {
    const links = await prisma.identityLink.findMany({
      where: { userId: authContext.userId },
      include: {
        identity: {
          select: {
            idType: true,
            numberMasked: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return successResponse(links);
  } catch (error) {
    console.error('[IdentityLinks GET]', error);
    return handlePrismaError(error);
  }
}

/**
 * POST /api/identity/links
 * Create a new identity link
 */
async function postHandler(request: NextRequest): Promise<NextResponse> {
  const authContext = getAuthContext(request);
  if (!authContext) {
    return errorResponse(ErrorCodes.UNAUTHORIZED, 'Authentication required', StatusCodes.UNAUTHORIZED);
  }

  try {
    const data = await request.json();
    
    if (!data.identityId || !data.linkedType || !data.linkedValue) {
      return errorResponse(ErrorCodes.VALIDATION_ERROR, 'Missing required fields', StatusCodes.BAD_REQUEST);
    }

    const link = await prisma.identityLink.create({
      data: {
        userId: authContext.userId,
        identityId: data.identityId,
        linkedType: data.linkedType,
        linkedValue: data.linkedValue,
        serviceName: data.serviceName,
      }
    });

    return successResponse(link, StatusCodes.CREATED);
  } catch (error) {
    console.error('[IdentityLinks POST]', error);
    return handlePrismaError(error);
  }
}

/**
 * DELETE /api/identity/links
 * Delete an identity link
 */
async function deleteHandler(request: NextRequest): Promise<NextResponse> {
    const authContext = getAuthContext(request);
    if (!authContext) {
      return errorResponse(ErrorCodes.UNAUTHORIZED, 'Authentication required', StatusCodes.UNAUTHORIZED);
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return errorResponse(ErrorCodes.VALIDATION_ERROR, 'Link ID required', StatusCodes.BAD_REQUEST);
    }

    try {
      await prisma.identityLink.delete({
        where: { 
            id,
            userId: authContext.userId // Security: Ensure user owns the link
        }
      });

      return successResponse({ message: 'Link deleted' });
    } catch (error) {
      console.error('[IdentityLinks DELETE]', error);
      return handlePrismaError(error);
    }
}

export const GET = withAuth(withErrorHandler(getHandler), AuthLevel.AUTHENTICATED);
export const POST = withAuth(withErrorHandler(postHandler), AuthLevel.AUTHENTICATED);
export const DELETE = withAuth(withErrorHandler(deleteHandler), AuthLevel.AUTHENTICATED);
