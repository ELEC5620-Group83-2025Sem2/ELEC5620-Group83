import { getSupabaseClient } from '../clients/supabaseClient.js';
import { ErrorResponse } from '../utils/errorResponse.js';

const signUp = async (req, res) => {
  try {
    const { email, password, firstName, lastName, role, classCode } = req.body || {};

    if (!email || !password || !firstName || !lastName) {
      return ErrorResponse.badRequest('Email, password, first name, and last name are required').send(res);
    }

    if (!role || !['student', 'teacher'].includes(role)) {
      return ErrorResponse.badRequest('Valid role (student or teacher) is required').send(res);
    }

    // For students, class code is required
    if (role === 'student' && !classCode) {
      return ErrorResponse.badRequest('Class code is required for student registration').send(res);
    }

    const supabase = getSupabaseClient();
    
    // Sign up the user
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    });

    if (signUpError) {
      console.error('Signup error:', signUpError);
      return ErrorResponse.badRequest(signUpError.message).send(res);
    }

    if (!signUpData.user) {
      return ErrorResponse.internalServerError('User creation failed').send(res);
    }

    const userId = signUpData.user.id;

    // Create profile (should be handled by trigger, but we'll do it explicitly for safety)
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        first_name: firstName,
        last_name: lastName,
        email: email,
      });

    if (profileError) {
      console.error('Profile creation error:', profileError);
      // Continue anyway as trigger might have created it
    }

    // Assign role to the user
    const { error: roleError } = await supabase
      .from('profile_roles')
      .insert({
        profile_id: userId,
        role: role,
      });

    if (roleError) {
      console.error('Role assignment error:', roleError);
      return ErrorResponse.internalServerError('Failed to assign user role').send(res);
    }

    // If student, enroll them in the class using the class code
    if (role === 'student' && classCode) {
      // Find the class by class_code
      const { data: classData, error: classError } = await supabase
        .from('classes')
        .select('id')
        .eq('class_code', classCode)
        .single();

      if (classError || !classData) {
        console.error('Class lookup error:', classError);
        return ErrorResponse.badRequest('Invalid class code').send(res);
      }

      // Enroll student in the class
      const { error: enrollError } = await supabase
        .from('enrollments')
        .insert({
          student_id: userId,
          class_id: classData.id,
        });

      if (enrollError) {
        console.error('Enrollment error:', enrollError);
        return ErrorResponse.internalServerError('Failed to enroll in class').send(res);
      }
    }

    return res.status(201).json({ 
      message: 'Registration successful',
      user: {
        id: userId,
        email: email,
        firstName: firstName,
        lastName: lastName,
        role: role,
      },
      session: signUpData.session ? {
        access_token: signUpData.session.access_token,
        refresh_token: signUpData.session.refresh_token,
        expires_at: signUpData.session.expires_at,
      } : null,
    });
  } catch (err) {
    console.error('SignUp error:', err);
    return ErrorResponse.internalServerError(err.message).send(res);
  }
};

export { signUp };