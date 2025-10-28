import { getSupabaseClient } from '../../clients/supabaseClient.js';
import { ErrorResponse } from '../../utils/errorResponse.js';

/**
 * GET /api/teacher/classes
 * Get all classes taught by the authenticated teacher
 */
export const getTeacherClasses = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const supabase = getSupabaseClient();

    // Get classes taught by this teacher
    const { data: classTeachers, error: ctError } = await supabase
      .from('class_teachers')
      .select('class_id')
      .eq('profile_id', teacherId);

    if (ctError) {
      console.error('Error fetching class teachers:', ctError);
      return ErrorResponse.internalServerError('Failed to fetch classes').send(res);
    }

    const classIds = classTeachers.map(ct => ct.class_id);

    if (classIds.length === 0) {
      return res.status(200).json({ classes: [] });
    }

    // Get class details
    const { data: classes, error: classesError } = await supabase
      .from('classes')
      .select(`
        *,
        enrollments (
          student_id
        )
      `)
      .in('id', classIds);

    if (classesError) {
      console.error('Error fetching classes:', classesError);
      return ErrorResponse.internalServerError('Failed to fetch class details').send(res);
    }

    // For each class, get assignment count and calculate average grade
    const enrichedClasses = await Promise.all(classes.map(async (cls) => {
      // Get assignment count
      const { count: assignmentCount } = await supabase
        .from('assignments')
        .select('*', { count: 'exact', head: true })
        .eq('class_id', cls.id);

      // Get student count
      const studentCount = cls.enrollments?.length || 0;

      // Get average grade (simplified - you may want more complex calculation)
      const { data: submissions } = await supabase
        .from('assignment_submissions')
        .select('grade')
        .not('grade', 'is', null)
        .in('assignment_id', 
          (await supabase
            .from('assignments')
            .select('id')
            .eq('class_id', cls.id)
          ).data?.map(a => a.id) || []
        );

      let avgGrade = null;
      if (submissions && submissions.length > 0) {
        const total = submissions.reduce((sum, s) => sum + (parseFloat(s.grade) || 0), 0);
        avgGrade = Math.round(total / submissions.length);
      }

      return {
        id: cls.id,
        code: cls.code,
        name: cls.name,
        description: cls.description,
        color: cls.color || '#667eea',
        studentCount,
        assignmentCount: assignmentCount || 0,
        avgGrade: avgGrade ? `${avgGrade}%` : 'N/A',
        // Include any additional fields from your classes table
      };
    }));

    res.status(200).json({ classes: enrichedClasses });
  } catch (err) {
    console.error('Error in getTeacherClasses:', err);
    return ErrorResponse.internalServerError('An error occurred while fetching classes').send(res);
  }
};

/**
 * GET /api/teacher/classes/:id
 * Get details for a specific class
 */
export const getClassDetails = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const { id: classId } = req.params;
    const supabase = getSupabaseClient();

    // Verify teacher has access to this class
    const { data: access, error: accessError } = await supabase
      .from('class_teachers')
      .select('*')
      .eq('profile_id', teacherId)
      .eq('class_id', classId)
      .single();

    if (accessError || !access) {
      return ErrorResponse.forbidden('You do not have access to this class').send(res);
    }

    // Get class details
    const { data: classData, error: classError } = await supabase
      .from('classes')
      .select('*')
      .eq('id', classId)
      .single();

    if (classError) {
      console.error('Error fetching class details:', classError);
      return ErrorResponse.internalServerError('Failed to fetch class details').send(res);
    }

    // Get enrollments count
    const { count: studentCount } = await supabase
      .from('enrollments')
      .select('*', { count: 'exact', head: true })
      .eq('class_id', classId);

    // Get assignments count
    const { count: assignmentCount } = await supabase
      .from('assignments')
      .select('*', { count: 'exact', head: true })
      .eq('class_id', classId);

    // Get class materials
    const { data: materials } = await supabase
      .from('class_materials')
      .select('*')
      .eq('class_id', classId)
      .order('created_at', { ascending: false });

    // Get class schedule sessions
    const { data: schedule } = await supabase
      .from('class_schedule_sessions')
      .select('*')
      .eq('class_id', classId)
      .order('day_of_week');

    const enrichedClass = {
      ...classData,
      studentCount: studentCount || 0,
      assignmentCount: assignmentCount || 0,
      materials: materials || [],
      schedule: schedule || [],
    };

    res.status(200).json({ class: enrichedClass });
  } catch (err) {
    console.error('Error in getClassDetails:', err);
    return ErrorResponse.internalServerError('An error occurred while fetching class details').send(res);
  }
};

/**
 * GET /api/teacher/classes/:id/students
 * Get roster (list of students) for a specific class
 */
