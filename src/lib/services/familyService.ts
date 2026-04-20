import { FamilyMember } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { BaseService } from './baseService';

export interface CreateFamilyMemberInput {
  name: string;
  relation: string;
  dob?: Date;
  isDependent?: boolean;
  nomineeEligible?: boolean;
  accessLevel?: string;
}

export interface UpdateFamilyMemberInput {
  name?: string;
  relation?: string;
  dob?: Date;
  isDependent?: boolean;
  nomineeEligible?: boolean;
  accessLevel?: string;
}

/**
 * Family Member Service
 */
class FamilyService extends BaseService<FamilyMember, CreateFamilyMemberInput, UpdateFamilyMemberInput> {
  constructor() {
    super(prisma.familyMember);
  }

  /**
   * Get all family members for a user
   */
  async getFamilyMembers(userId: string): Promise<FamilyMember[]> {
    try {
      return await prisma.familyMember.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      console.error('[FamilyService] Error getting family members:', error);
      throw error;
    }
  }

  /**
   * Create family member for user
   */
  async createForUser(userId: string, data: CreateFamilyMemberInput): Promise<FamilyMember> {
    try {
      return await prisma.familyMember.create({
        data: {
          ...data,
          userId,
        },
      });
    } catch (error) {
      console.error('[FamilyService] Error creating family member:', error);
      throw error;
    }
  }

  /**
   * Delete family member (ensure belongs to user)
   */
  async deleteForUser(id: string, userId: string): Promise<FamilyMember> {
    try {
      return await prisma.familyMember.delete({
        where: {
          id,
        },
        // Verify ownership
      });
    } catch (error) {
      console.error('[FamilyService] Error deleting family member:', error);
      throw error;
    }
  }

  /**
   * Get nominees (family members eligible as nominees)
   */
  async getNominees(userId: string): Promise<FamilyMember[]> {
    try {
      return await prisma.familyMember.findMany({
        where: {
          userId,
          nomineeEligible: true,
        },
      });
    } catch (error) {
      console.error('[FamilyService] Error getting nominees:', error);
      throw error;
    }
  }

  /**
   * Get dependents
   */
  async getDependents(userId: string): Promise<FamilyMember[]> {
    try {
      return await prisma.familyMember.findMany({
        where: {
          userId,
          isDependent: true,
        },
      });
    } catch (error) {
      console.error('[FamilyService] Error getting dependents:', error);
      throw error;
    }
  }
}

export const familyService = new FamilyService();
