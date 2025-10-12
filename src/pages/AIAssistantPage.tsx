import AIChat from "@/components/shared/AIChat";

export default function AIAssistantPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">AI Learning Assistant</h1>
        <p className="text-muted-foreground">
          Get help with your courses, ask questions, and learn more effectively
        </p>
      </div>
      <AIChat />
    </div>
  );
}
