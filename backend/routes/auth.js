import express from 'express';
const router = express.Router();
import { signUp } from '../controllers/signUp.js';
import { login } from '../controllers/login.js';

// POST /auth/signup - Register a new user
router.post('/signup', signUp);

// POST /auth/login - Login a user
router.post('/login', login);

// POST /auth/logout - Logout a user (frontend handles this by clearing tokens)
router.post('/logout', (req, res) => {
  res.status(200).json({ message: 'Logout successful' });
});

export {
  router as authRoutes
};