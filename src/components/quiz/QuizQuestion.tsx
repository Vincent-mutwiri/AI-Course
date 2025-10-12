import React, { useState, useEffect } from 'react';
import { Question } from '../../types/quiz';

interface QuizQuestionProps {
  question: Question;
  selectedAnswer?: string | string[];
  onAnswer: (answer: string | string[]) => void;
  showResult?: boolean;
  correctAnswer?: string | string[];
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  selectedAnswer,
  onAnswer,
  showResult = false,
  correctAnswer,
}) => {
  const [selectedOptions, setSelectedOptions] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (question.type === 'multiple-choice' && Array.isArray(selectedAnswer)) {
      setSelectedOptions(new Set(selectedAnswer));
    } else if (selectedAnswer) {
      setSelectedOptions(new Set([selectedAnswer as string]));
    } else {
      setSelectedOptions(new Set());
    }
  }, [question.id, selectedAnswer]);

  const handleOptionSelect = (option: string) => {
    if (question.type === 'multiple-choice') {
      const newSelected = new Set(selectedOptions);
      if (newSelected.has(option)) {
        newSelected.delete(option);
      } else {
        newSelected.add(option);
      }
      onAnswer(Array.from(newSelected));
    } else {
      onAnswer(option);
    }
  };

  const isOptionSelected = (option: string) => {
    return selectedOptions.has(option);
  };

  const isOptionCorrect = (option: string) => {
    if (!showResult || !correctAnswer) return false;
    
    if (Array.isArray(correctAnswer)) {
      return correctAnswer.includes(option);
    }
    
    return option === correctAnswer;
  };

  const isOptionIncorrect = (option: string) => {
    if (!showResult || !selectedAnswer) return false;
    
    const wasSelected = Array.isArray(selectedAnswer)
      ? selectedAnswer.includes(option)
      : selectedAnswer === option;
      
    return wasSelected && !isOptionCorrect(option);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">{question.question}</h3>
      
      {question.type === 'short-answer' ? (
        <input
          type="text"
          value={selectedAnswer as string || ''}
          onChange={(e) => onAnswer(e.target.value)}
          className="w-full p-2 border rounded"
          disabled={showResult}
          placeholder="Type your answer..."
        />
      ) : (
        <div className="space-y-2">
          {question.options?.map((option) => (
            <div
              key={option}
              onClick={() => !showResult && handleOptionSelect(option)}
              className={`p-3 border rounded-md cursor-pointer transition-colors ${
                isOptionSelected(option)
                  ? 'bg-blue-100 border-blue-500'
                  : 'hover:bg-gray-50'
              } ${
                showResult
                  ? isOptionCorrect(option)
                    ? 'bg-green-50 border-green-500'
                    : isOptionIncorrect(option)
                    ? 'bg-red-50 border-red-500'
                    : ''
                  : ''
              }`}
            >
              {option}
            </div>
          ))}
        </div>
      )}
      
      {showResult && question.explanation && (
        <div className="mt-4 p-3 bg-blue-50 rounded-md">
          <p className="font-medium">Explanation:</p>
          <p>{question.explanation}</p>
        </div>
      )}
    </div>
  );
};

export default QuizQuestion;
