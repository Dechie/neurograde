import { Bar, BarChart, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  { day: "Sat", deposit: 250, withdraw: 200 },
  { day: "Sun", deposit: 300, withdraw: 150 },
  { day: "Mon", deposit: 200, withdraw: 220 },
  { day: "Tue", deposit: 400, withdraw: 350 },
  { day: "Wed", deposit: 150, withdraw: 200 },
  { day: "Thu", deposit: 350, withdraw: 200 },
  { day: "Fri", deposit: 400, withdraw: 350 },
]

export function QuickStats() {
  return (
    <ChartContainer
      config={{
        deposit: {
          label: "Deposit",
          color: "hsl(var(--primary))",
        },
        withdraw: {
          label: "Withdraw",
          color: "hsl(var(--chart-2))",
        },
      }}
      className="h-[300px]"
    >
      <BarChart
        data={data}
        margin={{
          top: 5,
          right: 5,
          left: 5,
          bottom: 5,
        }}
      >
        <XAxis dataKey="day" axisLine={false} tickLine={false} />
        <YAxis hide />
        <ChartTooltip content={<ChartTooltipContent />} cursor={false} />
        <Bar dataKey="deposit" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={20} />
        <Bar dataKey="withdraw" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} barSize={20} />
      </BarChart>
    </ChartContainer>
  )
}
