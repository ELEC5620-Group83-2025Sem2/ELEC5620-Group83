import { getSupabaseClient } from '../../clients/supabaseClient.js';
import { ErrorResponse } from '../../utils/errorResponse.js';

/**
 * UC08: Review Student Behavior Report
 * Get all students in teacher's classes
 */
export const getTeacherStudents = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const { classId, search } = req.query;
    const supabase = getSupabaseClient();

    // Get teacher's class IDs
    const { data: classTeachers, error: ctError } = await supabase
      .from('class_teachers')
      .select('class_id')
      .eq('profile_id', teacherId);

    if (ctError) throw ctError;

    if (!classTeachers || classTeachers.length === 0) {
      return res.json({ students: [], total: 0 });
    }

    let classIds = classTeachers.map(ct => ct.class_id);

    // Filter by specific class if provided
    if (classId) {
      if (!classIds.includes(classId)) {
        return ErrorResponse.forbidden('You do not have access to this class').send(res);
      }
      classIds = [classId];
    }

    // Get enrollments for these classes
    const { data: enrollments, error: enrollError } = await supabase
      .from('enrollments')
      .select(`
        student_id,
        class_id,
        enrolled_at,
        classes:class_id (
          id,
          name,
          class_code
        ),
        profiles:student_id (
          id,
          first_name,
          last_name,
          email,
          avatar
        )
      `)
      .in('class_id', classIds);

    if (enrollError) throw enrollError;

    // Group by student and get their stats
    const studentMap = new Map();
    
    for (const enrollment of enrollments) {
      const studentId = enrollment.student_id;
      const profile = enrollment.profiles;

      if (!studentMap.has(studentId)) {
        // Search filter
        if (search) {
          const searchLower = search.toLowerCase();
          const fullName = `${profile.first_name} ${profile.last_name}`.toLowerCase();
          const email = profile.email?.toLowerCase() || '';
          if (!fullName.includes(searchLower) && !email.includes(searchLower)) {
            continue;
          }
        }

        studentMap.set(studentId, {
          student_id: studentId,
          first_name: profile.first_name,
          last_name: profile.last_name,
          email: profile.email,
          avatar: profile.avatar,
          classes: []
        });
      }

      studentMap.get(studentId).classes.push({
        class_id: enrollment.class_id,
        class_name: enrollment.classes.name,
        class_code: enrollment.classes.class_code,
        enrolled_at: enrollment.enrolled_at
      });
    }

    // Get stats for each student
    const students = await Promise.all(
      Array.from(studentMap.values()).map(async (student) => {
        // Count total assignments in their classes
        const studentClassIds = student.classes.map(c => c.class_id);
        
        const { count: totalAssignments } = await supabase
          .from('assignments')
          .select('id', { count: 'exact', head: true })
          .in('class_id', studentClassIds)
          .eq('status', 'published');

        // Count submissions
        const { count: submittedCount } = await supabase
          .from('assignment_submissions')
          .select('id', { count: 'exact', head: true })
          .eq('student_id', student.student_id)
          .in('class_id', studentClassIds);

        // Get average grade
        const { data: grades } = await supabase
          .from('assignment_submissions')
          .select('grade, points_possible')
          .eq('student_id', student.student_id)
          .in('class_id', studentClassIds)
          .not('grade', 'is', null);

        let avgGrade = null;
        if (grades && grades.length > 0) {
          const totalPercentage = grades.reduce((sum, g) => {
            return sum + (g.grade / g.points_possible) * 100;
          }, 0);
          avgGrade = Math.round(totalPercentage / grades.length);
        }

        return {
          ...student,
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
      students,
      total: students.length
    });

  } catch (err) {
    console.error('Get teacher students error:', err);
    return ErrorResponse.internalServerError(err.message).send(res);
  }
};

/**
 * Get detailed information about a specific student
 */
