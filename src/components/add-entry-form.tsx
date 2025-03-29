"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { Slider } from "@/components/ui/slider"
import bcryptjs from 'bcryptjs'

interface AddEntryFormProps {
  onSuccess?: () => void
}

export default function AddEntryForm({ onSuccess }: AddEntryFormProps) {
  const [entry, setEntry] = useState("")
  const [luck, setLuck] = useState(5) // Default value
  const [loading, setLoading] = useState(false)
  const [hash, setHash] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!entry.trim()) {
      toast('Error: Entry cannot be empty')
      return
    }

    setLoading(true)

    try {
      const salt = bcryptjs.genSaltSync(10)
      const hash = bcryptjs.hashSync(entry, salt)
      const { data, error } = await supabase.from("entries").insert([{ content: hash, luck }])

      if (error) throw error

      toast('Entry added successfully')

      setEntry("")
      setLuck(5) // Reset to default
      if (onSuccess) onSuccess()
    } catch {
      toast('Failed to add entry')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Entry</CardTitle>
        <CardDescription>Add a new entry to the lucky draw</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="entry">Entry</Label>
            <Input
              id="entry"
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              placeholder="Enter your secret key"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="luck">Luck (1-10)</Label>
            <div className="flex items-center gap-4">
              <Slider
                id="luck"
                min={1}
                max={10}
                step={1}
                value={[luck]}
                onValueChange={(values) => setLuck(values[0])}
                className="flex-1"
              />
              <span className="w-8 text-center font-medium">{luck}</span>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button type="submit" className="w-full" onClick={handleSubmit} disabled={loading}>
          {loading ? "Adding..." : "Add Entry"}
        </Button>
      </CardFooter>
    </Card>
  )
}

