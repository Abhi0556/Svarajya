import { NextRequest, NextResponse } from 'next/server';
import { educationService } from '@/lib/services/educationService';
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
 * DELETE /api/education/[id]
 * Delete an education record
 */
async function deleteHandler(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  const authContext = getAuthContext(request);
  if (!authContext) {
    return errorResponse(
      ErrorCodes.UNAUTHORIZED,
      'Authentication required',
      StatusCodes.UNAUTHORIZED
    );
  }

  const { id } = await params;

  try {
    // 1. Verify ownership
    const record = await educationService.findById(id);
    if (!record) {
      return errorResponse(
        ErrorCodes.NOT_FOUND,
        'Education record not found',
        StatusCodes.NOT_FOUND
      );
    }

    if (record.userId !== authContext.userId) {
      return errorResponse(
        ErrorCodes.FORBIDDEN,
        'Not authorized to delete this record',
        StatusCodes.FORBIDDEN
      );
    }

    // 2. Delete
    await educationService.delete(id);

    return successResponse({ message: 'Education record deleted successfully' });
  } catch (error) {
    console.error('[Education DELETE]', error);
    return handlePrismaError(error);
  }
}

export const DELETE = withAuth(withErrorHandler(deleteHandler), AuthLevel.AUTHENTICATED);
