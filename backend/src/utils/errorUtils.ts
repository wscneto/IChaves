import { Request } from 'express';
import { 
  AppError, 
  ValidationError, 
  AuthenticationError, 
  AuthorizationError, 
  NotFoundError, 
  ConflictError, 
  DatabaseError,
  ExternalServiceError,
  RateLimitError,
  ErrorCode,
  ErrorDetails 
} from '../types/errors';
import { PrismaClient } from '@prisma/client';

// User interface for authentication
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'student' | null;
}

// Extended Request interface
export interface AuthenticatedRequest extends Request {
  user?: User;
}

//criei pra verificar se o usuario existe no BD
const prisma = new PrismaClient();

/**
 * Utility functions for throwing errors with consistent format
 */
export class ErrorUtils {
  /**
   * Get request ID from request headers
   */
  static getRequestId(req?: Request): string | undefined {
    return req?.headers['x-request-id'] as string;
  }

  /**
   * Throw validation error
   */
  static throwValidationError(message: string, details?: ErrorDetails, req?: Request): never {
    throw new ValidationError(message, details, this.getRequestId(req));
  }

  /**
   * Throw authentication error
   */
  static throwAuthError(message?: string, req?: Request): never {
    throw new AuthenticationError(message, this.getRequestId(req));
  }

  /**
   * Throw authorization error
   */
  static throwForbiddenError(message?: string, req?: Request): never {
    throw new AuthorizationError(message, this.getRequestId(req));
  }

  /**
   * Throw not found error
   */
  static throwNotFoundError(resource?: string, req?: Request): never {
    throw new NotFoundError(resource, this.getRequestId(req));
  }

  /**
   * Throw conflict error
   */
  static throwConflictError(message: string, details?: ErrorDetails, req?: Request): never {
    throw new ConflictError(message, details, this.getRequestId(req));
  }

  /**
   * Throw database error
   */
  static throwDatabaseError(message: string, originalError?: Error, req?: Request): never {
    throw new DatabaseError(message, originalError, this.getRequestId(req));
  }

  /**
   * Throw external service error
   */
  static throwExternalServiceError(service: string, message: string, req?: Request): never {
    throw new ExternalServiceError(service, message, this.getRequestId(req));
  }

  /**
   * Throw rate limit error
   */
  static throwRateLimitError(message?: string, req?: Request): never {
    throw new RateLimitError(message, this.getRequestId(req));
  }

  /**
   * Throw custom app error
   */
  static throwAppError(
    code: ErrorCode,
    message: string,
    statusCode: number = 500,
    details?: ErrorDetails,
    req?: Request
  ): never {
    throw new AppError(code, message, statusCode, details, true, this.getRequestId(req));
  }
}

/**
 * Validation helpers
 */
export class ValidationUtils {
  /**
   * Validate required field
   */
  static validateRequired(value: unknown, fieldName: string, req?: Request): void {
    if (value === undefined || value === null || value === '') {
      ErrorUtils.throwValidationError(
        `${fieldName} is required`,
        { field: fieldName, value },
        req
      );
    }
  }

  /**
   * Validate email format
   */
  static validateEmail(email: string, req?: Request): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      ErrorUtils.throwValidationError(
        'Invalid email format',
        { field: 'email', value: email, expected: 'valid email format' },
        req
      );
    }
  }

  /**
   * Validate string length
   */
  static validateLength(value: string, fieldName: string, min: number, max: number, req?: Request): void {
    if (value.length < min) {
      ErrorUtils.throwValidationError(
        `${fieldName} must be at least ${min} characters long`,
        { field: fieldName, value, expected: `minimum ${min} characters` },
        req
      );
    }

    if (value.length > max) {
      ErrorUtils.throwValidationError(
        `${fieldName} must be no more than ${max} characters long`,
        { field: fieldName, value, expected: `maximum ${max} characters` },
        req
      );
    }
  }

  /**
   * Validate numeric range
   */
  static validateRange(value: number, fieldName: string, min: number, max: number, req?: Request): void {
    if (value < min || value > max) {
      ErrorUtils.throwValidationError(
        `${fieldName} must be between ${min} and ${max}`,
        { field: fieldName, value, expected: `range ${min}-${max}` },
        req
      );
    }
  }

  /**
   * Validate array length
   */
  static validateArrayLength(value: unknown[], fieldName: string, min: number, max: number, req?: Request): void {
    if (value.length < min) {
      ErrorUtils.throwValidationError(
        `${fieldName} must contain at least ${min} items`,
        { field: fieldName, value: value.length, expected: `minimum ${min} items` },
        req
      );
    }

    if (value.length > max) {
      ErrorUtils.throwValidationError(
        `${fieldName} must contain no more than ${max} items`,
        { field: fieldName, value: value.length, expected: `maximum ${max} items` },
        req
      );
    }
  }

  /**
   * Validate classroom capacity (positive number)
   */
  static validateCapacity(capacity: number, req?: Request): void {
    if (!Number.isInteger(capacity) || capacity <= 0) {
      ErrorUtils.throwValidationError(
        'Capacity must be a positive integer',
        { field: 'Capacity', value: capacity, expected: 'positive integer' },
        req
      );
    }
  }

  /**
   * Validate classroom state
   */
  static validateState(state: string, req?: Request): void {
    const validStates = ['Disponivel', 'Em uso', 'Indisponivel'];
    if (!validStates.includes(state)) {
      ErrorUtils.throwValidationError(
        `State must be one of: ${validStates.join(', ')}`,
        { field: 'State', value: state, expected: validStates },
        req
      );
    }
  }

  //validate if user exists

  static async  validateUserExists(IDUserFK:string, req?: Request) {
    const user = await prisma.user.findUnique({
      where: { IDUser: parseInt(IDUserFK) },
      select: { IDUser: true }
    });

    if (!user) {
      ErrorUtils.throwValidationError(
        'User not found',
      );
    }

  }
}

