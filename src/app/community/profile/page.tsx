"use client";

import { useEffect, useState } from "react";
import useUser from "@/hooks/useUser";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

import {
  Camera,
  Pencil,
  Mail,
  FileText,
  Heart,
  Users,
  ShieldCheck,
  BadgeCheck,
} from "lucide-react";
export default function ProfilePage() {
    const { user } = useUser();

const [editing, setEditing] = useState(false);

const [name, setName] = useState("");

const [bio, setBio] = useState("");

const [postCount, setPostCount] = useState(0);

const [avatar, setAvatar] =
useState<File | null>(null);

const [saving, setSaving] =
useState(false);
useEffect(() => {
    if (!user) return;

    loadProfile();

}, [user]);

async function loadProfile() {

    if (!user) return;

    setName(user.full_name || "");

    setBio(user.bio || "");

    const { count } = await supabase
        .from("posts")
        .select("*", {
            count: "exact",
            head: true,
        })
        .eq("user_id", user.id);

    setPostCount(count || 0);

}
async function saveProfile() {

    if (!user) return;

    setSaving(true);

    let avatarUrl = user.avatar_url;

    if (avatar) {

        const ext = avatar.name.split(".").pop();

        const fileName =
            `${user.id}-${Date.now()}.${ext}`;

        const { error: uploadError } =
            await supabase.storage
                .from("avatars")
                .upload(fileName, avatar, {
                    upsert: true,
                });

        if (uploadError) {

            alert(uploadError.message);

            setSaving(false);

            return;

        }

        avatarUrl = supabase.storage
            .from("avatars")
            .getPublicUrl(fileName)
            .data.publicUrl;

    }

    const { error } =
        await supabase
            .from("profiles")
            .update({
                full_name: name,
                bio,
                avatar_url: avatarUrl,
            })
            .eq("id", user.id);

    setSaving(false);

    if (error) {

        alert(error.message);

        return;

    }

    alert("Đã cập nhật hồ sơ");

    setEditing(false);

    location.reload();

}
return (

<main className="min-h-screen bg-[#071A3B]">

<div className="mx-auto max-w-7xl px-4 py-6 md:px-8 lg:px-10">

{/* ================= COVER ================= */}

<div
className="
relative
overflow-hidden
rounded-[32px]
bg-gradient-to-r
from-[#071A3B]
via-[#0D2F61]
to-[#1565C0]
h-[220px]
md:h-[320px]
shadow-2xl
"
>

<div className="absolute inset-0 bg-black/10"/>

<div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-blue-500/20 blur-[120px]"/>

<div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-cyan-400/20 blur-[120px]"/>

</div>

{/* ================= PROFILE ================= */}

<div
className="
relative
-z-0
-mt-20
flex
flex-col
items-center
gap-6

md:flex-row
md:items-end
md:justify-between
px-4
md:px-10
"
>

<div
className="
flex
flex-col
items-center

md:flex-row
md:items-end
gap-6
"
>

<div className="relative">

<Image

src={user?.avatar_url || "/avatar.png"}

width={170}

height={170}

alt="avatar"

className="
h-36
w-36

md:h-[170px]
md:w-[170px]

rounded-full
border-[6px]
border-white
object-cover
shadow-2xl
"
/>

<button

className="
absolute
bottom-2
right-2
flex
h-11
w-11
items-center
justify-center
rounded-full
bg-[#1565C0]
text-white
shadow-xl
transition
hover:scale-110
"

>

<Camera size={18}/>

</button>

</div>

<div className="text-center md:text-left">

<div className="flex flex-wrap items-center justify-center md:justify-start gap-3">

<h1 className="text-3xl md:text-5xl font-black text-white">

{user?.full_name}

</h1>

<div
className="
flex
items-center
gap-2
rounded-full
bg-[#1565C0]
px-4
py-2
text-sm
font-bold
text-white
"
>

<ShieldCheck size={16}/>

GeoEduAI Member

</div>

</div>

<div
className="
mt-3
flex
items-center
justify-center
md:justify-start
gap-2
text-slate-300
"
>

<Mail size={18}/>

<span>

{user?.email}

</span>

</div>

</div>

</div>

<button

onClick={()=>{
setName(user?.full_name || "");
setBio(user?.bio || "");
setAvatar(null);
setEditing(true);
}}

className="
mt-4

md:mt-0

flex
items-center
gap-3

rounded-2xl

bg-gradient-to-r
from-[#1565C0]
to-[#42A5F5]

px-8
py-4

font-bold
text-white

shadow-xl

transition

hover:scale-105
"

>

<Pencil size={20}/>

Chỉnh sửa hồ sơ

</button>

</div>

{/* ================= DASHBOARD ================= */}

<div
className="
mt-10
grid
grid-cols-1
lg:grid-cols-3
gap-6
"
>
    {/* ================= GIỚI THIỆU ================= */}

<div
className="
rounded-[30px]
border
border-blue-900/50
bg-[#0B2248]
p-8
shadow-xl
"
>

<div className="flex items-center gap-3">

<div className="rounded-2xl bg-[#1565C0]/20 p-3">

<FileText
size={22}
className="text-[#64B5F6]"
/>

</div>

<div>

<h2 className="text-xl font-bold text-white">

Giới thiệu

</h2>

<p className="text-sm text-slate-400">

Thông tin cá nhân

</p>

</div>

</div>

<div
className="
mt-6
rounded-2xl
bg-[#102D5C]
p-6
leading-8
text-slate-300
"
>

{user?.bio || "Chưa có giới thiệu."}

</div>

<div className="mt-8 space-y-4">

<div className="flex items-center justify-between">

<span className="text-slate-400">

Tên hiển thị

</span>

<span className="font-semibold text-white">

{name}

</span>

</div>

<div className="flex items-center justify-between">


<span className="text-white">

{user?.email}

</span>

</div>

<div className="flex items-center justify-between">

<span className="text-slate-400">

Thành viên

</span>

<div
className="
flex
items-center
gap-2
rounded-full
bg-[#1565C0]
px-3
py-1
text-sm
font-semibold
text-white
"
>

<BadgeCheck size={16}/>

Đã xác minh

</div>

</div>

</div>

</div>

{/* ================= THỐNG KÊ ================= */}

<div
className="
rounded-[30px]
border
border-blue-900/50
bg-[#0B2248]
p-8
shadow-xl
"
>

<h2 className="text-xl font-bold text-white">

Thống kê

</h2>

<p className="mt-1 text-sm text-slate-400">

Hoạt động trên GeoEduAI

</p>

<div className="mt-8 grid gap-5">

<div
className="
rounded-2xl
bg-[#102D5C]
p-6
transition
hover:scale-[1.03]
"
>

<div className="flex items-center justify-between">

<FileText
size={26}
className="text-[#42A5F5]"
/>

<div
className="
text-4xl
font-black
text-white
"
>

{postCount}

</div>

</div>

<div className="mt-4 text-slate-400">

Bài viết

</div>

</div>

<div
className="
rounded-2xl
bg-[#102D5C]
p-6
transition
hover:scale-[1.03]
"
>

<div className="flex items-center justify-between">

<Heart
size={26}
className="text-pink-400"
/>

<div
className="
text-4xl
font-black
text-white
"
>

0

</div>

</div>

<div className="mt-4 text-slate-400">

Lượt thích

</div>

</div>

<div
className="
rounded-2xl
bg-[#102D5C]
p-6
transition
hover:scale-[1.03]
"
>

<div className="flex items-center justify-between">

<Users
size={26}
className="text-green-400"
/>

<div
className="
text-4xl
font-black
text-white
"
>

0

</div>

</div>

<div className="mt-4 text-slate-400">

Người theo dõi

</div>

</div>

</div>

</div>

{/* ================= THẺ THÀNH VIÊN ================= */}

<div
className="
rounded-[30px]
overflow-hidden
bg-gradient-to-br
from-[#1565C0]
via-[#1976D2]
to-[#42A5F5]
p-8
shadow-2xl
"
>

<div className="flex items-center justify-between">

<div>

<p className="text-blue-100">

GeoEduAI

</p>

<h2 className="mt-2 text-3xl font-black text-white">

Premium

</h2>

</div>

<ShieldCheck
size={42}
className="text-white"
/>

</div>

<div
className="
mt-10
rounded-2xl
bg-white/10
p-6
backdrop-blur-xl
"
>

<p className="text-sm text-blue-100">

Thành viên từ

</p>

<p className="mt-2 text-xl font-bold text-white">

2026

</p>

<hr className="my-6 border-white/20"/>

<p className="text-sm text-blue-100">

Trạng thái

</p>

<p className="mt-2 text-xl font-bold text-white">

GeoEduAI Member

</p>

</div>

<button

onClick={()=>{
setName(user?.full_name || "");
setBio(user?.bio || "");
setAvatar(null);
setEditing(true);
}}

className="
mt-8
w-full
rounded-2xl
bg-white
py-4
font-bold
text-[#1565C0]
transition
hover:scale-105
"

>

Chỉnh sửa hồ sơ

</button>

</div>

</div>

</div>
{editing && (

<div
className="
fixed
inset-0
z-[999]
flex
items-center
justify-center
bg-black/70
backdrop-blur-md
p-4
"
>

<div
className="
w-full
max-w-xl
overflow-hidden
rounded-3xl
border
border-blue-900
bg-[#081B3A]
shadow-[0_20px_80px_rgba(0,0,0,.45)]
"
>

{/* ================= HEADER ================= */}

<div
className="
flex
items-center
justify-between
border-b
border-blue-900
px-6
py-4
"
>

<div>

<h2 className="text-3xl font-black text-white">

Chỉnh sửa hồ sơ

</h2>

<p className="mt-1 text-slate-400">

Thông tin này sẽ hiển thị trên GeoEduAI

</p>

</div>

<button

onClick={()=>setEditing(false)}

className="
rounded-2xl
bg-[#133462]
px-5
py-3
text-white
transition
hover:bg-[#1B4D8F]
"

>

Đóng

</button>

</div>

{/* ================= BODY ================= */}

<div className="space-y-5 p-6">

{/* Avatar */}

<div className="flex flex-col items-center">

<div className="relative">

<Image

src={
avatar
? URL.createObjectURL(avatar)
: user?.avatar_url || "/avatar.png"
}

width={110}

height={110}

alt=""

className="
h-[110px]
w-[110px]
rounded-full
border-4
border-[#1565C0]
object-cover
shadow-xl
"
/>

<label
className="
absolute
bottom-2
right-2
cursor-pointer
rounded-full
bg-[#1565C0]
p-2
text-white
transition
hover:scale-110
"
>

<Camera size={16}/>

<input

hidden

type="file"

accept="image/*"

onChange={(e)=>{

if(e.target.files){

setAvatar(e.target.files[0]);

}

}}

/>

</label>

</div>

<p className="mt-4 text-sm text-slate-400">

Nhấn biểu tượng camera để đổi ảnh

</p>

</div>

{/* Name */}

<div>

<label className="mb-2 block font-semibold text-white">

Tên hiển thị

</label>

<input

value={name}

onChange={(e)=>setName(e.target.value)}

className="
w-full
rounded-2xl
border
border-blue-900
bg-[#10294F]
px-5
py-4
text-white
outline-none
transition
focus:border-[#42A5F5]
"

/>

</div>

{/* Bio */}

<div>

<label className="mb-2 block font-semibold text-white">

Giới thiệu

</label>

<textarea

rows={3}

value={bio}

onChange={(e)=>setBio(e.target.value)}

placeholder="Viết vài dòng giới thiệu..."

className="
w-full
rounded-2xl
border
border-blue-900
bg-[#10294F]
px-5
py-4
text-white
outline-none
transition
focus:border-[#42A5F5]
resize-none
"

/>

<div className="mt-2 text-right text-sm text-slate-400">

{bio.length}/300

</div>

</div>

</div>

{/* ================= FOOTER ================= */}

<div
className="
flex
justify-end
gap-4
border-t
border-blue-900
px-8
py-6
"
>

<button

onClick={()=>setEditing(false)}

className="
rounded-2xl
bg-[#133462]
px-7
py-3
font-semibold
text-white
transition
hover:bg-[#1A4376]
"

>

Hủy

</button>

<button

disabled={saving}

onClick={saveProfile}

className="
rounded-2xl
bg-gradient-to-r
from-[#1565C0]
to-[#42A5F5]
px-8
py-3
font-bold
text-white
shadow-xl
transition
hover:scale-105
disabled:opacity-50
"

>

{saving ? "Đang lưu..." : "Lưu thay đổi"}

</button>

</div>

</div>

</div>

)}
    </main>
  );
}