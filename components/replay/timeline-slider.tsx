"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"

interface Block {
  blockNumber: number
  timestamp: string
  transactionCount: number
  gasUsed: string
  gasLimit: string
}

interface Event {
  blockNumber: number
  eventName: string
  timestamp: string
}

interface TimelineSliderProps {
  blocks: Block[]
  currentBlock: number
  events: Event[]
  onBlockChange: (blockNumber: number) => void
}

export function TimelineSlider({ blocks, currentBlock, events, onBlockChange }: TimelineSliderProps) {
  if (blocks.length === 0) return null

  const minBlock = blocks[0].blockNumber
  const maxBlock = blocks[blocks.length - 1].blockNumber
  const blockNumbers = blocks.map((b) => b.blockNumber)

  const handleSliderChange = (value: number[]) => {
    const targetBlock = value[0]
    // Find the closest actual block number
    const closestBlock = blockNumbers.reduce((prev, curr) =>
      Math.abs(curr - targetBlock) < Math.abs(prev - targetBlock) ? curr : prev,
    )
    onBlockChange(closestBlock)
  }

  // Create event markers for the timeline
  const eventMarkers = events.reduce(
    (acc, event) => {
      if (!acc[event.blockNumber]) {
        acc[event.blockNumber] = []
      }
      acc[event.blockNumber].push(event)
      return acc
    },
    {} as Record<number, Event[]>,
  )

  const getEventColor = (eventName: string) => {
    const colors = {
      Transfer: "bg-blue-500",
      Swap: "bg-green-500",
      Mint: "bg-purple-500",
      Burn: "bg-red-500",
      Approval: "bg-yellow-500",
    }
    return colors[eventName as keyof typeof colors] || "bg-gray-500"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Timeline</span>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Block {minBlock.toLocaleString()}</span>
            <span>→</span>
            <span>Block {maxBlock.toLocaleString()}</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Event markers visualization */}
        <div className="relative h-8 bg-muted rounded">
          {Object.entries(eventMarkers).map(([blockNum, blockEvents]) => {
            const position = ((Number.parseInt(blockNum) - minBlock) / (maxBlock - minBlock)) * 100
            return (
              <div key={blockNum} className="absolute top-1 h-6 w-1 rounded-full" style={{ left: `${position}%` }}>
                <div className="flex flex-col gap-0.5">
                  {blockEvents.slice(0, 3).map((event, index) => (
                    <div
                      key={index}
                      className={`w-1 h-1.5 rounded-full ${getEventColor(event.eventName)}`}
                      title={`${event.eventName} at block ${blockNum}`}
                    />
                  ))}
                  {blockEvents.length > 3 && (
                    <div
                      className="w-1 h-1 rounded-full bg-gray-400"
                      title={`+${blockEvents.length - 3} more events`}
                    />
                  )}
                </div>
              </div>
            )
          })}

          {/* Current position indicator */}
          <div
            className="absolute top-0 h-8 w-0.5 bg-primary rounded-full"
            style={{ left: `${((currentBlock - minBlock) / (maxBlock - minBlock)) * 100}%` }}
          />
        </div>

        {/* Slider */}
        <div className="px-2">
          <Slider
            value={[currentBlock]}
            onValueChange={handleSliderChange}
            min={minBlock}
            max={maxBlock}
            step={1}
            className="w-full"
          />
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
            <span>Transfer</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span>Swap</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-purple-500 rounded-full" />
            <span>Mint</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-red-500 rounded-full" />
            <span>Burn</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-yellow-500 rounded-full" />
            <span>Approval</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
