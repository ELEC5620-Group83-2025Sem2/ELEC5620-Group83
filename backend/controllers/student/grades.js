import { getSupabaseClient } from '../../clients/supabaseClient.js';
import { ErrorResponse } from '../../utils/errorResponse.js';

/**
 * GET /api/student/grades
 * Get all grades for student
 */
export const getStudentGrades = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { classId } = req.query;
    const supabase = getSupabaseClient();
    
    // Get student's enrolled classes
    const { data: enrollments, error: enrollError } = await supabase
      .from('enrollments')
      .select('class_id')
      .eq('student_id', studentId);
    
    if (enrollError) throw enrollError;
    
    if (!enrollments || enrollments.length === 0) {
      return res.json({
        success: true,
        grades: []
      });
    }
    
    const classIds = enrollments.map(e => e.class_id);
    
    // Build query for grades
    let query = supabase
      .from('class_grade_history')
      .select(`
        *,
        classes (
          id,
          name,
          code
        )
      `)
      .eq('student_id', studentId)
      .in('class_id', classIds)
      .order('created_at', { ascending: false });
    
    // Apply filter if classId provided
    if (classId) {
      query = query.eq('class_id', classId);
    }
    
    const { data: grades, error: gradeError } = await query;
    
    if (gradeError) throw gradeError;
    
    // Format grades
    const formattedGrades = (grades || []).map(grade => {
      const percentage = grade.max_score > 0 ? (grade.score / grade.max_score * 100) : 0;
      let letterGrade = 'F';
      
      if (percentage >= 90) letterGrade = 'A+';
      else if (percentage >= 85) letterGrade = 'A';
      else if (percentage >= 80) letterGrade = 'A-';
      else if (percentage >= 75) letterGrade = 'B+';
      else if (percentage >= 70) letterGrade = 'B';
      else if (percentage >= 65) letterGrade = 'B-';
      else if (percentage >= 60) letterGrade = 'C+';
      else if (percentage >= 55) letterGrade = 'C';
      else if (percentage >= 50) letterGrade = 'D';
      
      return {
        id: grade.id,
        assignment: grade.assignment_name || 'Assignment',
        class: grade.classes?.name || 'Unknown',
        classId: grade.class_id,
        score: grade.score,
        maxScore: grade.max_score,
        grade: letterGrade,
        percentage: Math.round(percentage),
        feedback: grade.feedback,
        gradedAt: grade.created_at ? new Date(grade.created_at).toLocaleDateString() : null
      };
    });
    
    return res.json({
      success: true,
      grades: formattedGrades
    });
  } catch (error) {
    console.error('Get student grades error:', error);
    return ErrorResponse.internalServerError('Failed to fetch grades').send(res);
  }
};

/**
 * GET /api/student/grades/summary
 * Get grade summary and statistics
 */
export const getGradesSummary = async (req, res) => {
  try {
    const studentId = req.user.id;
    const supabase = getSupabaseClient();
    
    // Get all grades
    const { data: grades, error: gradeError } = await supabase
      .from('class_grade_history')
      .select(`
        score,
        max_score,
        class_id,
        classes (
          name
        )
      `)
      .eq('student_id', studentId);
    
    if (gradeError) throw gradeError;
    
    if (!grades || grades.length === 0) {
      return res.json({
        success: true,
        summary: {
          overallAverage: 0,
          totalAssignments: 0,
          classAverages: []
        }
      });
    }
    
    // Calculate overall average
    const validGrades = grades.filter(g => g.score !== null && g.max_score !== null && g.max_score > 0);
    const overallAverage = validGrades.length > 0
      ? validGrades.reduce((sum, g) => sum + (g.score / g.max_score * 100), 0) / validGrades.length
      : 0;
    
    // Calculate per-class averages
    const classGradesMap = {};
    validGrades.forEach(grade => {
      if (!classGradesMap[grade.class_id]) {
        classGradesMap[grade.class_id] = {
          className: grade.classes?.name || 'Unknown',
          grades: []
        };
      }
      classGradesMap[grade.class_id].grades.push((grade.score / grade.max_score * 100));
    });
    
    const classAverages = Object.keys(classGradesMap).map(classId => {
      const classData = classGradesMap[classId];
      const average = classData.grades.reduce((sum, g) => sum + g, 0) / classData.grades.length;
      return {
        classId,
        className: classData.className,
        average: Math.round(average * 10) / 10,
        count: classData.grades.length
      };
    });
    
    return res.json({
      success: true,
      summary: {
        overallAverage: Math.round(overallAverage * 10) / 10,
        totalAssignments: validGrades.length,
        classAverages
      }
    });
  } catch (error) {
    console.error('Get grades summary error:', error);
    return ErrorResponse.internalServerError('Failed to fetch grades summary').send(res);
  }
};

