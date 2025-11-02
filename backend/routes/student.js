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
import { getStudentAssignments } from '../controllers/student/assignments.js';
import { getClassModulesForStudent, getModuleDetailForStudent } from '../controllers/student/modules.js';
import { sendChatMessage } from '../controllers/student/chat.js';

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
// Modules Routes
// ===================
router.get('/classes/:classId/modules', getClassModulesForStudent);
router.get('/modules/:moduleId', getModuleDetailForStudent);

// ===================
// HSC Subjects Routes
// ===================

// GET /api/student/hsc-subjects - Get all HSC subjects
router.get('/hsc-subjects', getHSCSubjects);
// Assignments Routes
// ===================

// GET /api/student/assignments - Get all assignments for student's enrolled classes
router.get('/assignments', getStudentAssignments);

// ===================
// Chat Routes
// ===================

// POST /api/student/chat - Send message to AI chat
router.post('/chat', sendChatMessage);

export { router as studentRoutes };

