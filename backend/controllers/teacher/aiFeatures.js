import { getSupabaseClient } from '../../clients/supabaseClient.js';
import { ErrorResponse } from '../../utils/errorResponse.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Note: OpenAI integration requires OPENAI_API_KEY (or compatible alias) in environment
const OPENAI_API_KEY = (process.env.OPENAI_API_KEY
  || process.env.OPENAI_KEY
  || process.env.VITE_OPENAI_API_KEY
  || '').trim();
const OPENAI_BASE_URL = process.env.OPENAI_BASE_URL || 'https://api.zmon.me/v1';

/**
 * UC10: AI-Generated Assessment Rubric
 * Generate a rubric for an assignment using AI
 */
export const generateRubric = async (req, res) => {
  try {
    const {
      assignment_title,
      assignment_description,
      submission_type,
      total_points,
      learning_objectives,
      question_summary
    } = req.body;

    if (!assignment_title) {
      return ErrorResponse.badRequest('Assignment title is required').send(res);
    }

    // Check if OpenAI API key is configured
    if (!OPENAI_API_KEY) {
      // Return a mock rubric for development
      return res.json({
        rubric: generateMockRubric(assignment_title, total_points || 100),
        ai_generated: true,
        mock: true,
        message: 'OpenAI API key not configured, returning mock rubric'
      });
    }

    // Load instruction from file
    const instructionPath = path.join(__dirname, '../../instructions/assignment-rubric-instruction.md');
    let instruction = '';
    try {
      instruction = fs.readFileSync(instructionPath, 'utf-8');
    } catch (error) {
      instruction = 'You are an educational assessment expert. Generate a rubric JSON array with criteria, description, points, and levels.';
    }

    // Prepare details for user message
    const qs = question_summary && typeof question_summary === 'object'
      ? `\nQuestion Summary: ${JSON.stringify(question_summary)}`
      : '';
    const prompt = `Generate a rubric for this assignment:\n\nTitle: ${assignment_title}\nDescription: ${assignment_description || 'Not provided'}\nType: ${submission_type || 'General assignment'}\nTotal Points: ${total_points || 100}\nLearning Objectives: ${Array.isArray(learning_objectives) ? learning_objectives.join(', ') : (learning_objectives || 'Not specified')}${qs}\n\nRules:\n- Ensure the sum of rubric points equals Total Points.\n- If there are multiple-choice (MCQ) questions (see Question Summary), include a criterion that accounts for MCQ correctness with points aligned to the total MCQ points.\n- For short-answer/text questions, weight criteria that assess correctness, reasoning, and clarity.\n\nReturn ONLY the JSON array.`;

    try {
      const response = await fetch(`${OPENAI_BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: instruction
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 1500
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      const rubricText = data.choices[0].message.content;
      
      // Try to parse JSON from response
      let rubric;
      try {
        // Extract JSON from markdown code blocks if present
        const jsonMatch = rubricText.match(/```json\n([\s\S]*?)\n```/) || rubricText.match(/\[[\s\S]*\]/);
        rubric = JSON.parse(jsonMatch ? jsonMatch[1] || jsonMatch[0] : rubricText);
      } catch (parseError) {
        console.error('Failed to parse AI rubric:', parseError);
        rubric = [];
      }

      // Validate rubric; if invalid or sums don't match, build heuristic rubric
      const intendedPoints = Number(total_points) || 100;
      const sum = Array.isArray(rubric) ? rubric.reduce((s, r) => s + (Number(r?.points) || 0), 0) : 0;
      if (!Array.isArray(rubric) || rubric.length === 0 || sum !== intendedPoints) {
        const qs = (req.body && req.body.question_summary) || null;
        if (qs && typeof qs === 'object') {
          rubric = buildRubricFromQuestionDistribution(intendedPoints, {
            multiple_choice: Number(qs.points_by_type?.multiple_choice) || 0,
            short_answer: Number(qs.points_by_type?.short_answer) || 0,
            text: Number(qs.points_by_type?.text) || 0,
            other: 0
          });
        } else {
          rubric = generateMockRubric(assignment_title, intendedPoints);
        }
      }

      return res.json({ rubric, ai_generated: true, mock: false });

    } catch (apiError) {
      console.error('OpenAI API call failed:', apiError);
      // Fallback to mock rubric
      return res.json({
        rubric: generateMockRubric(assignment_title, total_points || 100),
        ai_generated: true,
        mock: true,
        message: 'AI generation failed, returning mock rubric'
      });
    }

  } catch (err) {
    console.error('Generate rubric error:', err);
    return ErrorResponse.internalServerError(err.message).send(res);
  }
};

/**
 * UC13: AI-Generated Assignment
 * Generate a complete assignment spec (title, description, questions, rubric)
 */
export const generateAssignment = async (req, res) => {
  try {
    const {
      subject,
      topic,
      difficulty,
      assignment_type,
      question_count,
      class_context,
      mcq_only
    } = req.body || {};

    // If no API key, return a mock assignment
    if (!OPENAI_API_KEY) {
      const mock = buildMockAssignment(subject || 'General', topic || 'Sample Topic', assignment_type || 'quiz', question_count || 5);
      return res.json({ assignment: mock, ai_generated: true, mock: true, message: 'OpenAI API key not configured, returning mock assignment' });
    }

    // Load instruction from file
    const instructionPath = path.join(__dirname, '../../instructions/assignment-generation-instruction.md');
    let instruction = '';
    try {
      instruction = fs.readFileSync(instructionPath, 'utf-8');
    } catch (error) {
      instruction = 'You generate complete assignments with questions and rubric. Return a JSON object as specified.';
    }

    const details = {
      // If subject not provided, infer from class_context/topic
      subject: subject || class_context || null,
      class_context: class_context || null,
      topic: topic || 'Core Concepts',
      difficulty: difficulty || 'medium',
      assignment_type: assignment_type || 'quiz',
      question_count: Number(question_count) || 6,
      mcq_only: Boolean(mcq_only || (/mcq\s*only/i.test(topic || '')))
    };

    const userPrompt = `Generate a complete, ready-to-use assignment. If subject is missing, infer a reasonable secondary-school subject from the class_context and title/topic.\n\nDetails:\n${JSON.stringify(details, null, 2)}\n\nSTRICT Rules:\n- Return ONLY the JSON object with fields: { title, description, submission_type, total_points, questions: [...], resources } (NO rubric field).\n- If mcq_only is true, ALL questions must be { type: "multiple_choice" } with content-specific, plausible, mutually exclusive options, a single correct answer that exactly matches an option, and a brief explanation.\n- If mcq_only is false, include a mix of MCQ and short/text questions suitable for the topic.\n- Ensure total_points equals the sum of question points.\n- Avoid placeholders like "Option A/B/C/D" or single letters; use domain-specific options.\n`;

    try {
      const response = await fetch(`${OPENAI_BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            { role: 'system', content: instruction },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.7,
          max_tokens: 1800
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      const text = data.choices[0].message.content;

      // Parse JSON from response
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/\{[\s\S]*\}/);
      let assignment = JSON.parse(jsonMatch ? jsonMatch[1] || jsonMatch[0] : text);

      // Normalize assignment: fix totals (do NOT build rubric here)
      assignment = normalizeGeneratedAssignment(assignment, { includeRubric: false });

      // Improve MCQ quality if placeholder options are detected
      assignment = await improveMcqQualityIfNeeded(assignment, details.subject || 'General Studies', details.topic || 'Core Concepts');

      return res.json({ assignment, ai_generated: true, mock: false });
    } catch (apiError) {
      console.error('OpenAI assignment generation failed:', apiError);
      const mock = buildMockAssignment(details.subject || 'General', details.topic, details.assignment_type, details.question_count);
      mock.rubric = [];
      return res.json({ assignment: mock, ai_generated: true, mock: true, message: 'AI generation failed, returning mock assignment' });
    }
  } catch (err) {
    console.error('Generate assignment error:', err);
    return ErrorResponse.internalServerError(err.message).send(res);
  }
};

/**
 * UC11: Content Summarisation
 * Summarize student submissions or learning materials
 */
export const summarizeContent = async (req, res) => {
  try {
    const { content, content_type, max_length } = req.body;

    if (!content) {
      return ErrorResponse.badRequest('Content is required').send(res);
    }

    if (!OPENAI_API_KEY) {
      return res.json({
        summary: `Summary not available (OpenAI API key not configured). Original content: ${content.substring(0, 200)}...`,
        mock: true
      });
    }

    const prompt = `Summarize the following ${content_type || 'text'} concisely${max_length ? ` in about ${max_length} words` : ''}:

${content}

Provide a clear, informative summary that captures the main points.`;

    try {
      const response = await fetch(`${OPENAI_BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant that summarizes content clearly and concisely.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.5,
          max_tokens: 500
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      const summary = data.choices[0].message.content;

      return res.json({
        summary,
        ai_generated: true,
        mock: false
      });

    } catch (apiError) {
      console.error('OpenAI API call failed:', apiError);
      return res.json({
        summary: `AI summarization unavailable. Content preview: ${content.substring(0, 300)}...`,
        mock: true,
        error: apiError.message
      });
    }

  } catch (err) {
    console.error('Summarize content error:', err);
    return ErrorResponse.internalServerError(err.message).send(res);
  }
};

/**
 * UC04: Auto-grade submission using AI
 */
export const autoGradeSubmission = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const { submission_id, assignment_id } = req.body;
    const supabase = getSupabaseClient();

    // Get submission
    const { data: submission, error: subError } = await supabase
      .from('assignment_submissions')
      .select(`
        *,
      assignments:assignment_id (
        id,
        title,
        description,
        total_points,
        class_id,
        submission_type
      )
      `)
      .eq('id', submission_id)
      .single();

    if (subError) throw subError;
    if (!submission) {
      return ErrorResponse.notFound('Submission not found').send(res);
    }

    // Verify teacher has access
    const { data: access } = await supabase
      .from('class_teachers')
      .select('role_in_class')
      .eq('profile_id', teacherId)
      .eq('class_id', submission.assignments.class_id)
      .single();

    if (!access) {
      return ErrorResponse.forbidden('You do not have access to this submission').send(res);
    }

    // Get submission answers (match actual assignment_questions schema)
    const { data: answers } = await supabase
      .from('assignment_submission_answers')
      .select(`
        id,
        question_id,
        text_answer,
        selected_option_key,
        questions:question_id (
          id,
          question,
          type,
          points,
          position
        )
      `)
      .eq('submission_id', submission_id);

    if (!OPENAI_API_KEY) {
      // Return mock grading
      const mockGrade = Math.floor(Math.random() * 20) + 80; // 80-100
      return res.json({
        grade: mockGrade,
        feedback: 'Auto-grading not available (OpenAI API key not configured). This is a mock grade.',
        mock: true,
        answer_grades: answers?.map(a => ({
          answer_id: a.id,
          points_earned: Math.floor((mockGrade / 100) * (a.questions?.points || 0)),
          feedback: 'Mock feedback'
        }))
      });
    }

    // Fetch rubric items to guide AI grading for free-response answers
    const { data: rubricItems } = await supabase
      .from('assignment_rubric_items')
      .select('*')
      .eq('assignment_id', submission.assignment_id);

    // Build correctness map for MCQs
    const questionIds = (answers || []).map(a => a.question_id);
    let correctMap = {};
    if (questionIds.length > 0) {
      const { data: correctOptions } = await supabase
        .from('assignment_question_options')
        .select('question_id, option_key, is_correct')
        .in('question_id', questionIds);
      (correctOptions || []).forEach(o => {
        if (o.is_correct) correctMap[o.question_id] = o.option_key;
      });
    }

    // Deterministic MCQ grading and collect free responses
    const mcqGrades = [];
    const freeResponses = [];
    let mcqPointsEarned = 0;
    let mcqPointsPossible = 0;
    (answers || []).forEach((a, idx) => {
      const q = a.questions || {};
      if (q.type === 'multiple_choice') {
        const correctKey = correctMap[a.question_id];
        const isCorrect = !!correctKey && a.selected_option_key && a.selected_option_key.toUpperCase() === String(correctKey).toUpperCase();
        const earned = isCorrect ? (Number(q.points) || 0) : 0;
        mcqPointsEarned += earned;
        mcqPointsPossible += Number(q.points) || 0;
        mcqGrades.push({ index: idx, answer_id: a.id, points_earned: earned, feedback: isCorrect ? 'Correct' : 'Incorrect' });
      } else {
        freeResponses.push({ index: idx, question: q.question, points: Number(q.points) || 0, text_answer: a.text_answer || '' });
      }
    });

    // If there are free-response answers, ask AI to grade them with rubric
    let aiAnswerGrades = [];
    let aiFeedback = '';
    let aiPointsEarned = 0;
    if (freeResponses.length > 0) {
      try {
        const prompt = `Grade the following student submission (only non-MCQ questions require judgement).\n\nAssignment: ${submission.assignments.title}\nDescription: ${submission.assignments.description || 'Not provided'}\nTotal Points: ${submission.assignments.total_points}\nType: ${submission.assignments.submission_type || 'General'}\n\nRubric (JSON):\n${JSON.stringify(rubricItems || [], null, 2)}\n\nFree-response Answers:\n${freeResponses.map((fr, i) => `Q${i + 1}: ${fr.question}\nStudent Answer: ${fr.text_answer || 'No answer provided'}\nPoints Available: ${fr.points}`).join('\n\n')}\n\nRules:\n- Grade each free-response up to its points.\n- Use the rubric when assigning points and feedback.\n- Do not exceed the points available for each question.\n- Return JSON only.\n\nFormat as JSON:\n{\n  "answer_grades": [\n    { "question_number": number, "points_earned": number, "feedback": "string" }\n  ],\n  "overall_feedback": "string"\n}`;

        console.log(`[AI Auto-Grade] Calling OpenAI API with key: ${OPENAI_API_KEY.substring(0, 7)}...${OPENAI_API_KEY.slice(-4)}`);
        const response = await fetch(`${OPENAI_BASE_URL}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: 'You are a fair and constructive educational grader. Provide accurate grades and helpful feedback.' },
              { role: 'user', content: prompt }
            ],
            temperature: 0.3,
            max_tokens: 1000
          })
        });

        console.log(`[AI Auto-Grade] OpenAI API response status: ${response.status}`);
        if (!response.ok) {
          const errorBody = await response.text();
          console.error(`[AI Auto-Grade] OpenAI API error response:`, errorBody);
          throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const gradingText = data.choices[0].message.content;
        const jsonMatch = gradingText.match(/```json\n([\s\S]*?)\n```/) || gradingText.match(/\{[\s\S]*\}/);
        const grading = JSON.parse(jsonMatch ? jsonMatch[1] || jsonMatch[0] : gradingText);

        aiFeedback = grading.overall_feedback || '';
        aiAnswerGrades = (grading.answer_grades || []).map((ag) => ({
          question_number: ag.question_number,
          points_earned: Math.max(0, Math.min(Number(ag.points_earned) || 0, freeResponses[ag.question_number - 1]?.points || 0)),
          feedback: ag.feedback || ''
        }));
        aiPointsEarned = aiAnswerGrades.reduce((s, g) => s + (Number(g.points_earned) || 0), 0);
      } catch (apiError) {
        console.error('OpenAI auto-grading failed:', apiError);
        aiAnswerGrades = freeResponses.map((fr, i) => ({ question_number: i + 1, points_earned: 0, feedback: 'Auto-grading unavailable' }));
        aiFeedback = 'Auto-grading unavailable. Please grade manually.';
      }
    }

    // Merge MCQ and AI-graded results in original answer order
    const mergedAnswerGrades = [];
    let frCursor = 0;
    (answers || []).forEach((a, idx) => {
      const q = a.questions || {};
      if (q.type === 'multiple_choice') {
        const found = mcqGrades.find(m => m.index === idx);
        mergedAnswerGrades.push({ answer_id: a.id, points_earned: found?.points_earned || 0, feedback: found?.feedback || '' });
      } else {
        const frGrade = aiAnswerGrades[frCursor] || { points_earned: 0, feedback: '' };
        mergedAnswerGrades.push({ answer_id: a.id, points_earned: frGrade.points_earned || 0, feedback: frGrade.feedback || '' });
        frCursor += 1;
      }
    });

    const totalEarned = mcqPointsEarned + aiPointsEarned;
    const totalPoints = submission.assignments.total_points || 100;
    const finalGrade = Math.max(0, Math.min(totalPoints, Math.round(totalEarned)));

    return res.json({
      grade: finalGrade,
      feedback: aiFeedback || (mcqPointsPossible > 0 ? `Auto-graded MCQs: ${mcqPointsEarned}/${mcqPointsPossible}.` : 'Auto-grading complete.'),
      answer_grades: mergedAnswerGrades,
      ai_generated: true,
      mock: false
    });

  } catch (err) {
    console.error('Auto-grade submission error:', err);
    return ErrorResponse.internalServerError(err.message).send(res);
  }
};

