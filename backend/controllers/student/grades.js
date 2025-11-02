import { getSupabaseClient } from '../../clients/supabaseClient.js';
import { ErrorResponse } from '../../utils/errorResponse.js';

/**
 * GET /api/student/grades
 * Get all grades for a student
 */
export const getStudentGrades = async (req, res) => {
  try {
    const studentId = req.user.id;
    const supabase = getSupabaseClient();
    
    // Get all grades from class_grade_history
    const { data: grades, error: gradeError } = await supabase
      .from('class_grade_history')
      .select(`
        id,
        assessment,
        score,
        max_score,
        weight,
        created_at,
        class_id,
        classes (
          id,
          name,
          code,
          color
        )
      `)
      .eq('student_id', studentId)
      .order('created_at', { ascending: false });
    
    if (gradeError) {
      console.error('Error fetching grades:', gradeError);
      return ErrorResponse.internalServerError('Failed to fetch student grades').send(res);
    }
    
    // Transform grades to match frontend format
    const transformedGrades = (grades || []).map(grade => {
      // Calculate percentage
      const percentage = grade.max_score > 0 
        ? Math.round((grade.score / grade.max_score) * 100) 
        : 0;
      
      // Calculate letter grade
      let letterGrade = 'F';
      if (percentage >= 90) letterGrade = 'A';
      else if (percentage >= 80) letterGrade = 'B';
      else if (percentage >= 70) letterGrade = 'C';
      else if (percentage >= 60) letterGrade = 'D';
      
      return {
        id: grade.id,
        assignment: grade.assessment,
        class: grade.classes?.name || 'Unknown Class',
        classCode: grade.classes?.code || '',
        classColor: grade.classes?.color || '#6366f1',
        score: grade.score,
        maxScore: grade.max_score,
        weight: grade.weight,
        percentage: percentage,
        grade: letterGrade,
        date: grade.created_at,
        classId: grade.class_id
      };
    });
    
    return res.status(200).json({
      success: true,
      grades: transformedGrades
    });
    
  } catch (error) {
    console.error('Unexpected error in getStudentGrades:', error);
    return ErrorResponse.internalServerError('An unexpected error occurred').send(res);
  }
};

