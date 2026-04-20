import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

/**
 * Base Service Class
 * Provides common CRUD operations for all services
 */
export abstract class BaseService<T, CreateInput, UpdateInput> {
  protected model: any; // Prisma model

  constructor(model: any) {
    this.model = model;
  }

  /**
   * Find single record by ID
   */
  async findById(id: string): Promise<T | null> {
    try {
      return await this.model.findUnique({
        where: { id },
      });
    } catch (error) {
      console.error(`[${this.constructor.name}] Error finding by ID:`, error);
      throw error;
    }
  }

  /**
   * Find all records with filtering and pagination
   */
  async findMany(
    where?: any,
    options?: { skip?: number; take?: number; orderBy?: any }
  ): Promise<T[]> {
    try {
      return await this.model.findMany({
        where,
        skip: options?.skip || 0,
        take: options?.take || 100,
        orderBy: options?.orderBy,
      });
    } catch (error) {
      console.error(
        `[${this.constructor.name}] Error finding many:`,
        error
      );
      throw error;
    }
  }

  /**
   * Count records
   */
  async count(where?: any): Promise<number> {
    try {
      return await this.model.count({ where });
    } catch (error) {
      console.error(`[${this.constructor.name}] Error counting:`, error);
      throw error;
    }
  }

  /**
   * Create new record
   */
  async create(data: CreateInput): Promise<T> {
    try {
      return await this.model.create({ data });
    } catch (error) {
      console.error(`[${this.constructor.name}] Error creating:`, error);
      throw error;
    }
  }

  /**
   * Update record
   */
  async update(id: string, data: UpdateInput): Promise<T> {
    try {
      return await this.model.update({
        where: { id },
        data,
      });
    } catch (error) {
      console.error(`[${this.constructor.name}] Error updating:`, error);
      throw error;
    }
  }

  /**
   * Delete record
   */
  async delete(id: string): Promise<T> {
    try {
      return await this.model.delete({
        where: { id },
      });
    } catch (error) {
      console.error(`[${this.constructor.name}] Error deleting:`, error);
      throw error;
    }
  }

  /**
   * Delete many records
   */
  async deleteMany(where: any): Promise<{ count: number }> {
    try {
      return await this.model.deleteMany({ where });
    } catch (error) {
      console.error(
        `[${this.constructor.name}] Error deleting many:`,
        error
      );
      throw error;
    }
  }

  /**
   * Paginated query
   */
  async paginate(
    where?: any,
    page: number = 1,
    limit: number = 10,
    orderBy?: any
  ): Promise<{ data: T[]; total: number; page: number; limit: number }> {
    try {
      const skip = (page - 1) * limit;
      const [data, total] = await Promise.all([
        this.findMany(where, { skip, take: limit, orderBy }),
        this.count(where),
      ]);

      return {
        data,
        total,
        page,
        limit,
      };
    } catch (error) {
      console.error(`[${this.constructor.name}] Error paginating:`, error);
      throw error;
    }
  }
}
