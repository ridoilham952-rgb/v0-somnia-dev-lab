"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Copy, ExternalLink } from "lucide-react"
import { useState } from "react"

interface Block {
  blockNumber: number
  timestamp: string
  transactionCount: number
  gasUsed: string
  gasLimit: string
}

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

interface BlockInspectorProps {
  block: Block | null
  events: Event[]
}

export function BlockInspector({ block, events }: BlockInspectorProps) {
  const [copiedText, setCopiedText] = useState<string | null>(null)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedText(text)
    setTimeout(() => setCopiedText(null), 2000)
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  const formatGas = (gas: string) => {
    return Number.parseInt(gas).toLocaleString()
  }

  const truncateHash = (hash: string) => {
    return `${hash.slice(0, 8)}...${hash.slice(-6)}`
  }

  if (!block) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Block Inspector</CardTitle>
          <CardDescription>Select a block to inspect its details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">No block selected</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Block Inspector</CardTitle>
        <CardDescription>Block #{block.blockNumber.toLocaleString()}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Block Details */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Block Number:</span>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-mono">
                {block.blockNumber.toLocaleString()}
              </Badge>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => copyToClipboard(block.blockNumber.toString())}
                className="h-6 w-6 p-0"
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Timestamp:</span>
            <span className="text-sm text-muted-foreground">{formatTimestamp(block.timestamp)}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Transactions:</span>
            <Badge variant="secondary">{block.transactionCount}</Badge>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Gas Used:</span>
            <span className="text-sm font-mono">{formatGas(block.gasUsed)}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Gas Limit:</span>
            <span className="text-sm font-mono">{formatGas(block.gasLimit)}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Gas Utilization:</span>
            <div className="flex items-center gap-2">
              <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{
                    width: `${(Number.parseInt(block.gasUsed) / Number.parseInt(block.gasLimit)) * 100}%`,
                  }}
                />
              </div>
              <span className="text-sm text-muted-foreground">
                {((Number.parseInt(block.gasUsed) / Number.parseInt(block.gasLimit)) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        {/* Events in this block */}
        <div className="space-y-3">
          <h4 className="font-medium flex items-center gap-2">
            Events in Block
            <Badge variant="outline">{events.length}</Badge>
          </h4>

          {events.length > 0 ? (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {events.map((event, index) => (
                <div key={`${event.transactionHash}-${index}`} className="border rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="font-mono">
                      {event.eventName}
                    </Badge>
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
                  </div>

                  <div className="text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Transaction:</span>
                      <div className="flex items-center gap-1">
                        <span className="font-mono">{truncateHash(event.transactionHash)}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(event.transactionHash)}
                          className="h-4 w-4 p-0"
                        >
                          <Copy className="h-2 w-2" />
                        </Button>
                        {copiedText === event.transactionHash && <span className="text-green-600">Copied!</span>}
                      </div>
                    </div>

                    {event.gasUsed && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Gas Used:</span>
                        <span className="font-mono">{formatGas(event.gasUsed)}</span>
                      </div>
                    )}

                    {event.args && event.args.length > 0 && (
                      <div className="mt-2">
                        <span className="text-muted-foreground">Arguments:</span>
                        <div className="mt-1 p-2 bg-muted rounded text-xs font-mono">
                          {JSON.stringify(event.args, null, 2)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground text-sm">No events in this block</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
