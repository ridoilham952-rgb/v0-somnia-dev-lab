"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Zap, Shield, Target, Square, RotateCcw } from "lucide-react"
import { TestConfiguration } from "./test-configuration"
import { TestResults } from "./test-results"
import { RealTimeMetrics } from "./realtime-metrics"

interface ChaosTest {
  id: string
  type: "load" | "attack" | "stress"
  status: "idle" | "running" | "completed" | "failed"
  progress: number
  startTime?: Date
  endTime?: Date
  metrics: {
    transactionsSent: number
    successRate: number
    averageGasUsed: number
    errorsEncountered: number
    maxTPS: number
    averageLatency: number
  }
}

export default function ChaosClient() {
  const [contractAddress, setContractAddress] = useState("")
  const [currentTest, setCurrentTest] = useState<ChaosTest | null>(null)
  const [testHistory, setTestHistory] = useState<ChaosTest[]>([])
  const [selectedTestType, setSelectedTestType] = useState<"load" | "attack" | "stress">("load")

  const startChaosTest = async (testType: "load" | "attack" | "stress", config: any) => {
    if (!contractAddress) return

    const newTest: ChaosTest = {
      id: `chaos_${Date.now()}`,
      type: testType,
      status: "running",
      progress: 0,
      startTime: new Date(),
      metrics: {
        transactionsSent: 0,
        successRate: 100,
        averageGasUsed: 0,
        errorsEncountered: 0,
        maxTPS: 0,
        averageLatency: 0,
      },
    }

    setCurrentTest(newTest)

    // Simulate test execution
    const interval = setInterval(() => {
      setCurrentTest((prev) => {
        if (!prev || prev.status !== "running") return prev

        const newProgress = Math.min(prev.progress + Math.random() * 10, 100)
        const isComplete = newProgress >= 100

        const updatedTest = {
          ...prev,
          progress: newProgress,
          status: isComplete ? ("completed" as const) : ("running" as const),
          endTime: isComplete ? new Date() : undefined,
          metrics: {
            transactionsSent: Math.floor((newProgress / 100) * 1000),
            successRate: Math.max(85, 100 - Math.random() * 15),
            averageGasUsed: 21000 + Math.floor(Math.random() * 50000),
            errorsEncountered: Math.floor((newProgress / 100) * Math.random() * 50),
            maxTPS: Math.floor(Math.random() * 500) + 100,
            averageLatency: Math.floor(Math.random() * 200) + 50,
          },
        }

        if (isComplete) {
          setTestHistory((prev) => [updatedTest, ...prev])
          clearInterval(interval)
        }

        return updatedTest
      })
    }, 500)

    return newTest.id
  }

  const stopCurrentTest = () => {
    if (currentTest && currentTest.status === "running") {
      const stoppedTest = {
        ...currentTest,
        status: "completed" as const,
        endTime: new Date(),
      }
      setCurrentTest(stoppedTest)
      setTestHistory((prev) => [stoppedTest, ...prev])
    }
  }

  const resetTest = () => {
    setCurrentTest(null)
  }

  return (
    <div className="space-y-6">
      {/* Test Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Chaos Testing Configuration</CardTitle>
          <CardDescription>Configure and run stress tests, load tests, and attack simulations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Input
              placeholder="0x... Contract Address"
              value={contractAddress}
              onChange={(e) => setContractAddress(e.target.value)}
              className="flex-1"
            />
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              variant={selectedTestType === "load" ? "default" : "outline"}
              onClick={() => setSelectedTestType("load")}
            >
              <Target className="w-4 h-4 mr-1" />
              Load Test
            </Button>
            <Button
              size="sm"
              variant={selectedTestType === "stress" ? "default" : "outline"}
              onClick={() => setSelectedTestType("stress")}
            >
              <Zap className="w-4 h-4 mr-1" />
              Stress Test
            </Button>
            <Button
              size="sm"
              variant={selectedTestType === "attack" ? "default" : "outline"}
              onClick={() => setSelectedTestType("attack")}
            >
              <Shield className="w-4 h-4 mr-1" />
              Attack Simulation
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Current Test Status */}
      {currentTest && (
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                <span>
                  {currentTest.type.charAt(0).toUpperCase() + currentTest.type.slice(1)} Test{" "}
                  {currentTest.status === "running" ? "Running" : "Completed"}
                </span>
              </div>
              <div className="flex gap-2">
                {currentTest.status === "running" && (
                  <Button size="sm" variant="destructive" onClick={stopCurrentTest}>
                    <Square className="w-4 h-4 mr-1" />
                    Stop
                  </Button>
                )}
                <Button size="sm" variant="outline" onClick={resetTest}>
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Reset
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{Math.round(currentTest.progress)}%</span>
              </div>
              <Progress value={currentTest.progress} className="h-2" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{currentTest.metrics.transactionsSent}</div>
                <div className="text-xs text-muted-foreground">Transactions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{currentTest.metrics.successRate.toFixed(1)}%</div>
                <div className="text-xs text-muted-foreground">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{currentTest.metrics.maxTPS}</div>
                <div className="text-xs text-muted-foreground">Max TPS</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{currentTest.metrics.errorsEncountered}</div>
                <div className="text-xs text-muted-foreground">Errors</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="configure" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="configure">Configure</TabsTrigger>
          <TabsTrigger value="monitor">Monitor</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="configure">
          <TestConfiguration
            testType={selectedTestType}
            contractAddress={contractAddress}
            onStartTest={startChaosTest}
            isTestRunning={currentTest?.status === "running"}
          />
        </TabsContent>

        <TabsContent value="monitor">
          <RealTimeMetrics currentTest={currentTest} />
        </TabsContent>

        <TabsContent value="results">
          <TestResults currentTest={currentTest} />
        </TabsContent>

        <TabsContent value="history">
          <div className="space-y-4">
            {testHistory.length > 0 ? (
              testHistory.map((test) => (
                <Card key={test.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{test.type}</Badge>
                        <span className="text-sm">
                          {test.startTime?.toLocaleString()} - {test.endTime?.toLocaleString()}
                        </span>
                      </div>
                      <Badge variant={test.status === "completed" ? "default" : "destructive"}>{test.status}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Transactions:</span>
                        <div className="font-semibold">{test.metrics.transactionsSent}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Success Rate:</span>
                        <div className="font-semibold">{test.metrics.successRate.toFixed(1)}%</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Max TPS:</span>
                        <div className="font-semibold">{test.metrics.maxTPS}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Errors:</span>
                        <div className="font-semibold">{test.metrics.errorsEncountered}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="text-center py-8 text-muted-foreground">
                  No test history available. Run some chaos tests to see results here.
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
