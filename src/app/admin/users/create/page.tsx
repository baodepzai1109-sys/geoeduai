"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Lock,
  Shield,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

export default function CreateUserPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  async function createUser() {
    if (!form.name || !form.email || !form.password) {
      alert("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/admin/create-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error);
        return;
      }

      alert("✅ Tạo tài khoản thành công!");

      router.push("/admin/users");
    } catch {
      alert("Có lỗi xảy ra.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl">

      <div className="mb-8 flex items-center justify-between">

        <div>
          <h1 className="text-4xl font-black">
            Create User
          </h1>

          <p className="mt-2 text-gray-400">
            Tạo tài khoản mới cho GeoEduAI
          </p>
        </div>

        <Link
          href="/admin/users"
          className="flex items-center gap-2 rounded-xl bg-[#08101F] px-5 py-3 hover:bg-[#12203B]"
        >
          <ArrowLeft size={18} />
          Quay lại
        </Link>

      </div>

      <div className="space-y-6 rounded-3xl border border-[#22345B] bg-[#0B1228] p-8">

        <div>
          <label className="mb-2 block text-sm text-gray-400">
            Họ và tên
          </label>

          <div className="flex items-center gap-3 rounded-xl bg-[#08101F] px-4 py-4">

            <User size={18} />

            <input
              placeholder="Nguyễn Văn A"
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
              className="w-full bg-transparent outline-none"
            />

          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm text-gray-400">
            Email
          </label>

          <div className="flex items-center gap-3 rounded-xl bg-[#08101F] px-4 py-4">

            <Mail size={18} />

            <input
              type="email"
              placeholder="user@geoedu.vn"
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value,
                })
              }
              className="w-full bg-transparent outline-none"
            />

          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm text-gray-400">
            Mật khẩu
          </label>

          <div className="flex items-center gap-3 rounded-xl bg-[#08101F] px-4 py-4">

            <Lock size={18} />

            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) =>
                setForm({
                  ...form,
                  password: e.target.value,
                })
              }
              className="w-full bg-transparent outline-none"
            />

          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm text-gray-400">
            Quyền
          </label>

          <div className="flex items-center gap-3 rounded-xl bg-[#08101F] px-4 py-4">

            <Shield size={18} />

            <select
              value={form.role}
              onChange={(e) =>
                setForm({
                  ...form,
                  role: e.target.value,
                })
              }
              className="w-full bg-transparent outline-none"
            >
              <option className="bg-[#08101F]" value="user">
                User
              </option>

              <option className="bg-[#08101F]" value="moderator">
                Moderator
              </option>

              <option className="bg-[#08101F]" value="admin">
                Admin
              </option>

              <option className="bg-[#08101F]" value="owner">
                Owner
              </option>
            </select>

          </div>
        </div>

        <button
          onClick={createUser}
          disabled={loading}
          className="mt-4 w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 py-4 text-lg font-bold transition hover:scale-[1.02] disabled:opacity-60"
        >
          {loading ? "Đang tạo..." : "Tạo tài khoản"}
        </button>

      </div>

    </div>
  );
}