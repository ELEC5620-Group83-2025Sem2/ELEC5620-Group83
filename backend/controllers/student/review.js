import { getSupabaseClient } from '../../clients/supabaseClient.js';
import { ErrorResponse } from '../../utils/errorResponse.js';

function deriveMasteryLevel(record) {
  if (record.is_mastered) return 'Mastered';
  const count = record.times_reviewed || 0;
  if (count >= 3) return 'Practicing';
  if (count >= 1) return 'Learning';
  return 'Needs Review';
}

function mapQuestionRecordToDto(record) {
  return {
    id: record.id,
    question: record.question_text || record.question || '',
    correctAnswer: record.correct_answer || '',
    studentAnswer: record.student_answer || '',
    explanation: record.explanation || '',
    topic: record.topic || 'General',
    subject: record.subject || 'General',
    difficulty: record.difficulty || 'Medium',
    assignment: record.assignment_source || 'Practice',
    dateAnswered: record.created_at || record.last_reviewed_at || null,
    reviewCount: record.times_reviewed || 0,
    nextReviewDate: record.next_review_at || null,
    masteryLevel: deriveMasteryLevel(record)
  };
}

/**
 * GET /api/student/review/questions
 * Query params: subject, topic, mastery, dueOnly
 */
export const getReviewQuestions = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { subject, topic, mastery, dueOnly } = req.query;
    const supabase = getSupabaseClient();

    let query = supabase
      .from('incorrect_questions')
      .select('*')
      .eq('student_id', studentId);

    if (subject && subject !== 'All') {
      query = query.eq('subject', subject);
    }
    if (topic && topic !== 'All') {
      query = query.eq('topic', topic);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;

    let records = data || [];

    // Compute mastery level on the fly and filter if requested
    if (mastery && mastery !== 'All') {
      records = records.filter(r => deriveMasteryLevel(r) === mastery);
    }

    // Due-only filter based on next_review_at
    if (dueOnly === 'true') {
      const now = new Date();
      records = records.filter(r => r.next_review_at && new Date(r.next_review_at) <= now);
    }

    const questions = records.map(mapQuestionRecordToDto);
    return res.json({ success: true, questions });
  } catch (error) {
    console.error('Get review questions error:', error);
    return ErrorResponse.internalServerError('Failed to fetch review questions').send(res);
  }
};

/**
 * PUT /api/student/review/questions/:id
 * Body: { isCorrect: boolean }
 */
export const updateReviewQuestion = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { id } = req.params;
    const { isCorrect } = req.body;
    const supabase = getSupabaseClient();

    // Try RPC if available
    let rpcTried = false;
    try {
      rpcTried = true;
      const { data: rpcRes, error: rpcErr } = await supabase
        .rpc('update_question_review', { question_id: id, is_correct: !!isCorrect, p_student_id: studentId });
      if (rpcErr) throw rpcErr;
      // Return updated question if RPC returns it; otherwise fall through to select
    } catch (e) {
      // Fallback to simple spaced repetition update if RPC not present
      const { data: current, error: curErr } = await supabase
        .from('incorrect_questions')
        .select('times_reviewed, is_mastered')
        .eq('id', id)
        .eq('student_id', studentId)
        .single();
      if (curErr) throw curErr;

      const now = new Date();
      const timesReviewed = (current?.times_reviewed || 0) + 1;
      let next = new Date(now);
      if (isCorrect) {
        // very simple schedule: 1d, 3d, 7d, then mastered
        if (timesReviewed <= 1) next.setDate(now.getDate() + 1);
        else if (timesReviewed === 2) next.setDate(now.getDate() + 3);
        else if (timesReviewed === 3) next.setDate(now.getDate() + 7);
        else next = null;
      } else {
        next.setDate(now.getDate() + 1);
      }

      const updates = {
        times_reviewed: timesReviewed,
        last_reviewed_at: now.toISOString(),
        next_review_at: next ? next.toISOString() : null,
        is_mastered: isCorrect && timesReviewed >= 4 ? true : (current?.is_mastered || false)
      };

      const { error: updErr } = await supabase
        .from('incorrect_questions')
        .update(updates)
        .eq('id', id)
        .eq('student_id', studentId);
      if (updErr) throw updErr;
    }

    // Return fresh record
    const { data: fresh, error: freshErr } = await supabase
      .from('incorrect_questions')
      .select('*')
      .eq('id', id)
      .eq('student_id', studentId)
      .single();
    if (freshErr) throw freshErr;

    return res.json({ success: true, question: mapQuestionRecordToDto(fresh) });
  } catch (error) {
    console.error('Update review question error:', error);
    return ErrorResponse.internalServerError('Failed to update question review').send(res);
  }
};

/**
 * GET /api/student/review/stats
 */
export const getReviewStats = async (req, res) => {
  try {
    const studentId = req.user.id;
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from('incorrect_questions')
      .select('*')
      .eq('student_id', studentId);
    if (error) throw error;

    const rows = data || [];
    const total = rows.length;
    const now = new Date();
    const dueForReview = rows.filter(r => r.next_review_at && new Date(r.next_review_at) <= now).length;
    const mastered = rows.filter(r => r.is_mastered).length;
    const masteryRate = total > 0 ? Math.round((mastered / total) * 100) : 0;

    return res.json({ success: true, stats: { total, dueForReview, mastered, masteryRate } });
  } catch (error) {
    console.error('Get review stats error:', error);
    return ErrorResponse.internalServerError('Failed to fetch review stats').send(res);
  }
};



