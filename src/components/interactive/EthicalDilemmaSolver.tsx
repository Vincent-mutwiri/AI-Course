import React, { useState, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Dilemma = {
  id: number;
  scenario: string;
  question: string;
  options: string[];
  considerations: string[];
};

const dilemmas: Dilemma[] = [
  {
    id: 1,
    scenario: 'A school is considering using an AI system that tracks students\' eye movements to detect when they\'re losing focus.',
    question: 'Should the school implement this system?',
    options: [
      'Yes, it will help teachers identify students who need help',
      'No, it invades students\' privacy',
      'Only with strict privacy controls and consent'
    ],
    considerations: [
      'Student privacy and consent',
      'Potential for misuse of data',
      'Impact on student-teacher relationships',
      'Effectiveness in improving learning outcomes',
      'Data security measures',
      'Potential benefits vs. privacy risks'
    ]
  },
  {
    id: 2,
    scenario: 'An AI tutoring system adapts to each student\'s learning style but requires extensive personal data collection.',
    question: 'What data collection practices would you recommend?',
    options: [
      'Collect only essential data',
      'Collect comprehensive data for better personalization',
      'Let students/parents choose what to share'
    ],
    considerations: [
      'Data minimization principles',
      'Informed consent requirements',
      'Data security measures',
      'Potential benefits vs. privacy risks'
    ]
  },
  {
    id: 3,
    scenario: 'An AI system is found to recommend different career paths based on gender stereotypes in its training data.',
    question: 'How should the developers address this issue?',
    options: [
      'Retrain the model with more balanced data',
      'Remove gender from the model\'s considerations',
      'Add a disclaimer about potential biases'
    ],
    considerations: [
      'Algorithmic fairness',
      'Impact on students\' self-perception',
      'Technical limitations of AI systems',
      'Responsibility of developers and educators'
    ]
  }
];

export const EthicalDilemmaSolver = () => {
  const [currentDilemma, setCurrentDilemma] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [reflection, setReflection] = useState('');
  const [showAnalysis, setShowAnalysis] = useState(false);

  const dilemma = dilemmas[currentDilemma];

  const handleNext = () => {
    setSelectedOption(null);
    setReflection('');
    setShowAnalysis(false);
    setCurrentDilemma((prev) => (prev + 1) % dilemmas.length);
  };

  const handleSubmit = () => {
    setShowAnalysis(true);
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Ethical Dilemma Solver</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h4 className="font-medium mb-2">Scenario {currentDilemma + 1}:</h4>
            <p className="text-muted-foreground">{dilemma.scenario}</p>
          </div>

          <div>
            <h4 className="font-medium mb-2">Question:</h4>
            <p className="text-muted-foreground">{dilemma.question}</p>
          </div>

          <div className="space-y-2">
            <Label>Your Response:</Label>
            <Select onValueChange={setSelectedOption} value={selectedOption || undefined}>
              <SelectTrigger>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {dilemma.options.map((option, index) => (
                  <SelectItem key={index} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedOption && (
            <div className="space-y-2">
              <Label htmlFor="reflection">
                Why did you choose this option? (Optional)
              </Label>
              <Textarea
                id="reflection"
                placeholder="Share your thoughts..."
                value={reflection}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setReflection(e.target.value)}
                rows={3}
              />
            </div>
          )}

          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={handleNext}
            >
              Skip
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!selectedOption}
            >
              Submit Response
            </Button>
          </div>

          {showAnalysis && (
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-2">Key Considerations:</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                {dilemma.considerations.map((consideration, index) => (
                  <li key={index}>{consideration}</li>
                ))}
              </ul>
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  There are no right or wrong answers in ethical discussions. The goal is to carefully 
                  consider different perspectives and potential consequences of implementing AI in education.
                </p>
              </div>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={handleNext}
              >
                Next Scenario
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EthicalDilemmaSolver;
