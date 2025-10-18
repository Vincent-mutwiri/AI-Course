import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { jsPDF } from 'jspdf';
import { Download } from 'lucide-react';
import { FinalAssessment } from './FinalAssessment';
import { getToken } from '@/utils/token';
import { jwtDecode } from 'jwt-decode';

export const CertificateGenerator = () => {
  const [generating, setGenerating] = useState(false);
  const [passed, setPassed] = useState(false);
  const [userName, setUserName] = useState('Student');

  useEffect(() => {
    const token = getToken();
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setUserName(decoded.name || decoded.email || 'Student');
      } catch (error) {
        console.error('Failed to decode token:', error);
      }
    }
  }, []);

  const generateCertificate = () => {
    setGenerating(true);
    
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    const completionDate = new Date().toLocaleDateString();

    doc.setFontSize(40);
    doc.text('Certificate of Completion', 148, 60, { align: 'center' });
    
    doc.setFontSize(20);
    doc.text('This certifies that', 148, 90, { align: 'center' });
    
    doc.setFontSize(30);
    doc.text(userName, 148, 110, { align: 'center' });
    
    doc.setFontSize(20);
    doc.text('has successfully completed', 148, 130, { align: 'center' });
    
    doc.setFontSize(25);
    doc.text('AI in Education Course', 148, 150, { align: 'center' });
    
    doc.setFontSize(15);
    doc.text(`Completion Date: ${completionDate}`, 148, 180, { align: 'center' });

    doc.save('AI-Course-Certificate.pdf');
    setGenerating(false);
  };

  if (!passed) {
    return <FinalAssessment onPass={() => setPassed(true)} />;
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Certificate of Completion</CardTitle>
        <p className="text-sm text-muted-foreground">
          Download your course completion certificate
        </p>
      </CardHeader>
      <CardContent>
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">
            Congratulations {userName} on completing the AI in Education course!
          </p>
          <Button onClick={generateCertificate} disabled={generating} size="lg">
            <Download className="mr-2 h-5 w-5" />
            {generating ? 'Generating...' : 'Download Certificate'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
