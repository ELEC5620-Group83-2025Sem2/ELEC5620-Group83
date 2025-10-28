import { getSupabaseClient } from '../../clients/supabaseClient.js';
import { ErrorResponse } from '../../utils/errorResponse.js';

// Note: OpenAI integration requires OPENAI_API_KEY in environment
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

/**
 * UC10: AI-Generated Assessment Rubric
 * Generate a rubric for an assignment using AI
 */
export const generateRubric = async (req, res) => {
  try {
    const {
      assignment_title,
      assignment_description,
      assignment_type,
      points_possible,
      learning_objectives
    } = req.body;

    if (!assignment_title) {
      return ErrorResponse.badRequest('Assignment title is required').send(res);
    }

    // Check if OpenAI API key is configured
    if (!OPENAI_API_KEY) {
      // Return a mock rubric for development
      return res.json({
        rubric: generateMockRubric(assignment_title, points_possible || 100),
        ai_generated: true,
        mock: true,
        message: 'OpenAI API key not configured, returning mock rubric'
      });
    }

    // Call OpenAI API to generate rubric
    const prompt = `Generate a detailed grading rubric for the following assignment:

Title: ${assignment_title}
Description: ${assignment_description || 'Not provided'}
Type: ${assignment_type || 'General assignment'}
Total Points: ${points_possible || 100}
Learning Objectives: ${learning_objectives || 'Not specified'}

Create a comprehensive rubric with 4-6 criteria. For each criterion, provide:
1. Criterion name
2. Description of what is being evaluated
3. Point value
4. Levels of achievement (Excellent, Good, Fair, Poor)

Format as JSON array with structure:
[
  {
    "criteria": "string",
    "description": "string",
    "points": number,
    "levels": {
      "excellent": "string",
      "good": "string",
      "fair": "string",
      "poor": "string"
    }
  }
]`;

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
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
              content: 'You are an educational assessment expert. Generate detailed, fair, and comprehensive grading rubrics.'
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
        rubric = generateMockRubric(assignment_title, points_possible || 100);
      }

      return res.json({
        rubric,
        ai_generated: true,
        mock: false
      });

    } catch (apiError) {
      console.error('OpenAI API call failed:', apiError);
      // Fallback to mock rubric
      return res.json({
        rubric: generateMockRubric(assignment_title, points_possible || 100),
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
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
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
          points_possible,
          class_id,
          assignment_type
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

    // Get submission answers
    const { data: answers } = await supabase
      .from('assignment_submission_answers')
      .select(`
        *,
        questions:question_id (
          question_text,
          question_type,
          points
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

    // Build prompt for AI grading
    const prompt = `Grade the following student submission:

Assignment: ${submission.assignments.title}
Description: ${submission.assignments.description || 'Not provided'}
Total Points: ${submission.assignments.points_possible}
Type: ${submission.assignments.assignment_type}

Student Answers:
${answers?.map((a, idx) => `
Question ${idx + 1}: ${a.questions.question_text}
Student Answer: ${a.answer_text || 'No answer provided'}
Points Available: ${a.questions.points}
`).join('\n')}

Provide:
1. Total grade (out of ${submission.assignments.points_possible})
2. Overall feedback (2-3 sentences)
3. Individual grades for each question
4. Brief feedback for each answer

Format as JSON:
{
  "total_grade": number,
  "overall_feedback": "string",
  "answer_grades": [
    {
      "question_number": number,
      "points_earned": number,
      "feedback": "string"
    }
  ]
}`;

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
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
              content: 'You are a fair and constructive educational grader. Provide accurate grades and helpful feedback.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.3,
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      const gradingText = data.choices[0].message.content;
      
      // Parse JSON response
      const jsonMatch = gradingText.match(/```json\n([\s\S]*?)\n```/) || gradingText.match(/\{[\s\S]*\}/);
      const grading = JSON.parse(jsonMatch ? jsonMatch[1] || jsonMatch[0] : gradingText);

      return res.json({
        grade: grading.total_grade,
        feedback: grading.overall_feedback,
        answer_grades: grading.answer_grades?.map((ag, idx) => ({
          answer_id: answers[idx]?.id,
          points_earned: ag.points_earned,
          feedback: ag.feedback
        })),
        ai_generated: true,
        mock: false
      });

    } catch (apiError) {
      console.error('OpenAI auto-grading failed:', apiError);
      const mockGrade = Math.floor(Math.random() * 20) + 80;
      return res.json({
        grade: mockGrade,
        feedback: 'AI grading encountered an error. This is a fallback grade.',
        mock: true,
        error: apiError.message
      });
    }

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
      .select('grade, points_possible, submitted_at')
      .eq('class_id', class_id)
      .not('grade', 'is', null);

    const grades = submissions?.map(s => (s.grade / s.points_possible) * 100) || [];
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
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
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
        throw new Error(`OpenAI API error: ${response.statusText}`);
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
      return res.json({
        insights: [
          `Class average: ${Math.round(avgGrade)}%`,
          `Total graded submissions: ${grades.length}`
        ],
        recommendations: ['AI analysis unavailable'],
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


