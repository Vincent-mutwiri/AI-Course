import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

type Scenario = {
  id: number;
  text: string;
  isPersonalized: boolean;
  selected: boolean | null;
};

export const IdentifyPersonalization = () => {
  const [scenarios, setScenarios] = useState<Scenario[]>([
    {
      id: 1,
      text: 'A math app that adjusts problem difficulty based on student performance',
      isPersonalized: true,
      selected: null,
    },
    {
      id: 2,
      text: 'A reading platform that suggests books based on reading level and interests',
      isPersonalized: true,
      selected: null,
    },
    {
      id: 3,
      text: 'A video lecture that plays the same content for all students',
      isPersonalized: false,
      selected: null,
    },
    {
      id: 4,
      text: 'A language learning app that adapts exercises based on common mistakes',
      isPersonalized: true,
      selected: null,
    },
  ]);

  const [score, setScore] = useState<number>(0);
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (id: number, isPersonalized: boolean) => {
    if (submitted) return;

    setScenarios(scenarios.map(scenario =>
      scenario.id === id
        ? { ...scenario, selected: isPersonalized }
        : scenario
    ));
  };

  const handleSubmit = () => {
    if (scenarios.some(s => s.selected === null)) {
      alert('Please answer all questions before submitting.');
      return;
    }
    setSubmitted(true);
    const calculatedScore = calculateScore();
    setScore(calculatedScore);
  };

  const calculateScore = (): number => {
    const correctCount = scenarios.filter(s => s.isPersonalized === s.selected).length;
    return Math.round((correctCount / scenarios.length) * 100);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground mb-4">
        For each scenario below, indicate whether it represents an example of AI personalization in education.
      </p>

      <div className="space-y-3">
        {scenarios.map((scenario) => (
          <Card
            key={scenario.id}
            className={`cursor-pointer transition-colors ${submitted
              ? scenario.isPersonalized
                ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                : 'border-red-500 bg-red-50 dark:bg-red-900/20'
              : scenario.selected !== null
                ? 'border-primary'
                : ''
              }`}
            onClick={() => handleSelect(scenario.id, true)}
          >
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className="flex-1">
                  <p className="font-medium">{scenario.text}</p>
                  {submitted && (
                    <p className="text-sm mt-1">
                      {scenario.isPersonalized
                        ? '✅ Personalized: AI adapts to individual needs'
                        : '❌ Not personalized: Same experience for everyone'}
                    </p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant={scenario.selected === true ? 'default' : 'outline'}
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelect(scenario.id, true);
                    }}
                  >
                    Personalized
                  </Button>
                  <Button
                    variant={scenario.selected === false ? 'default' : 'outline'}
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelect(scenario.id, false);
                    }}
                  >
                    Not Personalized
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {!submitted ? (
        <Button onClick={handleSubmit} className="mt-4">
          Check Answers
        </Button>
      ) : (
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h4 className="font-medium mb-2">
            Your score: {score}%
          </h4>
          <p className="text-sm text-muted-foreground">
            {score === 100
              ? 'Perfect! You have a great understanding of AI personalization in education.'
              : score >= 70
                ? 'Good job! Review the incorrect answers to improve your understanding.'
                : 'Keep practicing! Consider reviewing the module material before trying again.'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default IdentifyPersonalization;
