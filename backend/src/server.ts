import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { getCorsConfig } from './middleware/cors';
import { ErrorHandler, initializeErrorHandling } from './middleware/errorHandler';
import { AppError, ErrorCode } from './types/errors';
import pingService from './services/pingService';
import { createServer } from 'http';
import { initWebSocket } from './services/websocketService';

// Load environment variables
dotenv.config();

// Initialize global error handling
initializeErrorHandling();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration
app.use(cors(getCorsConfig()));

// Security middleware
app.use(helmet());

// Rate limiting for API endpoints (exclude health check and root endpoint)
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes default
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '1000000'), // limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests from this IP, please try again later.' },
  skip: (req) => {
    // Skip rate limiting for health check and root endpoint (critical for Render health checks)
    return req.path === '/health' || req.path === '/';
  }
});

app.use(limiter);

// Logging middleware
app.use(morgan('combined'));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Custom error handler for body parser errors (e.g., malformed JSON)
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof SyntaxError && 'body' in err) {
    const appError = new AppError(
      ErrorCode.VALIDATION_ERROR,
      'Malformed JSON in request body',
      400,
      { suggestion: 'Ensure your request body is valid JSON.' },
      true,
      (req.headers['x-request-id'] as string) || ErrorHandler['generateRequestId']()
    );
    return next(appError);
  }
  next(err);
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'IChaves Backend API',
    version: '1.0.0',
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    endpoints: {
      health: '/health',
      api: '/api',
      users: '/api/users',
      examples: '/api/examples'
    },
    documentation: 'https://github.com/JohnWKenny/IChaves-Backend'
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  // Log Render health checks for monitoring
  if (req.get('User-Agent')?.includes('Render')) {
    console.log('🏥 Render health check - Server is healthy');
  }
  
  // Log ping service health checks
  if (req.get('X-Ping-Service') === 'true') {
    console.log('🏥 Ping service health check - Server is healthy');
  }
  
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    pingService: pingService.getStatus()
  });
});

// API routes will be added here
import routes from './routes';
app.use('/api', routes);

// 404 handler (must be before error handler)
app.use(ErrorHandler.handleNotFound);

// Global error handling middleware (must be last)
app.use(ErrorHandler.handleError);

// Start server only when run directly
if (require.main === module) {
  const httpServer = createServer(app);
  initWebSocket(httpServer);

  httpServer.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Health check available at http://localhost:${PORT}/health`);
    console.log(`🌐 CORS enabled for frontend access`);
    
    // Iniciar serviço de ping para manter servidor ativo no Render
    pingService.start();
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('🛑 SIGTERM received, shutting down gracefully');
    pingService.stop();
    process.exit(0);
  });

  process.on('SIGINT', () => {
    console.log('🛑 SIGINT received, shutting down gracefully');
    pingService.stop();
    process.exit(0);
  });
}

export default app;