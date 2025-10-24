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
  ConceptMap,
  CertificateGenerator,
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
        return (
          <div className="p-6 border-2 border-dashed rounded-lg bg-muted/30">
            <h3 className="text-lg font-semibold mb-3">Reflection Prompt</h3>
            <p className="text-muted-foreground mb-4">{element.prompt}</p>
            <textarea
              className="w-full min-h-[120px] p-3 border rounded-md resize-y"
              placeholder="Type your reflection here..."
            />
          </div>
        );
      
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
      
      default:
        return <div>Unknown interactive element type: {element.type}</div>;
    }
  };

  return <ErrorBoundary>{renderElement()}</ErrorBoundary>;
};
