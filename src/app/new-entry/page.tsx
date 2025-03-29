"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { generateSecret } from "@/lib/generate-secret"
import { toast } from "sonner"

export default function NewEntryPage() {
  const [luck, setLuck] = useState<number | null>(null)
  const [secret, setSecret] = useState<string>("")
  const [isValid, setIsValid] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    // Check for existing secret first
    const existingSecret = localStorage.getItem("your_secret")
    if (existingSecret) {
      setSecret(existingSecret)
      setIsValid(true)
      return // Exit early if secret exists
    }

    // Only generate new secret if no existing secret
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
    // Only save if new secret was generated
    if (!localStorage.getItem("your_secret")) {
      localStorage.setItem("your_secret", secret)
    }

    toast('Using existing entry!' )
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
            <CardTitle>
              {localStorage.getItem("your_secret") ? "Existing Entry" : "Your Lucky Entry"}
            </CardTitle>
            {!localStorage.getItem("your_secret") && (
                <CardDescription>Your luck factor is {luck}/10</CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-1">Your Secret Code</h3>
              <p className="text-2xl font-bold">{secret}</p>
              <p className="text-sm text-muted-foreground mt-2">
                {localStorage.getItem("your_secret")
                    ? "This is your existing secret code"
                    : "Keep this code safe! You'll need it to check your results."}
              </p>
            </div>

            {!localStorage.getItem("your_secret") && (
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
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={saveSecretAndRedirect} className="w-full">
              {localStorage.getItem("your_secret") ? "Continue with Existing Secret" : "Save Secret & Continue"}
            </Button>
          </CardFooter>
        </Card>
      </div>
  )
}