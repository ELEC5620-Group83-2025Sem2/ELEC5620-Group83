import { getSupabaseClient } from '../../clients/supabaseClient.js';
import { ErrorResponse } from '../../utils/errorResponse.js';

/**
 * GET /api/teacher/assignments
 * Get all assignments created by the teacher
 * Get all assignments for teacher's classes
 */
export const getTeacherAssignments = async (req, res) => {
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
      return res.status(200).json({ assignments: [] });
    }

    // Get assignments for these classes
    const { data: assignments, error: assignError } = await supabase
      .from('assignments')
      .select(`
        *,
        classes (
          name,
          code
        )
      `)
      .in('class_id', classIds)
      .order('created_at', { ascending: false });

    if (assignError) {
      console.error('Error fetching assignments:', assignError);
      return ErrorResponse.internalServerError('Failed to fetch assignments').send(res);
    }

    // Enrich each assignment with submission stats
    const enrichedAssignments = await Promise.all(assignments.map(async (assignment) => {
      // Get submission stats
      const { data: submissions } = await supabase
        .from('assignment_submissions')
        .select('id, status, grade')
        .eq('assignment_id', assignment.id);

      const totalSubmissions = submissions?.length || 0;
      const gradedSubmissions = submissions?.filter(s => s.grade !== null).length || 0;
      const pendingGrading = submissions?.filter(s => s.status === 'submitted' && s.grade === null).length || 0;

      // Get total enrolled students in the class
      const { count: totalStudents } = await supabase
        .from('enrollments')
        .select('*', { count: 'exact', head: true })
        .eq('class_id', assignment.class_id);

      return {
        id: assignment.id,
        title: assignment.title,
        description: assignment.description,
        className: assignment.classes?.name || 'Unknown',
        classCode: assignment.classes?.code || '',
        dueDate: assignment.due_date,
        totalPoints: assignment.total_points,
        status: assignment.status || 'draft',
        submissionStats: {
          total: totalSubmissions,
          graded: gradedSubmissions,
          pending: pendingGrading,
          totalStudents: totalStudents || 0,
        },
        createdAt: assignment.created_at,
      };
    }));

    res.status(200).json({ assignments: enrichedAssignments });
  } catch (err) {
    console.error('Error in getTeacherAssignments:', err);
    return ErrorResponse.internalServerError('An error occurred while fetching assignments').send(res);
  }
};

/**
 * GET /api/teacher/assignments/:id
 * Get details for a specific assignment
 */
export const getAssignmentDetails = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const { id: assignmentId } = req.params;
    const supabase = getSupabaseClient();

    // Get assignment details
    const { data: assignment, error: assignError } = await supabase
      .from('assignments')
      .select(`
        *,
        classes (
          id,
          name,
          code
        )
      `)
      .eq('id', assignmentId)
      .single();

    if (assignError || !assignment) {
      return ErrorResponse.notFound('Assignment not found').send(res);
    }

    // Verify teacher has access to this assignment's class
    const { data: access } = await supabase
      .from('class_teachers')
      .select('*')
      .eq('profile_id', teacherId)
      .eq('class_id', assignment.class_id)
      .single();

    if (!access) {
      return ErrorResponse.forbidden('You do not have access to this assignment').send(res);
    }

    // Get submissions
    const { data: submissions } = await supabase
      .from('assignment_submissions')
      .select(`
        *,
        profiles (
          id,
          first_name,
          last_name,
          email,
          avatar
        )
      `)
      .eq('assignment_id', assignmentId);

    const enrichedSubmissions = submissions?.map(sub => ({
      id: sub.id,
      studentId: sub.student_id,
      studentName: `${sub.profiles?.first_name || ''} ${sub.profiles?.last_name || ''}`.trim() || sub.profiles?.email,
      studentAvatar: sub.profiles?.avatar,
      submittedAt: sub.submitted_at,
      status: sub.status,
      grade: sub.grade,
      feedback: sub.feedback,
      content: sub.content,
    })) || [];

    res.status(200).json({
      assignment: {
        ...assignment,
        className: assignment.classes?.name,
        classCode: assignment.classes?.code,
        submissions: enrichedSubmissions,
      }
    });
  } catch (err) {
    console.error('Error in getAssignmentDetails:', err);
    return ErrorResponse.internalServerError('An error occurred while fetching assignment details').send(res);
  }
};

/**
 * POST /api/teacher/assignments
 * Create a new assignment
 */
