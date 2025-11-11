import { Request, Response } from 'express';
import { ErrorHandler } from '../middleware/errorHandler';
import { ClassroomService } from '../services/classroomService';
import { ValidationUtils } from '../utils/errorUtils';
import { CreateClassroomData, UpdateClassroomData } from '../types/classroom';

export class ClassroomController {
  /**
   * Create a new classroom
   */
  static createClassroom = ErrorHandler.asyncHandler(async (req: Request, res: Response) => {
    const { Name, Responsible, Description, State, SecretaryNote, Equipment, Capacity } = req.body;

    // Validate required fields
    ValidationUtils.validateRequired(Name, 'Name', req);
    ValidationUtils.validateRequired(Responsible, 'Responsible', req);
    ValidationUtils.validateRequired(Description, 'Description', req);
    ValidationUtils.validateRequired(Equipment, 'Equipment', req);
    ValidationUtils.validateRequired(Capacity, 'Capacity', req);
    ValidationUtils.validateRequired(State, 'State', req);

    // Validate specific fields
    ValidationUtils.validateLength(Name, 'Name', 1, 100, req);
    ValidationUtils.validateLength(Description, 'Description', 1, 500, req);
    ValidationUtils.validateCapacity(Capacity, req);
    ValidationUtils.validateState(State, req);

    const classroomData: CreateClassroomData = { 
      Name, 
      Responsible, 
      Description, 
      State, 
      SecretaryNote, 
      Equipment, 
      Capacity 
    };
    
    const classroom = await ClassroomService.createClassroom(classroomData);

    res.status(201).json({
      success: true,
      data: classroom,
      message: 'Classroom created successfully'
    });
  });

  /**
   * Get classroom by ID
   */
  static getClassroomById = ErrorHandler.asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    ValidationUtils.validateRequired(id, 'id', req);

    const classroom = await ClassroomService.getClassroomById(id);

    res.status(200).json({
      success: true,
      data: classroom
    });
  });

  /**
   * Get all classrooms
   */
  static getAllClassrooms = ErrorHandler.asyncHandler(async (req: Request, res: Response) => {
    const classrooms = await ClassroomService.getAllClassrooms();

    res.status(200).json({
      success: true,
      data: classrooms,
      count: classrooms.length
    });
  });

  /**
   * Update classroom
   */
  static updateClassroom = ErrorHandler.asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { Name, Responsible, Description, State, SecretaryNote, Equipment, Capacity } = req.body;

    ValidationUtils.validateRequired(id, 'id', req);

    // Validate specific fields if provided
    if (Name) {
      ValidationUtils.validateLength(Name, 'Name', 1, 100, req);
    }
    if (Description) {
      ValidationUtils.validateLength(Description, 'Description', 1, 500, req);
    }
    if (Capacity) {
      ValidationUtils.validateCapacity(Capacity, req);
    }
    if (State) {
      ValidationUtils.validateState(State, req);
    }

    const classroomData: UpdateClassroomData = { 
      Name, 
      Responsible, 
      Description, 
      State, 
      SecretaryNote, 
      Equipment, 
      Capacity 
    };
    
    const classroom = await ClassroomService.updateClassroom(id, classroomData);

    res.status(200).json({
      success: true,
      data: classroom,
      message: 'Classroom updated successfully'
    });
  });

  /**
   * Delete classroom
   */
  static deleteClassroom = ErrorHandler.asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    ValidationUtils.validateRequired(id, 'id', req);

    const result = await ClassroomService.deleteClassroom(id);

    res.status(200).json({
      success: true,
      data: result
    });
  });
}
