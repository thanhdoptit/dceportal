import helmet from 'helmet';

// Cấu hình security headers
export const securityHeaders = helmet({
  // Content Security Policy - TẠM TẮT để test
  contentSecurityPolicy: false,

  // XSS Protection
  xssFilter: true,

  // Prevent MIME type sniffing
  noSniff: true,

  // Hide powered by header
  hidePoweredBy: true,

  // HSTS (HTTP Strict Transport Security)
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true
  },

  // Frame options
  frameguard: {
    action: 'deny'
  },

  // Referrer Policy
  referrerPolicy: {
    policy: 'strict-origin-when-cross-origin'
  }
});

// Custom security middleware
export const customSecurityMiddleware = (req, res, next) => {
  // Remove server information
  res.removeHeader('X-Powered-By');
  res.removeHeader('Server');

  // Add custom security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

  // Rate limiting headers
  res.setHeader('X-RateLimit-Limit', '100');
  res.setHeader('X-RateLimit-Remaining', req.rateLimit?.remaining || 'unknown');
  res.setHeader('X-RateLimit-Reset', req.rateLimit?.resetTime || 'unknown');

  next();
};

// CORS security configuration
export const corsSecurity = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:8080',

      'https://10.10.33.150',
      'https://192.168.1.7',
      'http://192.168.1.7:8443',
      // Thêm domain production khi deploy
    ];

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'x-csrf-token'],
  exposedHeaders: ['Content-Disposition', 'X-RateLimit-Limit', 'X-RateLimit-Remaining'],
  maxAge: 86400 // 24 hours
};
