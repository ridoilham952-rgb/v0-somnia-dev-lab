"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { useState, useEffect } from "react"

interface StateViewerProps {
  contractAddress: string
  blockNumber: number
}

interface ContractState {
  balance: string
  totalSupply?: string
  owner?: string
  paused?: boolean
  [key: string]: any
}

export function StateViewer({ contractAddress, blockNumber }: StateViewerProps) {
  const [state, setState] = useState<ContractState | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadContractState = async () => {
    if (!contractAddress || !blockNumber) return

    setIsLoading(true)
    setError(null)

    try {
      // This would typically call your backend API to get contract state at a specific block
      // For now, we'll simulate the state data
      await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API call

      // Mock state data - in a real implementation, this would come from your backend
      const mockState: ContractState = {
        balance: "1000000000000000000000", // 1000 ETH in wei
        totalSupply: "1000000000000000000000000", // 1M tokens
        owner: "0x742d35Cc6634C0532925a3b8D4C9db96590c6C87",
        paused: false,
        decimals: 18,
        name: "Sample Token",
        symbol: "STK",
        lastUpdatedBlock: blockNumber,
      }

      setState(mockState)
    } catch (err) {
      setError("Failed to load contract state")
      console.error("Error loading contract state:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadContractState()
  }, [contractAddress, blockNumber])

  const formatValue = (key: string, value: any) => {
    if (typeof value === "string" && value.length > 20 && value.startsWith("0x")) {
      // Likely an address
      return `${value.slice(0, 6)}...${value.slice(-4)}`
    }

    if (typeof value === "string" && /^\d+$/.test(value) && value.length > 10) {
      // Likely a big number (wei, etc.)
      const num = BigInt(value)
      if (key.toLowerCase().includes("balance") || key.toLowerCase().includes("supply")) {
        // Convert from wei to ether for display
        return `${(Number(num) / 1e18).toLocaleString()} ETH`
      }
      return num.toLocaleString()
    }

    if (typeof value === "boolean") {
      return value ? "True" : "False"
    }

    return value?.toString() || "N/A"
  }

  const getValueColor = (key: string, value: any) => {
    if (typeof value === "boolean") {
      return value ? "text-green-600" : "text-red-600"
    }
    if (key.toLowerCase().includes("balance") || key.toLowerCase().includes("supply")) {
      return "text-blue-600"
    }
    return "text-foreground"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Contract State</span>
          <Button size="sm" variant="outline" onClick={loadContractState} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </CardTitle>
        <CardDescription>
          State at block #{blockNumber.toLocaleString()}
          {contractAddress && (
            <div className="mt-1">
              <Badge variant="outline" className="font-mono text-xs">
                {contractAddress.slice(0, 8)}...{contractAddress.slice(-6)}
              </Badge>
            </div>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="text-center py-8 text-muted-foreground">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
            Loading contract state...
          </div>
        )}

        {error && (
          <div className="text-center py-8 text-red-600">
            <p>{error}</p>
            <Button size="sm" variant="outline" onClick={loadContractState} className="mt-2 bg-transparent">
              Retry
            </Button>
          </div>
        )}

        {state && !isLoading && !error && (
          <div className="space-y-3">
            {Object.entries(state).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center py-2 border-b border-border/50 last:border-0">
                <span className="text-sm font-medium capitalize">{key.replace(/([A-Z])/g, " $1").trim()}:</span>
                <span className={`text-sm font-mono ${getValueColor(key, value)}`}>{formatValue(key, value)}</span>
              </div>
            ))}

            <div className="mt-4 p-3 bg-muted rounded-lg">
              <h4 className="text-sm font-medium mb-2">State Diff</h4>
              <p className="text-xs text-muted-foreground">
                Changes from previous block would be highlighted here. This feature tracks state modifications over
                time.
              </p>
            </div>
          </div>
        )}

        {!contractAddress && (
          <div className="text-center py-8 text-muted-foreground">Enter a contract address to view its state</div>
        )}
      </CardContent>
    </Card>
  )
}