export const createAssignment = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const {
      classId,
      title,
      description,
      instructions,
      dueDate,
      totalPoints,
      rubric,
      questions,
      resources,
    } = req.body;

    const supabase = getSupabaseClient();

    // Verify teacher has access to this class
    const { data: access } = await supabase
      .from('class_teachers')
      .select('*')
      .eq('profile_id', teacherId)
      .eq('class_id', classId)
      .single();

    if (!access) {
      return ErrorResponse.forbidden('You do not have access to this class').send(res);
    }

    // Validate required fields
    if (!title || !classId || !dueDate) {
      return ErrorResponse.badRequest('Missing required fields: title, classId, dueDate').send(res);
    }

    // Create assignment
    const { data: assignment, error: createError } = await supabase
      .from('assignments')
      .insert([{
        class_id: classId,
        title,
        description,
        instructions: instructions || [],
        due_date: dueDate,
        total_points: totalPoints || 100,
        rubric: rubric || [],
        questions: questions || [],
        resources: resources || [],
        status: 'draft',
        created_by: teacherId,
      }])
      .select()
      .single();

    if (createError) {
      console.error('Error creating assignment:', createError);
      return ErrorResponse.internalServerError('Failed to create assignment').send(res);
    }

    res.status(201).json({
      message: 'Assignment created successfully',
      assignment
    });
  } catch (err) {
    console.error('Error in createAssignment:', err);
    return ErrorResponse.internalServerError('An error occurred while creating assignment').send(res);
  }
};

/**
 * PUT /api/teacher/assignments/:id
 * Update an existing assignment
 */
export const updateAssignment = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const { id: assignmentId } = req.params;
    const updateData = req.body;

    const supabase = getSupabaseClient();

    // Get assignment to verify ownership
    const { data: assignment, error: fetchError } = await supabase
      .from('assignments')
      .select('class_id')
      .eq('id', assignmentId)
      .single();

    if (fetchError || !assignment) {
      return ErrorResponse.notFound('Assignment not found').send(res);
    }

    // Verify teacher has access
    const { data: access } = await supabase
      .from('class_teachers')
      .select('*')
      .eq('profile_id', teacherId)
      .eq('class_id', assignment.class_id)
      .single();

    if (!access) {
      return ErrorResponse.forbidden('You do not have access to this assignment').send(res);
    }

    // Update assignment
    const { data: updated, error: updateError } = await supabase
      .from('assignments')
      .update(updateData)
      .eq('id', assignmentId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating assignment:', updateError);
      return ErrorResponse.internalServerError('Failed to update assignment').send(res);
    }

    res.status(200).json({
      message: 'Assignment updated successfully',
      assignment: updated
    });
  } catch (err) {
    console.error('Error in updateAssignment:', err);
    return ErrorResponse.internalServerError('An error occurred while updating assignment').send(res);
  }
};

/**
 * DELETE /api/teacher/assignments/:id
 * Delete an assignment
 */
export const deleteAssignment = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const { id: assignmentId } = req.params;

    const supabase = getSupabaseClient();

    // Get assignment to verify ownership
    const { data: assignment, error: fetchError } = await supabase
      .from('assignments')
      .select('class_id')
      .eq('id', assignmentId)
      .single();

    if (fetchError || !assignment) {
      return ErrorResponse.notFound('Assignment not found').send(res);
    }

    // Verify teacher has access
    const { data: access } = await supabase
      .from('class_teachers')
      .select('*')
      .eq('profile_id', teacherId)
      .eq('class_id', assignment.class_id)
      .single();

    if (!access) {
      return ErrorResponse.forbidden('You do not have access to this assignment').send(res);
    }

    // Delete assignment
    const { error: deleteError } = await supabase
      .from('assignments')
      .delete()
      .eq('id', assignmentId);

    if (deleteError) {
      console.error('Error deleting assignment:', deleteError);
      return ErrorResponse.internalServerError('Failed to delete assignment').send(res);
    }

    res.status(200).json({
      message: 'Assignment deleted successfully'
    });
  } catch (err) {
    console.error('Error in deleteAssignment:', err);
    return ErrorResponse.internalServerError('An error occurred while deleting assignment').send(res);
  }
};

/**
 * POST /api/teacher/assignments/:id/publish
 * Publish an assignment (make it visible to students)
 */
export const publishAssignment = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const { id: assignmentId } = req.params;

    const supabase = getSupabaseClient();

    // Get assignment to verify ownership
    const { data: assignment, error: fetchError } = await supabase
      .from('assignments')
      .select('class_id, status')
      .eq('id', assignmentId)
      .single();

    if (fetchError || !assignment) {
      return ErrorResponse.notFound('Assignment not found').send(res);
    }

    // Verify teacher has access
    const { data: access } = await supabase
      .from('class_teachers')
      .select('*')
      .eq('profile_id', teacherId)
      .eq('class_id', assignment.class_id)
      .single();

    if (!access) {
      return ErrorResponse.forbidden('You do not have access to this assignment').send(res);
    }

    // Update status to published
    const { data: updated, error: updateError } = await supabase
      .from('assignments')
      .update({ status: 'published' })
      .eq('id', assignmentId)
      .select()
      .single();

    if (updateError) {
      console.error('Error publishing assignment:', updateError);
      return ErrorResponse.internalServerError('Failed to publish assignment').send(res);
    }

    res.status(200).json({
      message: 'Assignment published successfully',
      assignment: updated
    });
  } catch (err) {
    console.error('Error in publishAssignment:', err);
    return ErrorResponse.internalServerError('An error occurred while publishing assignment').send(res);
  }
};


