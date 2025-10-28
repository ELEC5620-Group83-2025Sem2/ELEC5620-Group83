import { getSupabaseClient } from '../../clients/supabaseClient.js';
import { ErrorResponse } from '../../utils/errorResponse.js';

/**
 * Get all assignments for teacher's classes
 */
export const getTeacherAssignments = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const { status, classId } = req.query;
    const supabase = getSupabaseClient();

    // Get teacher's class IDs
    const { data: classTeachers, error: ctError } = await supabase
      .from('class_teachers')
      .select('class_id')
      .eq('profile_id', teacherId);

    if (ctError) throw ctError;

    if (!classTeachers || classTeachers.length === 0) {
      return res.json({ assignments: [], total: 0 });
    }

    const classIds = classTeachers.map(ct => ct.class_id);

    // Build query
    let query = supabase
      .from('assignments')
      .select(`
        *,
        classes:class_id (
          id,
          name,
          class_code
        )
      `)
      .in('class_id', classIds)
      .order('created_at', { ascending: false });

    // Filter by status if provided
    if (status) {
      query = query.eq('status', status);
    }

    // Filter by class if provided
    if (classId) {
      query = query.eq('class_id', classId);
    }

    const { data: assignments, error: assignError } = await query;

    if (assignError) throw assignError;

    // Get submission stats for each assignment
    const assignmentsWithStats = await Promise.all(
      assignments.map(async (assignment) => {
        // Count total submissions
        const { count: totalSubmissions } = await supabase
          .from('assignment_submissions')
          .select('id', { count: 'exact', head: true })
          .eq('assignment_id', assignment.id);

        // Count graded submissions
        const { count: gradedCount } = await supabase
          .from('assignment_submissions')
          .select('id', { count: 'exact', head: true })
          .eq('assignment_id', assignment.id)
          .not('grade', 'is', null);

        // Count pending (submitted but not graded)
        const { count: pendingCount } = await supabase
          .from('assignment_submissions')
          .select('id', { count: 'exact', head: true })
          .eq('assignment_id', assignment.id)
          .eq('status', 'submitted')
          .is('grade', null);

        // Get class enrollment count for total possible submissions
        const { count: enrollmentCount } = await supabase
          .from('enrollments')
          .select('student_id', { count: 'exact', head: true })
          .eq('class_id', assignment.class_id);

        return {
          ...assignment,
          total_submissions: totalSubmissions || 0,
          graded_count: gradedCount || 0,
          pending_grading: pendingCount || 0,
          total_students: enrollmentCount || 0
        };
      })
    );

    return res.json({
      assignments: assignmentsWithStats,
      total: assignmentsWithStats.length
    });

  } catch (err) {
    console.error('Get teacher assignments error:', err);
    return ErrorResponse.internalServerError(err.message).send(res);
  }
};

/**
 * Get assignment details
 */
export const getAssignmentDetail = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const { assignmentId } = req.params;
    const supabase = getSupabaseClient();

    // Get assignment
    const { data: assignment, error: assignError } = await supabase
      .from('assignments')
      .select(`
        *,
        classes:class_id (
          id,
          name,
          class_code
        )
      `)
      .eq('id', assignmentId)
      .single();

    if (assignError) throw assignError;
    if (!assignment) {
      return ErrorResponse.notFound('Assignment not found').send(res);
    }

    // Verify teacher has access to this class
    const { data: access } = await supabase
      .from('class_teachers')
      .select('role_in_class')
      .eq('profile_id', teacherId)
      .eq('class_id', assignment.class_id)
      .single();

    if (!access) {
      return ErrorResponse.forbidden('You do not have access to this assignment').send(res);
    }

    // Get related data
    const [instructions, requirements, resources, rubricItems, questions] = await Promise.all([
      supabase.from('assignment_instructions').select('*').eq('assignment_id', assignmentId),
      supabase.from('assignment_requirements').select('*').eq('assignment_id', assignmentId),
      supabase.from('assignment_resources').select('*').eq('assignment_id', assignmentId),
      supabase.from('assignment_rubric_items').select('*').eq('assignment_id', assignmentId).order('points', { ascending: false }),
      supabase.from('assignment_questions').select(`
        *,
        options:assignment_question_options(*)
      `).eq('assignment_id', assignmentId).order('order_num', { ascending: true })
    ]);

    return res.json({
      assignment: {
        ...assignment,
        instructions: instructions.data || [],
        requirements: requirements.data || [],
        resources: resources.data || [],
        rubric_items: rubricItems.data || [],
        questions: questions.data || []
      }
    });

  } catch (err) {
    console.error('Get assignment detail error:', err);
    return ErrorResponse.internalServerError(err.message).send(res);
  }
};

/**
 * Create new assignment
 */
