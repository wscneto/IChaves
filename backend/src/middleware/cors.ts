import cors from 'cors';

/**
 * CORS configuration for the IChaves backend
 * Allows frontend access from specified origins
 */
export const corsOptions: cors.CorsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',    // Nuxt dev server default
      'http://127.0.0.1:3000',   // Alternative localhost
      'http://localhost:3001',    // Alternative port
      'http://127.0.0.1:3001',   // Alternative localhost port
      'https://login-externo.vercel.app', // External login system
      process.env.FRONTEND_URL,   // Production frontend URL
    ].filter(Boolean); // Remove undefined values

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`CORS: Blocked request from origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow cookies and authorization headers
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control',
    'Pragma',
  ],
  exposedHeaders: ['X-Total-Count'], // Custom headers that can be accessed by the frontend
  optionsSuccessStatus: 200, // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

/**
 * Development CORS configuration (more permissive)
 * Only use in development environment
 */
export const devCorsOptions: cors.CorsOptions = {
  origin: true, // Allow all origins in development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control',
    'Pragma',
  ],
  exposedHeaders: ['X-Total-Count'],
  optionsSuccessStatus: 200,
};

/**
 * Get the appropriate CORS configuration based on environment
 */
export function getCorsConfig(): cors.CorsOptions {
  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
    console.log('🔧 Using development/test CORS configuration (permissive)');
    return devCorsOptions;
  }
  
  console.log('🔒 Using production CORS configuration (restrictive)');
  return corsOptions;
}
