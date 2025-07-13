"use client"
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Provider from "./provider";
import { useRouter } from "next/navigation";
import { supabase } from "./services/supaBaseclient";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    const checkAuthStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push('/dashboard');
      } else {
        router.push('/auth');
      }
    };

    checkAuthStatus();
  }, [router]);

  return (
    <div>
      <h1> Hello</h1>
      <Button>Click This</Button>
    </div>
  );
}
