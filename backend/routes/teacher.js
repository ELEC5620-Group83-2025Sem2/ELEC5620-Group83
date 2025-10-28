import express from 'express';
import { verifyAuth, requireRole } from '../middleware/auth.js';

// Import controllers
import {
  getTeacherClasses,
  getClassDetail,
  getClassRoster,
  getClassAnalytics
} from '../controllers/teacher/classes.js';

import {
  getTeacherAssignments,
  getAssignmentDetail,
  createAssignment,
  updateAssignment,
  publishAssignment,
  deleteAssignment
} from '../controllers/teacher/assignments.js';

import {
  getAssignmentSubmissions,
  getSubmissionDetail,
  gradeSubmission,
  updateSubmissionFeedback,
  getGradingSummary
} from '../controllers/teacher/submissions.js';

import {
  getTeacherStudents,
  getStudentDetail,
  getStudentClassPerformance
} from '../controllers/teacher/students.js';

import {
  generateRubric,
  summarizeContent,
  autoGradeSubmission,
  analyzeClassPerformance
} from '../controllers/teacher/aiFeatures.js';

const router = express.Router();

// All teacher routes require authentication and teacher role
router.use(verifyAuth);
router.use(requireRole('teacher'));

// ============================================
// CLASSES ROUTES
// ============================================

/**
 * @route   GET /api/teacher/classes
 * @desc    Get all classes for the teacher
 * @access  Teacher only
 */
router.get('/classes', getTeacherClasses);

/**
 * @route   GET /api/teacher/classes/:classId
 * @desc    Get details for a specific class
 * @access  Teacher only
 */
router.get('/classes/:classId', getClassDetail);

/**
 * @route   GET /api/teacher/classes/:classId/roster
 * @desc    Get student roster for a class
 * @access  Teacher only
 */
router.get('/classes/:classId/roster', getClassRoster);

/**
 * @route   GET /api/teacher/classes/:classId/analytics
 * @desc    Get analytics for a class (UC07: Analyze Class Performance)
 * @access  Teacher only
 */
router.get('/classes/:classId/analytics', getClassAnalytics);

// ============================================
// ASSIGNMENTS ROUTES
// ============================================

/**
 * @route   GET /api/teacher/assignments
 * @desc    Get all assignments for teacher's classes
 * @query   status (optional) - Filter by status (draft, published, etc.)
 * @query   classId (optional) - Filter by class
 * @access  Teacher only
 */
router.get('/assignments', getTeacherAssignments);

/**
 * @route   GET /api/teacher/assignments/:assignmentId
 * @desc    Get details for a specific assignment
 * @access  Teacher only
 */
router.get('/assignments/:assignmentId', getAssignmentDetail);

/**
 * @route   POST /api/teacher/assignments
 * @desc    Create a new assignment
 * @access  Teacher only
 */
router.post('/assignments', createAssignment);

/**
 * @route   PUT /api/teacher/assignments/:assignmentId
 * @desc    Update an assignment
 * @access  Teacher only
 */
router.put('/assignments/:assignmentId', updateAssignment);

/**
 * @route   POST /api/teacher/assignments/:assignmentId/publish
 * @desc    Publish an assignment (make visible to students)
 * @access  Teacher only
 */
router.post('/assignments/:assignmentId/publish', publishAssignment);

/**
 * @route   DELETE /api/teacher/assignments/:assignmentId
 * @desc    Delete an assignment
 * @access  Teacher only
 */
router.delete('/assignments/:assignmentId', deleteAssignment);

// ============================================
// SUBMISSIONS & GRADING ROUTES
// ============================================

/**
 * @route   GET /api/teacher/assignments/:assignmentId/submissions
 * @desc    Get all submissions for an assignment
 * @query   status (optional) - Filter by status
 * @access  Teacher only
 */
router.get('/assignments/:assignmentId/submissions', getAssignmentSubmissions);

/**
 * @route   GET /api/teacher/submissions/:submissionId
 * @desc    Get details for a specific submission
 * @access  Teacher only
 */
router.get('/submissions/:submissionId', getSubmissionDetail);

/**
 * @route   PUT /api/teacher/submissions/:submissionId/grade
 * @desc    Grade a submission (UC04: Submit Answers for Auto-Grading)
 * @body    { grade, feedback, answer_grades }
 * @access  Teacher only
 */
router.put('/submissions/:submissionId/grade', gradeSubmission);

/**
 * @route   PUT /api/teacher/submissions/:submissionId/feedback
 * @desc    Update feedback for a submission
 * @body    { feedback }
 * @access  Teacher only
 */
router.put('/submissions/:submissionId/feedback', updateSubmissionFeedback);

/**
 * @route   GET /api/teacher/assignments/:assignmentId/grading-summary
 * @desc    Get grading summary for an assignment
 * @access  Teacher only
 */
router.get('/assignments/:assignmentId/grading-summary', getGradingSummary);

// ============================================
// STUDENTS ROUTES
// ============================================

/**
 * @route   GET /api/teacher/students
 * @desc    Get all students in teacher's classes (UC08: Review Student Behavior Report)
 * @query   classId (optional) - Filter by class
 * @query   search (optional) - Search by name or email
 * @access  Teacher only
 */
router.get('/students', getTeacherStudents);

/**
 * @route   GET /api/teacher/students/:studentId
 * @desc    Get detailed information about a student
 * @access  Teacher only
 */
router.get('/students/:studentId', getStudentDetail);

/**
 * @route   GET /api/teacher/students/:studentId/classes/:classId/performance
 * @desc    Get student's performance in a specific class
 * @access  Teacher only
 */
router.get('/students/:studentId/classes/:classId/performance', getStudentClassPerformance);

// ============================================
// AI FEATURES ROUTES
// ============================================

/**
 * @route   POST /api/teacher/ai/generate-rubric
 * @desc    Generate assessment rubric using AI (UC10: AI-Generated Assessment Rubric)
 * @body    { assignment_title, assignment_description, assignment_type, points_possible, learning_objectives }
 * @access  Teacher only
 */
router.post('/ai/generate-rubric', generateRubric);

/**
 * @route   POST /api/teacher/ai/summarize
 * @desc    Summarize content using AI (UC11: Content Summarisation)
 * @body    { content, content_type, max_length }
 * @access  Teacher only
 */
router.post('/ai/summarize', summarizeContent);

/**
 * @route   POST /api/teacher/ai/auto-grade
 * @desc    Auto-grade a submission using AI
 * @body    { submission_id, assignment_id }
 * @access  Teacher only
 */
router.post('/ai/auto-grade', autoGradeSubmission);

/**
 * @route   POST /api/teacher/ai/analyze-performance
 * @desc    Analyze class performance with AI insights (UC07: Analyze Class Performance)
 * @body    { class_id }
 * @access  Teacher only
 */
router.post('/ai/analyze-performance', analyzeClassPerformance);

// ============================================
// DASHBOARD & OVERVIEW
// ============================================

/**
 * @route   GET /api/teacher/dashboard
 * @desc    Get dashboard overview data
 * @access  Teacher only
 */
router.get('/dashboard', async (req, res) => {
  try {
    const teacherId = req.user.id;
    
    // This is a convenience endpoint that aggregates data
    // In a real app, you might want to create a dedicated controller
    
    return res.json({
      message: 'Teacher dashboard data',
      teacher_id: teacherId,
      // Frontend can call individual endpoints:
      // - GET /api/teacher/classes for classes
      // - GET /api/teacher/assignments for assignments
      // - GET /api/teacher/students for students
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

export { router as teacherRoutes };


