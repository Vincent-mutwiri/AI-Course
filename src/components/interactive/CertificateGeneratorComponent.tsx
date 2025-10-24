import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface CertificateGeneratorComponentProps {
  userName: string;
  courseName: string;
}

export const CertificateGeneratorComponent: React.FC<CertificateGeneratorComponentProps> = ({ 
  userName, 
  courseName 
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    setIsLoading(true);
    
    try {
      // Lazy-load jsPDF
      const { jsPDF } = await import('jspdf');

      // Create PDF with landscape orientation
      const doc = new jsPDF({ 
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      // Set up colors and fonts
      const primaryColor = [59, 130, 246]; // Blue
      const accentColor = [139, 92, 246]; // Purple
      
      // Add decorative border
      doc.setDrawColor(...primaryColor);
      doc.setLineWidth(2);
      doc.rect(10, 10, 277, 190);
      
      doc.setDrawColor(...accentColor);
      doc.setLineWidth(1);
      doc.rect(15, 15, 267, 180);

      // Title
      doc.setFontSize(36);
      doc.setTextColor(...primaryColor);
      doc.text('Certificate of Completion', 148.5, 50, { align: 'center' });

      // Decorative line
      doc.setDrawColor(...accentColor);
      doc.setLineWidth(0.5);
      doc.line(60, 60, 237, 60);

      // Body text
      doc.setFontSize(16);
      doc.setTextColor(60, 60, 60);
      doc.text('This certifies that', 148.5, 80, { align: 'center' });

      // User name (larger and bold)
      doc.setFontSize(28);
      doc.setTextColor(...primaryColor);
      doc.setFont('helvetica', 'bold');
      doc.text(userName, 148.5, 100, { align: 'center' });

      // Achievement text
      doc.setFontSize(16);
      doc.setTextColor(60, 60, 60);
      doc.setFont('helvetica', 'normal');
      doc.text('has successfully completed the course', 148.5, 115, { align: 'center' });

      // Course name
      doc.setFontSize(22);
      doc.setTextColor(...accentColor);
      doc.setFont('helvetica', 'bold');
      doc.text(courseName, 148.5, 135, { align: 'center' });

      // Additional info
      doc.setFontSize(14);
      doc.setTextColor(60, 60, 60);
      doc.setFont('helvetica', 'normal');
      doc.text('The Learning Science Playbook for Educators', 148.5, 150, { align: 'center' });

      // Date
      const currentDate = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text(`Issued on ${currentDate}`, 148.5, 165, { align: 'center' });

      // Footer
      doc.setFontSize(10);
      doc.setTextColor(120, 120, 120);
      doc.text('This certificate validates your understanding of evidence-based teaching strategies', 148.5, 180, { align: 'center' });

      // Add signature line
      doc.setDrawColor(100, 100, 100);
      doc.setLineWidth(0.3);
      doc.line(100, 175, 197, 175);
      doc.setFontSize(10);
      doc.text('Vincent Mutwiri, Instructor', 148.5, 182, { align: 'center' });

      // Download the PDF
      doc.save(`${userName.replace(/\s+/g, '_')}_Learning_Science_Certificate.pdf`);
      
      toast.success('Certificate downloaded successfully!');
    } catch (error) {
      console.error('Error generating certificate:', error);
      toast.error('Failed to generate certificate. Please try again.');
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
        <h4 className="text-center font-semibold mb-2">Your Official Certificate</h4>
        <p className="text-sm text-center text-muted-foreground mb-4">
          Download your personalized certificate as a PDF. Share it with colleagues, add it to your portfolio, or display it proudly!
        </p>
        <Button 
          onClick={handleGenerate} 
          disabled={isLoading} 
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
