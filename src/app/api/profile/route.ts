import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { userService } from '@/lib/services/userService';
import { withAuth, getAuthContext, AuthLevel } from '@/lib/middleware/auth.middleware';
import { withErrorHandler } from '@/lib/middleware/error.middleware';
import {
  successResponse,
  errorResponse,
  ErrorCodes,
  StatusCodes,
  handlePrismaError,
} from '@/lib/middleware/standardResponse';
import { UserResponse } from '@/lib/types/api.types';

/**
 * GET /api/profile
 * Get current user's profile
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
    const user = await userService.findById(authContext.userId);

    if (!user) {
      return errorResponse(
        ErrorCodes.NOT_FOUND,
        'User profile not found',
        StatusCodes.NOT_FOUND
      );
    }

    const userAny: any = user;
    const response: UserResponse = {
      id: user.id,
      email: user.email,
      phone: userAny.phone ?? userAny.primary_mobile ?? userAny.primaryMobile ?? null,
      name: user.name,
      dob: user.dob?.toISOString() || null,
      gender: user.gender,
      maritalStatus: user.maritalStatus,
      occupationType: user.occupationType,
      employerCompany: user.employerCompany,
      profileType: user.profileType,
      status: user.status,
      language: user.language,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };

    return successResponse(response);
  } catch (error) {
    console.error('[Profile GET]', error);
    return handlePrismaError(error);
  }
}

/**
 * POST /api/profile
 * Create or update user profile
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
    const data: any = await request.json();

    // Validate required fields
    if (!data.name) {
      return errorResponse(
        ErrorCodes.VALIDATION_ERROR,
        'Name is required',
        StatusCodes.UNPROCESSABLE_ENTITY,
        { field: 'name' }
      );
    }

    // Update user profile
    // Prevent updating mobile/email after verification in backend
    const patch: any = {
      name: data.name,
      dob: data.dob ? new Date(data.dob) : undefined,
      gender: data.gender,
      maritalStatus: data.maritalStatus,
      occupationType: data.occupationType,
      employerCompany: data.employerCompany,
      language: data.language,
    };

    // Only allow email/mobile change if not verified
    const existing = await userService.findById(authContext.userId);
    if (!existing) {
      return errorResponse(ErrorCodes.NOT_FOUND, 'User not found', StatusCodes.NOT_FOUND);
    }

    // Some environments may have different field naming (snake_case vs camelCase)
    const existingAny: any = existing;
    const isEmailVerified = existingAny.is_email_verified ?? existingAny.isEmailVerified ?? false;
    const isMobileVerified = existingAny.is_mobile_verified ?? existingAny.isMobileVerified ?? false;

    if (data.email && !isEmailVerified) {
      patch.email = data.email;
    }

    if (data.phone && !isMobileVerified) {
      patch.mobile = data.phone;
    }

    const user = await userService.update(authContext.userId, patch);

    const userAny: any = user;
    const response: UserResponse = {
      id: user.id,
      email: user.email,
      phone: userAny.phone ?? null,
      name: user.name,
      dob: user.dob?.toISOString() || null,
      gender: user.gender,
      maritalStatus: user.maritalStatus,
      occupationType: user.occupationType,
      employerCompany: user.employerCompany,
      profileType: user.profileType,
      status: user.status,
      language: user.language,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };

    return successResponse(response, StatusCodes.CREATED, 'Profile updated');
  } catch (error: any) {
    if (error?.code !== 'ECONNRESET' && error?.name !== 'AbortError' && !error?.message?.includes('aborted')) {
      console.error('[Profile POST]', error);
    }
    return handlePrismaError(error);
  }
}

// Apply middleware
export const GET = withAuth(withErrorHandler(getHandler), AuthLevel.AUTHENTICATED);
export const POST = withAuth(
  withErrorHandler(postHandler),
  AuthLevel.AUTHENTICATED
);
