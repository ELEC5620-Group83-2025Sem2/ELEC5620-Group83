import express from 'express';
import { verifyAuth, requireRole } from '../middleware/auth.js';
const router = express.Router();

// Example route
router.get('/examples', (req, res) => {
  res.json({ message: 'Example API route' });
});

// Protected route example - requires authentication
router.get('/profile', verifyAuth, (req, res) => {
  res.json({ 
    message: 'Authenticated user profile',
    user: req.user 
  });
});

// Role-based route example - only students can access
router.get('/student-data', verifyAuth, requireRole(['student']), (req, res) => {
  res.json({ 
    message: 'Student-only data',
    user: req.user,
    roles: req.userRoles
  });
});

// Role-based route example - only teachers can access
router.get('/teacher-data', verifyAuth, requireRole(['teacher']), (req, res) => {
  res.json({ 
    message: 'Teacher-only data',
    user: req.user,
    roles: req.userRoles
  });
});

export default router;

