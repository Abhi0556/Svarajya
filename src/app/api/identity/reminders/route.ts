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
 * GET /api/identity/reminders
 * Get all document reminders for current user
 */
async function getHandler(request: NextRequest): Promise<NextResponse> {
  const authContext = getAuthContext(request);
  if (!authContext) {
    return errorResponse(ErrorCodes.UNAUTHORIZED, 'Authentication required', StatusCodes.UNAUTHORIZED);
  }

  try {
    const reminders = await prisma.reminder.findMany({
      where: { 
        userId: authContext.userId,
        type: 'DOC_EXPIRY'
      },
      orderBy: { targetDate: 'asc' }
    });

    return successResponse(reminders);
  } catch (error) {
    console.error('[Reminders GET]', error);
    return handlePrismaError(error);
  }
}

/**
 * POST /api/identity/reminders
 * Create or update a document reminder
 */
async function postHandler(request: NextRequest): Promise<NextResponse> {
  const authContext = getAuthContext(request);
  if (!authContext) {
    return errorResponse(ErrorCodes.UNAUTHORIZED, 'Authentication required', StatusCodes.UNAUTHORIZED);
  }

  try {
    const data = await request.json();
    
    if (!data.linkedEntityId || !data.targetDate) {
      return errorResponse(ErrorCodes.VALIDATION_ERROR, 'Missing required fields', StatusCodes.BAD_REQUEST);
    }

    // Check if reminder already exists for this document
    const existing = await prisma.reminder.findFirst({
        where: {
            userId: authContext.userId,
            linkedEntityId: data.linkedEntityId,
            type: 'DOC_EXPIRY'
        }
    });

    let reminder;
    if (existing) {
        reminder = await prisma.reminder.update({
            where: { id: existing.id },
            data: {
                targetDate: new Date(data.targetDate),
                leadTime: data.leadTime || 30,
                message: data.message || `Document renewal due soon`,
            }
        });
    } else {
        reminder = await prisma.reminder.create({
            data: {
                userId: authContext.userId,
                type: 'DOC_EXPIRY',
                targetDate: new Date(data.targetDate),
                leadTime: data.leadTime || 30,
                linkedEntityId: data.linkedEntityId,
                message: data.message || `Document renewal due soon`,
                status: 'PENDING'
            }
        });
    }

    return successResponse(reminder, StatusCodes.CREATED);
  } catch (error) {
    console.error('[Reminders POST]', error);
    return handlePrismaError(error);
  }
}

export const GET = withAuth(withErrorHandler(getHandler), AuthLevel.AUTHENTICATED);
export const POST = withAuth(withErrorHandler(postHandler), AuthLevel.AUTHENTICATED);
