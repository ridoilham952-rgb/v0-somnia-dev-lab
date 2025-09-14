"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, BarChart3, TrendingUp, AlertTriangle } from "lucide-react"
import { GasAnalysis } from "./gas-analysis"
import { FunctionRanking } from "./function-ranking"
import { OptimizationSuggestions } from "./optimization-suggestions"
import { ProfilerResults } from "./profiler-results"

interface ProfileData {
  contractAddress: string
  functions: Array<{
    name: string
    gasUsed: number
    executionTime: number
    callCount: number
    averageGas: number
  }>
  totalGasUsed: number
  totalExecutionTime: number
  optimizationScore: number
  suggestions: Array<{
    type: "warning" | "error" | "info"
    message: string
    function?: string
  }>
}

export default function ProfilerClient() {
  const [contractAddress, setContractAddress] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [analysisType, setAnalysisType] = useState<"gas" | "performance" | "security">("gas")

  const runAnalysis = async () => {
    if (!contractAddress) return

    setIsAnalyzing(true)

    try {
      // Simulate analysis - in real implementation, this would call your backend
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Mock profile data
      const mockData: ProfileData = {
        contractAddress,
        functions: [
          {
            name: "transfer",
            gasUsed: 51000,
            executionTime: 120,
            callCount: 1500,
            averageGas: 34,
          },
          {
            name: "approve",
            gasUsed: 46000,
            executionTime: 95,
            callCount: 800,
            averageGas: 57.5,
          },
          {
            name: "mint",
            gasUsed: 85000,
            executionTime: 200,
            callCount: 200,
            averageGas: 425,
          },
          {
            name: "expensiveOperation",
            gasUsed: 250000,
            executionTime: 800,
            callCount: 50,
            averageGas: 5000,
          },
          {
            name: "swap",
            gasUsed: 120000,
            executionTime: 300,
            callCount: 600,
            averageGas: 200,
          },
        ],
        totalGasUsed: 552000,
        totalExecutionTime: 1515,
        optimizationScore: 72,
        suggestions: [
          {
            type: "warning",
            message: "expensiveOperation function uses excessive gas. Consider optimizing loops.",
            function: "expensiveOperation",
          },
          {
            type: "info",
            message: "Consider using events for better off-chain tracking.",
          },
          {
            type: "error",
            message: "Potential reentrancy vulnerability detected in swap function.",
            function: "swap",
          },
        ],
      }

      setProfileData(mockData)
    } catch (error) {
      console.error("Analysis failed:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Analysis Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Contract Analysis</CardTitle>
          <CardDescription>Analyze smart contract performance and identify optimization opportunities</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Input
              placeholder="0x... Contract Address"
              value={contractAddress}
              onChange={(e) => setContractAddress(e.target.value)}
              className="flex-1"
            />
            <Button onClick={runAnalysis} disabled={!contractAddress || isAnalyzing}>
              <Play className="w-4 h-4 mr-2" />
              {isAnalyzing ? "Analyzing..." : "Run Analysis"}
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              variant={analysisType === "gas" ? "default" : "outline"}
              onClick={() => setAnalysisType("gas")}
            >
              <BarChart3 className="w-4 h-4 mr-1" />
              Gas Analysis
            </Button>
            <Button
              size="sm"
              variant={analysisType === "performance" ? "default" : "outline"}
              onClick={() => setAnalysisType("performance")}
            >
              <TrendingUp className="w-4 h-4 mr-1" />
              Performance
            </Button>
            <Button
              size="sm"
              variant={analysisType === "security" ? "default" : "outline"}
              onClick={() => setAnalysisType("security")}
            >
              <AlertTriangle className="w-4 h-4 mr-1" />
              Security
            </Button>
          </div>
        </CardContent>
      </Card>

      {isAnalyzing && (
        <Card>
          <CardContent className="py-8">
            <div className="text-center space-y-4">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              <div>
                <h3 className="font-semibold">Analyzing Contract Performance</h3>
                <p className="text-sm text-muted-foreground">
                  This may take a few moments while we analyze gas usage, execution patterns, and optimization
                  opportunities...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {profileData && !isAnalyzing && (
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="functions">Functions</TabsTrigger>
            <TabsTrigger value="gas">Gas Analysis</TabsTrigger>
            <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <ProfilerResults data={profileData} />
          </TabsContent>

          <TabsContent value="functions">
            <FunctionRanking functions={profileData.functions} />
          </TabsContent>

          <TabsContent value="gas">
            <GasAnalysis data={profileData} />
          </TabsContent>

          <TabsContent value="suggestions">
            <OptimizationSuggestions suggestions={profileData.suggestions} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
