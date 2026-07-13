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
    <main
    className="
    relative
    flex
    min-h-screen
    items-center
    justify-center
    overflow-hidden

    bg-gradient-to-br
    from-[#04152D]
    via-[#071A3B]
    to-[#0B2248]

    p-6
    "
>
{/* Background */}

<div className="absolute inset-0 overflow-hidden">

    <div
        className="
        absolute
        -left-32
        -top-32
        h-80
        w-80
        rounded-full
        bg-[#1565C0]/20
        blur-3xl
        "
    />

    <div
        className="
        absolute
        right-0
        bottom-0
        h-[450px]
        w-[450px]
        rounded-full
        bg-cyan-400/10
        blur-3xl
        "
    />

</div>


      <div
    className="
    relative

    w-full
    max-w-md

    rounded-[32px]

    border
    border-blue-500/20

    bg-white/5
    backdrop-blur-2xl

    p-8

    shadow-[0_0_50px_rgba(21,101,192,.35)]
    "
>

        <div className="flex flex-col items-center">

          <div className="relative flex items-center justify-center">

    {/* Ánh sáng phía sau */}
    <div
        className="
        absolute
        h-28
        w-28
        rounded-full
        bg-[#1E88E5]
        opacity-40
        blur-2xl
        animate-pulse
        "
    />

    <Image
        src="/images/logo.png"
        width={90}
        height={90}
        alt="GeoEduAI"
        className="
        relative
        z-10
        object-contain
        drop-shadow-[0_0_20px_rgba(66,165,245,.8)]
        "
    />

</div>

          <h1
    className="
    mt-6
    text-4xl
    font-black
    text-white
    "
>
            Đăng nhập
          </h1>

          <p
    className="
    mt-3
    text-center
    text-slate-300
    "
>
            Chào mừng quay trở lại GeoEduAI
          </p>

        </div>

        <div className="mt-8 space-y-5">

          <div>

            <label className="mb-2 block font-semibold text-slate-200">
              Email
            </label>

            <div className="relative">

              <Mail
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300"
              />

              <input
                type="email"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="
w-full

rounded-xl

border
border-blue-700/50

bg-[#10294F]

py-3
pl-12
pr-4

text-white
placeholder:text-slate-400

outline-none

transition

focus:border-[#42A5F5]
focus:ring-2
focus:ring-[#1565C0]
"
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
                className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300"
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
            className="
flex
w-full
items-center
justify-center
gap-2

rounded-xl

bg-gradient-to-r
from-[#1565C0]
to-[#42A5F5]

py-3

font-bold
text-white

shadow-lg
shadow-blue-600/40

transition

hover:scale-[1.02]
hover:shadow-blue-500/50

disabled:opacity-60
"
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

          <p className="text-center text-slate-300">

            Chưa có tài khoản?{" "}

            <Link
              href="/register"
              className="
font-semibold
text-[#42A5F5]
hover:text-white
transition
"
            >
              Đăng ký
            </Link>

          </p>

        </div>

      </div>
    </main>
    
  );
}   