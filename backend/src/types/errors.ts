/**
 * Custom error types for the IChaves backend
 * Provides structured error handling with consistent response format
 */

export enum ErrorCode {
  // Authentication & Authorization
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  
  // Validation
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',
  
  // Database
  DATABASE_ERROR = 'DATABASE_ERROR',
  RECORD_NOT_FOUND = 'RECORD_NOT_FOUND',
  DUPLICATE_RECORD = 'DUPLICATE_RECORD',
  CONSTRAINT_VIOLATION = 'CONSTRAINT_VIOLATION',
  
  // Business Logic
  BUSINESS_RULE_VIOLATION = 'BUSINESS_RULE_VIOLATION',
  OPERATION_NOT_ALLOWED = 'OPERATION_NOT_ALLOWED',
  RESOURCE_CONFLICT = 'RESOURCE_CONFLICT',
  
  // External Services
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  
  // System
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  MAINTENANCE_MODE = 'MAINTENANCE_MODE',
  
  // CORS
  CORS_ERROR = 'CORS_ERROR',
}

export interface ErrorDetails {
  field?: string;
  value?: any;
  constraint?: string;
  expected?: any;
  actual?: any;
  suggestion?: string;
}

export interface AppErrorResponse {
  error: {
    code: ErrorCode;
    message: string;
    details?: ErrorDetails;
    timestamp: string;
    requestId?: string;
    path?: string;
    method?: string;
  };
  success: false;
}

/**
 * Base class for all application errors
 */
export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly details?: ErrorDetails;
  public readonly isOperational: boolean;
  public readonly timestamp: string;
  public readonly requestId?: string;

  constructor(
    code: ErrorCode,
    message: string,
    statusCode: number = 500,
    details?: ErrorDetails,
    isOperational: boolean = true,
    requestId?: string
  ) {
    super(message);
    
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = isOperational;
    this.timestamp = new Date().toISOString();
    this.requestId = requestId;

    // Maintains proper stack trace for where our error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * Convert error to API response format
   */
  toResponse(path?: string, method?: string): AppErrorResponse {
    return {
      error: {
        code: this.code,
        message: this.message,
        details: this.details,
        timestamp: this.timestamp,
        requestId: this.requestId,
        path,
        method,
      },
      success: false,
    };
  }
}

/**
 * Specific error classes for common scenarios
 */
export class ValidationError extends AppError {
  constructor(message: string, details?: ErrorDetails, requestId?: string) {
    super(ErrorCode.VALIDATION_ERROR, message, 400, details, true, requestId);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required', requestId?: string) {
    super(ErrorCode.UNAUTHORIZED, message, 401, undefined, true, requestId);
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Insufficient permissions', requestId?: string) {
    super(ErrorCode.FORBIDDEN, message, 403, undefined, true, requestId);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource', requestId?: string) {
    super(ErrorCode.RECORD_NOT_FOUND, `${resource} not found`, 404, undefined, true, requestId);
  }
}

export class ConflictError extends AppError {
  constructor(message: string, details?: ErrorDetails, requestId?: string) {
    super(ErrorCode.RESOURCE_CONFLICT, message, 409, details, true, requestId);
  }
}

export class DatabaseError extends AppError {
  constructor(message: string, originalError?: Error, requestId?: string) {
    super(
      ErrorCode.DATABASE_ERROR,
      message,
      500,
      originalError ? { suggestion: 'Please try again later' } : undefined,
      true,
      requestId
    );
  }
}

export class ExternalServiceError extends AppError {
  constructor(service: string, message: string, requestId?: string) {
    super(
      ErrorCode.EXTERNAL_SERVICE_ERROR,
      `External service error (${service}): ${message}`,
      502,
      { suggestion: 'Please try again later' },
      true,
      requestId
    );
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Too many requests', requestId?: string) {
    super(ErrorCode.RATE_LIMIT_EXCEEDED, message, 429, undefined, true, requestId);
  }
}

/**
 * Utility function to check if error is operational
 */
export function isOperationalError(error: Error): boolean {
  if (error instanceof AppError) {
    return error.isOperational;
  }
  return false;
}

/**
 * Utility function to create error from unknown error
 */
export function createErrorFromUnknown(error: unknown, requestId?: string): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof Error) {
    return new AppError(
      ErrorCode.INTERNAL_SERVER_ERROR,
      error.message,
      500,
      undefined,
      false,
      requestId
    );
  }

  return new AppError(
    ErrorCode.INTERNAL_SERVER_ERROR,
    'An unknown error occurred',
    500,
    undefined,
    false,
    requestId
  );
}
