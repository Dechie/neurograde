import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface Result {
  id: number;
  test: {
    title: string;
  };
  score: number;
  submission_date?: string;
  // other properties
}

interface RecentResultProps {
  results?: Result[];
}

export function RecentResult({ results = [] }: RecentResultProps) {
  // Use sample data if no results are provided
  const data = results.length > 0 
    ? results.map(result => ({
        name: result.test.title,
        value: result.score
      }))
    : [
        { month: "Jul", value: 300 },
        { month: "Aug", value: 400 },
        { month: "Sep", value: 200 },
        { month: "Oct", value: 500 },
        { month: "Nov", value: 350 },
        { month: "Dec", value: 450 },
      ];

  if (results.length === 0) {
    return (
      <div className="rounded-lg border p-6 text-center">
        <p className="text-muted-foreground">No recent results available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Set explicit height for the chart container */}
      <div style={{ width: '100%', height: '200px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey={results.length > 0 ? "name" : "month"} 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12 }} 
            />
            <YAxis hide />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#8884d8"
              fillOpacity={1}
              fill="url(#colorValue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* List of recent results */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Recent Tests</h3>
        <ul className="space-y-1">
          {results.map((result) => (
            <li key={result.id} className="flex items-center justify-between text-sm">
              <span className="truncate">{result.test.title}</span>
              <span className="font-medium">{result.score}%</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}