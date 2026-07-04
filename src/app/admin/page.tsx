"use client";
import { useState } from "react";
import { Eye, EyeOff, Lock, Mail, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const handleLogin = () => {
  const ADMIN_EMAIL = "admin@geoaiedu.vn";
  const ADMIN_PASSWORD = "123456";

  if (
    email.trim() === ADMIN_EMAIL &&
    password === ADMIN_PASSWORD
  ) {
    localStorage.setItem("admin_logged_in", "true");

    router.push("/admin/dashboard");
  } else {
    alert("Sai email hoặc mật khẩu!");
  }
};

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050816]">

      {/* Background Glow */}

      <div className="absolute left-0 top-0 h-[450px] w-[450px] rounded-full bg-blue-500/20 blur-[180px]" />

      <div className="absolute bottom-0 right-0 h-[450px] w-[450px] rounded-full bg-cyan-500/20 blur-[180px]" />

      {/* Grid */}

      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px)] bg-[size:45px_45px]" />

      {/* Card */}

      <div className="relative z-10 w-full max-w-md rounded-[32px] border border-white/10 bg-white/5 p-10 backdrop-blur-2xl">

        <div className="mb-10 text-center">

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-600 to-cyan-400">

            <ShieldCheck size={38} />

          </div>

          <h1 className="mt-6 text-4xl font-black">

            GeoEduAI

          </h1>

          <p className="mt-3 text-gray-400">

            Administrator Control Center

          </p>

        </div>

        {/* Email */}

        <div className="mb-6">

          <label className="mb-2 block text-sm text-gray-400">

            Email

          </label>

          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4">

            <Mail size={20} />

           <input
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  type="email"
  placeholder="example@email.com"
  className="w-full bg-transparent outline-none"
/>

          </div>

        </div>

        {/* Password */}

        <div>

          <label className="mb-2 block text-sm text-gray-400">

            Password

          </label>

          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4">

            <Lock size={20} />

            <input
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  type={showPassword ? "text" : "password"}
  placeholder="••••••••"
  className="w-full bg-transparent outline-none"
/>

            <button
              onClick={() =>
                setShowPassword(!showPassword)
              }
            >
              {showPassword ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>

          </div>

        </div>

        {/* Remember */}

        <div className="mt-6 flex items-center justify-between">

          <label className="flex items-center gap-2 text-sm text-gray-400">

            <input type="checkbox" />

            Remember me

          </label>

          <button className="text-sm text-cyan-400">

            Forgot?

          </button>

        </div>

        {/* Login */}

<button
  onClick={handleLogin}
  className="mt-8 w-full rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 py-4 text-lg font-bold transition hover:scale-[1.02]"
>
  Login
</button>

        <p className="mt-8 text-center text-xs text-gray-500">

          GeoEduAI © 2026

        </p>

      </div>

    </div>
  );
}