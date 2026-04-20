import { User } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { BaseService } from './baseService';

export interface CreateUserInput {
  id?: string;
  email?: string;
  name?: string;
  phone?: string;
  profileType: string;
  status?: string;
  language?: string;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  phone?: string;
  dob?: Date;
  gender?: string;
  maritalStatus?: string;
  occupationType?: string;
  employerCompany?: string;
  language?: string;
  status?: string;
}

/**
 * User Service
 * Handles user account operations
 */
class UserService extends BaseService<User, CreateUserInput, UpdateUserInput> {
  constructor() {
    super(prisma.user);
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    try {
      return await prisma.user.findUnique({
        where: { email },
      });
    } catch (error) {
      console.error('[UserService] Error finding by email:', error);
      throw error;
    }
  }

  /**
   * Find user by phone
   */
  async findByPhone(phone: string): Promise<User | null> {
    try {
      return await prisma.user.findUnique({
        where: { phone },
      });
    } catch (error) {
      console.error('[UserService] Error finding by phone:', error);
      throw error;
    }
  }

  /**
   * Create or update user
   */
  async createOrUpdate(
    id: string,
    data: CreateUserInput
  ): Promise<User> {
    try {
      const existing = await this.findById(id);

      if (existing) {
        return await this.update(id, data as UpdateUserInput);
      }

      return await this.create({ ...data, id });
    } catch (error) {
      console.error('[UserService] Error creating or updating:', error);
      throw error;
    }
  }

  /**
   * Get user with full profile
   */
  async getUserWithProfile(userId: string): Promise<User | null> {
    try {
      return await prisma.user.findUnique({
        where: { id: userId },
        include: {
          familyMembers: true,
          educations: true,
          identityRecords: true,
          incomeStreams: true,
          expenses: true,
          bankAccounts: true,
          credentials: true,
        },
      });
    } catch (error) {
      console.error('[UserService] Error getting user with profile:', error);
      throw error;
    }
  }
}

export const userService = new UserService();
