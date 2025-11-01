import { getSupabaseClient } from '../../clients/supabaseClient.js';
import { ErrorResponse } from '../../utils/errorResponse.js';

// Comprehensive HSC Subjects Data
// In production, this would come from a database
const HSC_SUBJECTS_DATA = [
  {
    id: 'hsc-math-adv',
    code: 'MATH-ADV',
    name: 'Mathematics Advanced',
    category: 'Mathematics',
    units: 2,
    difficulty: 'High',
    description: 'A comprehensive course covering calculus, functions, trigonometry, and statistical analysis. Essential for STEM careers.',
    prerequisites: ['Mathematics (Year 11)'],
    atarContribution: 'High',
    examType: 'Written examination',
    practicalWork: 'Minimal',
    popularity: 78,
    careerPaths: ['Engineering', 'Computer Science', 'Actuarial Studies', 'Data Science', 'Finance'],
    recommendedFor: [
      'Students planning to study STEM at university',
      'Those with strong mathematical aptitude',
      'Anyone interested in analytical careers'
    ]
  },
  {
    id: 'hsc-math-ext1',
    code: 'MATH-EXT1',
    name: 'Mathematics Extension 1',
    category: 'Mathematics',
    units: 1,
    difficulty: 'Very High',
    description: 'Advanced mathematical concepts including complex numbers, further calculus, and advanced trigonometry. Requires Mathematics Advanced.',
    prerequisites: ['Mathematics Advanced'],
    atarContribution: 'High',
    examType: 'Written examination',
    practicalWork: 'None',
    popularity: 45,
    careerPaths: ['Engineering', 'Mathematics', 'Physics', 'Computer Science', 'Quantitative Finance'],
    recommendedFor: [
      'High-achieving mathematics students',
      'Those pursuing advanced STEM degrees',
      'Students aiming for competitive university programs'
    ]
  },
  {
    id: 'hsc-math-ext2',
    code: 'MATH-EXT2',
    name: 'Mathematics Extension 2',
    category: 'Mathematics',
    units: 1,
    difficulty: 'Extreme',
    description: 'The most challenging mathematics course, covering advanced calculus, mechanics, and proof-based mathematics.',
    prerequisites: ['Mathematics Extension 1'],
    atarContribution: 'High',
    examType: 'Written examination',
    practicalWork: 'None',
    popularity: 18,
    careerPaths: ['Pure Mathematics', 'Theoretical Physics', 'Research', 'Cryptography'],
    recommendedFor: [
      'Exceptionally talented mathematics students',
      'Those passionate about mathematical theory',
      'Future mathematicians and theoretical physicists'
    ]
  },
  {
    id: 'hsc-math-std1',
    code: 'MATH-STD1',
    name: 'Mathematics Standard 1',
    category: 'Mathematics',
    units: 2,
    difficulty: 'Low',
    description: 'Practical mathematics focusing on real-world applications, financial mathematics, and data analysis.',
    prerequisites: [],
    atarContribution: 'Medium',
    examType: 'Written examination',
    practicalWork: 'Minimal',
    popularity: 35,
    careerPaths: ['Business', 'Trades', 'Healthcare', 'Social Services'],
    recommendedFor: [
      'Students preferring practical applications',
      'Those not pursuing mathematics-heavy degrees',
      'Students interested in business or social sciences'
    ]
  },
  {
    id: 'hsc-math-std2',
    code: 'MATH-STD2',
    name: 'Mathematics Standard 2',
    category: 'Mathematics',
    units: 2,
    difficulty: 'Medium',
    description: 'Balanced mathematics course covering both practical and theoretical concepts, suitable for most university courses.',
    prerequisites: [],
    atarContribution: 'High',
    examType: 'Written examination',
    practicalWork: 'Minimal',
    popularity: 52,
    careerPaths: ['Business', 'Economics', 'Health Sciences', 'Education', 'Social Sciences'],
    recommendedFor: [
      'Students seeking a balanced mathematics course',
      'Those planning non-STEM university degrees',
      'Students wanting good ATAR contribution'
    ]
  },
  {
    id: 'hsc-english-adv',
    code: 'ENG-ADV',
    name: 'English Advanced',
    category: 'English',
    units: 2,
    difficulty: 'High',
    description: 'Critical analysis of texts, creative and analytical writing, study of classic and contemporary literature.',
    prerequisites: [],
    atarContribution: 'High',
    examType: 'Written examination and essays',
    practicalWork: 'Extensive reading and writing',
    popularity: 82,
    careerPaths: ['Law', 'Journalism', 'Education', 'Publishing', 'Communications', 'Marketing'],
    recommendedFor: [
      'Students with strong literacy skills',
      'Those planning humanities degrees',
      'Anyone wanting to maximize their ATAR'
    ]
  },
  {
    id: 'hsc-english-std',
    code: 'ENG-STD',
    name: 'English Standard',
    category: 'English',
    units: 2,
    difficulty: 'Medium',
    description: 'Comprehensive English course covering reading, writing, and communication skills for everyday and workplace contexts.',
    prerequisites: [],
    atarContribution: 'Medium',
    examType: 'Written examination',
    practicalWork: 'Reading and writing tasks',
    popularity: 68,
    careerPaths: ['Business', 'Trades', 'Healthcare', 'Various'],
    recommendedFor: [
      'Students seeking practical English skills',
      'Those not planning humanities degrees',
      'Students preferring contemporary texts'
    ]
  },
  {
    id: 'hsc-physics',
    code: 'PHYS',
    name: 'Physics',
    category: 'Science',
    units: 2,
    difficulty: 'High',
    description: 'Study of motion, forces, energy, waves, electricity, magnetism, and modern physics concepts.',
    prerequisites: ['Recommended: Mathematics Advanced'],
    atarContribution: 'High',
    examType: 'Written examination with practical component',
    practicalWork: 'Extensive laboratory work',
    popularity: 58,
    careerPaths: ['Engineering', 'Physics', 'Astronomy', 'Medicine', 'Technology', 'Research'],
    recommendedFor: [
      'Students interested in how things work',
      'Those pursuing engineering or physical sciences',
      'Anyone with strong mathematical skills'
    ]
  },
  {
    id: 'hsc-chemistry',
    code: 'CHEM',
    name: 'Chemistry',
    category: 'Science',
    units: 2,
    difficulty: 'High',
    description: 'Comprehensive study of matter, chemical reactions, organic chemistry, and practical laboratory techniques.',
    prerequisites: ['Recommended: Mathematics Advanced'],
    atarContribution: 'High',
    examType: 'Written examination with practical component',
    practicalWork: 'Extensive laboratory work',
    popularity: 62,
    careerPaths: ['Medicine', 'Pharmacy', 'Chemical Engineering', 'Research', 'Environmental Science'],
    recommendedFor: [
      'Students interested in medicine or pharmacy',
      'Those who enjoy laboratory work',
      'Anyone curious about molecular science'
    ]
  },
  {
    id: 'hsc-biology',
    code: 'BIOL',
    name: 'Biology',
    category: 'Science',
    units: 2,
    difficulty: 'Medium',
    description: 'Study of living organisms, cells, genetics, evolution, and ecosystem dynamics.',
    prerequisites: [],
    atarContribution: 'High',
    examType: 'Written examination with practical component',
    practicalWork: 'Laboratory and field work',
    popularity: 72,
    careerPaths: ['Medicine', 'Veterinary Science', 'Biotechnology', 'Environmental Science', 'Research'],
    recommendedFor: [
      'Students interested in life sciences',
      'Those pursuing health-related careers',
      'Anyone passionate about nature and living systems'
    ]
  },
  {
    id: 'hsc-ancient-history',
    code: 'ANCH',
    name: 'Ancient History',
    category: 'HSIE',
    units: 2,
    difficulty: 'Medium',
    description: 'Investigation of ancient civilizations, archaeological methods, and historical analysis.',
    prerequisites: [],
    atarContribution: 'High',
    examType: 'Written examination and essays',
    practicalWork: 'Research and source analysis',
    popularity: 38,
    careerPaths: ['Archaeology', 'Museum Studies', 'Education', 'Law', 'Research'],
    recommendedFor: [
      'Students fascinated by ancient civilizations',
      'Those with strong analytical skills',
      'Anyone interested in cultural heritage'
    ]
  },
  {
    id: 'hsc-modern-history',
    code: 'MODH',
    name: 'Modern History',
    category: 'HSIE',
    units: 2,
    difficulty: 'Medium',
    description: 'Study of major events, movements, and changes from 1750 to present day.',
    prerequisites: [],
    atarContribution: 'High',
    examType: 'Written examination and essays',
    practicalWork: 'Research and source analysis',
    popularity: 45,
    careerPaths: ['Law', 'Politics', 'Journalism', 'Education', 'International Relations'],
    recommendedFor: [
      'Students interested in recent history',
      'Those who enjoy debating and analysis',
      'Anyone pursuing social sciences or law'
    ]
  },
  {
    id: 'hsc-economics',
    code: 'ECON',
    name: 'Economics',
    category: 'HSIE',
    units: 2,
    difficulty: 'High',
    description: 'Study of economic theory, markets, global economics, and policy analysis.',
    prerequisites: ['Recommended: Mathematics'],
    atarContribution: 'High',
    examType: 'Written examination',
    practicalWork: 'Case studies and analysis',
    popularity: 42,
    careerPaths: ['Economics', 'Finance', 'Business', 'Policy Analysis', 'Consulting'],
    recommendedFor: [
      'Students interested in business and finance',
      'Those with strong analytical skills',
      'Anyone pursuing commerce degrees'
    ]
  },
  {
    id: 'hsc-business-studies',
    code: 'BUS',
    name: 'Business Studies',
    category: 'HSIE',
    units: 2,
    difficulty: 'Medium',
    description: 'Comprehensive overview of business operations, management, marketing, and finance.',
    prerequisites: [],
    atarContribution: 'High',
    examType: 'Written examination',
    practicalWork: 'Case studies and projects',
    popularity: 68,
    careerPaths: ['Business Management', 'Marketing', 'Entrepreneurship', 'HR', 'Accounting'],
    recommendedFor: [
      'Students interested in running businesses',
      'Those pursuing commerce degrees',
      'Future entrepreneurs and managers'
    ]
  },
  {
    id: 'hsc-legal-studies',
    code: 'LEGAL',
    name: 'Legal Studies',
    category: 'HSIE',
    units: 2,
    difficulty: 'Medium',
    description: 'Study of legal systems, rights, responsibilities, and contemporary legal issues.',
    prerequisites: [],
    atarContribution: 'High',
    examType: 'Written examination',
    practicalWork: 'Case studies and analysis',
    popularity: 48,
    careerPaths: ['Law', 'Politics', 'Social Work', 'Police', 'Justice System'],
    recommendedFor: [
      'Students interested in law and justice',
      'Those with strong debating skills',
      'Anyone pursuing legal careers'
    ]
  },
  {
    id: 'hsc-visual-arts',
    code: 'VA',
    name: 'Visual Arts',
    category: 'Creative Arts',
    units: 2,
    difficulty: 'Medium',
    description: 'Development of artistic skills, art history, and creation of a body of work.',
    prerequisites: [],
    atarContribution: 'High',
    examType: 'Portfolio and written examination',
    practicalWork: 'Extensive studio practice',
    popularity: 35,
    careerPaths: ['Fine Arts', 'Design', 'Architecture', 'Art Therapy', 'Museum Work'],
    recommendedFor: [
      'Creatively talented students',
      'Those passionate about visual expression',
      'Anyone pursuing art or design degrees'
    ]
  },
  {
    id: 'hsc-music',
    code: 'MUS',
    name: 'Music 1',
    category: 'Creative Arts',
    units: 2,
    difficulty: 'Medium',
    description: 'Performance, composition, and musicology across various styles and genres.',
    prerequisites: [],
    atarContribution: 'High',
    examType: 'Performance, composition, and written exam',
    practicalWork: 'Performance and composition',
    popularity: 28,
    careerPaths: ['Music Performance', 'Composition', 'Music Education', 'Sound Design', 'Music Therapy'],
    recommendedFor: [
      'Musically talented students',
      'Those passionate about music',
      'Anyone pursuing music degrees'
    ]
  },
  {
    id: 'hsc-pdhpe',
    code: 'PDHPE',
    name: 'Personal Development, Health and Physical Education',
    category: 'PDHPE',
    units: 2,
    difficulty: 'Low',
    description: 'Study of health, physical activity, and personal development across the lifespan.',
    prerequisites: [],
    atarContribution: 'Medium',
    examType: 'Written examination',
    practicalWork: 'Physical activities and research',
    popularity: 55,
    careerPaths: ['Teaching', 'Sports Science', 'Health Promotion', 'Physiotherapy', 'Coaching'],
    recommendedFor: [
      'Students interested in health and fitness',
      'Those pursuing teaching or sports science',
      'Anyone passionate about wellbeing'
    ]
  }
];

