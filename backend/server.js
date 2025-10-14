import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/api.js';
import { logger } from './middleware/logger.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to HSC Power API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      examples: '/api/examples'
    }
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'HSC Power Server is running' });
});

// API Routes
app.use('/api', apiRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 HSC Power Server is running on http://localhost:${PORT}`);
  console.log(`📡 API Health: http://localhost:${PORT}/api/health`);
});

export default app;