export const getClassStudents = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const { id: classId } = req.params;
    const supabase = getSupabaseClient();

    // Verify teacher has access to this class
    const { data: access, error: accessError } = await supabase
      .from('class_teachers')
      .select('*')
      .eq('profile_id', teacherId)
      .eq('class_id', classId)
      .single();

    if (accessError || !access) {
      return ErrorResponse.forbidden('You do not have access to this class').send(res);
    }

    // Get enrolled students
    const { data: enrollments, error: enrollError } = await supabase
      .from('enrollments')
      .select(`
        student_id,
        enrolled_at,
        profiles (
          id,
          first_name,
          last_name,
          email,
          avatar
        )
      `)
      .eq('class_id', classId);

    if (enrollError) {
      console.error('Error fetching enrollments:', enrollError);
      return ErrorResponse.internalServerError('Failed to fetch class roster').send(res);
    }

    // Enrich student data with grade information
    const students = await Promise.all(enrollments.map(async (enrollment) => {
      const studentId = enrollment.student_id;
      const profile = enrollment.profiles;

      // Get student's grades for this class
      const { data: submissions } = await supabase
        .from('assignment_submissions')
        .select('grade')
        .eq('student_id', studentId)
        .not('grade', 'is', null)
        .in('assignment_id',
          (await supabase
            .from('assignments')
            .select('id')
            .eq('class_id', classId)
          ).data?.map(a => a.id) || []
        );

      let avgGrade = null;
      if (submissions && submissions.length > 0) {
        const total = submissions.reduce((sum, s) => sum + (parseFloat(s.grade) || 0), 0);
        avgGrade = Math.round(total / submissions.length);
      }

      return {
        id: profile.id,
        name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || profile.email,
        firstName: profile.first_name,
        lastName: profile.last_name,
        email: profile.email,
        avatar: profile.avatar,
        enrolledAt: enrollment.enrolled_at,
        avgGrade: avgGrade ? `${avgGrade}%` : 'N/A',
      };
    }));

    res.status(200).json({ students });
  } catch (err) {
    console.error('Error in getClassStudents:', err);
    return ErrorResponse.internalServerError('An error occurred while fetching class roster').send(res);
  }
};

/**
 * GET /api/teacher/classes/:id/analytics
 * Get analytics data for a specific class
 */
export const getClassAnalytics = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const { id: classId } = req.params;
    const supabase = getSupabaseClient();

    // Verify teacher has access to this class
    const { data: access, error: accessError } = await supabase
      .from('class_teachers')
      .select('*')
      .eq('profile_id', teacherId)
      .eq('class_id', classId)
      .single();

    if (accessError || !access) {
      return ErrorResponse.forbidden('You do not have access to this class').send(res);
    }

    // Get all assignments for this class
    const { data: assignments } = await supabase
      .from('assignments')
      .select('id')
      .eq('class_id', classId);

    const assignmentIds = assignments?.map(a => a.id) || [];

    if (assignmentIds.length === 0) {
      return res.status(200).json({
        analytics: {
          averageGrade: null,
          completionRate: 0,
          gradeDistribution: { A: 0, B: 0, C: 0, D: 0, F: 0 },
          totalStudents: 0,
          totalAssignments: 0,
        }
      });
    }

    // Get all submissions for these assignments
    const { data: submissions } = await supabase
      .from('assignment_submissions')
      .select('grade, student_id')
      .in('assignment_id', assignmentIds);

    // Calculate average grade
    const gradedSubmissions = submissions?.filter(s => s.grade !== null) || [];
    let averageGrade = null;
    if (gradedSubmissions.length > 0) {
      const total = gradedSubmissions.reduce((sum, s) => sum + parseFloat(s.grade), 0);
      averageGrade = Math.round(total / gradedSubmissions.length);
    }

    // Calculate completion rate
    const { count: totalEnrollments } = await supabase
      .from('enrollments')
      .select('*', { count: 'exact', head: true })
      .eq('class_id', classId);

    const expectedSubmissions = (totalEnrollments || 0) * assignmentIds.length;
    const completionRate = expectedSubmissions > 0
      ? Math.round(((submissions?.length || 0) / expectedSubmissions) * 100)
      : 0;

    // Calculate grade distribution
    const gradeDistribution = { A: 0, B: 0, C: 0, D: 0, F: 0 };
    gradedSubmissions.forEach(s => {
      const grade = parseFloat(s.grade);
      if (grade >= 90) gradeDistribution.A++;
      else if (grade >= 80) gradeDistribution.B++;
      else if (grade >= 70) gradeDistribution.C++;
      else if (grade >= 60) gradeDistribution.D++;
      else gradeDistribution.F++;
    });

    res.status(200).json({
      analytics: {
        averageGrade: averageGrade ? `${averageGrade}%` : 'N/A',
        completionRate: `${completionRate}%`,
        gradeDistribution,
        totalStudents: totalEnrollments || 0,
        totalAssignments: assignmentIds.length,
      }
    });
  } catch (err) {
    console.error('Error in getClassAnalytics:', err);
    return ErrorResponse.internalServerError('An error occurred while fetching class analytics').send(res);
  }
};


