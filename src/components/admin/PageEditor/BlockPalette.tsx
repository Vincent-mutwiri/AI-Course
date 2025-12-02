import React, { useState, useMemo } from 'react';
import { BlockType } from '@/types/page';

interface BlockTypeInfo {
    type: BlockType;
    name: string;
    icon: string;
    category: 'Content' | 'Interactive' | 'Advanced';
}

const BLOCK_TYPES: BlockTypeInfo[] = [
    // Content blocks
    { type: 'text', name: 'Text', icon: '📝', category: 'Content' },
    { type: 'video', name: 'Video', icon: '🎥', category: 'Content' },
    { type: 'image', name: 'Image', icon: '🖼️', category: 'Content' },
    { type: 'code', name: 'Code', icon: '💻', category: 'Content' },
    { type: 'list', name: 'List', icon: '📋', category: 'Content' },
    { type: 'divider', name: 'Divider', icon: '➖', category: 'Content' },

    // Interactive blocks
    { type: 'reflection', name: 'Reflection', icon: '💭', category: 'Interactive' },
    { type: 'poll', name: 'Poll', icon: '📊', category: 'Interactive' },
    { type: 'wordCloud', name: 'Word Cloud', icon: '☁️', category: 'Interactive' },
    { type: 'aiGenerator', name: 'AI Generator', icon: '🤖', category: 'Interactive' },
    { type: 'choiceComparison', name: 'Choice Comparison', icon: '⚖️', category: 'Interactive' },
    { type: 'finalAssessment', name: 'Final Assessment', icon: '✅', category: 'Interactive' },

    // Advanced blocks
    { type: 'certificateGenerator', name: 'Certificate', icon: '🎓', category: 'Advanced' },
    { type: 'playerTypeSimulator', name: 'Player Type Simulator', icon: '🎮', category: 'Advanced' },
    { type: 'rewardScheduleDesigner', name: 'Reward Schedule', icon: '🎁', category: 'Advanced' },
    { type: 'flowChannelEvaluator', name: 'Flow Channel', icon: '🌊', category: 'Advanced' },
    { type: 'pitchAnalysisGenerator', name: 'Pitch Analysis', icon: '🎤', category: 'Advanced' },
    { type: 'narrativeGenerator', name: 'Narrative Generator', icon: '📖', category: 'Advanced' },
    { type: 'darkPatternRedesigner', name: 'Dark Pattern Redesigner', icon: '🔄', category: 'Advanced' },
    { type: 'roeDashboard', name: 'ROE Dashboard', icon: '📈', category: 'Advanced' },
    { type: 'designFixer', name: 'Design Fixer', icon: '🔧', category: 'Advanced' },
    { type: 'journeyTimeline', name: 'Journey Timeline', icon: '🗓️', category: 'Advanced' },
    { type: 'simulation', name: 'Simulation', icon: '🎯', category: 'Advanced' },
    { type: 'aiJourney', name: 'AI Journey', icon: '🚀', category: 'Advanced' },
    { type: 'buildABot', name: 'Build a Bot', icon: '🤖', category: 'Advanced' },
    { type: 'conceptMap', name: 'Concept Map', icon: '🗺️', category: 'Advanced' },
    { type: 'dataDashboard', name: 'Data Dashboard', icon: '📊', category: 'Advanced' },
    { type: 'ethicalDilemmaSolver', name: 'Ethical Dilemma', icon: '⚖️', category: 'Advanced' },
    { type: 'gamificationConceptMap', name: 'Gamification Map', icon: '🎲', category: 'Advanced' },
    { type: 'identifyPersonalization', name: 'Personalization', icon: '👤', category: 'Advanced' },
    { type: 'playerTypeAnalyzer', name: 'Player Type Analyzer', icon: '🎮', category: 'Advanced' },
    { type: 'presentationCoach', name: 'Presentation Coach', icon: '🎤', category: 'Advanced' },
    { type: 'sentenceBuilder', name: 'Sentence Builder', icon: '✍️', category: 'Advanced' },
    { type: 'visualTokens', name: 'Visual Tokens', icon: '🎨', category: 'Advanced' },
];

interface BlockPaletteProps {
    onAddBlock: (blockType: BlockType) => void;
    onDragStart?: (blockType: BlockType) => void;
}

const BlockPalette: React.FC<BlockPaletteProps> = ({ onAddBlock, onDragStart }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');

    const categories = ['All', 'Content', 'Interactive', 'Advanced'];

    // Filter blocks based on search and category
    const filteredBlocks = useMemo(() => {
        return BLOCK_TYPES.filter(block => {
            const matchesSearch = block.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === 'All' || block.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [searchQuery, selectedCategory]);

    const handleBlockClick = (blockType: BlockType) => {
        onAddBlock(blockType);
    };

    const handleDragStart = (e: React.DragEvent, blockType: BlockType) => {
        e.dataTransfer.effectAllowed = 'copy';
        e.dataTransfer.setData('blockType', blockType);
        if (onDragStart) {
            onDragStart(blockType);
        }
    };

    return (
        <div className="block-palette">
            <div className="block-palette-header">
                <h3>Block Palette</h3>
                <input
                    type="text"
                    className="block-search"
                    placeholder="Search blocks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="block-categories">
                {categories.map(category => (
                    <button
                        key={category}
                        className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                        onClick={() => setSelectedCategory(category)}
                    >
                        {category}
                    </button>
                ))}
            </div>

            <div className="block-list">
                {filteredBlocks.length === 0 ? (
                    <div className="no-blocks">
                        <p>No blocks found</p>
                    </div>
                ) : (
                    filteredBlocks.map(block => (
                        <div
                            key={block.type}
                            className="block-item"
                            draggable
                            onDragStart={(e) => handleDragStart(e, block.type)}
                            onClick={() => handleBlockClick(block.type)}
                            title={`Click to add ${block.name} block at the end, or drag to a specific position`}
                        >
                            <span className="block-icon">{block.icon}</span>
                            <span className="block-name">{block.name}</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default BlockPalette;
