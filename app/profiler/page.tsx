import { Suspense } from "react"
import ProfilerClient from "@/components/profiler/profiler-client"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function ProfilerPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Performance Profiler</h1>
          <p className="text-muted-foreground">
            Analyze gas consumption, execution time, and identify performance bottlenecks in your smart contracts
          </p>
        </div>

        <Suspense fallback={<ProfilerSkeleton />}>
          <ProfilerClient />
        </Suspense>
      </div>
    </div>
  )
}

function ProfilerSkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-96" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-10 w-full mb-4" />
          <Skeleton className="h-8 w-32" />
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
