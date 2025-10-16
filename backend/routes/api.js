import express from 'express';
import { authRoutes } from './auth.js';
const router = express.Router();


// Example route
router.get('/examples', (req, res) => {
  res.json({ message: 'Example API route' });
});

// Auth routes
router.use('/auth', authRoutes);

export default router;

