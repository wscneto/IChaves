import { Request, Response } from 'express';
import { ErrorHandler } from '../middleware/errorHandler';
import { UserService, CreateUserData, UpdateUserData } from '../services/userService';
import { ValidationUtils } from '../utils/errorUtils';

export class UserController {
  /**
   * Create a new user
   */
  static createUser = ErrorHandler.asyncHandler(async (req: Request, res: Response) => {
    const { Name, Email } = req.body;

    // Validate required fields
    ValidationUtils.validateRequired(Name, 'Name', req);
    ValidationUtils.validateRequired(Email, 'Email', req);

    // Validate email format
    ValidationUtils.validateEmail(Email, req);

    const userData: CreateUserData = { Name, Email };
    const user = await UserService.createUser(userData);

    res.status(201).json({
      success: true,
      data: user,
      message: 'User created successfully'
    });
  });

  /**
   * Get user by ID
   */
  static getUserById = ErrorHandler.asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    ValidationUtils.validateRequired(id, 'id', req);

    const user = await UserService.getUserById(id);

    res.status(200).json({
      success: true,
      data: user
    });
  });

  /**
   * Get user by email
   */
  static getUserByEmail = ErrorHandler.asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.query;

    ValidationUtils.validateRequired(email, 'email', req);
    ValidationUtils.validateEmail(email as string, req);

    const user = await UserService.getUserByEmail(email as string);

    res.status(200).json({
      success: true,
      data: user
    });
  });

  /**
   * Get all users
   */
  static getAllUsers = ErrorHandler.asyncHandler(async (req: Request, res: Response) => {
    const users = await UserService.getAllUsers();

    res.status(200).json({
      success: true,
      data: users,
      count: users.length
    });
  });

  /**
   * Update user
   */
  static updateUser = ErrorHandler.asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { Name, Email } = req.body;

    ValidationUtils.validateRequired(id, 'id', req);

    // Validate email format if provided
    if (Email) {
      ValidationUtils.validateEmail(Email, req);
    }

    const userData: UpdateUserData = { Name, Email };
    const user = await UserService.updateUser(id, userData);

    res.status(200).json({
      success: true,
      data: user,
      message: 'User updated successfully'
    });
  });

  /**
   * Delete user
   */
  static deleteUser = ErrorHandler.asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    ValidationUtils.validateRequired(id, 'id', req);

    const result = await UserService.deleteUser(id);

    res.status(200).json({
      success: true,
      data: result
    });
  });
}
