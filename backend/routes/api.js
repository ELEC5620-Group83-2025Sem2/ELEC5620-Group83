import express from 'express';

const router = express.Router();

// Example route
router.get('/examples', (req, res) => {
  res.json({ message: 'Example API route' });
});

export default router;

