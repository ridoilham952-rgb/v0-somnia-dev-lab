"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Activity, TrendingUp, Zap, AlertTriangle, Play, Pause } from "lucide-react"
import { useSocket } from "@/hooks/use-socket"
import { MetricsChart } from "./metrics-chart"
import { EventsTable } from "./events-table"
import { NetworkStatus } from "./network-status"

interface Event {
  id: string
  contractAddress: string
  eventName: string
  blockNumber: number
  transactionHash: string
  args: any[]
  gasUsed: string
  timestamp: string
}

interface Metrics {
  totalEvents: number
  eventsPerSecond: number
  errorCount: number
  lastEventTime: string
}

export default function DashboardClient() {
  const [contractAddress, setContractAddress] = useState("")
  const [isMonitoring, setIsMonitoring] = useState(false)
  const [events, setEvents] = useState<Event[]>([])
  const [metrics, setMetrics] = useState<Metrics>({
    totalEvents: 0,
    eventsPerSecond: 0,
    errorCount: 0,
    lastEventTime: "",
  })
  const [chartData, setChartData] = useState<any[]>([])

  const { socket, isConnected } = useSocket()

  useEffect(() => {
    if (!socket) return

    socket.on("new-event", (event: Event) => {
      setEvents((prev) => [event, ...prev.slice(0, 99)]) // Keep last 100 events
    })

    socket.on("metrics-update", (newMetrics: Metrics) => {
      setMetrics(newMetrics)

      // Update chart data
      setChartData((prev) => {
        const newDataPoint = {
          timestamp: new Date().toLocaleTimeString(),
          tps: newMetrics.eventsPerSecond,
          errors: newMetrics.errorCount,
          totalEvents: newMetrics.totalEvents,
        }
        return [...prev.slice(-29), newDataPoint] // Keep last 30 data points
      })
    })

    socket.on("recent-events", (recentEvents: Event[]) => {
      setEvents(recentEvents)
    })

    return () => {
      socket.off("new-event")
      socket.off("metrics-update")
      socket.off("recent-events")
    }
  }, [socket])

  const handleStartMonitoring = () => {
    if (!contractAddress || !socket) return

    socket.emit("subscribe", contractAddress)
    setIsMonitoring(true)
    setEvents([])
    setChartData([])
  }

  const handleStopMonitoring = () => {
    if (!contractAddress || !socket) return

    socket.emit("unsubscribe", contractAddress)
    setIsMonitoring(false)
  }

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <NetworkStatus isConnected={isConnected} />

      {/* Contract Input */}
      <Card>
        <CardHeader>
          <CardTitle>Contract Monitoring</CardTitle>
          <CardDescription>Enter a contract address to start monitoring events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              placeholder="0x... Contract Address"
              value={contractAddress}
              onChange={(e) => setContractAddress(e.target.value)}
              className="flex-1"
            />
            {!isMonitoring ? (
              <Button onClick={handleStartMonitoring} disabled={!contractAddress || !isConnected}>
                <Play className="w-4 h-4 mr-2" />
                Start Monitoring
              </Button>
            ) : (
              <Button onClick={handleStopMonitoring} variant="destructive">
                <Pause className="w-4 h-4 mr-2" />
                Stop Monitoring
              </Button>
            )}
          </div>
          {isMonitoring && (
            <div className="mt-4">
              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                <Activity className="w-3 h-3 mr-1" />
                Monitoring: {contractAddress}
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalEvents.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Events processed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Events/Second</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.eventsPerSecond}</div>
            <p className="text-xs text-muted-foreground">Current TPS</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Count</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{metrics.errorCount}</div>
            <p className="text-xs text-muted-foreground">Processing errors</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Network Status</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{isConnected ? "Online" : "Offline"}</div>
            <p className="text-xs text-muted-foreground">Somnia Network</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MetricsChart data={chartData} />
        <Card>
          <CardHeader>
            <CardTitle>Event Distribution</CardTitle>
            <CardDescription>Event types over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              {events.length > 0 ? (
                <div className="space-y-2 w-full">
                  {Object.entries(
                    events.reduce(
                      (acc, event) => {
                        acc[event.eventName] = (acc[event.eventName] || 0) + 1
                        return acc
                      },
                      {} as Record<string, number>,
                    ),
                  ).map(([eventName, count]) => (
                    <div key={eventName} className="flex justify-between items-center">
                      <span className="text-sm">{eventName}</span>
                      <Badge variant="outline">{count}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                "No events to display"
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Events Table */}
      <EventsTable events={events} />
    </div>
  )
}
