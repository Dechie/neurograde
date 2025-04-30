import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

export function UpcomingTest() {
  const upcomingTests = [
    {
      id: 1,
      title: "Data Structures Quiz",
      date: "May 15, 2025",
      time: "10:00 AM",
      duration: "1 hour",
    },
    {
      id: 2,
      title: "Algorithms Midterm",
      date: "May 20, 2025",
      time: "2:00 PM",
      duration: "2 hours",
    },
  ]

  return (
    <div className="space-y-4">
      {upcomingTests.map((test) => (
        <Card key={test.id} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{test.title}</h3>
                <Badge variant="outline" className="bg-blue-light text-blue">
                  {test.duration}
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                {test.date} at {test.time}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
