import { lazy, Suspense } from 'react';
import { AIGeneratorComponent } from './AIGeneratorComponent';
import { VisualTokens } from './VisualTokens';
import { SentenceBuilder } from './SentenceBuilder';
import { PresentationCoach } from './PresentationCoach';
import { EthicalDilemmaSolver } from './EthicalDilemmaSolver';
import { BuildABot } from './BuildABot';
import { DataDashboard } from './DataDashboard';
import { AIJourney } from './AIJourney';
import { PollComponent } from './PollComponent';
import { DesignFixerComponent } from './DesignFixerComponent';
import { ReflectionComponent } from './ReflectionComponent';
import { WordCloudComponent } from './WordCloudComponent';
import { ChoiceComparisonComponent } from './ChoiceComparisonComponent';
import { PlayerTypeSimulator } from './PlayerTypeSimulator';
import { PlayerTypeAnalyzer } from './PlayerTypeAnalyzer';
import { RewardScheduleDesigner } from './RewardScheduleDesigner';
import { FlowChannelEvaluator } from './FlowChannelEvaluator';
import { GameMasterGenerator } from './GameMasterGenerator';
import { AIGameMasterGenerator } from './AIGameMasterGenerator';
import { ROEDashboard } from './ROEDashboard';
import { GamificationConceptMap } from './GamificationConceptMap';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { CardSkeleton } from '@/components/shared/Skeleton';

const ConceptMap = lazy(() => import('./ConceptMap').then(m => ({ default: m.ConceptMap })));
const CertificateGenerator = lazy(() => import('./CertificateGenerator').then(m => ({ default: m.CertificateGenerator })));
const AIJourneyComponent = lazy(() => import('./AIJourneyComponent').then(m => ({ default: m.AIJourneyComponent })));
const FinalAssessmentComponent = lazy(() => import('./FinalAssessmentComponent').then(m => ({ default: m.FinalAssessmentComponent })));

interface InteractiveElementProps {
  element: {
    type: string;
    generatorType?: string;
    simulationType?: string;
    title?: string;
    description?: string;
    placeholder?: string;
    options?: Record<string, any>;
    [key: string]: any;
  };
  userName?: string;
}

// Force registration of components to prevent tree-shaking
const componentRegistry = {
  PlayerTypeSimulator,
  RewardScheduleDesigner,
  FlowChannelEvaluator,
  AIGameMasterGenerator,
  ROEDashboard,
  GamificationConceptMap
};

// Ensure components are registered
Object.keys(componentRegistry);

export const InteractiveElementRouter = ({ element, userName }: InteractiveElementProps) => {

  const renderElement = () => {
    switch (element.type) {
      case 'poll':
        return <PollComponent pollData={element as any} />;

      case 'designFixer':
        return <DesignFixerComponent fixerData={element as any} />;

      case 'reflection':
        return <ReflectionComponent question={element.question || element.prompt || "Reflect on this lesson"} {...element} />;

      case 'wordCloud':
        return <WordCloudComponent {...element} />;

      case 'choiceComparison':
        return <ChoiceComparisonComponent data={element as any} />;

      case 'visualTokens':
        return <VisualTokens />;

      case 'sentenceBuilder':
        return <SentenceBuilder />;

      case 'aiGenerator':
        if (element.generatorType === 'buildABot') {
          return <BuildABot />;
        }
        return (
          <AIGeneratorComponent
            generatorType={element.generatorType || 'studyBuddy'}
            title={element.title || 'AI Generator'}
            description={element.description}
            placeholder={element.placeholder}
            options={element.options}
          />
        );

      case 'simulation':
        switch (element.simulationType) {
          case 'presentationCoach':
            return <PresentationCoach />;
          case 'ethicalSimulator':
            return <EthicalDilemmaSolver />;
          case 'dataDashboard':
            return <DataDashboard />;
          case 'aiJourney':
            return <AIJourney />;
          case 'conceptMap':
            return (
              <Suspense fallback={<CardSkeleton />}>
                <ConceptMap />
              </Suspense>
            );
          case 'certificate':
            return (
              <Suspense fallback={<CardSkeleton />}>
                <CertificateGenerator />
              </Suspense>
            );
          case 'playerTypeSimulator':
            return <PlayerTypeSimulator {...element} />;
          default:
            return <div>Unknown simulation type: {element.simulationType}</div>;
        }

      case 'journeyTimeline':
        return (
          <Suspense fallback={<CardSkeleton />}>
            <AIJourneyComponent data={element} />
          </Suspense>
        );

      case 'finalAssessment':
        return (
          <Suspense fallback={<CardSkeleton />}>
            <FinalAssessmentComponent data={element as any} />
          </Suspense>
        );

      // Gamification Course Components
      case 'playerTypeSimulator':
        return <PlayerTypeSimulator {...element} />;

      case 'playerTypeAnalyzer':
        try {
          return <PlayerTypeAnalyzer />;
        } catch (error) {
          console.error('PlayerTypeAnalyzer error:', error);
          return <div className="p-4 border border-red-500 bg-red-50 rounded-lg">Error loading Player Type Analyzer</div>;
        }

      case 'rewardScheduleDesigner':
        try {
          return <RewardScheduleDesigner />;
        } catch (error) {
          console.error('RewardScheduleDesigner error:', error);
          return <div className="p-4 border border-red-500 bg-red-50 rounded-lg">Error loading Reward Schedule Designer</div>;
        }

      case 'flowChannelEvaluator':
        try {
          return <FlowChannelEvaluator />;
        } catch (error) {
          console.error('FlowChannelEvaluator error:', error);
          return <div className="p-4 border border-red-500 bg-red-50 rounded-lg">Error loading Flow Channel Evaluator</div>;
        }

      case 'pitchAnalysisGenerator':
        return (
          <AIGameMasterGenerator
            generatorType="mechanic-analyst"
            title={element.title || "Mechanic Mashup Pitch Analyzer"}
            description={element.description || "Submit your gamification pitch for Game Master feedback."}
          />
        );

      case 'narrativeGenerator':
        return (
          <AIGameMasterGenerator
            generatorType="narrative-generator"
            title={element.title || "Narrative Wrapper Generator"}
            description={element.description || "Enter a dry topic and desired theme for an AI narrative hook."}
          />
        );

      case 'darkPatternRedesigner':
        return (
          <AIGameMasterGenerator
            generatorType="dark-pattern-redesigner"
            title={element.title || "Ethical Redesign Consultant"}
            description={element.description || "Input a manipulative mechanic for an ethical redesign."}
          />
        );

      case 'roeDashboard':
        return <ROEDashboard />;

      case 'gamificationConceptMap':
        return <GamificationConceptMap />;

      case 'certificateGenerator':
        return (
          <Suspense fallback={<CardSkeleton />}>
            <CertificateGenerator userName={userName} />
          </Suspense>
        );

      default:
        console.error('Unknown interactive element type:', element.type, element);
        return (
          <div className="p-4 border border-red-500 bg-red-50 dark:bg-red-950/20 rounded-lg">
            <p className="text-red-600 dark:text-red-400 font-semibold">
              Unknown interactive element type: {element.type}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Element data: {JSON.stringify(element, null, 2)}
            </p>
          </div>
        );
    }
  };

  return <ErrorBoundary>{renderElement()}</ErrorBoundary>;
};
