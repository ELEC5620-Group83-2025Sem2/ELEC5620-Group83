// Mock data for Student Dashboard
// This will be replaced with actual API calls

export const studentData = {
  name: 'John Smith',
  email: 'john.smith@school.edu.au',
  studentId: 'STU2025001',
  avatar: '👨‍🎓'
}

export const enrolledClasses = [
  {
    id: 1,
    code: 'MATH-ADV',
    name: 'Mathematics Advanced',
    teacher: 'Dr. Sarah Johnson',
    color: '#667eea',
    progress: 75,
    nextClass: 'Tomorrow, 9:00 AM',
    assignments: 2,
    grade: 'A',
    description: 'Advanced mathematics covering calculus, algebra, and mathematical reasoning. This course prepares students for tertiary mathematics and develops critical thinking skills.',
    location: 'Room 302, Building A',
    assignmentsList: [
      {
        id: 1,
        title: 'Calculus Problem Set 5',
        dueDate: '2025-10-18',
        dueTime: '11:59 PM',
        status: 'pending',
        weight: 15
      },
      {
        id: 2,
        title: 'Algebra Quiz 4',
        dueDate: '2025-10-25',
        dueTime: '11:59 PM',
        status: 'pending',
        weight: 10
      }
    ],
    materials: [
      { name: 'Chapter 5 - Integration.pdf', type: 'pdf', size: '2.4 MB', uploadDate: 'Oct 10, 2025' },
      { name: 'Practice Problems Set.pdf', type: 'pdf', size: '1.8 MB', uploadDate: 'Oct 12, 2025' },
      { name: 'Lecture Video - Week 8.mp4', type: 'video', size: '156 MB', uploadDate: 'Oct 15, 2025' }
    ],
    schedule: [
      { day: 'Monday', time: '9:00 AM - 10:30 AM', location: 'Room 302, Building A' },
      { day: 'Wednesday', time: '9:00 AM - 10:30 AM', location: 'Room 302, Building A' },
      { day: 'Friday', time: '2:00 PM - 3:30 PM', location: 'Room 302, Building A' }
    ],
    gradeHistory: [
      { assessment: 'Quiz 1', score: 95, maxScore: 100, weight: 10, grade: 'A' },
      { assessment: 'Problem Set 1', score: 88, maxScore: 100, weight: 15, grade: 'B+' },
      { assessment: 'Midterm Exam', score: 92, maxScore: 100, weight: 30, grade: 'A' }
    ]
  },
  {
    id: 2,
    code: 'ENG-ADV',
    name: 'English Advanced',
    teacher: 'Mr. Michael Chen',
    color: '#f56565',
    progress: 68,
    nextClass: 'Today, 2:00 PM',
    assignments: 1,
    grade: 'B+',
    description: 'Study of literature, critical analysis, and advanced writing techniques. Focus on Shakespeare, modern literature, and essay composition.',
    location: 'Room 105, Building B',
    assignmentsList: [
      {
        id: 3,
        title: 'Essay: Shakespeare Analysis',
        dueDate: '2025-10-20',
        dueTime: '11:59 PM',
        status: 'in-progress',
        weight: 25
      }
    ],
    materials: [
      { name: 'Hamlet - Full Text.pdf', type: 'pdf', size: '1.2 MB', uploadDate: 'Oct 8, 2025' },
      { name: 'Literary Analysis Guide.pdf', type: 'pdf', size: '800 KB', uploadDate: 'Oct 10, 2025' }
    ],
    schedule: [
      { day: 'Tuesday', time: '2:00 PM - 3:30 PM', location: 'Room 105, Building B' },
      { day: 'Thursday', time: '2:00 PM - 3:30 PM', location: 'Room 105, Building B' }
    ],
    gradeHistory: [
      { assessment: 'Poetry Analysis', score: 88, maxScore: 100, weight: 20, grade: 'B+' },
      { assessment: 'Creative Writing', score: 85, maxScore: 100, weight: 15, grade: 'B' }
    ]
  },
  {
    id: 3,
    code: 'PHYS',
    name: 'Physics',
    teacher: 'Dr. Emily Wilson',
    color: '#48bb78',
    progress: 82,
    nextClass: 'Friday, 10:30 AM',
    assignments: 0,
    grade: 'A+',
    description: 'Comprehensive study of mechanics, thermodynamics, waves, and electromagnetism. Includes practical laboratory work.',
    location: 'Lab 201, Science Building',
    assignmentsList: [],
    materials: [
      { name: 'Newton\'s Laws - Lecture Notes.pdf', type: 'pdf', size: '2.1 MB', uploadDate: 'Oct 5, 2025' },
      { name: 'Lab Manual - Thermodynamics.pdf', type: 'pdf', size: '3.4 MB', uploadDate: 'Oct 9, 2025' }
    ],
    schedule: [
      { day: 'Monday', time: '10:30 AM - 12:00 PM', location: 'Lab 201, Science Building' },
      { day: 'Friday', time: '10:30 AM - 12:00 PM', location: 'Lab 201, Science Building' }
    ],
    gradeHistory: [
      { assessment: 'Newton\'s Laws Test', score: 98, maxScore: 100, weight: 25, grade: 'A+' },
      { assessment: 'Lab Report 1', score: 95, maxScore: 100, weight: 15, grade: 'A' }
    ]
  },
  {
    id: 4,
    code: 'CHEM',
    name: 'Chemistry',
    teacher: 'Ms. Lisa Anderson',
    color: '#ed8936',
    progress: 71,
    nextClass: 'Thursday, 1:00 PM',
    assignments: 3,
    grade: 'A-',
    description: 'Study of chemical reactions, organic chemistry, and molecular structures. Laboratory work included.',
    location: 'Lab 103, Science Building',
    assignmentsList: [
      {
        id: 4,
        title: 'Lab Report: Thermodynamics',
        dueDate: '2025-10-22',
        dueTime: '11:59 PM',
        status: 'pending',
        weight: 20
      },
      {
        id: 5,
        title: 'Organic Chemistry Quiz',
        dueDate: '2025-10-26',
        dueTime: '11:59 PM',
        status: 'pending',
        weight: 10
      },
      {
        id: 6,
        title: 'Research Project',
        dueDate: '2025-10-30',
        dueTime: '11:59 PM',
        status: 'pending',
        weight: 30
      }
    ],
    materials: [
      { name: 'Organic Chemistry Basics.pdf', type: 'pdf', size: '4.2 MB', uploadDate: 'Oct 7, 2025' },
      { name: 'Periodic Table Reference.pdf', type: 'pdf', size: '500 KB', uploadDate: 'Oct 1, 2025' }
    ],
    schedule: [
      { day: 'Tuesday', time: '1:00 PM - 2:30 PM', location: 'Lab 103, Science Building' },
      { day: 'Thursday', time: '1:00 PM - 2:30 PM', location: 'Lab 103, Science Building' }
    ],
    gradeHistory: [
      { assessment: 'Organic Chemistry Quiz', score: 92, maxScore: 100, weight: 10, grade: 'A' },
      { assessment: 'Lab Practical', score: 89, maxScore: 100, weight: 20, grade: 'B+' }
    ]
  }
]