/**
 * UC07: Analyze class performance with AI insights
 */
export const analyzeClassPerformance = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const { class_id } = req.body;
    const supabase = getSupabaseClient();

    // Verify teacher has access
    const { data: access } = await supabase
      .from('class_teachers')
      .select('role_in_class')
      .eq('profile_id', teacherId)
      .eq('class_id', class_id)
      .single();

    if (!access) {
      return ErrorResponse.forbidden('You do not have access to this class').send(res);
    }

    // Get class performance data
    const { data: submissions } = await supabase
      .from('assignment_submissions')
      .select('grade, total_points, submitted_at')
      .eq('class_id', class_id)
      .not('grade', 'is', null);

    const grades = submissions?.map(s => (s.grade / s.total_points) * 100) || [];
    const avgGrade = grades.length > 0 ? grades.reduce((a, b) => a + b, 0) / grades.length : 0;

    if (!OPENAI_API_KEY) {
      return res.json({
        insights: [
          `Class average: ${Math.round(avgGrade)}%`,
          `Total graded submissions: ${grades.length}`,
          'AI insights not available (OpenAI API key not configured)'
        ],
        recommendations: [
          'Review assignments with low completion rates',
          'Provide additional support for struggling students'
        ],
        mock: true
      });
    }

    const prompt = `Analyze this class performance data and provide insights:

Average Grade: ${Math.round(avgGrade)}%
Total Submissions: ${grades.length}
Grade Distribution: 
- A (90-100): ${grades.filter(g => g >= 90).length}
- B (80-89): ${grades.filter(g => g >= 80 && g < 90).length}
- C (70-79): ${grades.filter(g => g >= 70 && g < 80).length}
- D (60-69): ${grades.filter(g => g >= 60 && g < 70).length}
- F (0-59): ${grades.filter(g => g < 60).length}

Provide:
1. 3-5 key insights about class performance
2. 3-5 actionable recommendations for the teacher
3. Areas of concern (if any)

Format as JSON:
{
  "insights": ["string"],
  "recommendations": ["string"],
  "concerns": ["string"]
}`;

    try {
      const response = await fetch(`${OPENAI_BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are an educational data analyst providing actionable insights for teachers.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 800
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const analysisText = data.choices[0].message.content;
      
      const jsonMatch = analysisText.match(/```json\n([\s\S]*?)\n```/) || analysisText.match(/\{[\s\S]*\}/);
      const analysis = JSON.parse(jsonMatch ? jsonMatch[1] || jsonMatch[0] : analysisText);

      return res.json({
        ...analysis,
        class_average: Math.round(avgGrade),
        total_submissions: grades.length,
        ai_generated: true,
        mock: false
      });

    } catch (apiError) {
      console.error('OpenAI analysis failed:', apiError);
      const isUnauthorized = typeof apiError?.message === 'string' && apiError.message.includes('401');
      return res.json({
        insights: [
          `Class average: ${Math.round(avgGrade)}%`,
          `Total graded submissions: ${grades.length}`,
          isUnauthorized
            ? 'AI 分析暂不可用（OpenAI API 未授权）。'
            : 'AI 分析暂不可用，已提供基础数据。'
        ],
        recommendations: [
          '关注低提交率或低分学生，及时跟进支持',
          '请在稍后再次尝试生成 AI 洞察'
        ],
        mock: true,
        error: apiError.message
      });
    }

  } catch (err) {
    console.error('Analyze class performance error:', err);
    return ErrorResponse.internalServerError(err.message).send(res);
  }
};

/**
 * Helper function to generate mock rubric
 */
function generateMockRubric(title, totalPoints) {
  const criteriaCount = 4;
  const pointsPerCriteria = Math.floor(totalPoints / criteriaCount);
  
  const criteria = [
    {
      criteria: 'Content Quality',
      description: 'Demonstrates understanding of key concepts and provides thorough analysis',
      points: pointsPerCriteria,
      levels: {
        excellent: 'Exceptional depth of understanding with insightful analysis',
        good: 'Good understanding with adequate analysis',
        fair: 'Basic understanding with limited analysis',
        poor: 'Minimal understanding or analysis'
      }
    },
    {
      criteria: 'Organization',
      description: 'Clear structure with logical flow of ideas',
      points: pointsPerCriteria,
      levels: {
        excellent: 'Highly organized with seamless transitions',
        good: 'Well organized with clear structure',
        fair: 'Somewhat organized but could be clearer',
        poor: 'Disorganized or confusing structure'
      }
    },
    {
      criteria: 'Evidence & Support',
      description: 'Use of relevant examples and supporting details',
      points: pointsPerCriteria,
      levels: {
        excellent: 'Compelling evidence with strong support',
        good: 'Adequate evidence and support',
        fair: 'Limited evidence or weak support',
        poor: 'Little to no evidence or support'
      }
    },
    {
      criteria: 'Technical Quality',
      description: 'Grammar, spelling, formatting, and presentation',
      points: totalPoints - (pointsPerCriteria * (criteriaCount - 1)),
      levels: {
        excellent: 'Professional quality with no errors',
        good: 'Few minor errors',
        fair: 'Several noticeable errors',
        poor: 'Many errors affecting readability'
      }
    }
  ];

  return criteria;
}

function buildMockAssignment(subject, topic, type, questionCount) {
  const count = Math.max(4, Math.min(8, Number(questionCount) || 5));
  const pointsPer = Math.floor(100 / count);
  const remaining = 100 - (pointsPer * (count - 1));
  const questions = Array.from({ length: count }).map((_, idx) => {
    if (idx % 2 === 0) {
      return {
        type: 'multiple_choice',
        question: `(${subject}) ${topic}: Which statement is correct?`,
        points: idx === count - 1 ? remaining : pointsPer,
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        answer: 'Option B',
        explanation: 'Mock explanation for correct choice.'
      };
    }
    return {
      type: 'short_answer',
      question: `(${subject}) ${topic}: Briefly explain the core idea.`,
      points: idx === count - 1 ? remaining : pointsPer,
      expected_answer: 'A concise explanation covering the key concept.'
    };
  });

  return {
    title: `${topic} ${type === 'quiz' ? 'Quiz' : 'Assignment'}`,
    description: `This ${type} assesses understanding of ${topic}.`,
    submission_type: type === 'project' ? 'project' : (type === 'quiz' ? 'quiz' : 'online'),
    total_points: 100,
    questions,
    rubric: generateMockRubric(`${topic} ${type}`, 100),
    resources: [
      { name: 'Textbook Chapter', type: 'reference', value: topic },
      { name: 'Practice Set', type: 'link', value: 'Provide relevant practice materials' }
    ]
  };
}

// ---------------------------------
// Helpers: Normalize assignment JSON
// ---------------------------------
function normalizeGeneratedAssignment(assignment, options = {}) {
  const includeRubric = options.includeRubric !== false; // default true
  const safe = assignment && typeof assignment === 'object' ? assignment : {};
  const questions = Array.isArray(safe.questions) ? safe.questions : [];

  // Coerce question points and compute totals by type
  let totalByType = { multiple_choice: 0, short_answer: 0, text: 0, other: 0 };
  const normalizedQuestions = questions.map((q) => {
    const type = q?.type || 'text';
    const points = Math.max(0, Number(q?.points) || 0);
    if (type === 'multiple_choice') totalByType.multiple_choice += points;
    else if (type === 'short_answer') totalByType.short_answer += points;
    else if (type === 'text') totalByType.text += points;
    else totalByType.other += points;
    // Ensure MCQ options are strings, and keep answer if present
    const options = Array.isArray(q?.options) ? q.options.map(o => (typeof o === 'string' ? o : (o?.text || ''))) : undefined;
    return { ...q, type, points, ...(options ? { options } : {}) };
  });

  // Ensure total_points equals sum of question points
  const sumQuestionPoints = normalizedQuestions.reduce((s, q) => s + (Number(q.points) || 0), 0);
  const totalPoints = sumQuestionPoints > 0 ? sumQuestionPoints : (Number(safe.total_points) || 100);

  // Build rubric if missing or invalid sum
  const rubric = Array.isArray(safe.rubric) ? safe.rubric : [];
  const rubricSum = rubric.reduce((s, r) => s + (Number(r?.points) || 0), 0);
  let finalRubric = rubric;
  if (!rubric.length || rubricSum !== totalPoints) {
    finalRubric = buildRubricFromQuestionDistribution(totalPoints, totalByType);
  }

  return {
    title: safe.title || 'Generated Assignment',
    description: safe.description || '',
    submission_type: safe.submission_type || (safe.assignment_type === 'project' ? 'project' : (safe.assignment_type === 'quiz' ? 'quiz' : 'online')),
    total_points: totalPoints,
    questions: normalizedQuestions,
    rubric: includeRubric ? finalRubric : [],
    resources: Array.isArray(safe.resources) ? safe.resources : []
  };
}

function buildRubricFromQuestionDistribution(totalPoints, byType) {
  const mcq = Number(byType.multiple_choice) || 0;
  const sa = Number(byType.short_answer) || 0;
  const text = Number(byType.text) || 0;
  const free = sa + text;

  const items = [];
  if (mcq > 0) {
    items.push(makeRubricItem('MCQ Correctness', 'Correctly selects the right option for each multiple-choice question.', mcq));
  }
  if (sa > 0) {
    const acc = Math.round(sa * 0.7);
    const clr = sa - acc;
    items.push(makeRubricItem('Short Answer Accuracy', 'Accurate and complete answers for short responses.', acc));
    if (clr > 0) items.push(makeRubricItem('Short Answer Clarity', 'Clear, concise explanations and use of correct terminology.', clr));
  }
  if (text > 0) {
    const acc = Math.round(text * 0.6);
    const reason = Math.round(text * 0.3);
    const pres = text - acc - reason;
    items.push(makeRubricItem('Extended Response Accuracy', 'Addresses the prompt with correct and relevant content.', acc));
    if (reason > 0) items.push(makeRubricItem('Reasoning & Working', 'Shows logical reasoning, steps, or justification where appropriate.', reason));
    if (pres > 0) items.push(makeRubricItem('Presentation & Clarity', 'Well-structured writing, clear explanations, appropriate formatting.', pres));
  }

  // If items sum is not equal (e.g., only other types), create a balanced default
  const sum = items.reduce((s, i) => s + i.points, 0);
  if (sum !== totalPoints) {
    // Adjust last item or add Technical Quality criterion
    if (items.length > 0) {
      items[items.length - 1].points += (totalPoints - sum);
    } else {
      items.push(makeRubricItem('Technical Quality', 'Grammar, formatting, completeness and adherence to instructions.', totalPoints));
    }
  }
  return items;
}

function makeRubricItem(criteria, description, points) {
  return {
    criteria,
    description,
    points: Math.max(0, Number(points) || 0),
    levels: {
      excellent: 'Exceeds expectations with strong mastery and clarity.',
      good: 'Meets expectations with minor issues.',
      fair: 'Partially meets expectations with noticeable gaps.',
      poor: 'Does not meet expectations; significant errors or missing elements.'
    }
  };
}

// Improve MCQ quality using AI if options are placeholders; no-op if API key missing
async function improveMcqQualityIfNeeded(assignment, subject, topic) {
  try {
    const OPENAI_API_KEY = (process.env.OPENAI_API_KEY
      || process.env.OPENAI_KEY
      || process.env.VITE_OPENAI_API_KEY
      || '').trim();
    const OPENAI_BASE_URL = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';

    if (!OPENAI_API_KEY) return assignment;

    const updated = { ...assignment, questions: [...(assignment.questions || [])] };
    for (let i = 0; i < updated.questions.length; i++) {
      const q = updated.questions[i];
      if (q?.type !== 'multiple_choice') continue;

      const options = Array.isArray(q.options) ? q.options : [];
      const looksPlaceholder = options.length < 3 || options.some(o => isPlaceholderOption(o)) || hasDuplicates(options);
      const hasAnswer = typeof q.answer === 'string' && options.includes(q.answer);
      if (!looksPlaceholder && hasAnswer) continue;

      const prompt = `Improve this MCQ to be specific and plausible for a secondary-school context. Provide 4 distinct, content-specific options with one correct answer and a one-sentence explanation.\nSubject: ${subject || 'General Studies'}\nTopic: ${topic || ''}\nQuestion: ${q.question || ''}\nReturn ONLY JSON: { "options": ["string"], "answer": "string", "explanation": "string" }`;

      const response = await fetch(`${OPENAI_BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'You generate high-quality multiple-choice questions with realistic distractors.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 400
        })
      });

      if (!response.ok) continue;
      const data = await response.json();
      const text = data.choices?.[0]?.message?.content || '';
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/\{[\s\S]*\}/);
      const improved = JSON.parse(jsonMatch ? jsonMatch[1] || jsonMatch[0] : text);

      const improvedOptions = Array.isArray(improved?.options) ? improved.options.filter(Boolean) : [];
      if (improvedOptions.length >= 3 && typeof improved?.answer === 'string' && improvedOptions.includes(improved.answer)) {
        updated.questions[i] = {
          ...q,
          options: improvedOptions,
          answer: improved.answer,
          explanation: improved.explanation || q.explanation || ''
        };
      }
    }
    return updated;
  } catch (e) {
    console.warn('MCQ improvement skipped:', e?.message || e);
    return assignment;
  }
}

function isPlaceholderOption(opt) {
  if (typeof opt !== 'string') return true;
  const t = opt.trim();
  if (!t) return true;
  const lower = t.toLowerCase();
  if (lower === 'a' || lower === 'b' || lower === 'c' || lower === 'd') return true;
  if (/^option\s+[abcd]$/i.test(t)) return true;
  // obvious generic placeholders
  if (lower.includes('option') && lower.length <= 10) return true;
  return false;
}

function hasDuplicates(list) {
  const seen = new Set();
  for (const x of list) {
    const k = String(x).trim().toLowerCase();
    if (seen.has(k)) return true;
    seen.add(k);
  }
  return false;
}




