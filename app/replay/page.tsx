import { Suspense } from "react"
import ReplayClient from "@/components/replay/replay-client"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function ReplayPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Replay Timeline</h1>
          <p className="text-muted-foreground">
            Scrub through block history and inspect contract state changes over time
          </p>
        </div>

        <Suspense fallback={<ReplaySkeleton />}>
          <ReplayClient />
        </Suspense>
      </div>
    </div>
  )
}

function ReplaySkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-96" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-10 w-full mb-4" />
          <Skeleton className="h-4 w-full" />
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
