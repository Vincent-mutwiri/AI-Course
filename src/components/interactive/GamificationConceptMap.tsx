import { useCallback, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    Node,
    Edge,
    Connection,
    addEdge,
    useNodesState,
    useEdgesState,
    MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Gamepad2 } from 'lucide-react';

// Define initial nodes for gamification concepts
const initialNodes: Node[] = [
    {
        id: '1',
        type: 'input',
        data: { label: '🎮 Gamification' },
        position: { x: 400, y: 0 },
        style: {
            background: '#8b5cf6',
            color: 'white',
            border: '2px solid #7c3aed',
            borderRadius: '8px',
            padding: '10px',
            fontSize: '16px',
            fontWeight: 'bold',
        },
    },
    {
        id: '2',
        data: { label: '🧠 Psychology (SDT)' },
        position: { x: 200, y: 150 },
        style: {
            background: '#3b82f6',
            color: 'white',
            border: '2px solid #2563eb',
            borderRadius: '8px',
            padding: '10px',
            fontSize: '14px',
            fontWeight: '600',
        },
    },
    {
        id: '3',
        data: { label: '🎨 Design (MDA)' },
        position: { x: 600, y: 150 },
        style: {
            background: '#ec4899',
            color: 'white',
            border: '2px solid #db2777',
            borderRadius: '8px',
            padding: '10px',
            fontSize: '14px',
            fontWeight: '600',
        },
    },
    {
        id: '4',
        data: { label: '🔄 Core Loop' },
        position: { x: 600, y: 300 },
        style: {
            background: '#f59e0b',
            color: 'white',
            border: '2px solid #d97706',
            borderRadius: '8px',
            padding: '10px',
            fontSize: '14px',
            fontWeight: '600',
        },
    },
    {
        id: '5',
        type: 'output',
        data: { label: '👥 Player Types' },
        position: { x: 200, y: 300 },
        style: {
            background: '#10b981',
            color: 'white',
            border: '2px solid #059669',
            borderRadius: '8px',
            padding: '10px',
            fontSize: '14px',
            fontWeight: '600',
        },
    },
];

// Define initial edges with relationship labels
const initialEdges: Edge[] = [
    {
        id: 'e1-2',
        source: '1',
        target: '2',
        label: 'Driven by',
        type: 'smoothstep',
        animated: true,
        markerEnd: {
            type: MarkerType.ArrowClosed,
        },
        style: { stroke: '#3b82f6', strokeWidth: 2 },
        labelStyle: { fill: '#3b82f6', fontWeight: 600 },
    },
    {
        id: 'e1-3',
        source: '1',
        target: '3',
        label: 'Built using',
        type: 'smoothstep',
        animated: true,
        markerEnd: {
            type: MarkerType.ArrowClosed,
        },
        style: { stroke: '#ec4899', strokeWidth: 2 },
        labelStyle: { fill: '#ec4899', fontWeight: 600 },
    },
    {
        id: 'e2-5',
        source: '2',
        target: '5',
        label: 'Defines',
        type: 'smoothstep',
        markerEnd: {
            type: MarkerType.ArrowClosed,
        },
        style: { stroke: '#10b981', strokeWidth: 2 },
        labelStyle: { fill: '#10b981', fontWeight: 600 },
    },
    {
        id: 'e3-4',
        source: '3',
        target: '4',
        label: 'Creates',
        type: 'smoothstep',
        markerEnd: {
            type: MarkerType.ArrowClosed,
        },
        style: { stroke: '#f59e0b', strokeWidth: 2 },
        labelStyle: { fill: '#f59e0b', fontWeight: 600 },
    },
];

export const GamificationConceptMap: React.FC = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    );

    return (
        <Card className="w-full">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <Gamepad2 className="h-8 w-8 text-primary" />
                    <div>
                        <CardTitle className="text-2xl">Gamification Concept Map</CardTitle>
                        <CardDescription>
                            Explore the relationships between key gamification concepts. Drag nodes to rearrange, zoom to explore.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="w-full h-[500px] md:h-[600px] border-2 rounded-lg overflow-hidden bg-muted/30">
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        fitView
                        minZoom={0.5}
                        maxZoom={2}
                        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
                    >
                        <Background color="#aaa" gap={16} />
                        <Controls />
                        <MiniMap
                            className="hidden md:block"
                            nodeColor={(node) => {
                                const style = node.style as any;
                                return style?.background || '#8b5cf6';
                            }}
                            maskColor="rgba(0, 0, 0, 0.1)"
                        />
                    </ReactFlow>
                </div>

                {/* Educational Commentary */}
                <div className="mt-6 space-y-4">
                    <div className="p-4 bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                        <p className="text-sm">
                            <strong>🎮 Gamification:</strong> The application of game design elements in non-game contexts
                            to increase engagement, motivation, and learning outcomes.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                            <p className="text-sm">
                                <strong>🧠 Psychology (SDT):</strong> Self-Determination Theory explains intrinsic motivation
                                through autonomy, competence, and relatedness—the foundation of effective gamification.
                            </p>
                        </div>

                        <div className="p-3 bg-pink-50 dark:bg-pink-950/20 border border-pink-200 dark:border-pink-800 rounded-lg">
                            <p className="text-sm">
                                <strong>🎨 Design (MDA):</strong> Mechanics-Dynamics-Aesthetics framework structures how
                                game rules create player experiences and emotional responses.
                            </p>
                        </div>

                        <div className="p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                            <p className="text-sm">
                                <strong>👥 Player Types:</strong> Bartle/Marczewski taxonomies classify learner preferences
                                (Achievers, Explorers, Socializers, Disruptors) to personalize experiences.
                            </p>
                        </div>

                        <div className="p-3 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                            <p className="text-sm">
                                <strong>🔄 Core Loop:</strong> The fundamental cycle of Action → Feedback → Reward that
                                drives engagement and creates the "just one more" effect.
                            </p>
                        </div>
                    </div>

                    <div className="p-4 bg-muted border rounded-lg">
                        <p className="text-sm text-muted-foreground">
                            <strong>💡 Tip:</strong> These concepts are interconnected. Effective gamification starts with
                            understanding learner psychology, applies design frameworks to create mechanics, identifies
                            player types for personalization, and builds engaging core loops that keep learners coming back.
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
