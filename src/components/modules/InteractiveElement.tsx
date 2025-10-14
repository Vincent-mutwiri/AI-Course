import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

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

  return (
    <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50">
      <h3 className="text-xl font-semibold mb-2">🎮 {title}</h3>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      <div className="space-y-4">
        {questions?.map((question: string, idx: number) => (
          <div key={idx}>
            <label className="text-sm font-medium mb-2 block">{idx + 1}. {question}</label>
            <Textarea
              value={answers[idx] || ""}
              onChange={(e) => setAnswers({ ...answers, [idx]: e.target.value })}
              placeholder="Your answer..."
              className="min-h-20"
            />
          </div>
        ))}
        {reflection_prompt && (
          <div className="mt-4 p-4 bg-white/50 rounded-lg border-l-4 border-purple-500">
            <p className="text-sm font-medium italic">{reflection_prompt}</p>
          </div>
        )}
      </div>
    </Card>
  );
};

const FrameworkActivity = ({ title, description, template, example }: any) => {
  const [entries, setEntries] = useState<any[]>([{ ...template }]);

  return (
    <Card className="p-6 bg-gradient-to-br from-green-50 to-teal-50">
      <h3 className="text-xl font-semibold mb-2">🛠️ {title}</h3>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      
      {example && (
        <div className="mb-4 p-4 bg-white/70 rounded-lg">
          <h4 className="font-semibold text-sm mb-2">Example:</h4>
          <div className="text-xs space-y-1">
            {Object.entries(example).map(([key, value]) => (
              <div key={key}>
                <span className="font-medium capitalize">{key.replace(/_/g, ' ')}:</span> {value as string}
              </div>
            ))}
          </div>
        </div>
      )}

      {entries.map((entry, idx) => (
        <div key={idx} className="space-y-3 mb-4">
          {Object.keys(template).map((key) => (
            <div key={key}>
              <label className="text-sm font-medium capitalize block mb-1">
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
                className="min-h-16"
              />
            </div>
          ))}
        </div>
      ))}
    </Card>
  );
};

const EthicalDilemmaActivity = ({ title, scenarios }: any) => {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const scenario = scenarios?.[currentScenario];

  const handleSelect = (optionIdx: number) => {
    setSelectedOption(optionIdx);
    setShowFeedback(true);
  };

  const handleNext = () => {
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(currentScenario + 1);
      setSelectedOption(null);
      setShowFeedback(false);
    }
  };

  if (!scenario) return null;

  return (
    <Card className="p-6 bg-gradient-to-br from-orange-50 to-red-50">
      <h3 className="text-xl font-semibold mb-4">⚖️ {title}</h3>
      <div className="mb-2 text-sm text-muted-foreground">
        Scenario {currentScenario + 1} of {scenarios.length}
      </div>
      
      <div className="mb-6">
        <h4 className="font-semibold mb-2">{scenario.title}</h4>
        <p className="text-sm text-muted-foreground">{scenario.description}</p>
      </div>

      <div className="space-y-3">
        {scenario.options?.map((option: any, idx: number) => (
          <button
            key={idx}
            onClick={() => handleSelect(idx)}
            disabled={showFeedback}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
              selectedOption === idx
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300 bg-white"
            } ${showFeedback ? "cursor-default" : "cursor-pointer"}`}
          >
            <div className="font-medium text-sm mb-1">
              {String.fromCharCode(65 + idx)}. {option.choice}
            </div>
            {showFeedback && selectedOption === idx && (
              <div className="mt-2 pt-2 border-t text-sm">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold">Score: {option.score}/5</span>
                </div>
                <p className="text-muted-foreground">{option.feedback}</p>
              </div>
            )}
          </button>
        ))}
      </div>

      {showFeedback && currentScenario < scenarios.length - 1 && (
        <Button onClick={handleNext} className="mt-4 w-full">
          Next Scenario →
        </Button>
      )}
    </Card>
  );
};
