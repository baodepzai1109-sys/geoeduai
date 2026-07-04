"use client";
import MaintenanceSwitch from "@/components/admin/MaintenanceSwitch";
import { supabase } from "@/lib/supabase";
import Card from "@/components/admin/Card";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Users,
  BrainCircuit,
  Globe2,
  Activity,
  TrendingUp,
  Server,
  Zap,
  ArrowRight,
  MessageSquare,
} from "lucide-react";

export default function AdminPage() {
  const [stats, setStats] = useState({
  users: 0,
  questions: 0,
  posts: 0,
  visitors: 0,
});
const router = useRouter();
const [loading, setLoading] = useState(true);
const [latestUsers, setLatestUsers] = useState<any[]>([]);
const [latestQuestions, setLatestQuestions] = useState<any[]>([]);
useEffect(() => {
  const loggedIn = localStorage.getItem("admin_logged_in");

  if (!loggedIn) {
    router.replace("/admin");
  } else {
    setLoading(false);
  }
}, [router]);
async function loadDashboard() {
  const users = await supabase
    .from("users")
    .select("*", {
      count: "exact",
      head: true,
    });

  const questions = await supabase
    .from("ai_questions")
    .select("*", {
      count: "exact",
      head: true,
    });

  const posts = await supabase
    .from("forum_posts")
    .select("*", {
      count: "exact",
      head: true,
    });

  const visitors = await supabase
    .from("visitors")
    .select("*", {
      count: "exact",
      head: true,
    });

  setStats({
    users: users.count ?? 0,
    questions: questions.count ?? 0,
    posts: posts.count ?? 0,
    visitors: visitors.count ?? 0,
  });
}
useEffect(() => {
  loadDashboard();

  const interval = setInterval(() => {
    loadDashboard();
  }, 5000);

  return () => clearInterval(interval);
}, []);
function Row({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
useEffect(() => {
  loadDashboard();
}, []);
  return (
    <div className="flex items-center justify-between border-b border-white/5 pb-3">

      <span className="text-gray-400">
        {title}
      </span>

      <span className="font-semibold">
        {value}
      </span>

    </div>
  );
}

function Progress({
  title,
  value,
  color,
}: {
  title: string;
  value: number;
  color: string;
}) {
  return (
    <div>

      <div className="mb-2 flex justify-between text-sm">

        <span>{title}</span>

        <span>{value}%</span>

      </div>

      <div className="h-2 rounded-full bg-white/5">

        <div
          className={`h-2 rounded-full ${color}`}
          style={{
            width: `${value}%`,
          }}
        />

      </div>

    </div>
  );
}
if (loading) {
  return (
    <div className="flex h-screen items-center justify-center bg-[#050816] text-white">
      Đang kiểm tra đăng nhập...
    </div>
  );
}
  return (
    <div className="space-y-8">

      {/* HERO */}

      <section className="relative overflow-hidden rounded-[32px] border border-blue-500/20 bg-gradient-to-br from-[#091224] via-[#0D1C3D] to-[#07101E] p-10">

        <div className="absolute -top-32 right-0 h-[350px] w-[350px] rounded-full bg-cyan-500/10 blur-[150px]" />

        <div className="absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-blue-500/10 blur-[150px]" />

        <div className="relative z-10 flex items-center justify-between">

          <div>

            <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-300">
              GeoEduAI Control Center
            </span>

            <h1 className="mt-6 text-6xl font-black leading-tight">

              Manage

              <br />

              Everything.

            </h1>

            <p className="mt-6 max-w-xl text-lg text-gray-300">

              Theo dõi AI, Analytics, Diễn đàn, Người dùng,
              Atlat và toàn bộ hệ thống GeoEduAI
              trong thời gian thực.

            </p>

            <div className="mt-10 flex gap-4">

              <button className="flex items-center gap-2 rounded-2xl bg-blue-600 px-7 py-4 font-semibold transition hover:bg-blue-500">

                Dashboard

                <ArrowRight size={18} />

              </button>

              <button className="rounded-2xl border border-white/10 bg-white/5 px-7 py-4 hover:bg-white/10">

                View Analytics

              </button>

            </div>

          </div>

          <div className="hidden xl:block">

            <div className="rounded-[30px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">

              <div className="text-gray-400">

                SYSTEM STATUS

              </div>

              <div className="mt-5 flex items-center gap-3 text-green-400">

                <Activity />

                All Systems Operational

              </div>

              <div className="mt-10 grid grid-cols-2 gap-8">

                <div>

                  <div className="text-gray-500">

                    Users Online

                  </div>

                  <div className="mt-2 text-5xl font-bold">

                    124

                  </div>

                </div>

                <div>

                  <div className="text-gray-500">

                    Uptime

                  </div>

                  <div className="mt-2 text-5xl font-bold">

                    99.99%

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* KPI */}

      <section className="grid gap-6 xl:grid-cols-4 md:grid-cols-2">

<Card
  title="Users"
  value={stats.users.toString()}
  icon={<Users size={26} />}
  change="+12%"
  progress={83}
/>

<Card
  title="AI Requests"
  value={stats.questions.toString()}
  icon={<BrainCircuit size={26} />}
  change="+35%"
  progress={92}
/>

<Card
  title="Visitors"
  value={stats.visitors.toString()}
  icon={<Globe2 size={26} />}
  change="+21%"
  progress={74}
/>

<Card
  title="Forum Posts"
  value={stats.posts.toString()}
  icon={<MessageSquare size={26} />}
  change="+8%"
  progress={68}
/>

      </section>
          {/* ANALYTICS */}

      <section className="grid gap-6 xl:grid-cols-3">

        {/* Traffic */}

        <div className="xl:col-span-2 rounded-[30px] border border-[#1D2A52] bg-[#0B1228]/80 p-8 backdrop-blur-xl">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-cyan-400">
                ANALYTICS
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                Traffic Overview
              </h2>

            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2">

              Last 24 Hours

            </div>

          </div>

          {/* Fake Chart */}

          <div className="mt-10 h-[340px] rounded-3xl border border-dashed border-blue-500/20 bg-gradient-to-br from-[#08111E] to-[#0C1833] p-8">

            <div className="flex h-full items-end gap-3">

              {[40, 65, 30, 80, 95, 55, 78, 96, 64, 88, 100, 72].map(
                (item, index) => (
                  <div
                    key={index}
                    className="flex-1 rounded-t-xl bg-gradient-to-t from-blue-600 to-cyan-400 transition-all hover:opacity-80"
                    style={{
                      height: `${item}%`,
                    }}
                  />
                )
              )}

            </div>

          </div>

        </div>

        {/* AI */}

        <div className="space-y-6">

          <div className="rounded-[30px] border border-[#1D2A52] bg-[#0B1228]/80 p-7">

            <div className="flex items-center gap-3">

              <BrainCircuit
                className="text-cyan-400"
                size={28}
              />

              <div>

                <h3 className="font-bold text-xl">

                  AI Monitor

                </h3>

                <p className="text-gray-400 text-sm">

                  GeoEduAI Engine

                </p>

              </div>

            </div>

            <div className="mt-8 space-y-5">

              <Row
                title="Model"
                value="GPT-5.5"
              />

              <Row
                title="Requests"
                value="58,291"
              />

              <Row
                title="Latency"
                value="1.2 s"
              />

              <Row
                title="Accuracy"
                value="92%"
              />

              <Row
                title="Queue"
                value="8 Active"
              />

            </div>

          </div>

          {/* Health */}

          <div className="rounded-[30px] border border-[#1D2A52] bg-[#0B1228]/80 p-7">

            <div className="flex items-center gap-3">

              <Zap
                className="text-yellow-400"
                size={26}
              />

              <h2 className="font-bold">

                System Health

              </h2>

            </div>

            <div className="mt-8 space-y-6">

              <Progress
                title="CPU"
                color="bg-cyan-400"
                value={26}
              />

              <Progress
                title="RAM"
                color="bg-green-400"
                value={63}
              />

              <Progress
                title="Storage"
                color="bg-orange-400"
                value={42}
              />

              <Progress
                title="Database"
                color="bg-blue-400"
                value={91}
              />

            </div>

          </div>

        </div>

      </section>
          {/* MAP + LIVE */}

      <section className="grid gap-6 xl:grid-cols-3">

        {/* Vietnam */}

        <div className="xl:col-span-2 rounded-[30px] border border-[#1D2A52] bg-[#0B1228]/80 p-8 backdrop-blur-xl">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-cyan-400 text-sm">
                VISITORS
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                Vietnam Traffic
              </h2>

            </div>

            <span className="rounded-full bg-blue-500/10 px-4 py-2 text-blue-300">
              Live
            </span>

          </div>

          <div className="mt-8 flex h-[420px] items-center justify-center rounded-3xl border border-dashed border-blue-500/20 bg-[#07101E]">

            <div className="text-center">

              <Globe2
                size={80}
                className="mx-auto text-blue-400"
              />

              <h3 className="mt-6 text-2xl font-bold">
                Vietnam Visitor Map
              </h3>

              <p className="mt-3 text-gray-400">

                Sau này sẽ thay bằng bản đồ SVG Việt Nam
                hiển thị lượt truy cập theo từng tỉnh.

              </p>

            </div>

          </div>

        </div>

        {/* Live */}

        <div className="rounded-[30px] border border-[#1D2A52] bg-[#0B1228]/80 p-8">

          <div className="flex items-center gap-3">

            <Activity
              className="text-green-400"
              size={28}
            />

            <div>

              <h2 className="font-bold text-2xl">

                Live Activity

              </h2>

              <p className="text-gray-400">

                Realtime

              </p>

            </div>

          </div>

          <div className="mt-8 space-y-5">

            {[
              "User hỏi Atlat Địa lí",
              "Forum có bài đăng mới",
              "AI trả lời thành công",
              "Admin cập nhật dữ liệu",
              "Maintenance OFF",
              "Có người đăng nhập",
              "Xuất báo cáo Analytics",
            ].map((item, index) => (

              <div
                key={index}
                className="flex items-start gap-4 rounded-2xl border border-white/5 bg-white/[0.03] p-4 transition hover:bg-white/[0.06]"
              >

                <div className="mt-2 h-3 w-3 rounded-full bg-green-400 animate-pulse" />

                <div>

                  <div className="font-medium">

                    {item}

                  </div>

                  <div className="mt-1 text-xs text-gray-500">

                    {index + 1} phút trước

                  </div>

                </div>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* RECENT QUESTIONS */}

      <section className="rounded-[30px] border border-[#1D2A52] bg-[#0B1228]/80 p-8">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-cyan-400 text-sm">
              AI
            </p>

            <h2 className="mt-2 text-3xl font-bold">

              Recent AI Questions

            </h2>

          </div>

          <button className="rounded-xl border border-white/10 px-4 py-2 hover:bg-white/5">

            View All

          </button>

        </div>

        <div className="mt-8 overflow-hidden rounded-2xl border border-white/5">

          <table className="w-full">

            <thead className="bg-white/5">

              <tr>

                <th className="p-4 text-left">
                  User
                </th>

                <th className="p-4 text-left">
                  Question
                </th>

                <th className="p-4 text-left">
                  Time
                </th>

                <th className="p-4 text-left">
                  Status
                </th>

              </tr>

            </thead>

            <tbody>

              {[
                "Atlat trang 15",
                "Đồng bằng sông Hồng",
                "Tây Nguyên có mấy tỉnh",
                "Địa hình Việt Nam",
                "Khí hậu Đông Bắc",
              ].map((q, i) => (

                <tr
                  key={i}
                  className="border-t border-white/5 hover:bg-white/[0.03]"
                >

                  <td className="p-4">

                    User {i + 1}

                  </td>

                  <td className="p-4">

                    {q}

                  </td>

                  <td className="p-4">

                    {i + 2} phút

                  </td>

                  <td className="p-4">

                    <span className="rounded-full bg-green-500/20 px-3 py-1 text-green-400">

                      Success

                    </span>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </section>
            {/* QUICK ACTIONS + USERS */}

      <section className="grid gap-6 xl:grid-cols-3">

        {/* Quick Actions */}

        <div className="xl:col-span-2 rounded-[30px] border border-[#1D2A52] bg-[#0B1228]/80 p-8">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-cyan-400 text-sm">
                CONTROL CENTER
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                Quick Actions
              </h2>

            </div>

          </div>

          <div className="mt-8 grid grid-cols-2 gap-5 lg:grid-cols-4">

            {[
              {
                title: "Users",
                icon: <Users size={34} />,
                color: "from-blue-500 to-cyan-500",
              },
              {
                title: "Analytics",
                icon: <TrendingUp size={34} />,
                color: "from-purple-500 to-pink-500",
              },
              {
                title: "AI Monitor",
                icon: <BrainCircuit size={34} />,
                color: "from-green-500 to-emerald-500",
              },
              {
                title: "Maintenance",
                icon: <Server size={34} />,
                color: "from-orange-500 to-red-500",
              },
              {
                title: "Forum",
                icon: <MessageSquare size={34} />,
                color: "from-indigo-500 to-blue-500",
              },
              {
                title: "Visitors",
                icon: <Globe2 size={34} />,
                color: "from-sky-500 to-cyan-500",
              },
              {
                title: "Activity",
                icon: <Activity size={34} />,
                color: "from-yellow-500 to-orange-500",
              },
              {
                title: "Settings",
                icon: <Zap size={34} />,
                color: "from-slate-500 to-gray-500",
              },
            ].map((item) => (

              <button
                key={item.title}
                className="group rounded-3xl border border-white/5 bg-white/[0.03] p-6 text-left transition-all duration-300 hover:-translate-y-2 hover:border-blue-500 hover:bg-white/[0.06] hover:shadow-[0_0_35px_rgba(59,130,246,.25)]"
              >

                <div
                  className={`inline-flex rounded-2xl bg-gradient-to-br ${item.color} p-4`}
                >
                  {item.icon}
                </div>

                <h3 className="mt-6 text-lg font-bold">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm text-gray-400">
                  Open {item.title}
                </p>

              </button>

            ))}

          </div>

        </div>

        {/* Online Users */}

        <div className="rounded-[30px] border border-[#1D2A52] bg-[#0B1228]/80 p-8">

          <h2 className="text-2xl font-bold">
            Online Users
          </h2>

          <p className="text-gray-400">
            Active now
          </p>

          <div className="mt-8 space-y-5">

            {[
              "Nguyễn Văn A",
              "Lê Minh",
              "Trần Hải",
              "Dương Thiên Bảo",
              "Admin",
            ].map((name, index) => (

              <div
                key={index}
                className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/[0.03] p-4"
              >

                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 font-bold">
                    {name.charAt(0)}
                  </div>

                  <div>

                    <div className="font-medium">
                      {name}
                    </div>

                    <div className="text-xs text-gray-500">
                      Online
                    </div>

                  </div>

                </div>

                <div className="h-3 w-3 rounded-full bg-green-400 animate-pulse" />

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* FOOTER */}

      <footer className="rounded-[30px] border border-[#1D2A52] bg-[#0B1228]/80 p-8">

        <div className="grid gap-8 md:grid-cols-4">

          <div>

            <div className="text-cyan-400 text-sm">
              VERSION
            </div>

            <div className="mt-3 text-3xl font-bold">
              v2.0.0
            </div>

          </div>

          <div>

            <div className="text-cyan-400 text-sm">
              FRAMEWORK
            </div>

            <div className="mt-3 text-3xl font-bold">
              Next.js 15
            </div>

          </div>

          <div>

            <div className="text-cyan-400 text-sm">
              DATABASE
            </div>

            <div className="mt-3 text-3xl font-bold">
              Supabase
            </div>

          </div>

          <div>

            <div className="text-cyan-400 text-sm">
              AI MODEL
            </div>

            <div className="mt-3 text-3xl font-bold">
              GPT-5.5
            </div>

          </div>

        </div>

        <div className="mt-8 border-t border-white/5 pt-6 text-center text-sm text-gray-500">

          © 2026 GeoEduAI Control Center • Built with ❤️ using Next.js & Tailwind CSS

        </div>

      </footer>

    </div>
  );
}