"use client";
import RichEditor from "./RichEditor";
import { useEffect, useRef, useState } from "react";

import Image from "next/image";

import {
    X,
    ImagePlus,
    FileText,
    MapPinned,
    Sparkles,
    SmilePlus,
    SendHorizontal,
    Globe,
    ChevronDown,
    Paperclip,
} from "lucide-react";
interface CreatePostModalProps {
    open: boolean;
    darkMode: boolean;

    title: string;
    content: string;
    category: string;
user: any;
images: File[];
setImages: React.Dispatch<React.SetStateAction<File[]>>;

    loading: boolean;

    onClose: () => void;
    onSubmit: () => void;

    setTitle: (v: string) => void;
    setContent: (v: string) => void;
    setCategory: (v: string) => void;
}   

export default function CreatePostModal({
    open,
    user,
    darkMode,
    title,
    content,
    category,
    loading,
    onClose,
    onSubmit,
    images,
    setImages,
    setTitle,   
    setContent,
    setCategory,
}: CreatePostModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);
const fileInputRef = useRef<HTMLInputElement>(null);
const [previews, setPreviews] = useState<string[]>([]);
useEffect(() => {
    const urls = images.map((file) =>
        URL.createObjectURL(file)
    );

    setPreviews(urls);

    return () => {
        urls.forEach((url) =>
            URL.revokeObjectURL(url)
        );
    };
}, [images]);
function handleChooseImage() {
    fileInputRef.current?.click();
}

