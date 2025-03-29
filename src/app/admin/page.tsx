"use client"

import { useEffect, useState } from "react"
import AdminLoginForm from "@/components/admin-login-form"
import AdminDashboard from "@/components/admin-dashboard"
import { supabase } from "@/lib/supabase"

export default function AdminPage() {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession()
      setSession(data.session)
      setLoading(false)

      // Set up auth state listener
      const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
        setSession(session)
      })

      return () => {
        authListener.subscription.unsubscribe()
      }
    }

    fetchSession()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    )
  }

  return <div className="container mx-auto py-8 px-4">{session ? <AdminDashboard /> : <AdminLoginForm />}</div>
}

