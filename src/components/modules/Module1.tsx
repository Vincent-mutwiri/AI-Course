import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { ArrowRight } from 'lucide-react';
import { IdentifyPersonalization } from '@/components/interactive/IdentifyPersonalization';
import { EthicalDilemmaSolver } from '@/components/interactive/EthicalDilemmaSolver';

export const Module1 = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Module 1: Introduction to AI in Education</h1>
        <p className="text-muted-foreground">
          Understanding the role of AI in modern education and its impact on learning experiences.
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Learning Objectives</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-6 space-y-2">
            <li>Understand the fundamentals of AI in educational technology</li>
            <li>Explore real-world applications of AI in education</li>
            <li>Identify opportunities for AI personalization in learning</li>
            <li>Examine ethical considerations in AI-powered education</li>
          </ul>
        </CardContent>
      </Card>

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>1.1 The Rise of AI in Education</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Artificial Intelligence is transforming education by enabling personalized learning experiences, 
              automating administrative tasks, and providing valuable insights into student performance.
            </p>
            <p>
              In this module, we'll explore how AI is being used in classrooms, online learning platforms, 
              and educational institutions worldwide.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>1.2 Interactive Exercise: Identify Personalization Opportunities</CardTitle>
          </CardHeader>
          <CardContent>
            <IdentifyPersonalization />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>1.3 Ethical Considerations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              As we integrate AI into education, we must consider important ethical questions about data privacy, 
              algorithmic bias, and the role of human teachers.
            </p>
            <EthicalDilemmaSolver />
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button>
            Next Module <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Module1;
