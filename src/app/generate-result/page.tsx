"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

type Entry = {
    id: number
    content: string
    luck: number
}

type Result = {
    id: number
    content: string
    created_at: string
}

function find(weights: number[], x: number , start=0, end=weights.length) {
    if(end < start) return -1;
    else if(end == start) return end;
    const mid = Math.floor((start + end) / 2);
    if(weights[mid] === x) return mid+1;
    else if(weights[mid] < x) return find(weights, x, mid+1, end);
    else
        return find(weights, x, start, mid);
}

export default function ResultGenerator() {
    const [existingResults, setExistingResults] = useState<Result[]>([])
    const [isGenerating, setIsGenerating] = useState(false)
    const [isLoadingExisting, setIsLoadingExisting] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchExistingResults = async () => {
        try {
            const { data, error } = await supabase
                .from("results")
                .select("*")
                .order("created_at", { ascending: false })

            if (error) throw error
            setExistingResults(data || [])
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load results")
        } finally {
            setIsLoadingExisting(false)
        }
    }


    // Fetch existing results on mount
    useEffect(() => {
        fetchExistingResults()
    }, [])

    // Weighted random selection algorithm
    const selectWinner = (entries: Entry[]): Entry => {
        const totalLuck = entries.reduce((sum, entry) => sum + entry.luck, 0)
        let weightTillNow = 0
        const cumulativeWeights: number[] = entries.map(e => weightTillNow += e.luck / totalLuck)
        console.log(cumulativeWeights)

        let currentSum = 0
        for (const entry of entries) {
            currentSum += entry.luck
            cumulativeWeights.push(currentSum)
        }

        return entries[find(cumulativeWeights, Math.random())]
    }

    const selectWinners = (entries: Entry[], n: number): Entry[] => {
        let e = entries
        const winners: Entry[] = []
        for (let i = 0; i < n; i++) {
            const w = selectWinner(entries)
            e = e.filter(en => en.id !== w.id)
            winners.push(w)
        }
        return winners
    }

    const handleGenerate = async () => {
        setIsGenerating(true)
        setError(null)

        try {
            // Fetch all entries
            const { data: entries, error: fetchError } = await supabase
                .from("entries")
                .select("id, content, luck")

            if (fetchError) throw fetchError
            if (!entries?.length) throw new Error("No entries available for draw")

            // Select 3 winners
            const winnerEntries = selectWinners(entries, 3)
            console.log(winnerEntries)
            // Prepare and insert results

            const results = winnerEntries.map(entry => ({
                content: entry.content,
            }))
            await supabase
                .from('results')
                .delete().neq('id', 0)
            const { error: insertError } = await supabase
                .from("results")
                .insert(results)
            if (insertError) throw insertError

            // Refresh existing results
            const { data: newResults } = await supabase
                .from("results")
                .select("*")
                .order("created_at", { ascending: false })

            setExistingResults(newResults || [])
            toast.success("Winners generated successfully!")
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to generate results")
            toast.error("Error generating results")
        } finally {
            setIsGenerating(false)
        }
    }

    if (isLoadingExisting) {
        return <div className="text-center p-8">Loading results...</div>
    }

    return (
        <div className="container mx-auto py-8 px-4 max-w-4xl">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Lucky Draw Results</h1>
                <Button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                >
                    {isGenerating ? "Generating..." : "Generate New Winners"}
                </Button>
            </div>

            {error && (
                <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
                    Error: {error}
                </div>
            )}

            <div className="border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Hash</TableHead>
                            <TableHead>Time</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {existingResults.length > 0 ? (
                            existingResults.map((result) => (
                                <TableRow key={result.id}>
                                    <TableCell>{result.content}</TableCell>
                                    <TableCell>
                                        {new Date(result.created_at).toLocaleTimeString()}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-4">
                                    No results generated yet
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}