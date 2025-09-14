"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, SkipBack, SkipForward, RotateCcw } from "lucide-react"
import { TimelineSlider } from "./timeline-slider"
import { BlockInspector } from "./block-inspector"
import { StateViewer } from "./state-viewer"
import { EventsTimeline } from "./events-timeline"

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

export default function ReplayClient() {
  const [contractAddress, setContractAddress] = useState("")
  const [isLoaded, setIsLoaded] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentBlock, setCurrentBlock] = useState(0)
  const [blockRange, setBlockRange] = useState<[number, number]>([0, 100])
  const [blocks, setBlocks] = useState<Block[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)

  const loadBlockchainData = async () => {
    if (!contractAddress) return

    try {
      setIsLoaded(false)

      // Fetch blocks in range
      const blocksResponse = await fetch(`/api/blocks?startBlock=${blockRange[0]}&endBlock=${blockRange[1]}`)
      const blocksData = await blocksResponse.json()
      setBlocks(blocksData.blocks || [])

      // Fetch events for the contract
      const eventsResponse = await fetch(`/api/events/${contractAddress}?limit=1000`)
      const eventsData = await eventsResponse.json()
      const filteredEvents = eventsData.events.filter(
        (event: Event) => event.blockNumber >= blockRange[0] && event.blockNumber <= blockRange[1],
      )
      setEvents(filteredEvents)

      if (blocksData.blocks && blocksData.blocks.length > 0) {
        setCurrentBlock(blocksData.blocks[0].blockNumber)
        setSelectedBlock(blocksData.blocks[0])
      }

      setIsLoaded(true)
    } catch (error) {
      console.error("Failed to load blockchain data:", error)
    }
  }

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleBlockChange = (blockNumber: number) => {
    setCurrentBlock(blockNumber)
    const block = blocks.find((b) => b.blockNumber === blockNumber)
    if (block) {
      setSelectedBlock(block)
    }
  }

  const handleStepForward = () => {
    const currentIndex = blocks.findIndex((b) => b.blockNumber === currentBlock)
    if (currentIndex < blocks.length - 1) {
      const nextBlock = blocks[currentIndex + 1]
      handleBlockChange(nextBlock.blockNumber)
    }
  }

  const handleStepBackward = () => {
    const currentIndex = blocks.findIndex((b) => b.blockNumber === currentBlock)
    if (currentIndex > 0) {
      const prevBlock = blocks[currentIndex - 1]
      handleBlockChange(prevBlock.blockNumber)
    }
  }

  const handleReset = () => {
    if (blocks.length > 0) {
      handleBlockChange(blocks[0].blockNumber)
    }
    setIsPlaying(false)
  }

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying || blocks.length === 0) return

    const interval = setInterval(() => {
      const currentIndex = blocks.findIndex((b) => b.blockNumber === currentBlock)
      if (currentIndex < blocks.length - 1) {
        const nextBlock = blocks[currentIndex + 1]
        handleBlockChange(nextBlock.blockNumber)
      } else {
        setIsPlaying(false) // Stop at the end
      }
    }, 1000 / playbackSpeed)

    return () => clearInterval(interval)
  }, [isPlaying, currentBlock, blocks, playbackSpeed])

  const currentEvents = events.filter((event) => event.blockNumber === currentBlock)

  return (
    <div className="space-y-6">
      {/* Contract Input and Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Blockchain Replay</CardTitle>
          <CardDescription>Load and replay blockchain history for a specific contract</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Input
              placeholder="0x... Contract Address"
              value={contractAddress}
              onChange={(e) => setContractAddress(e.target.value)}
              className="flex-1"
            />
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Start Block"
                value={blockRange[0]}
                onChange={(e) => setBlockRange([Number.parseInt(e.target.value) || 0, blockRange[1]])}
                className="w-32"
              />
              <Input
                type="number"
                placeholder="End Block"
                value={blockRange[1]}
                onChange={(e) => setBlockRange([blockRange[0], Number.parseInt(e.target.value) || 100])}
                className="w-32"
              />
            </div>
            <Button onClick={loadBlockchainData} disabled={!contractAddress}>
              Load Data
            </Button>
          </div>

          {isLoaded && (
            <div className="space-y-4">
              {/* Playback Controls */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={handleReset}>
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleStepBackward}>
                    <SkipBack className="w-4 h-4" />
                  </Button>
                  <Button size="sm" onClick={handlePlayPause}>
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleStepForward}>
                    <SkipForward className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Speed:</span>
                  <div className="flex gap-1">
                    {[0.5, 1, 2, 4].map((speed) => (
                      <Button
                        key={speed}
                        size="sm"
                        variant={playbackSpeed === speed ? "default" : "outline"}
                        onClick={() => setPlaybackSpeed(speed)}
                      >
                        {speed}x
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-auto">
                  <Badge variant="outline">Block: {currentBlock.toLocaleString()}</Badge>
                  <Badge variant="outline">Events: {currentEvents.length}</Badge>
                </div>
              </div>

              {/* Timeline Slider */}
              <TimelineSlider
                blocks={blocks}
                currentBlock={currentBlock}
                events={events}
                onBlockChange={handleBlockChange}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {isLoaded && (
        <>
          {/* Block Inspector and State Viewer */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BlockInspector block={selectedBlock} events={currentEvents} />
            <StateViewer contractAddress={contractAddress} blockNumber={currentBlock} />
          </div>

          {/* Events Timeline */}
          <EventsTimeline events={events} currentBlock={currentBlock} blockRange={blockRange} />
        </>
      )}
    </div>
  )
}