/**
 * GET /api/student/hsc-subjects
 * Get all HSC subjects with filtering and sorting options
 */
export const getHSCSubjects = async (req, res) => {
  try {
    const { category, units, difficulty, sortBy } = req.query;
    
    let subjects = [...HSC_SUBJECTS_DATA];
    
    // Apply filters
    if (category && category !== 'All') {
      subjects = subjects.filter(s => s.category === category);
    }
    
    if (units && units !== 'All') {
      subjects = subjects.filter(s => s.units.toString() === units);
    }
    
    if (difficulty && difficulty !== 'All') {
      subjects = subjects.filter(s => s.difficulty === difficulty);
    }
    
    // Apply sorting
    if (sortBy) {
      switch (sortBy) {
        case 'name':
          subjects.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'popularity':
          subjects.sort((a, b) => b.popularity - a.popularity);
          break;
        case 'difficulty':
          const difficultyOrder = { 'Low': 1, 'Medium': 2, 'High': 3, 'Very High': 4, 'Extreme': 5 };
          subjects.sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]);
          break;
        case 'units':
          subjects.sort((a, b) => b.units - a.units);
          break;
      }
    }
    
    return res.json({
      success: true,
      subjects,
      categories: ['All', ...new Set(HSC_SUBJECTS_DATA.map(s => s.category))],
      units: ['All', ...new Set(HSC_SUBJECTS_DATA.map(s => s.units))],
      difficulties: ['All', ...new Set(HSC_SUBJECTS_DATA.map(s => s.difficulty))]
    });
  } catch (error) {
    console.error('Get HSC subjects error:', error);
    return ErrorResponse.internalServerError('Failed to fetch HSC subjects').send(res);
  }
};

