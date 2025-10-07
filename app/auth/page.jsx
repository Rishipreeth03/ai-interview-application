'use client'
import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { supabase } from '../services/supaBaseclient'
import { toast } from 'sonner'
import AuthLogo from './_components/AuthLogo'
import AuthIllustration from './_components/AuthIllustration'
import AuthHeading from './_components/AuthHeading'
import GoogleButton from './_components/GoogleButton'

const Page = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const checkAuthStatus = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (session) {
        router.push('/dashboard')
      }
    }
    
    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          router.push('/dashboard')
        }
      }
    )
    
    checkAuthStatus()
    
    // Clean up listener
    return () => {
      authListener?.subscription?.unsubscribe()
    }
  }, [router])

  const signinWithGoogle = async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/dashboard',
          // Request additional scopes to get profile info
          scopes: 'email profile',
        }
      })
      
      if (error) {
        console.error("Authentication error:", error.message)
        toast.error("Failed to sign in with Google. Please try again.")
        throw error
      }
      
      // OAuth redirect happens automatically
    } catch (err) {
      console.error("Sign in failed:", err)
      toast.error("Authentication failed. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 flex items-center justify-center px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
    >
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 40 }}
          transition={{ duration: 0.7 }}
          className="backdrop-blur-md bg-white/30 border border-white/40 shadow-2xl rounded-3xl p-8 sm:p-10 max-w-md w-full text-center space-y-6"
        >
          <AuthLogo />
          <AuthIllustration />
          <AuthHeading />
          <GoogleButton onClick={signinWithGoogle} isLoading={isLoading} />
          <div className="mt-4 text-xs text-white/70 text-center">
            Powered by Smart Persona &mdash; Secure, private, and fast.
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}

export default Page
