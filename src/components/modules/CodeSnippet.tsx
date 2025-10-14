import { Card } from "@/components/ui/card";
import { Code } from "lucide-react";

export const CodeSnippet = ({ codeSnippet }: { codeSnippet: any }) => {
  if (!codeSnippet) return null;

  return (
    <Card className="p-6 bg-gray-900 text-gray-100">
      <div className="flex items-center gap-2 mb-4">
        <Code className="h-5 w-5" />
        <h4 className="font-semibold">{codeSnippet.title}</h4>
        <span className="ml-auto text-xs bg-gray-800 px-2 py-1 rounded">
          {codeSnippet.language}
        </span>
      </div>
      <pre className="overflow-x-auto">
        <code className="text-sm">{codeSnippet.code}</code>
      </pre>
    </Card>
  );
};
