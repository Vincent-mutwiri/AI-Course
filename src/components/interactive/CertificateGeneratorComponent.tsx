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
      // Lazy-load pdf-lib
      const { PDFDocument, rgb, StandardFonts } = await import('pdf-lib');

      // Create landscape PDF page (800x600)
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([800, 600]);

      // Embed fonts
      const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
      const timesRomanBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

      const { width, height } = page.getSize();

      // Define colors
      const primaryBlue = rgb(0.23, 0.51, 0.96); // #3B82F6
      const accentPurple = rgb(0.55, 0.36, 0.96); // #8B5CF6
      const darkGray = rgb(0.24, 0.24, 0.24);
      const mediumGray = rgb(0.47, 0.47, 0.47);

      // Add decorative border
      page.drawRectangle({
        x: 30,
        y: 30,
        width: width - 60,
        height: height - 60,
        borderColor: primaryBlue,
        borderWidth: 3,
      });

      page.drawRectangle({
        x: 40,
        y: 40,
        width: width - 80,
        height: height - 80,
        borderColor: accentPurple,
        borderWidth: 1.5,
      });

      // Add certificate title
      const titleText = 'Certificate of Completion';
      const titleSize = 48;
      page.drawText(titleText, {
        x: width / 2 - timesRomanBold.widthOfTextAtSize(titleText, titleSize) / 2,
        y: height - 120,
        size: titleSize,
        font: timesRomanBold,
        color: primaryBlue,
      });

      // Add decorative line
      page.drawLine({
        start: { x: 150, y: height - 140 },
        end: { x: width - 150, y: height - 140 },
        thickness: 1,
        color: accentPurple,
      });

      // Add "This certifies that" text
      const certifiesText = 'This certifies that';
      const certifiesSize = 20;
      page.drawText(certifiesText, {
        x: width / 2 - timesRomanFont.widthOfTextAtSize(certifiesText, certifiesSize) / 2,
        y: height - 200,
        size: certifiesSize,
        font: timesRomanFont,
        color: darkGray,
      });

      // Add learner name (larger and bold)
      const nameSize = 36;
      page.drawText(userName, {
        x: width / 2 - timesRomanBold.widthOfTextAtSize(userName, nameSize) / 2,
        y: height - 260,
        size: nameSize,
        font: timesRomanBold,
        color: primaryBlue,
      });

      // Add "has successfully completed the course" text
      const completedText = 'has successfully completed the course';
      const completedSize = 18;
      page.drawText(completedText, {
        x: width / 2 - timesRomanFont.widthOfTextAtSize(completedText, completedSize) / 2,
        y: height - 310,
        size: completedSize,
        font: timesRomanFont,
        color: darkGray,
      });

      // Add course title
      const courseTitleSize = 28;
      page.drawText(courseTitle, {
        x: width / 2 - timesRomanBold.widthOfTextAtSize(courseTitle, courseTitleSize) / 2,
        y: height - 360,
        size: courseTitleSize,
        font: timesRomanBold,
        color: accentPurple,
      });

      // Add completion date
      const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      const dateText = `Issued on ${currentDate}`;
      const dateSize = 14;
      page.drawText(dateText, {
        x: width / 2 - helveticaFont.widthOfTextAtSize(dateText, dateSize) / 2,
        y: height - 420,
        size: dateSize,
        font: helveticaFont,
        color: mediumGray,
      });

      // Add signature line
      page.drawLine({
        start: { x: width / 2 - 100, y: 120 },
        end: { x: width / 2 + 100, y: 120 },
        thickness: 1,
        color: mediumGray,
      });

      // Add instructor name
      const instructorText = 'Vincent Mutwiri, Instructor';
      const instructorSize = 12;
      page.drawText(instructorText, {
        x: width / 2 - helveticaFont.widthOfTextAtSize(instructorText, instructorSize) / 2,
        y: 100,
        size: instructorSize,
        font: helveticaFont,
        color: mediumGray,
      });

      // Add footer text
      const footerText = 'This certificate validates your understanding of gamification principles';
      const footerSize = 10;
      page.drawText(footerText, {
        x: width / 2 - helveticaFont.widthOfTextAtSize(footerText, footerSize) / 2,
        y: 60,
        size: footerSize,
        font: helveticaFont,
        color: mediumGray,
      });

      // Serialize the PDF to bytes
      const pdfBytes = await pdfDoc.save();

      // Implement auto-download functionality with proper filename formatting
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Certificate-${userName.replace(/\s+/g, '_')}.pdf`;
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
          You've completed the course! Download your personalized certificate as a PDF. Share it with colleagues, add it to your portfolio, or display it proudly!
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
