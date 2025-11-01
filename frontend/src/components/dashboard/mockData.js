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
    priority: 'high',
    profileEvidence: [
      'Your last Calculus quiz score was 72% - below your usual standard of 85%+',
      'Integration appeared in 4 of the 6 questions you got wrong',
      'Your study time for Mathematics has decreased by 30% this month',
      'You marked "Calculus" as a challenging topic in your profile'
    ],
    curriculumRules: [
      'HSC Mathematics Advanced requires mastery of integration for Section II',
      'Integration represents 25% of the final exam content',
      'This topic is a prerequisite for upcoming Differential Equations unit',
      'NESA curriculum standard MA-C3.1 requires fluency in integration methods'
    ],
    performanceData: [
      { label: 'Last Quiz', value: '72%', color: '#ed8936' },
      { label: 'Topic Average', value: '68%', color: '#f56565' },
      { label: 'Class Average', value: '78%', color: '#718096' },
      { label: 'Target Score', value: '85%', color: '#48bb78' }
    ],
    expectedOutcome: 'With 2 hours of focused practice on integration techniques, we expect your understanding to improve by approximately 15-20 percentage points. This will bring you back to your target performance level and prepare you for the upcoming assessment.'
  },
  {
    id: 2,
    subject: 'English',
    topic: 'Literary Devices Review',
    reason: 'Upcoming essay due soon',
    duration: '1.5 hours',
    priority: 'medium',
    profileEvidence: [
      'Essay "Analysis of Modernist Poetry" is due in 3 days',
      'Your essay drafts typically score 2-3 marks higher after literary device refinement',
      'You spent 45 minutes on this topic last week, but marked it as "needs more work"',
      'Your teacher\'s feedback emphasized "deeper analysis of literary techniques"'
    ],
    curriculumRules: [
      'HSC English Advanced outcome EA11-3 requires analysis of complex texts using literary terms',
      'Module B assessment criteria allocates 40% weighting to textual analysis',
      'NESA syllabus requires demonstration of understanding of authorial choices',
      'Literary devices are essential for Band 6 achievement in critical essays'
    ],
    performanceData: [
      { label: 'Last Essay', value: 'B+', color: '#48bb78' },
      { label: 'Literary Analysis', value: '18/25', color: '#ed8936' },
      { label: 'Target', value: 'A', color: '#667eea' }
    ],
    expectedOutcome: 'Reviewing literary devices before your essay submission will help you achieve stronger textual analysis. Based on your writing patterns, this revision typically results in 2-3 additional marks, potentially lifting your grade from B+ to A range.'
  },
  {
    id: 3,
    subject: 'Physics',
    topic: 'Practice Problems - Momentum',
    reason: 'Strengthen your strongest subject',
    duration: '1 hour',
    priority: 'low',
    profileEvidence: [
      'Physics is your highest-performing subject with 94% average',
      'You consistently excel in mechanics problems',
      'Last momentum test: 47/50 - only missed advanced application questions',
      'Your study goal includes "achieve 95%+ in Physics to boost ATAR"'
    ],
    curriculumRules: [
      'HSC Physics Module 4 - Momentum represents 15% of final exam',
      'Advanced momentum problems appear in Section II (complex scenarios)',
      'Mastery of momentum is required for university physics courses',
      'NESA outcome PH11/12-6 requires application of conservation laws to complex systems'
    ],
    performanceData: [
      { label: 'Current Average', value: '94%', color: '#48bb78' },
      { label: 'Last Test', value: '47/50', color: '#48bb78' },
      { label: 'Target', value: '95%+', color: '#667eea' }
    ],
    expectedOutcome: 'One hour of advanced momentum practice problems will help you master the complex application questions that currently challenge you. This focused practice can secure those final marks needed to consistently achieve 95%+, significantly boosting your ATAR contribution from Physics.'
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

// HSC Subjects data
export const hscSubjects = [
  {
    id: 1,
    code: 'MATH-ADV',
    name: 'Mathematics Advanced',
    category: 'Mathematics',
    units: 2,
    prerequisites: ['Mathematics Extension 1', 'Mathematics Extension 2'],
    description: 'Advanced mathematics covering calculus, algebra, and mathematical reasoning. This course prepares students for tertiary mathematics and develops critical thinking skills.',
    difficulty: 'High',
    popularity: 85,
    careerPaths: ['Engineering', 'Data Science', 'Actuarial Studies', 'Physics'],
    atarContribution: 'High',
    examType: 'Written',
    practicalWork: 'Minimal',
    recommendedFor: ['Students strong in algebra and problem-solving', 'Future STEM careers', 'University mathematics prerequisites']
  },
  {
    id: 2,
    code: 'MATH-EXT1',
    name: 'Mathematics Extension 1',
    category: 'Mathematics',
    units: 1,
    prerequisites: ['Mathematics Advanced'],
    description: 'Extension mathematics building on Advanced Mathematics. Covers advanced calculus, complex numbers, and mathematical proof techniques.',
    difficulty: 'Very High',
    popularity: 45,
    careerPaths: ['Engineering', 'Mathematics', 'Physics', 'Computer Science'],
    atarContribution: 'Very High',
    examType: 'Written',
    practicalWork: 'None',
    recommendedFor: ['Exceptional mathematics students', 'Future engineering/STEM careers', 'Students aiming for top universities']
  },
  {
    id: 3,
    code: 'MATH-EXT2',
    name: 'Mathematics Extension 2',
    category: 'Mathematics',
    units: 1,
    prerequisites: ['Mathematics Extension 1'],
    description: 'The highest level of HSC mathematics. Covers advanced topics including complex analysis, mechanics, and advanced calculus.',
    difficulty: 'Extreme',
    popularity: 15,
    careerPaths: ['Mathematics', 'Physics', 'Engineering', 'Actuarial Studies'],
    atarContribution: 'Very High',
    examType: 'Written',
    practicalWork: 'None',
    recommendedFor: ['Elite mathematics students', 'Future mathematicians/physicists', 'Students seeking maximum ATAR boost']
  },
  {
    id: 4,
    code: 'ENG-ADV',
    name: 'English Advanced',
    category: 'English',
    units: 2,
    prerequisites: ['English Standard'],
    description: 'Advanced study of literature, critical analysis, and sophisticated writing techniques. Focus on complex texts and analytical skills.',
    difficulty: 'High',
    popularity: 70,
    careerPaths: ['Law', 'Journalism', 'Literature', 'Communications'],
    atarContribution: 'High',
    examType: 'Written',
    practicalWork: 'None',
    recommendedFor: ['Strong readers and writers', 'Future humanities careers', 'Students with analytical thinking skills']
  },
  {
    id: 5,
    code: 'ENG-EXT1',
    name: 'English Extension 1',
    category: 'English',
    units: 1,
    prerequisites: ['English Advanced'],
    description: 'Extension English focusing on critical and creative responses to literature. Develops sophisticated analytical and creative writing skills.',
    difficulty: 'Very High',
    popularity: 25,
    careerPaths: ['Literature', 'Creative Writing', 'Journalism', 'Law'],
    atarContribution: 'Very High',
    examType: 'Written',
    practicalWork: 'None',
    recommendedFor: ['Exceptional English students', 'Future writers/editors', 'Students with strong creative abilities']
  },
  {
    id: 6,
    code: 'PHYS',
    name: 'Physics',
    category: 'Sciences',
    units: 2,
    prerequisites: ['Mathematics Advanced'],
    description: 'Study of matter, energy, and their interactions. Covers mechanics, thermodynamics, waves, and electromagnetism with practical laboratory work.',
    difficulty: 'High',
    popularity: 60,
    careerPaths: ['Engineering', 'Physics', 'Medicine', 'Research'],
    atarContribution: 'High',
    examType: 'Written + Practical',
    practicalWork: 'Extensive',
    recommendedFor: ['Students strong in mathematics', 'Future STEM careers', 'Students interested in how things work']
  },
  {
    id: 7,
    code: 'CHEM',
    name: 'Chemistry',
    category: 'Sciences',
    units: 2,
    prerequisites: ['Mathematics Standard 2'],
    description: 'Study of matter, chemical reactions, and molecular structures. Includes organic chemistry, thermodynamics, and laboratory work.',
    difficulty: 'High',
    popularity: 55,
    careerPaths: ['Medicine', 'Pharmacy', 'Chemical Engineering', 'Research'],
    atarContribution: 'High',
    examType: 'Written + Practical',
    practicalWork: 'Extensive',
    recommendedFor: ['Students interested in medicine', 'Future science careers', 'Students with good mathematical skills']
  },
  {
    id: 8,
    code: 'BIO',
    name: 'Biology',
    category: 'Sciences',
    units: 2,
    prerequisites: ['Chemistry recommended'],
    description: 'Study of living organisms, genetics, evolution, and ecology. Includes practical work and field studies.',
    difficulty: 'Medium',
    popularity: 65,
    careerPaths: ['Medicine', 'Veterinary Science', 'Biotechnology', 'Environmental Science'],
    atarContribution: 'Medium',
    examType: 'Written + Practical',
    practicalWork: 'Moderate',
    recommendedFor: ['Students interested in living things', 'Future medical careers', 'Students with good memory skills']
  },
  {
    id: 9,
    code: 'HIST-MOD',
    name: 'Modern History',
    category: 'Humanities',
    units: 2,
    prerequisites: ['None'],
    description: 'Study of major events and developments from 1750 to present. Focus on historical analysis, research skills, and critical thinking.',
    difficulty: 'Medium',
    popularity: 40,
    careerPaths: ['Law', 'Politics', 'Journalism', 'Education'],
    atarContribution: 'Medium',
    examType: 'Written',
    practicalWork: 'None',
    recommendedFor: ['Students interested in current events', 'Future humanities careers', 'Students with analytical thinking']
  },
  {
    id: 10,
    code: 'GEO',
    name: 'Geography',
    category: 'Humanities',
    units: 2,
    prerequisites: ['None'],
    description: 'Study of Earth\'s physical and human environments. Includes fieldwork, data analysis, and environmental issues.',
    difficulty: 'Medium',
    popularity: 35,
    careerPaths: ['Environmental Science', 'Urban Planning', 'International Relations', 'Tourism'],
    atarContribution: 'Medium',
    examType: 'Written + Fieldwork',
    practicalWork: 'Moderate',
    recommendedFor: ['Students interested in the environment', 'Future planning careers', 'Students who enjoy fieldwork']
  },
  {
    id: 11,
    code: 'ECON',
    name: 'Economics',
    category: 'Business',
    units: 2,
    prerequisites: ['Mathematics Standard 2 recommended'],
    description: 'Study of how societies use resources. Covers microeconomics, macroeconomics, and economic policy analysis.',
    difficulty: 'Medium',
    popularity: 30,
    careerPaths: ['Business', 'Finance', 'Government', 'International Relations'],
    atarContribution: 'Medium',
    examType: 'Written',
    practicalWork: 'Minimal',
    recommendedFor: ['Students interested in business', 'Future economics careers', 'Students with analytical skills']
  },
  {
    id: 12,
    code: 'BUS-STUD',
    name: 'Business Studies',
    category: 'Business',
    units: 2,
    prerequisites: ['None'],
    description: 'Study of business operations, management, marketing, and finance. Includes case studies and practical business scenarios.',
    difficulty: 'Low',
    popularity: 50,
    careerPaths: ['Business Management', 'Marketing', 'Entrepreneurship', 'Finance'],
    atarContribution: 'Low',
    examType: 'Written',
    practicalWork: 'Minimal',
    recommendedFor: ['Students interested in business', 'Future entrepreneurs', 'Students with practical thinking']
  },
  {
    id: 13,
    code: 'PDHPE',
    name: 'PDHPE',
    category: 'Health',
    units: 2,
    prerequisites: ['None'],
    description: 'Study of health, physical activity, and personal development. Covers anatomy, physiology, and health promotion.',
    difficulty: 'Low',
    popularity: 45,
    careerPaths: ['Physiotherapy', 'Sports Science', 'Health Promotion', 'Education'],
    atarContribution: 'Low',
    examType: 'Written + Practical',
    practicalWork: 'Moderate',
    recommendedFor: ['Students interested in health', 'Future health careers', 'Students who enjoy physical activity']
  },
  {
    id: 14,
    code: 'VIS-ART',
    name: 'Visual Arts',
    category: 'Creative Arts',
    units: 2,
    prerequisites: ['None'],
    description: 'Study of art history, theory, and practice. Includes creating artworks and analyzing artistic movements.',
    difficulty: 'Medium',
    popularity: 25,
    careerPaths: ['Fine Arts', 'Design', 'Art Education', 'Museum Studies'],
    atarContribution: 'Low',
    examType: 'Written + Practical',
    practicalWork: 'Extensive',
    recommendedFor: ['Creative students', 'Future artists/designers', 'Students with artistic ability']
  },
  {
    id: 15,
    code: 'MUS',
    name: 'Music',
    category: 'Creative Arts',
    units: 2,
    prerequisites: ['Music experience recommended'],
    description: 'Study of music theory, history, and performance. Includes composition, analysis, and performance skills.',
    difficulty: 'Medium',
    popularity: 20,
    careerPaths: ['Music Performance', 'Music Education', 'Sound Engineering', 'Music Therapy'],
    atarContribution: 'Low',
    examType: 'Written + Performance',
    practicalWork: 'Extensive',
    recommendedFor: ['Musical students', 'Future musicians', 'Students with performance skills']
  },
  {
    id: 16,
    code: 'LANG-FR',
    name: 'French',
    category: 'Languages',
    units: 2,
    prerequisites: ['French Continuers or equivalent'],
    description: 'Advanced study of French language and culture. Focus on communication, literature, and cultural understanding.',
    difficulty: 'High',
    popularity: 15,
    careerPaths: ['International Relations', 'Translation', 'Tourism', 'Education'],
    atarContribution: 'Medium',
    examType: 'Written + Oral',
    practicalWork: 'Moderate',
    recommendedFor: ['Students with French background', 'Future international careers', 'Students interested in languages']
  },
  {
    id: 17,
    code: 'LANG-JP',
    name: 'Japanese',
    category: 'Languages',
    units: 2,
    prerequisites: ['Japanese Continuers or equivalent'],
    description: 'Advanced study of Japanese language and culture. Includes kanji, grammar, and cultural studies.',
    difficulty: 'High',
    popularity: 20,
    careerPaths: ['International Business', 'Translation', 'Tourism', 'Education'],
    atarContribution: 'Medium',
    examType: 'Written + Oral',
    practicalWork: 'Moderate',
    recommendedFor: ['Students with Japanese background', 'Future Asia-focused careers', 'Students interested in Japanese culture']
  },
  {
    id: 18,
    code: 'COMP-SCI',
    name: 'Software Design and Development',
    category: 'Technology',
    units: 2,
    prerequisites: ['Mathematics Standard 2 recommended'],
    description: 'Study of software development, programming, and computer systems. Includes practical programming projects.',
    difficulty: 'High',
    popularity: 40,
    careerPaths: ['Software Engineering', 'Computer Science', 'Information Technology', 'Game Development'],
    atarContribution: 'Medium',
    examType: 'Written + Practical',
    practicalWork: 'Extensive',
    recommendedFor: ['Students interested in technology', 'Future IT careers', 'Students with logical thinking']
  },
  {
    id: 19,
    code: 'ENG-STUD',
    name: 'Engineering Studies',
    category: 'Technology',
    units: 2,
    prerequisites: ['Mathematics Advanced', 'Physics recommended'],
    description: 'Study of engineering principles, materials, and systems. Includes practical engineering projects and analysis.',
    difficulty: 'Very High',
    popularity: 25,
    careerPaths: ['Engineering', 'Architecture', 'Manufacturing', 'Research'],
    atarContribution: 'High',
    examType: 'Written + Practical',
    practicalWork: 'Extensive',
    recommendedFor: ['Future engineers', 'Students strong in mathematics and physics', 'Students interested in problem-solving']
  },
  {
    id: 20,
    code: 'LEG-STUD',
    name: 'Legal Studies',
    category: 'Humanities',
    units: 2,
    prerequisites: ['None'],
    description: 'Study of law, legal systems, and justice. Covers criminal law, civil law, and legal processes.',
    difficulty: 'Medium',
    popularity: 35,
    careerPaths: ['Law', 'Politics', 'Criminology', 'Social Work'],
    atarContribution: 'Medium',
    examType: 'Written',
    practicalWork: 'Minimal',
    recommendedFor: ['Future lawyers', 'Students interested in justice', 'Students with analytical skills']
  },
  {
    id: 21,
    code: 'MATH-STD1',
    name: 'Mathematics Standard 1',
    category: 'Mathematics',
    units: 2,
    prerequisites: ['None'],
    description: 'Foundation mathematics focusing on practical applications. Covers financial mathematics, data, measurement, and algebra.',
    difficulty: 'Low',
    popularity: 40,
    careerPaths: ['Business', 'Trades', 'Retail', 'Service Industries'],
    atarContribution: 'Low',
    examType: 'Written',
    practicalWork: 'Minimal',
    recommendedFor: ['Students seeking practical mathematics', 'Future vocational careers', 'Students preferring applied mathematics']
  },
  {
    id: 22,
    code: 'MATH-STD2',
    name: 'Mathematics Standard 2',
    category: 'Mathematics',
    units: 2,
    prerequisites: ['None'],
    description: 'General mathematics with broader applications. Covers statistics, networks, financial mathematics, and calculus introduction.',
    difficulty: 'Medium',
    popularity: 60,
    careerPaths: ['Business', 'Health Sciences', 'Social Sciences', 'Education'],
    atarContribution: 'Medium',
    examType: 'Written',
    practicalWork: 'Minimal',
    recommendedFor: ['Students needing mathematics for university', 'Future business careers', 'Students with moderate mathematics ability']
  },
  {
    id: 23,
    code: 'ENG-STD',
    name: 'English Standard',
    category: 'English',
    units: 2,
    prerequisites: ['None'],
    description: 'Foundation English focusing on communication and comprehension. Covers texts, writing, and language analysis.',
    difficulty: 'Medium',
    popularity: 75,
    careerPaths: ['Business', 'Communications', 'Education', 'Service Industries'],
    atarContribution: 'Medium',
    examType: 'Written',
    practicalWork: 'None',
    recommendedFor: ['Students developing literacy skills', 'Future general careers', 'Students preferring practical English']
  },
  {
    id: 24,
    code: 'ENG-EXT2',
    name: 'English Extension 2',
    category: 'English',
    units: 1,
    prerequisites: ['English Extension 1'],
    description: 'Highest level of English study focusing on independent major work. Students produce a substantial creative or critical piece.',
    difficulty: 'Extreme',
    popularity: 10,
    careerPaths: ['Creative Writing', 'Literature', 'Publishing', 'Academia'],
    atarContribution: 'Very High',
    examType: 'Major Work + Reflection',
    practicalWork: 'Extensive',
    recommendedFor: ['Elite English students', 'Future authors/critics', 'Students with exceptional creative abilities']
  },
  {
    id: 25,
    code: 'HIST-ANC',
    name: 'Ancient History',
    category: 'Humanities',
    units: 2,
    prerequisites: ['None'],
    description: 'Study of ancient civilizations including Greece, Rome, Egypt, and Near East. Focus on archaeology, sources, and historical inquiry.',
    difficulty: 'Medium',
    popularity: 30,
    careerPaths: ['Archaeology', 'Museum Studies', 'Education', 'History'],
    atarContribution: 'Medium',
    examType: 'Written',
    practicalWork: 'None',
    recommendedFor: ['Students interested in ancient cultures', 'Future historians', 'Students with analytical skills']
  },
  {
    id: 26,
    code: 'DRAMA',
    name: 'Drama',
    category: 'Creative Arts',
    units: 2,
    prerequisites: ['None'],
    description: 'Study and practice of dramatic performance and production. Includes acting, directing, design, and dramatic analysis.',
    difficulty: 'Medium',
    popularity: 20,
    careerPaths: ['Acting', 'Theatre Production', 'Entertainment', 'Education'],
    atarContribution: 'Low',
    examType: 'Performance + Written',
    practicalWork: 'Extensive',
    recommendedFor: ['Creative students', 'Future performers', 'Students with performance skills']
  },
  {
    id: 27,
    code: 'DES-TECH',
    name: 'Design and Technology',
    category: 'Technology',
    units: 2,
    prerequisites: ['None'],
    description: 'Design, development, and construction of quality projects. Covers design theory, materials, and practical making skills.',
    difficulty: 'Medium',
    popularity: 25,
    careerPaths: ['Industrial Design', 'Product Design', 'Architecture', 'Engineering'],
    atarContribution: 'Medium',
    examType: 'Major Project + Written',
    practicalWork: 'Extensive',
    recommendedFor: ['Creative and technical students', 'Future designers', 'Students who enjoy making things']
  },
  {
    id: 28,
    code: 'IPT',
    name: 'Information Processes and Technology',
    category: 'Technology',
    units: 2,
    prerequisites: ['None'],
    description: 'Study of information systems, databases, and technology. Covers system analysis, project management, and social/ethical issues.',
    difficulty: 'Medium',
    popularity: 30,
    careerPaths: ['IT Management', 'Systems Analysis', 'Database Administration', 'Business Analysis'],
    atarContribution: 'Medium',
    examType: 'Written + Project',
    practicalWork: 'Moderate',
    recommendedFor: ['Students interested in IT', 'Future tech careers', 'Students with problem-solving skills']
  },
  {
    id: 29,
    code: 'SOC-CUL',
    name: 'Society and Culture',
    category: 'Humanities',
    units: 2,
    prerequisites: ['None'],
    description: 'Study of social and cultural processes. Covers research methods, social theories, and contemporary issues. Includes Personal Interest Project (PIP).',
    difficulty: 'Medium',
    popularity: 35,
    careerPaths: ['Social Work', 'Sociology', 'Community Services', 'Research'],
    atarContribution: 'Medium',
    examType: 'Written + Major Project',
    practicalWork: 'Moderate',
    recommendedFor: ['Students interested in society', 'Future social sciences', 'Students with research skills']
  },
  {
    id: 30,
    code: 'LANG-CH',
    name: 'Chinese',
    category: 'Languages',
    units: 2,
    prerequisites: ['Chinese Continuers or equivalent'],
    description: 'Advanced study of Chinese language and culture. Focus on communication, literature, and cultural understanding.',
    difficulty: 'High',
    popularity: 35,
    careerPaths: ['International Business', 'Translation', 'Diplomacy', 'Education'],
    atarContribution: 'Medium',
    examType: 'Written + Oral',
    practicalWork: 'Moderate',
    recommendedFor: ['Students with Chinese background', 'Future Asia-focused careers', 'Students interested in languages']
  },
  {
    id: 31,
    code: 'LANG-ES',
    name: 'Spanish',
    category: 'Languages',
    units: 2,
    prerequisites: ['Spanish Continuers or equivalent'],
    description: 'Advanced study of Spanish language and culture. Focus on communication, literature, and cultural understanding.',
    difficulty: 'High',
    popularity: 15,
    careerPaths: ['International Relations', 'Translation', 'Tourism', 'Education'],
    atarContribution: 'Medium',
    examType: 'Written + Oral',
    practicalWork: 'Moderate',
    recommendedFor: ['Students with Spanish background', 'Future international careers', 'Students interested in languages']
  },
  {
    id: 32,
    code: 'LANG-DE',
    name: 'German',
    category: 'Languages',
    units: 2,
    prerequisites: ['German Continuers or equivalent'],
    description: 'Advanced study of German language and culture. Focus on communication, literature, and cultural understanding.',
    difficulty: 'High',
    popularity: 10,
    careerPaths: ['International Business', 'Translation', 'European Relations', 'Education'],
    atarContribution: 'Medium',
    examType: 'Written + Oral',
    practicalWork: 'Moderate',
    recommendedFor: ['Students with German background', 'Future European careers', 'Students interested in languages']
  },
  {
    id: 33,
    code: 'FOOD-TECH',
    name: 'Food Technology',
    category: 'Technology',
    units: 2,
    prerequisites: ['None'],
    description: 'Study of food production, nutrition, and food science. Includes practical food preparation and product development.',
    difficulty: 'Medium',
    popularity: 30,
    careerPaths: ['Food Science', 'Nutrition', 'Hospitality', 'Product Development'],
    atarContribution: 'Low',
    examType: 'Written + Practical',
    practicalWork: 'Extensive',
    recommendedFor: ['Students interested in food', 'Future hospitality careers', 'Students with practical skills']
  },
  {
    id: 34,
    code: 'TEXTILES',
    name: 'Textiles and Design',
    category: 'Creative Arts',
    units: 2,
    prerequisites: ['None'],
    description: 'Study of textile design, construction, and fashion. Includes major design project and historical/cultural study of textiles.',
    difficulty: 'Medium',
    popularity: 15,
    careerPaths: ['Fashion Design', 'Textile Design', 'Costume Design', 'Product Design'],
    atarContribution: 'Low',
    examType: 'Major Project + Written',
    practicalWork: 'Extensive',
    recommendedFor: ['Creative students', 'Future fashion designers', 'Students with design skills']
  },
  {
    id: 35,
    code: 'AGRI',
    name: 'Agriculture',
    category: 'Sciences',
    units: 2,
    prerequisites: ['None'],
    description: 'Study of agricultural production, resource management, and sustainable farming. Includes practical farm work.',
    difficulty: 'Medium',
    popularity: 20,
    careerPaths: ['Agriculture', 'Farm Management', 'Environmental Science', 'Rural Industries'],
    atarContribution: 'Medium',
    examType: 'Written + Practical',
    practicalWork: 'Extensive',
    recommendedFor: ['Students interested in farming', 'Future agricultural careers', 'Students from rural backgrounds']
  },
  {
    id: 36,
    code: 'EARTH-ENV',
    name: 'Earth and Environmental Science',
    category: 'Sciences',
    units: 2,
    prerequisites: ['None'],
    description: 'Study of Earth\'s systems, geology, and environmental processes. Includes fieldwork and environmental analysis.',
    difficulty: 'Medium',
    popularity: 25,
    careerPaths: ['Environmental Science', 'Geology', 'Mining', 'Conservation'],
    atarContribution: 'Medium',
    examType: 'Written + Practical',
    practicalWork: 'Moderate',
    recommendedFor: ['Students interested in environment', 'Future environmental careers', 'Students who enjoy fieldwork']
  },
  {
    id: 37,
    code: 'INVES-SCI',
    name: 'Investigating Science',
    category: 'Sciences',
    units: 2,
    prerequisites: ['None'],
    description: 'Practical scientific investigation and research. Focus on scientific methods, inquiry, and independent research projects.',
    difficulty: 'Medium',
    popularity: 20,
    careerPaths: ['Research', 'Science', 'Education', 'Laboratory Work'],
    atarContribution: 'Medium',
    examType: 'Written + Practical',
    practicalWork: 'Extensive',
    recommendedFor: ['Students interested in research', 'Future scientists', 'Students with investigative skills']
  },
  {
    id: 38,
    code: 'LANG-IT',
    name: 'Italian',
    category: 'Languages',
    units: 2,
    prerequisites: ['Italian Continuers or equivalent'],
    description: 'Advanced study of Italian language and culture. Focus on communication, literature, and cultural understanding.',
    difficulty: 'High',
    popularity: 10,
    careerPaths: ['International Relations', 'Translation', 'Tourism', 'Education'],
    atarContribution: 'Medium',
    examType: 'Written + Oral',
    practicalWork: 'Moderate',
    recommendedFor: ['Students with Italian background', 'Future European careers', 'Students interested in languages']
  },
  {
    id: 39,
    code: 'LANG-KO',
    name: 'Korean',
    category: 'Languages',
    units: 2,
    prerequisites: ['Korean Continuers or equivalent'],
    description: 'Advanced study of Korean language and culture. Focus on communication, literature, and cultural understanding.',
    difficulty: 'High',
    popularity: 15,
    careerPaths: ['International Business', 'Translation', 'K-Culture Industries', 'Education'],
    atarContribution: 'Medium',
    examType: 'Written + Oral',
    practicalWork: 'Moderate',
    recommendedFor: ['Students with Korean background', 'Future Asia-focused careers', 'Students interested in Korean culture']
  },
  {
    id: 40,
    code: 'DANCE',
    name: 'Dance',
    category: 'Creative Arts',
    units: 2,
    prerequisites: ['None'],
    description: 'Study and practice of dance performance, composition, and appreciation. Includes various dance styles and choreography.',
    difficulty: 'Medium',
    popularity: 15,
    careerPaths: ['Dance Performance', 'Choreography', 'Dance Education', 'Entertainment'],
    atarContribution: 'Low',
    examType: 'Performance + Written',
    practicalWork: 'Extensive',
    recommendedFor: ['Students with dance experience', 'Future performers', 'Students with physical aptitude']
  }
]

// Study Plan data model
export const studyPlan = {
  id: 1,
  studentId: 'STU2025001',
  name: 'My HSC Study Plan',
  totalUnits: 0,
  maxUnits: 10,
  subjects: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}

// Helper functions for study plan
export const addSubjectToPlan = (plan, subject) => {
  const newTotalUnits = plan.totalUnits + subject.units
  
  // Check unit limit
  if (newTotalUnits > plan.maxUnits) {
    return {
      success: false,
      error: `Adding this subject would exceed the maximum ${plan.maxUnits} units limit. Current: ${plan.totalUnits} units, Subject: ${subject.units} units, Total would be: ${newTotalUnits} units`
    }
  }
  
  // Check if subject already exists
  if (plan.subjects.some(s => s.id === subject.id)) {
    return {
      success: false,
      error: 'This subject is already in your study plan'
    }
  }
  
  // Check for conflicts (prerequisites)
  const conflicts = checkPrerequisiteConflicts(plan, subject)
  if (conflicts.length > 0) {
    return {
      success: false,
      error: `Prerequisite conflicts: ${conflicts.join(', ')}`
    }
  }
  
  const updatedPlan = {
    ...plan,
    subjects: [...plan.subjects, subject],
    totalUnits: newTotalUnits,
    updatedAt: new Date().toISOString()
  }
  
  return {
    success: true,
    plan: updatedPlan
  }
}

export const removeSubjectFromPlan = (plan, subjectId) => {
  const subject = plan.subjects.find(s => s.id === subjectId)
  if (!subject) {
    return {
      success: false,
      error: 'Subject not found in study plan'
    }
  }
  
  const updatedPlan = {
    ...plan,
    subjects: plan.subjects.filter(s => s.id !== subjectId),
    totalUnits: plan.totalUnits - subject.units,
    updatedAt: new Date().toISOString()
  }
  
  return {
    success: true,
    plan: updatedPlan
  }
}

export const checkPrerequisiteConflicts = (plan, subject) => {
  const conflicts = []
  
  // Check if any existing subjects in the plan are prerequisites for the new subject
  const missingPrereqs = []
  subject.prerequisites.forEach(prereq => {
    if (prereq !== 'None' && !plan.subjects.some(s => s.name === prereq)) {
      missingPrereqs.push(prereq)
    }
  })
  
  // If there are missing prerequisites, create a comprehensive error message
  if (missingPrereqs.length > 0) {
    if (missingPrereqs.length === 1) {
      conflicts.push(`Prerequisite conflict: ${subject.name} requires ${missingPrereqs[0]} but it's not in your plan`)
    } else if (missingPrereqs.length === 2) {
      conflicts.push(`Prerequisite conflicts: ${subject.name} requires ${missingPrereqs[0]} and ${missingPrereqs[1]} but they're not in your plan`)
    } else {
      conflicts.push(`Prerequisite conflicts: ${subject.name} requires ${missingPrereqs.slice(0, -1).join(', ')}, and ${missingPrereqs[missingPrereqs.length - 1]} but they're not in your plan`)
    }
  }
  
  // Check if the new subject is a prerequisite for any existing subjects
  plan.subjects.forEach(existingSubject => {
    if (existingSubject.prerequisites.includes(subject.name)) {
      conflicts.push(`${existingSubject.name} requires ${subject.name} as a prerequisite`)
    }
  })
  
  return conflicts
}

export const getPlanWarnings = (plan) => {
  const warnings = []
  
  // Check if plan is empty
  if (plan.subjects.length === 0) {
    warnings.push('Your study plan is empty. Consider adding subjects to build your HSC lineup.')
  }
  
  // Check if approaching unit limit
  if (plan.totalUnits >= plan.maxUnits * 0.8) {
    warnings.push(`You're using ${plan.totalUnits}/${plan.maxUnits} units. Consider your remaining unit allocation carefully.`)
  }
  
  // Check for missing prerequisites - collect all missing prerequisites for each subject
  plan.subjects.forEach(subject => {
    const missingPrereqs = []
    subject.prerequisites.forEach(prereq => {
      if (prereq !== 'None' && !plan.subjects.some(s => s.name === prereq)) {
        missingPrereqs.push(prereq)
      }
    })
    
    if (missingPrereqs.length > 0) {
      if (missingPrereqs.length === 1) {
        warnings.push(`${subject.name} requires ${missingPrereqs[0]} as a prerequisite`)
      } else if (missingPrereqs.length === 2) {
        warnings.push(`${subject.name} requires ${missingPrereqs[0]} and ${missingPrereqs[1]} as prerequisites`)
      } else {
        warnings.push(`${subject.name} requires ${missingPrereqs.slice(0, -1).join(', ')}, and ${missingPrereqs[missingPrereqs.length - 1]} as prerequisites`)
      }
    }
  })
  
  // Check for subject category balance
  const categories = {}
  plan.subjects.forEach(subject => {
    categories[subject.category] = (categories[subject.category] || 0) + 1
  })
  
  if (Object.keys(categories).length < 2) {
    warnings.push('Consider diversifying your subject selection across different categories')
  }
  
  return warnings
}

// Weekly Report data and functions
export const weeklyStudyData = {
  week: 'Week 8 (Oct 15-21, 2025)',
  totalStudyTime: 28.5, // hours
  studySessions: 12,
  averageSessionLength: 2.4, // hours
  subjects: [
    {
      name: 'Mathematics Advanced',
      studyTime: 8.5,
      sessions: 4,
      lastStudied: '2025-10-20',
      topics: ['Integration', 'Trigonometry', 'Calculus'],
      difficulty: 'High',
      progress: 75
    },
    {
      name: 'English Advanced',
      studyTime: 6.0,
      sessions: 3,
      lastStudied: '2025-10-19',
      topics: ['Shakespeare Analysis', 'Essay Writing', 'Literary Devices'],
      difficulty: 'Medium',
      progress: 68
    },
    {
      name: 'Physics',
      studyTime: 7.0,
      sessions: 3,
      lastStudied: '2025-10-21',
      topics: ['Mechanics', 'Thermodynamics', 'Waves'],
      difficulty: 'High',
      progress: 82
    },
    {
      name: 'Chemistry',
      studyTime: 4.5,
      sessions: 2,
      lastStudied: '2025-10-18',
      topics: ['Organic Chemistry', 'Chemical Equilibrium'],
      difficulty: 'High',
      progress: 71
    },
    {
      name: 'Biology',
      studyTime: 2.5,
      sessions: 1,
      lastStudied: '2025-10-17',
      topics: ['Genetics', 'Evolution'],
      difficulty: 'Medium',
      progress: 65
    }
  ],
  assignments: [
    {
      subject: 'Mathematics Advanced',
      title: 'Calculus Problem Set 5',
      dueDate: '2025-10-18',
      timeSpent: 3.5,
      status: 'completed',
      grade: 'A'
    },
    {
      subject: 'English Advanced',
      title: 'Essay: Shakespeare Analysis',
      dueDate: '2025-10-20',
      timeSpent: 4.0,
      status: 'completed',
      grade: 'B+'
    },
    {
      subject: 'Physics',
      title: 'Lab Report: Thermodynamics',
      dueDate: '2025-10-22',
      timeSpent: 2.0,
      status: 'in-progress',
      grade: null
    }
  ],
  upcomingDeadlines: [
    {
      subject: 'Chemistry',
      title: 'Organic Chemistry Quiz',
      dueDate: '2025-10-26',
      priority: 'high'
    },
    {
      subject: 'Mathematics Advanced',
      title: 'Algebra Quiz 4',
      dueDate: '2025-10-25',
      priority: 'medium'
    },
    {
      subject: 'English Advanced',
      title: 'Poetry Creative Writing Project',
      dueDate: '2025-10-28',
      priority: 'medium'
    }
  ]
}

// Helper functions for weekly report
export const getTopFocusAreas = (studyData) => {
  // Sort subjects by study time and identify areas needing attention
  const sortedSubjects = studyData.subjects
    .sort((a, b) => a.studyTime - b.studyTime) // Least studied first
    .slice(0, 3)
  
  return sortedSubjects.map(subject => ({
    subject: subject.name,
    reason: `Only ${subject.studyTime} hours studied this week`,
    recommendation: `Increase study time to at least 6 hours per week`,
    priority: subject.studyTime < 3 ? 'High' : subject.studyTime < 5 ? 'Medium' : 'Low'
  }))
}

export const getStudyTimeSummary = (studyData) => {
  const totalTime = studyData.totalStudyTime
  const targetTime = 30 // hours per week
  const efficiency = (totalTime / studyData.studySessions).toFixed(1)
  
  return {
    totalHours: totalTime,
    targetHours: targetTime,
    completionRate: Math.round((totalTime / targetTime) * 100),
    averageSession: efficiency,
    recommendation: totalTime < targetTime * 0.8 
      ? 'Consider increasing your study time to meet weekly targets'
      : totalTime > targetTime * 1.2
      ? 'Great job! You\'re exceeding your study targets'
      : 'Good study balance! Keep up the consistent effort'
  }
}

export const getWeeklyInsights = (studyData) => {
  const insights = []
  
  // Study consistency
  const dailyAverage = studyData.totalStudyTime / 7
  if (dailyAverage < 3) {
    insights.push({
      type: 'warning',
      title: 'Study Consistency',
      message: 'Consider spreading your study time more evenly across the week'
    })
  }
  
  // Subject balance
  const subjectTimes = studyData.subjects.map(s => s.studyTime)
  const maxTime = Math.max(...subjectTimes)
  const minTime = Math.min(...subjectTimes)
  
  if (maxTime - minTime > 5) {
    insights.push({
      type: 'info',
      title: 'Subject Balance',
      message: 'Some subjects are getting significantly more attention than others'
    })
  }
  
  // Upcoming deadlines
  const urgentDeadlines = studyData.upcomingDeadlines.filter(d => d.priority === 'high')
  if (urgentDeadlines.length > 0) {
    insights.push({
      type: 'urgent',
      title: 'Upcoming Deadlines',
      message: `${urgentDeadlines.length} high-priority assignments due soon`
    })
  }
  
  return insights
}

export const generateWeeklyReport = (studyData) => {
  const topFocusAreas = getTopFocusAreas(studyData)
  const studySummary = getStudyTimeSummary(studyData)
  const insights = getWeeklyInsights(studyData)
  
  return {
    week: studyData.week,
    topFocusAreas,
    studySummary,
    insights,
    subjects: studyData.subjects,
    assignments: studyData.assignments,
    upcomingDeadlines: studyData.upcomingDeadlines,
    generatedAt: new Date().toISOString()
  }
}

// Incorrect Questions Data and Functions
export const incorrectQuestions = [
  {
    id: 1,
    question: "Solve for x: 2x + 5 = 13",
    correctAnswer: "x = 4",
    studentAnswer: "x = 3",
    explanation: "To solve this equation, subtract 5 from both sides: 2x = 8, then divide by 2: x = 4",
    topic: "Linear Equations",
    subject: "Mathematics Advanced",
    difficulty: "Easy",
    dateAnswered: "2025-10-15",
    assignment: "Algebra Quiz 3",
    reviewCount: 0,
    lastReviewed: null,
    nextReviewDate: null,
    masteryLevel: "Needs Review"
  },
  {
    id: 2,
    question: "What is the derivative of x² + 3x + 2?",
    correctAnswer: "2x + 3",
    studentAnswer: "x + 3",
    explanation: "The derivative of x² is 2x, and the derivative of 3x is 3. The derivative of a constant (2) is 0.",
    topic: "Calculus",
    subject: "Mathematics Advanced",
    difficulty: "Medium",
    dateAnswered: "2025-10-12",
    assignment: "Calculus Problem Set 2",
    reviewCount: 1,
    lastReviewed: "2025-10-18",
    nextReviewDate: "2025-10-25",
    masteryLevel: "Learning"
  },
  {
    id: 3,
    question: "Identify the literary device in: 'The stars danced playfully in the moonlit sky.'",
    correctAnswer: "Personification",
    studentAnswer: "Metaphor",
    explanation: "Personification gives human characteristics to non-human things. Stars cannot literally dance, so this is personification.",
    topic: "Literary Devices",
    subject: "English Advanced",
    difficulty: "Medium",
    dateAnswered: "2025-10-10",
    assignment: "Literary Analysis Quiz",
    reviewCount: 2,
    lastReviewed: "2025-10-20",
    nextReviewDate: "2025-10-27",
    masteryLevel: "Practicing"
  },
  {
    id: 4,
    question: "Calculate the force required to accelerate a 5kg object at 3 m/s²",
    correctAnswer: "15 N",
    studentAnswer: "8 N",
    explanation: "Using F = ma, F = 5kg × 3 m/s² = 15 N",
    topic: "Newton's Laws",
    subject: "Physics",
    difficulty: "Easy",
    dateAnswered: "2025-10-08",
    assignment: "Physics Quiz 4",
    reviewCount: 0,
    lastReviewed: null,
    nextReviewDate: null,
    masteryLevel: "Needs Review"
  },
  {
    id: 5,
    question: "What is the pH of a 0.1 M HCl solution?",
    correctAnswer: "1",
    studentAnswer: "2",
    explanation: "HCl is a strong acid that completely dissociates. pH = -log[H⁺] = -log(0.1) = 1",
    topic: "Acids and Bases",
    subject: "Chemistry",
    difficulty: "Medium",
    dateAnswered: "2025-10-05",
    assignment: "Chemistry Test 2",
    reviewCount: 1,
    lastReviewed: "2025-10-19",
    nextReviewDate: "2025-10-26",
    masteryLevel: "Learning"
  },
  {
    id: 6,
    question: "What is the probability of rolling a 6 on a fair die?",
    correctAnswer: "1/6",
    studentAnswer: "1/3",
    explanation: "A fair die has 6 faces, only one shows 6. Probability = 1/6",
    topic: "Probability",
    subject: "Mathematics Advanced",
    difficulty: "Easy",
    dateAnswered: "2025-10-03",
    assignment: "Statistics Quiz",
    reviewCount: 3,
    lastReviewed: "2025-10-21",
    nextReviewDate: "2025-11-04",
    masteryLevel: "Mastered"
  }
]

// Helper functions for incorrect questions
export const getQuestionsByTopic = (topic) => {
  return incorrectQuestions.filter(q => q.topic === topic)
}

export const getQuestionsBySubject = (subject) => {
  return incorrectQuestions.filter(q => q.subject === subject)
}

export const getQuestionsByMasteryLevel = (level) => {
  return incorrectQuestions.filter(q => q.masteryLevel === level)
}

export const getQuestionsForReview = () => {
  const today = new Date()
  return incorrectQuestions.filter(q => {
    if (!q.nextReviewDate) return q.masteryLevel === "Needs Review"
    return new Date(q.nextReviewDate) <= today
  })
}

export const updateQuestionReview = (questionId, isCorrect) => {
  const question = incorrectQuestions.find(q => q.id === questionId)
  if (!question) return null

  const today = new Date()
  question.reviewCount += 1
  question.lastReviewed = today.toISOString().split('T')[0]

  // Spaced repetition algorithm
  let daysToAdd = 1
  if (isCorrect) {
    if (question.reviewCount === 1) daysToAdd = 1
    else if (question.reviewCount === 2) daysToAdd = 3
    else if (question.reviewCount === 3) daysToAdd = 7
    else if (question.reviewCount === 4) daysToAdd = 14
    else daysToAdd = 30

    // Update mastery level
    if (question.reviewCount >= 5) question.masteryLevel = "Mastered"
    else if (question.reviewCount >= 3) question.masteryLevel = "Practicing"
    else question.masteryLevel = "Learning"
  } else {
    // Reset if incorrect
    question.masteryLevel = "Needs Review"
    daysToAdd = 1
  }

  const nextReview = new Date(today)
  nextReview.setDate(today.getDate() + daysToAdd)
  question.nextReviewDate = nextReview.toISOString().split('T')[0]

  return question
}

export const getReviewStats = () => {
  const total = incorrectQuestions.length
  const needsReview = incorrectQuestions.filter(q => q.masteryLevel === "Needs Review").length
  const learning = incorrectQuestions.filter(q => q.masteryLevel === "Learning").length
  const practicing = incorrectQuestions.filter(q => q.masteryLevel === "Practicing").length
  const mastered = incorrectQuestions.filter(q => q.masteryLevel === "Mastered").length
  const dueForReview = getQuestionsForReview().length

  return {
    total,
    needsReview,
    learning,
    practicing,
    mastered,
    dueForReview,
    masteryRate: Math.round((mastered / total) * 100)
  }
}

// Study Plans Data for Comparison
export const studyPlans = [
  {
    id: 1,
    name: "Balanced Plan",
    description: "A well-rounded approach covering all subjects evenly",
    totalHours: 25,
    weeklyHours: 25,
    difficulty: "Medium",
    riskLevel: "Low",
    subjects: [
      { name: "Mathematics Advanced", hours: 6, difficulty: "High", priority: "High" },
      { name: "English Advanced", hours: 5, difficulty: "Medium", priority: "High" },
      { name: "Physics", hours: 5, difficulty: "High", priority: "Medium" },
      { name: "Chemistry", hours: 5, difficulty: "High", priority: "Medium" },
      { name: "Biology", hours: 4, difficulty: "Medium", priority: "Low" }
    ],
    strengths: [
      "Even distribution of study time",
      "Manageable workload",
      "Low risk of burnout",
      "Good work-life balance"
    ],
    weaknesses: [
      "May not focus enough on weak areas",
      "Slower progress in challenging subjects"
    ],
    recommendedFor: "Students who prefer steady, consistent progress",
    successRate: 85,
    stress: "Low",
    flexibility: "High"
  },
  {
    id: 2,
    name: "Intensive Plan",
    description: "Aggressive study schedule for maximum results",
    totalHours: 40,
    weeklyHours: 40,
    difficulty: "High",
    riskLevel: "High",
    subjects: [
      { name: "Mathematics Advanced", hours: 10, difficulty: "High", priority: "High" },
      { name: "English Advanced", hours: 8, difficulty: "Medium", priority: "High" },
      { name: "Physics", hours: 8, difficulty: "High", priority: "High" },
      { name: "Chemistry", hours: 8, difficulty: "High", priority: "Medium" },
      { name: "Biology", hours: 6, difficulty: "Medium", priority: "Medium" }
    ],
    strengths: [
      "Rapid skill development",
      "Deep understanding of concepts",
      "High potential for top grades",
      "Comprehensive coverage"
    ],
    weaknesses: [
      "High risk of burnout",
      "Limited free time",
      "Requires strong discipline",
      "May be overwhelming"
    ],
    recommendedFor: "Highly motivated students aiming for top ATAR scores",
    successRate: 70,
    stress: "High",
    flexibility: "Low"
  },
  {
    id: 3,
    name: "Focus on Weak Areas",
    description: "Targeted approach prioritizing subjects that need improvement",
    totalHours: 28,
    weeklyHours: 28,
    difficulty: "Medium",
    riskLevel: "Medium",
    subjects: [
      { name: "Mathematics Advanced", hours: 10, difficulty: "High", priority: "High" },
      { name: "Physics", hours: 8, difficulty: "High", priority: "High" },
      { name: "Chemistry", hours: 6, difficulty: "High", priority: "Medium" },
      { name: "English Advanced", hours: 3, difficulty: "Medium", priority: "Low" },
      { name: "Biology", hours: 1, difficulty: "Medium", priority: "Low" }
    ],
    strengths: [
      "Addresses weak points directly",
      "Efficient use of study time",
      "Potential for significant improvement",
      "Strategic approach"
    ],
    weaknesses: [
      "May neglect strong subjects",
      "Uneven workload distribution",
      "Risk of losing edge in easier subjects"
    ],
    recommendedFor: "Students with clear areas needing improvement",
    successRate: 78,
    stress: "Medium",
    flexibility: "Medium"
  },
  {
    id: 4,
    name: "Exam-Focused Plan",
    description: "Strategic plan optimized for exam preparation",
    totalHours: 30,
    weeklyHours: 30,
    difficulty: "Medium",
    riskLevel: "Low",
    subjects: [
      { name: "Mathematics Advanced", hours: 7, difficulty: "High", priority: "High" },
      { name: "English Advanced", hours: 6, difficulty: "Medium", priority: "High" },
      { name: "Physics", hours: 6, difficulty: "High", priority: "High" },
      { name: "Chemistry", hours: 6, difficulty: "High", priority: "Medium" },
      { name: "Biology", hours: 5, difficulty: "Medium", priority: "Medium" }
    ],
    strengths: [
      "Optimized for exam success",
      "Practice-focused approach",
      "Proven strategies",
      "Balanced coverage"
    ],
    weaknesses: [
      "Less emphasis on deep learning",
      "May feel repetitive",
      "Requires consistent practice"
    ],
    recommendedFor: "Students preparing for upcoming HSC exams",
    successRate: 88,
    stress: "Medium",
    flexibility: "Medium"
  }
]

// Helper functions for plan comparison
export const comparePlans = (planIds) => {
  return studyPlans.filter(plan => planIds.includes(plan.id))
}

export const calculatePlanMetrics = (plan) => {
  const avgDifficulty = plan.subjects.reduce((acc, subject) => {
    const difficultyScore = subject.difficulty === 'High' ? 3 : subject.difficulty === 'Medium' ? 2 : 1
    return acc + difficultyScore
  }, 0) / plan.subjects.length

  const workloadScore = (plan.weeklyHours / 40) * 100 // Normalized to 40 hours max
  const riskScore = plan.riskLevel === 'High' ? 80 : plan.riskLevel === 'Medium' ? 50 : 20

  return {
    workload: Math.round(workloadScore),
    difficulty: Math.round((avgDifficulty / 3) * 100),
    risk: riskScore,
    successRate: plan.successRate
  }
}

export const getPlanDifferences = (plan1, plan2) => {
  const metrics1 = calculatePlanMetrics(plan1)
  const metrics2 = calculatePlanMetrics(plan2)

  return {
    workload: metrics2.workload - metrics1.workload,
    difficulty: metrics2.difficulty - metrics1.difficulty,
    risk: metrics2.risk - metrics1.risk,
    hours: plan2.weeklyHours - plan1.weeklyHours
  }
}

// University Course Mapping Data
export const universityCourses = [
  {
    id: 1,
    courseName: "Bachelor of Engineering (Software)",
    university: "University of Sydney",
    requiredSubjects: ["Mathematics Advanced", "Physics"],
    coreSubjects: ["Mathematics Extension 1"],
    desirableSubjects: ["Mathematics Extension 2", "Chemistry"],
    atarRequirement: 95,
    description: "Comprehensive software engineering program covering algorithms, systems design, and software development.",
    careerOutcomes: ["Software Engineer", "Systems Architect", "Tech Lead"]
  },
  {
    id: 2,
    courseName: "Bachelor of Science (Computer Science)",
    university: "UNSW Sydney",
    requiredSubjects: ["Mathematics Advanced"],
    coreSubjects: ["Mathematics Extension 1", "Physics"],
    desirableSubjects: ["Mathematics Extension 2", "Chemistry"],
    atarRequirement: 90,
    description: "Focus on computational theory, programming, and data structures.",
    careerOutcomes: ["Software Developer", "Data Scientist", "AI Researcher"]
  },
  {
    id: 3,
    courseName: "Bachelor of Medicine",
    university: "University of Sydney",
    requiredSubjects: ["Chemistry", "Biology"],
    coreSubjects: ["Physics", "Mathematics Advanced"],
    desirableSubjects: ["English Advanced"],
    atarRequirement: 99.5,
    description: "Medical degree preparing students for clinical practice.",
    careerOutcomes: ["Doctor", "Surgeon", "Medical Researcher"]
  },
  {
    id: 4,
    courseName: "Bachelor of Arts (English Literature)",
    university: "Macquarie University",
    requiredSubjects: ["English Advanced"],
    coreSubjects: [],
    desirableSubjects: ["History", "Legal Studies"],
    atarRequirement: 80,
    description: "Study of literature, critical analysis, and creative writing.",
    careerOutcomes: ["Writer", "Editor", "Teacher", "Journalist"]
  },
  {
    id: 5,
    courseName: "Bachelor of Engineering (Electrical)",
    university: "UTS",
    requiredSubjects: ["Mathematics Advanced", "Physics"],
    coreSubjects: ["Mathematics Extension 1"],
    desirableSubjects: ["Mathematics Extension 2", "Chemistry"],
    atarRequirement: 88,
    description: "Electrical systems, power engineering, and electronics.",
    careerOutcomes: ["Electrical Engineer", "Power Systems Engineer", "Electronics Designer"]
  },
  {
    id: 6,
    courseName: "Bachelor of Science (Chemistry)",
    university: "University of Sydney",
    requiredSubjects: ["Chemistry", "Mathematics Advanced"],
    coreSubjects: ["Physics"],
    desirableSubjects: ["Biology", "Mathematics Extension 1"],
    atarRequirement: 85,
    description: "Advanced study of chemical principles and laboratory techniques.",
    careerOutcomes: ["Chemist", "Research Scientist", "Quality Control Analyst"]
  },
  {
    id: 7,
    courseName: "Bachelor of Laws",
    university: "UNSW Sydney",
    requiredSubjects: ["English Advanced"],
    coreSubjects: ["Legal Studies"],
    desirableSubjects: ["History", "Economics"],
    atarRequirement: 97,
    description: "Comprehensive legal education covering various areas of law.",
    careerOutcomes: ["Lawyer", "Barrister", "Legal Advisor"]
  },
  {
    id: 8,
    courseName: "Bachelor of Science (Physics)",
    university: "ANU",
    requiredSubjects: ["Physics", "Mathematics Advanced"],
    coreSubjects: ["Mathematics Extension 1"],
    desirableSubjects: ["Mathematics Extension 2", "Chemistry"],
    atarRequirement: 90,
    description: "Study of fundamental physical principles and quantum mechanics.",
    careerOutcomes: ["Physicist", "Research Scientist", "Data Analyst"]
  }
]

// Helper function to get courses by HSC subject
export const getCoursesBySubject = (subjectName) => {
  return universityCourses.filter(course => 
    course.requiredSubjects.includes(subjectName) ||
    course.coreSubjects.includes(subjectName) ||
    course.desirableSubjects.includes(subjectName)
  )
}

export const getSubjectRequirementType = (course, subjectName) => {
  if (course.requiredSubjects.includes(subjectName)) return 'Required'
  if (course.coreSubjects.includes(subjectName)) return 'Core'
  if (course.desirableSubjects.includes(subjectName)) return 'Desirable'
  return null
}

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

// Add incorrect question to the list
export const addIncorrectQuestion = (questionData) => {
  const newQuestion = {
    id: incorrectQuestions.length + 1,
    question: questionData.question,
    correctAnswer: questionData.correctAnswer,
    studentAnswer: questionData.studentAnswer,
    explanation: questionData.explanation,
    topic: questionData.topic,
    subject: questionData.subject,
    difficulty: questionData.difficulty,
    dateAnswered: new Date().toISOString().split('T')[0], // Today's date
    assignment: questionData.assignment || 'Practice Questions',
    reviewCount: 0,
    lastReviewed: null,
    nextReviewDate: null,
    masteryLevel: 'Needs Review'
  }
  
  incorrectQuestions.push(newQuestion)
  return newQuestion
}

// Add multiple incorrect questions from practice
export const addIncorrectQuestionsFromPractice = (practiceSet, questionsWithAnswers) => {
  const incorrectQs = []
  
  questionsWithAnswers.forEach(({ question, selectedOptionId }) => {
    const selectedOption = question.options.find(opt => opt.id === selectedOptionId)
    const correctOption = question.options.find(opt => opt.correct)
    
    // Only add if the answer is incorrect
    if (selectedOption && !selectedOption.correct) {
      const newQuestion = addIncorrectQuestion({
        question: question.question,
        correctAnswer: correctOption.text,
        studentAnswer: selectedOption.text,
        explanation: question.explanation,
        topic: practiceSet.topic,
        subject: practiceSet.subject,
        difficulty: practiceSet.difficulty,
        assignment: `Practice: ${practiceSet.topic}`
      })
      incorrectQs.push(newQuestion)
    }
  })
  
  return incorrectQs
}

