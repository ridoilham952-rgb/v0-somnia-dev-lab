"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wifi, WifiOff } from "lucide-react"

interface NetworkStatusProps {
  isConnected: boolean
}

export function NetworkStatus({ isConnected }: NetworkStatusProps) {
  return (
    <Card className={`border-l-4 ${isConnected ? "border-l-green-500" : "border-l-red-500"}`}>
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          {isConnected ? <Wifi className="h-5 w-5 text-green-500" /> : <WifiOff className="h-5 w-5 text-red-500" />}
          <div>
            <h3 className="font-semibold">WebSocket Connection</h3>
            <p className="text-sm text-muted-foreground">
              {isConnected ? "Connected to Somnia DevLab backend" : "Disconnected from backend"}
            </p>
          </div>
        </div>
        <Badge variant={isConnected ? "default" : "destructive"}>{isConnected ? "Online" : "Offline"}</Badge>
      </CardContent>
    </Card>
  )
}
