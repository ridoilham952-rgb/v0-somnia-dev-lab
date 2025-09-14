"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

interface MetricsChartProps {
  data: Array<{
    timestamp: string
    tps: number
    errors: number
    totalEvents: number
  }>
}

export function MetricsChart({ data }: MetricsChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Real-time Metrics</CardTitle>
        <CardDescription>TPS and error rates over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          {data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="timestamp" className="text-xs fill-muted-foreground" tick={{ fontSize: 10 }} />
                <YAxis className="text-xs fill-muted-foreground" tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="tps"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={2}
                  dot={false}
                  name="Events/Second"
                />
                <Line
                  type="monotone"
                  dataKey="errors"
                  stroke="hsl(var(--destructive))"
                  strokeWidth={2}
                  dot={false}
                  name="Errors"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Start monitoring to see real-time metrics
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
