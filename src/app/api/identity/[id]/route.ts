import { NextRequest, NextResponse } from 'next/server';
import { identityService } from '@/lib/services/identityService';
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
 * GET /api/identity/[id]
 * Get single identity record by ID
 */
async function getHandler(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params;
  
  const authContext = getAuthContext(request);
  if (!authContext) {
    return errorResponse(
      ErrorCodes.UNAUTHORIZED,
      'Authentication required',
      StatusCodes.UNAUTHORIZED
    );
  }

  console.log('[Identity GET by ID] Looking for id:', id);

  if (!id) {
    return errorResponse(
      ErrorCodes.INVALID_REQUEST,
      'Document ID is required',
      StatusCodes.BAD_REQUEST
    );
  }

  try {
    const record = await identityService.findById(id);

    if (!record) {
      return errorResponse(
        ErrorCodes.NOT_FOUND,
        'Document not found',
        StatusCodes.NOT_FOUND
      );
    }

    if (record.userId !== authContext.userId) {
      return errorResponse(
        ErrorCodes.FORBIDDEN,
        'Access denied',
        StatusCodes.FORBIDDEN
      );
    }

    const response = {
      id: record.id,
      idType: record.idType,
      numberMasked: record.numberMasked,
      expiryDate: record.expiryDate?.toISOString() || null,
      issuedDate: record.issuedDate?.toISOString() || null,
    };

    return successResponse(response);
  } catch (error) {
    console.error('[Identity GET by ID]', error);
    return handlePrismaError(error);
  }
}

/**
 * PUT /api/identity/[id]
 * Update identity record
 */
async function putHandler(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params;
  
  const authContext = getAuthContext(request);
  if (!authContext) {
    return errorResponse(
      ErrorCodes.UNAUTHORIZED,
      'Authentication required',
      StatusCodes.UNAUTHORIZED
    );
  }

  console.log('[Identity PUT] Updating id:', id);

  if (!id) {
    return errorResponse(
      ErrorCodes.INVALID_REQUEST,
      'Document ID is required',
      StatusCodes.BAD_REQUEST
    );
  }

  try {
    const data = await request.json();
    console.log('[Identity PUT] Received data:', data);

    // Verify ownership first
    const existing = await identityService.findById(id);
    if (!existing) {
      return errorResponse(
        ErrorCodes.NOT_FOUND,
        'Document not found',
        StatusCodes.NOT_FOUND
      );
    }

    if (existing.userId !== authContext.userId) {
      return errorResponse(
        ErrorCodes.FORBIDDEN,
        'Access denied',
        StatusCodes.FORBIDDEN
      );
    }

    // Update the record
    const updatedRecord = await identityService.update(id, {
      expiryDate: data.expiryDate ? new Date(data.expiryDate) : undefined,
      issuedDate: data.issuedDate ? new Date(data.issuedDate) : undefined,
    });

    console.log('[Identity PUT] Updated record:', updatedRecord.id);

    const response = {
      id: updatedRecord.id,
      idType: updatedRecord.idType,
      numberMasked: updatedRecord.numberMasked,
      expiryDate: updatedRecord.expiryDate?.toISOString() || null,
      issuedDate: updatedRecord.issuedDate?.toISOString() || null,
    };

    return successResponse(response);
  } catch (error) {
    console.error('[Identity PUT]', error);
    return handlePrismaError(error);
  }
}

export const GET = withAuth(withErrorHandler(getHandler), AuthLevel.AUTHENTICATED);
export const PUT = withAuth(withErrorHandler(putHandler), AuthLevel.AUTHENTICATED);