export const createAssignment = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const {
      class_id,
      title,
      description,
      assignment_type,
      points_possible,
      due_date,
      instructions,
      requirements,
      resources,
      rubric_items,
      questions
    } = req.body;

    const supabase = getSupabaseClient();

    // Verify teacher has access to this class
    const { data: access } = await supabase
      .from('class_teachers')
      .select('role_in_class')
      .eq('profile_id', teacherId)
      .eq('class_id', class_id)
      .single();

    if (!access) {
      return ErrorResponse.forbidden('You do not have access to this class').send(res);
    }

    // Create assignment
    const { data: assignment, error: assignError } = await supabase
      .from('assignments')
      .insert({
        class_id,
        title,
        description,
        assignment_type: assignment_type || 'homework',
        points_possible: points_possible || 100,
        due_date,
        status: 'draft',
        created_by: teacherId
      })
      .select()
      .single();

    if (assignError) throw assignError;

    // Insert related data if provided
    const assignmentId = assignment.id;

    if (instructions && instructions.length > 0) {
      await supabase.from('assignment_instructions').insert(
        instructions.map((inst, idx) => ({
          assignment_id: assignmentId,
          step_number: idx + 1,
          instruction_text: inst.instruction_text || inst
        }))
      );
    }

    if (requirements && requirements.length > 0) {
      await supabase.from('assignment_requirements').insert(
        requirements.map(req => ({
          assignment_id: assignmentId,
          requirement_text: req.requirement_text || req,
          is_required: req.is_required !== false
        }))
      );
    }

    if (resources && resources.length > 0) {
      await supabase.from('assignment_resources').insert(
        resources.map(res => ({
          assignment_id: assignmentId,
          resource_type: res.resource_type || 'link',
          resource_url: res.resource_url,
          resource_title: res.resource_title
        }))
      );
    }

    if (rubric_items && rubric_items.length > 0) {
      await supabase.from('assignment_rubric_items').insert(
        rubric_items.map(item => ({
          assignment_id: assignmentId,
          criteria: item.criteria,
          points: item.points,
          description: item.description
        }))
      );
    }

    if (questions && questions.length > 0) {
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        const { data: question } = await supabase
          .from('assignment_questions')
          .insert({
            assignment_id: assignmentId,
            question_type: q.question_type || 'text',
            question_text: q.question_text,
            points: q.points || 0,
            order_num: i + 1
          })
          .select()
          .single();

        // Insert options for multiple choice questions
        if (question && q.options && q.options.length > 0) {
          await supabase.from('assignment_question_options').insert(
            q.options.map((opt, optIdx) => ({
              question_id: question.id,
              option_text: opt.option_text || opt,
              is_correct: opt.is_correct || false,
              order_num: optIdx + 1
            }))
          );
        }
      }
    }

    return res.status(201).json({
      message: 'Assignment created successfully',
      assignment
    });

  } catch (err) {
    console.error('Create assignment error:', err);
    return ErrorResponse.internalServerError(err.message).send(res);
  }
};

/**
 * Update assignment
 */
export const updateAssignment = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const { assignmentId } = req.params;
    const updateData = req.body;
    const supabase = getSupabaseClient();

    // Get assignment and verify access
    const { data: assignment } = await supabase
      .from('assignments')
      .select('class_id')
      .eq('id', assignmentId)
      .single();

    if (!assignment) {
      return ErrorResponse.notFound('Assignment not found').send(res);
    }

    const { data: access } = await supabase
      .from('class_teachers')
      .select('role_in_class')
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

    if (updateError) throw updateError;

    return res.json({
      message: 'Assignment updated successfully',
      assignment: updated
    });

  } catch (err) {
    console.error('Update assignment error:', err);
    return ErrorResponse.internalServerError(err.message).send(res);
  }
};

/**
 * Publish assignment (make it visible to students)
 */
export const publishAssignment = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const { assignmentId } = req.params;
    const supabase = getSupabaseClient();

    // Get assignment and verify access
    const { data: assignment } = await supabase
      .from('assignments')
      .select('class_id, status')
      .eq('id', assignmentId)
      .single();

    if (!assignment) {
      return ErrorResponse.notFound('Assignment not found').send(res);
    }

    const { data: access } = await supabase
      .from('class_teachers')
      .select('role_in_class')
      .eq('profile_id', teacherId)
      .eq('class_id', assignment.class_id)
      .single();

    if (!access) {
      return ErrorResponse.forbidden('You do not have access to this assignment').send(res);
    }

    // Update status to published
    const { data: updated, error: updateError } = await supabase
      .from('assignments')
      .update({ 
        status: 'published',
        published_at: new Date().toISOString()
      })
      .eq('id', assignmentId)
      .select()
      .single();

    if (updateError) throw updateError;

    return res.json({
      message: 'Assignment published successfully',
      assignment: updated
    });

  } catch (err) {
    console.error('Publish assignment error:', err);
    return ErrorResponse.internalServerError(err.message).send(res);
  }
};

/**
 * Delete assignment
 */
export const deleteAssignment = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const { assignmentId } = req.params;
    const supabase = getSupabaseClient();

    // Get assignment and verify access
    const { data: assignment } = await supabase
      .from('assignments')
      .select('class_id')
      .eq('id', assignmentId)
      .single();

    if (!assignment) {
      return ErrorResponse.notFound('Assignment not found').send(res);
    }

    const { data: access } = await supabase
      .from('class_teachers')
      .select('role_in_class')
      .eq('profile_id', teacherId)
      .eq('class_id', assignment.class_id)
      .single();

    if (!access) {
      return ErrorResponse.forbidden('You do not have access to this assignment').send(res);
    }

    // Delete assignment (cascade will delete related data)
    const { error: deleteError } = await supabase
      .from('assignments')
      .delete()
      .eq('id', assignmentId);

    if (deleteError) throw deleteError;

    return res.json({
      message: 'Assignment deleted successfully'
    });

  } catch (err) {
    console.error('Delete assignment error:', err);
    return ErrorResponse.internalServerError(err.message).send(res);
  }
};



