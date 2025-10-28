import express from 'express';
import { verifyAuth, requireRole } from '../middleware/auth.js';
import { 
  getTeacherClasses, 
  getClassDetails, 
  getClassStudents, 
  getClassAnalytics 
} from '../controllers/teacher/classes.js';
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

const router = express.Router();

// All teacher routes require authentication and teacher role
router.use(verifyAuth);
router.use(requireRole(['teacher', 'admin']));

// ===================
// Classes Routes
// ===================

// GET /api/teacher/classes - Get all teacher's classes
router.get('/classes', getTeacherClasses);

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

export { router as teacherRoutes };