/**
 * GET /api/student/hsc-subjects/:id
 * Get details for a specific HSC subject
 */
export const getHSCSubjectDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const subject = HSC_SUBJECTS_DATA.find(s => s.id === id);
    
    if (!subject) {
      return ErrorResponse.notFound('Subject not found').send(res);
    }
    
    return res.json({
      success: true,
      subject
    });
  } catch (error) {
    console.error('Get HSC subject detail error:', error);
    return ErrorResponse.internalServerError('Failed to fetch subject details').send(res);
  }
};

/**
 * POST /api/student/hsc-study-plan
 * Save or update student's HSC study plan
 */
export const saveHSCStudyPlan = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { subjects, plan_name } = req.body;
    
    if (!subjects || !Array.isArray(subjects)) {
      return ErrorResponse.badRequest('Subjects array is required').send(res);
    }
    
    const supabase = getSupabaseClient();
    
    // Store in student_study_preferences as JSON
    const { data, error } = await supabase
      .from('student_study_preferences')
      .upsert({
        student_id: studentId,
        preferences: {
          hsc_study_plan: {
            plan_name: plan_name || 'My HSC Plan',
            subjects,
            total_units: subjects.reduce((sum, s) => sum + (s.units || 0), 0),
            updated_at: new Date().toISOString()
          }
        }
      }, {
        onConflict: 'student_id'
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return res.json({
      success: true,
      message: 'Study plan saved successfully',
      plan: data?.preferences?.hsc_study_plan
    });
  } catch (error) {
    console.error('Save HSC study plan error:', error);
    return ErrorResponse.internalServerError('Failed to save study plan').send(res);
  }
};

/**
 * GET /api/student/hsc-study-plan
 * Get student's saved HSC study plan
 */
export const getHSCStudyPlan = async (req, res) => {
  try {
    const studentId = req.user.id;
    const supabase = getSupabaseClient();
    
    const { data, error } = await supabase
      .from('student_study_preferences')
      .select('preferences')
      .eq('student_id', studentId)
      .single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      throw error;
    }
    
    const studyPlan = data?.preferences?.hsc_study_plan || {
      subjects: [],
      total_units: 0,
      plan_name: 'My HSC Plan'
    };
    
    return res.json({
      success: true,
      plan: studyPlan
    });
  } catch (error) {
    console.error('Get HSC study plan error:', error);
    return ErrorResponse.internalServerError('Failed to fetch study plan').send(res);
  }
};

