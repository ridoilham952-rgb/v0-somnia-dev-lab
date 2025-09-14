"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Play } from "lucide-react"

interface TestConfigurationProps {
  testType: "load" | "attack" | "stress"
  contractAddress: string
  onStartTest: (testType: "load" | "attack" | "stress", config: any) => Promise<string>
  isTestRunning: boolean
}

export function TestConfiguration({ testType, contractAddress, onStartTest, isTestRunning }: TestConfigurationProps) {
  const [config, setConfig] = useState({
    duration: 60, // seconds
    intensity: 50, // 1-100
    transactionType: "transfer",
    concurrent: 10,
    gasLimit: 100000,
    enableReentrancy: false,
    enableOverflow: false,
    enableDOS: false,
  })

  const handleStartTest = () => {
    onStartTest(testType, config)
  }

  const getTestDescription = () => {
    switch (testType) {
      case "load":
        return "Test contract performance under normal to high transaction volumes"
      case "stress":
        return "Push the contract to its limits with extreme transaction loads"
      case "attack":
        return "Simulate various attack vectors including reentrancy, overflow, and DOS attacks"
      default:
        return ""
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="capitalize">{testType} Test Configuration</CardTitle>
        <CardDescription>{getTestDescription()}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="duration">Test Duration (seconds)</Label>
            <Input
              id="duration"
              type="number"
              value={config.duration}
              onChange={(e) => setConfig({ ...config, duration: Number.parseInt(e.target.value) || 60 })}
              min="10"
              max="3600"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="concurrent">Concurrent Transactions</Label>
            <Input
              id="concurrent"
              type="number"
              value={config.concurrent}
              onChange={(e) => setConfig({ ...config, concurrent: Number.parseInt(e.target.value) || 10 })}
              min="1"
              max="1000"
            />
          </div>
        </div>

        {/* Intensity Slider */}
        <div className="space-y-2">
          <Label>Test Intensity: {config.intensity}%</Label>
          <Slider
            value={[config.intensity]}
            onValueChange={(value) => setConfig({ ...config, intensity: value[0] })}
            max={100}
            min={1}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Light</span>
            <span>Moderate</span>
            <span>Heavy</span>
            <span>Extreme</span>
          </div>
        </div>

        {/* Transaction Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="transactionType">Transaction Type</Label>
            <Select
              value={config.transactionType}
              onValueChange={(value) => setConfig({ ...config, transactionType: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="transfer">Transfer</SelectItem>
                <SelectItem value="mint">Mint</SelectItem>
                <SelectItem value="swap">Swap</SelectItem>
                <SelectItem value="approve">Approve</SelectItem>
                <SelectItem value="mixed">Mixed Operations</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="gasLimit">Gas Limit</Label>
            <Input
              id="gasLimit"
              type="number"
              value={config.gasLimit}
              onChange={(e) => setConfig({ ...config, gasLimit: Number.parseInt(e.target.value) || 100000 })}
              min="21000"
              max="10000000"
            />
          </div>
        </div>

        {/* Attack-specific Configuration */}
        {testType === "attack" && (
          <div className="space-y-4">
            <h4 className="font-semibold">Attack Vectors</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="reentrancy">Reentrancy Attack</Label>
                  <p className="text-xs text-muted-foreground">Test for reentrancy vulnerabilities</p>
                </div>
                <Switch
                  id="reentrancy"
                  checked={config.enableReentrancy}
                  onCheckedChange={(checked) => setConfig({ ...config, enableReentrancy: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="overflow">Integer Overflow</Label>
                  <p className="text-xs text-muted-foreground">Test for overflow/underflow issues</p>
                </div>
                <Switch
                  id="overflow"
                  checked={config.enableOverflow}
                  onCheckedChange={(checked) => setConfig({ ...config, enableOverflow: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="dos">DOS Attack</Label>
                  <p className="text-xs text-muted-foreground">Denial of service simulation</p>
                </div>
                <Switch
                  id="dos"
                  checked={config.enableDOS}
                  onCheckedChange={(checked) => setConfig({ ...config, enableDOS: checked })}
                />
              </div>
            </div>
          </div>
        )}

        {/* Start Test Button */}
        <div className="pt-4">
          <Button onClick={handleStartTest} disabled={!contractAddress || isTestRunning} className="w-full" size="lg">
            <Play className="w-4 h-4 mr-2" />
            {isTestRunning ? "Test Running..." : `Start ${testType.charAt(0).toUpperCase() + testType.slice(1)} Test`}
          </Button>
        </div>

        {/* Configuration Summary */}
        <div className="bg-muted rounded-lg p-4 space-y-2">
          <h4 className="font-semibold text-sm">Test Summary</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>Duration: {config.duration}s</div>
            <div>Intensity: {config.intensity}%</div>
            <div>Concurrent: {config.concurrent}</div>
            <div>Type: {config.transactionType}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
