import { BankAccount } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { BaseService } from './baseService';

export interface CreateBankAccountInput {
  bankName: string;
  accountType: string;
  accountNumber: string;
  nickname?: string;
  status?: string;
  openingBalance: number;
  currentBalance: number;
  latestBalanceAsOf: Date;
}

export interface UpdateBankAccountInput {
  bankName?: string;
  accountType?: string;
  status?: string;
  nickname?: string;
  latestBalance?: number;
  latestBalanceAsOf?: Date;
}

/**
 * Bank Account Service
 */
class BankAccountService extends BaseService<BankAccount, CreateBankAccountInput, UpdateBankAccountInput> {
  constructor() {
    super(prisma.bankAccount);
  }

  /**
   * Get all bank accounts for a user
   */
  async getForUser(userId: string): Promise<BankAccount[]> {
    try {
      return await prisma.bankAccount.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      console.error('[BankService] Error getting accounts for user:', error);
      throw error;
    }
  }

  /**
   * Create bank account for user
   */
  async createForUser(userId: string, data: CreateBankAccountInput): Promise<BankAccount> {
    try {
      return await prisma.bankAccount.create({
        data: {
          ...data,
          userId,
          status: data.status || 'active',
        },
      });
    } catch (error) {
      console.error('[BankService] Error creating account:', error);
      throw error;
    }
  }

  /**
   * Get active accounts only
   */
  async getActive(userId: string): Promise<BankAccount[]> {
    try {
      return await prisma.bankAccount.findMany({
        where: {
          userId,
          status: 'active',
        },
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      console.error('[BankService] Error getting active accounts:', error);
      throw error;
    }
  }

  /**
   * Get total balance across all accounts
   */
  async getTotalBalance(userId: string): Promise<number> {
    try {
      const result = await prisma.bankAccount.aggregate({
        where: { userId },
        _sum: { currentBalance: true },
      });

      return result._sum.latestBalance || 0;
    } catch (error) {
      console.error('[BankService] Error calculating total balance:', error);
      throw error;
    }
  }

  /**
   * Get total balance for active accounts only
   */
  async getActiveTotalBalance(userId: string): Promise<number> {
    try {
      const result = await prisma.bankAccount.aggregate({
        where: {
          userId,
          status: 'active',
        },
        _sum: { currentBalance: true },
      });

      return result._sum.latestBalance || 0;
    } catch (error) {
      console.error('[BankService] Error calculating active balance:', error);
      throw error;
    }
  }

  /**
   * Update account balance
   */
  async updateBalance(
    id: string,
    userId: string,
    newBalance: number,
    asOfDate: Date
  ): Promise<BankAccount> {
    try {
      return await prisma.bankAccount.update({
        where: { id },
        data: {
          currentBalance: newBalance,
          latestBalanceAsOf: asOfDate,
        },
      });
    } catch (error) {
      console.error('[BankService] Error updating balance:', error);
      throw error;
    }
  }

  /**
   * Get accounts by type
   */
  async getByType(userId: string, type: string): Promise<BankAccount[]> {
    try {
      return await prisma.bankAccount.findMany({
        where: {
          userId,
          accountType: type,
        },
      });
    } catch (error) {
      console.error('[BankService] Error getting by type:', error);
      throw error;
    }
  }

  /**
   * Check for duplicate accounts
   */
  async checkDuplicate(
    userId: string,
    bankName: string,
    accountType: string,
    accountNumber: string
  ): Promise<BankAccount | null> {
    try {
      return await prisma.bankAccount.findFirst({
        where: {
          userId,
          bankName: {
            mode: 'insensitive',
          },
          accountType,
          accountLast4,
        },
      });
    } catch (error) {
      console.error('[BankService] Error checking duplicate:', error);
      throw error;
    }
  }
}

export const bankService = new BankAccountService();