import { useState } from "react";
import Quiz from "@/components/shared/Quiz";
import ProgressTracker from "@/components/shared/ProgressTracker";

const demoQuiz = {
  title: "JavaScript Fundamentals Quiz",
  questions: [
    {
      question: "What is the correct way to declare a variable in JavaScript?",
      options: [
        { text: "var myVar = 5;" },
        { text: "variable myVar = 5;" },
        { text: "v myVar = 5;" },
        { text: "dim myVar = 5;" },
      ],
    },
    {
      question: "Which method is used to add an element to the end of an array?",
      options: [
        { text: "array.add()" },
        { text: "array.push()" },
        { text: "array.append()" },
        { text: "array.insert()" },
      ],
    },
    {
      question: "What does '===' operator do in JavaScript?",
      options: [
        { text: "Assigns a value" },
        { text: "Compares values only" },
        { text: "Compares both value and type" },
        { text: "Checks if not equal" },
      ],
    },
  ],
  passingScore: 70,
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

export default function QuizDemoPage() {
  const [showQuiz, setShowQuiz] = useState(false);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Interactive Components Demo</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold mb-4">Progress Tracker</h2>
          <ProgressTracker
            modules={demoModules}
            progress={demoProgress}
            onLessonClick={(moduleIdx, lessonIdx) => {
              console.log(`Clicked: Module ${moduleIdx}, Lesson ${lessonIdx}`);
            }}
          />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Quiz Component</h2>
          {!showQuiz ? (
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <p className="text-muted-foreground mb-4">
                Interactive quiz with multiple choice questions
              </p>
              <button
                onClick={() => setShowQuiz(true)}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                Start Demo Quiz
              </button>
            </div>
          ) : (
            <Quiz quizId="demo" quiz={demoQuiz} />
          )}
        </div>
      </div>
    </div>
  );
}
