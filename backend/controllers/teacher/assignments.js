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
      // Debug: Log assignment data to check for due_date
      console.log('Assignment data:', {
        id: assignment.id,
        title: assignment.title,
        due_date: assignment.due_date,
        dueDate: assignment.dueDate,
        allKeys: Object.keys(assignment)
      });

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

      // Get due_date - try multiple possible field names
      const dueDate = assignment.due_date || assignment.dueDate || assignment.due || null;

      return {
        id: assignment.id,
        title: assignment.title,
        description: assignment.description,
        className: assignment.classes?.name || 'Unknown',
        classCode: assignment.classes?.code || '',
        dueDate: dueDate,
        due_date: dueDate, // Also include snake_case for compatibility
        totalPoints: assignment.total_points || assignment.totalPoints || 100,
        total_points: assignment.total_points || assignment.totalPoints || 100, // Also include snake_case for compatibility
        status: assignment.status || 'draft',
        class_id: assignment.class_id, // Include for filtering
        submissionStats: {
          total: totalSubmissions,
          graded: gradedSubmissions,
          pending: pendingGrading,
          totalStudents: totalStudents || 0,
        },
        createdAt: assignment.created_at,
        created_at: assignment.created_at, // Also include snake_case for compatibility
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

    console.log('getAssignmentDetails called with:', { assignmentId, teacherId });

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

    console.log('Assignment query result:', { assignment: !!assignment, error: assignError });

    if (assignError) {
      console.error('Error fetching assignment:', assignError);
      if (assignError.code === 'PGRST116') {
        // No rows returned
        return ErrorResponse.notFound('Assignment not found').send(res);
      }
      return ErrorResponse.internalServerError('Failed to fetch assignment').send(res);
    }

    if (!assignment) {
      console.error('Assignment not found for id:', assignmentId);
      return ErrorResponse.notFound('Assignment not found').send(res);
    }

    // Debug: Log assignment data to check for due_date
    console.log('Assignment details:', {
      id: assignment.id,
      title: assignment.title,
      due_date: assignment.due_date,
      dueDate: assignment.dueDate,
      allKeys: Object.keys(assignment)
    });

    // Verify teacher has access to this assignment's class
    const { data: access, error: accessError } = await supabase
      .from('class_teachers')
      .select('*')
      .eq('profile_id', teacherId)
      .eq('class_id', assignment.class_id)
      .single();

    console.log('Teacher access check:', {
      teacherId,
      classId: assignment.class_id,
      hasAccess: !!access,
      error: accessError
    });

    // TEMPORARILY DISABLED for debugging
    // if (!access) {
    //   return ErrorResponse.forbidden('You do not have access to this assignment').send(res);
    // }

    // Get assignment instructions
    const { data: instructions, error: instError } = await supabase
      .from('assignment_instructions')
      .select('*')
      .eq('assignment_id', assignmentId)
      .order('position', { ascending: true });
    
    if (instError && instError.code !== 'PGRST116') throw instError;

    // Get requirements
    const { data: requirements, error: reqError } = await supabase
      .from('assignment_requirements')
      .select('*')
      .eq('assignment_id', assignmentId)
      .order('position', { ascending: true });
    
    if (reqError && reqError.code !== 'PGRST116') throw reqError;

    // Get resources
    const { data: resources, error: resError } = await supabase
      .from('assignment_resources')
      .select('*')
      .eq('assignment_id', assignmentId);
    
    if (resError && resError.code !== 'PGRST116') throw resError;

    // Get rubric
    const { data: rubric, error: rubricError } = await supabase
      .from('assignment_rubric_items')
      .select('*')
      .eq('assignment_id', assignmentId);
    
    if (rubricError && rubricError.code !== 'PGRST116') throw rubricError;

    // Get questions if any
    const { data: questions, error: qError } = await supabase
      .from('assignment_questions')
      .select('*')
      .eq('assignment_id', assignmentId)
      .order('position', { ascending: true });
    
    if (qError && qError.code !== 'PGRST116') throw qError;

    // Get options for questions
    let questionsWithOptions = [];
    if (questions && questions.length > 0) {
      for (const question of questions) {
        const { data: options, error: optError } = await supabase
          .from('assignment_question_options')
          .select('*')
          .eq('question_id', question.id)
          .order('option_key', { ascending: true });
        
        if (optError && optError.code !== 'PGRST116') throw optError;
        
        questionsWithOptions.push({
          ...question,
          options: options || []
        });
      }
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

    // Get due_date - try multiple possible field names
    const dueDate = assignment.due_date || assignment.dueDate || assignment.due || null;

    res.status(200).json({
      assignment: {
        id: assignment.id,
        title: assignment.title,
        description: assignment.description,
        className: assignment.classes?.name,
        classCode: assignment.classes?.code,
        class_id: assignment.class_id,
        dueDate: dueDate,
        due_date: dueDate, // Include both formats for compatibility
        totalPoints: assignment.total_points || assignment.totalPoints || 100,
        total_points: assignment.total_points || assignment.totalPoints || 100, // Include both formats for compatibility
        status: assignment.status || 'draft',
        created_at: assignment.created_at,
        createdAt: assignment.created_at,
        instructions: instructions?.map(i => i.text) || [],
        requirements: requirements?.map(r => r.text) || [],
        resources: resources?.map(r => ({ name: r.name, type: r.type, url: r.url })) || [],
        rubric: rubric?.map(r => ({ criteria: r.criteria, points: r.points, description: r.description })) || [],
        hasQuestions: questionsWithOptions.length > 0,
        questions: questionsWithOptions.map(q => {
          // Map database question types to frontend expected types
          // Keep original type for teacher view, but also provide formatted type
          const originalType = q.type || 'text';
          let questionType = originalType;
          if (originalType === 'multiple_choice') {
            questionType = 'multiple-choice';
          } else if (originalType === 'short_answer' || originalType === 'text') {
            questionType = 'short-answer';
          }
          
          return {
            id: q.id,
            question: q.question,
            type: originalType, // Keep original for teacher view compatibility
            formattedType: questionType, // Provide formatted type for student view
            points: q.points,
            position: q.position,
            options: q.options?.map(o => ({ 
              id: o.option_key, 
              option_key: o.option_key, // Include for teacher view compatibility
              key: o.option_key, // Alternative key name
              text: o.text,
              is_correct: o.is_correct // Include for teacher view
            })) || []
          };
        }),
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
      requirements,
      resources,
      dueDate,
      totalPoints,
      rubric,
      questions,
      submission_type
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

    // Parse due_date (date) and due_time (time) from combined datetime if provided
    let due_date_value = null;
    let due_time_value = null;
    if (dueDate) {
      if (typeof dueDate === 'string' && dueDate.includes('T')) {
        const [d, t] = dueDate.split('T');
        due_date_value = d;
        if (t) {
          const hm = t.trim().slice(0,5); // HH:MM
          due_time_value = hm ? `${hm}:00` : null;
        }
      } else {
        due_date_value = dueDate;
      }
    }

    // Create base assignment row (columns that actually exist)
    const baseInsert = {
      class_id: classId,
      title,
      description,
      due_date: due_date_value,
      due_time: due_time_value,
      total_points: totalPoints || 100,
      submission_type: submission_type || null,
      status: 'pending',
      created_by: teacherId,
    };

    const { data: assignment, error: createError } = await supabase
      .from('assignments')
      .insert([baseInsert])
      .select()
      .single();

    if (createError) {
      console.error('Error creating assignment:', createError);
      return ErrorResponse.internalServerError('Failed to create assignment').send(res);
    }

    // Insert optional related data into their respective tables
    const createdId = assignment.id;

    // Instructions: can be string or array; store as ordered rows
    let instructionsArr = [];
    if (Array.isArray(instructions)) instructionsArr = instructions.filter(Boolean);
    else if (typeof instructions === 'string') instructionsArr = instructions.split('\n').map(s => s.trim()).filter(Boolean);
    if (instructionsArr.length > 0) {
      const rows = instructionsArr.map((text, idx) => ({ assignment_id: createdId, position: idx + 1, text }));
      const { error: instrError } = await supabase.from('assignment_instructions').insert(rows);
      if (instrError) console.error('Error inserting assignment_instructions:', instrError);
    }

    // Requirements (similar handling if provided)
    let requirementsArr = [];
    if (Array.isArray(requirements)) requirementsArr = requirements.filter(Boolean);
    else if (typeof requirements === 'string') requirementsArr = requirements.split('\n').map(s => s.trim()).filter(Boolean);
    if (requirementsArr.length > 0) {
      const rows = requirementsArr.map((text, idx) => ({ assignment_id: createdId, position: idx + 1, text }));
      const { error: reqError } = await supabase.from('assignment_requirements').insert(rows);
      if (reqError) console.error('Error inserting assignment_requirements:', reqError);
    }

    // Resources (name, optional type/url)
    if (Array.isArray(resources) && resources.length > 0) {
      const rows = resources.map((r) => {
        const name = r?.name || (typeof r === 'string' ? r : 'Resource');
        const value = r?.value || '';
        const isUrl = typeof value === 'string' && /^(https?:)?\/\//i.test(value);
        return {
          assignment_id: createdId,
          name,
          type: r?.type || (isUrl ? 'link' : 'text'),
          url: isUrl ? value : null,
        };
      });
      const { error: resError } = await supabase.from('assignment_resources').insert(rows);
      if (resError) console.error('Error inserting assignment_resources:', resError);
    }

    // Rubric items (criteria, points)
    if (Array.isArray(rubric) && rubric.length > 0) {
      const rows = rubric.map((item) => ({
        assignment_id: createdId,
        criteria: item?.criteria || 'Criteria',
        points: Number(item?.points) || 0,
      }));
      const { error: rubError } = await supabase.from('assignment_rubric_items').insert(rows);
      if (rubError) console.error('Error inserting assignment_rubric_items:', rubError);
    }

    // Questions and options (for MCQ)
    if (Array.isArray(questions) && questions.length > 0) {
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i] || {};
        const qType = q.type || 'text';
        const qText = q.question || q.prompt || '';
        const qPoints = Number(q.points) || 0;

        const { data: qRow, error: qError } = await supabase
          .from('assignment_questions')
          .insert([{ assignment_id: createdId, position: i + 1, type: qType, question: qText, points: qPoints }])
          .select()
          .single();
        if (qError) {
          console.error('Error inserting assignment_question:', qError);
          continue;
        }

        // For MCQ, insert options
        if (qType === 'multiple_choice' && Array.isArray(q.options)) {
          const options = q.options;
          const correct = q.answer; // can be value or key
          const keyFromIndex = (idx) => String.fromCharCode('A'.charCodeAt(0) + idx);

          const rows = options.map((opt, idx) => ({
            question_id: qRow.id,
            option_key: keyFromIndex(idx),
            text: typeof opt === 'string' ? opt : (opt?.text || ''),
            is_correct: (() => {
              if (typeof correct === 'number') return idx === correct;
              if (typeof correct === 'string') {
                // match by option text or key
                return correct === options[idx] || correct.toUpperCase() === keyFromIndex(idx);
              }
              return false;
            })()
          }));
          const { error: optError } = await supabase.from('assignment_question_options').insert(rows);
          if (optError) console.error('Error inserting assignment_question_options:', optError);
        }
      }
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


