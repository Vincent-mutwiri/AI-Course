import { useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ReactFlow, { Background, Controls, MiniMap } from 'reactflow';
import 'reactflow/dist/style.css';
import conceptMapData from '@/data/conceptMap.json';

export const ConceptMap = () => {
  const onNodesChange = useCallback(() => {}, []);
  const onEdgesChange = useCallback(() => {}, []);

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Interactive Concept Map</CardTitle>
        <p className="text-sm text-muted-foreground">
          Explore how AI concepts connect
        </p>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[500px] md:h-[600px] overflow-hidden">
          <ReactFlow
            nodes={conceptMapData.nodes}
            edges={conceptMapData.edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            fitView
            minZoom={0.1}
            maxZoom={1.5}
          >
            <Background />
            <Controls />
            <MiniMap className="hidden md:block" />
          </ReactFlow>
        </div>
      </CardContent>
    </Card>
  );
};
