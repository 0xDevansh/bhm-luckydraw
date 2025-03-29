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
    setResult(null);

    try {
      const { data, error } = await supabase
          .from("results")
          .select("*")
          .eq("content", submittedSecret)
          .single();

      if (error) {
        if (error.code === "PGRST116") {
          setNotFound(true);
        } else {
          throw error;
        }
      } else {
        setResult(data);
      }
    } catch {
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
            <CardDescription>Check if you&#39;ve won in the lucky draw</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="secret">Secret Code</Label>
                <Input
                    id="secret"
                    value={secret}
                    onChange={(e) => setSecret(e.target.value)}
                    placeholder="e.g. HappyTiger"
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
                      You&#39;ve won: <span className="font-bold">{result.content}</span>
                    </p>
                  </CardContent>
                </Card>
            )}

            {notFound && (
                <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200">
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">No Result Found</h3>
                    <p>We couldn&#39;t find any results for this secret code. Please check if you entered it correctly.</p>
                  </CardContent>
                </Card>
            )}
          </CardFooter>
        </Card>
      </div>
  );
}
