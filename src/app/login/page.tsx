"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { Loader2, Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  async function login() {
    if (!email.trim()) {
      alert("Vui lòng nhập email.");
      return;
    }

    if (!password.trim()) {
      alert("Vui lòng nhập mật khẩu.");
      return;
    }

    setLoading(true);

    const { error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    router.push("/community");
  }

  return (
    <main className="min-h-screen bg-[#EEF3FB] flex items-center justify-center p-6">

      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">

        <div className="flex flex-col items-center">

          <Image
            src="/images/logo.png"
            width={90}
            height={90}
            alt="GeoEduAI"
          />

          <h1 className="mt-5 text-3xl font-black text-[#1565C0]">
            Đăng nhập
          </h1>

          <p className="mt-2 text-center text-gray-500">
            Chào mừng quay trở lại GeoEduAI
          </p>

        </div>

        <div className="mt-8 space-y-5">

          <div>

            <label className="mb-2 block font-semibold">
              Email
            </label>

            <div className="relative">

              <Mail
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="email"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border py-3 pl-12 pr-4 outline-none focus:border-[#1565C0]"
              />

            </div>

          </div>

          <div>

            <label className="mb-2 block font-semibold">
              Mật khẩu
            </label>

            <div className="relative">

              <Lock
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border py-3 pl-12 pr-4 outline-none focus:border-[#1565C0]"
              />

            </div>

          </div>

          <button
            onClick={login}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1565C0] py-3 font-bold text-white transition hover:bg-[#0D47A1] disabled:opacity-60"
          >
            {loading && (
              <Loader2
                size={18}
                className="animate-spin"
              />
            )}

            {loading
              ? "Đang đăng nhập..."
              : "Đăng nhập"}
          </button>

          <p className="text-center text-gray-500">

            Chưa có tài khoản?{" "}

            <Link
              href="/register"
              className="font-semibold text-[#1565C0]"
            >
              Đăng ký
            </Link>

          </p>

        </div>

      </div>

    </main>
  );
}