"use client"
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabase } from "./services/supaBaseclient";
import { useEffect, useState } from "react";
import { Bot, Calendar, MessageCircle, BarChart3, Users, CheckCircle, Sparkles } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setLoading(false);
      setAuthenticated(!!session);
    };
    checkAuthStatus();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
        <Image src="/logo.png" alt="Logo" width={120} height={120} />
        <div className="mt-6 text-lg font-semibold text-blue-700">Loading...</div>
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500 mt-4"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="bg-white shadow-xl rounded-2xl p-10 flex flex-col items-center max-w-lg w-full">
        <Image src="/logo.png" alt="Logo" width={120} height={120} className="mb-4" />
        <h1 className="text-4xl font-extrabold text-blue-700 mb-2 text-center flex items-center gap-2">
          <Sparkles className="text-yellow-400 w-8 h-8" />
          Smart Persona
        </h1>
        <p className="text-gray-600 mb-6 text-center max-w-md">
          Welcome to <span className="font-semibold text-blue-600">Smart Persona</span>, your AI-powered recruiter for modern interviews.<br />
          Discover everything you can do with our platform:
        </p>
        <div className="grid grid-cols-1 gap-4 w-full mb-6">
          <div className="flex items-center gap-3 bg-blue-50 rounded-lg p-3">
            <Bot className="text-blue-600 w-6 h-6" />
            <span className="font-medium text-gray-700">Conduct AI-driven interviews</span>
          </div>
          <div className="flex items-center gap-3 bg-blue-50 rounded-lg p-3">
            <Calendar className="text-green-600 w-6 h-6" />
            <span className="font-medium text-gray-700">Schedule interviews with ease</span>
          </div>
          <div className="flex items-center gap-3 bg-blue-50 rounded-lg p-3">
            <BarChart3 className="text-pink-600 w-6 h-6" />
            <span className="font-medium text-gray-700">Track interview analytics & progress</span>
          </div>
        </div>
        <div className="flex flex-col gap-3 w-full">
          {authenticated ? (
            <>
              <Button
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded w-full"
                onClick={() => router.push('/dashboard')}
              >
                Go to Dashboard
              </Button>
              <Button
                variant="outline"
                className="px-6 py-2 w-full"
                onClick={() => router.push('/schedule-interview')}
              >
                Schedule New Interview
              </Button>
            </>
          ) : (
            <Button
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded w-full"
              onClick={() => router.push('/auth')}
            >
              Login
            </Button>
          )}
        </div>
        <div className="mt-6 text-xs text-gray-400 text-center">
          &copy; {new Date().getFullYear()} Smart Persona. All rights reserved.
        </div>
      </div>
    </div>
  );
}
