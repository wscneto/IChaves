import { PrismaClient, User as PrismaUser, Prisma } from '@prisma/client';
import { AppError, ErrorCode } from '../types/errors';
import { UserCreationData } from '../types/authTypes';

const prisma = new PrismaClient();

export interface CreateUserData {
  Name: string;
  Email: string;
}

export interface UpdateUserData {
  Name?: string;
  Email?: string;
}

// Este é o tipo que o Prisma retorna quando usamos 'include'
type FullPrismaUser = PrismaUser & {
  Student: { Course: string, Period: string } | null;
  Admin: true | null; 
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

  /**
   * Encontra um usuário pelo email. Se não existir, cria um novo
   * com as relações corretas (Admin ou Student).
   */
  static async findOrCreateUserByEmail(data: UserCreationData): Promise<FullPrismaUser> 
  {
    try 
    {
      // Tenta encontrar o usuário primeiro
      const existingUser = await prisma.user.findUnique({
        where: { Email: data.Email },
        include: {
          Student: true, // Inclui dados de estudante, se houver
          Admin: true,   // Inclui dados de admin, se houver
        }
      });

      // CORREÇÃO 2: Se o usuário existe, retorne o objeto completo do Prisma
      if (existingUser) 
      {
        // O AuthService precisa do objeto real para pegar o ID e o 'role'
        return existingUser as FullPrismaUser;
      }

      // Se não existe, CRIA O USUÁRIO com as relações corretas
      
      // CORREÇÃO 3: O tipo aqui NÃO é JwtPayload.
      // Usamos 'any' para simplificar a adição de propriedades dinâmicas.
      const userCreationPayload: Prisma.UserCreateInput = {
        Name: data.Name,
        Email: data.Email,
      };

      // Adiciona a lógica de criação da relação
      if (data.StudentData) {
        // Lógica para criar um ALUNO
        userCreationPayload.Student = {
          create: {
            Course: data.StudentData.Course,
            Period: data.StudentData.Period,
          }
        };
      } else {
        // Lógica para criar um ADMIN
        userCreationPayload.Admin = {
          create: {} // Cria a relação de Admin
        };
      }

      // Cria o usuário e retorna o objeto completo
      const newUser = await prisma.user.create({
        data: userCreationPayload, // Agora 'data' está correto
        include: {
          Student: true,
          Admin: true,
        }
      });

      // CORREÇÃO 4: Retorna o novo usuário (que é do mesmo tipo que 'existingUser')
      return newUser as FullPrismaUser;

    } catch (error) 
    {
      // Logar o erro real pode ajudar no debug
      console.error("Erro em findOrCreateUserByEmail:", error);
      throw new AppError(
        ErrorCode.DATABASE_ERROR,
        'Falha ao encontrar ou criar usuário',
        500
      );
    }
  }

}
