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
  static validateRequired(value: any, fieldName: string, req?: Request): void {
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
  static validateArrayLength(value: any[], fieldName: string, min: number, max: number, req?: Request): void {
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
  static requireAuth(req: Request): void {
    if (!(req as any).user) {
      ErrorUtils.throwAuthError('Authentication required', req);
    }
  }

  /**
   * Check if user has specific role
   */
  static requireRole(role: string, req: Request): void {
    this.requireAuth(req);
    
    if (!(req as any).user?.roles?.includes(role)) {
      ErrorUtils.throwForbiddenError(`Role '${role}' required`, req);
    }
  }

  /**
   * Check if user owns resource
   */
  static requireOwnership(userId: string, resourceUserId: string, req: Request): void {
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
