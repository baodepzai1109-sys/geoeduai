"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export type UserProfile = {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string;
  role: string;
  bio: string | null;
};

export default function useUser() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  async function loadUser() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();

    if (data) {
      setUser(data);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadUser();
  }, []);

  return {
    user,
    loading,
  };
}