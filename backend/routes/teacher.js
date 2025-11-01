import express from 'express';
import { verifyAuth, requireRole } from '../middleware/auth.js';
import { 
  getTeacherClasses, 
  getClassDetails, 
  getClassStudents, 
  getClassAnalytics,
  createClass
} from '../controllers/teacher/classes.js';
import { getOverallAnalytics } from '../controllers/teacher/analytics.js';
import { 
  getTeacherAssignments, 
  getAssignmentDetails, 
  createAssignment, 
  updateAssignment, 
  deleteAssignment, 
  publishAssignment 
} from '../controllers/teacher/assignments.js';
import { 
  getTeacherStudents, 
  getStudentDetails, 
  updateStudentNotes 
} from '../controllers/teacher/students.js';
import { 
  getAnnouncements, 
  createAnnouncement, 
  updateAnnouncement, 
  deleteAnnouncement 
} from '../controllers/teacher/announcements.js';
import {
  getAssignmentSubmissions,
  getSubmissionDetail,
  gradeSubmission,
  updateSubmissionFeedback,
  getGradingSummary
} from '../controllers/teacher/submissions.js';
import {
  generateRubric,
  summarizeContent,
  autoGradeSubmission,
  analyzeClassPerformance
} from '../controllers/teacher/aiFeatures.js';

const router = express.Router();

// All teacher routes require authentication and teacher role
router.use(verifyAuth);
router.use(requireRole(['teacher', 'admin']));

// ===================
// Analytics Routes (Must be before parameter routes)
// ===================

// GET /api/teacher/analytics - Get overall analytics for all classes
router.get('/analytics', getOverallAnalytics);

// ===================
// Classes Routes
// ===================

// GET /api/teacher/classes - Get all teacher's classes
router.get('/classes', getTeacherClasses);

// POST /api/teacher/classes - Create a new class
router.post('/classes', createClass);

// GET /api/teacher/classes/:id - Get class details
router.get('/classes/:id', getClassDetails);

// GET /api/teacher/classes/:id/students - Get class roster
router.get('/classes/:id/students', getClassStudents);

// GET /api/teacher/classes/:id/analytics - Get class analytics
router.get('/classes/:id/analytics', getClassAnalytics);

// ===================
// Assignments Routes
// ===================

// GET /api/teacher/assignments - Get all assignments
router.get('/assignments', getTeacherAssignments);

// GET /api/teacher/assignments/:id - Get assignment details
router.get('/assignments/:id', getAssignmentDetails);

// POST /api/teacher/assignments - Create assignment
router.post('/assignments', createAssignment);

// PUT /api/teacher/assignments/:id - Update assignment
router.put('/assignments/:id', updateAssignment);

// DELETE /api/teacher/assignments/:id - Delete assignment
router.delete('/assignments/:id', deleteAssignment);

// POST /api/teacher/assignments/:id/publish - Publish assignment
router.post('/assignments/:id/publish', publishAssignment);

// ===================
// Students Routes
// ===================

// GET /api/teacher/students - Get all students
router.get('/students', getTeacherStudents);

// GET /api/teacher/students/:id - Get student details
router.get('/students/:id', getStudentDetails);

// PUT /api/teacher/students/:id/notes - Save student notes
router.put('/students/:id/notes', updateStudentNotes);

// ===================
// Announcements Routes
// ===================

// GET /api/teacher/announcements - Get announcements
router.get('/announcements', getAnnouncements);

// POST /api/teacher/announcements - Create announcement
router.post('/announcements', createAnnouncement);

// PUT /api/teacher/announcements/:id - Update announcement
router.put('/announcements/:id', updateAnnouncement);

// DELETE /api/teacher/announcements/:id - Delete announcement
router.delete('/announcements/:id', deleteAnnouncement);

// ===================
// Submissions & Grading Routes
// ===================

// GET /api/teacher/assignments/:assignmentId/submissions - Get submissions for an assignment
router.get('/assignments/:assignmentId/submissions', getAssignmentSubmissions);

// GET /api/teacher/submissions/:submissionId - Get submission details
router.get('/submissions/:submissionId', getSubmissionDetail);

// PUT /api/teacher/assignments/:assignmentId/submissions/:submissionId/grade - Grade a submission
router.put('/assignments/:assignmentId/submissions/:submissionId/grade', gradeSubmission);

// PUT /api/teacher/submissions/:submissionId/feedback - Update submission feedback
router.put('/submissions/:submissionId/feedback', updateSubmissionFeedback);

// GET /api/teacher/assignments/:assignmentId/grading-summary - Get grading summary
router.get('/assignments/:assignmentId/grading-summary', getGradingSummary);

// ===================
// AI Features Routes
// ===================

// POST /api/teacher/ai/auto-grade - AI auto-grade submission
router.post('/ai/auto-grade', autoGradeSubmission);

// POST /api/teacher/ai/generate-rubric - Generate rubric with AI
router.post('/ai/generate-rubric', generateRubric);

// POST /api/teacher/ai/analyze-class - Analyze class performance
router.post('/ai/analyze-class', analyzeClassPerformance);

// POST /api/teacher/ai/summarize - Summarize content
router.post('/ai/summarize', summarizeContent);

export { router as teacherRoutes };


