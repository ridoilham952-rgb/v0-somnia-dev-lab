"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Copy } from "lucide-react"
import { useState } from "react"

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

interface EventsTableProps {
  events: Event[]
}

export function EventsTable({ events }: EventsTableProps) {
  const [copiedHash, setCopiedHash] = useState<string | null>(null)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedHash(text)
    setTimeout(() => setCopiedHash(null), 2000)
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString()
  }

  const truncateHash = (hash: string) => {
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Events</CardTitle>
        <CardDescription>Latest contract events in real-time</CardDescription>
      </CardHeader>
      <CardContent>
        {events.length > 0 ? (
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Time</th>
                    <th className="text-left p-2">Event</th>
                    <th className="text-left p-2">Block</th>
                    <th className="text-left p-2">Transaction</th>
                    <th className="text-left p-2">Gas Used</th>
                    <th className="text-left p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {events.slice(0, 20).map((event, index) => (
                    <tr key={`${event.transactionHash}-${index}`} className="border-b hover:bg-muted/50">
                      <td className="p-2 text-muted-foreground">{formatTimestamp(event.timestamp)}</td>
                      <td className="p-2">
                        <Badge variant="outline" className="font-mono">
                          {event.eventName}
                        </Badge>
                      </td>
                      <td className="p-2 font-mono text-sm">{event.blockNumber.toLocaleString()}</td>
                      <td className="p-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm">{truncateHash(event.transactionHash)}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(event.transactionHash)}
                            className="h-6 w-6 p-0"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                          {copiedHash === event.transactionHash && (
                            <span className="text-xs text-green-600">Copied!</span>
                          )}
                        </div>
                      </td>
                      <td className="p-2 font-mono text-sm">
                        {event.gasUsed ? Number.parseInt(event.gasUsed).toLocaleString() : "N/A"}
                      </td>
                      <td className="p-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            window.open(`https://explorer.somnia.network/tx/${event.transactionHash}`, "_blank")
                          }
                          className="h-6 w-6 p-0"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {events.length > 20 && (
              <div className="text-center text-muted-foreground text-sm">Showing 20 of {events.length} events</div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No events yet. Start monitoring a contract to see real-time events.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
