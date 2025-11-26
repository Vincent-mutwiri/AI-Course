import { lazy, Suspense } from 'react';
import { AlertTriangle } from 'lucide-react';
import { AIGeneratorComponent } from './AIGeneratorComponent';
import { VisualTokens } from './VisualTokens';
import { SentenceBuilder } from './SentenceBuilder';
import { PresentationCoach } from './PresentationCoach';
import { EthicalDilemmaSolver } from './EthicalDilemmaSolver';
import { BuildABot } from './BuildABot';
import { DataDashboard } from './DataDashboard';
import { AIJourney } from './AIJourney';
import { PollComponent } from './PollComponent';
import { ReflectionComponent } from './ReflectionComponent';
import { WordCloudComponent } from './WordCloudComponent';
import { ChoiceComparisonComponent } from './ChoiceComparisonComponent';
import { PlayerTypeAnalyzer } from './PlayerTypeAnalyzer';
import { GameMasterGenerator } from './GameMasterGenerator';
import { AIGameMasterGenerator } from './AIGameMasterGenerator';
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
  courseTitle?: string;
}

// Deprecated block types that are no longer supported
const DEPRECATED_TYPES = [
  'designFixer',
  'playerTypeSimulator',
  'rewardScheduleDesigner',
  'flowChannelEvaluator',
  'pitchAnalysisGenerator',
  'narrativeGenerator',
  'darkPatternRedesigner',
  'roeDashboard',
  'journeyTimeline'
];

// Component to display deprecation warning
const DeprecatedBlockWarning = ({ blockType }: { blockType: string }) => (
  <div className="p-6 border-2 border-amber-500 bg-amber-50 dark:bg-amber-950/20 rounded-lg">
    <div className="flex items-start gap-3">
      <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
      <div className="flex-1">
        <h3 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">
          Deprecated Block Type
        </h3>
        <p className="text-sm text-amber-800 dark:text-amber-200 mb-3">
          The <strong>{blockType}</strong> block type is no longer supported and has been removed from the system.
          This block will not function correctly and should be deleted.
        </p>
        <p className="text-xs text-amber-700 dark:text-amber-300">
          Please use the course builder to remove this block and replace it with a supported interactive element.
        </p>
      </div>
    </div>
  </div>
);

export const InteractiveElementRouter = ({ element, userName, courseTitle }: InteractiveElementProps) => {
  const renderElement = () => {
    const elementType = element.type?.trim();

    // Check if this is a deprecated block type
    if (DEPRECATED_TYPES.includes(elementType)) {
      return <DeprecatedBlockWarning blockType={elementType} />;
    }

    switch (elementType) {
      case 'poll':
        return <PollComponent pollData={(element as any).content || element} />;

      case 'reflection':
        return <ReflectionComponent question={(element as any).content?.question || element.question || element.prompt || "Reflect on this lesson"} {...((element as any).content || element)} />;

      case 'wordCloud':
        const wordCloudData = (element as any).content || element;
        const config = wordCloudData.config || wordCloudData;
        return <WordCloudComponent
          title={config.title || wordCloudData.title || element.title}
          description={config.description || wordCloudData.description || element.description}
          words={config.words || wordCloudData.words || element.words}
          mappings={config.mappings || wordCloudData.mappings || element.mappings}
          instructionText={config.instructionText || wordCloudData.instructionText || element.instructionText}
          summaryText={config.summaryText || wordCloudData.summaryText || element.summaryText}
        />;

      case 'choiceComparison':
        return <ChoiceComparisonComponent data={(element as any).content || element} />;

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
          default:
            return <div>Unknown simulation type: {element.simulationType}</div>;
        }

      case 'finalAssessment':
        return (
          <Suspense fallback={<CardSkeleton />}>
            <FinalAssessmentComponent data={element as any} />
          </Suspense>
        );

      // Gamification Course Components  
      case 'playerTypeAnalyzer':
        try {
          return <PlayerTypeAnalyzer />;
        } catch (error) {
          console.error('PlayerTypeAnalyzer error:', error);
          return <div className="p-4 border border-red-500 bg-red-50 rounded-lg">Error loading Player Type Analyzer</div>;
        }

      case 'gamificationConceptMap':
        return <GamificationConceptMap />;

      case 'certificateGenerator':
        const certData = (element as any).content || element;
        return (
          <Suspense fallback={<CardSkeleton />}>
            <CertificateGenerator
              userName={userName}
              courseTitle={courseTitle || element.courseTitle || certData.certificateTitle}
              config={certData.config}
            />
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
