import { NextRequest, NextResponse } from 'next/server';
import {
  errorResponse,
  ErrorCodes,
  StatusCodes,
  handlePrismaError,
} from './standardResponse';

/**
 * Error Handler Middleware
 * Wraps route handlers with centralized error handling
 */
export async function withErrorHandler(
  handler: (request: NextRequest, context?: any) => Promise<NextResponse>
) {
  return async (request: NextRequest, context?: any) => {
    try {
      return await handler(request, context);
    } catch (error) {
      console.error('[Error Handler]', error);

      // Handle Prisma errors specially
      if (error && typeof error === 'object' && 'code' in error) {
        const prismaCode = (error as any).code;
        if (prismaCode && prismaCode.startsWith('P')) {
          return handlePrismaError(error);
        }
      }

      // Handle validation errors
      if (error instanceof SyntaxError && 'body' in error) {
        return errorResponse(
          ErrorCodes.INVALID_REQUEST,
          'Request body is invalid JSON',
          StatusCodes.BAD_REQUEST
        );
      }

      // Handle generic errors
      const message =
        error instanceof Error ? error.message : 'An unexpected error occurred';

      return errorResponse(
        ErrorCodes.INTERNAL_ERROR,
        message,
        StatusCodes.INTERNAL_ERROR
      );
    }
  };
}

/**
 * Compose multiple middleware
 * Usage: compose(withErrorHandler, withAuth(AuthLevel.AUTHENTICATED), withValidation(schema))
 */
export function composeMiddleware(
  ...middlewares: Array<(handler: any) => any>
) {
  return (handler: (request: NextRequest, context?: any) => Promise<NextResponse>) => {
    return middlewares.reduceRight((acc, middleware) => {
      return middleware(acc);
    }, handler);
  };
}
