"use client"

import { useRouter } from "next/navigation"
import { ShieldAlert, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function AccessDenied() {
  const router = useRouter()

  return (
    <Card className="w-full max-w-md border-border">
      <CardContent className="flex flex-col items-center p-8 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <ShieldAlert className="h-8 w-8 text-destructive" />
        </div>
        <h2 className="mt-6 font-serif text-xl text-foreground">Access Denied</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          You don&apos;t currently have access to the chef portal. Please log in with an authorized account to continue.
        </p>
        <Button
          className="mt-6 gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={() => router.push("/")}
        >
          <Home className="h-4 w-4" />
          Back to Home
        </Button>
      </CardContent>
    </Card>
  )
}
