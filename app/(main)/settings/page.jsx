'use client'
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { User } from "lucide-react";
import { supabase } from "../../services/supaBaseclient";

export default function SettingsPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError("");
      setSuccess("");
      if (!supabase.auth) {
        setError("Supabase client is not initialized with auth.");
        setLoading(false);
        return;
      }
      const { data, error: authError } = await supabase.auth.getUser();
      if (!data?.user) {
        setError("User not authenticated.");
        setLoading(false);
        return;
      }
      setName(data.user.user_metadata?.name || "");
      setEmail(data.user.email || "");
      setLoading(false);
    };
    fetchUser();
  }, []);

  return (
    <main className="max-w-xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
        <User className="w-7 h-7 text-blue-600" /> Account Settings
      </h1>
      <section className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Profile Details</h2>
        {loading ? (
          <div className="text-gray-500">Loading...</div>
        ) : (
          <form className="flex flex-col gap-4">
            <Input
              placeholder="Name"
              value={name}
              disabled
            />
            <Input
              placeholder="Email"
              type="email"
              value={email}
              disabled
            />
          </form>
        )}
      </section>
    </main>
  );
}