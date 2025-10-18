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
        <div style={{ height: '500px' }}>
          <ReactFlow
            nodes={conceptMapData.nodes}
            edges={conceptMapData.edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            fitView
          >
            <Background />
            <Controls />
            <MiniMap />
          </ReactFlow>
        </div>
      </CardContent>
    </Card>
  );
};
