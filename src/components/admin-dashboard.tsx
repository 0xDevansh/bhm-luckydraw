"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import AddEntryForm from "./add-entry-form"
import { useRouter } from "next/navigation"
import { Trash2 } from "lucide-react"
import {toast} from "sonner";

type Entry = {
  id: number
  content: string
  luck: number
  created_at: string
}

export default function AdminDashboard() {
  const [entries, setEntries] = useState<Entry[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchEntries()
  }, [])

  const fetchEntries = async () => {
    try {
      const { data, error } = await supabase.from("entries").select("*").order("created_at", { ascending: false })

      if (error) throw error

      setEntries(data || [])
    } catch (error) {
      console.error("Error fetching entries:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this entry?")) {
      setDeletingId(id)
      try {
        const { error } = await supabase.from("entries").delete().eq("id", id)

        if (error) throw error

        setEntries(entries.filter((entry) => entry.id !== id))
        toast('Entry deleted successfully')
      } catch (err) {
        toast('Failed to delete entry')
      } finally {
        setDeletingId(null)
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <Button variant="outline" onClick={handleSignOut}>
          Sign Out
        </Button>
      </div>

      <AddEntryForm onSuccess={fetchEntries} />

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Existing Entries</h2>
        {loading ? (
          <p>Loading entries...</p>
        ) : entries.length > 0 ? (
          <ul className="space-y-2">
            {entries.map((entry) => (
              <li key={entry.id} className="p-3 bg-muted rounded-md flex justify-between items-center">
                <div>
                  <span className="font-medium">{entry.content}</span>
                  <span className="ml-2 text-sm text-muted-foreground">Luck: {entry.luck}/10</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(entry.id)}
                  disabled={deletingId === entry.id}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={16} />
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No entries found.</p>
        )}
      </div>
    </div>
  )
}

