import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const data = [
  {
    subject: "Data Structures",
    score: 85,
  },
  {
    subject: "Algorithms",
    score: 78,
  },
  {
    subject: "Web Development",
    score: 92,
  },
  {
    subject: "Database Systems",
    score: 88,
  },
  {
    subject: "Computer Networks",
    score: 76,
  },
]

export function ResultsOverview() {
  return (
    <div className="w-full max-w-full">
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Overall Performance</CardTitle>
          <CardDescription>Your average score across all subjects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-5xl font-bold text-primary">83.8%</div>
            <p className="text-sm text-muted-foreground mt-2">Grade: B+</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Subject Performance</CardTitle>
          <CardDescription>Your scores by subject</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data}>
              <XAxis
                dataKey="subject"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => value.substring(0, 3)}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}%`}
              />
              <Bar dataKey="score" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
    </div>
  )
}
