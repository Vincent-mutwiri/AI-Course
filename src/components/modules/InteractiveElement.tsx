import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2 } from "lucide-react";

export const InteractiveElement = ({ interactive }: { interactive: any }) => {
  if (!interactive) return null;

  if (interactive.type === "reflection") {
    return <ReflectionActivity {...interactive} />;
  }
  if (interactive.type === "framework") {
    return <FrameworkActivity {...interactive} />;
  }
  if (interactive.type === "ethical_dilemma") {
    return <EthicalDilemmaActivity {...interactive} />;
  }
  return null;
};

const ReflectionActivity = ({ title, description, questions, reflection_prompt }: any) => {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const allAnswered = questions?.every((_: any, idx: number) => answers[idx]?.trim());
    if (allAnswered) {
      setLoading(true);
      try {
        const prompt = `As an AI learning assistant, provide constructive feedback on a student's reflection about AI in EdTech.

Reflection Questions and Answers:
${questions.map((q: string, idx: number) => `Q${idx + 1}: ${q}\nA${idx + 1}: ${answers[idx]}`).join('\n\n')}

Provide encouraging, specific feedback that:
1. Acknowledges their insights
2. Highlights strong points
3. Suggests areas for deeper thinking
4. Connects their ideas to real-world applications

Keep feedback concise (3-4 sentences).`;

        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const response = await fetch(`${API_URL}/ai/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ message: prompt })
        });

        const data = await response.json();
        setAiFeedback(data.response);
        setSubmitted(true);
      } catch (error) {
        console.error('Failed to get AI feedback:', error);
        setSubmitted(true);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">🎮</span>
        <h3 className="text-xl font-semibold">{title}</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-6">{description}</p>
      
      <div className="space-y-5">
        {questions?.map((question: string, idx: number) => (
          <div key={idx} className="bg-white/70 p-4 rounded-lg">
            <label className="text-sm font-semibold mb-2 block text-purple-900">
              {idx + 1}. {question}
            </label>
            <Textarea
              value={answers[idx] || ""}
              onChange={(e) => setAnswers({ ...answers, [idx]: e.target.value })}
              placeholder="Type your thoughts here..."
              className="min-h-24 bg-white"
              disabled={submitted}
            />
          </div>
        ))}
        
        {reflection_prompt && (
          <div className="mt-4 p-4 bg-purple-100 rounded-lg border-l-4 border-purple-600">
            <p className="text-sm font-semibold text-purple-900 mb-1">💭 Reflection Prompt:</p>
            <p className="text-sm italic text-purple-800">{reflection_prompt}</p>
          </div>
        )}

        {!submitted ? (
          <Button 
            onClick={handleSubmit} 
            className="w-full bg-purple-600 hover:bg-purple-700"
            disabled={!questions?.every((_: any, idx: number) => answers[idx]?.trim()) || loading}
          >
            {loading ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Getting AI Feedback...
              </>
            ) : (
              'Submit Reflection'
            )}
          </Button>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-green-100 rounded-lg border-l-4 border-green-600">
              <p className="text-green-800 font-semibold mb-2">✅ Reflection Submitted!</p>
            </div>
            {aiFeedback && (
              <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-600">
                <div className="flex items-start gap-2 mb-2">
                  <span className="text-xl">🤖</span>
                  <h4 className="font-semibold text-blue-900">AI Feedback</h4>
                </div>
                <p className="text-sm text-blue-800 leading-relaxed whitespace-pre-line">{aiFeedback}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

const FrameworkActivity = ({ title, description, template, example }: any) => {
  const [entries, setEntries] = useState<any[]>([{ ...template }]);
  const [submitted, setSubmitted] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const allFilled = entries.every(entry => 
      Object.values(entry).every(val => (val as string)?.trim())
    );
    if (allFilled) {
      setLoading(true);
      try {
        const frameworkData = entries.map((entry, idx) => 
          `Framework #${idx + 1}:\n${Object.entries(entry).map(([key, value]) => 
            `${key.replace(/_/g, ' ')}: ${value}`
          ).join('\n')}`
        ).join('\n\n');

        const prompt = `As an AI EdTech expert, review this personalization framework and provide actionable feedback.

${frameworkData}

Provide feedback that:
1. Validates their personalization approach
2. Suggests specific improvements or considerations
3. Highlights potential challenges they should address
4. Recommends next steps for implementation

Keep feedback practical and concise (4-5 sentences).`;

        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const response = await fetch(`${API_URL}/ai/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ message: prompt })
        });

        const data = await response.json();
        setAiFeedback(data.response);
        setSubmitted(true);
      } catch (error) {
        console.error('Failed to get AI feedback:', error);
        setSubmitted(true);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-green-50 to-teal-50 border-2 border-green-200">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">🛠️</span>
        <h3 className="text-xl font-semibold">{title}</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-6">{description}</p>
      
      {example && (
        <div className="mb-6 p-4 bg-teal-100 rounded-lg border-l-4 border-teal-600">
          <h4 className="font-semibold text-sm mb-3 text-teal-900">📋 Example:</h4>
          <div className="text-sm space-y-2 text-teal-800">
            {Object.entries(example).map(([key, value]) => (
              <div key={key} className="flex gap-2">
                <span className="font-semibold capitalize min-w-[140px]">{key.replace(/_/g, ' ')}:</span>
                <span>{value as string}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {entries.map((entry, idx) => (
        <div key={idx} className="space-y-4 mb-6 bg-white/70 p-4 rounded-lg">
          <h4 className="font-semibold text-green-900">Your Framework #{idx + 1}</h4>
          {Object.keys(template).map((key) => (
            <div key={key}>
              <label className="text-sm font-semibold capitalize block mb-2 text-green-900">
                {key.replace(/_/g, ' ')}
              </label>
              <Textarea
                value={entry[key]}
                onChange={(e) => {
                  const newEntries = [...entries];
                  newEntries[idx][key] = e.target.value;
                  setEntries(newEntries);
                }}
                placeholder={template[key] || `Enter ${key.replace(/_/g, ' ')}`}
                className="min-h-20 bg-white"
                disabled={submitted}
              />
            </div>
          ))}
        </div>
      ))}

      {!submitted ? (
        <Button 
          onClick={handleSubmit} 
          className="w-full bg-green-600 hover:bg-green-700"
          disabled={!entries.every(entry => Object.values(entry).every(val => (val as string)?.trim())) || loading}
        >
          {loading ? (
            <>
              <span className="animate-spin mr-2">⏳</span>
              Getting AI Feedback...
            </>
          ) : (
            'Submit Framework'
          )}
        </Button>
      ) : (
        <div className="space-y-4">
          <div className="p-4 bg-green-100 rounded-lg border-l-4 border-green-600">
            <p className="text-green-800 font-semibold">✅ Framework Submitted!</p>
          </div>
          {aiFeedback && (
            <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-600">
              <div className="flex items-start gap-2 mb-2">
                <span className="text-xl">🤖</span>
                <h4 className="font-semibold text-blue-900">AI Expert Feedback</h4>
              </div>
              <p className="text-sm text-blue-800 leading-relaxed whitespace-pre-line">{aiFeedback}</p>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

const EthicalDilemmaActivity = ({ title, scenarios }: any) => {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [scores, setScores] = useState<number[]>([]);

  const scenario = scenarios?.[currentScenario];

  const handleSelect = (optionIdx: number) => {
    setSelectedOption(optionIdx);
    setShowFeedback(true);
    const newScores = [...scores];
    newScores[currentScenario] = scenario.options[optionIdx].score;
    setScores(newScores);
  };

  const handleNext = () => {
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(currentScenario + 1);
      setSelectedOption(null);
      setShowFeedback(false);
    }
  };

  const totalScore = scores.reduce((a, b) => a + b, 0);
  const maxScore = (currentScenario + 1) * 5;
  const isComplete = currentScenario === scenarios.length - 1 && showFeedback;

  if (!scenario) return null;

  return (
    <Card className="p-6 bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">⚖️</span>
        <h3 className="text-xl font-semibold">{title}</h3>
      </div>
      
      <div className="flex justify-between items-center mb-6 p-3 bg-white/70 rounded-lg">
        <div className="text-sm font-medium text-orange-900">
          Scenario {currentScenario + 1} of {scenarios.length}
        </div>
        <div className="text-sm font-semibold text-orange-900">
          Score: {totalScore}/{maxScore}
        </div>
      </div>
      
      <div className="mb-6 p-4 bg-orange-100 rounded-lg border-l-4 border-orange-600">
        <h4 className="font-bold mb-2 text-orange-900">{scenario.title}</h4>
        <p className="text-sm text-orange-800">{scenario.description}</p>
      </div>

      <div className="space-y-3 mb-4">
        {scenario.options?.map((option: any, idx: number) => {
          const isSelected = selectedOption === idx;
          const scoreColor = option.score >= 4 ? 'text-green-600' : option.score >= 3 ? 'text-yellow-600' : 'text-red-600';
          
          return (
            <button
              key={idx}
              onClick={() => !showFeedback && handleSelect(idx)}
              disabled={showFeedback}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                isSelected
                  ? "border-orange-500 bg-orange-50 shadow-md"
                  : "border-gray-200 hover:border-orange-300 bg-white"
              } ${showFeedback ? "cursor-default" : "cursor-pointer hover:shadow-sm"}`}
            >
              <div className="font-semibold text-sm mb-1 text-gray-900">
                {String.fromCharCode(65 + idx)}. {option.choice}
              </div>
              {showFeedback && isSelected && (
                <div className="mt-3 pt-3 border-t border-orange-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`font-bold ${scoreColor}`}>
                      Score: {option.score}/5 {option.score >= 4 ? '🌟' : option.score >= 3 ? '👍' : '💭'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{option.feedback}</p>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {showFeedback && (
        currentScenario < scenarios.length - 1 ? (
          <Button onClick={handleNext} className="w-full bg-orange-600 hover:bg-orange-700">
            Next Scenario →
          </Button>
        ) : (
          <div className="p-4 bg-green-100 rounded-lg border-l-4 border-green-600 text-center">
            <p className="text-green-800 font-bold text-lg mb-2">🎉 All Scenarios Complete!</p>
            <p className="text-green-700">Final Score: {totalScore}/{maxScore} ({Math.round((totalScore/maxScore)*100)}%)</p>
          </div>
        )
      )}
    </Card>
  );
};
