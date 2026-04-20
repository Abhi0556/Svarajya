import { NextRequest, NextResponse } from 'next/server';
import { credentialService } from '@/lib/services/credentialService';
import { withAuth, getAuthContext, AuthLevel } from '@/lib/middleware/auth.middleware';
import { withErrorHandler } from '@/lib/middleware/error.middleware';
import {
  successResponse,
  errorResponse,
  ErrorCodes,
  StatusCodes,
  handlePrismaError,
} from '@/lib/middleware/standardResponse';
import { CredentialRecordResponse, CreateCredentialRecordRequest, UpdateCredentialRecordRequest } from '@/lib/types/api.types';

/**
 * GET /api/credentials
 * Get all credential records for user
 */
async function GET(request: NextRequest): Promise<NextResponse> {
  const authContext = getAuthContext(request);
  if (!authContext) {
    return errorResponse(
      ErrorCodes.UNAUTHORIZED,
      'Authentication required',
      StatusCodes.UNAUTHORIZED
    );
  }

  try {
    const records = await credentialService.getForUser(authContext.userId);

    const responses: CredentialRecordResponse[] = records.map((record) => ({
      id: record.id,
      userId: record.userId,
      portalType: record.portalType,
      portalName: record.portalName,
      portalUrl: record.portalUrl,
      loginId: record.loginId,
      registeredEmail: record.registeredEmail,
      registeredMobile: record.registeredMobile,
      storageMode: record.storageMode,
      linkedMemberId: record.linkedMemberId,
      registrationDate: record.registrationDate?.toISOString() || null,
      createdAt: record.createdAt.toISOString(),
      updatedAt: record.updatedAt.toISOString(),
    }));

    return successResponse(responses);
  } catch (error) {
    console.error('[Credentials GET]', error);
    return handlePrismaError(error);
  }
}

/**
 * POST /api/credentials
 * Create or update credential record
 */
async function POST(request: NextRequest): Promise<NextResponse> {
  const authContext = getAuthContext(request);
  if (!authContext) {
    return errorResponse(
      ErrorCodes.UNAUTHORIZED,
      'Authentication required',
      StatusCodes.UNAUTHORIZED
    );
  }

  try {
    const data: CreateCredentialRecordRequest | (UpdateCredentialRecordRequest & { id?: string }) = await request.json();

    // Validate required fields
    if (!data.portalType || !data.portalName) {
      return errorResponse(
        ErrorCodes.VALIDATION_ERROR,
        'Portal type and name are required',
        StatusCodes.UNPROCESSABLE_ENTITY
      );
    }

    let record;

    if ('id' in data && data.id) {
      // Update existing
      record = await credentialService.update(data.id, {
        portalName: data.portalName,
        portalUrl: data.portalUrl,
        loginId: data.loginId,
        registeredEmail: data.registeredEmail,
        registeredMobile: data.registeredMobile,
        encryptedPassword: data.password,
        linkedMemberId: data.linkedMemberId,
      });
    } else {
      // Create new
      record = await credentialService.createForUser(authContext.userId, {
        portalType: data.portalType,
        portalName: data.portalName,
        portalUrl: data.portalUrl,
        loginId: data.loginId,
        registeredEmail: data.registeredEmail,
        registeredMobile: data.registeredMobile,
        storageMode: data.storageMode || 'REFERENCE',
        encryptedPassword: data.password,
        linkedMemberId: data.linkedMemberId,
        registrationDate: data.registrationDate ? new Date(data.registrationDate) : undefined,
      });
    }

    const response: CredentialRecordResponse = {
      id: record.id,
      userId: record.userId,
      portalType: record.portalType,
      portalName: record.portalName,
      portalUrl: record.portalUrl,
      loginId: record.loginId,
      registeredEmail: record.registeredEmail,
      registeredMobile: record.registeredMobile,
      storageMode: record.storageMode,
      linkedMemberId: record.linkedMemberId,
      registrationDate: record.registrationDate?.toISOString() || null,
      createdAt: record.createdAt.toISOString(),
      updatedAt: record.updatedAt.toISOString(),
    };

    return successResponse(response, StatusCodes.CREATED);
  } catch (error) {
    console.error('[Credentials POST]', error);
    return handlePrismaError(error);
  }
}

export const GET = withAuth(withErrorHandler(GET), AuthLevel.AUTHENTICATED);
export const POST = withAuth(withErrorHandler(POST), AuthLevel.AUTHENTICATED);
