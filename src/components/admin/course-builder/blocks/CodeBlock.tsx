import React, { useEffect, useRef } from 'react';
import { Code } from 'lucide-react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';

// Import common language support
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-sql';

interface CodeBlockProps {
    content: {
        code?: string;
        language?: string;
    };
    isPreview?: boolean;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ content, isPreview = false }) => {
    const { code = '', language = 'javascript' } = content;
    const codeRef = useRef<HTMLElement>(null);

    useEffect(() => {
        if (codeRef.current && code) {
            Prism.highlightElement(codeRef.current);
        }
    }, [code, language]);

    if (!code) {
        return (
            <div className="flex items-center justify-center p-8 border border-dashed border-gray-300 rounded bg-gray-50">
                <div className="text-center">
                    <Code className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-400 italic">No code configured. Click edit to add code.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative">
            {/* Language badge */}
            <div className="absolute top-2 right-2 z-10">
                <span className="px-2 py-1 text-xs font-semibold text-white bg-gray-700 rounded">
                    {language}
                </span>
            </div>

            {/* Code block */}
            <pre className="!mt-0 !mb-0 rounded overflow-x-auto">
                <code ref={codeRef} className={`language-${language}`}>
                    {code}
                </code>
            </pre>
        </div>
    );
};
