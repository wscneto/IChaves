import { PrismaClient } from '@prisma/client';
import { AppError, ErrorCode } from '../types/errors';

const prisma = new PrismaClient();

export interface CreateUserData {
  Name: string;
  Email: string;
}

export interface UpdateUserData {
  Name?: string;
  Email?: string;
}

export class UserService {
  /**
   * Create a new user
   */
  static async createUser(userData: CreateUserData) {
    try {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { Email: userData.Email }
      });

      if (existingUser) {
        throw new AppError(
          ErrorCode.RESOURCE_CONFLICT,
          'User with this email already exists',
          409
        );
      }

      // Create user
      const user = await prisma.user.create({
        data: {
          Name: userData.Name,
          Email: userData.Email,
        },
        select: {
          IDUser: true,
          Name: true,
          Email: true,
        }
      });

      return user;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        ErrorCode.DATABASE_ERROR,
        'Failed to create user',
        500
      );
    }
  }

  /**
   * Get user by ID
   */
  static async getUserById(id: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { IDUser: parseInt(id) },
        select: {
          IDUser: true,
          Name: true,
          Email: true,
          Student: {
            select: {
              Course: true,
              Period: true,
            }
          },
          Admin: true,
        }
      });

      if (!user) {
        throw new AppError(
          ErrorCode.RECORD_NOT_FOUND,
          'User not found',
          404
        );
      }

      return user;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        ErrorCode.DATABASE_ERROR,
        'Failed to fetch user',
        500
      );
    }
  }

  /**
   * Get user by email
   */
  static async getUserByEmail(email: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { Email: email },
        select: {
          IDUser: true,
          Name: true,
          Email: true,
          Student: {
            select: {
              Course: true,
              Period: true,
            }
          },
          Admin: true,
        }
      });

      if (!user) {
        throw new AppError(
          ErrorCode.RECORD_NOT_FOUND,
          'User not found',
          404
        );
      }

      return user;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        ErrorCode.DATABASE_ERROR,
        'Failed to fetch user',
        500
      );
    }
  }

  /**
   * Get all users
   */
  static async getAllUsers() {
    try {
      const users = await prisma.user.findMany({
        select: {
          IDUser: true,
          Name: true,
          Email: true,
        },
        orderBy: {
          IDUser: 'desc'
        }
      });

      return users;
    } catch {
      throw new AppError(
        ErrorCode.DATABASE_ERROR,
        'Failed to fetch users',
        500
      );
    }
  }

  /**
   * Update user
   */
  static async updateUser(id: string, userData: UpdateUserData) {
    try {
      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { IDUser: parseInt(id) }
      });

      if (!existingUser) {
        throw new AppError(
          ErrorCode.RECORD_NOT_FOUND,
          'User not found',
          404
        );
      }

      // Update user
      const user = await prisma.user.update({
        where: { IDUser: parseInt(id) },
        data: userData,
        select: {
          IDUser: true,
          Name: true,
          Email: true,
        }
      });

      return user;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        ErrorCode.DATABASE_ERROR,
        'Failed to update user',
        500
      );
    }
  }

  /**
   * Delete user
   */
  static async deleteUser(id: string) {
    try {
      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { IDUser: parseInt(id) }
      });

      if (!existingUser) {
        throw new AppError(
          ErrorCode.RECORD_NOT_FOUND,
          'User not found',
          404
        );
      }

      // Delete user
      await prisma.user.delete({
        where: { IDUser: parseInt(id) }
      });

      return { message: 'User deleted successfully' };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        ErrorCode.DATABASE_ERROR,
        'Failed to delete user',
        500
      );
    }
  }
}
