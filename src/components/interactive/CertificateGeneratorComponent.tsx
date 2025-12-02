import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileText, AlertCircle, Award } from 'lucide-react';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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
  const certificateRef = useRef<HTMLDivElement>(null);

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
      if (!certificateRef.current) {
        throw new Error('Certificate element not found');
      }

      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        logging: false,
        useCORS: true
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`Certificate-${userName.replace(/\s+/g, '_')}.pdf`);

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
    <div className="flex flex-col items-center gap-6 w-full">
      {/* Hidden Certificate Template for PDF Generation */}
      <div className="absolute left-[-9999px] top-[-9999px]">
        <div
          ref={certificateRef}
          className="w-[800px] h-[600px] bg-white p-10 border-[20px] border-double border-primary/20 relative flex flex-col items-center justify-center text-center"
          style={{ fontFamily: 'serif' }}
        >
          <div className="absolute top-0 left-0 w-full h-full border-[2px] border-primary/10 m-4 pointer-events-none" />

          <Award className="w-24 h-24 text-primary mb-6" />

          <h1 className="text-5xl font-bold text-primary mb-4 uppercase tracking-widest">
            Certificate of Completion
          </h1>

          <p className="text-xl text-muted-foreground mb-8 italic">
            This certifies that
          </p>

          <h2 className="text-4xl font-bold text-foreground mb-8 border-b-2 border-primary/20 pb-2 px-10 min-w-[400px]">
            {userName}
          </h2>

          <p className="text-xl text-muted-foreground mb-4">
            has successfully completed the course
          </p>

          <h3 className="text-3xl font-bold text-primary mb-12">
            {courseTitle}
          </h3>

          <div className="flex justify-between w-full px-20 mt-8">
            <div className="flex flex-col items-center">
              <div className="w-40 border-b border-black mb-2"></div>
              <p className="text-sm text-muted-foreground">Date</p>
              <p className="font-medium">{new Date().toLocaleDateString()}</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-40 border-b border-black mb-2"></div>
              <p className="text-sm text-muted-foreground">Instructor</p>
              <p className="font-medium">Vincent Mutwiri</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8 border-2 border-dashed border-primary/50 rounded-lg bg-primary/5 max-w-md w-full">
        <div className="flex items-center justify-center mb-4">
          <Award className="h-16 w-16 text-primary animate-pulse" />
        </div>
        <h4 className="text-center text-xl font-bold mb-2">🎉 Congratulations!</h4>
        <p className="text-center text-muted-foreground mb-6">
          You've completed the course! Download your official certificate of completion.
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
          className="w-full h-12 text-lg"
          size="lg"
        >
          {isLoading ? (
            <>Generating...</>
          ) : (
            <>
              <Download className="w-5 h-5 mr-2" />
              Download PDF Certificate
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
