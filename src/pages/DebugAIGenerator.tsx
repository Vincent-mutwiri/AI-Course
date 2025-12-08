import React from 'react';
import { AIGeneratorComponent } from '@/components/interactive/AIGeneratorComponent';
import { BlockRenderer } from '@/components/modules/BlockRenderer';

const DebugAIGenerator = () => {
    const directProps = {
        generatorType: 'studyBuddy',
        title: 'Direct Component Test',
        description: 'Testing AIGeneratorComponent directly',
        placeholder: 'Ask me anything...',
        options: {}
    };

    const blockProps = {
        id: 'debug-block-1',
        type: 'aiGenerator',
        order: 0,
        content: {
            generatorType: 'writingPartner',
            title: 'Block Renderer Test',
            description: 'Testing via BlockRenderer',
            placeholder: 'Paste your text...',
            options: {}
        }
    };

    return (
        <div className="container mx-auto p-8 space-y-8">
            <h1 className="text-2xl font-bold">Debug AI Generator</h1>

            <section className="p-6 border rounded-lg">
                <h2 className="text-xl font-semibold mb-4">1. Direct Component Render</h2>
                <AIGeneratorComponent {...directProps} />
            </section>

            <section className="p-6 border rounded-lg">
                <h2 className="text-xl font-semibold mb-4">2. Via BlockRenderer</h2>
                <BlockRenderer
                    blocks={[blockProps]}
                    userName="Debug User"
                    courseTitle="Debug Course"
                    courseId="debug-course-123"
                />
            </section>
        </div>
    );
};

export default DebugAIGenerator;
