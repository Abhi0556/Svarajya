import { NextRequest, NextResponse } from 'next/server';
import { ZodSchema, ZodError } from 'zod';
import {
  errorResponse,
  ErrorCodes,
  StatusCodes,
} from './standardResponse';

/**
 * Validation Middleware
 * Validates request body and query params against Zod schemas
 */
export async function withValidation(
  schema: ZodSchema,
  handler: (request: NextRequest, validated: any) => Promise<NextResponse>,
  source: 'body' | 'query' = 'body'
) {
  return async (request: NextRequest) => {
    try {
      let dataToValidate;

      // Extract data from source
      if (source === 'body') {
        try {
          dataToValidate = await request.json();
        } catch (e) {
          return errorResponse(
            ErrorCodes.INVALID_REQUEST,
            'Request body must be valid JSON',
            StatusCodes.BAD_REQUEST
          );
        }
      } else if (source === 'query') {
        const params = new URL(request.url).searchParams;
        dataToValidate = Object.fromEntries(params.entries());
      }

      // Validate against schema
      try {
        const validated = await schema.parseAsync(dataToValidate);
        return handler(request, validated);
      } catch (error) {
        if (error instanceof ZodError) {
          const formattedErrors = error.issues.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
            code: err.code,
          }));

          return errorResponse(
            ErrorCodes.VALIDATION_ERROR,
            'Request validation failed',
            StatusCodes.UNPROCESSABLE_ENTITY,
            { errors: formattedErrors }
          );
        }

        throw error;
      }
    } catch (error) {
      console.error('[Validation Middleware]', error);
      return errorResponse(
        ErrorCodes.INTERNAL_ERROR,
        'Validation check failed',
        StatusCodes.INTERNAL_ERROR
      );
    }
  };
}
