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
        .select('role, profile_id')
        .eq('profile_id', req.user.id);

      if (error) {
        console.error('Role check error:', error);
        console.error('Error details:', error.message, error.code, error.details);
        return ErrorResponse.internalServerError(`Failed to verify user role: ${error.message}`).send(res);
      }
      
      console.log(`[Auth] Found ${userRoles?.length || 0} roles for user ${req.user.id}`);

      // Map roles and normalize them to strings (handle enum types)
      const roles = (userRoles || []).map(r => String(r.role).toLowerCase());
      const allowedRolesLower = allowedRoles.map(r => String(r).toLowerCase());
      
      console.log(`[Auth] User ${req.user.id} roles:`, roles);
      console.log(`[Auth] Required roles:`, allowedRolesLower);
      
      // Check if user has any of the allowed roles
      const hasPermission = allowedRolesLower.some(reqRole => roles.includes(reqRole));

      if (!hasPermission) {
        console.error(`[Auth] Permission denied. User roles: [${roles.join(', ')}], Required: [${allowedRolesLower.join(', ')}]`);
        return ErrorResponse.forbidden(`Insufficient permissions. Your roles: [${roles.join(', ')}]. Required: [${allowedRoles.join(', ')}]`).send(res);
      }
      
      console.log(`[Auth] Permission granted for user ${req.user.id}`);

      // Attach roles to request object
      req.userRoles = roles;
      next();
    } catch (err) {
      console.error('Role middleware error:', err);
      return ErrorResponse.forbidden('Permission check failed').send(res);
    }
  };
};

