import express from 'express';
import { createCourseRecommendation } from '../controllers/course.js';

const router = express.Router();

// POST /api/ai-agent/course-recommendation
router.post('/course-recommendation', createCourseRecommendation);

export {
  router as aiRoutes
};


