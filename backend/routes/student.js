import express from 'express';
import { verifyAuth, requireRole } from '../middleware/auth.js';
import {
  generateStudyPlan,
  saveStudyPlanPreferences,
  getStudyPlanPreferences
} from '../controllers/student/studyPlanner.js';
import {
  getDashboardData,
  getStudentClasses,
  getClassDetail,
  getWeeklyReport
} from '../controllers/student/dashboard.js';
import {
  getStudentAssignments,
  getAssignmentDetail,
  submitAssignment
} from '../controllers/student/assignments.js';
import {
  getStudentGrades,
  getGradesSummary
} from '../controllers/student/grades.js';
import {
  getHSCSubjects,
  getHSCSubjectDetail,
  saveHSCStudyPlan,
  getHSCStudyPlan
} from '../controllers/student/hscSubjects.js';
import {
  getReviewQuestions,
  updateReviewQuestion,
  getReviewStats
} from '../controllers/student/review.js';

const router = express.Router();

// Route-level logger for student endpoints
router.use((req, res, next) => {
  console.log('[StudentRoutes] incoming', { method: req.method, path: req.originalUrl });
  next();
});

// All student routes require authentication and student role
router.use(verifyAuth);
// router.use(requireRole(['student']));

// ===================
// Dashboard Routes
// ===================

// GET /api/student/dashboard - Get dashboard overview
router.get('/dashboard', getDashboardData);

// GET /api/student/weekly-report - Get weekly report data
router.get('/weekly-report', getWeeklyReport);

// ===================
// Classes Routes
// ===================

// GET /api/student/classes - Get all enrolled classes
router.get('/classes', getStudentClasses);

// GET /api/student/classes/:id - Get class details
router.get('/classes/:id', getClassDetail);

// ===================
// Assignments Routes
// ===================

// GET /api/student/assignments - Get all assignments
router.get('/assignments', getStudentAssignments);

// GET /api/student/assignments/:id - Get assignment details
router.get('/assignments/:id', getAssignmentDetail);

// POST /api/student/assignments/:id/submit - Submit assignment
router.post('/assignments/:id/submit', submitAssignment);

// ===================
// Grades Routes
// ===================

// GET /api/student/grades - Get all grades
router.get('/grades', getStudentGrades);

// GET /api/student/grades/summary - Get grades summary
router.get('/grades/summary', getGradesSummary);

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
// HSC Subjects Routes
// ===================

// GET /api/student/hsc-subjects - Get all HSC subjects
router.get('/hsc-subjects', getHSCSubjects);

// GET /api/student/hsc-subjects/:id - Get HSC subject details
router.get('/hsc-subjects/:id', getHSCSubjectDetail);

// POST /api/student/hsc-study-plan - Save HSC study plan
router.post('/hsc-study-plan', saveHSCStudyPlan);

// GET /api/student/hsc-study-plan - Get HSC study plan
router.get('/hsc-study-plan', getHSCStudyPlan);

// ===================
// Review Incorrect Questions Routes
// ===================

// GET /api/student/review/questions - list incorrect questions
router.get('/review/questions', getReviewQuestions);

// PUT /api/student/review/questions/:id - update review state
router.put('/review/questions/:id', updateReviewQuestion);

// GET /api/student/review/stats - overview stats
router.get('/review/stats', getReviewStats);

export { router as studentRoutes };