/**
 * Database operation helpers
 */
export class DatabaseUtils {
  /**
   * Handle database connection errors
   */
  static handleConnectionError(error: Error, req?: Request): never {
    ErrorUtils.throwDatabaseError(
      'Database connection failed',
      error,
      req
    );
  }

  /**
   * Handle database query errors
   */
  static handleQueryError(error: Error, operation: string, req?: Request): never {
    ErrorUtils.throwDatabaseError(
      `Database ${operation} failed`,
      error,
      req
    );
  }

  /**
   * Handle unique constraint violations
   */
  static handleUniqueConstraintError(error: Error, field: string, req?: Request): never {
    ErrorUtils.throwConflictError(
      `${field} already exists`,
      { field, constraint: 'unique' },
      req
    );
  }

  /**
   * Handle foreign key constraint violations
   */
  static handleForeignKeyError(error: Error, field: string, req?: Request): never {
    ErrorUtils.throwValidationError(
      `Invalid ${field} reference`,
      { field, constraint: 'foreign_key' },
      req
    );
  }
}

/**
 * Authentication helpers
 */
export class AuthUtils {
  /**
   * Check if user is authenticated
   */
  static requireAuth(req: AuthenticatedRequest): void {
    if (!req.user) {
      ErrorUtils.throwAuthError('Authentication required', req);
    }
  }

  /**
   * Check if user has specific role
   */
  static requireRole(role: string, req: AuthenticatedRequest): void {
    this.requireAuth(req);
    
    if (!req.user?.role?.includes(role)) {
      ErrorUtils.throwForbiddenError(`Role '${role}' required`, req);
    }
  }

  /**
   * Check if user owns resource
   */
  static requireOwnership(userId: string, resourceUserId: string, req: AuthenticatedRequest): void {
    this.requireAuth(req);
    
    if (userId !== resourceUserId) {
      ErrorUtils.throwForbiddenError('Access denied: resource ownership required', req);
    }
  }
}

/**
 * External service helpers
 */
export class ServiceUtils {
  /**
   * Handle external API errors
   */
  static handleApiError(service: string, error: Error, req?: Request): never {
    ErrorUtils.throwExternalServiceError(
      service,
      error.message,
      req
    );
  }

  /**
   * Handle timeout errors
   */
  static handleTimeoutError(service: string, timeout: number, req?: Request): never {
    ErrorUtils.throwExternalServiceError(
      service,
      `Request timeout after ${timeout}ms`,
      req
    );
  }

  /**
   * Handle rate limit errors from external services
   */
  static handleServiceRateLimit(service: string, retryAfter?: number, req?: Request): never {
    const message = retryAfter 
      ? `Service rate limit exceeded. Retry after ${retryAfter} seconds`
      : 'Service rate limit exceeded';
      
    ErrorUtils.throwExternalServiceError(service, message, req);
  }
}
import { Request } from 'express';
import { 
  AppError, 
  ValidationError, 
  AuthenticationError, 
  AuthorizationError, 
  NotFoundError, 
  ConflictError, 
  DatabaseError,
  ExternalServiceError,
  RateLimitError,
  ErrorCode,
  ErrorDetails 
} from '../types/errors';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// User interface for authentication
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'student' | null;
}

