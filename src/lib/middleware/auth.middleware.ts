import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import {
  errorResponse,
  ErrorCodes,
  StatusCodes,
} from './standardResponse';

/**
 * Auth levels required for endpoints
 */
export enum AuthLevel {
  PUBLIC = 'PUBLIC',
  AUTHENTICATED = 'AUTHENTICATED',
  VERIFIED = 'VERIFIED',
  PROFILE_COMPLETE = 'PROFILE_COMPLETE',
  ADMIN = 'ADMIN',
}

/**
 * Request context with authenticated user
 */
export interface AuthContext {
  userId: string;
  email?: string;
  authId: string; // Supabase auth ID
}

/**
 * Extend NextRequest to include auth context
 */
declare global {
  namespace Express {
    interface Request {
      authContext?: AuthContext;
    }
  }
}

/**
 * Auth Middleware
 * Verifies Supabase session and ensures user exists in database
 */
export function withAuth(
  handler: (
    request: NextRequest,
    context?: any
  ) => Promise<NextResponse>,
  requiredLevel: AuthLevel = AuthLevel.AUTHENTICATED
) {
  return async (request: NextRequest, context?: any) => {
    try {
      // Skip auth for PUBLIC endpoints
      if (requiredLevel === AuthLevel.PUBLIC) {
        return handler(request, context);
      }

      // Get Supabase session
      const supabase = await createClient();
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      // No session
      if (!authUser) {
        return errorResponse(
          ErrorCodes.UNAUTHORIZED,
          'Authentication required',
          StatusCodes.UNAUTHORIZED
        );
      }

      // Find or create user atomically strictly avoiding concurrency Unique Constraint failures
      let user = await prisma.user.upsert({
        where: { id: authUser.id },
        update: {}, // Do nothing if exists
        create: {
          id: authUser.id,
          email: authUser.email,
          status: 'PENDING_VERIFICATION',
          profileType: 'INDIVIDUAL_SALARIED', // Default
        },
      });

      // Check auth level requirements
      if (requiredLevel === AuthLevel.VERIFIED) {
        if (!authUser.email_confirmed_at) {
          return errorResponse(
            ErrorCodes.FORBIDDEN,
            'Email verification required',
            StatusCodes.FORBIDDEN
          );
        }
      }

      if (requiredLevel === AuthLevel.PROFILE_COMPLETE) {
        if (!user.name || user.status === 'PENDING_VERIFICATION') {
          return errorResponse(
            ErrorCodes.FORBIDDEN,
            'Profile completion required',
            StatusCodes.FORBIDDEN
          );
        }
      }

      if (requiredLevel === AuthLevel.ADMIN) {
        // TODO: Check if user is admin
        return errorResponse(
          ErrorCodes.FORBIDDEN,
          'Admin access required',
          StatusCodes.FORBIDDEN
        );
      }

      // Attach auth context to request
      (request as any).authContext = {
        userId: user.id,
        email: user.email,
        authId: authUser.id,
      } as AuthContext;

      // Call handler with attached context
      return handler(request, context);
    } catch (error) {
      console.error('[Auth Middleware]', error);
      return errorResponse(
        ErrorCodes.INTERNAL_ERROR,
        'Authentication check failed',
        StatusCodes.INTERNAL_ERROR
      );
    }
  };
}

/**
 * Get auth context from request
 */
export function getAuthContext(request: NextRequest): AuthContext | null {
  return (request as any).authContext || null;
}
