import { Card } from "@/components/ui/card";
import { CheckCircle2, XCircle, AlertCircle, Circle } from "lucide-react";

interface ContentSection {
  type: string;
  title?: string;
  subtitle?: string;
  content?: string;
  [key: string]: any;
}

export const ContentRenderer = ({ sections }: { sections: ContentSection[] }) => {
  return (
    <div className="space-y-6">
      {sections.map((section, idx) => (
        <div key={idx}>
          {section.type === "text" && <TextSection {...section} />}
          {section.type === "scenarios" && <ScenariosSection {...section} />}
          {section.type === "comparison" && <ComparisonSection {...section} />}
          {section.type === "callout" && <CalloutSection {...section} />}
          {section.type === "definition" && <DefinitionSection {...section} />}
          {section.type === "case_study" && <CaseStudySection {...section} />}
          {section.type === "principles" && <PrinciplesSection {...section} />}
          {section.type === "framework" && <FrameworkSection {...section} />}
        </div>
      ))}
    </div>
  );
};

const TextSection = ({ title, content }: ContentSection) => (
  <div>
    {title && <h3 className="text-xl font-semibold mb-3">{title}</h3>}
    <p className="text-muted-foreground leading-relaxed">{content}</p>
  </div>
);

const ScenariosSection = ({ title, scenarios }: ContentSection) => (
  <div>
    <h3 className="text-xl font-semibold mb-4">{title}</h3>
    <div className="grid gap-4 md:grid-cols-3">
      {scenarios?.map((scenario: any, idx: number) => (
        <Card key={idx} className="p-4">
          <h4 className="font-semibold mb-2">{scenario.title}</h4>
          <p className="text-sm text-muted-foreground mb-3">{scenario.character}</p>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-red-500 font-medium">Without AI:</span>
              <p className="text-muted-foreground">{scenario.without_ai}</p>
            </div>
            <div>
              <span className="text-green-500 font-medium">With AI:</span>
              <p className="text-muted-foreground">{scenario.with_ai}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  </div>
);

const ComparisonSection = ({ title, subtitle, benefits, risks }: ContentSection) => (
  <div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    {subtitle && <p className="text-muted-foreground mb-4">{subtitle}</p>}
    <div className="grid md:grid-cols-2 gap-4">
      <Card className="p-4 border-green-200 bg-green-50/50">
        <h4 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5" /> Potential Benefits
        </h4>
        <ul className="space-y-2">
          {benefits?.map((benefit: string, idx: number) => (
            <li key={idx} className="text-sm flex items-start gap-2">
              <span className="text-green-600 mt-0.5">✓</span>
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </Card>
      <Card className="p-4 border-red-200 bg-red-50/50">
        <h4 className="font-semibold text-red-700 mb-3 flex items-center gap-2">
          <XCircle className="h-5 w-5" /> Potential Risks
        </h4>
        <ul className="space-y-2">
          {risks?.map((risk: string, idx: number) => (
            <li key={idx} className="text-sm flex items-start gap-2">
              <span className="text-red-600 mt-0.5">⚠</span>
              <span>{risk}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  </div>
);

const CalloutSection = ({ style, title, content }: ContentSection) => {
  const styles = {
    warning: "border-yellow-300 bg-yellow-50/50",
    info: "border-blue-300 bg-blue-50/50",
    success: "border-green-300 bg-green-50/50",
  };
  
  return (
    <Card className={`p-4 ${styles[style as keyof typeof styles] || styles.info}`}>
      <div className="flex gap-3">
        <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
        <div>
          <h4 className="font-semibold mb-2">{title}</h4>
          <p className="text-sm">{content}</p>
        </div>
      </div>
    </Card>
  );
};

const DefinitionSection = ({ title, definition, levels }: ContentSection) => (
  <div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-muted-foreground mb-4">{definition}</p>
    {levels && (
      <div className="space-y-3">
        {levels.map((level: any, idx: number) => (
          <Card key={idx} className="p-4">
            <h4 className="font-semibold mb-2">{level.level} Personalization</h4>
            <ul className="text-sm space-y-1">
              {level.examples.map((example: string, i: number) => (
                <li key={i} className="text-muted-foreground">• {example}</li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    )}
  </div>
);

const CaseStudySection = ({ title, background, challenge, solution, results, scenario, bias, impact, fix }: ContentSection) => (
  <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
    <div className="flex items-center gap-2 mb-4">
      <span className="text-2xl">📚</span>
      <h3 className="text-xl font-semibold text-blue-900">{title}</h3>
    </div>
    <div className="space-y-4">
      {background && (
        <div className="bg-white/70 p-4 rounded-lg">
          <h4 className="font-semibold text-sm text-blue-700 mb-2 flex items-center gap-2">
            <span>🎯</span> Background
          </h4>
          <p className="text-sm">{background}</p>
        </div>
      )}
      {scenario && (
        <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
          <h4 className="font-semibold text-sm text-orange-800 mb-2 flex items-center gap-2">
            <span>🚨</span> The Problem
          </h4>
          <p className="text-sm text-orange-900">{scenario}</p>
        </div>
      )}
      {bias && (
        <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
          <h4 className="font-semibold text-sm text-red-800 mb-2 flex items-center gap-2">
            <span>⚠️</span> The Bias
          </h4>
          <p className="text-sm text-red-900">{bias}</p>
        </div>
      )}
      {challenge && (
        <div className="bg-white/70 p-4 rounded-lg">
          <h4 className="font-semibold text-sm text-blue-700 mb-2 flex items-center gap-2">
            <span>⚠️</span> Challenge
          </h4>
          <p className="text-sm">{challenge}</p>
        </div>
      )}
      {impact && impact.length > 0 && (
        <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-600">
          <h4 className="font-semibold text-sm text-red-800 mb-3 flex items-center gap-2">
            <span>💔</span> Impact
          </h4>
          <ul className="text-sm space-y-2">
            {impact.map((item: string, idx: number) => (
              <li key={idx} className="flex items-start gap-2">
                <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <span className="text-red-900">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {solution && (
        <div className="bg-white/70 p-4 rounded-lg">
          <h4 className="font-semibold text-sm text-blue-700 mb-2 flex items-center gap-2">
            <span>💡</span> Solution
          </h4>
          <p className="text-sm">{solution}</p>
        </div>
      )}
      {fix && fix.length > 0 && (
        <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-600">
          <h4 className="font-semibold text-sm text-blue-800 mb-3 flex items-center gap-2">
            <span>🔧</span> The Fix
          </h4>
          <ul className="text-sm space-y-2">
            {fix.map((item: string, idx: number) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <span className="text-blue-900">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {results && results.length > 0 && (
        <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-600">
          <h4 className="font-semibold text-sm text-green-800 mb-3 flex items-center gap-2">
            <span>📈</span> Results
          </h4>
          <ul className="text-sm space-y-2">
            {results.map((result: string, idx: number) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-green-900">{result}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  </Card>
);

const PrinciplesSection = ({ title, principles }: ContentSection) => (
  <div>
    <h3 className="text-xl font-semibold mb-4">{title}</h3>
    <div className="space-y-4">
      {principles?.map((principle: any, idx: number) => (
        <Card key={idx} className="p-4">
          <h4 className="font-semibold mb-3">{principle.name}</h4>
          {principle.description && (
            <p className="text-sm text-muted-foreground mb-3">{principle.description}</p>
          )}
          <div className="grid md:grid-cols-2 gap-3 text-sm">
            {principle.bad_example && (
              <div className="flex gap-2">
                <XCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">{principle.bad_example}</span>
              </div>
            )}
            {principle.good_example && (
              <div className="flex gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">{principle.good_example}</span>
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  </div>
);

const FrameworkSection = ({ title, pillars }: ContentSection) => (
  <div>
    <h3 className="text-xl font-semibold mb-4">{title}</h3>
    <div className="grid md:grid-cols-3 gap-4">
      {pillars?.map((pillar: any, idx: number) => (
        <Card key={idx} className="p-4 text-center">
          <h4 className="font-bold text-lg mb-2">{pillar.name}</h4>
          <p className="text-sm font-medium text-muted-foreground mb-2">{pillar.focus}</p>
          <p className="text-xs text-muted-foreground">{pillar.description}</p>
        </Card>
      ))}
    </div>
  </div>
);
