import { PrismaClient } from '@prisma/client';
import { AppError, ErrorCode } from '../types/errors';
import { CreateClassroomData, UpdateClassroomData } from '../types/classroom';

const prisma = new PrismaClient();

export class ClassroomService {
  /**
   * Create a new classroom
   */
  static async createClassroom(classroomData: CreateClassroomData) {
    try {
      // Check if classroom with same name already exists
      const existingClassroom = await prisma.classroom.findFirst({
        where: { Name: classroomData.Name }
      });

      if (existingClassroom) {
        throw new AppError(
          ErrorCode.RESOURCE_CONFLICT,
          'Classroom with this name already exists',
          409
        );
      }

      // Create classroom
      const classroom = await prisma.classroom.create({
        data: {
          Name: classroomData.Name,
          Responsible: classroomData.Responsible,
          Description: classroomData.Description,
          State: classroomData.State,
          SecretaryNote: classroomData.SecretaryNote,
          Equipment: classroomData.Equipment,
          Capacity: classroomData.Capacity,
        },
        select: {
          IDClassroom: true,
          Name: true,
          Responsible: true,
          Description: true,
          State: true,
          SecretaryNote: true,
          Equipment: true,
          Capacity: true,
        }
      });

      return classroom;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        ErrorCode.DATABASE_ERROR,
        'Failed to create classroom',
        500
      );
    }
  }

  /**
   * Get classroom by ID
   */
  static async getClassroomById(id: string) {
    try {
      const classroom = await prisma.classroom.findUnique({
        where: { IDClassroom: parseInt(id) },
        select: {
          IDClassroom: true,
          Name: true,
          Responsible: true,
          Description: true,
          State: true,
          SecretaryNote: true,
          Equipment: true,
          Capacity: true,
        }
      });

      if (!classroom) {
        throw new AppError(
          ErrorCode.RECORD_NOT_FOUND,
          'Classroom not found',
          404
        );
      }

      return classroom;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        ErrorCode.DATABASE_ERROR,
        'Failed to fetch classroom',
        500
      );
    }
  }

  /**
   * Get all classrooms
   */
  static async getAllClassrooms() {
    try {
      const classrooms = await prisma.classroom.findMany({
        select: {
          IDClassroom: true,
          Name: true,
          Responsible: true,
          Description: true,
          State: true,
          SecretaryNote: true,
          Equipment: true,
          Capacity: true,
        },
        orderBy: {
          IDClassroom: 'desc'
        }
      });

      return classrooms;
    } catch {
      throw new AppError(
        ErrorCode.DATABASE_ERROR,
        'Failed to fetch classrooms',
        500
      );
    }
  }

  /**
   * Update classroom
   */
  static async updateClassroom(id: string, classroomData: UpdateClassroomData) {
    try {
      // Check if classroom exists
      const existingClassroom = await prisma.classroom.findUnique({
        where: { IDClassroom: parseInt(id) }
      });

      if (!existingClassroom) {
        throw new AppError(
          ErrorCode.RECORD_NOT_FOUND,
          'Classroom not found',
          404
        );
      }

      // Check if name is being updated and if it conflicts with existing classroom
      if (classroomData.Name && classroomData.Name !== existingClassroom.Name) {
        const nameConflict = await prisma.classroom.findFirst({
          where: { 
            Name: classroomData.Name,
            IDClassroom: { not: parseInt(id) }
          }
        });

        if (nameConflict) {
          throw new AppError(
            ErrorCode.RESOURCE_CONFLICT,
            'Classroom with this name already exists',
            409
          );
        }
      }

      // Update classroom
      const classroom = await prisma.classroom.update({
        where: { IDClassroom: parseInt(id) },
        data: classroomData,
        select: {
          IDClassroom: true,
          Name: true,
          Responsible: true,
          Description: true,
          State: true,
          SecretaryNote: true,
          Equipment: true,
          Capacity: true,
        }
      });

      return classroom;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        ErrorCode.DATABASE_ERROR,
        'Failed to update classroom',
        500
      );
    }
  }

  /**
   * Delete classroom
   */
  static async deleteClassroom(id: string) {
    try {
      // Check if classroom exists
      const existingClassroom = await prisma.classroom.findUnique({
        where: { IDClassroom: parseInt(id) }
      });

      if (!existingClassroom) {
        throw new AppError(
          ErrorCode.RECORD_NOT_FOUND,
          'Classroom not found',
          404
        );
      }

      // Check if classroom has associated histories
      const historiesCount = await prisma.history.count({
        where: { IDClassroomFK: parseInt(id) }
      });

      if (historiesCount > 0) {
        throw new AppError(
          ErrorCode.BUSINESS_RULE_VIOLATION,
          'Cannot delete classroom with associated histories',
          400
        );
      }

      // Delete classroom
      await prisma.classroom.delete({
        where: { IDClassroom: parseInt(id) }
      });

      return { message: 'Classroom deleted successfully' };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        ErrorCode.DATABASE_ERROR,
        'Failed to delete classroom',
        500
      );
    }
  }
}
