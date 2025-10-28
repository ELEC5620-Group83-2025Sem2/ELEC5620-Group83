import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/api.js';
import { authRoutes } from './routes/auth.js';
import { aiRoutes } from './routes/aiAgent.js';
import { teacherRoutes } from './routes/teacher.js';
import { logger } from './middleware/logger.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'], // Allow frontend and backend origins
  credentials: true, // Allow cookies to be sent
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
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
      auth: {
        login: '/api/auth/login',
        signup: '/api/auth/signup',
        logout: '/api/auth/logout'
      },
      aiAgent: {
        courseRecommendation: '/api/ai-agent/course-recommendation',
        careerPathway: '/api/ai-agent/career-pathway'
      },
      teacher: {
        classes: '/api/teacher/classes',
        assignments: '/api/teacher/assignments',
        students: '/api/teacher/students',
        ai: '/api/teacher/ai/*'
      },
      tertiaryCoursesSubjectsMapping: '/api/tertiary-courses-subjects-mapping',
      examples: '/api/examples'
    }
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'HSC Power Server is running' });
});

// API Routes
app.use('/api', apiRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/ai-agent', aiRoutes);
app.use('/api/teacher', teacherRoutes);

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

