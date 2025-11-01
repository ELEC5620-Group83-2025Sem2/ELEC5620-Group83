import { useState } from 'react'
import ReviewIncorrectQuestions from './ReviewIncorrectQuestions'
import { addIncorrectQuestionsFromPractice } from './mockData'

function StudyPlannerView({ studyPlanSuggestions }) {
  const [expandedSuggestion, setExpandedSuggestion] = useState(null)
  const [activeTab, setActiveTab] = useState('recommendations') // 'recommendations', 'practice', 'review'

  const toggleExplanation = (id) => {
    setExpandedSuggestion(expandedSuggestion === id ? null : id)
  }

  return (
    <>
      <div className="ai-header">
        <div className="ai-icon-large">🤖</div>
        <div>
          <h2>AI-Powered Study Planner</h2>
          <p>Personalized study recommendations, practice questions, and review incorrect questions</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="study-planner-tabs">
        <button 
          className={`study-tab ${activeTab === 'recommendations' ? 'active' : ''}`}
          onClick={() => setActiveTab('recommendations')}
        >
          <span className="tab-icon">💡</span>
          AI Recommendations
        </button>
        <button 
          className={`study-tab ${activeTab === 'practice' ? 'active' : ''}`}
          onClick={() => setActiveTab('practice')}
        >
          <span className="tab-icon">📝</span>
          Practice Questions
        </button>
        <button 
          className={`study-tab ${activeTab === 'review' ? 'active' : ''}`}
          onClick={() => setActiveTab('review')}
        >
          <span className="tab-icon">📚</span>
          Review Mistakes
        </button>
      </div>

      {/* AI Recommendations Tab */}
      {activeTab === 'recommendations' && (
        <>
          {/* Explainability Notice */}
          <div className="explainability-notice">
            <div className="notice-icon">ℹ️</div>
            <div className="notice-content">
              <h4>Transparent AI Recommendations</h4>
              <p>Each recommendation below is based on your academic profile, recent performance, and curriculum requirements. Click "Why this?" to see the detailed reasoning.</p>
            </div>
          </div>

          <div className="study-suggestions">
        {studyPlanSuggestions.map(suggestion => (
          <div key={suggestion.id} className="suggestion-card">
            <div className="suggestion-header">
              <span className={`priority-indicator ${suggestion.priority}`}></span>
              <h3>{suggestion.subject}: {suggestion.topic}</h3>
            </div>
            
            <p className="suggestion-reason">💡 {suggestion.reason}</p>
            
            <div className="suggestion-meta">
              <span className="meta-item">⏱️ {suggestion.duration}</span>
              <span className={`meta-badge ${suggestion.priority}`}>
                {suggestion.priority} priority
              </span>
            </div>

            {/* Explainability Section */}
            <div className="explainability-section">
              <button 
                className="btn-why-this"
                onClick={() => toggleExplanation(suggestion.id)}
              >
                {expandedSuggestion === suggestion.id ? '▼ Hide explanation' : '▶ Why this recommendation?'}
              </button>

              {expandedSuggestion === suggestion.id && (
                <div className="explanation-details">
                  <div className="explanation-header">
                    <h4>📊 Recommendation Reasoning</h4>
                  </div>

                  {/* Evidence from Profile */}
                  <div className="evidence-section">
                    <h5>📈 Based on Your Profile:</h5>
                    <ul className="evidence-list">
                      {suggestion.profileEvidence && suggestion.profileEvidence.map((evidence, index) => (
                        <li key={index} className="evidence-item">
                          <span className="evidence-icon">✓</span>
                          <span className="evidence-text">{evidence}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Curriculum Rules */}
                  <div className="evidence-section">
                    <h5>📚 Curriculum Requirements:</h5>
                    <ul className="evidence-list">
                      {suggestion.curriculumRules && suggestion.curriculumRules.map((rule, index) => (
                        <li key={index} className="evidence-item">
                          <span className="evidence-icon">📋</span>
                          <span className="evidence-text">{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Performance Data */}
                  {suggestion.performanceData && (
                    <div className="evidence-section">
                      <h5>📊 Recent Performance:</h5>
                      <div className="performance-metrics">
                        {suggestion.performanceData.map((metric, index) => (
                          <div key={index} className="metric-item">
                            <span className="metric-label">{metric.label}:</span>
                            <span className="metric-value" style={{ color: metric.color }}>
                              {metric.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Expected Outcome */}
                  {suggestion.expectedOutcome && (
                    <div className="evidence-section outcome-section">
                      <h5>🎯 Expected Outcome:</h5>
                      <p className="outcome-text">{suggestion.expectedOutcome}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <button className="btn-suggestion-action">Add to Schedule</button>
          </div>
        ))}
          </div>
        </>
      )}

      {/* Practice Questions Tab */}
      {activeTab === 'practice' && (
        <PracticeQuestions />
      )}

      {/* Review Incorrect Questions Tab */}
      {activeTab === 'review' && (
        <ReviewIncorrectQuestions />
      )}
    </>
  )
}

// Practice Questions Component
function PracticeQuestions() {
  const [selectedSubject, setSelectedSubject] = useState('All')
  const [selectedDifficulty, setSelectedDifficulty] = useState('All')
  const [activePracticeSet, setActivePracticeSet] = useState(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)

  const subjects = ['All', 'Mathematics Advanced', 'English Advanced', 'Physics', 'Chemistry', 'Biology', 'Modern History', 'Economics']
  const difficulties = ['All', 'Easy', 'Medium', 'Hard']

  const practiceQuestions = [
    {
      id: 1,
      subject: 'Mathematics Advanced',
      topic: 'Calculus',
      difficulty: 'Medium',
      questionCount: 10,
      estimatedTime: '45 mins',
      description: 'Integration techniques and applications',
      icon: '📐',
      questions: [
        {
          id: 'calc-1',
          question: 'What is the derivative of f(x) = 3x² + 2x - 5?',
          type: 'multiple-choice',
          options: [
            { id: 'a', text: '6x + 2', correct: true },
            { id: 'b', text: '3x + 2', correct: false },
            { id: 'c', text: '6x - 5', correct: false },
            { id: 'd', text: '3x² + 2', correct: false }
          ],
          explanation: 'Using the power rule: d/dx(xⁿ) = nxⁿ⁻¹. So d/dx(3x²) = 6x, d/dx(2x) = 2, and d/dx(-5) = 0.'
        },
        {
          id: 'calc-2',
          question: 'Evaluate the integral: ∫(2x + 3)dx',
          type: 'multiple-choice',
          options: [
            { id: 'a', text: 'x² + 3x + C', correct: true },
            { id: 'b', text: '2x² + 3x + C', correct: false },
            { id: 'c', text: 'x² + 3 + C', correct: false },
            { id: 'd', text: '2x + 3x + C', correct: false }
          ],
          explanation: '∫2x dx = x² and ∫3 dx = 3x, so the answer is x² + 3x + C.'
        },
        {
          id: 'calc-3',
          question: 'What is the value of lim(x→0) (sin(x)/x)?',
          type: 'multiple-choice',
          options: [
            { id: 'a', text: '1', correct: true },
            { id: 'b', text: '0', correct: false },
            { id: 'c', text: '∞', correct: false },
            { id: 'd', text: 'Does not exist', correct: false }
          ],
          explanation: 'This is a well-known limit: lim(x→0) (sin(x)/x) = 1. It can be proven using L\'Hôpital\'s rule or the squeeze theorem.'
        },
        {
          id: 'calc-4',
          question: 'Find the critical points of f(x) = x³ - 3x + 2',
          type: 'multiple-choice',
          options: [
            { id: 'a', text: 'x = 1 and x = -1', correct: true },
            { id: 'b', text: 'x = 0 and x = 3', correct: false },
            { id: 'c', text: 'x = 2 only', correct: false },
            { id: 'd', text: 'No critical points', correct: false }
          ],
          explanation: 'Critical points occur where f\'(x) = 0. f\'(x) = 3x² - 3 = 3(x² - 1) = 3(x-1)(x+1) = 0, so x = 1 or x = -1.'
        },
        {
          id: 'calc-5',
          question: 'What is the area under the curve y = x² from x = 0 to x = 2?',
          type: 'multiple-choice',
          options: [
            { id: 'a', text: '8/3', correct: true },
            { id: 'b', text: '4', correct: false },
            { id: 'c', text: '2', correct: false },
            { id: 'd', text: '4/3', correct: false }
          ],
          explanation: '∫₀² x² dx = [x³/3]₀² = 8/3 - 0 = 8/3.'
        },
        {
          id: 'calc-6',
          question: 'What is the second derivative of f(x) = x⁴ - 2x³ + x?',
          type: 'multiple-choice',
          options: [
            { id: 'a', text: '12x² - 12x', correct: true },
            { id: 'b', text: '4x³ - 6x²', correct: false },
            { id: 'c', text: '12x² - 6x + 1', correct: false },
            { id: 'd', text: '4x³ - 12x', correct: false }
          ],
          explanation: 'First derivative: f\'(x) = 4x³ - 6x² + 1. Second derivative: f\'\'(x) = 12x² - 12x.'
        },
        {
          id: 'calc-7',
          question: 'Evaluate: ∫x·eˣ dx using integration by parts',
          type: 'multiple-choice',
          options: [
            { id: 'a', text: 'x·eˣ - eˣ + C', correct: true },
            { id: 'b', text: 'x·eˣ + C', correct: false },
            { id: 'c', text: 'eˣ + C', correct: false },
            { id: 'd', text: 'x²·eˣ + C', correct: false }
          ],
          explanation: 'Using integration by parts: u = x, dv = eˣdx. Then du = dx, v = eˣ. Result: x·eˣ - ∫eˣdx = x·eˣ - eˣ + C.'
        },
        {
          id: 'calc-8',
          question: 'Find the maximum value of f(x) = -x² + 4x - 3',
          type: 'multiple-choice',
          options: [
            { id: 'a', text: '1', correct: true },
            { id: 'b', text: '2', correct: false },
            { id: 'c', text: '4', correct: false },
            { id: 'd', text: '-3', correct: false }
          ],
          explanation: 'f\'(x) = -2x + 4 = 0 when x = 2. f(2) = -4 + 8 - 3 = 1. Since f\'\'(x) = -2 < 0, this is a maximum.'
        },
        {
          id: 'calc-9',
          question: 'What is lim(x→∞) (3x² + 2x)/(x² - 1)?',
          type: 'multiple-choice',
          options: [
            { id: 'a', text: '3', correct: true },
            { id: 'b', text: '2', correct: false },
            { id: 'c', text: '∞', correct: false },
            { id: 'd', text: '0', correct: false }
          ],
          explanation: 'Divide numerator and denominator by x²: lim(x→∞) (3 + 2/x)/(1 - 1/x²) = 3/1 = 3.'
        },
        {
          id: 'calc-10',
          question: 'Evaluate: ∫₁³ (2x + 1) dx',
          type: 'multiple-choice',
          options: [
            { id: 'a', text: '10', correct: true },
            { id: 'b', text: '8', correct: false },
            { id: 'c', text: '12', correct: false },
            { id: 'd', text: '6', correct: false }
          ],
          explanation: '∫(2x + 1)dx = x² + x + C. Evaluating from 1 to 3: (9 + 3) - (1 + 1) = 12 - 2 = 10.'
        }
      ]
    },
    {
      id: 2,
      subject: 'English Advanced',
      topic: 'Literary Analysis',
      difficulty: 'Hard',
      questionCount: 10,
      estimatedTime: '50 mins',
      description: 'Analyzing themes and literary devices',
      icon: '📖',
      questions: [
        {
          id: 'eng-1',
          question: 'What is a metaphor?',
          type: 'multiple-choice',
          options: [
            { id: 'a', text: 'A direct comparison between two unlike things without using "like" or "as"', correct: true },
            { id: 'b', text: 'A comparison using "like" or "as"', correct: false },
            { id: 'c', text: 'An exaggeration for emphasis', correct: false },
            { id: 'd', text: 'Giving human qualities to non-human things', correct: false }
          ],
          explanation: 'A metaphor is a direct comparison that says one thing IS another thing, without using "like" or "as". For example: "Time is a thief."'
        },
        {
          id: 'eng-2',
          question: 'In Shakespeare\'s works, what does the recurring motif of light and darkness often symbolize?',
          type: 'multiple-choice',
          options: [
            { id: 'a', text: 'Good vs. evil, knowledge vs. ignorance', correct: true },
            { id: 'b', text: 'Day vs. night only', correct: false },
            { id: 'c', text: 'Wealth vs. poverty', correct: false },
            { id: 'd', text: 'Youth vs. old age', correct: false }
          ],
          explanation: 'Shakespeare frequently used light and darkness as symbols for good vs. evil, knowledge vs. ignorance, and truth vs. deception.'
        },
        {
          id: 'eng-3',
          question: 'What is the main purpose of a thesis statement in an essay?',
          type: 'multiple-choice',
          options: [
            { id: 'a', text: 'To present the main argument or claim of the essay', correct: true },
            { id: 'b', text: 'To summarize all the details', correct: false },
            { id: 'c', text: 'To introduce the author', correct: false },
            { id: 'd', text: 'To list all references', correct: false }
          ],
          explanation: 'A thesis statement presents the main argument or central claim that the essay will support with evidence and analysis.'
        },
        {
          id: 'eng-4',
          question: 'Which narrative perspective uses "I" and "we"?',
          type: 'multiple-choice',
          options: [
            { id: 'a', text: 'First person', correct: true },
            { id: 'b', text: 'Second person', correct: false },
            { id: 'c', text: 'Third person limited', correct: false },
            { id: 'd', text: 'Third person omniscient', correct: false }
          ],
          explanation: 'First person narrative uses "I" or "we" and tells the story from the narrator\'s personal perspective.'
        },
        {
          id: 'eng-5',
          question: 'What is alliteration?',
          type: 'multiple-choice',
          options: [
            { id: 'a', text: 'Repetition of consonant sounds at the beginning of words', correct: true },
            { id: 'b', text: 'Repetition of vowel sounds', correct: false },
            { id: 'c', text: 'Repetition of entire words', correct: false },
            { id: 'd', text: 'Rhyming at the end of lines', correct: false }
          ],
          explanation: 'Alliteration is the repetition of consonant sounds at the beginning of words in close proximity, like "Peter Piper picked a peck".'
        },
        {
          id: 'eng-6',
          question: 'What is the main conflict in a story?',
          type: 'multiple-choice',
          options: [
            { id: 'a', text: 'The central problem or struggle that drives the plot', correct: true },
            { id: 'b', text: 'The setting of the story', correct: false },
            { id: 'c', text: 'The author\'s biography', correct: false },
            { id: 'd', text: 'The title of the book', correct: false }
          ],
          explanation: 'The main conflict is the central problem, struggle, or challenge that the protagonist faces, which drives the narrative forward.'
        },
        {
          id: 'eng-7',
          question: 'What is foreshadowing?',
          type: 'multiple-choice',
          options: [
            { id: 'a', text: 'Hints or clues about events that will happen later in the story', correct: true },
            { id: 'b', text: 'A flashback to earlier events', correct: false },
            { id: 'c', text: 'The climax of the story', correct: false },
            { id: 'd', text: 'Direct statement of the theme', correct: false }
          ],
          explanation: 'Foreshadowing is a literary device where the author gives hints or clues about what will happen later in the story.'
        },
        {
          id: 'eng-8',
          question: 'What is personification?',
          type: 'multiple-choice',
          options: [
            { id: 'a', text: 'Giving human characteristics to non-human things', correct: true },
            { id: 'b', text: 'Comparing two things using "like" or "as"', correct: false },
            { id: 'c', text: 'Extreme exaggeration', correct: false },
            { id: 'd', text: 'A reference to another work', correct: false }
          ],
          explanation: 'Personification is when non-human objects, animals, or ideas are given human characteristics. Example: "The wind whispered through the trees."'
        },
        {
          id: 'eng-9',
          question: 'What is the climax of a story?',
          type: 'multiple-choice',
          options: [
            { id: 'a', text: 'The turning point or moment of highest tension', correct: true },
            { id: 'b', text: 'The introduction of characters', correct: false },
            { id: 'c', text: 'The final resolution', correct: false },
            { id: 'd', text: 'The setting description', correct: false }
          ],
          explanation: 'The climax is the turning point of the story, the moment of highest tension where the main conflict reaches its peak.'
        },
        {
          id: 'eng-10',
          question: 'What is irony?',
          type: 'multiple-choice',
          options: [
            { id: 'a', text: 'When the opposite of what is expected happens', correct: true },
            { id: 'b', text: 'A direct comparison without "like" or "as"', correct: false },
            { id: 'c', text: 'Repetition of sounds', correct: false },
            { id: 'd', text: 'Description of setting', correct: false }
          ],
          explanation: 'Irony occurs when there is a contrast between expectation and reality, or when something happens that is opposite to what was expected.'
        }
      ]
    },
    {
      id: 3,
      subject: 'Physics',
      topic: 'Mechanics',
      difficulty: 'Easy',
      questionCount: 10,
      estimatedTime: '40 mins',
      description: 'Newton\'s laws and motion',
      icon: '⚡',
      questions: [
        {
          id: 'phys-1',
          question: 'According to Newton\'s First Law, an object at rest will remain at rest unless:',
          type: 'multiple-choice',
          options: [
            { id: 'a', text: 'Acted upon by an unbalanced force', correct: true },
            { id: 'b', text: 'It becomes tired', correct: false },
            { id: 'c', text: 'Time passes', correct: false },
            { id: 'd', text: 'It changes temperature', correct: false }
          ],
          explanation: 'Newton\'s First Law states that an object at rest stays at rest, and an object in motion stays in motion, unless acted upon by an unbalanced force.'
        },
        {
          id: 'phys-2',
          question: 'If a car is traveling at 60 km/h and accelerates uniformly to 100 km/h in 10 seconds, what is its acceleration?',
          type: 'multiple-choice',
          options: [
            { id: 'a', text: '1.11 m/s²', correct: true },
            { id: 'b', text: '4 m/s²', correct: false },
            { id: 'c', text: '10 m/s²', correct: false },
            { id: 'd', text: '40 m/s²', correct: false }
          ],
          explanation: 'First convert to m/s: 60 km/h = 16.67 m/s, 100 km/h = 27.78 m/s. Acceleration = (27.78 - 16.67) / 10 = 1.11 m/s².'
        },
        {
          id: 'phys-3',
          question: 'What is the SI unit of force?',
          type: 'multiple-choice',
          options: [
            { id: 'a', text: 'Newton (N)', correct: true },
            { id: 'b', text: 'Joule (J)', correct: false },
            { id: 'c', text: 'Watt (W)', correct: false },
            { id: 'd', text: 'Pascal (Pa)', correct: false }
          ],
          explanation: 'The Newton (N) is the SI unit of force, defined as kg·m/s². It\'s named after Isaac Newton.'
        },
        {
          id: 'phys-4',
          question: 'If you push a wall with a force of 50N, how much force does the wall exert on you?',
          type: 'multiple-choice',
          options: [
            { id: 'a', text: '50N in the opposite direction', correct: true },
            { id: 'b', text: '0N', correct: false },
            { id: 'c', text: '25N', correct: false },
            { id: 'd', text: '100N', correct: false }
          ],
          explanation: 'According to Newton\'s Third Law, for every action there is an equal and opposite reaction. The wall pushes back with 50N.'
        },
        {
          id: 'phys-5',
          question: 'A 10 kg object is dropped from rest. What is its weight (force due to gravity)?',
          type: 'multiple-choice',
          options: [
            { id: 'a', text: '98 N', correct: true },
            { id: 'b', text: '10 N', correct: false },
            { id: 'c', text: '100 N', correct: false },
            { id: 'd', text: '9.8 N', correct: false }
          ],
          explanation: 'Weight = mass × gravity = 10 kg × 9.8 m/s² = 98 N.'
        },
        {
          id: 'phys-6',
          question: 'What is momentum?',
          type: 'multiple-choice',
          options: [
            { id: 'a', text: 'Mass × Velocity', correct: true },
            { id: 'b', text: 'Mass × Acceleration', correct: false },
            { id: 'c', text: 'Force × Distance', correct: false },
            { id: 'd', text: 'Mass × Time', correct: false }
          ],
          explanation: 'Momentum (p) = mass (m) × velocity (v). It is a vector quantity measured in kg·m/s.'
        },
        {
          id: 'phys-7',
          question: 'A car travels 100 meters in 5 seconds. What is its average speed?',
          type: 'multiple-choice',
          options: [
            { id: 'a', text: '20 m/s', correct: true },
            { id: 'b', text: '500 m/s', correct: false },
            { id: 'c', text: '0.05 m/s', correct: false },
            { id: 'd', text: '105 m/s', correct: false }
          ],
          explanation: 'Average speed = distance / time = 100 m / 5 s = 20 m/s.'
        },
        {
          id: 'phys-8',
          question: 'What is the relationship between force, mass, and acceleration?',
          type: 'multiple-choice',
          options: [
            { id: 'a', text: 'F = ma (Newton\'s Second Law)', correct: true },
            { id: 'b', text: 'F = m/a', correct: false },
            { id: 'c', text: 'F = a/m', correct: false },
            { id: 'd', text: 'F = m + a', correct: false }
          ],
          explanation: 'Newton\'s Second Law states that Force = mass × acceleration (F = ma).'
        },
        {
          id: 'phys-9',
          question: 'Which law states "For every action, there is an equal and opposite reaction"?',
          type: 'multiple-choice',
          options: [
            { id: 'a', text: 'Newton\'s Third Law', correct: true },
            { id: 'b', text: 'Newton\'s First Law', correct: false },
            { id: 'c', text: 'Newton\'s Second Law', correct: false },
            { id: 'd', text: 'Law of Conservation of Energy', correct: false }
          ],
          explanation: 'Newton\'s Third Law of Motion states that for every action force, there is an equal and opposite reaction force.'
        },
        {
          id: 'phys-10',
          question: 'An object is thrown upward at 20 m/s. How long until it reaches its maximum height? (g = 10 m/s²)',
          type: 'multiple-choice',
          options: [
            { id: 'a', text: '2 seconds', correct: true },
            { id: 'b', text: '1 second', correct: false },
            { id: 'c', text: '4 seconds', correct: false },
            { id: 'd', text: '10 seconds', correct: false }
          ],
          explanation: 'At maximum height, velocity = 0. Using v = u - gt: 0 = 20 - 10t, so t = 2 seconds.'
        }
      ]
    },
    {
      id: 4,
      subject: 'Chemistry',
      topic: 'Organic Chemistry',
      difficulty: 'Medium',
      questionCount: 10,
      estimatedTime: '35 mins',
      description: 'Functional groups and reactions',
      icon: '🧪',
      questions: [
        {
          id: 'chem-1',
          question: 'Which functional group is characterized by -OH?',
          type: 'multiple-choice',
          options: [
            { id: 'a', text: 'Hydroxyl (Alcohol)', correct: true },
            { id: 'b', text: 'Carboxyl', correct: false },
            { id: 'c', text: 'Amino', correct: false },
            { id: 'd', text: 'Carbonyl', correct: false }
          ],
          explanation: 'The hydroxyl group (-OH) is characteristic of alcohols. For example, ethanol (C₂H₅OH) contains a hydroxyl group.'
        },
        {
          id: 'chem-2',
          question: 'What type of reaction is: CH₄ + 2O₂ → CO₂ + 2H₂O?',
          type: 'multiple-choice',
          options: [
            { id: 'a', text: 'Combustion', correct: true },
            { id: 'b', text: 'Synthesis', correct: false },
            { id: 'c', text: 'Decomposition', correct: false },
            { id: 'd', text: 'Neutralization', correct: false }
          ],
          explanation: 'This is a combustion reaction where methane burns in oxygen to produce carbon dioxide and water.'
        },
        {
          id: 'chem-3',
          question: 'Which of the following is an alkene?',
          type: 'multiple-choice',
          options: [
            { id: 'a', text: 'C₂H₄ (Ethene)', correct: true },
            { id: 'b', text: 'C₂H₆ (Ethane)', correct: false },
            { id: 'c', text: 'CH₄ (Methane)', correct: false },
            { id: 'd', text: 'C₆H₆ (Benzene)', correct: false }
          ],
          explanation: 'Alkenes contain carbon-carbon double bonds. Ethene (C₂H₄) has one double bond and follows the formula CₙH₂ₙ.'
        },
        {
          id: 'chem-4',
          question: 'What is the IUPAC name for CH₃CH₂COOH?',
          type: 'multiple-choice',
          options: [
            { id: 'a', text: 'Propanoic acid', correct: true },
            { id: 'b', text: 'Ethanoic acid', correct: false },
            { id: 'c', text: 'Butanoic acid', correct: false },
            { id: 'd', text: 'Methanoic acid', correct: false }
          ],
          explanation: 'This molecule has 3 carbons (prop-) and a carboxylic acid group (-oic acid), so it\'s propanoic acid.'
        },
        {
          id: 'chem-5',
          question: 'Which type of isomerism occurs when molecules have the same molecular formula but different structural arrangements?',
          type: 'multiple-choice',
          options: [
            { id: 'a', text: 'Structural isomerism', correct: true },
            { id: 'b', text: 'Optical isomerism', correct: false },
            { id: 'c', text: 'Geometric isomerism', correct: false },
            { id: 'd', text: 'Nuclear isomerism', correct: false }
          ],
          explanation: 'Structural isomers have the same molecular formula but different connectivity of atoms.'
        },
        {
          id: 'chem-6',
          question: 'What is the molecular formula for glucose?',
          type: 'multiple-choice',
          options: [
            { id: 'a', text: 'C₆H₁₂O₆', correct: true },
            { id: 'b', text: 'C₁₂H₂₂O₁₁', correct: false },
            { id: 'c', text: 'CH₄', correct: false },
            { id: 'd', text: 'C₂H₆O', correct: false }
          ],
          explanation: 'Glucose is a simple sugar with the molecular formula C₆H₁₂O₆.'
        },
        {
          id: 'chem-7',
          question: 'What type of bond forms when electrons are shared between atoms?',
          type: 'multiple-choice',
          options: [
            { id: 'a', text: 'Covalent bond', correct: true },
            { id: 'b', text: 'Ionic bond', correct: false },
            { id: 'c', text: 'Metallic bond', correct: false },
            { id: 'd', text: 'Hydrogen bond', correct: false }
          ],
          explanation: 'A covalent bond forms when two atoms share one or more pairs of electrons.'
        },
        {
          id: 'chem-8',
          question: 'Which functional group is present in alcohols?',
          type: 'multiple-choice',
          options: [
            { id: 'a', text: '-OH (Hydroxyl)', correct: true },
            { id: 'b', text: '-COOH (Carboxyl)', correct: false },
            { id: 'c', text: '-NH₂ (Amino)', correct: false },
            { id: 'd', text: '=O (Carbonyl)', correct: false }
          ],
          explanation: 'Alcohols contain the hydroxyl functional group (-OH) bonded to a carbon atom.'
        },
        {
          id: 'chem-9',
          question: 'What is produced when an acid reacts with a base?',
          type: 'multiple-choice',
          options: [
            { id: 'a', text: 'Salt and water', correct: true },
            { id: 'b', text: 'Only salt', correct: false },
            { id: 'c', text: 'Only water', correct: false },
            { id: 'd', text: 'Carbon dioxide and water', correct: false }
          ],
          explanation: 'A neutralization reaction between an acid and a base produces a salt and water.'
        },
        {
          id: 'chem-10',
          question: 'Which element is the most abundant in Earth\'s atmosphere?',
          type: 'multiple-choice',
          options: [
            { id: 'a', text: 'Nitrogen (N₂)', correct: true },
            { id: 'b', text: 'Oxygen (O₂)', correct: false },
            { id: 'c', text: 'Carbon dioxide (CO₂)', correct: false },
            { id: 'd', text: 'Argon (Ar)', correct: false }
          ],
          explanation: 'Nitrogen makes up about 78% of Earth\'s atmosphere, while oxygen is about 21%.'
        }
      ]
    },
    {
      id: 5,
      subject: 'Mathematics Advanced',
      topic: 'Algebra',
      difficulty: 'Easy',
      questionCount: 10,
      estimatedTime: '20 mins',
      description: 'Quadratic equations and factoring',
      icon: '📐',
      questions: [
        {
          id: 'alg-1',
          question: 'Factor: x² + 5x + 6',
          type: 'multiple-choice',
          options: [
            { id: 'a', text: '(x + 2)(x + 3)', correct: true },
            { id: 'b', text: '(x + 1)(x + 6)', correct: false },
            { id: 'c', text: '(x - 2)(x - 3)', correct: false },
            { id: 'd', text: '(x + 5)(x + 1)', correct: false }
          ],
          explanation: 'We need two numbers that multiply to 6 and add to 5. Those numbers are 2 and 3, so x² + 5x + 6 = (x + 2)(x + 3).'
        },
        {
          id: 'alg-2',
          question: 'Solve for x: 2x + 8 = 20',
          type: 'multiple-choice',
          options: [
            { id: 'a', text: 'x = 6', correct: true },
            { id: 'b', text: 'x = 4', correct: false },
            { id: 'c', text: 'x = 12', correct: false },
            { id: 'd', text: 'x = 14', correct: false }
          ],
          explanation: '2x + 8 = 20 → 2x = 12 → x = 6.'
        },
        {
          id: 'alg-3',
          question: 'What is the vertex of the parabola y = (x - 3)² + 2?',
          type: 'multiple-choice',
          options: [
            { id: 'a', text: '(3, 2)', correct: true },
            { id: 'b', text: '(-3, 2)', correct: false },
            { id: 'c', text: '(3, -2)', correct: false },
            { id: 'd', text: '(2, 3)', correct: false }
          ],
          explanation: 'In vertex form y = (x - h)² + k, the vertex is (h, k). So the vertex is (3, 2).'
        },
        {
          id: 'alg-4',
          question: 'Simplify: 3x² + 2x² - x²',
          type: 'multiple-choice',
          options: [
            { id: 'a', text: '4x²', correct: true },
            { id: 'b', text: '3x²', correct: false },
            { id: 'c', text: '5x²', correct: false },
            { id: 'd', text: '6x²', correct: false }
          ],
          explanation: 'Combine like terms: 3x² + 2x² - x² = (3 + 2 - 1)x² = 4x².'
        },
        {
          id: 'alg-5',
          question: 'What is the discriminant of x² - 4x + 4 = 0?',
          type: 'multiple-choice',
          options: [
            { id: 'a', text: '0', correct: true },
            { id: 'b', text: '4', correct: false },
            { id: 'c', text: '-4', correct: false },
            { id: 'd', text: '16', correct: false }
          ],
          explanation: 'The discriminant is b² - 4ac = (-4)² - 4(1)(4) = 16 - 16 = 0. This means there is one repeated root.'
        },
        {
          id: 'alg-6',
          question: 'Expand: (x + 3)(x - 2)',
          type: 'multiple-choice',
          options: [
            { id: 'a', text: 'x² + x - 6', correct: true },
            { id: 'b', text: 'x² - x - 6', correct: false },
            { id: 'c', text: 'x² + 5x - 6', correct: false },
            { id: 'd', text: 'x² - 6', correct: false }
          ],
          explanation: 'Using FOIL: (x + 3)(x - 2) = x² - 2x + 3x - 6 = x² + x - 6.'
        },
        {
          id: 'alg-7',
          question: 'What are the solutions to x² - 9 = 0?',
          type: 'multiple-choice',
          options: [
            { id: 'a', text: 'x = 3 and x = -3', correct: true },
            { id: 'b', text: 'x = 9 and x = -9', correct: false },
            { id: 'c', text: 'x = 3 only', correct: false },
            { id: 'd', text: 'No real solutions', correct: false }
          ],
          explanation: 'x² - 9 = 0 can be written as (x + 3)(x - 3) = 0, so x = 3 or x = -3.'
        },
        {
          id: 'alg-8',
          question: 'Simplify: (2x³)²',
          type: 'multiple-choice',
          options: [
            { id: 'a', text: '4x⁶', correct: true },
            { id: 'b', text: '2x⁶', correct: false },
            { id: 'c', text: '4x⁵', correct: false },
            { id: 'd', text: '2x⁵', correct: false }
          ],
          explanation: '(2x³)² = 2² × (x³)² = 4 × x⁶ = 4x⁶.'
        },
        {
          id: 'alg-9',
          question: 'What is the slope of the line 3x + 2y = 12?',
          type: 'multiple-choice',
          options: [
            { id: 'a', text: '-3/2', correct: true },
            { id: 'b', text: '3/2', correct: false },
            { id: 'c', text: '-2/3', correct: false },
            { id: 'd', text: '2/3', correct: false }
          ],
          explanation: 'Rearrange to y = mx + b form: 2y = -3x + 12, so y = -3/2 x + 6. The slope is -3/2.'
        },
        {
          id: 'alg-10',
          question: 'Solve: |x - 5| = 3',
          type: 'multiple-choice',
          options: [
            { id: 'a', text: 'x = 8 or x = 2', correct: true },
            { id: 'b', text: 'x = 8 only', correct: false },
            { id: 'c', text: 'x = 2 only', correct: false },
            { id: 'd', text: 'x = 5', correct: false }
          ],
          explanation: 'For |x - 5| = 3: either x - 5 = 3 (so x = 8) or x - 5 = -3 (so x = 2).'
        }
      ]
    },
    {
      id: 6,
      subject: 'Physics',
      topic: 'Thermodynamics',
      difficulty: 'Hard',
      questionCount: 10,
      estimatedTime: '40 mins',
      description: 'Heat transfer and energy',
      icon: '⚡',
      questions: [
        {
          id: 'therm-1',
          question: 'Which law of thermodynamics states that energy cannot be created or destroyed?',
          type: 'multiple-choice',
          options: [
            { id: 'a', text: 'First Law', correct: true },
            { id: 'b', text: 'Second Law', correct: false },
            { id: 'c', text: 'Third Law', correct: false },
            { id: 'd', text: 'Zeroth Law', correct: false }
          ],
          explanation: 'The First Law of Thermodynamics is the law of conservation of energy: energy cannot be created or destroyed, only transformed.'
        },
        {
          id: 'therm-2',
          question: 'What is entropy?',
          type: 'multiple-choice',
          options: [
            { id: 'a', text: 'A measure of disorder or randomness in a system', correct: true },
            { id: 'b', text: 'The total energy of a system', correct: false },
            { id: 'c', text: 'The temperature of a system', correct: false },
            { id: 'd', text: 'The pressure of a gas', correct: false }
          ],
          explanation: 'Entropy is a measure of the disorder or randomness in a system. The Second Law states that entropy always increases in an isolated system.'
        },
        {
          id: 'therm-3',
          question: 'How much heat is required to raise the temperature of 2 kg of water by 10°C? (Specific heat capacity of water = 4200 J/kg°C)',
          type: 'multiple-choice',
          options: [
            { id: 'a', text: '84,000 J', correct: true },
            { id: 'b', text: '42,000 J', correct: false },
            { id: 'c', text: '8,400 J', correct: false },
            { id: 'd', text: '4,200 J', correct: false }
          ],
          explanation: 'Q = mcΔT = 2 kg × 4200 J/kg°C × 10°C = 84,000 J.'
        },
        {
          id: 'therm-4',
          question: 'In which process does a gas expand without heat exchange with surroundings?',
          type: 'multiple-choice',
          options: [
            { id: 'a', text: 'Adiabatic process', correct: true },
            { id: 'b', text: 'Isothermal process', correct: false },
            { id: 'c', text: 'Isobaric process', correct: false },
            { id: 'd', text: 'Isochoric process', correct: false }
          ],
          explanation: 'An adiabatic process occurs without heat transfer (Q = 0). The system is thermally isolated from its surroundings.'
        },
        {
          id: 'therm-5',
          question: 'What is the efficiency of a Carnot engine operating between 400K and 300K?',
          type: 'multiple-choice',
          options: [
            { id: 'a', text: '25%', correct: true },
            { id: 'b', text: '75%', correct: false },
            { id: 'c', text: '33%', correct: false },
            { id: 'd', text: '50%', correct: false }
          ],
          explanation: 'Carnot efficiency = 1 - (Tc/Th) = 1 - (300/400) = 1 - 0.75 = 0.25 = 25%.'
        },
        {
          id: 'therm-6',
          question: 'What is the Zeroth Law of Thermodynamics?',
          type: 'multiple-choice',
          options: [
            { id: 'a', text: 'If A is in thermal equilibrium with B, and B with C, then A is in equilibrium with C', correct: true },
            { id: 'b', text: 'Energy cannot be created or destroyed', correct: false },
            { id: 'c', text: 'Entropy always increases', correct: false },
            { id: 'd', text: 'Absolute zero cannot be reached', correct: false }
          ],
          explanation: 'The Zeroth Law defines thermal equilibrium and allows us to define temperature.'
        },
        {
          id: 'therm-7',
          question: 'What is latent heat?',
          type: 'multiple-choice',
          options: [
            { id: 'a', text: 'Heat absorbed or released during a phase change without temperature change', correct: true },
            { id: 'b', text: 'Heat that increases temperature', correct: false },
            { id: 'c', text: 'Heat lost to surroundings', correct: false },
            { id: 'd', text: 'Heat generated by friction', correct: false }
          ],
          explanation: 'Latent heat is the energy absorbed or released during a phase change (e.g., melting, boiling) without changing temperature.'
        },
        {
          id: 'therm-8',
          question: 'Which has higher specific heat capacity: water or iron?',
          type: 'multiple-choice',
          options: [
            { id: 'a', text: 'Water', correct: true },
            { id: 'b', text: 'Iron', correct: false },
            { id: 'c', text: 'They are equal', correct: false },
            { id: 'd', text: 'It depends on temperature', correct: false }
          ],
          explanation: 'Water has a very high specific heat capacity (4200 J/kg°C) compared to iron (450 J/kg°C).'
        },
        {
          id: 'therm-9',
          question: 'In an isothermal process for an ideal gas, which remains constant?',
          type: 'multiple-choice',
          options: [
            { id: 'a', text: 'Temperature', correct: true },
            { id: 'b', text: 'Pressure', correct: false },
            { id: 'c', text: 'Volume', correct: false },
            { id: 'd', text: 'Entropy', correct: false }
          ],
          explanation: 'In an isothermal process, the temperature remains constant throughout the process.'
        },
        {
          id: 'therm-10',
          question: 'What does the Third Law of Thermodynamics state?',
          type: 'multiple-choice',
          options: [
            { id: 'a', text: 'The entropy of a perfect crystal at absolute zero is zero', correct: true },
            { id: 'b', text: 'Energy is conserved', correct: false },
            { id: 'c', text: 'Entropy always increases', correct: false },
            { id: 'd', text: 'Heat flows from hot to cold', correct: false }
          ],
          explanation: 'The Third Law states that as temperature approaches absolute zero (0 K), the entropy of a perfect crystal approaches zero.'
        }
      ]
    },
    {
      id: 7,
      subject: 'Biology',
      topic: 'Cell Biology',
      difficulty: 'Medium',
      questionCount: 10,
      estimatedTime: '40 mins',
      description: 'Cell structure and function',
      icon: '🧬',
      questions: [
        {
          id: 'bio-1',
          question: 'What is the main function of mitochondria?',
          type: 'multiple-choice',
          options: [
            { id: 'a', text: 'Cellular respiration and ATP production', correct: true },
            { id: 'b', text: 'Protein synthesis', correct: false },
            { id: 'c', text: 'Photosynthesis', correct: false },
            { id: 'd', text: 'DNA storage', correct: false }
          ],
          explanation: 'Mitochondria are the powerhouse of the cell, producing ATP through cellular respiration.'
        },
        {
          id: 'bio-2',
          question: 'Which organelle is responsible for protein synthesis?',
          type: 'multiple-choice',
          options: [
            { id: 'a', text: 'Ribosomes', correct: true },
            { id: 'b', text: 'Golgi apparatus', correct: false },
            { id: 'c', text: 'Lysosomes', correct: false },
            { id: 'd', text: 'Vacuoles', correct: false }
          ],
          explanation: 'Ribosomes are the sites of protein synthesis, translating mRNA into proteins.'
        },
        {
          id: 'bio-3',
          question: 'What is the function of the cell membrane?',
          type: 'multiple-choice',
          options: [
            { id: 'a', text: 'Controls what enters and exits the cell', correct: true },
            { id: 'b', text: 'Stores genetic information', correct: false },
            { id: 'c', text: 'Produces energy', correct: false },
            { id: 'd', text: 'Synthesizes lipids', correct: false }
          ],
          explanation: 'The cell membrane is selectively permeable, controlling the movement of substances in and out of the cell.'
        },
        {
          id: 'bio-4',
          question: 'What is photosynthesis?',
          type: 'multiple-choice',
          options: [
            { id: 'a', text: 'The process of converting light energy into chemical energy', correct: true },
            { id: 'b', text: 'The breakdown of glucose', correct: false },
            { id: 'c', text: 'The production of proteins', correct: false },
            { id: 'd', text: 'Cell division', correct: false }
          ],
          explanation: 'Photosynthesis converts light energy (usually from the sun) into chemical energy stored in glucose.'
        },
        {
          id: 'bio-5',
          question: 'What are the building blocks of proteins?',
          type: 'multiple-choice',
          options: [
            { id: 'a', text: 'Amino acids', correct: true },
            { id: 'b', text: 'Nucleotides', correct: false },
            { id: 'c', text: 'Fatty acids', correct: false },
            { id: 'd', text: 'Monosaccharides', correct: false }
          ],
          explanation: 'Proteins are polymers made up of amino acid monomers linked by peptide bonds.'
        },
        {
          id: 'bio-6',
          question: 'What is the function of DNA?',
          type: 'multiple-choice',
          options: [
            { id: 'a', text: 'Stores and transmits genetic information', correct: true },
            { id: 'b', text: 'Provides immediate energy', correct: false },
            { id: 'c', text: 'Catalyzes reactions', correct: false },
            { id: 'd', text: 'Forms cell membranes', correct: false }
          ],
          explanation: 'DNA (deoxyribonucleic acid) stores genetic information and transmits it to offspring.'
        },
        {
          id: 'bio-7',
          question: 'Which process allows cells to divide for growth and repair?',
          type: 'multiple-choice',
          options: [
            { id: 'a', text: 'Mitosis', correct: true },
            { id: 'b', text: 'Meiosis', correct: false },
            { id: 'c', text: 'Osmosis', correct: false },
            { id: 'd', text: 'Diffusion', correct: false }
          ],
          explanation: 'Mitosis is the process of cell division that produces two identical daughter cells for growth and repair.'
        },
        {
          id: 'bio-8',
          question: 'What is an enzyme?',
          type: 'multiple-choice',
          options: [
            { id: 'a', text: 'A biological catalyst that speeds up reactions', correct: true },
            { id: 'b', text: 'A type of lipid', correct: false },
            { id: 'c', text: 'A storage molecule', correct: false },
            { id: 'd', text: 'A genetic material', correct: false }
          ],
          explanation: 'Enzymes are proteins that act as biological catalysts, speeding up chemical reactions without being consumed.'
        },
        {
          id: 'bio-9',
          question: 'What is the process by which water moves across a membrane?',
          type: 'multiple-choice',
          options: [
            { id: 'a', text: 'Osmosis', correct: true },
            { id: 'b', text: 'Active transport', correct: false },
            { id: 'c', text: 'Endocytosis', correct: false },
            { id: 'd', text: 'Facilitated diffusion', correct: false }
          ],
          explanation: 'Osmosis is the diffusion of water molecules across a selectively permeable membrane from high to low concentration.'
        },
        {
          id: 'bio-10',
          question: 'What is the primary function of chloroplasts?',
          type: 'multiple-choice',
          options: [
            { id: 'a', text: 'Photosynthesis', correct: true },
            { id: 'b', text: 'Cellular respiration', correct: false },
            { id: 'c', text: 'Protein synthesis', correct: false },
            { id: 'd', text: 'Lipid storage', correct: false }
          ],
          explanation: 'Chloroplasts are the organelles where photosynthesis occurs in plant cells, containing chlorophyll.'
        }
      ]
    },
    {
      id: 8,
      subject: 'Modern History',
      topic: 'World War I',
      difficulty: 'Medium',
      questionCount: 10,
      estimatedTime: '45 mins',
      description: 'Causes, events, and impacts of WWI',
      icon: '📜',
      questions: [
        {
          id: 'hist-1',
          question: 'In what year did World War I begin?',
          type: 'multiple-choice',
          options: [
            { id: 'a', text: '1914', correct: true },
            { id: 'b', text: '1912', correct: false },
            { id: 'c', text: '1916', correct: false },
            { id: 'd', text: '1918', correct: false }
          ],
          explanation: 'World War I began in 1914 following the assassination of Archduke Franz Ferdinand.'
        },
        {
          id: 'hist-2',
          question: 'What event triggered the start of World War I?',
          type: 'multiple-choice',
          options: [
            { id: 'a', text: 'Assassination of Archduke Franz Ferdinand', correct: true },
            { id: 'b', text: 'Sinking of the Lusitania', correct: false },
            { id: 'c', text: 'German invasion of Poland', correct: false },
            { id: 'd', text: 'Treaty of Versailles', correct: false }
          ],
          explanation: 'The assassination of Archduke Franz Ferdinand of Austria in Sarajevo on June 28, 1914, triggered WWI.'
        },
        {
          id: 'hist-3',
          question: 'Which alliance system existed before WWI?',
          type: 'multiple-choice',
          options: [
            { id: 'a', text: 'Triple Alliance and Triple Entente', correct: true },
            { id: 'b', text: 'NATO and Warsaw Pact', correct: false },
            { id: 'c', text: 'Axis and Allies', correct: false },
            { id: 'd', text: 'League of Nations', correct: false }
          ],
          explanation: 'The Triple Alliance (Germany, Austria-Hungary, Italy) and Triple Entente (France, Russia, Britain) were the major alliances.'
        },
        {
          id: 'hist-4',
          question: 'What was trench warfare?',
          type: 'multiple-choice',
          options: [
            { id: 'a', text: 'A type of combat where armies fought from defensive ditches', correct: true },
            { id: 'b', text: 'Naval battles', correct: false },
            { id: 'c', text: 'Aerial combat', correct: false },
            { id: 'd', text: 'Guerrilla warfare', correct: false }
          ],
          explanation: 'Trench warfare involved soldiers fighting from systems of defensive trenches, characteristic of WWI.'
        },
        {
          id: 'hist-5',
          question: 'When did the United States enter World War I?',
          type: 'multiple-choice',
          options: [
            { id: 'a', text: '1917', correct: true },
            { id: 'b', text: '1914', correct: false },
            { id: 'c', text: '1915', correct: false },
            { id: 'd', text: '1918', correct: false }
          ],
          explanation: 'The United States entered WWI in April 1917, helping to tip the balance toward the Allies.'
        },
        {
          id: 'hist-6',
          question: 'What was the Treaty of Versailles?',
          type: 'multiple-choice',
          options: [
            { id: 'a', text: 'The peace treaty that ended World War I', correct: true },
            { id: 'b', text: 'The treaty that started WWI', correct: false },
            { id: 'c', text: 'A military alliance', correct: false },
            { id: 'd', text: 'A trade agreement', correct: false }
          ],
          explanation: 'The Treaty of Versailles (1919) officially ended WWI and imposed harsh penalties on Germany.'
        },
        {
          id: 'hist-7',
          question: 'What new weapon was introduced during WWI?',
          type: 'multiple-choice',
          options: [
            { id: 'a', text: 'Chemical weapons (poison gas)', correct: true },
            { id: 'b', text: 'Nuclear weapons', correct: false },
            { id: 'c', text: 'Drones', correct: false },
            { id: 'd', text: 'Missiles', correct: false }
          ],
          explanation: 'WWI saw the first large-scale use of chemical weapons, including chlorine and mustard gas.'
        },
        {
          id: 'hist-8',
          question: 'What was the Western Front?',
          type: 'multiple-choice',
          options: [
            { id: 'a', text: 'The main theater of war in France and Belgium', correct: true },
            { id: 'b', text: 'The war in the Pacific', correct: false },
            { id: 'c', text: 'The war in Africa', correct: false },
            { id: 'd', text: 'The war in the Middle East', correct: false }
          ],
          explanation: 'The Western Front was the main theater of WWI, stretching through France and Belgium.'
        },
        {
          id: 'hist-9',
          question: 'What does ANZAC stand for?',
          type: 'multiple-choice',
          options: [
            { id: 'a', text: 'Australian and New Zealand Army Corps', correct: true },
            { id: 'b', text: 'Allied Nations Zealous Attack Corps', correct: false },
            { id: 'c', text: 'Asia-Pacific Naval and Air Command', correct: false },
            { id: 'd', text: 'Australian Naval Zone Artillery Command', correct: false }
          ],
          explanation: 'ANZAC stands for Australian and New Zealand Army Corps, famous for their role at Gallipoli.'
        },
        {
          id: 'hist-10',
          question: 'When did World War I end?',
          type: 'multiple-choice',
          options: [
            { id: 'a', text: 'November 11, 1918', correct: true },
            { id: 'b', text: 'December 25, 1918', correct: false },
            { id: 'c', text: 'January 1, 1919', correct: false },
            { id: 'd', text: 'May 8, 1917', correct: false }
          ],
          explanation: 'WWI ended on November 11, 1918, with the armistice (ceasefire) at 11am - the 11th hour of the 11th day of the 11th month.'
        }
      ]
    },
    {
      id: 9,
      subject: 'Economics',
      topic: 'Microeconomics',
      difficulty: 'Medium',
      questionCount: 10,
      estimatedTime: '40 mins',
      description: 'Supply, demand, and market structures',
      icon: '💰',
      questions: [
        {
          id: 'econ-1',
          question: 'What is the law of demand?',
          type: 'multiple-choice',
          options: [
            { id: 'a', text: 'As price increases, quantity demanded decreases', correct: true },
            { id: 'b', text: 'As price increases, quantity demanded increases', correct: false },
            { id: 'c', text: 'Price and demand are unrelated', correct: false },
            { id: 'd', text: 'Demand is always constant', correct: false }
          ],
          explanation: 'The law of demand states that, ceteris paribus, as the price of a good increases, the quantity demanded decreases.'
        },
        {
          id: 'econ-2',
          question: 'What is opportunity cost?',
          type: 'multiple-choice',
          options: [
            { id: 'a', text: 'The value of the next best alternative forgone', correct: true },
            { id: 'b', text: 'The total cost of production', correct: false },
            { id: 'c', text: 'The market price of a good', correct: false },
            { id: 'd', text: 'The cost of labor', correct: false }
          ],
          explanation: 'Opportunity cost is the value of the next best alternative that must be given up when making a choice.'
        },
        {
          id: 'econ-3',
          question: 'What happens at market equilibrium?',
          type: 'multiple-choice',
          options: [
            { id: 'a', text: 'Quantity supplied equals quantity demanded', correct: true },
            { id: 'b', text: 'Supply exceeds demand', correct: false },
            { id: 'c', text: 'Demand exceeds supply', correct: false },
            { id: 'd', text: 'Prices are at their maximum', correct: false }
          ],
          explanation: 'Market equilibrium occurs when quantity supplied equals quantity demanded at a particular price.'
        },
        {
          id: 'econ-4',
          question: 'What is a monopoly?',
          type: 'multiple-choice',
          options: [
            { id: 'a', text: 'A market structure with a single seller', correct: true },
            { id: 'b', text: 'A market with many sellers', correct: false },
            { id: 'c', text: 'A market with two sellers', correct: false },
            { id: 'd', text: 'Perfect competition', correct: false }
          ],
          explanation: 'A monopoly is a market structure where there is only one seller of a product with no close substitutes.'
        },
        {
          id: 'econ-5',
          question: 'What is elasticity of demand?',
          type: 'multiple-choice',
          options: [
            { id: 'a', text: 'A measure of how responsive quantity demanded is to price changes', correct: true },
            { id: 'b', text: 'The total amount demanded', correct: false },
            { id: 'c', text: 'The slope of the supply curve', correct: false },
            { id: 'd', text: 'The production cost', correct: false }
          ],
          explanation: 'Price elasticity of demand measures how sensitive the quantity demanded is to changes in price.'
        },
        {
          id: 'econ-6',
          question: 'What are normal goods?',
          type: 'multiple-choice',
          options: [
            { id: 'a', text: 'Goods whose demand increases as income increases', correct: true },
            { id: 'b', text: 'Goods whose demand decreases as income increases', correct: false },
            { id: 'c', text: 'Goods that are not taxed', correct: false },
            { id: 'd', text: 'Goods produced domestically', correct: false }
          ],
          explanation: 'Normal goods have a positive income elasticity - demand rises as consumer income increases.'
        },
        {
          id: 'econ-7',
          question: 'What is the law of supply?',
          type: 'multiple-choice',
          options: [
            { id: 'a', text: 'As price increases, quantity supplied increases', correct: true },
            { id: 'b', text: 'As price increases, quantity supplied decreases', correct: false },
            { id: 'c', text: 'Supply is always constant', correct: false },
            { id: 'd', text: 'Price and supply are unrelated', correct: false }
          ],
          explanation: 'The law of supply states that, ceteris paribus, as price increases, producers are willing to supply more.'
        },
        {
          id: 'econ-8',
          question: 'What causes a shift in the demand curve?',
          type: 'multiple-choice',
          options: [
            { id: 'a', text: 'Changes in consumer income, preferences, or related goods prices', correct: true },
            { id: 'b', text: 'Changes in the price of the good itself', correct: false },
            { id: 'c', text: 'Changes in production costs', correct: false },
            { id: 'd', text: 'Changes in technology', correct: false }
          ],
          explanation: 'A shift in demand is caused by factors other than the good\'s own price, such as income, preferences, or prices of substitutes.'
        },
        {
          id: 'econ-9',
          question: 'What is marginal utility?',
          type: 'multiple-choice',
          options: [
            { id: 'a', text: 'The additional satisfaction from consuming one more unit', correct: true },
            { id: 'b', text: 'The total satisfaction from all units consumed', correct: false },
            { id: 'c', text: 'The average satisfaction per unit', correct: false },
            { id: 'd', text: 'The cost of production', correct: false }
          ],
          explanation: 'Marginal utility is the additional satisfaction or benefit gained from consuming one additional unit of a good.'
        },
        {
          id: 'econ-10',
          question: 'What is a price ceiling?',
          type: 'multiple-choice',
          options: [
            { id: 'a', text: 'A maximum legal price set below equilibrium', correct: true },
            { id: 'b', text: 'A minimum legal price set above equilibrium', correct: false },
            { id: 'c', text: 'The highest price consumers will pay', correct: false },
            { id: 'd', text: 'The equilibrium price', correct: false }
          ],
          explanation: 'A price ceiling is a maximum legal price, typically set below equilibrium to make goods more affordable (e.g., rent control).'
        }
      ]
    }
  ]

  const filteredQuestions = practiceQuestions.filter(q => {
    const matchSubject = selectedSubject === 'All' || q.subject === selectedSubject
    const matchDifficulty = selectedDifficulty === 'All' || q.difficulty === selectedDifficulty
    return matchSubject && matchDifficulty
  })

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return '#48bb78'
      case 'Medium': return '#ed8936'
      case 'Hard': return '#f56565'
      default: return '#718096'
    }
  }

  const handleStartPractice = (practiceSet) => {
    setActivePracticeSet(practiceSet)
    setCurrentQuestionIndex(0)
    setSelectedAnswers({})
    setShowResults(false)
  }

  const handleAnswerSelect = (questionId, optionId) => {
    if (!showResults) {
      setSelectedAnswers(prev => ({
        ...prev,
        [questionId]: optionId
      }))
    }
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < activePracticeSet.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  const handleSubmitPractice = () => {
    // Prepare questions with answers for incorrect question tracking
    const questionsWithAnswers = activePracticeSet.questions.map(q => ({
      question: q,
      selectedOptionId: selectedAnswers[q.id]
    }))
    
    // Add incorrect questions to the review list
    const addedIncorrectQuestions = addIncorrectQuestionsFromPractice(
      activePracticeSet,
      questionsWithAnswers
    )
    
    // Show notification if questions were added to incorrect list
    if (addedIncorrectQuestions.length > 0) {
      console.log(`Added ${addedIncorrectQuestions.length} incorrect question(s) to review list`)
    }
    
    setShowResults(true)
  }

  const handleBackToSets = () => {
    setActivePracticeSet(null)
    setCurrentQuestionIndex(0)
    setSelectedAnswers({})
    setShowResults(false)
  }

  const calculateScore = () => {
    let correct = 0
    activePracticeSet.questions.forEach(q => {
      const selectedOption = q.options.find(opt => opt.id === selectedAnswers[q.id])
      if (selectedOption && selectedOption.correct) {
        correct++
      }
    })
    return {
      correct,
      total: activePracticeSet.questions.length,
      percentage: Math.round((correct / activePracticeSet.questions.length) * 100)
    }
  }

  // If a practice set is active, show the question interface
  if (activePracticeSet) {
    const currentQuestion = activePracticeSet.questions[currentQuestionIndex]
    const isAnswered = selectedAnswers[currentQuestion.id] !== undefined
    const allAnswered = activePracticeSet.questions.every(q => selectedAnswers[q.id] !== undefined)

    // Show results screen
    if (showResults) {
      const score = calculateScore()
      const incorrectCount = score.total - score.correct
      
      return (
        <div className="practice-results-container">
          <div className="results-header">
            <h2>🎉 Practice Complete!</h2>
            <div className="score-circle-large">
              <span className="score-percentage">{score.percentage}%</span>
              <span className="score-label">{score.correct}/{score.total} correct</span>
            </div>
          </div>

          {incorrectCount > 0 && (
            <div className="incorrect-questions-notice">
              <div className="notice-icon">📚</div>
              <div className="notice-text">
                <strong>{incorrectCount} question{incorrectCount > 1 ? 's' : ''} added to your Review Mistakes list</strong>
                <p>You can review {incorrectCount > 1 ? 'them' : 'it'} in the "Review Mistakes" tab to improve your understanding.</p>
              </div>
            </div>
          )}

          <div className="results-questions-list">
            {activePracticeSet.questions.map((question, index) => {
              const selectedOption = question.options.find(opt => opt.id === selectedAnswers[question.id])
              const isCorrect = selectedOption && selectedOption.correct
              const correctOption = question.options.find(opt => opt.correct)

              return (
                <div key={question.id} className={`result-question-item ${isCorrect ? 'correct' : 'incorrect'}`}>
                  <div className="result-question-header">
                    <span className="result-icon">{isCorrect ? '✅' : '❌'}</span>
                    <h4>Question {index + 1}: {question.question}</h4>
                  </div>
                  
                  <div className="result-answer-info">
                    <div className="answer-row">
                      <span className="answer-label">Your Answer:</span>
                      <span className={`answer-value ${isCorrect ? 'correct-answer' : 'incorrect-answer'}`}>
                        {selectedOption ? selectedOption.text : 'No answer'}
                      </span>
                    </div>
                    {!isCorrect && (
                      <div className="answer-row">
                        <span className="answer-label">Correct Answer:</span>
                        <span className="answer-value correct-answer">{correctOption.text}</span>
                      </div>
                    )}
                  </div>

                  <div className="result-explanation">
                    <strong>Explanation:</strong> {question.explanation}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="results-actions">
            <button className="btn-back-to-sets" onClick={handleBackToSets}>
              ← Back to Practice Sets
            </button>
            <button className="btn-retry" onClick={() => {
              setCurrentQuestionIndex(0)
              setSelectedAnswers({})
              setShowResults(false)
            }}>
              🔄 Try Again
            </button>
          </div>
        </div>
      )
    }

    // Show question interface
    return (
      <div className="practice-question-interface">
        <div className="practice-interface-header">
          <button className="btn-back" onClick={handleBackToSets}>
            ← Back to Practice Sets
          </button>
          <div className="practice-progress">
            <span>Question {currentQuestionIndex + 1} of {activePracticeSet.questions.length}</span>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${((currentQuestionIndex + 1) / activePracticeSet.questions.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="question-card-practice">
          <div className="question-header-practice">
            <h3>{activePracticeSet.topic} - {activePracticeSet.subject}</h3>
            <span 
              className="difficulty-badge-practice"
              style={{ backgroundColor: getDifficultyColor(activePracticeSet.difficulty) }}
            >
              {activePracticeSet.difficulty}
            </span>
          </div>

          <div className="question-content-practice">
            <h2 className="question-text">{currentQuestion.question}</h2>

            <div className="options-list">
              {currentQuestion.options.map(option => (
                <div
                  key={option.id}
                  className={`option-item ${selectedAnswers[currentQuestion.id] === option.id ? 'selected' : ''}`}
                  onClick={() => handleAnswerSelect(currentQuestion.id, option.id)}
                >
                  <div className="option-indicator">
                    {selectedAnswers[currentQuestion.id] === option.id ? '●' : '○'}
                  </div>
                  <div className="option-text">{option.text}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="question-navigation">
            <button 
              className="btn-nav-question" 
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
            >
              ← Previous
            </button>
            
            {currentQuestionIndex < activePracticeSet.questions.length - 1 ? (
              <button 
                className="btn-nav-question btn-next" 
                onClick={handleNextQuestion}
                disabled={!isAnswered}
              >
                Next →
              </button>
            ) : (
              <button 
                className="btn-submit-practice" 
                onClick={handleSubmitPractice}
                disabled={!allAnswered}
              >
                Submit Practice
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Default view: show practice sets grid
  return (
    <div className="practice-questions-container">
      <div className="practice-header">
        <h3>📝 Practice Questions</h3>
        <p>Strengthen your understanding with targeted practice exercises</p>
      </div>

      {/* Filters */}
      <div className="practice-filters">
        <div className="filter-group">
          <label>Subject:</label>
          <select 
            value={selectedSubject} 
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="filter-select"
          >
            {subjects.map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>Difficulty:</label>
          <select 
            value={selectedDifficulty} 
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="filter-select"
          >
            {difficulties.map(difficulty => (
              <option key={difficulty} value={difficulty}>{difficulty}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Practice Sets Grid */}
      <div className="practice-sets-grid">
        {filteredQuestions.map(question => (
          <div key={question.id} className="practice-set-card">
            <div className="practice-set-icon">{question.icon}</div>
            <div className="practice-set-content">
              <h4>{question.topic}</h4>
              <p className="practice-subject">{question.subject}</p>
              <p className="practice-description">{question.description}</p>
              
              <div className="practice-meta">
                <span className="practice-count">📊 {question.questionCount} questions</span>
                <span className="practice-time">⏱️ {question.estimatedTime}</span>
                <span 
                  className="practice-difficulty"
                  style={{ 
                    backgroundColor: getDifficultyColor(question.difficulty),
                    color: 'white',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '600'
                  }}
                >
                  {question.difficulty}
                </span>
              </div>

              <button 
                className="btn-start-practice"
                onClick={() => handleStartPractice(question)}
              >
                Start Practice
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredQuestions.length === 0 && (
        <div className="no-results">
          <p>No practice sets match your filters</p>
        </div>
      )}
    </div>
  )
}

export default StudyPlannerView

