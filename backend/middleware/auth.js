import { getSupabaseClient } from '../clients/supabaseClient.js';
import { ErrorResponse } from '../utils/errorResponse.js';

/**
 * Middleware to verify JWT token from Supabase
 * Expects Authorization header with Bearer token
 */
export const verifyAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log('[Auth.verifyAuth] start', {
      path: req.originalUrl,
      hasAuthHeader: !!authHeader
    });

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.warn('[Auth.verifyAuth] Missing or malformed Authorization header');
      return ErrorResponse.unauthorized('No token provided').send(res);
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const supabase = getSupabaseClient();

    // Verify the token
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      console.warn('[Auth.verifyAuth] Token invalid or expired', {
        path: req.originalUrl,
        error: error?.message
      });
      return ErrorResponse.unauthorized('Invalid or expired token').send(res);
    }

    // Attach user to request object
    req.user = user;
    console.log('[Auth.verifyAuth] success', { userId: user.id, path: req.originalUrl });
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
      console.log('[Auth.requireRole] fetched roles', {
        userId: req.user.id,
        roles,
        allowedRoles,
        path: req.originalUrl
      });
      let effectiveRoles = new Set(roles);
      
      // Fallback: If route allows 'student' and user is enrolled but missing role, backfill it
      if (allowedRoles.includes('student') && !effectiveRoles.has('student')) {
        try {
          const { data: enrollmentRows, error: enrollmentError } = await supabase
            .from('enrollments')
            .select('class_id')
            .eq('student_id', req.user.id)
            .limit(1);

          if (!enrollmentError && Array.isArray(enrollmentRows) && enrollmentRows.length > 0) {
            // Attempt to backfill the missing role
            const { error: backfillError } = await supabase
              .from('profile_roles')
              .insert({ profile_id: req.user.id, role: 'student' });

            if (backfillError) {
              const isConflict =
                (backfillError.message || '').toLowerCase().includes('duplicate key') ||
                (backfillError.code === '23505');
              if (!isConflict) {
                console.warn('Role backfill insert failed:', backfillError);
              }
            }

            effectiveRoles.add('student');
            console.log('[Auth.requireRole] backfilled student role based on enrollments', {
              userId: req.user.id
            });
          }
        } catch (fallbackErr) {
          console.warn('Role fallback check failed:', fallbackErr);
        }
      }
      
      // Check if user has any of the allowed roles
      const hasPermission = allowedRoles.some(role => effectiveRoles.has(role));
      console.log('[Auth.requireRole] decision', {
        userId: req.user.id,
        allowedRoles,
        effectiveRoles: Array.from(effectiveRoles),
        hasPermission,
        path: req.originalUrl
      });

      if (!hasPermission) {
        return ErrorResponse.forbidden('Insufficient permissions', {
          details: {
            allowedRoles,
            roles,
            effectiveRoles: Array.from(effectiveRoles)
          }
        }).send(res);
      }

      // Attach roles to request object
      req.userRoles = Array.from(effectiveRoles);
      next();
    } catch (err) {
      console.error('Role middleware error:', err);
      return ErrorResponse.forbidden('Permission check failed').send(res);
    }
  };
};

