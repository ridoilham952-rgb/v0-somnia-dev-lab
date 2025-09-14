import { Suspense } from "react"
import ChaosClient from "@/components/chaos/chaos-client"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function ChaosPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Chaos Mode Testing</h1>
          <p className="text-muted-foreground">
            Stress test your smart contracts with high-volume transactions, attack simulations, and resilience testing
          </p>
        </div>

        <Suspense fallback={<ChaosSkeleton />}>
          <ChaosClient />
        </Suspense>
      </div>
    </div>
  )
}

function ChaosSkeleton() {
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
