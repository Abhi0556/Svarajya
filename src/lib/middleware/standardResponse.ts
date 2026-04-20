import { NextResponse } from 'next/server';

/**
 * Standard API Response Types
 */
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Error Code Constants
 */
export const ErrorCodes = {
  // Auth
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  INVALID_TOKEN: 'INVALID_TOKEN',

  // Validation
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_REQUEST: 'INVALID_REQUEST',
  MISSING_REQUIRED_FIELD: 'MISSING_REQUIRED_FIELD',

  // Database
  NOT_FOUND: 'NOT_FOUND',
  DUPLICATE_ENTRY: 'DUPLICATE_ENTRY',
  DATABASE_ERROR: 'DATABASE_ERROR',
  CONSTRAINT_VIOLATION: 'CONSTRAINT_VIOLATION',

  // Business Logic
  CONFLICT: 'CONFLICT',
  INVALID_STATE: 'INVALID_STATE',
  OPERATION_FAILED: 'OPERATION_FAILED',

  // Server
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
};

/**
 * HTTP Status Code Mapping
 */
export const StatusCodes = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

/**
 * Success Response Builder
 */
export function successResponse<T>(
  data: T,
  status: number = StatusCodes.OK,
  message?: string
): NextResponse<ApiSuccessResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      ...(message && { message }),
    },
    { status }
  );
}

/**
 * Error Response Builder
 */
export function errorResponse(
  code: string,
  message: string,
  status: number = StatusCodes.INTERNAL_ERROR,
  details?: Record<string, unknown>
): NextResponse<ApiErrorResponse> {
  return NextResponse.json(
    {
      success: false,
      error: {
        code,
        message,
        ...(details && { details }),
      },
    },
    { status }
  );
}

/**
 * Prisma Error Handler
 */
export function handlePrismaError(error: any) {
  console.error('[Prisma Error]', error);

  // Unique constraint violation
  if (error.code === 'P2002') {
    const field = error.meta?.target?.[0] || 'field';
    return errorResponse(
      ErrorCodes.DUPLICATE_ENTRY,
      `A record with this ${field} already exists`,
      StatusCodes.CONFLICT,
      { field, target: error.meta?.target }
    );
  }

  // Record not found
  if (error.code === 'P2025') {
    return errorResponse(
      ErrorCodes.NOT_FOUND,
      'The requested resource was not found',
      StatusCodes.NOT_FOUND
    );
  }

  // Foreign key constraint violation
  if (error.code === 'P2003') {
    return errorResponse(
      ErrorCodes.CONSTRAINT_VIOLATION,
      'Referenced record does not exist',
      StatusCodes.CONFLICT,
      { relation: error.meta?.relation_name }
    );
  }

  // Database connection error
  if (error.code === 'P1001') {
    return errorResponse(
      ErrorCodes.SERVICE_UNAVAILABLE,
      'Database service is temporarily unavailable',
      StatusCodes.SERVICE_UNAVAILABLE
    );
  }

  // Generic database error
  return errorResponse(
    ErrorCodes.DATABASE_ERROR,
    'A database error occurred',
    StatusCodes.INTERNAL_ERROR,
    { prismaCode: error.code }
  );
}
