import crypto from 'crypto';

// CSRF token storage (trong production nên dùng Redis)
const csrfTokens = new Map();

// Generate CSRF token
export const generateCSRFToken = (userId) => {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = Date.now() + (24 * 60 * 60 * 1000); // 24 hours
  
  csrfTokens.set(token, {
    userId,
    expiresAt,
    createdAt: Date.now()
  });
  
  // Cleanup expired tokens
  cleanupExpiredCSRFTokens();
  
  return token;
};

// Validate CSRF token
export const validateCSRFToken = (token, userId) => {
  if (!token || !userId) {
    return false;
  }
  
  const tokenData = csrfTokens.get(token);
  if (!tokenData) {
    return false;
  }
  
  // Check if token belongs to user
  if (tokenData.userId !== userId) {
    return false;
  }
  
  // Check if token is expired
  if (Date.now() > tokenData.expiresAt) {
    csrfTokens.delete(token);
    return false;
  }
  
  return true;
};

// Cleanup expired CSRF tokens
const cleanupExpiredCSRFTokens = () => {
  const now = Date.now();
  for (const [token, data] of csrfTokens.entries()) {
    if (now > data.expiresAt) {
      csrfTokens.delete(token);
    }
  }
};

// CSRF middleware
export const csrfProtection = (req, res, next) => {
  // Skip CSRF check for GET requests
  if (req.method === 'GET') {
    return next();
  }
  
  // Skip CSRF check for API endpoints that don't need it
  const skipCSRFPaths = [
    '/api/auth/login',
    '/api/auth/logout',
    '/uploads/',
    '/health'
  ];
  
  const shouldSkip = skipCSRFPaths.some(path => req.path.startsWith(path));
  if (shouldSkip) {
    return next();
  }
  
  // Get CSRF token from header or body
  const csrfToken = req.headers['x-csrf-token'] || req.body._csrf;
  const userId = req.user?.id;
  
  console.log('🔍 CSRF Check:', {
    path: req.path,
    method: req.method,
    hasToken: !!csrfToken,
    tokenPreview: csrfToken ? csrfToken.substring(0, 10) + '...' : 'none',
    userId: userId,
    headers: Object.keys(req.headers).filter(h => h.toLowerCase().includes('csrf'))
  });
  
  if (!validateCSRFToken(csrfToken, userId)) {
    console.log('❌ CSRF validation failed for path:', req.path);
    return res.status(403).json({
      success: false,
      message: 'CSRF token không hợp lệ hoặc đã hết hạn'
    });
  }
  
  console.log('✅ CSRF validation passed for path:', req.path);
  
  // Không xóa token ngay, để có thể dùng lại trong session
  // Token sẽ tự động hết hạn sau 24h
  
  next();
};

// Middleware to add CSRF token to response
export const addCSRFToken = (req, res, next) => {
  if (req.user) {
    const csrfToken = generateCSRFToken(req.user.id);
    res.setHeader('X-CSRF-Token', csrfToken);
    res.locals.csrfToken = csrfToken;
  }
  next();
}; 