import { getSupabaseClient } from '../clients/supabaseClient.js';
import { ErrorResponse } from '../utils/errorResponse.js';

const signUp = async (req, res) => {
  try {
    const { email, password, firstName, lastName, role } = req.body || {};

    if (!email || !password || !role) {
      return ErrorResponse.badRequest('email, password or role are required').send(res);
    }

    const supabase = getSupabaseClient();
    const { data: signUpData, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          firstName,
          lastName,
          role
        },
      },
    });

    if (error) {
      return ErrorResponse.internalServerError(error).send(res);
    }

    return res.status(201).json({ 
      user: signUpData.user, 
      session: signUpData.session 
    });
  } catch (err) {
    return ErrorResponse.internalServerError(err.message).send(res);
  }
};


export { signUp };