import express from 'express';
import { createCourseRecommendation } from '../controllers/course.js';
import { createCareerPathway } from '../controllers/career.js';

const router = express.Router();

// POST /api/ai-agent/course-recommendation
router.post('/course-recommendation', createCourseRecommendation);

// POST /api/ai-agent/career-pathway
router.post('/career-pathway', createCareerPathway);

export {
  router as aiRoutes
};


