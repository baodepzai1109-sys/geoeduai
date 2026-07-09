"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import {
  Users,
  Search,
  Plus,
  Crown,
  Shield,
  Mail,
  Trash2,
  Ban,
  UserCheck,
  Loader2,
  Pencil,
  Filter,
} from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  banned: boolean;
  created_at: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [roleFilter, setRoleFilter] =
    useState("all");

  const [statusFilter, setStatusFilter] =
    useState("all");

  const [selectedUser, setSelectedUser] =
    useState<User | null>(null);

  const [deleteModal, setDeleteModal] =
    useState(false);

  const [banModal, setBanModal] =
    useState(false);

  const [editModal, setEditModal] =
    useState(false);

  const [toast, setToast] = useState({
    show: false,
    title: "",
    message: "",
    type: "success",
  });

  useEffect(() => {
    loadUsers();
  }, []);

async function loadUsers() {
  try {
    setLoading(true);

    const res = await fetch("/api/admin/users", {
      cache: "no-store",
    });

    if (!res.ok) {
      return;
    }

    const data = await res.json();

    console.log("Users:", data); // kiểm tra dữ liệu

    setUsers(data);

  } finally {
    setLoading(false);
  }
} 

  async function toggleBan(
    user: User
  ) {
    await fetch(
      `/api/admin/users/${user.id}`,
      {
        method: "PATCH",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          banned: !user.banned,
        }),
      }
    );

    showToast(
      "success",
      !user.banned
        ? "Đã khóa tài khoản"
        : "Đã mở khóa tài khoản",
      user.name
    );

    loadUsers();
  }

  async function deleteUser(id: string) {
  const res = await fetch(`/api/admin/users/${id}`, {
    method: "DELETE",
    cache: "no-store",
  });

  if (!res.ok) {
    alert("Delete failed");
    return;
  }

  setDeleteModal(false);
  setSelectedUser(null);

  await loadUsers();
}

  function showToast(
    type: string,
    title: string,
    message: string
  ) {
    setToast({
      show: true,
      title,
      message,
      type,
    });

    setTimeout(() => {
      setToast((old) => ({
        ...old,
        show: false,
      }));
    }, 3000);
  }

  const filteredUsers =
    useMemo(() => {
      return users.filter(
        (u) => {
          const keyword =
            `${u.name} ${u.email}`
              .toLowerCase()
              .includes(
                search.toLowerCase()
              );

          const role =
            roleFilter ===
            "all"
              ? true
              : u.role ===
                roleFilter;

          const status =
            statusFilter ===
            "all"
              ? true
              : statusFilter ===
                "active"
              ? !u.banned
              : u.banned;

          return (
            keyword &&
            role &&
            status
          );
        }
      );
    }, [
      users,
      search,
      roleFilter,
      statusFilter,
    ]);

  const totalUsers =
    users.length;

  const activeUsers =
    users.filter(
      (u) => !u.banned
    ).length;

  const bannedUsers =
    users.filter(
      (u) => u.banned
    ).length;

  const adminUsers =
    users.filter(
      (u) =>
        u.role === "admin"
    ).length;

  function Avatar({
    name,
  }: {
    name: string;
  }) {
    return (
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 text-xl font-black shadow-xl">

        {name
          ?.charAt(0)
          .toUpperCase()}

      </div>
    );
  }

  function RoleBadge({
    role,
  }: {
    role: string;
  }) {
    const color =
      role === "admin"
        ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
        : role ===
          "moderator"
        ? "bg-purple-500/20 text-purple-300 border-purple-500/30"
        : "bg-cyan-500/20 text-cyan-300 border-cyan-500/30";

    return (
      <div
        className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold ${color}`}
      >
        <Shield size={14} />

        {role.toUpperCase()}
      </div>
    );
  }

  function StatusBadge({
    banned,
  }: {
    banned: boolean;
  }) {
    return banned ? (
      <div className="rounded-full border border-red-500/30 bg-red-500/20 px-4 py-2 text-red-400">

        BANNED

      </div>
    ) : (
      <div className="rounded-full border border-green-500/30 bg-green-500/20 px-4 py-2 text-green-400">

        ACTIVE

      </div>
    );
  }

  function StatCard({
    title,
    value,
    icon,
  }: {
    title: string;
    value: number;
    icon: React.ReactNode;
  }) {
    return (
      <div className="rounded-3xl border border-[#22345B] bg-[#0B1228] p-7">

        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-400">

          {icon}

        </div>

        <div className="mt-6 text-5xl font-black">

          {loading ? (
            <Loader2 className="animate-spin" />
          ) : (
            value
          )}

        </div>

        <div className="mt-2 text-gray-400">

          {title}

        </div>

      </div>
    );
  }
    return (
    <div className="min-h-screen bg-[#050816] text-white">

      {/* Background */}

      <div className="fixed inset-0 -z-10 overflow-hidden">

        <div className="absolute -left-52 -top-52 h-[550px] w-[550px] rounded-full bg-cyan-500/10 blur-[180px]" />

        <div className="absolute bottom-0 right-0 h-[650px] w-[650px] rounded-full bg-blue-600/10 blur-[220px]" />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.025)_1px,transparent_1px)] bg-[size:55px_55px]" />

      </div>

      <div className="mx-auto max-w-[1700px] space-y-8 p-8">

        {/* HERO */}

        <section className="relative overflow-hidden rounded-[36px] border border-cyan-500/20 bg-gradient-to-br from-[#0B1228] via-[#08101F] to-[#050816] p-10">

          <div className="absolute -right-28 -top-20 h-72 w-72 rounded-full bg-cyan-500/10 blur-[160px]" />

          <div className="absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-blue-600/10 blur-[160px]" />

          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-5 py-2 text-sm text-cyan-300">

                <Users size={16} />

                USER MANAGEMENT

              </div>

              <h1 className="mt-6 text-5xl font-black tracking-tight">

                GeoEduAI Users

              </h1>

              <p className="mt-5 max-w-3xl text-lg leading-8 text-gray-400">

                Quản lý tài khoản, phân quyền, khóa tài khoản,
                chỉnh sửa thông tin và theo dõi toàn bộ người dùng
                trong hệ thống GeoEduAI.

              </p>

            </div>

            <Link
              href="/admin/users/create"
              className="group flex items-center gap-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-5 text-lg font-bold shadow-xl shadow-cyan-500/20 transition hover:scale-105"
            >

              <Plus className="transition group-hover:rotate-90" />

              Create User

            </Link>

          </div>

        </section>

        {/* Statistics */}

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

          <StatCard
            title="Users"
            value={totalUsers}
            icon={<Users size={34} />}
          />

          <StatCard
            title="Active"
            value={activeUsers}
            icon={<UserCheck size={34} />}
          />

          <StatCard
            title="Banned"
            value={bannedUsers}
            icon={<Ban size={34} />}
          />

          <StatCard
            title="Admin"
            value={adminUsers}
            icon={<Crown size={34} />}
          />

        </section>

        {/* Toolbar */}

        <section className="rounded-[30px] border border-[#22345B] bg-[#0B1228] p-6">

          <div className="grid gap-5 xl:grid-cols-4">

            {/* Search */}

            <div className="flex items-center rounded-2xl bg-[#08101F] px-5">

              <Search
                size={20}
                className="mr-3 text-gray-500"
              />

              <input
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search users..."
                className="h-14 w-full bg-transparent outline-none placeholder:text-gray-500"
              />

            </div>

            {/* Role */}

            <div className="flex items-center rounded-2xl bg-[#08101F] px-5">

              <Filter
                size={18}
                className="mr-3 text-gray-500"
              />

<select
  value={roleFilter}
  onChange={(e) => setRoleFilter(e.target.value)}
  className="h-14 w-full rounded-xl border border-[#22345B] bg-[#08101F] px-4 text-white outline-none"
>
  <option className="bg-[#08101F] text-white" value="all">
    All Roles
  </option>

  <option className="bg-[#08101F] text-white" value="admin">
    Admin
  </option>

  <option className="bg-[#08101F] text-white" value="moderator">
    Moderator
  </option>

  <option className="bg-[#08101F] text-white" value="user">
    User
  </option>
</select>

            </div>

            {/* Status */}

            <div className="rounded-2xl bg-[#08101F] px-5">

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
                className="h-14 w-full bg-transparent outline-none"
              >

                <option value="all">
                  All Status
                </option>

                <option value="active">
                  Active
                </option>

                <option value="banned">
                  Banned
                </option>

              </select>

            </div>

            {/* Results */}

            <div className="flex items-center justify-end rounded-2xl bg-gradient-to-r from-cyan-500/10 to-blue-600/10 px-6">

              <div>

                <div className="text-xs uppercase tracking-widest text-cyan-400">

                  Results

                </div>

                <div className="mt-1 text-3xl font-black">

                  {filteredUsers.length}

                </div>

              </div>

            </div>

          </div>

        </section>
                {/* ================= USERS ================= */}

        <section className="space-y-6">

          {loading &&

            Array.from({ length: 6 }).map((_, index) => (

              <div
                key={index}
                className="animate-pulse rounded-[32px] border border-[#22345B] bg-[#0B1228] p-8"
              >

                <div className="flex items-center gap-6">

                  <div className="h-16 w-16 rounded-full bg-[#16233F]" />

                  <div className="flex-1">

                    <div className="h-6 w-56 rounded bg-[#16233F]" />

                    <div className="mt-4 h-4 w-80 rounded bg-[#16233F]" />

                  </div>

                </div>

              </div>

            ))}

          {!loading &&
            filteredUsers.map((user) => (

              <div
                key={user.id}
                className="group overflow-hidden rounded-[32px] border border-[#22345B] bg-gradient-to-br from-[#0B1228] to-[#111B35] transition duration-300 hover:-translate-y-1 hover:border-cyan-500/30 hover:shadow-2xl hover:shadow-cyan-500/10"
              >

                <div className="h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600" />

                <div className="flex flex-col gap-8 p-8 xl:flex-row xl:items-center xl:justify-between">

                  {/* LEFT */}

                  <div className="flex items-center gap-6">

                    <Avatar name={user.name} />

                    <div>

                      <div className="flex flex-wrap items-center gap-3">

                        <h2 className="text-3xl font-black">

                          {user.name}

                        </h2>

                        <RoleBadge role={user.role} />

                        <StatusBadge banned={user.banned} />

                      </div>

                      <div className="mt-4 flex items-center gap-3 text-gray-400">

                        <Mail size={18} />

                        {user.email}

                      </div>

                      <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">

                        <span>

                          Joined{" "}

                          {new Date(
                            user.created_at
                          ).toLocaleDateString()}

                        </span>

                        <span>

                          ID: {user.id.slice(0, 8)}...

                        </span>

                      </div>

                    </div>

                  </div>

                  {/* ACTIONS */}

                  <div className="flex flex-wrap gap-4">

                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setEditModal(true);
                      }}
                      className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-4 text-cyan-400 transition hover:scale-110 hover:bg-cyan-500/20"
                    >

                      <Pencil size={22} />

                    </button>

                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setBanModal(true);
                      }}
                      className={`rounded-2xl p-4 transition hover:scale-110 ${
                        user.banned
                          ? "bg-green-600 hover:bg-green-500"
                          : "bg-yellow-600 hover:bg-yellow-500"
                      }`}
                    >

                      {user.banned ? (

                        <UserCheck size={22} />

                      ) : (

                        <Ban size={22} />

                      )}

                    </button>

                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setDeleteModal(true);
                      }}
                      className="rounded-2xl bg-red-600 p-4 transition hover:scale-110 hover:bg-red-500"
                    >

                      <Trash2 size={22} />

                    </button>

                  </div>

                </div>

              </div>

            ))}

          {!loading &&
            filteredUsers.length === 0 && (

              <div className="rounded-[34px] border border-dashed border-[#22345B] bg-[#0B1228] py-28 text-center">

                <Users
                  size={72}
                  className="mx-auto text-gray-600"
                />

                <h2 className="mt-6 text-3xl font-black">

                  Không tìm thấy người dùng

                </h2>

                <p className="mt-4 text-gray-500">

                  Hãy thử tìm kiếm bằng từ khóa khác.

                </p>

              </div>

            )}

        </section>

        {/* ================= PAGINATION ================= */}

        <section className="flex items-center justify-between rounded-[30px] border border-[#22345B] bg-[#0B1228] px-8 py-6">

          <div className="text-gray-400">

            Showing

            <span className="mx-2 font-bold text-white">

              {filteredUsers.length}

            </span>

            of

            <span className="mx-2 font-bold text-white">

              {users.length}

            </span>

            users

          </div>

          <div className="flex gap-3">

            <button className="rounded-xl bg-[#111B35] px-5 py-3 hover:bg-[#1A2C54]">

              Previous

            </button>

            <button className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3 font-bold">

              1

            </button>

            <button className="rounded-xl bg-[#111B35] px-5 py-3 hover:bg-[#1A2C54]">

              Next

            </button>

          </div>

        </section>
                {/* ================= DELETE MODAL ================= */}

        {deleteModal && selectedUser && (

          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">

            <div className="w-full max-w-md rounded-[32px] border border-red-500/20 bg-[#08101F] p-8 shadow-2xl">

              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-red-500/10">

                <Trash2
                  size={46}
                  className="text-red-400"
                />

              </div>

              <h2 className="mt-8 text-center text-3xl font-black">

                Delete User

              </h2>

              <p className="mt-5 text-center leading-8 text-gray-400">

                Bạn có chắc muốn xóa tài khoản

                <br />

                <span className="font-bold text-white">

                  {selectedUser.name}

                </span>

                ?

              </p>

              <div className="mt-10 flex gap-4">

                <button
                  onClick={() => setDeleteModal(false)}
                  className="flex-1 rounded-2xl border border-[#22345B] py-4 hover:bg-white/5"
                >

                  Cancel

                </button>

                <button
                  onClick={async () => {

                    await deleteUser(selectedUser.id);

                    setDeleteModal(false);

                  }}
                  className="flex-1 rounded-2xl bg-red-600 py-4 font-bold hover:bg-red-500"
                >

                  Delete

                </button>

              </div>

            </div>

          </div>

        )}

        {/* ================= BAN MODAL ================= */}

        {banModal && selectedUser && (

          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">

            <div className="w-full max-w-md rounded-[32px] border border-yellow-500/20 bg-[#08101F] p-8 shadow-2xl">

              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-yellow-500/10">

                <Ban
                  size={44}
                  className="text-yellow-400"
                />

              </div>

              <h2 className="mt-8 text-center text-3xl font-black">

                {selectedUser.banned
                  ? "Unban User"
                  : "Ban User"}

              </h2>

              <p className="mt-5 text-center leading-8 text-gray-400">

                {selectedUser.banned
                  ? "Mở khóa tài khoản này?"
                  : "Khóa tài khoản này?"}

              </p>

              <div className="mt-10 flex gap-4">

                <button
                  onClick={() => setBanModal(false)}
                  className="flex-1 rounded-2xl border border-[#22345B] py-4 hover:bg-white/5"
                >

                  Cancel

                </button>

                <button
                  onClick={async () => {

                    await toggleBan(selectedUser);

                    setBanModal(false);

                  }}
                  className={`flex-1 rounded-2xl py-4 font-bold ${
                    selectedUser.banned
                      ? "bg-green-600 hover:bg-green-500"
                      : "bg-yellow-600 hover:bg-yellow-500"
                  }`}
                >

                  Confirm

                </button>

              </div>

            </div>

          </div>

        )}

        {/* ================= TOAST ================= */}

        {toast.show && (

          <div className="fixed bottom-8 right-8 z-[100]">

            <div
              className={`rounded-2xl border px-6 py-5 shadow-2xl backdrop-blur-xl transition-all ${
                toast.type === "success"
                  ? "border-green-500/30 bg-green-500/20"
                  : "border-red-500/30 bg-red-500/20"
              }`}
            >

              <div className="flex items-center gap-4">

                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full ${
                    toast.type === "success"
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                >

                  {toast.type === "success" ? (

                    <UserCheck size={22} />

                  ) : (

                    <Ban size={22} />

                  )}

                </div>

                <div>

                  <div className="font-bold">

                    {toast.title}

                  </div>

                  <div className="text-sm text-gray-300">

                    {toast.message}

                  </div>

                </div>

              </div>

            </div>

          </div>

        )}
                {/* ================= EDIT MODAL ================= */}

        {editModal && selectedUser && (

          <EditUserModal
            user={selectedUser}
            onClose={() => {
              setEditModal(false);
              setSelectedUser(null);
            }}
            onSaved={() => {
              setEditModal(false);
              setSelectedUser(null);

              showToast(
                "success",
                "Cập nhật thành công",
                selectedUser.name
              );

              loadUsers();
            }}
          />

        )}

      </div>

    </div>

  );
}

/* ===========================================================
   EDIT USER MODAL
=========================================================== */

function EditUserModal({
  user,
  onClose,
  onSaved,
}: {
  user: User;
  onClose: () => void;
  onSaved: () => void;
}) {

  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
    role: user.role,
    banned: user.banned,
  });

  async function save() {

    setSaving(true);

    const res = await fetch(
      `/api/admin/users/${user.id}`,
      {
        method: "PATCH",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify(form),
      }
    );

    setSaving(false);

    if (!res.ok) {

      alert("Không thể cập nhật.");

      return;

    }

    onSaved();
  }

  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">

      <div className="w-full max-w-2xl rounded-[34px] border border-[#22345B] bg-[#08101F] p-8">

        <h2 className="text-3xl font-black">

          Edit User

        </h2>

        <p className="mt-2 text-gray-400">

          Chỉnh sửa thông tin tài khoản

        </p>

        <div className="mt-8 space-y-6">

          <div>

            <label className="mb-2 block text-sm text-gray-400">

              Full Name

            </label>

            <input
              value={form.name}
              onChange={(e)=>
                setForm({
                  ...form,
                  name:e.target.value,
                })
              }
              className="w-full rounded-2xl bg-[#0B1228] p-4 outline-none"
            />

          </div>

          <div>

            <label className="mb-2 block text-sm text-gray-400">

              Email

            </label>

            <input
              value={form.email}
              onChange={(e)=>
                setForm({
                  ...form,
                  email:e.target.value,
                })
              }
              className="w-full rounded-2xl bg-[#0B1228] p-4 outline-none"
            />

          </div>

          <div className="grid gap-6 md:grid-cols-2">

            <div>

              <label className="mb-2 block text-sm text-gray-400">

                Role

              </label>

              <select
                value={form.role}
                onChange={(e)=>
                  setForm({
                    ...form,
                    role:e.target.value,
                  })
                }
                className="w-full rounded-2xl bg-[#0B1228] p-4"
              >

                <option value="user">

                  User

                </option>

                <option value="moderator">

                  Moderator

                </option>

                <option value="admin">

                  Admin

                </option>

              </select>

            </div>

            <div>

              <label className="mb-2 block text-sm text-gray-400">

                Status

              </label>

              <select
                value={
                  form.banned
                    ? "banned"
                    : "active"
                }
                onChange={(e)=>
                  setForm({
                    ...form,
                    banned:
                      e.target.value==="banned",
                  })
                }
                className="w-full rounded-2xl bg-[#0B1228] p-4"
              >

                <option value="active">

                  Active

                </option>

                <option value="banned">

                  Banned

                </option>

              </select>

            </div>

          </div>

        </div>

        <div className="mt-10 flex justify-end gap-4">

          <button
            onClick={onClose}
            className="rounded-2xl border border-[#22345B] px-8 py-4 hover:bg-white/5"
          >

            Cancel

          </button>

          <button
            onClick={save}
            disabled={saving}
            className="rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 font-bold"

          >

            {saving
              ? "Saving..."
              : "Save Changes"}

          </button>

        </div>

      </div>

    </div>

  );

}