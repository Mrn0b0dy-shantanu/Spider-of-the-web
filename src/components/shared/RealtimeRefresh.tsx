"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export function RealtimeRefresh({ tables }: { tables: string[] }) {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const channels = tables.map(table => {
      return supabase
        .channel(`realtime-${table}`)
        .on('postgres_changes', { event: '*', schema: 'public', table }, () => {
          router.refresh()
        })
        .subscribe()
    })

    return () => {
      channels.forEach(channel => {
        supabase.removeChannel(channel)
      })
    }
  }, [tables, supabase, router])

  return null
}
