import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const HelpPage = () => {
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Help & FAQ</h1>

      <Accordion type="single" collapsible className="space-y-4">
        <AccordionItem value="item-1">
          <AccordionTrigger>How do I navigate through lessons?</AccordionTrigger>
          <AccordionContent>
            Use the "Previous Lesson" and "Next Lesson" buttons at the bottom of each lesson. 
            You can also use keyboard shortcuts: Ctrl/Cmd + Left/Right Arrow keys.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger>How do AI-powered tools work?</AccordionTrigger>
          <AccordionContent>
            Enter your text in the input field and click "Generate". The AI will process your request 
            and provide a response. Responses are cached for 30 minutes to improve performance.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
          <AccordionTrigger>What is the character limit for AI inputs?</AccordionTrigger>
          <AccordionContent>
            All AI tools have a 5,000 character limit. A character counter is displayed below 
            each input field to help you track your usage.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4">
          <AccordionTrigger>How do I get my certificate?</AccordionTrigger>
          <AccordionContent>
            Complete all modules and pass the final assessment in Module 5 (10 out of 12 questions correct). 
            Once you pass, you can download your personalized certificate.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-5">
          <AccordionTrigger>Is my assessment progress saved?</AccordionTrigger>
          <AccordionContent>
            Yes! Your assessment answers are automatically saved to your browser. You can close 
            the page and return later to continue where you left off.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-6">
          <AccordionTrigger>What are the interactive elements?</AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Visual Tokens:</strong> See how AI breaks text into tokens</li>
              <li><strong>Sentence Builder:</strong> Experience AI text prediction</li>
              <li><strong>Build-a-Bot:</strong> Create custom AI personalities</li>
              <li><strong>AI Study Buddy:</strong> Get text summaries</li>
              <li><strong>Writing Partner:</strong> Receive writing feedback</li>
              <li><strong>Code Debugger:</strong> Debug code with AI help</li>
              <li><strong>Presentation Coach:</strong> Analyze presentation scripts</li>
              <li><strong>Data Dashboard:</strong> Explore school data insights</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-7">
          <AccordionTrigger>Why am I seeing "loaded from cache"?</AccordionTrigger>
          <AccordionContent>
            To improve performance and reduce API costs, identical AI requests are cached for 30 minutes. 
            This means you'll get instant responses for repeated queries.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-8">
          <AccordionTrigger>Can I use this course on mobile?</AccordionTrigger>
          <AccordionContent>
            Yes! All components are optimized for mobile devices. Charts and interactive elements 
            are responsive and work on all screen sizes.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-9">
          <AccordionTrigger>What if I encounter an error?</AccordionTrigger>
          <AccordionContent>
            Most errors will show a helpful message. Common issues:
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Authentication errors: Log in again</li>
              <li>Service unavailable: Try again in a few minutes</li>
              <li>Component crashes: Refresh the page</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-10">
          <AccordionTrigger>How is my progress tracked?</AccordionTrigger>
          <AccordionContent>
            Your progress is automatically saved as you complete lessons and quizzes. 
            You can view your journey in Module 5 or on your dashboard.
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Still need help?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            If you can't find the answer you're looking for, please contact support or 
            check the course documentation for more detailed information.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default HelpPage;
