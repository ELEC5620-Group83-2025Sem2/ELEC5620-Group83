import { getSupabaseClient } from '../../clients/supabaseClient.js';
import { ErrorResponse } from '../../utils/errorResponse.js';

/**
 * GET /api/teacher/students
 * Get all students across all classes taught by the teacher
 */
export const getTeacherStudents = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const supabase = getSupabaseClient();

    // Get all classes taught by this teacher
    const { data: classTeachers } = await supabase
      .from('class_teachers')
      .select('class_id')
      .eq('profile_id', teacherId);

    const classIds = classTeachers?.map(ct => ct.class_id) || [];

    if (classIds.length === 0) {
      return res.status(200).json({ students: [] });
    }

    // Get all students enrolled in these classes
    const { data: enrollments, error: enrollError } = await supabase
      .from('enrollments')
      .select(`
        student_id,
        class_id,
        enrolled_at,
        profiles (
          id,
          first_name,
          last_name,
          email,
          avatar
        ),
        classes (
          id,
          name,
          code
        )
      `)
      .in('class_id', classIds);

    if (enrollError) {
      console.error('Error fetching enrollments:', enrollError);
      return ErrorResponse.internalServerError('Failed to fetch students').send(res);
    }

    // Group enrollments by student
    const studentMap = new Map();

    for (const enrollment of enrollments) {
      const studentId = enrollment.student_id;
      const profile = enrollment.profiles;

      if (!studentMap.has(studentId)) {
        studentMap.set(studentId, {
          id: profile.id,
          name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || profile.email,
          firstName: profile.first_name,
          lastName: profile.last_name,
          email: profile.email,
          avatar: profile.avatar,
          classes: [],
        });
      }

      const student = studentMap.get(studentId);
      student.classes.push({
        id: enrollment.classes.id,
        name: enrollment.classes.name,
        code: enrollment.classes.code,
        enrolledAt: enrollment.enrolled_at,
      });
    }

    // Convert map to array and enrich with grade data
    const students = await Promise.all(
      Array.from(studentMap.values()).map(async (student) => {
        // Get all assignment IDs from student's classes
        const studentClassIds = student.classes.map(c => c.id);
        
        const { data: assignments } = await supabase
          .from('assignments')
          .select('id')
          .in('class_id', studentClassIds);

        const assignmentIds = assignments?.map(a => a.id) || [];

        if (assignmentIds.length === 0) {
          return {
            ...student,
            avgGrade: 'N/A',
            completedAssignments: 0,
            totalAssignments: 0,
          };
        }

        // Get student's submissions
        const { data: submissions } = await supabase
          .from('assignment_submissions')
          .select('grade, assignment_id')
          .eq('student_id', student.id)
          .in('assignment_id', assignmentIds);

        const gradedSubmissions = submissions?.filter(s => s.grade !== null) || [];
        let avgGrade = null;
        if (gradedSubmissions.length > 0) {
          const total = gradedSubmissions.reduce((sum, s) => sum + parseFloat(s.grade), 0);
          avgGrade = Math.round(total / gradedSubmissions.length);
        }

        return {
          ...student,
          avgGrade: avgGrade ? `${avgGrade}%` : 'N/A',
          completedAssignments: submissions?.length || 0,
          totalAssignments: assignmentIds.length,
        };
      })
    );

    res.status(200).json({ students });
  } catch (err) {
    console.error('Error in getTeacherStudents:', err);
    return ErrorResponse.internalServerError('An error occurred while fetching students').send(res);
  }
};

/**
 * GET /api/teacher/students/:id
 * Get detailed information about a specific student
 */
