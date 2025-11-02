import { getSupabaseClient } from '../../clients/supabaseClient.js';

/**
 * Get incorrect questions for review
 * Returns questions from practice_questions table where correct = false
 */
const getReviewQuestions = async (req, res) => {
  try {
    const studentId = req.user.id;
    const supabase = getSupabaseClient();

    // Get all practice questions where correct = false
    const { data: incorrectQuestions, error: questionsError } = await supabase
      .from('practice_questions')
      .select(`
        *,
        practice_question_options (
          id,
          option_text,
          is_correct,
          position
        )
      `)
      .eq('student_id', studentId)
      .eq('correct', false)
      .order('last_attempted_at', { ascending: false });

    if (questionsError) {
      console.error('Error fetching incorrect questions:', questionsError);
      return res.status(500).json({ error: 'Failed to fetch incorrect questions' });
    }

    if (!incorrectQuestions || incorrectQuestions.length === 0) {
      return res.status(200).json({ 
        questions: [],
        message: 'No incorrect questions yet. Keep practicing!' 
      });
    }

    // Format questions for frontend
    const formattedQuestions = incorrectQuestions.map(q => ({
      id: q.id,
      questionId: q.id,
      question: q.question,
      type: q.type,
      subject: q.subject || 'General',
      subjectCode: q.subject_code || '',
      topic: q.subject || 'Practice',
      difficulty: 'Medium', // Default difficulty
      points: q.points || 10,
      // Parse options from practice_question_options
      options: (q.practice_question_options || []).sort((a, b) => (a.position || 0) - (b.position || 0)),
      studentAnswer: q.student_answer || '', // Student's submitted answer
      correctAnswer: q.correct_answer || '',
      explanation: q.explanation || '',
      // Review tracking fields
      reviewCount: q.attempt_count || 0,
      masteryLevel: 'Needs Review',
      nextReviewDate: null,
      dateAnswered: q.last_attempted_at || q.created_at,
      lastReviewed: q.last_attempted_at,
      assignment: 'Practice Questions'
    }));

    return res.status(200).json({
      questions: formattedQuestions,
      total: formattedQuestions.length
    });

  } catch (error) {
    console.error('Error fetching review questions:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch review questions',
      details: error.message 
    });
  }
};

/**
 * Get review statistics from practice_questions table
 */
const getReviewStats = async (req, res) => {
  try {
    const studentId = req.user.id;
    const supabase = getSupabaseClient();

    // Get count of all incorrect questions (correct = false)
    const { count: totalQuestions, error: countError } = await supabase
      .from('practice_questions')
      .select('*', { count: 'exact', head: true })
      .eq('student_id', studentId)
      .eq('correct', false);

    if (countError) {
      console.error('Error counting incorrect questions:', countError);
      return res.status(500).json({ error: 'Failed to fetch statistics' });
    }

    // Get count of all correct questions
    const { count: correctCount, error: correctError } = await supabase
      .from('practice_questions')
      .select('*', { count: 'exact', head: true })
      .eq('student_id', studentId)
      .eq('correct', true);

    if (correctError) {
      console.error('Error counting correct questions:', correctError);
    }

    // Get count of all attempted questions (both correct and incorrect)
    const { count: attemptedCount, error: attemptedError } = await supabase
      .from('practice_questions')
      .select('*', { count: 'exact', head: true })
      .eq('student_id', studentId)
      .eq('attempted', true);

    if (attemptedError) {
      console.error('Error counting attempted questions:', attemptedError);
    }

    const total = totalQuestions || 0;
    const mastered = correctCount || 0;
    const attempted = attemptedCount || 0;
    const masteryRate = attempted > 0 ? Math.round((mastered / attempted) * 100) : 0;

    return res.status(200).json({
      total: total,
      dueForReview: total, // All incorrect questions need review
      masteryRate: masteryRate,
      mastered: mastered
    });

  } catch (error) {
    console.error('Error fetching review stats:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch review statistics',
      details: error.message 
    });
  }
};

export { getReviewQuestions, getReviewStats };
