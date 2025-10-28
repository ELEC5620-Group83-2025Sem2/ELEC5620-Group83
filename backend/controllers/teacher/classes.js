import { getSupabaseClient } from '../../clients/supabaseClient.js';
import { ErrorResponse } from '../../utils/errorResponse.js';

/**
 * UC07: Analyze Class Performance
 * Get all classes for the current teacher
 */
export const getTeacherClasses = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const supabase = getSupabaseClient();

    // Get classes where user is a teacher
    const { data: classTeachers, error: ctError } = await supabase
      .from('class_teachers')
      .select('class_id, role_in_class')
      .eq('profile_id', teacherId);

    if (ctError) throw ctError;

    if (!classTeachers || classTeachers.length === 0) {
      return res.json({ classes: [] });
    }

    const classIds = classTeachers.map(ct => ct.class_id);

    // Get class details with enrollment counts
    const { data: classes, error: classError } = await supabase
      .from('classes')
      .select(`
        id,
        name,
        class_code,
        subject,
        year_level,
        description,
        created_at,
        enrollments:enrollments(count)
      `)
      .in('id', classIds);

    if (classError) throw classError;

    // Get assignment stats for each class
    const classesWithStats = await Promise.all(
      classes.map(async (classItem) => {
        // Count assignments
        const { count: assignmentCount } = await supabase
          .from('assignments')
          .select('id', { count: 'exact', head: true })
          .eq('class_id', classItem.id);

        // Count pending submissions (submitted but not graded)
        const { count: pendingCount } = await supabase
          .from('assignment_submissions')
          .select('id', { count: 'exact', head: true })
          .eq('class_id', classItem.id)
          .eq('status', 'submitted')
          .is('grade', null);

        // Get average grade for graded submissions
        const { data: grades } = await supabase
          .from('assignment_submissions')
          .select('grade, points_possible')
          .eq('class_id', classItem.id)
          .not('grade', 'is', null);

        let avgGrade = null;
        if (grades && grades.length > 0) {
          const totalPercentage = grades.reduce((sum, g) => {
            return sum + (g.grade / g.points_possible) * 100;
          }, 0);
          avgGrade = Math.round(totalPercentage / grades.length);
        }

        return {
          ...classItem,
          student_count: classItem.enrollments?.[0]?.count || 0,
          assignment_count: assignmentCount || 0,
          pending_grading: pendingCount || 0,
          average_grade: avgGrade,
          role_in_class: classTeachers.find(ct => ct.class_id === classItem.id)?.role_in_class || 'teacher'
        };
      })
    );

    return res.json({
      classes: classesWithStats,
      total: classesWithStats.length
    });

  } catch (err) {
    console.error('Get teacher classes error:', err);
    return ErrorResponse.internalServerError(err.message).send(res);
  }
};

/**
 * Get details for a specific class
 */
export const getClassDetail = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const { classId } = req.params;
    const supabase = getSupabaseClient();

    // Verify teacher has access to this class
    const { data: access } = await supabase
      .from('class_teachers')
      .select('role_in_class')
      .eq('profile_id', teacherId)
      .eq('class_id', classId)
      .single();

    if (!access) {
      return ErrorResponse.forbidden('You do not have access to this class').send(res);
    }

    // Get class details
    const { data: classData, error: classError } = await supabase
      .from('classes')
      .select('*')
      .eq('id', classId)
      .single();

    if (classError) throw classError;
    if (!classData) {
      return ErrorResponse.notFound('Class not found').send(res);
    }

    // Get enrollment count
    const { count: studentCount } = await supabase
      .from('enrollments')
      .select('student_id', { count: 'exact', head: true })
      .eq('class_id', classId);

    // Get schedule sessions
    const { data: sessions } = await supabase
      .from('class_schedule_sessions')
      .select('*')
      .eq('class_id', classId)
      .order('day_of_week', { ascending: true })
      .order('start_time', { ascending: true });

    return res.json({
      class: {
        ...classData,
        student_count: studentCount || 0,
        schedule: sessions || [],
        role_in_class: access.role_in_class
      }
    });

  } catch (err) {
    console.error('Get class detail error:', err);
    return ErrorResponse.internalServerError(err.message).send(res);
  }
};

/**
 * UC08: Review Student Behavior Report
 * Get roster (list of students) for a class
 */