function handleImageChange(
    e: React.ChangeEvent<HTMLInputElement>
) {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);

    setImages(files);
}

    useEffect(() => {
        function handleKey(e: KeyboardEvent) {
            if (e.key === "Escape") {
                onClose();
            }
        }

        if (open) {
            document.addEventListener("keydown", handleKey);

            document.body.style.overflow = "hidden";
        }

        return () => {
            document.removeEventListener(
                "keydown",
                handleKey
            );

            document.body.style.overflow = "auto";
        };
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div
            onClick={onClose}
            className="
fixed
inset-0
z-[999]
flex
items-center
justify-center
bg-black/45
backdrop-blur-md
animate-in
fade-in
duration-300
"
        >
            <div
                ref={modalRef}
                onClick={(e) => e.stopPropagation()}
                className={`
relative
w-[700px]
max-w-[92vw]
max-h-[90vh]
overflow-hidden
rounded-[28px]
shadow-2xl
transition-all
duration-300

${
    darkMode
        ? "bg-[#081B3A] border-[#214E88]"
        : "bg-white border-gray-200"
}
`}
            >
    {/* ================= HEADER ================= */}

<div
    className={`
flex
items-center
justify-between
border-b
px-8
py-6

${
    darkMode
        ? "border-[#1F467A]"
        : "border-gray-200"
}
`}
>
    <div>

        <h2
            className={`
text-2xl
font-black

${
    darkMode
        ? "text-white"
        : "text-gray-900"
}
`}
        >
            Tạo bài viết
        </h2>

        <p
            className={`
mt-1
text-sm

${
    darkMode
        ? "text-slate-400"
        : "text-gray-500"
}
`}
        >
            Chia sẻ kiến thức cùng cộng đồng GeoEduAI
        </p>

    </div>

    <button
        onClick={onClose}
        className={`
flex
h-11
w-11
items-center
justify-center
rounded-full
transition

${
    darkMode
        ? "hover:bg-[#153661]"
        : "hover:bg-gray-100"
}
`}
    >
        <X size={22}/>
    </button>

</div>
<div
    className="
max-h-[calc(90vh-170px)]
overflow-y-auto
px-0

scrollbar-thin
scrollbar-thumb-blue-500/40
scrollbar-track-transparent
"
>
{/* ================= USER ================= */}

<div className="px-8 pt-7">

    <div className="flex items-center gap-4">

        <Image
            src={user?.avatar_url || "/avatar.png"}
            width={60}
            height={60}
            alt="Avatar"
            className="
rounded-full
ring-4
ring-blue-500/20
"
        />

        <div className="flex-1">

            <div
                className={`
font-bold
text-lg

${
    darkMode
        ? "text-white"
        : "text-gray-900"
}
`}
            >
                {user?.full_name || "Người dùng"}
            </div>

            <button
                className={`
mt-2
flex
items-center
gap-2
rounded-full
px-4
py-2
text-sm
font-semibold
transition

${
    darkMode
        ? "bg-[#153661] text-slate-200 hover:bg-[#1A4376]"
        : "bg-blue-50 text-[#1565C0] hover:bg-blue-100"
}
`}
            >

                <Globe size={15}/>

                Công khai

                <ChevronDown size={16}/>

            </button>

        </div>

    </div>

</div>

{/* ================= TITLE ================= */}

<div className="px-8 pt-7">

    <input
        value={title}
        onChange={(e)=>setTitle(e.target.value)}
        placeholder="Tiêu đề bài viết..."

        className={`
w-full
rounded-2xl
border
px-6
py-5
text-2xl
font-bold
outline-none
transition

${
    darkMode
        ? `
bg-[#102A52]
border-[#234D82]
text-white
placeholder:text-slate-500
focus:border-blue-400
`
        :
`
bg-gray-50
border-gray-200
text-gray-900
placeholder:text-gray-400
focus:border-blue-500
`
}
`}
    />

</div>

{/* ================= CONTENT ================= */}

<div className="px-8 pt-6">

<RichEditor
    value={content}
    onChange={setContent}
    darkMode={darkMode}
/>
{previews.length > 0 && (

<div className="mt-6 flex flex-wrap gap-4">

{previews.map((preview,index)=>(

<div
key={index}
className="relative"
>

<Image
src={preview}
alt=""
width={150}
height={150}
className="h-40 w-40 rounded-2xl object-cover"
/>

<button

type="button"

onClick={()=>{
setImages(images.filter((_,i)=>i!==index));
}}

className="absolute right-2 top-2 rounded-full bg-red-600 px-2 py-1 text-white"

>

✕

</button>

</div>

))}

</div>

)}
</div>
{/* ================= TOOLBAR ================= */}

<div className="mt-7 px-8">
<input
    ref={fileInputRef}
    type="file"
    accept="image/*"
    multiple
    hidden
    onChange={handleImageChange}
/>
    <div
        className={`
rounded-3xl
border
p-5

${
    darkMode
        ? "border-[#214E88] bg-[#0D2447]"
        : "border-gray-200 bg-gray-50"
}
`}
    >

        <div className="flex flex-wrap items-center justify-between gap-5">

            <div className="flex flex-wrap items-center gap-3">

                {/* Upload ảnh */}

                <button
    onClick={handleChooseImage}
                    className={`
group
flex
items-center
gap-3
rounded-2xl
px-4
py-3
transition-all
duration-300

${
darkMode
?
"hover:bg-[#153661]"
:
"hover:bg-white"
}
`}
                >

                    <div
                        className="
flex
h-11
w-11
items-center
justify-center
rounded-xl
bg-blue-500/15
text-blue-500
transition
group-hover:scale-110
"
                    >
                        <ImagePlus size={22}/>
                    </div>

                    <div className="text-left">

                        <div className="font-semibold">
                            Ảnh
                        </div>

                        <div
                            className={
                                darkMode
                                    ? "text-xs text-slate-400"
                                    : "text-xs text-gray-500"
                            }
                        >
                            JPG PNG WEBP
                        </div>

                    </div>

                </button>

                {/* FILE */}

                <button
                    className={`
group
flex
items-center
gap-3
rounded-2xl
px-4
py-3
transition-all

${
darkMode
?
"hover:bg-[#153661]"
:
"hover:bg-white"
}
`}
                >

                    <div
                        className="
flex
h-11
w-11
items-center
justify-center
rounded-xl
bg-emerald-500/15
text-emerald-500
group-hover:scale-110
transition
"
                    >
                        <Paperclip size={22}/>
                    </div>

                    <div className="text-left">

                        <div className="font-semibold">
                            Tài liệu
                        </div>

                        <div
                            className={
                                darkMode
                                    ? "text-xs text-slate-400"
                                    : "text-xs text-gray-500"
                            }
                        >
                            PDF DOC PPT
                        </div>

                    </div>

                </button>

                {/* ATLAS */}

                <button
                    className={`
group
flex
items-center
gap-3
rounded-2xl
px-4
py-3
transition-all

${
darkMode
?
"hover:bg-[#153661]"
:
"hover:bg-white"
}
`}
                >

                    <div
                        className="
flex
h-11
w-11
items-center
justify-center
rounded-xl
bg-orange-500/15
text-orange-500
group-hover:scale-110
transition
"
                    >
                        <MapPinned size={22}/>
                    </div>

                    <div className="text-left">

                        <div className="font-semibold">
                            Atlas
                        </div>

                        <div
                            className={
                                darkMode
                                    ? "text-xs text-slate-400"
                                    : "text-xs text-gray-500"
                            }
                        >
                            Chèn bản đồ
                        </div>

                    </div>

                </button>

                {/* EMOJI */}

                <button
                    className={`
group
flex
items-center
gap-3
rounded-2xl
px-4
py-3
transition-all

${
darkMode
?
"hover:bg-[#153661]"
:
"hover:bg-white"
}
`}
                >

                    <div
                        className="
flex
h-11
w-11
items-center
justify-center
rounded-xl
bg-pink-500/15
text-pink-500
group-hover:scale-110
transition
"
                    >
                        <SmilePlus size={22}/>
                    </div>

                    <div className="text-left">

                        <div className="font-semibold">
                            Cảm xúc
                        </div>

                        <div
                            className={
                                darkMode
                                    ? "text-xs text-slate-400"
                                    : "text-xs text-gray-500"
                            }
                        >
                            Emoji
                        </div>

                    </div>

                </button>

            </div>

            {/* AI */}

            <button
                className="
group
flex
items-center
gap-3
rounded-2xl
bg-gradient-to-r
from-blue-600
to-cyan-500
px-6
py-4
font-bold
text-white
shadow-lg
transition-all
duration-300
hover:scale-105
hover:shadow-blue-500/40
"
            >

                <Sparkles
                    size={22}
                    className="group-hover:rotate-12 transition"
                />

                AI hỗ trợ

            </button>

        </div>

    </div>

</div>

{/* ================= CATEGORY ================= */}

<div className="px-8 pt-7">

    <div
        className={`
rounded-2xl
border
p-5

${
darkMode
?
"border-[#214E88] bg-[#102A52]"
:
"border-gray-200 bg-gray-50"
}
`}
    >

        <div
            className={
                darkMode
                    ? "mb-3 text-sm font-semibold text-slate-400"
                    : "mb-3 text-sm font-semibold text-gray-500"
            }
        >
            Chủ đề bài viết
        </div>

        <select
            value={category}
            onChange={(e)=>setCategory(e.target.value)}
            className={`
w-full
rounded-xl
border
px-5
py-4
outline-none

${
darkMode
?
"bg-[#081B3A] border-[#214E88] text-white"
:
"bg-white border-gray-200"
}
`}
        >

            <option>Thảo luận chung</option>

            <option>Địa lí tự nhiên</option>

            <option>Địa lí kinh tế</option>

            <option>Atlas Địa lí</option>

            <option>Luyện thi THPT</option>

            <option>Kinh nghiệm học tập</option>

        </select>

    </div>

</div>
{/* ================= FOOTER ================= */}

<div
    className={`
mt-8
border-t
px-8
py-6

${
    darkMode
        ? "border-[#214E88]"
        : "border-gray-200"
}
`}
>

    <div className="flex items-center justify-between">

        {/* LEFT */}

        <div className="space-y-1">

            <div
                className={`font-semibold ${
                    darkMode
                        ? "text-slate-200"
                        : "text-gray-700"
                }`}
            >
                Sẵn sàng chia sẻ?
            </div>

            <div
                className={`text-sm ${
                    darkMode
                        ? "text-slate-400"
                        : "text-gray-500"
                }`}
            >
                Hãy chia sẻ kiến thức hữu ích cho cộng đồng GeoEduAI.
            </div>

        </div>

        {/* RIGHT */}

        <div className="flex items-center gap-4">

            <button
                onClick={onClose}
                className={`
rounded-2xl
px-6
py-3
font-semibold
transition

${
darkMode
?
"bg-[#133462] text-white hover:bg-[#1A4376]"
:
"bg-gray-100 hover:bg-gray-200"
}
`}
            >
                Hủy
            </button>

            <button
                disabled={
                    loading ||
                    !title.trim() ||
                    !content.trim()
                }
                onClick={onSubmit}
                className="
group
flex
items-center
gap-3
rounded-2xl
bg-gradient-to-r
from-[#1565C0]
via-[#1E88E5]
to-[#42A5F5]
px-8
py-3
font-bold
text-white
shadow-xl
transition-all
duration-300
hover:scale-105
hover:shadow-blue-500/50
disabled:cursor-not-allowed
disabled:opacity-60
"
            >

                {loading ? (

                    <>

                        <div
                            className="
h-5
w-5
animate-spin
rounded-full
border-2
border-white
border-t-transparent
"
                        />

                        Đang đăng...

                    </>

                ) : (

                    <>

                        <SendHorizontal
                            size={20}
                            className="
transition
group-hover:translate-x-1
"
                        />

                        Đăng bài

                    </>

                )}

            </button>

        </div>

    </div>

</div>

</div>
</div>
</div>
);
}