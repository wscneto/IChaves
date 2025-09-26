import { Router } from 'express';
import { ErrorHandler } from '../middleware/errorHandler';
import { ErrorUtils, ValidationUtils, AuthUtils } from '../utils/errorUtils';
import { ErrorCode } from '../types/errors';

const router = Router();

/**
 * Example routes demonstrating error handling
 */

// GET /api/examples/validation - Demonstrates validation errors
router.get('/validation', ErrorHandler.asyncHandler(async (req, res) => {
  const { email, password, age } = req.query;

  // Validate required fields
  ValidationUtils.validateRequired(email, 'email', req);
  ValidationUtils.validateRequired(age, 'age', req);

  // Validate email format
  ValidationUtils.validateEmail(email as string, req);

  // Validate age range
  const ageNum = parseInt(age as string);
  if (isNaN(ageNum)) {
    ErrorUtils.throwValidationError('Age must be a number', { field: 'age', value: age }, req);
  }
  ValidationUtils.validateRange(ageNum, 'age', 18, 100, req);

  res.json({
    success: true,
    message: 'All validations passed',
    data: { email, age: ageNum }
  });
}));

// GET /api/examples/auth - Demonstrates authentication errors
router.get('/auth', ErrorHandler.asyncHandler(async (req, res) => {
  // Simulate authentication check
  const token = req.headers.authorization;
  
  if (!token) {
    ErrorUtils.throwAuthError('Authorization token required', req);
  }

  if (token !== 'Bearer valid-token') {
    ErrorUtils.throwAuthError('Invalid token', req);
  }

  res.json({
    success: true,
    message: 'Authentication successful',
    user: { id: 1, name: 'John Doe' }
  });
}));

// GET /api/examples/forbidden - Demonstrates authorization errors
router.get('/forbidden', ErrorHandler.asyncHandler(async (req, res) => {
  // Simulate user with limited permissions
  const user = { id: '1', roles: ['user'] };
  (req as any).user = user;

  // Try to access admin resource
  AuthUtils.requireRole('admin', req);

  res.json({
    success: true,
    message: 'Admin access granted'
  });
}));

// GET /api/examples/not-found - Demonstrates not found errors
router.get('/not-found', ErrorHandler.asyncHandler(async (req) => {
  // Simulate resource not found
  ErrorUtils.throwNotFoundError('User', req);
}));

// GET /api/examples/conflict - Demonstrates conflict errors
router.get('/conflict', ErrorHandler.asyncHandler(async (req) => {
  const { email } = req.query;
  
  // Simulate duplicate resource
  ErrorUtils.throwConflictError(
    'Email already exists',
    { field: 'email', value: email },
    req
  );
}));

// GET /api/examples/database - Demonstrates database errors
router.get('/database', ErrorHandler.asyncHandler(async (req) => {
  // Simulate database error
  const dbError = new Error('Connection timeout');
  ErrorUtils.throwDatabaseError('Failed to fetch user data', dbError, req);
}));

// GET /api/examples/external-service - Demonstrates external service errors
router.get('/external-service', ErrorHandler.asyncHandler(async (req) => {
  // Simulate external service error
  ErrorUtils.throwExternalServiceError('Payment Gateway', 'Service unavailable', req);
}));

// GET /api/examples/rate-limit - Demonstrates rate limit errors
router.get('/rate-limit', ErrorHandler.asyncHandler(async (req) => {
  // Simulate rate limit exceeded
  ErrorUtils.throwRateLimitError('Too many requests from this IP', req);
}));

// GET /api/examples/custom-error - Demonstrates custom errors
router.get('/custom-error', ErrorHandler.asyncHandler(async (req) => {
  // Simulate custom business logic error
  ErrorUtils.throwAppError(
    ErrorCode.BUSINESS_RULE_VIOLATION,
    'Cannot perform this action during maintenance',
    400,
    { suggestion: 'Please try again after maintenance window' },
    req
  );
}));

// GET /api/examples/unhandled - Demonstrates unhandled errors
router.get('/unhandled', ErrorHandler.asyncHandler(async () => {
  // This will be caught by the global error handler
  throw new Error('This is an unhandled error');
}));

// GET /api/examples/success - Demonstrates successful response
router.get('/success', ErrorHandler.asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: 'Request processed successfully',
    data: {
      timestamp: new Date().toISOString(),
      requestId: req.headers['x-request-id']
    }
  });
}));

export default router;