export const upcomingAssignments = [
  {
    id: 1,
    title: 'Calculus Problem Set 5',
    class: 'Mathematics Advanced',
    dueDate: '2025-10-18',
    dueTime: '11:59 PM',
    status: 'pending',
    priority: 'high',
    weight: 15,
    totalPoints: 100,
    postedDate: 'Oct 10, 2025',
    submissionType: 'Online',
    description: 'Complete the problem set covering integration techniques, including substitution, integration by parts, and partial fractions. Show all work and provide detailed explanations for each solution.',
    instructions: [
      'Read Chapter 5 sections 5.1-5.4 before attempting the problems',
      'Complete all 15 problems in the problem set',
      'Show all working and intermediate steps',
      'Submit your solutions as a single PDF file',
      'Ensure your handwriting is legible or type your solutions'
    ],
    requirements: [
      'All answers must include step-by-step working',
      'Graphs must be clearly labeled with axes',
      'Final answers should be boxed or highlighted',
      'Solutions must be submitted before the deadline'
    ],
    resources: [
      { name: 'Chapter 5 Textbook.pdf', type: 'PDF Document' },
      { name: 'Integration Formulas Sheet.pdf', type: 'Reference Material' },
      { name: 'Example Solutions.pdf', type: 'Study Guide' }
    ],
    rubric: [
      { criteria: 'Correct Solutions', points: 60 },
      { criteria: 'Working Shown', points: 20 },
      { criteria: 'Presentation', points: 10 },
      { criteria: 'On-Time Submission', points: 10 }
    ]
  },
  {
    id: 2,
    title: 'Essay: Shakespeare Analysis',
    class: 'English Advanced',
    dueDate: '2025-10-20',
    dueTime: '11:59 PM',
    status: 'in-progress',
    priority: 'medium',
    weight: 25,
    totalPoints: 100,
    postedDate: 'Oct 5, 2025',
    submissionType: 'Online',
    description: 'Write a comprehensive analytical essay examining the themes of power, betrayal, and revenge in Shakespeare\'s Hamlet. Your essay should be 1500-2000 words and include textual evidence to support your arguments.',
    instructions: [
      'Choose 2-3 major themes from Hamlet to analyze in depth',
      'Include at least 5 direct quotations from the text',
      'Provide proper citations using MLA format',
      'Structure your essay with a clear introduction, body paragraphs, and conclusion',
      'Submit as a Word document or PDF'
    ],
    requirements: [
      'Length: 1500-2000 words',
      'Font: Times New Roman, 12pt',
      'Spacing: Double-spaced',
      'Citations: MLA format',
      'Include a Works Cited page'
    ],
    resources: [
      { name: 'Hamlet Full Text.pdf', type: 'Primary Source' },
      { name: 'MLA Citation Guide.pdf', type: 'Reference' },
      { name: 'Literary Analysis Examples.pdf', type: 'Study Guide' }
    ],
    rubric: [
      { criteria: 'Thesis & Argument', points: 30 },
      { criteria: 'Textual Evidence', points: 25 },
      { criteria: 'Analysis & Insight', points: 25 },
      { criteria: 'Structure & Organization', points: 10 },
      { criteria: 'Grammar & Style', points: 10 }
    ]
  },
  {
    id: 3,
    title: 'Lab Report: Thermodynamics',
    class: 'Physics',
    dueDate: '2025-10-22',
    dueTime: '11:59 PM',
    status: 'pending',
    priority: 'low',
    weight: 20,
    totalPoints: 100,
    postedDate: 'Oct 12, 2025',
    submissionType: 'Online',
    description: 'Write a detailed lab report on the thermodynamics experiment conducted in class. Include your hypothesis, methodology, results, analysis, and conclusions.',
    instructions: [
      'Follow the standard lab report format provided in class',
      'Include all raw data in an appendix',
      'Create graphs showing temperature vs. time relationships',
      'Discuss sources of error and their impact on results',
      'Compare your results with theoretical predictions'
    ],
    requirements: [
      'Title page with experiment name and date',
      'Abstract (150-200 words)',
      'Introduction with hypothesis',
      'Methodology section',
      'Results with data tables and graphs',
      'Discussion and conclusion'
    ],
    resources: [
      { name: 'Lab Manual - Thermodynamics.pdf', type: 'Lab Guide' },
      { name: 'Data Analysis Template.xlsx', type: 'Template' },
      { name: 'Sample Lab Report.pdf', type: 'Example' }
    ],
    rubric: [
      { criteria: 'Abstract & Introduction', points: 15 },
      { criteria: 'Methodology', points: 20 },
      { criteria: 'Results & Data', points: 25 },
      { criteria: 'Analysis & Discussion', points: 30 },
      { criteria: 'Format & Presentation', points: 10 }
    ]
  },
  {
    id: 4,
    title: 'Organic Chemistry Lab Practical',
    class: 'Chemistry',
    dueDate: '2025-10-24',
    dueTime: '3:00 PM',
    status: 'pending',
    priority: 'high',
    weight: 25,
    totalPoints: 100,
    postedDate: 'Oct 14, 2025',
    submissionType: 'In-Person Lab',
    description: 'Conduct an organic synthesis experiment to create aspirin from salicylic acid. This practical assessment will test your laboratory techniques, safety protocols, and analytical skills.',
    instructions: [
      'Review the synthesis procedure in Chapter 8 before the lab',
      'Come prepared with completed pre-lab questions',
      'Wear appropriate safety equipment (lab coat, goggles, gloves)',
      'Record all observations and measurements in your lab notebook',
      'Calculate theoretical and actual yields',
      'Submit your product sample for purity testing'
    ],
    requirements: [
      'Completed pre-lab worksheet',
      'Clean and organized workspace throughout',
      'Accurate measurements and calculations',
      'Proper disposal of chemical waste',
      'Synthesis product with >70% purity',
      'Post-lab report due within 48 hours'
    ],
    resources: [
      { name: 'Organic Synthesis Procedures.pdf', type: 'Lab Protocol' },
      { name: 'Pre-Lab Questions.pdf', type: 'Worksheet' },
      { name: 'Safety Guidelines.pdf', type: 'Reference' },
      { name: 'Aspirin Synthesis Video Tutorial.mp4', type: 'Video Guide' }
    ],
    rubric: [
      { criteria: 'Pre-Lab Preparation', points: 10 },
      { criteria: 'Laboratory Technique', points: 30 },
      { criteria: 'Product Quality & Yield', points: 25 },
      { criteria: 'Safety & Cleanliness', points: 15 },
      { criteria: 'Post-Lab Report', points: 20 }
    ],
    hasQuestions: true,
    questions: [
      {
        id: 1,
        type: 'multiple-choice',
        points: 4,
        question: 'What is the functional group present in aspirin (acetylsalicylic acid)?',
        options: [
          { id: 'a', text: 'Ester and carboxylic acid', isCorrect: true },
          { id: 'b', text: 'Alcohol and aldehyde', isCorrect: false },
          { id: 'c', text: 'Ketone and amine', isCorrect: false },
          { id: 'd', text: 'Ether and phenol', isCorrect: false }
        ]
      },
      {
        id: 2,
        type: 'short-answer',
        points: 6,
        question: 'Write the balanced chemical equation for the synthesis of aspirin from salicylic acid and acetic anhydride. Include the catalyst.'
      },
      {
        id: 3,
        type: 'multiple-choice',
        points: 4,
        question: 'Why is sulfuric acid used as a catalyst in this synthesis?',
        options: [
          { id: 'a', text: 'To increase the temperature of the reaction', isCorrect: false },
          { id: 'b', text: 'To protonate the carbonyl group and make it more electrophilic', isCorrect: true },
          { id: 'c', text: 'To neutralize the product', isCorrect: false },
          { id: 'd', text: 'To prevent side reactions', isCorrect: false }
        ]
      },
      {
        id: 4,
        type: 'short-answer',
        points: 8,
        question: 'If you start with 2.5 g of salicylic acid, calculate the theoretical yield of aspirin in grams. Show all calculations. (Molecular weights: salicylic acid = 138.12 g/mol, aspirin = 180.16 g/mol)'
      },
      {
        id: 5,
        type: 'multiple-choice',
        points: 4,
        question: 'What is the purpose of adding ice-cold water after the reaction is complete?',
        options: [
          { id: 'a', text: 'To speed up the reaction', isCorrect: false },
          { id: 'b', text: 'To crystallize the aspirin product', isCorrect: true },
          { id: 'c', text: 'To dissolve impurities', isCorrect: false },
          { id: 'd', text: 'To remove the catalyst', isCorrect: false }
        ]
      },
      {
        id: 6,
        type: 'short-answer',
        points: 8,
        question: 'Describe two safety hazards associated with acetic anhydride and the precautions you should take when handling it.'
      },
      {
        id: 7,
        type: 'multiple-choice',
        points: 4,
        question: 'Which method is commonly used to purify the crude aspirin product?',
        options: [
          { id: 'a', text: 'Distillation', isCorrect: false },
          { id: 'b', text: 'Recrystallization', isCorrect: true },
          { id: 'c', text: 'Chromatography', isCorrect: false },
          { id: 'd', text: 'Extraction', isCorrect: false }
        ]
      },
      {
        id: 8,
        type: 'short-answer',
        points: 7,
        question: 'If your actual yield is 1.8 g and your theoretical yield is 3.0 g, calculate your percent yield. What factors might explain why the percent yield is less than 100%?'
      }
    ]
  },
  {
    id: 5,
    title: 'Poetry Creative Writing Project',
    class: 'English Advanced',
    dueDate: '2025-10-28',
    dueTime: '11:59 PM',
    status: 'pending',
    priority: 'medium',
    weight: 20,
    totalPoints: 100,
    postedDate: 'Oct 10, 2025',
    submissionType: 'Online',
    description: 'Create a collection of 5 original poems exploring the theme of "Identity and Belonging". Experiment with different poetic forms and literary devices. Include a reflection essay analyzing your creative choices.',
    instructions: [
      'Write 5 original poems (minimum 12 lines each)',
      'Use at least 3 different poetic forms (sonnet, free verse, haiku, etc.)',
      'Incorporate literary devices: metaphor, simile, imagery, alliteration',
      'Write a 500-word reflection explaining your creative process',
      'Format your submission with a title page and table of contents',
      'Submit as a PDF with proper formatting'
    ],
    requirements: [
      '5 poems, each 12+ lines',
      'Variety in poetic forms and styles',
      'Clear exploration of the theme',
      'Evidence of literary techniques',
      '500-word critical reflection',
      'Professional presentation'
    ],
    resources: [
      { name: 'Poetic Forms Guide.pdf', type: 'Reference' },
      { name: 'Literary Devices Handbook.pdf', type: 'Study Material' },
      { name: 'Sample Poetry Portfolio.pdf', type: 'Example' },
      { name: 'Identity in Poetry - Reading List.pdf', type: 'Reference' }
    ],
    rubric: [
      { criteria: 'Originality & Creativity', points: 25 },
      { criteria: 'Theme Exploration', points: 20 },
      { criteria: 'Use of Literary Devices', points: 20 },
      { criteria: 'Technical Skill', points: 15 },
      { criteria: 'Reflection Quality', points: 15 },
      { criteria: 'Presentation', points: 5 }
    ]
  },
  {
    id: 6,
    title: 'Trigonometry Quiz',
    class: 'Mathematics Advanced',
    dueDate: '2025-10-21',
    dueTime: '10:00 AM',
    status: 'pending',
    priority: 'high',
    weight: 10,
    totalPoints: 50,
    postedDate: 'Oct 15, 2025',
    submissionType: 'In-Class',
    description: 'Timed quiz covering trigonometric functions, identities, and applications. This 45-minute assessment will test your understanding of sine, cosine, tangent functions and their real-world applications.',
    instructions: [
      'Arrive on time - quiz starts promptly at 10:00 AM',
      'Bring calculator, pencil, and ruler',
      'Review Chapter 6 sections 6.1-6.5',
      'Practice problems from homework sets 8-10',
      'No notes or textbooks allowed during quiz',
      'Show all working for partial credit'
    ],
    requirements: [
      'Scientific calculator (non-graphing)',
      'Writing materials',
      'Student ID for verification',
      'Complete all 10 questions',
      'Box final answers clearly'
    ],
    resources: [
      { name: 'Trigonometry Review Sheet.pdf', type: 'Study Guide' },
      { name: 'Practice Problems with Solutions.pdf', type: 'Practice Material' },
      { name: 'Trig Identities Chart.pdf', type: 'Reference' },
      { name: 'Unit Circle Diagram.pdf', type: 'Visual Aid' }
    ],
    rubric: [
      { criteria: 'Correct Answers', points: 35 },
      { criteria: 'Working & Process', points: 10 },
      { criteria: 'Clarity of Solutions', points: 5 }
    ],
    hasQuestions: true,
    questions: [
      {
        id: 1,
        type: 'multiple-choice',
        points: 5,
        question: 'What is the value of sin(π/6)?',
        options: [
          { id: 'a', text: '1/2', isCorrect: true },
          { id: 'b', text: '√3/2', isCorrect: false },
          { id: 'c', text: '√2/2', isCorrect: false },
          { id: 'd', text: '1', isCorrect: false }
        ]
      },
      {
        id: 2,
        type: 'multiple-choice',
        points: 5,
        question: 'Which of the following is equivalent to tan(x)?',
        options: [
          { id: 'a', text: 'cos(x)/sin(x)', isCorrect: false },
          { id: 'b', text: 'sin(x)/cos(x)', isCorrect: true },
          { id: 'c', text: '1/sin(x)', isCorrect: false },
          { id: 'd', text: '1/cos(x)', isCorrect: false }
        ]
      },
      {
        id: 3,
        type: 'multiple-choice',
        points: 5,
        question: 'If cos(θ) = 0.6 and θ is in the first quadrant, what is sin(θ)?',
        options: [
          { id: 'a', text: '0.4', isCorrect: false },
          { id: 'b', text: '0.6', isCorrect: false },
          { id: 'c', text: '0.8', isCorrect: true },
          { id: 'd', text: '1.0', isCorrect: false }
        ]
      },
      {
        id: 4,
        type: 'short-answer',
        points: 8,
        question: 'Solve for x in the equation: 2sin(x) + 1 = 0, where 0 ≤ x ≤ 2π. Show all working.'
      },
      {
        id: 5,
        type: 'multiple-choice',
        points: 5,
        question: 'What is the period of the function f(x) = sin(2x)?',
        options: [
          { id: 'a', text: 'π/2', isCorrect: false },
          { id: 'b', text: 'π', isCorrect: true },
          { id: 'c', text: '2π', isCorrect: false },
          { id: 'd', text: '4π', isCorrect: false }
        ]
      },
      {
        id: 6,
        type: 'multiple-choice',
        points: 5,
        question: 'Which identity is correct?',
        options: [
          { id: 'a', text: 'sin²(x) + cos²(x) = 2', isCorrect: false },
          { id: 'b', text: 'sin²(x) + cos²(x) = 1', isCorrect: true },
          { id: 'c', text: 'sin²(x) - cos²(x) = 1', isCorrect: false },
          { id: 'd', text: 'sin(x) × cos(x) = 1', isCorrect: false }
        ]
      },
      {
        id: 7,
        type: 'short-answer',
        points: 8,
        question: 'A ladder 10 meters long leans against a wall. If the ladder makes an angle of 60° with the ground, how high up the wall does the ladder reach? Show your calculation.'
      },
      {
        id: 8,
        type: 'multiple-choice',
        points: 4,
        question: 'In which quadrant is tan(θ) negative and sin(θ) positive?',
        options: [
          { id: 'a', text: 'Quadrant I', isCorrect: false },
          { id: 'b', text: 'Quadrant II', isCorrect: true },
          { id: 'c', text: 'Quadrant III', isCorrect: false },
          { id: 'd', text: 'Quadrant IV', isCorrect: false }
        ]
      },
      {
        id: 9,
        type: 'short-answer',
        points: 5,
        question: 'Evaluate: cos(π/3) + sin(π/4). Express your answer in exact form.'
      }
    ]
  },
  {
    id: 7,
    title: 'Chemical Equilibrium Research Project',
    class: 'Chemistry',
    dueDate: '2025-10-30',
    dueTime: '11:59 PM',
    status: 'pending',
    priority: 'medium',
    weight: 30,
    totalPoints: 150,
    postedDate: 'Oct 5, 2025',
    submissionType: 'Online + Presentation',
    description: 'Investigate a real-world application of chemical equilibrium (e.g., Haber process, blood pH regulation, ocean acidification). Submit a written report and prepare a 10-minute presentation for the class.',
    instructions: [
      'Choose one real-world equilibrium system to study',
      'Research the chemistry, industrial applications, and environmental impact',
      'Include chemical equations and equilibrium calculations',
      'Create visual aids (diagrams, graphs, or infographics)',
      'Write a 2000-word research report',
      'Prepare a 10-minute PowerPoint presentation',
      'Present to class during weeks of Nov 1-5'
    ],
    requirements: [
      'Topic approval by Oct 18',
      'Minimum 6 academic sources (journals, textbooks)',
      'Proper APA citations and bibliography',
      'Chemical equations properly balanced',
      'Calculations showing equilibrium constants',
      'Professional PowerPoint (10-15 slides)',
      'Rehearsed, engaging presentation'
    ],
    resources: [
      { name: 'Equilibrium Applications Examples.pdf', type: 'Topic Ideas' },
      { name: 'APA Citation Guide.pdf', type: 'Reference' },
      { name: 'Research Report Template.docx', type: 'Template' },
      { name: 'Presentation Rubric.pdf', type: 'Assessment Criteria' },
      { name: 'Scientific Databases Access.pdf', type: 'Research Tool' }
    ],
    rubric: [
      { criteria: 'Research Quality & Depth', points: 40 },
      { criteria: 'Chemical Accuracy', points: 30 },
      { criteria: 'Written Report Quality', points: 35 },
      { criteria: 'Presentation Skills', points: 25 },
      { criteria: 'Visual Aids', points: 10 },
      { criteria: 'Citations & Format', points: 10 }
    ]
  },
  {
    id: 8,
    title: 'Mechanics Problem Set 3',
    class: 'Physics',
    dueDate: '2025-10-27',
    dueTime: '11:59 PM',
    status: 'pending',
    priority: 'low',
    weight: 15,
    totalPoints: 100,
    postedDate: 'Oct 18, 2025',
    submissionType: 'Online',
    description: 'Solve 12 problems involving circular motion, gravitation, and orbital mechanics. Apply Newton\'s laws and gravitational equations to real-world scenarios including satellite orbits and planetary motion.',
    instructions: [
      'Solve all 12 problems showing detailed working',
      'Draw free-body diagrams where applicable',
      'State assumptions clearly',
      'Use SI units throughout',
      'Check your answers for reasonableness',
      'Scan or type your solutions and submit as PDF'
    ],
    requirements: [
      'All problems attempted',
      'Clear diagrams and labels',
      'Step-by-step calculations',
      'Units included in all answers',
      'Final answers highlighted',
      'Neat, organized presentation'
    ],
    resources: [
      { name: 'Circular Motion Notes.pdf', type: 'Lecture Notes' },
      { name: 'Gravitation Equations Sheet.pdf', type: 'Formula Reference' },
      { name: 'Worked Examples - Orbits.pdf', type: 'Study Guide' },
      { name: 'Problem Set Questions.pdf', type: 'Assignment Questions' }
    ],
    rubric: [
      { criteria: 'Correct Solutions', points: 60 },
      { criteria: 'Methodology & Working', points: 25 },
      { criteria: 'Diagrams & Visuals', points: 10 },
      { criteria: 'Presentation', points: 5 }
    ]
  },
  {
    id: 9,
    title: 'Algebra Quiz 4',
    class: 'Mathematics Advanced',
    dueDate: '2025-10-25',
    dueTime: '9:30 AM',
    status: 'pending',
    priority: 'medium',
    weight: 10,
    totalPoints: 50,
    postedDate: 'Oct 17, 2025',
    submissionType: 'In-Class',
    description: 'Quick assessment on polynomial functions, factoring techniques, and solving quadratic equations. This 40-minute quiz will cover material from weeks 7-8.',
    instructions: [
      'Review polynomial division and factoring methods',
      'Practice completing the square and using quadratic formula',
      'Bring calculator and necessary materials',
      'No collaboration during the quiz',
      'Show all steps for maximum credit'
    ],
    requirements: [
      'Calculator (scientific or graphing)',
      'Pencil and eraser',
      'Arrive 5 minutes early',
      'Complete all 8 questions'
    ],
    resources: [
      { name: 'Polynomial Functions Review.pdf', type: 'Study Guide' },
      { name: 'Factoring Techniques Summary.pdf', type: 'Reference' },
      { name: 'Practice Quiz with Solutions.pdf', type: 'Practice Material' }
    ],
    rubric: [
      { criteria: 'Correct Answers', points: 36 },
      { criteria: 'Working Shown', points: 10 },
      { criteria: 'Mathematical Notation', points: 4 }
    ],
    hasQuestions: true,
    questions: [
      {
        id: 1,
        type: 'multiple-choice',
        points: 6,
        question: 'Factor completely: x² + 7x + 12',
        options: [
          { id: 'a', text: '(x + 3)(x + 4)', isCorrect: true },
          { id: 'b', text: '(x + 2)(x + 6)', isCorrect: false },
          { id: 'c', text: '(x + 1)(x + 12)', isCorrect: false },
          { id: 'd', text: '(x - 3)(x - 4)', isCorrect: false }
        ]
      },
      {
        id: 2,
        type: 'short-answer',
        points: 8,
        question: 'Solve the quadratic equation using the quadratic formula: 2x² - 5x - 3 = 0. Show all steps.'
      },
      {
        id: 3,
        type: 'multiple-choice',
        points: 5,
        question: 'What is the vertex of the parabola y = x² - 4x + 3?',
        options: [
          { id: 'a', text: '(2, -1)', isCorrect: true },
          { id: 'b', text: '(-2, 15)', isCorrect: false },
          { id: 'c', text: '(4, 3)', isCorrect: false },
          { id: 'd', text: '(0, 3)', isCorrect: false }
        ]
      },
      {
        id: 4,
        type: 'multiple-choice',
        points: 6,
        question: 'Which of the following is equivalent to (x + 2)²?',
        options: [
          { id: 'a', text: 'x² + 4', isCorrect: false },
          { id: 'b', text: 'x² + 2x + 4', isCorrect: false },
          { id: 'c', text: 'x² + 4x + 4', isCorrect: true },
          { id: 'd', text: 'x² + 4x + 2', isCorrect: false }
        ]
      },
      {
        id: 5,
        type: 'short-answer',
        points: 10,
        question: 'Complete the square to rewrite y = x² + 6x + 5 in vertex form. Show your working.'
      },
      {
        id: 6,
        type: 'multiple-choice',
        points: 5,
        question: 'How many real solutions does the equation x² + 4x + 5 = 0 have?',
        options: [
          { id: 'a', text: 'Two distinct real solutions', isCorrect: false },
          { id: 'b', text: 'One repeated real solution', isCorrect: false },
          { id: 'c', text: 'No real solutions', isCorrect: true },
          { id: 'd', text: 'Infinitely many solutions', isCorrect: false }
        ]
      },
      {
        id: 7,
        type: 'short-answer',
        points: 10,
        question: 'Factor completely: 3x² - 12x + 12. Show all steps of your factoring process.'
      }
    ]
  },
  {
    id: 10,
    title: 'Literary Comparison Essay',
    class: 'English Advanced',
    dueDate: '2025-11-02',
    dueTime: '11:59 PM',
    status: 'pending',
    priority: 'low',
    weight: 20,
    totalPoints: 100,
    postedDate: 'Oct 15, 2025',
    submissionType: 'Online',
    description: 'Compare and contrast the portrayal of ambition in Shakespeare\'s Macbeth and F. Scott Fitzgerald\'s The Great Gatsby. Analyze how each author uses literary techniques to develop this theme.',
    instructions: [
      'Write a 1200-1500 word comparative essay',
      'Use the point-by-point comparison method',
      'Include quotes from both texts (minimum 3 from each)',
      'Analyze literary techniques: symbolism, characterization, narrative voice',
      'Use MLA format for citations',
      'Include introduction, body paragraphs, and conclusion'
    ],
    requirements: [
      'Length: 1200-1500 words',
      'MLA format throughout',
      'Minimum 6 textual quotes',
      'Clear thesis statement',
      'Topic sentences for each paragraph',
      'Works Cited page'
    ],
    resources: [
      { name: 'Comparative Essay Structure Guide.pdf', type: 'Writing Guide' },
      { name: 'Macbeth - Key Quotes.pdf', type: 'Reference' },
      { name: 'Great Gatsby - Themes Analysis.pdf', type: 'Study Material' },
      { name: 'Sample Comparative Essays.pdf', type: 'Examples' }
    ],
    rubric: [
      { criteria: 'Thesis & Argument', points: 25 },
      { criteria: 'Comparative Analysis', points: 25 },
      { criteria: 'Use of Evidence', points: 20 },
      { criteria: 'Literary Technique Analysis', points: 15 },
      { criteria: 'Structure & Organization', points: 10 },
      { criteria: 'Grammar & MLA Format', points: 5 }
    ]
  }
]

