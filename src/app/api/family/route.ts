import { NextRequest, NextResponse } from 'next/server';
import { familyService } from '@/lib/services/familyService';
import { withAuth, getAuthContext, AuthLevel } from '@/lib/middleware/auth.middleware';
import { withErrorHandler } from '@/lib/middleware/error.middleware';
import {
  successResponse,
  errorResponse,
  ErrorCodes,
  StatusCodes,
  handlePrismaError,
} from '@/lib/middleware/standardResponse';
import { FamilyMemberResponse, CreateFamilyMemberRequest, UpdateFamilyMemberRequest } from '@/lib/types/api.types';

/**
 * GET /api/family
 * Get all family members for user
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
    const members = await familyService.getFamilyMembers(authContext.userId);

    const responses: FamilyMemberResponse[] = members.map((member) => ({
      id: member.id,
      userId: member.userId,
      name: member.name,
      relation: member.relation,
      dob: member.dob?.toISOString() || null,
      isDependent: member.isDependent,
      nomineeEligible: member.nomineeEligible,
      accessLevel: member.accessLevel,
      createdAt: member.createdAt.toISOString(),
      updatedAt: member.updatedAt.toISOString(),
    }));

    return successResponse(responses);
  } catch (error) {
    console.error('[Family GET]', error);
    return handlePrismaError(error);
  }
}

/**
 * POST /api/family
 * Create or update family member
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
    const data: CreateFamilyMemberRequest | (UpdateFamilyMemberRequest & { id?: string }) = await request.json();

    // Validate required fields
    if (!data.name || !data.relation) {
      return errorResponse(
        ErrorCodes.VALIDATION_ERROR,
        'Name and relation are required',
        StatusCodes.UNPROCESSABLE_ENTITY
      );
    }

    let member;

    if ('id' in data && data.id) {
      // Update existing
      member = await familyService.update(data.id, {
        name: data.name,
        relation: data.relation,
        dob: data.dob ? new Date(data.dob) : undefined,
        isDependent: data.isDependent,
        nomineeEligible: data.nomineeEligible,
        accessLevel: data.accessLevel,
      });
    } else {
      // Create new
      member = await familyService.createForUser(authContext.userId, {
        name: data.name,
        relation: data.relation,
        dob: data.dob ? new Date(data.dob) : undefined,
        isDependent: data.isDependent,
        nomineeEligible: data.nomineeEligible,
        accessLevel: data.accessLevel,
      });
    }

    const response: FamilyMemberResponse = {
      id: member.id,
      userId: member.userId,
      name: member.name,
      relation: member.relation,
      dob: member.dob?.toISOString() || null,
      isDependent: member.isDependent,
      nomineeEligible: member.nomineeEligible,
      accessLevel: member.accessLevel,
      createdAt: member.createdAt.toISOString(),
      updatedAt: member.updatedAt.toISOString(),
    };

    return successResponse(response, StatusCodes.CREATED);
  } catch (error) {
    console.error('[Family POST]', error);
    return handlePrismaError(error);
  }
}

export const GET = withAuth(withErrorHandler(getHandler), AuthLevel.AUTHENTICATED);
export const POST = withAuth(withErrorHandler(postHandler), AuthLevel.AUTHENTICATED);
