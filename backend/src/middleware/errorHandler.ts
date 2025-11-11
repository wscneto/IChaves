import { Request, Response, NextFunction } from 'express';
import { AppError, ErrorCode, createErrorFromUnknown, isOperationalError } from '../types/errors';

/**
 * Global error handling middleware
 * Acts as a safety net to catch all unhandled errors
 */
export class ErrorHandler {
    /**
     * Main error handling middleware
     */
    static handleError = (error: Error | AppError, req: Request, res: Response, next: NextFunction): void => {
        const requestId = (req.headers['x-request-id'] as string) || this.generateRequestId()

        // Log the error
        this.logError(error, req, requestId)

        // Convert unknown errors to AppError
        const appError = error instanceof AppError ? error : createErrorFromUnknown(error, requestId)

        // Send error response
        this.sendErrorResponse(appError, req, res)
    }

    /**
     * Handle 404 errors (route not found)
     */
    static handleNotFound = (req: Request, res: Response): void => {
        const requestId = (req.headers['x-request-id'] as string) || this.generateRequestId()

        const error = new AppError(
            ErrorCode.RECORD_NOT_FOUND,
            `Route ${req.originalUrl} not found`,
            404,
            undefined,
            true,
            requestId,
        )

        this.logError(error, req, requestId)
        this.sendErrorResponse(error, req, res)
    }

    /**
     * Handle async errors (wraps async route handlers)
     */
    static asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) => {
        return (req: Request, res: Response, next: NextFunction) => {
            Promise.resolve(fn(req, res, next)).catch(next)
        }
    }

    /**
     * Log error with context information
     */
    private static logError(error: Error, req: Request, requestId: string): void {
        const errorInfo = {
            requestId,
            timestamp: new Date().toISOString(),
            method: req.method,
            url: req.originalUrl,
            userAgent: req.get('User-Agent'),
            ip: req.ip || req.connection.remoteAddress,
            error: {
                name: error.name,
                message: error.message,
                stack: error.stack,
                isOperational: isOperationalError(error),
            },
        }

        // Log based on error severity
        if (error instanceof AppError) {
            if (error.statusCode >= 500) {
                console.error('🚨 SERVER ERROR:', JSON.stringify(errorInfo, null, 2))
            } else if (error.statusCode >= 400) {
                console.warn('⚠️ CLIENT ERROR:', JSON.stringify(errorInfo, null, 2))
            } else {
                console.info('ℹ️ INFO:', JSON.stringify(errorInfo, null, 2))
            }
        } else {
            console.error('💥 UNHANDLED ERROR:', JSON.stringify(errorInfo, null, 2))
        }

        // In production, you might want to send errors to external logging service
        if (process.env.NODE_ENV === 'production') {
            this.sendToExternalLogger(errorInfo)
        }
    }

    /**
     * Send error response to client
     */
    private static sendErrorResponse(error: AppError, req: Request, res: Response): void {
        const response = error.toResponse(req.originalUrl, req.method)

        // Don't send stack trace in production
        if (process.env.NODE_ENV === 'production' && error.statusCode >= 500) {
            response.error.message = 'Internal server error'
            delete response.error.details
        }

        res.status(error.statusCode).json(response)
    }

    /**
     * Generate unique request ID
     */
    private static generateRequestId(): string {
        return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }

    /**
     * Send error to external logging service (placeholder)
     */
    private static sendToExternalLogger(errorInfo: Record<string, unknown>): void {
        // TODO: Implement external logging service integration
        // Examples: Sentry, LogRocket, DataDog, etc.
        console.log('📤 Would send to external logger:', errorInfo.requestId)
    }
}

/**
 * Process-level error handlers
 * Catch errors that escape the Express error handling
 */
export class ProcessErrorHandler {
  /**
   * Handle uncaught exceptions
   */
  static handleUncaughtException = (): void => {
    process.on('uncaughtException', (error: Error) => {
      console.error('💥 UNCAUGHT EXCEPTION! Shutting down...');
      console.error('Error:', error);
      
      // Log to external service if available
      this.logCriticalError(error, 'uncaughtException');
      
      // Exit process
      process.exit(1);
    });
  };

  /**
   * Handle unhandled promise rejections
   */
  static handleUnhandledRejection = (): void => {
    process.on('unhandledRejection', (reason: unknown, promise: Promise<unknown>) => {
      console.error('💥 UNHANDLED REJECTION! Shutting down...');
      console.error('Promise:', promise);
      console.error('Reason:', reason);
      
      // Log to external service if available
      this.logCriticalError(reason, 'unhandledRejection');
      
      // Exit process
      process.exit(1);
    });
  };

  /**
   * Handle SIGTERM signal
   */
  static handleSigterm = (): void => {
    process.on('SIGTERM', () => {
      console.log('📡 SIGTERM received. Shutting down gracefully...');
      process.exit(0);
    });
  };

  /**
   * Log critical errors to external service
   */
  private static logCriticalError(error: unknown, type: string): void {
    const errorInfo = {
      type,
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
      } : error,
    };

    // TODO: Send to external logging service
    console.log('📤 Critical error logged:', errorInfo);
  }
}

/**
 * Initialize all error handlers
 */
export function initializeErrorHandling(): void {
  // Process-level handlers
  ProcessErrorHandler.handleUncaughtException();
  ProcessErrorHandler.handleUnhandledRejection();
  ProcessErrorHandler.handleSigterm();
  
  console.log('🛡️ Global error handling initialized');
}
