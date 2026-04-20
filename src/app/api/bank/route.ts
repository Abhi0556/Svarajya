import { NextRequest, NextResponse } from 'next/server';
import { bankService } from '@/lib/services/bankService';
import { incomeService } from '@/lib/services/incomeService';
import { expenseService } from '@/lib/services/expenseService';
import { withAuth, getAuthContext, AuthLevel } from '@/lib/middleware/auth.middleware';
import { withErrorHandler } from '@/lib/middleware/error.middleware';
import {
  successResponse,
  errorResponse,
  ErrorCodes,
  StatusCodes,
  handlePrismaError,
} from '@/lib/middleware/standardResponse';
import { BankAccountResponse, CreateBankAccountRequest, UpdateBankAccountRequest } from '@/lib/types/api.types';

/**
 * GET /api/bank
 * Get all bank accounts for user
 */
async function handleGET(request: NextRequest): Promise<NextResponse> {
  const authContext = getAuthContext(request);
  if (!authContext) {
    return errorResponse(
      ErrorCodes.UNAUTHORIZED,
      'Authentication required',
      StatusCodes.UNAUTHORIZED
    );
  }

  try {
    const [accounts, income, expenses] = await Promise.all([
      bankService.getForUser(authContext.userId),
      incomeService.getForUser(authContext.userId),
      expenseService.getForUser(authContext.userId, new Date(new Date().getFullYear(), 0, 1), new Date()),
    ]);

    const responses: BankAccountResponse[] = accounts.map((account) => ({
      id: account.id,
      userId: account.userId,
      bankName: account.bankName,
      accountType: account.accountType,
      nickname: account.nickname,
      accountLast4: account.accountLast4,
      currentBalance: account.currentBalance,
      status: account.status,
      createdAt: account.createdAt.toISOString(),
      updatedAt: account.updatedAt.toISOString(),
    }));

    // Calculate metrics
    const totalBalance = accounts.reduce((sum, acc) => sum + acc.currentBalance, 0);
    const activeCount = accounts.filter((acc) => acc.status === 'active').length;
    const monthlyIncome = income.reduce((sum, inc) => sum + (inc.isPrimary ? inc.amount : 0), 0);
    const monthlyExpense = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    return successResponse({
      accounts: responses,
      metrics: {
        totalBalance,
        activeCount,
        monthlyIncome,
        monthlyExpense,
        surplus: monthlyIncome - monthlyExpense,
      },
    });
  } catch (error) {
    console.error('[Bank GET]', error);
    return handlePrismaError(error);
  }
}

/**
 * POST /api/bank
 * Create or update bank account
 */
async function handlePOST(request: NextRequest): Promise<NextResponse> {
  const authContext = getAuthContext(request);
  if (!authContext) {
    return errorResponse(
      ErrorCodes.UNAUTHORIZED,
      'Authentication required',
      StatusCodes.UNAUTHORIZED
    );
  }

  try {
    const data: CreateBankAccountRequest | (UpdateBankAccountRequest & { id?: string }) = await request.json();

    // Validate required fields
    if (!data.bankName || !data.accountType || !data.accountLast4) {
      return errorResponse(
        ErrorCodes.VALIDATION_ERROR,
        'Bank name, account type, and last 4 digits are required',
        StatusCodes.UNPROCESSABLE_ENTITY
      );
    }

    let account;

    if ('id' in data && data.id) {
      // Update existing
      account = await bankService.update(data.id, {
        bankName: data.bankName,
        accountType: data.accountType,
        nickname: data.nickname,
        accountLast4: data.accountLast4,
        currentBalance: data.currentBalance,
        status: data.status,
      });
    } else {
      // Check for duplicates
      const duplicate = await bankService.checkDuplicate(
        authContext.userId,
        data.bankName,
        data.accountType,
        data.accountLast4
      );

      if (duplicate) {
        return errorResponse(
          ErrorCodes.DUPLICATE_ENTRY,
          'Account with these details already exists',
          StatusCodes.CONFLICT
        );
      }

      // Create new
      account = await bankService.createForUser(authContext.userId, {
        bankName: data.bankName,
        accountType: data.accountType,
        nickname: data.nickname,
        accountLast4: data.accountLast4,
        currentBalance: data.currentBalance || 0,
        status: data.status || 'active',
      });
    }

    const response: BankAccountResponse = {
      id: account.id,
      userId: account.userId,
      bankName: account.bankName,
      accountType: account.accountType,
      nickname: account.nickname,
      accountLast4: account.accountLast4,
      currentBalance: account.currentBalance,
      status: account.status,
      createdAt: account.createdAt.toISOString(),
      updatedAt: account.updatedAt.toISOString(),
    };

    return successResponse(response, StatusCodes.CREATED);
  } catch (error) {
    console.error('[Bank POST]', error);
    return handlePrismaError(error);
  }
}

export const GET = withAuth(withErrorHandler(handleGET), AuthLevel.AUTHENTICATED);
export const POST = withAuth(withErrorHandler(handlePOST), AuthLevel.AUTHENTICATED);
