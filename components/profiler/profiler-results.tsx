"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

interface ProfileData {
  contractAddress: string
  functions: Array<{
    name: string
    gasUsed: number
    executionTime: number
    callCount: number
    averageGas: number
  }>
  totalGasUsed: number
  totalExecutionTime: number
  optimizationScore: number
  suggestions: Array<{
    type: "warning" | "error" | "info"
    message: string
    function?: string
  }>
}

interface ProfilerResultsProps {
  data: ProfileData
}

export function ProfilerResults({ data }: ProfilerResultsProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent"
    if (score >= 60) return "Good"
    return "Needs Improvement"
  }

  const chartData = data.functions.map((func) => ({
    name: func.name,
    gasUsed: func.gasUsed,
    executionTime: func.executionTime,
    callCount: func.callCount,
  }))

  const pieData = data.functions.map((func, index) => ({
    name: func.name,
    value: func.gasUsed,
    color: `hsl(${(index * 360) / data.functions.length}, 70%, 50%)`,
  }))

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Optimization Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getScoreColor(data.optimizationScore)}`}>
              {data.optimizationScore}/100
            </div>
            <p className="text-xs text-muted-foreground">{getScoreLabel(data.optimizationScore)}</p>
            <Progress value={data.optimizationScore} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Gas Used</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalGasUsed.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across all functions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Execution Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalExecutionTime}ms</div>
            <p className="text-xs text-muted-foreground">Total runtime</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Functions Analyzed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.functions.length}</div>
            <p className="text-xs text-muted-foreground">Contract functions</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Gas Usage by Function</CardTitle>
            <CardDescription>Gas consumption across different contract functions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" className="text-xs fill-muted-foreground" tick={{ fontSize: 10 }} />
                  <YAxis className="text-xs fill-muted-foreground" tick={{ fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px",
                    }}
                  />
                  <Bar dataKey="gasUsed" fill="hsl(var(--chart-1))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gas Distribution</CardTitle>
            <CardDescription>Proportional gas usage across functions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Function Details */}
      <Card>
        <CardHeader>
          <CardTitle>Function Performance Details</CardTitle>
          <CardDescription>Detailed breakdown of each function's performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.functions
              .sort((a, b) => b.gasUsed - a.gasUsed)
              .map((func, index) => (
                <div key={func.name} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className="font-mono">
                      #{index + 1}
                    </Badge>
                    <div>
                      <h4 className="font-semibold">{func.name}</h4>
                      <p className="text-sm text-muted-foreground">{func.callCount} calls</p>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Gas:</span>{" "}
                      <span className="font-mono">{func.gasUsed.toLocaleString()}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Avg:</span>{" "}
                      <span className="font-mono">{func.averageGas.toLocaleString()}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Time:</span>{" "}
                      <span className="font-mono">{func.executionTime}ms</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