// Extended Request interface
export interface AuthenticatedRequest extends Request {
  user?: User;
}

/**
 * Utility functions for throwing errors with consistent format
 */
export class ErrorUtils {
  /**
   * Get request ID from request headers
   */
  static getRequestId(req?: Request): string | undefined {
    return req?.headers['x-request-id'] as string;
  }

  /**
   * Throw validation error
   */
  static throwValidationError(message: string, details?: ErrorDetails, req?: Request): never {
    throw new ValidationError(message, details, this.getRequestId(req));
  }

  /**
   * Throw authentication error
   */
  static throwAuthError(message?: string, req?: Request): never {
    throw new AuthenticationError(message, this.getRequestId(req));
  }

  /**
   * Throw authorization error
   */
  static throwForbiddenError(message?: string, req?: Request): never {
    throw new AuthorizationError(message, this.getRequestId(req));
  }

  /**
   * Throw not found error
   */
  static throwNotFoundError(resource?: string, req?: Request): never {
    throw new NotFoundError(resource, this.getRequestId(req));
  }

  /**
   * Throw conflict error
   */
  static throwConflictError(message: string, details?: ErrorDetails, req?: Request): never {
    throw new ConflictError(message, details, this.getRequestId(req));
  }

  /**
   * Throw database error
   */
  static throwDatabaseError(message: string, originalError?: Error, req?: Request): never {
    throw new DatabaseError(message, originalError, this.getRequestId(req));
  }

  /**
   * Throw external service error
   */
  static throwExternalServiceError(service: string, message: string, req?: Request): never {
    throw new ExternalServiceError(service, message, this.getRequestId(req));
  }

  /**
   * Throw rate limit error
   */
  static throwRateLimitError(message?: string, req?: Request): never {
    throw new RateLimitError(message, this.getRequestId(req));
  }

  /**
   * Throw custom app error
   */
  static throwAppError(
    code: ErrorCode,
    message: string,
    statusCode: number = 500,
    details?: ErrorDetails,
    req?: Request
  ): never {
    throw new AppError(code, message, statusCode, details, true, this.getRequestId(req));
  }
}

/**
 * Validation helpers
 */
export class ValidationUtils {
  /**
   * Validate required field
   */
  static validateRequired(value: unknown, fieldName: string, req?: Request): void {
    if (value === undefined || value === null || value === '') {
      ErrorUtils.throwValidationError(
        `${fieldName} is required`,
        { field: fieldName, value },
        req
      );
    }
  }

