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
}

// Force all components to be included in bundle
const ALL_COMPONENTS = {
  VisualTokens,
  SentenceBuilder,
  BuildABot,
  PresentationCoach,
  EthicalDilemmaSolver,
  DataDashboard,
  AIJourney,
  AIGeneratorComponent,
  PollComponent,
  DesignFixerComponent,
  ReflectionComponent,
  WordCloudComponent,
  ChoiceComparisonComponent,
  ConceptMap,
  CertificateGenerator,
  AIJourneyComponent,
  FinalAssessmentComponent,
};

// Prevent tree-shaking by referencing all components
if (false) {
  console.log(ALL_COMPONENTS);
}

export const InteractiveElementRouter = ({ element }: InteractiveElementProps) => {
  
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
      
      default:
        return <div>Unknown interactive element type: {element.type}</div>;
    }
  };

  return <ErrorBoundary>{renderElement()}</ErrorBoundary>;
};
