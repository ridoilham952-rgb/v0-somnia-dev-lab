import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Activity, BarChart3, Clock, Zap } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">Somnia DevLab</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            The ultimate developer tool suite for Somnia Network - featuring real-time monitoring, replay debugging,
            performance profiling, and chaos testing for ultra-fast EVM contracts.
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span>1M+ TPS</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-green-500" />
              <span>Sub-second finality</span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-500" />
                Real-time Dashboard
              </CardTitle>
              <CardDescription>Live event streaming with TPS, error rates, and latency metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard">
                <Button className="w-full">Open Dashboard</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-green-500" />
                Replay Timeline
              </CardTitle>
              <CardDescription>Scrub through block history and inspect contract state changes</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/replay">
                <Button className="w-full bg-transparent" variant="outline">
                  View Timeline
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-500" />
                Performance Profiler
              </CardTitle>
              <CardDescription>Analyze gas consumption and identify performance bottlenecks</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/profiler">
                <Button className="w-full bg-transparent" variant="outline">
                  Run Analysis
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-red-500" />
                Chaos Mode
              </CardTitle>
              <CardDescription>Stress test contracts with attack simulations and load testing</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/chaos">
                <Button className="w-full" variant="destructive">
                  Start Testing
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Quick Start</h2>
          <div className="bg-gray-900 dark:bg-gray-800 rounded-lg p-6 text-left max-w-2xl mx-auto">
            <code className="text-green-400 text-sm">
              {`npm install somnia-devlab
              
import { SomniaStream } from "somnia-devlab";
SomniaStream.on("Swap", (event) => console.log(event));`}
            </code>
          </div>
        </div>
      </div>
    </div>
  )
}
