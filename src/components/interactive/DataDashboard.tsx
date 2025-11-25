import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Default school data (can be overridden via props)
const defaultSchoolData = {
  attendance: [
    { month: "Sep", rate: 94 },
    { month: "Oct", rate: 92 },
    { month: "Nov", rate: 89 },
    { month: "Dec", rate: 91 },
    { month: "Jan", rate: 88 },
    { month: "Feb", rate: 93 }
  ],
  grades: [
    { grade: "A", count: 45 },
    { grade: "B", count: 78 },
    { grade: "C", count: 52 },
    { grade: "D", count: 18 },
    { grade: "F", count: 7 }
  ],
  aiInsight: "Analysis shows a correlation between attendance rates and grade distribution. The dip in January attendance (88%) coincides with lower performance. Consider implementing targeted interventions for students with attendance below 90%. The data suggests that students with consistent attendance (>92%) are 3x more likely to achieve A or B grades."
};

interface DataDashboardProps {
  data?: {
    attendance?: Array<{ month: string; rate: number }>;
    grades?: Array<{ grade: string; count: number }>;
    aiInsight?: string;
  };
}

export const DataDashboard: React.FC<DataDashboardProps> = ({ data }) => {
  const schoolData = data || defaultSchoolData;
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
        <div className="overflow-x-auto">
          <h3 className="font-semibold mb-3">Attendance Trends</h3>
          <div className="min-w-[300px]">
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
        </div>

        <div className="overflow-x-auto">
          <h3 className="font-semibold mb-3">Grade Distribution</h3>
          <div className="min-w-[300px]">
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
