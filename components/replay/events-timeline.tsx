"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

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

interface EventsTimelineProps {
  events: Event[]
  currentBlock: number
  blockRange: [number, number]
}

export function EventsTimeline({ events, currentBlock, blockRange }: EventsTimelineProps) {
  const sortedEvents = [...events].sort((a, b) => b.blockNumber - a.blockNumber)

  const getEventColor = (eventName: string) => {
    const colors = {
      Transfer: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      Swap: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      Mint: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      Burn: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      Approval: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    }
    return colors[eventName as keyof typeof colors] || "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString()
  }

  const isCurrentBlock = (blockNumber: number) => blockNumber === currentBlock

  return (
    <Card>
      <CardHeader>
        <CardTitle>Events Timeline</CardTitle>
        <CardDescription>
          All events from blocks {blockRange[0].toLocaleString()} to {blockRange[1].toLocaleString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {sortedEvents.length > 0 ? (
          <ScrollArea className="h-96">
            <div className="space-y-3">
              {sortedEvents.map((event, index) => (
                <div
                  key={`${event.transactionHash}-${index}`}
                  className={`relative pl-6 pb-4 ${
                    isCurrentBlock(event.blockNumber) ? "bg-primary/5 rounded-lg p-3 -ml-3" : ""
                  }`}
                >
                  {/* Timeline line */}
                  <div className="absolute left-0 top-0 h-full w-px bg-border">
                    <div
                      className={`absolute top-2 -left-1 w-2 h-2 rounded-full border-2 border-background ${
                        isCurrentBlock(event.blockNumber) ? "bg-primary" : "bg-muted-foreground"
                      }`}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge className={getEventColor(event.eventName)}>{event.eventName}</Badge>
                        <Badge variant="outline" className="font-mono text-xs">
                          Block {event.blockNumber.toLocaleString()}
                        </Badge>
                        {isCurrentBlock(event.blockNumber) && (
                          <Badge variant="default" className="text-xs">
                            Current
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">{formatTimestamp(event.timestamp)}</span>
                    </div>

                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Transaction:</span>
                        <span className="font-mono text-xs">
                          {event.transactionHash.slice(0, 8)}...{event.transactionHash.slice(-6)}
                        </span>
                      </div>

                      {event.gasUsed && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Gas Used:</span>
                          <span className="font-mono text-xs">{Number.parseInt(event.gasUsed).toLocaleString()}</span>
                        </div>
                      )}

                      {event.args && event.args.length > 0 && (
                        <div className="mt-2">
                          <span className="text-muted-foreground text-xs">Arguments:</span>
                          <div className="mt-1 p-2 bg-muted rounded text-xs font-mono max-h-20 overflow-y-auto">
                            {JSON.stringify(event.args, null, 2)}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No events found in the selected block range. Try loading data for a contract with recent activity.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
