import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import schoolData from '@/data/simulations/schoolData.json';

export const DataDashboard = () => {
  const [showInsights, setShowInsights] = useState(false);

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>School Data Insights Dashboard</CardTitle>
        <p className="text-sm text-muted-foreground">
          Analyze school performance data with AI-powered insights
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-semibold mb-3">Attendance Trends</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={schoolData.attendance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="rate" stroke="#8884d8" name="Attendance %" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Grade Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={schoolData.grades}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="grade" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#82ca9d" name="Students" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <Button onClick={() => setShowInsights(!showInsights)} className="w-full">
          {showInsights ? 'Hide AI Insights' : 'Ask AI for Insights'}
        </Button>

        {showInsights && (
          <div className="p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium mb-2">AI Analysis:</h4>
            <p className="text-sm whitespace-pre-wrap">{schoolData.aiInsight}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
