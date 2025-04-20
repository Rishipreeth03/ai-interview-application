'use client'
import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { FcGoogle } from 'react-icons/fc'
import { supabase } from '../services/supaBaseclient'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const Page = () => {
  const router = useRouter();

  useEffect(() => {
    const checkAuthStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push('/dashboard'); // Redirect to dashboard if user is authenticated
      }
    };

    checkAuthStatus();
  }, [router]);

  const signinWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (!error) {
      console.error("Error");
    }
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="backdrop-blur-md bg-white/30 border border-white/40 shadow-2xl rounded-3xl p-8 sm:p-10 max-w-md w-full text-center space-y-6"
      >
        <div className="flex justify-center">
          <Image src="/logow.png" alt="logo" width={300} height={40} className="object-contain h-[150px]" />
        </div>

        <div className="flex justify-center">
          <Image src="/login.webp" alt="login" width={200} height={120} className="rounded-xl shadow-md" />
        </div>

        <h1 className="text-3xl font-bold text-white drop-shadow-md">Welcome to Smart Persona</h1>
        <p className="text-white/80 text-sm">Sign in with your Google account to continue</p>

        <Button className="w-full bg-white text-black hover:bg-gray-100 shadow-lg flex items-center justify-center gap-2 text-base font-medium transition-all duration-300"
          onClick={signinWithGoogle}>
          <FcGoogle size={20} />
          Login with Google
        </Button>
      </motion.div>
    </div>
  )
}

export default Page
