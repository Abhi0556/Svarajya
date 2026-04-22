import { NextRequest, NextResponse } from 'next/server';
import {
  successResponse,
  errorResponse,
  ErrorCodes,
  StatusCodes,
  handlePrismaError,
} from '@/lib/middleware/standardResponse';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

/**
 * Contact Form Submission
 * POST /api/contact
 * 
 * No authentication required (public endpoint)
 * Stores contact submissions in ContactMessage table
 */

const ContactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000),
});

export async function postHandler(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();

    // Validate input
    const validated = ContactSchema.safeParse(body);
    if (!validated.success) {
      return errorResponse(
        ErrorCodes.VALIDATION_ERROR,
        'Validation failed',
        StatusCodes.UNPROCESSABLE_ENTITY,
        { errors: validated.error.issues }
      );
    }

    const { name, email, message } = validated.data;

    // Check for spam (simple rate limiting: max 5 messages from same email in 1 hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentMessages = await prisma.contactMessage.count({
      where: {
        email,
        createdAt: {
          gte: oneHourAgo,
        },
      },
    });

    if (recentMessages >= 5) {
      return errorResponse(
        ErrorCodes.VALIDATION_ERROR,
        'Too many messages from this email. Please try again later.',
        StatusCodes.CONFLICT
      );
    }

    // Save contact message
    const contact = await prisma.contactMessage.create({
      data: {
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
      },
    });

    // Return success
    return successResponse(
      {
        id: contact.id,
        message: 'Thank you for your message. We will get back to you soon.',
      },
      StatusCodes.CREATED
    );
  } catch (error) {
    console.error('[Contact POST]', error);

    // Handle specific Prisma errors
    if (error instanceof z.ZodError) {
      return errorResponse(
        ErrorCodes.VALIDATION_ERROR,
        'Validation failed',
        StatusCodes.UNPROCESSABLE_ENTITY,
        { errors: error.issues }
      );
    }

    return handlePrismaError(error);
  }
}

/**
 * GET /api/contact
 * Returns 405 Method Not Allowed
 */
export async function getHandler() {
  return errorResponse(
    ErrorCodes.VALIDATION_ERROR,
    'GET method not allowed',
    StatusCodes.METHOD_NOT_ALLOWED
  );
}
