import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  { month: "Jul", value: 300 },
  { month: "Aug", value: 250 },
  { month: "Sep", value: 450 },
  { month: "Oct", value: 700 },
  { month: "Nov", value: 200 },
  { month: "Dec", value: 500 },
  { month: "Jan", value: 600 },
]

export function RecentResult() {
  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: 0,
            bottom: 10,
          }}
        >
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} dy={10} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} dx={-10} />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "none",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            }}
            itemStyle={{ color: "#4F46E5" }}
            labelStyle={{ fontWeight: "bold" }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#4F46E5"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorValue)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
