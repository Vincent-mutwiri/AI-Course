import { AIGeneratorComponent } from './AIGeneratorComponent';
import { VisualTokens } from './VisualTokens';
import { SentenceBuilder } from './SentenceBuilder';
import { PresentationCoach } from './PresentationCoach';
import { EthicalDilemmaSolver } from './EthicalDilemmaSolver';
import { BuildABot } from './BuildABot';
import { DataDashboard } from './DataDashboard';
import { AIJourney } from './AIJourney';
import { ConceptMap } from './ConceptMap';
import { CertificateGenerator } from './CertificateGenerator';

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

export const InteractiveElementRouter = ({ element }: InteractiveElementProps) => {
  switch (element.type) {
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
      if (element.simulationType === 'presentationCoach') {
        return <PresentationCoach />;
      }
      if (element.simulationType === 'ethicalSimulator') {
        return <EthicalDilemmaSolver />;
      }
      if (element.simulationType === 'dataDashboard') {
        return <DataDashboard />;
      }
      if (element.simulationType === 'aiJourney') {
        return <AIJourney />;
      }
      if (element.simulationType === 'conceptMap') {
        return <ConceptMap />;
      }
      if (element.simulationType === 'certificate') {
        return <CertificateGenerator />;
      }
      return <div>Unknown simulation type</div>;

    default:
      return <div>Unknown interactive element type: {element.type}</div>;
  }
};
