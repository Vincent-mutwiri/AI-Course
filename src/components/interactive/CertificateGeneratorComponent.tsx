import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileText, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface CertificateGeneratorComponentProps {
  userName: string;
  courseTitle: string;
}

export const CertificateGeneratorComponent: React.FC<CertificateGeneratorComponentProps> = ({
  userName,
  courseTitle
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const generatePdf = async () => {
    // Validation to prevent generation without userName
    if (!userName || userName.trim() === '') {
      const errorMsg = 'User name is required to generate certificate';
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      // Simple text certificate generation
      const completionDate = new Date().toLocaleDateString();
      const certificateText = `Certificate of Completion\n\nThis certifies that\n\n${userName}\n\nhas successfully completed\n\n${courseTitle}\n\nCompletion Date: ${completionDate}\n\nInstructor: Vincent Mutwiri`;
      
      const blob = new Blob([certificateText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Certificate-${userName.replace(/\s+/g, '_')}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('Certificate downloaded successfully!');


    } catch (error) {
      console.error('Error generating certificate:', error);
      const errorMsg = 'Failed to generate certificate. Please try again.';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="p-6 border-2 border-dashed border-primary/50 rounded-lg bg-primary/5 max-w-md">
        <div className="flex items-center justify-center mb-3">
          <FileText className="h-12 w-12 text-primary" />
        </div>
        <h4 className="text-center font-semibold mb-2">🎉 Congratulations!</h4>
        <p className="text-sm text-center text-muted-foreground mb-4">
          You've completed the course! Download your personalized certificate. Share it with colleagues, add it to your portfolio, or display it proudly!
        </p>

        {/* Display error message for missing required fields */}
        {error && (
          <div className="flex items-center gap-2 p-3 mb-4 bg-destructive/10 border border-destructive/20 rounded-md">
            <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <Button
          onClick={generatePdf}
          disabled={isLoading || !userName}
          className="w-full"
          size="lg"
        >
          {isLoading ? (
            <>Generating...</>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Download Certificate
            </>
          )}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground text-center max-w-md">
        💡 Tip: Share your achievement on LinkedIn or with your school administration to showcase your professional development!
      </p>
    </div>
  );
};
