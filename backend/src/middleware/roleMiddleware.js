export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {


    if (!req.user) {
      console.log('❌ No user found in request');
      return res.status(403).json({ message: 'Không có quyền truy cập' });
    }

    // Chuyển đổi role thành chữ thường để so sánh
    const userRole = req.user.role?.toLowerCase();
    const allowedRolesLower = allowedRoles.flat().map(role => role.toLowerCase());

    if (!allowedRolesLower.includes(userRole)) {
      return res.status(403).json({ message: 'Không có quyền truy cập' });
    }

    next();
  };
};

/**
 * Middleware to check if user has manager role
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const isManager = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.user.role !== 'manager') {
    return res.status(403).json({ message: 'Access denied. Manager role required.' });
  }

  next();
};
