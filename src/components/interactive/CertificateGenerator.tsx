import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { Download, Award } from 'lucide-react';
import { FinalAssessment } from './FinalAssessment';
import { getToken } from '@/utils/token';
import { jwtDecode } from 'jwt-decode';

interface CertificateGeneratorProps {
  userName?: string;
}

export const CertificateGenerator = ({ userName: propUserName }: CertificateGeneratorProps = {}) => {
  const [generating, setGenerating] = useState(false);
  const [passed, setPassed] = useState(() => {
    return localStorage.getItem('certificatePassed') === 'true';
  });
  const [userName, setUserName] = useState(propUserName || 'Student');

  useEffect(() => {
    if (propUserName) {
      setUserName(propUserName);
      return;
    }
    
    const token = getToken();
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setUserName(decoded.name || decoded.email || 'Student');
      } catch (error) {
        console.error('Failed to decode token:', error);
      }
    }
  }, [propUserName]);

  const generateCertificate = () => {
    setGenerating(true);
    
    setTimeout(() => {
      const completionDate = new Date().toLocaleDateString();
      const certificateText = `Certificate of Completion\n\nThis certifies that\n\n${userName}\n\nhas successfully completed\n\nGamification for Learning: From Passive to Active\n\nCompletion Date: ${completionDate}\n\nInstructor: Vincent Mutwiri`;
      
      const blob = new Blob([certificateText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Gamification-Certificate.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setGenerating(false);
      toast.success('Certificate downloaded successfully!');
    }, 1000);
  };

  if (!passed) {
    return <FinalAssessment onPass={() => {
      setPassed(true);
      localStorage.setItem('certificatePassed', 'true');
    }} />;
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
        <div className="text-center space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border">
            <Award className="mx-auto h-16 w-16 text-yellow-500 mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">🎉 Congratulations!</h3>
            <p className="text-lg text-gray-600 mb-4">
              <strong>{userName}</strong> has successfully completed
            </p>
            <p className="text-xl font-semibold text-blue-600 mb-2">
              Gamification for Learning: From Passive to Active
            </p>
            <p className="text-sm text-gray-500">
              Completion Date: {new Date().toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-500">
              Instructor: Vincent Mutwiri
            </p>
          </div>
          
          <Button onClick={generateCertificate} disabled={generating} size="lg" className="w-full sm:w-auto">
            {generating ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin">⏳</span>
                Generating your certificate...
              </span>
            ) : (
              <>
                <Download className="mr-2 h-5 w-5" />
                Download Certificate
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
