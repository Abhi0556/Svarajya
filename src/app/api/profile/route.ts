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
import { UserResponse, UpdateUserRequest } from '@/lib/types/api.types';

/**
 * GET /api/profile
 * Get current user's profile
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
    const user = await userService.findById(authContext.userId);

    if (!user) {
      return errorResponse(
        ErrorCodes.NOT_FOUND,
        'User profile not found',
        StatusCodes.NOT_FOUND
      );
    }

    const response: UserResponse = {
      id: user.id,
      email: user.email,
      phone: user.phone,
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
    const data: UpdateUserRequest = await request.json();

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
    const user = await userService.update(authContext.userId, {
      name: data.name,
      email: data.email,
      phone: data.phone,
      dob: data.dob ? new Date(data.dob) : undefined,
      gender: data.gender,
      maritalStatus: data.maritalStatus,
      occupationType: data.occupationType,
      employerCompany: data.employerCompany,
      language: data.language,
    });

    const response: UserResponse = {
      id: user.id,
      email: user.email,
      phone: user.phone,
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
  } catch (error) {
    console.error('[Profile POST]', error);
    return handlePrismaError(error);
  }
}

// Apply middleware
export const GET = withAuth(withErrorHandler(GET), AuthLevel.AUTHENTICATED);
export const POST = withAuth(
  withErrorHandler(POST),
  AuthLevel.AUTHENTICATED
);
