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
import { IdentityRecordResponse, CreateIdentityRecordRequest, UpdateIdentityRecordRequest } from '@/lib/types/api.types';

/**
 * GET /api/identity
 * Get all identity records for user
 */
async function getHandler(request: NextRequest): Promise<NextResponse> {
  const authContext = getAuthContext(request);
  if (!authContext) {
    return errorResponse(
      ErrorCodes.UNAUTHORIZED,
      'Authentication required',
      StatusCodes.UNAUTHORIZED
    );
  }

  try {
    const records = await identityService.getForUser(authContext.userId);

    const responses: IdentityRecordResponse[] = records.map((record) => ({
      id: record.id,
      userId: record.userId,
      idType: record.idType,
      numberMasked: record.numberMasked,
      expiryDate: record.expiryDate?.toISOString() || null,
      issuedDate: record.issuedDate?.toISOString() || null,
      createdAt: record.createdAt.toISOString(),
      updatedAt: record.updatedAt.toISOString(),
    }));

    return successResponse(responses);
  } catch (error) {
    console.error('[Identity GET]', error);
    return handlePrismaError(error);
  }
}

/**
 * POST /api/identity
 * Create or update identity record
 */
async function postHandler(request: NextRequest): Promise<NextResponse> {
  const authContext = getAuthContext(request);
  if (!authContext) {
    return errorResponse(
      ErrorCodes.UNAUTHORIZED,
      'Authentication required',
      StatusCodes.UNAUTHORIZED
    );
  }

  try {
    const data: CreateIdentityRecordRequest | (UpdateIdentityRecordRequest & { id?: string }) = await request.json();

    // Validate required fields
    if (!data.idType || !data.numberMasked) {
      return errorResponse(
        ErrorCodes.VALIDATION_ERROR,
        'ID type and masked number are required',
        StatusCodes.UNPROCESSABLE_ENTITY
      );
    }

    let record;

    if ('id' in data && data.id) {
      // Update existing
      record = await identityService.update(data.id, {
        idType: data.idType,
        numberMasked: data.numberMasked,
        expiryDate: data.expiryDate ? new Date(data.expiryDate) : undefined,
        issuedDate: data.issuedDate ? new Date(data.issuedDate) : undefined,
      });
    } else {
      // Create new (will handle unique constraint on userId + idType)
      record = await identityService.createForUser(authContext.userId, {
        idType: data.idType,
        numberMasked: data.numberMasked,
        expiryDate: data.expiryDate ? new Date(data.expiryDate) : undefined,
        issuedDate: data.issuedDate ? new Date(data.issuedDate) : undefined,
      });
    }

    const response: IdentityRecordResponse = {
      id: record.id,
      userId: record.userId,
      idType: record.idType,
      numberMasked: record.numberMasked,
      expiryDate: record.expiryDate?.toISOString() || null,
      issuedDate: record.issuedDate?.toISOString() || null,
      createdAt: record.createdAt.toISOString(),
      updatedAt: record.updatedAt.toISOString(),
    };

    return successResponse(response, StatusCodes.CREATED);
  } catch (error) {
    console.error('[Identity POST]', error);
    return handlePrismaError(error);
  }
}

export const GET = withAuth(withErrorHandler(getHandler), AuthLevel.AUTHENTICATED);
export const POST = withAuth(withErrorHandler(postHandler), AuthLevel.AUTHENTICATED);
