# Incorrect Questions Table Setup Guide

## Overview
This guide will help you set up the `incorrect_questions` table in Supabase to store students' wrong answers for review.

## What Changed

### Previous System:
- Wrong answers were marked in `practice_questions` table with `correct = false`
- Review Questions read directly from `practice_questions`

### New System:
- ✅ Wrong answers are stored in a dedicated `incorrect_questions` table
- ✅ Better organization and faster queries
- ✅ More detailed tracking (review count, mastery level, next review date)
- ✅ Stores student's answer alongside correct answer for comparison

## Database Setup

### Step 1: Create the `incorrect_questions` Table

1. Go to your **Supabase Dashboard**
2. Navigate to **SQL Editor**
3. Create a new query
4. Copy and paste the entire content from: `db_scripts/create_incorrect_questions_table.sql`
5. Click **Run** to execute

This will create:
- ✅ `incorrect_questions` table with all necessary columns
- ✅ Indexes for faster queries
- ✅ Row Level Security (RLS) policies
- ✅ Triggers for automatic timestamp updates

### Step 2: Verify Table Creation

Run this query to verify the table was created:

```sql
SELECT * FROM incorrect_questions LIMIT 1;
```

You should see the table structure with these columns:
- `id` (UUID)
- `student_id` (UUID)
- `question_id` (UUID)
- `question` (TEXT)
- `type` (TEXT)
- `subject` (TEXT)
- `subject_code` (VARCHAR)
- `points` (INTEGER)
- `student_answer` (TEXT)
- `correct_answer` (TEXT)
- `explanation` (TEXT)
- `options` (JSONB)
- `review_count` (INTEGER)
- `mastery_level` (TEXT)
- `next_review_date` (TIMESTAMPTZ)
- `first_answered_at` (TIMESTAMPTZ)
- `last_reviewed_at` (TIMESTAMPTZ)
- `created_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ)

### Step 3: Test the Backend (Optional)

Restart your backend server to ensure the changes are applied:

```bash
cd backend
npm start
```

## How It Works

### 1. When a Student Answers a Question

**File**: `backend/controllers/student/practiceAnswers.js`

```javascript
// If answer is incorrect, add to incorrect_questions table
if (correct === false) {
  await supabase
    .from('incorrect_questions')
    .upsert({
      student_id: studentId,
      question_id: questionId,
      question: question.question,
      type: question.type,
      subject: question.subject,
      student_answer: answer,
      correct_answer: question.correct_answer,
      explanation: question.explanation,
      options: optionsJson,
      mastery_level: 'Needs Review',
      // ... other fields
    })
}
```

### 2. When a Student Reviews Incorrect Questions

**File**: `backend/controllers/student/reviewQuestions.js`

```javascript
// Get all incorrect questions for this student
const { data: incorrectQuestions } = await supabase
  .from('incorrect_questions')
  .select('*')
  .eq('student_id', studentId)
  .order('created_at', { ascending: false });
```

### 3. Frontend Flow

1. **Generate Practice Questions** → AI generates questions
2. **Answer Questions** → Submit answers
3. **If Wrong** → Automatically saved to `incorrect_questions`
4. **Review Practice Questions** → Shows all questions from `incorrect_questions`

## Data Flow Diagram

```
┌─────────────────────────────────────┐
│  Generate Practice Questions        │
│  (AI generates questions)            │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  practice_questions table            │
│  (All generated questions)           │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Student Answers Question            │
└──────────────┬──────────────────────┘
               │
        ┌──────┴──────┐
        │             │
    Correct ✅    Incorrect ❌
        │             │
        │             ▼
        │    ┌─────────────────────────┐
        │    │ incorrect_questions     │
        │    │ (Wrong answers stored)  │
        │    └──────────┬──────────────┘
        │               │
        └───────────────┘
                        │
                        ▼
            ┌───────────────────────────┐
            │ Review Practice Questions │
            │ (Shows incorrect_questions)│
            └───────────────────────────┘
```

## Features

### Mastery Levels
- **Needs Review**: Just added to incorrect questions
- **Practicing**: Reviewed once, still needs work
- **Mastered**: Fully understood (can be removed from review list)

### Statistics Tracked
- Total incorrect questions
- Questions due for review
- Mastery rate (percentage of mastered questions)
- Number of mastered questions

### Unique Constraint
- Each question can only appear once per student in `incorrect_questions`
- If answered incorrectly again, it updates the existing record with new timestamp

## Testing

### Test 1: Generate and Answer Questions

1. Go to **Generate Practice Questions** tab
2. Click "Start Practice Questions" to generate questions
3. Answer some questions **incorrectly**
4. Check console logs for: `"Successfully added question to incorrect_questions table"`

### Test 2: Review Incorrect Questions

1. Go to **Review Practice Questions** tab
2. You should see the questions you answered incorrectly
3. Statistics should show:
   - Total Questions: Number of wrong answers
   - Due for Review: Same as total (if not reviewed yet)
   - Mastery Rate: 0% initially

### Test 3: Database Verification

Run this query in Supabase SQL Editor:

```sql
-- Check incorrect questions for a specific student
SELECT 
  student_id,
  question,
  subject,
  student_answer,
  correct_answer,
  mastery_level,
  review_count,
  created_at
FROM incorrect_questions
ORDER BY created_at DESC
LIMIT 10;
```

## Troubleshooting

### Error: "relation 'incorrect_questions' does not exist"

**Solution**: Run the SQL script from `db_scripts/create_incorrect_questions_table.sql`

### Error: "permission denied for table incorrect_questions"

**Solution**: Check RLS policies. Make sure you're using the correct user authentication.

### Questions not appearing in Review tab

**Solution**: 
1. Check browser console for errors
2. Verify backend logs: `console.log('Successfully added question to incorrect_questions table')`
3. Query database directly to check if data exists

### No questions showing after answering incorrectly

**Solution**:
1. Hard refresh browser (Ctrl + Shift + R)
2. Check if answer was actually incorrect (`correct: false`)
3. Check backend logs for insertion errors

## Summary

✅ **Created**: `incorrect_questions` table to store wrong answers  
✅ **Modified**: `submitPracticeAnswer()` to insert wrong answers  
✅ **Modified**: `getReviewQuestions()` to read from `incorrect_questions`  
✅ **Modified**: `getReviewStats()` to calculate stats from `incorrect_questions`  

Now when students answer questions incorrectly, they are automatically saved to a dedicated review database for later practice!

