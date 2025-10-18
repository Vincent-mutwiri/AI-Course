import { lazy, Suspense } from 'react';
import { AIGeneratorComponent } from './AIGeneratorComponent';
import { VisualTokens } from './VisualTokens';
import { SentenceBuilder } from './SentenceBuilder';
import { PresentationCoach } from './PresentationCoach';
import { EthicalDilemmaSolver } from './EthicalDilemmaSolver';
import { BuildABot } from './BuildABot';
import { DataDashboard } from './DataDashboard';
import { AIJourney } from './AIJourney';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { CardSkeleton } from '@/components/shared/Skeleton';

const ConceptMap = lazy(() => import('./ConceptMap').then(m => ({ default: m.ConceptMap })));
const CertificateGenerator = lazy(() => import('./CertificateGenerator').then(m => ({ default: m.CertificateGenerator })));

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

// Explicit component map prevents tree-shaking in production
const componentMap: { [key: string]: React.ComponentType<any> } = {
  visualTokens: VisualTokens,
  sentenceBuilder: SentenceBuilder,
  buildABot: BuildABot,
  presentationCoach: PresentationCoach,
  ethicalSimulator: EthicalDilemmaSolver,
  dataDashboard: DataDashboard,
  aiJourney: AIJourney,
};

export const InteractiveElementRouter = ({ element }: InteractiveElementProps) => {
  const renderElement = () => {
    if (element.type === 'aiGenerator') {
      if (element.generatorType === 'buildABot') {
        const Component = componentMap.buildABot;
        return <Component />;
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
    }

    if (element.type === 'simulation') {
      const Component = componentMap[element.simulationType!];
      if (Component) {
        return <Component />;
      }
      
      // Handle lazy-loaded components
      if (element.simulationType === 'conceptMap') {
        return (
          <Suspense fallback={<CardSkeleton />}>
            <ConceptMap />
          </Suspense>
        );
      }
      if (element.simulationType === 'certificate') {
        return (
          <Suspense fallback={<CardSkeleton />}>
            <CertificateGenerator />
          </Suspense>
        );
      }
      
      return <div>Unknown simulation type: {element.simulationType}</div>;
    }

    const Component = componentMap[element.type];
    if (Component) {
      return <Component />;
    }

    return <div>Unknown interactive element type: {element.type}</div>;
  };

  return <ErrorBoundary>{renderElement()}</ErrorBoundary>;
};
