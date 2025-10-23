import { getSupabaseClient } from '../clients/supabaseClient.js';
import { ErrorResponse } from '../utils/errorResponse.js';

const login = async (req, res) => {
  try {
    const { email, password, role } = req.body || {};

    if (!email || !password) {
      return ErrorResponse.badRequest('Email and password are required').send(res);
    }

    if (!role || !['student', 'teacher'].includes(role)) {
      return ErrorResponse.badRequest('Valid role (student or teacher) is required').send(res);
    }

    const supabase = getSupabaseClient();
    
    // Sign in with email and password
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      return ErrorResponse.unauthorized('Invalid email or password').send(res);
    }

    // Fetch user profile and roles
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*, profile_roles(role)')
      .eq('id', authData.user.id)
      .single();

    if (profileError) {
      console.error('Profile fetch error:', profileError);
      return ErrorResponse.internalServerError('Failed to fetch user profile').send(res);
    }

    // Check if user has the requested role
    const userRoles = profile.profile_roles?.map(r => r.role) || [];
    if (!userRoles.includes(role)) {
      // Sign out the user since they don't have the correct role
      await supabase.auth.signOut();
      return ErrorResponse.forbidden(`You don't have ${role} access`).send(res);
    }

    // Return success response with user data and session
    return res.status(200).json({
      message: 'Login successful',
      user: {
        id: authData.user.id,
        email: authData.user.email,
        firstName: profile.first_name,
        lastName: profile.last_name,
        role: role,
        roles: userRoles,
      },
      session: {
        access_token: authData.session.access_token,
        refresh_token: authData.session.refresh_token,
        expires_at: authData.session.expires_at,
      }
    });

  } catch (err) {
    console.error('Login error:', err);
    return ErrorResponse.internalServerError(err.message).send(res);
  }
};

export { login };

