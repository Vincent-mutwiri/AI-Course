import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Award } from 'lucide-react';
import { getToken } from '@/utils/token';
import { jwtDecode } from 'jwt-decode';

interface CertificateGeneratorProps {
  userName?: string;
  courseTitle?: string;
  config?: {
    logoUrl?: string;
    backgroundUrl?: string;
    signatureUrl?: string;
  };
}

export const CertificateGenerator = ({ userName: propUserName, courseTitle, config }: CertificateGeneratorProps = {}) => {
  const [generating, setGenerating] = useState(false);
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

  const generateCertificate = async () => {
    setGenerating(true);

    try {
      const completionDate = new Date().toLocaleDateString();

      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 800;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('Could not get canvas context');
      }

      // Helper function to load images with CORS proxy fallback
      const loadImage = (src: string): Promise<HTMLImageElement> => {
        return new Promise((resolve, reject) => {
          const img = new Image();

          // Try without crossOrigin first (for same-origin images)
          const tryLoad = (useCors: boolean) => {
            if (useCors) {
              img.crossOrigin = 'anonymous';
            }

            img.onload = () => resolve(img);
            img.onerror = () => {
              if (useCors) {
                // If CORS failed, try without it
                console.warn(`CORS failed for ${src}, trying without crossOrigin`);
                const img2 = new Image();
                img2.onload = () => resolve(img2);
                img2.onerror = () => reject(new Error(`Failed to load image: ${src}`));
                img2.src = src;
              } else {
                reject(new Error(`Failed to load image: ${src}`));
              }
            };
            img.src = src;
          };

          // Start with CORS enabled
          tryLoad(true);
        });
      };

      // Load all images if they exist
      const imagePromises: Promise<HTMLImageElement | null>[] = [];

      if (config?.backgroundUrl) {
        imagePromises.push(loadImage(config.backgroundUrl).catch(() => null));
      } else {
        imagePromises.push(Promise.resolve(null));
      }

      if (config?.logoUrl) {
        imagePromises.push(loadImage(config.logoUrl).catch(() => null));
      } else {
        imagePromises.push(Promise.resolve(null));
      }

      if (config?.signatureUrl) {
        imagePromises.push(loadImage(config.signatureUrl).catch(() => null));
      } else {
        imagePromises.push(Promise.resolve(null));
      }

      const [backgroundImg, logoImg, signatureImg] = await Promise.all(imagePromises);

      // Draw background
      if (backgroundImg) {
        ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
      } else {
        // Default white background with gradient
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#ffffff');
        gradient.addColorStop(1, '#f3f4f6');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Draw border
      ctx.strokeStyle = '#2563eb';
      ctx.lineWidth = 10;
      ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);

      // Draw logo if available
      if (logoImg) {
        const logoHeight = 80;
        const logoWidth = (logoImg.width / logoImg.height) * logoHeight;
        ctx.drawImage(logoImg, (canvas.width - logoWidth) / 2, 60, logoWidth, logoHeight);
      }

      // Title
      ctx.fillStyle = '#1e40af';
      ctx.font = 'bold 60px Arial';
      ctx.textAlign = 'center';
      const titleY = logoImg ? 180 : 150;
      ctx.fillText('Certificate of Completion', canvas.width / 2, titleY);

      ctx.fillStyle = '#374151';
      ctx.font = '30px Arial';
      ctx.fillText('This certifies that', canvas.width / 2, titleY + 100);

      ctx.fillStyle = '#1e40af';
      ctx.font = 'bold 50px Arial';
      ctx.fillText(userName, canvas.width / 2, titleY + 190);

      ctx.fillStyle = '#374151';
      ctx.font = '30px Arial';
      ctx.fillText('has successfully completed', canvas.width / 2, titleY + 270);

      ctx.fillStyle = '#1e40af';
      ctx.font = 'bold 36px Arial';
      ctx.fillText(courseTitle || 'Course', canvas.width / 2, titleY + 350);

      ctx.fillStyle = '#6b7280';
      ctx.font = '24px Arial';
      ctx.fillText(`Completion Date: ${completionDate}`, canvas.width / 2, titleY + 450);

      // Draw signature if available (above instructor name)
      if (signatureImg) {
        const sigHeight = 40; // Reduced from 60 to 40
        const sigWidth = (signatureImg.width / signatureImg.height) * sigHeight;
        ctx.drawImage(signatureImg, (canvas.width - sigWidth) / 2, titleY + 470, sigWidth, sigHeight);
      }

      // Instructor name below signature
      ctx.fillText('Instructor: Vincent Mutwiri', canvas.width / 2, titleY + 530);

      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `Certificate-${userName.replace(/\s+/g, '_')}.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);

          setGenerating(false);
          toast.success('Certificate downloaded successfully!');
        }
      });
    } catch (error) {
      console.error('Error generating certificate:', error);
      toast.error('Failed to generate certificate');
      setGenerating(false);
    }
  };

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
              {courseTitle || 'Course'}
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
