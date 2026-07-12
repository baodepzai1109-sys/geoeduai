"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

import {
  Loader2,
  Mail,
  Lock,
  User,
  Camera,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [avatarFile, setAvatarFile] =
    useState<File | null>(null);

  const [loading, setLoading] =
    useState(false);

  async function register() {
    if (!fullName.trim()) {
      alert("Vui lòng nhập họ tên.");
      return;
    }

    if (!email.trim()) {
      alert("Vui lòng nhập email.");
      return;
    }

    if (password.length < 6) {
      alert("Mật khẩu tối thiểu 6 ký tự.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Mật khẩu xác nhận không khớp.");
      return;
    }

    setLoading(true);

    const { data, error } =
      await supabase.auth.signUp({
        email,
        password,
      });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    if (!data.user) {
      alert("Không thể tạo tài khoản.");
      setLoading(false);
      return;
    }

    let avatarUrl = "";

    if (avatarFile) {
      const ext =
        avatarFile.name.split(".").pop();

      const fileName =
        `${data.user.id}.${ext}`;

      const { error: uploadError } =
        await supabase.storage
          .from("avatars")
          .upload(fileName, avatarFile, {
            upsert: true,
          });

      if (uploadError) {
        alert(uploadError.message);
        setLoading(false);
        return;
      }

      avatarUrl =
        supabase.storage
          .from("avatars")
          .getPublicUrl(fileName)
          .data.publicUrl;
    }

    const { error: profileError } =
      await supabase
        .from("profiles")
        .insert({
          id: data.user.id,
          full_name: fullName,
          avatar_url: avatarUrl,
        });

    setLoading(false);

    if (profileError) {
      alert(profileError.message);
      return;
    }

    alert(
      "Đăng ký thành công. Kiểm tra email để xác minh tài khoản."
    );

    router.push("/login");
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
      from-[#071A3B]
      via-[#0B2248]
      to-[#1565C0]
      p-6
    "
    >
              <div className="absolute inset-0 overflow-hidden">

        <div
          className="
          absolute
          -left-48
          top-10
          h-[450px]
          w-[450px]
          rounded-full
          bg-blue-500/20
          blur-[150px]
        "
        />

        <div
          className="
          absolute
          right-0
          bottom-0
          h-[500px]
          w-[500px]
          rounded-full
          bg-cyan-400/10
          blur-[170px]
        "
        />

      </div>
            <div
        className="
        relative
        z-10
        w-full
        max-w-md
        overflow-hidden
        rounded-[34px]
        border
        border-blue-300/20
        bg-white/10
        p-10
        text-white
        shadow-[0_25px_80px_rgba(0,0,0,.45)]
        backdrop-blur-3xl
      "
      >
                <div className="flex flex-col items-center">

          <Image
            src="/images/logo.png"
            alt="GeoEduAI"
            width={110}
            height={110}
            className="
            rounded-full
            ring-4
            ring-blue-400/30
            shadow-2xl
          "
          />

          <h1
            className="
            mt-6
            text-4xl
            font-black
            tracking-wide
          "
          >
            Đăng ký
          </h1>

          <p className="mt-3 text-center text-slate-300 leading-7">

            Tham gia cộng đồng GeoEduAI để chia sẻ kiến thức,
            đặt câu hỏi và học Địa lí cùng AI.

          </p>

        </div>

        <div className="mt-10 space-y-6">
            {/* ================= AVATAR ================= */}

<div className="flex flex-col items-center">

  <label
    htmlFor="avatar"
    className="group cursor-pointer"
  >

    <div
      className="
      relative
      h-32
      w-32
      overflow-hidden
      rounded-full
      border-4
      border-blue-400
      bg-[#0B2248]
      shadow-2xl
      transition
      duration-300
      group-hover:scale-105
      "
    >

      {avatarFile ? (

        <Image
          src={URL.createObjectURL(avatarFile)}
          alt="Avatar"
          width={128}
          height={128}
          className="h-full w-full object-cover"
        />

      ) : (

        <div className="flex h-full items-center justify-center">

          <User
            size={52}
            className="text-slate-400"
          />

        </div>

      )}

      <div
        className="
        absolute
        bottom-0
        right-0
        flex
        h-10
        w-10
        items-center
        justify-center
        rounded-full
        bg-[#1565C0]
        shadow-xl
        "
      >

        <Camera size={18} />

      </div>

    </div>

  </label>

  <input
    id="avatar"
    hidden
    type="file"
    accept="image/*"
    onChange={(e) => {
      if (e.target.files?.[0]) {
        setAvatarFile(e.target.files[0]);
      }
    }}
  />

  <p className="mt-3 text-sm text-slate-300">
    Chọn ảnh đại diện
  </p>

</div>

{/* ================= HỌ TÊN ================= */}

<div>

  <label className="mb-2 block font-semibold text-slate-200">
    Họ và tên
  </label>

  <div className="relative">

    <User
      size={20}
      className="
      absolute
      left-4
      top-1/2
      -translate-y-1/2
      text-slate-400
      "
    />

    <input
      value={fullName}
      onChange={(e) => setFullName(e.target.value)}
      placeholder="Nguyễn Văn A"
      className="
      w-full
      rounded-2xl
      border
      border-blue-400/20
      bg-[#0B2248]/70
      py-4
      pl-12
      pr-4
      text-white
      placeholder:text-slate-400
      outline-none
      transition
      focus:border-[#42A5F5]
      focus:ring-2
      focus:ring-[#42A5F5]/40
      "
    />

  </div>

</div>

{/* ================= EMAIL ================= */}

<div>

  <label className="mb-2 block font-semibold text-slate-200">
    Email
  </label>

  <div className="relative">

    <Mail
      size={20}
      className="
      absolute
      left-4
      top-1/2
      -translate-y-1/2
      text-slate-400
      "
    />

    <input
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      placeholder="example@gmail.com"
      className="
      w-full
      rounded-2xl
      border
      border-blue-400/20
      bg-[#0B2248]/70
      py-4
      pl-12
      pr-4
      text-white
      placeholder:text-slate-400
      outline-none
      transition
      focus:border-[#42A5F5]
      focus:ring-2
      focus:ring-[#42A5F5]/40
      "
    />

  </div>

</div>

{/* ================= PASSWORD ================= */}

<div>

  <label className="mb-2 block font-semibold text-slate-200">
    Mật khẩu
  </label>

  <div className="relative">

    <Lock
      size={20}
      className="
      absolute
      left-4
      top-1/2
      -translate-y-1/2
      text-slate-400
      "
    />

    <input
      type="password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      placeholder="••••••••"
      className="
      w-full
      rounded-2xl
      border
      border-blue-400/20
      bg-[#0B2248]/70
      py-4
      pl-12
      pr-4
      text-white
      placeholder:text-slate-400
      outline-none
      transition
      focus:border-[#42A5F5]
      focus:ring-2
      focus:ring-[#42A5F5]/40
      "
    />

  </div>

</div>

{/* ================= CONFIRM PASSWORD ================= */}

<div>

  <label className="mb-2 block font-semibold text-slate-200">
    Xác nhận mật khẩu
  </label>

  <div className="relative">

    <Lock
      size={20}
      className="
      absolute
      left-4
      top-1/2
      -translate-y-1/2
      text-slate-400
      "
    />

    <input
      type="password"
      value={confirmPassword}
      onChange={(e) => setConfirmPassword(e.target.value)}
      placeholder="••••••••"
      className="
      w-full
      rounded-2xl
      border
      border-blue-400/20
      bg-[#0B2248]/70
      py-4
      pl-12
      pr-4
      text-white
      placeholder:text-slate-400
      outline-none
      transition
      focus:border-[#42A5F5]
      focus:ring-2
      focus:ring-[#42A5F5]/40
      "
    />

  </div>

</div>
{/* ================= BUTTON ================= */}

<button
  onClick={register}
  disabled={loading}
  className="
  group
  mt-3
  flex
  w-full
  items-center
  justify-center
  gap-3
  rounded-2xl
  bg-gradient-to-r
  from-[#1565C0]
  via-[#1976D2]
  to-[#42A5F5]
  py-4
  text-lg
  font-bold
  text-white
  shadow-xl
  transition-all
  duration-300
  hover:-translate-y-1
  hover:shadow-[0_15px_35px_rgba(33,150,243,.45)]
  active:scale-95
  disabled:opacity-60
"
>

  {loading && (
    <Loader2
      size={22}
      className="animate-spin"
    />
  )}

  {loading
    ? "Đang tạo tài khoản..."
    : "Tạo tài khoản"}

</button>

{/* ================= DIVIDER ================= */}

<div className="relative py-2">

  <div className="absolute left-0 top-1/2 h-px w-full bg-white/10" />

  <span
    className="
    relative
    mx-auto
    flex
    w-fit
    bg-transparent
    px-4
    text-sm
    text-slate-300
  "
  >
    hoặc
  </span>

</div>

{/* ================= LOGIN ================= */}

<div className="text-center">

  <span className="text-slate-300">
    Đã có tài khoản?
  </span>

  <Link
    href="/login"
    className="
    ml-2
    font-bold
    text-[#6EC6FF]
    transition
    hover:text-white
  "
  >
    Đăng nhập ngay
  </Link>

</div>

{/* ================= FOOTER ================= */}

<div
  className="
  mt-8
  rounded-2xl
  border
  border-white/10
  bg-white/5
  p-4
  text-center
  text-sm
  text-slate-300
"
>

  <div className="font-semibold text-white">
    GeoEduAI Community
  </div>

  <p className="mt-2 leading-6">
    Nền tảng học tập Địa lí ứng dụng AI,
    kết nối giáo viên và học sinh trên
    toàn quốc.
  </p>

</div>

</div>

</div>

</main>
);
}