export const getClassRoster = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const { classId } = req.params;
    const supabase = getSupabaseClient();

    // Verify teacher has access
    const { data: access } = await supabase
      .from('class_teachers')
      .select('role_in_class')
      .eq('profile_id', teacherId)
      .eq('class_id', classId)
      .single();

    if (!access) {
      return ErrorResponse.forbidden('You do not have access to this class').send(res);
    }

    // Get enrolled students with their profile info
    const { data: enrollments, error: enrollError } = await supabase
      .from('enrollments')
      .select(`
        student_id,
        enrolled_at,
        profiles:student_id (
          id,
          first_name,
          last_name,
          email,
          avatar
        )
      `)
      .eq('class_id', classId);

    if (enrollError) throw enrollError;

    // Get submission stats for each student
    const studentsWithStats = await Promise.all(
      enrollments.map(async (enrollment) => {
        const studentId = enrollment.student_id;
        const profile = enrollment.profiles;

        // Count total assignments for this class
        const { count: totalAssignments } = await supabase
          .from('assignments')
          .select('id', { count: 'exact', head: true })
          .eq('class_id', classId)
          .eq('status', 'published');

        // Count submitted assignments
        const { count: submittedCount } = await supabase
          .from('assignment_submissions')
          .select('id', { count: 'exact', head: true })
          .eq('student_id', studentId)
          .eq('class_id', classId)
          .in('status', ['submitted', 'graded']);

        // Get grades
        const { data: grades } = await supabase
          .from('assignment_submissions')
          .select('grade, points_possible')
          .eq('student_id', studentId)
          .eq('class_id', classId)
          .not('grade', 'is', null);

        let avgGrade = null;
        if (grades && grades.length > 0) {
          const totalPercentage = grades.reduce((sum, g) => {
            return sum + (g.grade / g.points_possible) * 100;
          }, 0);
          avgGrade = Math.round(totalPercentage / grades.length);
        }

        return {
          student_id: studentId,
          first_name: profile?.first_name || '',
          last_name: profile?.last_name || '',
          email: profile?.email || '',
          avatar: profile?.avatar || '',
          enrolled_at: enrollment.enrolled_at,
          total_assignments: totalAssignments || 0,
          submitted_count: submittedCount || 0,
          completion_rate: totalAssignments > 0 
            ? Math.round((submittedCount / totalAssignments) * 100) 
            : 0,
          average_grade: avgGrade
        };
      })
    );

    return res.json({
      students: studentsWithStats,
      total: studentsWithStats.length
    });

  } catch (err) {
    console.error('Get class roster error:', err);
    return ErrorResponse.internalServerError(err.message).send(res);
  }
};

/**
 * UC07: Analyze Class Performance
 * Get analytics for a specific class
 */
export const getClassAnalytics = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const { classId } = req.params;
    const supabase = getSupabaseClient();

    // Verify teacher has access
    const { data: access } = await supabase
      .from('class_teachers')
      .select('role_in_class')
      .eq('profile_id', teacherId)
      .eq('class_id', classId)
      .single();

    if (!access) {
      return ErrorResponse.forbidden('You do not have access to this class').send(res);
    }

    // Get all graded submissions for this class
    const { data: submissions, error: subError } = await supabase
      .from('assignment_submissions')
      .select(`
        id,
        grade,
        points_possible,
        submitted_at,
        graded_at,
        student_id,
        assignment_id,
        assignments:assignment_id (
          title,
          due_date
        )
      `)
      .eq('class_id', classId)
      .not('grade', 'is', null);

    if (subError) throw subError;

    // Calculate grade distribution
    const gradeDistribution = {
      'A (90-100)': 0,
      'B (80-89)': 0,
      'C (70-79)': 0,
      'D (60-69)': 0,
      'F (0-59)': 0
    };

    const gradePercentages = submissions.map(sub => {
      const percentage = (sub.grade / sub.points_possible) * 100;
      
      if (percentage >= 90) gradeDistribution['A (90-100)']++;
      else if (percentage >= 80) gradeDistribution['B (80-89)']++;
      else if (percentage >= 70) gradeDistribution['C (70-79)']++;
      else if (percentage >= 60) gradeDistribution['D (60-69)']++;
      else gradeDistribution['F (0-59)']++;
      
      return percentage;
    });

    // Calculate average
    const avgGrade = gradePercentages.length > 0
      ? gradePercentages.reduce((a, b) => a + b, 0) / gradePercentages.length
      : 0;

    // Get student count
    const { count: studentCount } = await supabase
      .from('enrollments')
      .select('student_id', { count: 'exact', head: true })
      .eq('class_id', classId);

    // Get assignment count
    const { count: assignmentCount } = await supabase
      .from('assignments')
      .select('id', { count: 'exact', head: true })
      .eq('class_id', classId);

    // Performance trend (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: recentSubs } = await supabase
      .from('assignment_submissions')
      .select('grade, points_possible, graded_at')
      .eq('class_id', classId)
      .not('grade', 'is', null)
      .gte('graded_at', thirtyDaysAgo.toISOString())
      .order('graded_at', { ascending: true });

    return res.json({
      analytics: {
        class_id: classId,
        student_count: studentCount || 0,
        assignment_count: assignmentCount || 0,
        total_submissions: submissions.length,
        average_grade: Math.round(avgGrade * 10) / 10,
        grade_distribution: gradeDistribution,
        performance_trend: recentSubs || []
      }
    });

  } catch (err) {
    console.error('Get class analytics error:', err);
    return ErrorResponse.internalServerError(err.message).send(res);
  }
};


