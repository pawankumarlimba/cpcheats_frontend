"use client"

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface TopicComparisonChartProps {
  data: {
    topic: string;
    you: number;
    friend: number;
  }[];
}

export default function TopicComparisonChart({ data }: TopicComparisonChartProps) {
  return (
    <div className="w-full h-[500px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="topic" angle={-45} textAnchor="end" height={70} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="you" name="You" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          <Bar dataKey="friend" name="Friend" fill="#10b981" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