  /**
   * Validate email format
   */
  static validateEmail(email: string, req?: Request): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      ErrorUtils.throwValidationError(
        'Invalid email format',
        { field: 'email', value: email, expected: 'valid email format' },
        req
      );
    }
  }

  /**
   * Validate string length
   */
  static validateLength(value: string, fieldName: string, min: number, max: number, req?: Request): void {
    if (value.length < min) {
      ErrorUtils.throwValidationError(
        `${fieldName} must be at least ${min} characters long`,
        { field: fieldName, value, expected: `minimum ${min} characters` },
        req
      );
    }

    if (value.length > max) {
      ErrorUtils.throwValidationError(
        `${fieldName} must be no more than ${max} characters long`,
        { field: fieldName, value, expected: `maximum ${max} characters` },
        req
      );
    }
  }

  /**
   * Validate numeric range
   */
  static validateRange(value: number, fieldName: string, min: number, max: number, req?: Request): void {
    if (value < min || value > max) {
      ErrorUtils.throwValidationError(
        `${fieldName} must be between ${min} and ${max}`,
        { field: fieldName, value, expected: `range ${min}-${max}` },
        req
      );
    }
  }

  /**
   * Validate array length
   */
  static validateArrayLength(value: unknown[], fieldName: string, min: number, max: number, req?: Request): void {
    if (value.length < min) {
      ErrorUtils.throwValidationError(
        `${fieldName} must contain at least ${min} items`,
        { field: fieldName, value: value.length, expected: `minimum ${min} items` },
        req
      );
    }

    if (value.length > max) {
      ErrorUtils.throwValidationError(
        `${fieldName} must contain no more than ${max} items`,
        { field: fieldName, value: value.length, expected: `maximum ${max} items` },
        req
      );
    }
  }

  /**
   * Validate classroom capacity (positive number)
   */
  static validateCapacity(capacity: number, req?: Request): void {
    if (!Number.isInteger(capacity) || capacity <= 0) {
      ErrorUtils.throwValidationError(
        'Capacity must be a positive integer',
        { field: 'Capacity', value: capacity, expected: 'positive integer' },
        req
      );
    }
  }

  /**
   * Validate classroom state
   */
  static validateState(state: string, req?: Request): void {
    const validStates = ['Disponivel', 'Em uso', 'Indisponivel'];
    if (!validStates.includes(state)) {
      ErrorUtils.throwValidationError(
        `State must be one of: ${validStates.join(', ')}`,
        { field: 'State', value: state, expected: validStates },
        req
      );
    }
  }

  /**
   * Validate if user exists
   */
  static async validateUserExists(userId: number, req?: Request): Promise<void> {
    const user = await prisma.user.findUnique({ where: { IDUser: userId } });
    if (!user) {
      ErrorUtils.throwNotFoundError('User not found', req);
    }
  }

  /**
   * Validate if classroom exists
   */
  static async validateClassroomExists(classroomId: number, req?: Request): Promise<void> {
    const classroom = await prisma.classroom.findUnique({ where: { IDClassroom: classroomId } });
    if (!classroom) {
      ErrorUtils.throwNotFoundError('Classroom not found', req);
    }
  }

  /**
   * Validate date format (ISO 8601)
   */
  static validateDate(date: string, fieldName: string, req?: Request): void {
    const iso8601Regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;
    if (!iso8601Regex.test(date)) {
      ErrorUtils.throwValidationError(
        `Invalid date format for ${fieldName}. Expected ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ)`,
        { field: fieldName, value: date, expected: 'ISO 8601 format' },
   * Validate action type
   */
  static validateActionType(actionType: string, req?: Request): void {
    const validActions = ['reservar', 'trocar', 'devolver', 'solicitar', 'suspender', 'liberar'];
    if (!validActions.includes(actionType)) {
      ErrorUtils.throwValidationError(
        `Action type must be one of: ${validActions.join(', ')}`,
        { field: 'ActionType', value: actionType, expected: validActions },
        req
      );
    }
  }

  /**
   * Validate user role
   */
  static validateUserRole(role: string, req?: Request): void {
    const validRoles = ['admin', 'student'];
    if (!validRoles.includes(role)) {
      ErrorUtils.throwValidationError(
        `User role must be one of: ${validRoles.join(', ')}`,
        { field: 'Role', value: role, expected: validRoles },
        req
      );
    }
  }

  /**
   * Validate classroom ID
   */
  static validateClassroomID(classroomID: number, req?: Request): void {
    if (!Number.isInteger(classroomID) || classroomID <= 0) {
      ErrorUtils.throwValidationError(
        'Classroom ID must be a positive integer',
        { field: 'IDClassroomFK', value: classroomID, expected: 'positive integer' },
        req
      );
    }
  }

  /**
   * Validate user ID
   */
  static validateUserID(userID: number, req?: Request): void {
    if (!Number.isInteger(userID) || userID <= 0) {
      ErrorUtils.throwValidationError(
        'User ID must be a positive integer',
        { field: 'UserID', value: userID, expected: 'positive integer' },
        req
      );
    }
  }

  /**
   * Validate target user ID for transfer actions
   */
  static validateTargetUserID(targetUserID: number, req?: Request): void {
    if (!Number.isInteger(targetUserID) || targetUserID <= 0) {
      ErrorUtils.throwValidationError(
        'Target user ID must be a positive integer',
        { field: 'TargetUserID', value: targetUserID, expected: 'positive integer' },
        req
      );
    }
  }

  /**
   * Validate date range (end date > start date)
   */
  static validateDateRange(startDate: string, endDate: string, req?: Request): void {
    if (new Date(endDate) <= new Date(startDate)) {
      ErrorUtils.throwValidationError(
        'End date must be after start date',
        { 
          field: 'ReturnDate', 
          value: endDate, 
          expected: `> ${startDate}` 
        },
        req
      );
    }
   * Validate suspension reason
   */
  static validateSuspensionReason(reason: string, req?: Request): void {
    if (!reason || typeof reason !== 'string') {
      ErrorUtils.throwValidationError(
        'Suspension reason is required',
        { field: 'Reason', value: reason, expected: 'non-empty string' },
        req
      );
    }
    
    if (reason.length < 5) {
      ErrorUtils.throwValidationError(
        'Suspension reason must be at least 5 characters long',
        { field: 'Reason', value: reason, expected: 'minimum 5 characters' },
        req
      );
    }
    
    if (reason.length > 200) {
      ErrorUtils.throwValidationError(
        'Suspension reason must be no more than 200 characters long',
        { field: 'Reason', value: reason, expected: 'maximum 200 characters' },
        req
      );
    }
  }

  /**
   * Validate notes field
   */
  static validateNotes(notes: string | undefined, fieldName: string = 'Notes', req?: Request): void {
    if (notes !== undefined) {
      if (typeof notes !== 'string') {
        ErrorUtils.throwValidationError(
          `${fieldName} must be a string`,
          { field: fieldName, value: notes, expected: 'string' },
          req
        );
      }
      
      if (notes.length > 500) {
        ErrorUtils.throwValidationError(
          `${fieldName} must be no more than 500 characters long`,
          { field: fieldName, value: notes, expected: 'maximum 500 characters' },
          req
        );
      }
    }
  }

  /**
   * Validate action request data based on action type
   */
  static validateActionRequest(actionType: string, data: Record<string, unknown>, req?: Request): void {
    this.validateActionType(actionType, req);
    
    // Common validations
    if (typeof data.IDClassroomFK === 'number') {
      this.validateClassroomID(data.IDClassroomFK, req);
    }
    if (typeof data.Notes === 'string' || data.Notes === undefined) {
      this.validateNotes(data.Notes, 'Notes', req);
    }
    
    // Action-specific validations
    switch (actionType) {
      case 'trocar':
      case 'solicitar':
        if (typeof data.TargetUserID === 'number') {
          this.validateTargetUserID(data.TargetUserID, req);
        }
        break;
      case 'suspender':
        if (typeof data.Reason === 'string') {
          this.validateSuspensionReason(data.Reason, req);
        }
        break;
    }
  }
}

/**
 * Database operation helpers
 */
export class DatabaseUtils {
  /**
   * Handle database connection errors
   */
  static handleConnectionError(error: Error, req?: Request): never {
    ErrorUtils.throwDatabaseError(
      'Database connection failed',
      error,
      req
    );
  }

  /**
   * Handle database query errors
   */
  static handleQueryError(error: Error, operation: string, req?: Request): never {
    ErrorUtils.throwDatabaseError(
      `Database ${operation} failed`,
      error,
      req
    );
  }

  /**
   * Handle unique constraint violations
   */
  static handleUniqueConstraintError(error: Error, field: string, req?: Request): never {
    ErrorUtils.throwConflictError(
      `${field} already exists`,
      { field, constraint: 'unique' },
      req
    );
  }

  /**
   * Handle foreign key constraint violations
   */
  static handleForeignKeyError(error: Error, field: string, req?: Request): never {
    ErrorUtils.throwValidationError(
      `Invalid ${field} reference`,
      { field, constraint: 'foreign_key' },
      req
    );
  }
}

/**
 * Authentication helpers
 */
export class AuthUtils {
  /**
   * Check if user is authenticated
   */
  static requireAuth(req: AuthenticatedRequest): void {
    if (!req.user) {
      ErrorUtils.throwAuthError('Authentication required', req);
    }
  }

  /**
   * Check if user has specific role
   */
  static requireRole(role: string, req: AuthenticatedRequest): void {
    this.requireAuth(req);
    
    if (!req.user?.role?.includes(role)) {
      ErrorUtils.throwForbiddenError(`Role '${role}' required`, req);
    }
  }

  /**
   * Check if user owns resource
   */
  static requireOwnership(userId: string, resourceUserId: string, req: AuthenticatedRequest): void {
    this.requireAuth(req);
    
    if (userId !== resourceUserId) {
      ErrorUtils.throwForbiddenError('Access denied: resource ownership required', req);
    }
  }
}

/**
 * External service helpers
 */
export class ServiceUtils {
  /**
   * Handle external API errors
   */
  static handleApiError(service: string, error: Error, req?: Request): never {
    ErrorUtils.throwExternalServiceError(
      service,
      error.message,
      req
    );
  }

  /**
   * Handle timeout errors
   */
  static handleTimeoutError(service: string, timeout: number, req?: Request): never {
    ErrorUtils.throwExternalServiceError(
      service,
      `Request timeout after ${timeout}ms`,
      req
    );
  }

  /**
   * Handle rate limit errors from external services
   */
  static handleServiceRateLimit(service: string, retryAfter?: number, req?: Request): never {
    const message = retryAfter 
      ? `Service rate limit exceeded. Retry after ${retryAfter} seconds`
      : 'Service rate limit exceeded';
      
    ErrorUtils.throwExternalServiceError(service, message, req);
  }
}
