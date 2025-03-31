"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import bcrypt from "bcryptjs";

type Result = {
  id: number;
  content: string;
  created_at: string;
};

export default function ResultPage() {
  const [secret, setSecret] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [notDeclared, setNotDeclared] = useState(false);

  // Automatically submit the form if 'your_secret' exists in localStorage
  useEffect(() => {
    const storedSecret = localStorage.getItem("your_secret");
    if (storedSecret) {
      setSecret(storedSecret);
      handleCheck(storedSecret); // Automatically submit the form
    }
  }, []);

  const handleCheck = async (submittedSecret: string) => {
    if (!submittedSecret.trim()) {
      toast("Please provide your secret code");
      return;
    }

    setLoading(true);
    setNotFound(false);
    setNotDeclared(false);
    setResult(null);

    try {
      // Fetch all results
      const { data: allResults, error } = await supabase
          .from("results")
          .select("*");

      if (error) throw error;

      if (!allResults || allResults.length === 0) {
        setNotDeclared(true);
        return;
      }

      // Compare submitted secret with all stored hashes
      let matchedEntry: Result | null = null;

      for (const entry of allResults) {
        const isMatch = await bcrypt.compare(submittedSecret, entry.content);
        if (isMatch) {
          matchedEntry = entry;
          break;
        }
      }

      if (matchedEntry) {
        setResult(matchedEntry);
      } else {
        setNotFound(true);
      }

    } catch (error) {
      console.error("Error:", error);
      toast("Error: Failed to check result");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleCheck(secret);
  };

  return (
      <div className="container mx-auto py-8 px-4 max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Check Your Result</h1>

        <Card>
          <CardHeader>
            <CardTitle>Enter Your Secret Code</CardTitle>
            <CardDescription>Check if you&#39;re a winner in the lucky draw</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="secret">Secret Code</Label>
                <Input
                    id="secret"
                    value={secret}
                    onChange={(e) => setSecret(e.target.value)}
                    required
                />
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex-col items-stretch gap-4">
            <Button type="submit" className="w-full" onClick={handleSubmit} disabled={loading}>
              {loading ? "Checking..." : "Check Result"}
            </Button>

            {result && (
                <Card className="bg-green-50 dark:bg-green-900/20 border-green-200">
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-bold text-green-600 dark:text-green-400 mb-2">Congratulations!</h3>
                    <p>
                      You&#39;ve won! Contact 8439304486 or visit the Aravali stall to claim your prize.
                    </p>
                  </CardContent>
                </Card>
            )}

            {notFound && (
                <Card className="bg-yellow-50 dark:bg-red-900/20 border-red-200">
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">You are not the winner...</h3>
                    <p>This code is not a winner.</p>
                  </CardContent>
                </Card>
            )}

            {notDeclared && (
                <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200">
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-2">Result not declared yet</h3>
                    <p>Please check back later when the results are announced.</p>
                  </CardContent>
                </Card>
            )}
          </CardFooter>
        </Card>
      </div>
  );
}