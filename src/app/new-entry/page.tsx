"use client"

import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {Button, buttonVariants} from "@/components/ui/button"
import { generateSecret } from "@/lib/generate-secret"
import { toast } from "sonner"
import Link from "next/link";
import {cn} from "@/lib/utils";

export default function NewEntryPage() {
  const [existingSecret, setExistingSecret] = useState<string | null>(null)

  // Check for existing secret in localStorage
  useEffect(() => {
    const secret = localStorage.getItem("your_secret")
    setExistingSecret(secret)
  }, [])

  if (existingSecret) {
    return (
        <div className="container mx-auto py-8 px-4 max-w-md">
          <Card>
            <CardHeader>
              <CardTitle>Existing Entry</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-1">Your Secret Code</h3>
                <p className="text-2xl font-bold">{existingSecret}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  This is your existing secret code
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Link className={cn(buttonVariants({ variant: 'default' }), 'mb-10 w-full text-center text-lg')} href={'/result'}>Check Result</Link>
            </CardFooter>

          </Card>
        </div>
    )
  }

  return (
      <Suspense fallback={<div className="text-center p-8">Loading entry form...</div>}>
        <LuckParamsHandler />
      </Suspense>
  )
}

function LuckParamsHandler() {
  const [luck, setLuck] = useState<number | null>(null)
  const [secret, setSecret] = useState<string>("")
  const [isValid, setIsValid] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()

  // Process URL parameters and generate secret
  useEffect(() => {
    const luckParam = searchParams.get("luck")
    if (luckParam) {
      const luckValue = Number.parseInt(luckParam, 10)
      if (!isNaN(luckValue) && luckValue >= 1 && luckValue <= 10) {
        setLuck(luckValue)
        setIsValid(true)
        const generatedSecret = generateSecret(luckValue * 100 + (Date.now() % 100))
        setSecret(generatedSecret)
      } else {
        setIsValid(false)
      }
    }
  }, [searchParams])

  const saveSecretAndRedirect = () => {
    localStorage.setItem("your_secret", secret)
    toast("Saved Entry!")
    router.push("/")
  }

  if (!isValid) {
    return (
        <div className="container mx-auto py-8 px-4 max-w-md">
          <Card>
            <CardHeader>
              <CardTitle>Invalid Luck Value</CardTitle>
              <CardDescription>The luck parameter must be a number between 1 and 10.</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button onClick={() => router.push("/")}>Go to Home</Button>
            </CardFooter>
          </Card>
        </div>
    )
  }

  return (
      <div className="container mx-auto py-8 px-4 max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Your Lucky Entry</CardTitle>
            <CardDescription>Your luck factor is {luck}/10</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-1">Your Secret Code</h3>
              <p className="text-2xl font-bold">{secret}</p>
              <p className="text-sm text-muted-foreground mt-2">
                Keep this code safe! You&#39;ll need it to check your results.
              </p>
            </div>

            <div className="bg-primary/10 p-4 rounded-md">
              <h3 className="font-medium mb-1">Luck Factor: {luck}/10</h3>
              <p className="text-sm">
                {luck && luck >= 8
                    ? "High chance of winning!"
                    : luck && luck >= 5
                        ? "Good chance of winning!"
                        : "Luck might be on your side!"}
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={saveSecretAndRedirect} className="w-full">
              Save Secret & Continue
            </Button>
          </CardFooter>
        </Card>
      </div>
  )
}