export const recentGrades = [
  { assignment: 'Algebra Quiz 3', class: 'MATH-ADV', score: 95, maxScore: 100, grade: 'A' },
  { assignment: 'Poetry Analysis', class: 'ENG-ADV', score: 88, maxScore: 100, grade: 'B+' },
  { assignment: 'Newton\'s Laws Test', class: 'PHYS', score: 98, maxScore: 100, grade: 'A+' },
  { assignment: 'Organic Chemistry Quiz', class: 'CHEM', score: 92, maxScore: 100, grade: 'A' }
]

export const studyPlanSuggestions = [
  {
    id: 1,
    subject: 'Mathematics',
    topic: 'Integration Techniques',
    reason: 'Based on your recent quiz performance',
    duration: '2 hours',
    priority: 'high'
  },
  {
    id: 2,
    subject: 'English',
    topic: 'Literary Devices Review',
    reason: 'Upcoming essay due soon',
    duration: '1.5 hours',
    priority: 'medium'
  },
  {
    id: 3,
    subject: 'Physics',
    topic: 'Practice Problems - Momentum',
    reason: 'Strengthen your strongest subject',
    duration: '1 hour',
    priority: 'low'
  }
]

export const careerRecommendations = [
  {
    id: 1,
    career: 'Data Scientist',
    match: 95,
    reason: 'Excellent performance in Mathematics and strong analytical skills',
    averageSalary: '$120,000 - $180,000',
    growthRate: 'Very High'
  },
  {
    id: 2,
    career: 'Software Engineer',
    match: 92,
    reason: 'Strong problem-solving abilities and technical aptitude',
    averageSalary: '$100,000 - $160,000',
    growthRate: 'High'
  },
  {
    id: 3,
    career: 'Research Scientist',
    match: 88,
    reason: 'Outstanding performance in Physics and Chemistry',
    averageSalary: '$90,000 - $140,000',
    growthRate: 'Moderate'
  }
]

// Helper function
export const getDaysUntilDue = (dueDate) => {
  const today = new Date()
  const due = new Date(dueDate)
  const diffTime = due - today
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Due today'
  if (diffDays === 1) return 'Due tomorrow'
  if (diffDays < 0) return 'Overdue'
  return `${diffDays} days left`
}

