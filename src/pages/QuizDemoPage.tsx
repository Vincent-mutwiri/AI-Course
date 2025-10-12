import { useState, useEffect } from "react";
import { QuizProvider } from "@/contexts/QuizContext";
import EnhancedQuiz from "@/components/quiz/EnhancedQuiz";
import ProgressTracker from "@/components/shared/ProgressTracker";
import { Quiz } from "@/types/quiz";
import { Clock, CheckCircle } from "lucide-react";

// Demo quiz data matching our new schema
const demoQuiz: Quiz = {
  id: "demo-quiz-1",
  title: "JavaScript Fundamentals Quiz",
  description: "Test your knowledge of JavaScript fundamentals",
  passingScore: 70,
  timeLimit: 5, // 5 minutes
  questions: [
    {
      id: "q1",
      type: 'multiple-choice',
      question: "What is the correct way to declare a variable in JavaScript?",
      options: [
        "var myVar = 5;",
        "variable myVar = 5;",
        "v myVar = 5;",
        "dim myVar = 5;"
      ],
      correctAnswer: "var myVar = 5;",
      explanation: "The 'var' keyword is used to declare a variable in JavaScript. 'let' and 'const' are also valid but were introduced in ES6.",
      points: 10
    },
    {
      id: "q2",
      type: 'multiple-choice',
      question: "Which method is used to add an element to the end of an array?",
      options: [
        "array.add()",
        "array.push()",
        "array.append()",
        "array.insert()"
      ],
      correctAnswer: "array.push()",
      explanation: "The push() method adds one or more elements to the end of an array and returns the new length of the array.",
      points: 10
    },
    {
      id: "q3",
      type: 'multiple-choice',
      question: "What does '===' operator do in JavaScript?",
      options: [
        "Assigns a value",
        "Compares values only",
        "Compares both value and type",
        "Checks if not equal"
      ],
      correctAnswer: "Compares both value and type",
      explanation: "The '===' operator is a strict equality operator that checks both the value and the type of the operands.",
      points: 10
    },
    {
      id: "q4",
      type: 'true-false',
      question: "JavaScript is a statically typed language.",
      options: ["True", "False"],
      correctAnswer: "False",
      explanation: "JavaScript is a dynamically typed language, meaning variable types are determined at runtime.",
      points: 5
    },
    {
      id: "q5",
      type: 'short-answer',
      question: "What is the name of the JavaScript engine used in Google Chrome?",
      correctAnswer: "V8",
      explanation: "V8 is Google's open-source high-performance JavaScript and WebAssembly engine, written in C++.",
      points: 15
    }
  ]
};

const demoModules = [
  {
    title: "Introduction to JavaScript",
    lessons: [
      { title: "What is JavaScript?", duration: 15 },
      { title: "Variables and Data Types", duration: 20 },
      { title: "Operators", duration: 18 },
    ],
  },
  {
    title: "Control Flow",
    lessons: [
      { title: "If Statements", duration: 22 },
      { title: "Loops", duration: 25 },
      { title: "Switch Statements", duration: 15 },
    ],
  },
];

const demoProgress = [
  { lessonId: "0-0", completed: true },
  { lessonId: "0-1", completed: true },
  { lessonId: "0-2", completed: false },
];

// Wrapper component to provide quiz context
function QuizDemo() {
  const [showQuiz, setShowQuiz] = useState(false);
  const [quiz, setQuiz] = useState<Quiz | null>(null);

  // In a real app, you would fetch the quiz from an API
  useEffect(() => {
    // Simulate API call
    const fetchQuiz = async () => {
      // In a real app: const response = await fetch('/api/quiz/demo');
      // const data = await response.json();
      setQuiz(demoQuiz);
    };

    fetchQuiz();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4">
      <h1 className="text-3xl font-bold">Interactive Learning Platform</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold mb-4">Course Progress</h2>
          <ProgressTracker
            modules={demoModules}
            progress={demoProgress}
            onLessonClick={(moduleIdx, lessonIdx) => {
              console.log(`Clicked: Module ${moduleIdx}, Lesson ${lessonIdx}`);
            }}
          />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Knowledge Check</h2>
          {!showQuiz ? (
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <h3 className="text-lg font-medium mb-2">JavaScript Fundamentals Quiz</h3>
              <p className="text-muted-foreground mb-4">
                Test your understanding of JavaScript with this interactive quiz.
                {quiz?.timeLimit && ` You'll have ${quiz.timeLimit} minutes to complete it.`}
              </p>
              <div className="space-y-2 text-left mb-6">
                <p className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">
                    {quiz?.questions.length || 0}
                  </span>
                  Questions
                </p>
                {quiz?.timeLimit && (
                  <p className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    {quiz.timeLimit} minute time limit
                  </p>
                )}
                <p className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  Passing score: {quiz?.passingScore || 70}%
                </p>
              </div>
              <button
                onClick={() => setShowQuiz(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                disabled={!quiz}
              >
                {quiz ? "Start Quiz" : "Loading Quiz..."}
              </button>
            </div>
          ) : (
            <EnhancedQuiz 
              quizId={quiz?.id || 'demo'} 
              onComplete={(result) => {
                console.log('Quiz completed:', result);
                // Handle quiz completion (e.g., show results, update progress, etc.)
              }} 
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default function QuizDemoPage() {
  return (
    <QuizProvider initialQuiz={demoQuiz}>
      <QuizDemo />
    </QuizProvider>
  );
}