export const getStudentDetails = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const { id: studentId } = req.params;
    const supabase = getSupabaseClient();

    // Get student profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', studentId)
      .single();

    if (profileError || !profile) {
      return ErrorResponse.notFound('Student not found').send(res);
    }

    // Get all classes taught by this teacher that the student is enrolled in
    const { data: classTeachers } = await supabase
      .from('class_teachers')
      .select('class_id')
      .eq('profile_id', teacherId);

    const teacherClassIds = classTeachers?.map(ct => ct.class_id) || [];

    // Get student's enrollments in teacher's classes
    const { data: enrollments, error: enrollError } = await supabase
      .from('enrollments')
      .select(`
        class_id,
        enrolled_at,
        classes (
          id,
          name,
          code,
          color
        )
      `)
      .eq('student_id', studentId)
      .in('class_id', teacherClassIds);

    if (enrollError) {
      console.error('Error fetching enrollments:', enrollError);
      return ErrorResponse.internalServerError('Failed to fetch student details').send(res);
    }

    // Verify teacher has access to at least one of student's classes
    if (!enrollments || enrollments.length === 0) {
      return ErrorResponse.forbidden('You do not have access to this student').send(res);
    }

    // Get student's performance in each class
    const classesWithGrades = await Promise.all(
      enrollments.map(async (enrollment) => {
        const classId = enrollment.class_id;

        // Get assignments for this class
        const { data: assignments } = await supabase
          .from('assignments')
          .select('id')
          .eq('class_id', classId);

        const assignmentIds = assignments?.map(a => a.id) || [];

        // Get student's submissions for this class
        const { data: submissions } = await supabase
          .from('assignment_submissions')
          .select('grade')
          .eq('student_id', studentId)
          .in('assignment_id', assignmentIds);

        const gradedSubmissions = submissions?.filter(s => s.grade !== null) || [];
        let avgGrade = null;
        if (gradedSubmissions.length > 0) {
          const total = gradedSubmissions.reduce((sum, s) => sum + parseFloat(s.grade), 0);
          avgGrade = Math.round(total / gradedSubmissions.length);
        }

        return {
          classId: enrollment.classes.id,
          className: enrollment.classes.name,
          classCode: enrollment.classes.code,
          color: enrollment.classes.color,
          enrolledAt: enrollment.enrolled_at,
          avgGrade: avgGrade ? `${avgGrade}%` : 'N/A',
          completedAssignments: submissions?.length || 0,
          totalAssignments: assignmentIds.length,
        };
      })
    );

    // Get recent activity (recent submissions)
    const allClassIds = enrollments.map(e => e.class_id);
    const { data: allAssignments } = await supabase
      .from('assignments')
      .select('id, title')
      .in('class_id', allClassIds);

    const allAssignmentIds = allAssignments?.map(a => a.id) || [];

    const { data: recentSubmissions } = await supabase
      .from('assignment_submissions')
      .select(`
        id,
        submitted_at,
        grade,
        assignment_id,
        assignments (
          title
        )
      `)
      .eq('student_id', studentId)
      .in('assignment_id', allAssignmentIds)
      .order('submitted_at', { ascending: false })
      .limit(10);

    const recentActivity = recentSubmissions?.map(sub => ({
      id: sub.id,
      assignmentTitle: sub.assignments?.title || 'Unknown',
      submittedAt: sub.submitted_at,
      grade: sub.grade,
    })) || [];

    // Get or create student notes
    const { data: notes } = await supabase
      .from('student_notes')
      .select('notes')
      .eq('student_id', studentId)
      .eq('teacher_id', teacherId)
      .single();

    res.status(200).json({
      student: {
        id: profile.id,
        name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || profile.email,
        firstName: profile.first_name,
        lastName: profile.last_name,
        email: profile.email,
        avatar: profile.avatar,
        classes: classesWithGrades,
        recentActivity,
        notes: notes?.notes || '',
      }
    });
  } catch (err) {
    console.error('Error in getStudentDetails:', err);
    return ErrorResponse.internalServerError('An error occurred while fetching student details').send(res);
  }
};

/**
 * PUT /api/teacher/students/:id/notes
 * Save or update notes for a student
 */
export const updateStudentNotes = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const { id: studentId } = req.params;
    const { notes } = req.body;

    if (typeof notes !== 'string') {
      return ErrorResponse.badRequest('Notes must be a string').send(res);
    }

    const supabase = getSupabaseClient();

    // Verify teacher has access to this student
    const { data: classTeachers } = await supabase
      .from('class_teachers')
      .select('class_id')
      .eq('profile_id', teacherId);

    const teacherClassIds = classTeachers?.map(ct => ct.class_id) || [];

    const { data: enrollment } = await supabase
      .from('enrollments')
      .select('class_id')
      .eq('student_id', studentId)
      .in('class_id', teacherClassIds)
      .limit(1)
      .single();

    if (!enrollment) {
      return ErrorResponse.forbidden('You do not have access to this student').send(res);
    }

    // Upsert notes
    const { data: updatedNotes, error: upsertError } = await supabase
      .from('student_notes')
      .upsert(
        {
          student_id: studentId,
          teacher_id: teacherId,
          notes,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'student_id,teacher_id',
        }
      )
      .select()
      .single();

    if (upsertError) {
      console.error('Error updating notes:', upsertError);
      return ErrorResponse.internalServerError('Failed to update notes').send(res);
    }

    res.status(200).json({
      message: 'Notes updated successfully',
      notes: updatedNotes
    });
  } catch (err) {
    console.error('Error in updateStudentNotes:', err);
    return ErrorResponse.internalServerError('An error occurred while updating notes').send(res);
  }
};


