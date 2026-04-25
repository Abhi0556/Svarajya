import { NextRequest, NextResponse } from 'next/server';
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
    const user = await userService.getUserWithProfile(authContext.userId);

    if (!user) {
      return successResponse({ isFirstLogin: true } as any);
    }

    const userAny: any = user;
    const phoneValue = userAny.phone ?? userAny.primary_mobile ?? userAny.primaryMobile ?? null;
    const isMobileVerified = userAny.is_mobile_verified ?? userAny.isMobileVerified ?? !!phoneValue;
    const response: UserResponse = {
      id: user.id,
      email: user.email,
      phone: phoneValue,
      mobile: phoneValue,
      name: userAny.name,
      dob: userAny.dob?.toISOString() || null,
      gender: userAny.gender,
      maritalStatus: userAny.maritalStatus,
      occupationType: userAny.occupationType,
      employerCompany: userAny.employerCompany,
      profileType: userAny.profileType,
      status: userAny.status,
      language: userAny.language,
      createdAt: userAny.createdAt.toISOString(),
      updatedAt: userAny.updatedAt.toISOString(),
      isFirstLogin: userAny.is_first_login ?? true,
      isMobileVerified,
      familyMembers: userAny.familyMembers || [],
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
    if (!data.name && typeof data.isFirstLogin !== 'boolean') {
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
      dob: data.dob ? new Date(data.dob) : undefined,
      gender: data.gender,
      maritalStatus: data.maritalStatus,
      occupationType: data.occupationType,
      employerCompany: data.employerCompany,
      language: data.language,
    };
    if (data.name !== undefined) patch.name = data.name;
    if (typeof data.isFirstLogin === 'boolean') patch.is_first_login = data.isFirstLogin;

    // Only allow email/mobile change if not verified
    let user = await userService.findById(authContext.userId);
    if (!user) {
      const createData: any = {
        id: authContext.userId,
        email: authContext.email,
        name: data.name,
        status: 'PENDING_VERIFICATION',
        profileType: 'INDIVIDUAL_SALARIED',
      };

      if (data.phone) {
        createData.phone = data.phone;
      }
      if (data.dob) {
        createData.dob = new Date(data.dob);
      }
      if (data.gender) {
        createData.gender = data.gender;
      }
      if (data.maritalStatus) {
        createData.maritalStatus = data.maritalStatus;
      }
      if (data.occupationType) {
        createData.occupationType = data.occupationType;
      }
      if (data.language) {
        createData.language = data.language;
      }
      if (typeof data.isFirstLogin === 'boolean') {
        createData.is_first_login = data.isFirstLogin;
      }

      user = await userService.create(createData);
    } else {
      const existingAny: any = user;
      const isEmailVerified = existingAny.is_email_verified ?? existingAny.isEmailVerified ?? false;
      const isMobileVerified = existingAny.is_mobile_verified ?? existingAny.isMobileVerified ?? false;

      if (data.email && !isEmailVerified) {
        patch.email = data.email;
      }

      if (data.phone && !isMobileVerified) {
        patch.phone = data.phone;
      }

      user = await userService.update(authContext.userId, patch);
    }

    const userAny: any = user;
    const response: UserResponse = {
      id: user.id,
      email: user.email,
      phone: userAny.phone ?? null,
      name: userAny.name,
      dob: userAny.dob?.toISOString() || null,
      gender: userAny.gender,
      maritalStatus: userAny.maritalStatus,
      occupationType: userAny.occupationType,
      employerCompany: userAny.employerCompany,
      profileType: userAny.profileType,
      status: userAny.status,
      language: userAny.language,
      createdAt: userAny.createdAt.toISOString(),
      updatedAt: userAny.updatedAt.toISOString(),
      isFirstLogin: userAny.is_first_login ?? true,
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
