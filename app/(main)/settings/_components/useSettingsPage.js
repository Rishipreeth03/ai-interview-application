import { useState, useEffect } from "react"
import { supabase } from "@/app/services/supaBaseclient"

function useSettingsPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true)
      setError("")
      setSuccess("")
      if (!supabase.auth) {
        setError("Supabase client is not initialized with auth.")
        setLoading(false)
        return
      }
      const { data, error: authError } = await supabase.auth.getUser()
      if (!data?.user) {
        setError("User not authenticated.")
        setLoading(false)
        return
      }
      setName(data.user.user_metadata?.name || "")
      setEmail(data.user.email || "")
      setLoading(false)
    }
    fetchUser()
  }, [])

  return {
    name,
    email,
    loading,
    error,
    success,
  }
}

export default useSettingsPage