export const getStudentDetail = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const { studentId } = req.params;
    const supabase = getSupabaseClient();

    // Get student profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, email, avatar, created_at')
      .eq('id', studentId)
      .single();

    if (profileError) throw profileError;
    if (!profile) {
      return ErrorResponse.notFound('Student not found').send(res);
    }

    // Get teacher's class IDs
    const { data: classTeachers } = await supabase
      .from('class_teachers')
      .select('class_id')
      .eq('profile_id', teacherId);

    const teacherClassIds = classTeachers?.map(ct => ct.class_id) || [];

    // Get student's enrollments in teacher's classes
    const { data: enrollments } = await supabase
      .from('enrollments')
      .select(`
        class_id,
        enrolled_at,
        classes:class_id (
          id,
          name,
          class_code,
          subject
        )
      `)
      .eq('student_id', studentId)
      .in('class_id', teacherClassIds);

    if (!enrollments || enrollments.length === 0) {
      return ErrorResponse.forbidden('This student is not in any of your classes').send(res);
    }

    const studentClassIds = enrollments.map(e => e.class_id);

    // Get submission history
    const { data: submissions } = await supabase
      .from('assignment_submissions')
      .select(`
        id,
        submitted_at,
        grade,
        points_possible,
        status,
        assignments:assignment_id (
          id,
          title,
          due_date,
          class_id,
          classes:class_id (
            name
          )
        )
      `)
      .eq('student_id', studentId)
      .in('class_id', studentClassIds)
      .order('submitted_at', { ascending: false })
      .limit(20);

    // Calculate overall stats
    const { data: allGrades } = await supabase
      .from('assignment_submissions')
      .select('grade, points_possible')
      .eq('student_id', studentId)
      .in('class_id', studentClassIds)
      .not('grade', 'is', null);

    let overallAvg = null;
    if (allGrades && allGrades.length > 0) {
      const totalPercentage = allGrades.reduce((sum, g) => {
        return sum + (g.grade / g.points_possible) * 100;
      }, 0);
      overallAvg = Math.round(totalPercentage / allGrades.length);
    }

    // Get total assignments
    const { count: totalAssignments } = await supabase
      .from('assignments')
      .select('id', { count: 'exact', head: true })
      .in('class_id', studentClassIds)
      .eq('status', 'published');

    return res.json({
      student: {
        ...profile,
        classes: enrollments.map(e => ({
          class_id: e.class_id,
          class_name: e.classes.name,
          class_code: e.classes.class_code,
          subject: e.classes.subject,
          enrolled_at: e.enrolled_at
        })),
        stats: {
          total_assignments: totalAssignments || 0,
          total_submissions: submissions?.length || 0,
          average_grade: overallAvg,
          recent_submissions: submissions || []
        }
      }
    });

  } catch (err) {
    console.error('Get student detail error:', err);
    return ErrorResponse.internalServerError(err.message).send(res);
  }
};

/**
 * Get student performance in a specific class
 */
export const getStudentClassPerformance = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const { studentId, classId } = req.params;
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

    // Verify student is enrolled in this class
    const { data: enrollment } = await supabase
      .from('enrollments')
      .select('enrolled_at')
      .eq('student_id', studentId)
      .eq('class_id', classId)
      .single();

    if (!enrollment) {
      return ErrorResponse.notFound('Student is not enrolled in this class').send(res);
    }

    // Get all assignments for this class
    const { data: assignments } = await supabase
      .from('assignments')
      .select('id, title, due_date, points_possible, status')
      .eq('class_id', classId)
      .eq('status', 'published')
      .order('due_date', { ascending: false });

    // Get submissions for these assignments
    const assignmentIds = assignments?.map(a => a.id) || [];
    
    const { data: submissions } = await supabase
      .from('assignment_submissions')
      .select('*')
      .eq('student_id', studentId)
      .in('assignment_id', assignmentIds);

    // Combine data
    const performance = assignments?.map(assignment => {
      const submission = submissions?.find(s => s.assignment_id === assignment.id);
      
      return {
        assignment_id: assignment.id,
        assignment_title: assignment.title,
        due_date: assignment.due_date,
        points_possible: assignment.points_possible,
        submission_status: submission ? submission.status : 'not_submitted',
        submitted_at: submission?.submitted_at || null,
        grade: submission?.grade || null,
        feedback: submission?.feedback || null,
        percentage: submission?.grade 
          ? Math.round((submission.grade / assignment.points_possible) * 100)
          : null
      };
    }) || [];

    return res.json({
      student_id: studentId,
      class_id: classId,
      performance
    });

  } catch (err) {
    console.error('Get student class performance error:', err);
    return ErrorResponse.internalServerError(err.message).send(res);
  }
};



