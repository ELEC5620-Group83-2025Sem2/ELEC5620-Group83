import { getSupabaseClient } from '../clients/supabaseClient.js';
import { ErrorResponse } from '../utils/errorResponse.js';

/**
 * Middleware to verify JWT token from Supabase
 * Expects Authorization header with Bearer token
 */
export const verifyAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return ErrorResponse.unauthorized('No token provided').send(res);
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const supabase = getSupabaseClient();

    // Verify the token
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return ErrorResponse.unauthorized('Invalid or expired token').send(res);
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    return ErrorResponse.unauthorized('Authentication failed').send(res);
  }
};

/**
 * Middleware to check if user has a specific role
 * @param {string[]} allowedRoles - Array of allowed roles
 */
export const requireRole = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return ErrorResponse.unauthorized('User not authenticated').send(res);
      }

      const supabase = getSupabaseClient();
      
      // Fetch user's roles
      const { data: userRoles, error } = await supabase
        .from('profile_roles')
        .select('role')
        .eq('profile_id', req.user.id);

      if (error) {
        console.error('Role check error:', error);
        return ErrorResponse.internalServerError('Failed to verify user role').send(res);
      }

      const roles = userRoles?.map(r => r.role) || [];
      
      // Check if user has any of the allowed roles
      const hasPermission = allowedRoles.some(role => roles.includes(role));

      if (!hasPermission) {
        return ErrorResponse.forbidden('Insufficient permissions').send(res);
      }

      // Attach roles to request object
      req.userRoles = roles;
      next();
    } catch (err) {
      console.error('Role middleware error:', err);
      return ErrorResponse.forbidden('Permission check failed').send(res);
    }
  };
};

