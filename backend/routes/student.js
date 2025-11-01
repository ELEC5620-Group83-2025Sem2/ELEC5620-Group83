import express from 'express';
import { verifyAuth, requireRole } from '../middleware/auth.js';
import {
  generateStudyPlan,
  saveStudyPlanPreferences,
  getStudyPlanPreferences
} from '../controllers/student/studyPlanner.js';
import { getStudentAnnouncements } from '../controllers/student/announcements.js';
import { getStudentClasses } from '../controllers/student/classes.js';
import { getHSCSubjects } from '../controllers/student/hscSubjects.js';

const router = express.Router();

// All student routes require authentication and student role
router.use(verifyAuth);
router.use(requireRole(['student']));

// ===================
// Study Plan Routes
// ===================

// POST /api/student/study-plan/generate - Generate AI study plan
router.post('/study-plan/generate', generateStudyPlan);

// POST /api/student/study-plan/preferences - Save study preferences
router.post('/study-plan/preferences', saveStudyPlanPreferences);

// GET /api/student/study-plan/preferences - Get study preferences
router.get('/study-plan/preferences', getStudyPlanPreferences);

// ===================
// Announcements Routes
// ===================

// GET /api/student/announcements - Get all announcements for student's enrolled classes
router.get('/announcements', getStudentAnnouncements);

// ===================
// Classes Routes
// ===================

// GET /api/student/classes - Get all classes the student is enrolled in
router.get('/classes', getStudentClasses);

// ===================
// HSC Subjects Routes
// ===================

// GET /api/student/hsc-subjects - Get all HSC subjects
router.get('/hsc-subjects', getHSCSubjects);

export { router as studentRoutes };

