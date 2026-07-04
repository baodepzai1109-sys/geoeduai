"use client";

import {
  Bot,
  Send,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { useState, useEffect, useRef } from "react";
import { useAtlat } from "@/context/AtlatContext";
import { atlatContext } from "@/data/atlatContext";
const suggestions = [
  "Giải thích trang này",
  "Phân tích bản đồ",
  "So sánh vùng",
  "Tạo câu hỏi ôn tập",
];

export default function AssistantPanel() {
  const { currentPage } = useAtlat();
  const context = atlatContext[currentPage] || "";
  const [message, setMessage] = useState("");

const [messages, setMessages] = useState<
{
role:"user"|"assistant";
content:string;
}[]
>([]);
const [loading, setLoading] = useState(false);
const bottomRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  bottomRef.current?.scrollIntoView({
    behavior: "smooth",
  });
}, [messages]);
async function sendMessage() {
  if (!message.trim() || loading) return;

  const userMessage = message.trim();

  setLoading(true);
  setMessage("");

  // Thêm câu hỏi của user
  setMessages((prev) => [
    ...prev,
    {
      role: "user",
      content: userMessage,
    },
  ]);
setMessages((prev) => [
  ...prev,
  {
    role: "assistant",
    content: "",
  },
]);
  const prompt = `
Bạn là trợ lý Atlat Việt Nam.

Người dùng đang xem trang ${currentPage}.

Thông tin trang:

${context}

Câu hỏi:

${userMessage}
`;
  console.log(prompt);
  // Chỗ này sau sẽ gọi OpenAI/Gemini
const response = await fetch("/api/assistant", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    currentPage,
    context,
    question: userMessage,
  }),
});
if (!response.ok) {
  const err = await response.json();
  console.log(err);
  throw new Error(err.error || "API Error");
}
const data = await response.json();

setMessages((prev) => {
  const list = [...prev];

  const index = list.findIndex(
    (m) =>
      m.role === "assistant" &&
      m.content === ""
  );

  if (index !== -1) {
    list[index] = {
      role: "assistant",
      content: data.answer,
    };
  }

  return list;
});

setLoading(false);
}
return (
    
    <aside className="flex h-full flex-col bg-[#0E1A2B]">

      {/* Header */}

      <div className="border-b border-slate-700 p-5">

        <div className="flex items-center gap-3">

<div className="relative h-14 w-14 overflow-hidden rounded-2xl">
  <Image
    src="/geoai-assistant.png"
    alt="GeoAI Assistant"
    fill
    className="object-cover"
    priority
  />
</div>

          <div>

            <h2 className="font-bold text-white">
              GeoAI Assistant
            </h2>

            <p className="text-xs text-slate-400">
              Đang xem trang {currentPage}
            </p>

          </div>

        </div>

      </div>

      {/* Chat */}

      <div className="flex-1 overflow-y-auto p-5">

        <div className="rounded-2xl bg-[#12263A] p-5">

          <div className="mb-3 flex items-center gap-2">

            <Sparkles
              size={18}
              className="text-cyan-400"
            />

            <span className="font-semibold text-white">
              Xin chào 👋
            </span>

          </div>

          <p className="text-sm leading-6 text-slate-300">

            Tôi có thể giúp bạn:

          </p>

          <ul className="mt-4 space-y-2 text-sm text-slate-400">

            <li>• Giải thích bản đồ</li>

            <li>• Phân tích số liệu</li>

            <li>• So sánh vùng</li>

            <li>• Tạo Quiz</li>

            <li>• Ôn thi THPT</li>

          </ul>

        </div>
<div className="mt-6 space-y-3">

  {messages.map((msg, index) => (
    
    <div
      key={index}
      className={`flex ${
        msg.role === "user"
          ? "justify-end"
          : "justify-start"
      }`}
    >
<div
  className={`max-w-[85%] rounded-2xl px-4 py-3 ${
    msg.role === "user"
      ? "bg-cyan-600 text-white"
      : "bg-[#081220] text-slate-200"
  }`}
>
  {msg.role === "assistant" && msg.content === "" ? (
  <div className="flex gap-1 px-1 py-2">
    <span className="h-2 w-2 animate-bounce rounded-full bg-cyan-400 [animation-delay:0ms]" />
    <span className="h-2 w-2 animate-bounce rounded-full bg-cyan-400 [animation-delay:150ms]" />
    <span className="h-2 w-2 animate-bounce rounded-full bg-cyan-400 [animation-delay:300ms]" />
  </div>
) : msg.role === "assistant" ? (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={{
        table: ({ children }) => (
  <div className="my-4 overflow-x-auto rounded-xl border border-slate-700">
    <table className="w-full border-collapse text-sm">
      {children}
    </table>
  </div>
),

thead: ({ children }) => (
  <thead className="bg-cyan-500/15">
    {children}
  </thead>
),

tbody: ({ children }) => (
  <tbody className="bg-[#081220]">
    {children}
  </tbody>
),

tr: ({ children }) => (
  <tr className="border-b border-slate-700 last:border-b-0">
    {children}
  </tr>
),

th: ({ children }) => (
  <th className="border-r border-slate-700 px-4 py-3 text-left font-semibold text-cyan-300 last:border-r-0">
    {children}
  </th>
),

td: ({ children }) => (
  <td className="border-r border-slate-700 px-4 py-3 align-top leading-7 text-slate-200 last:border-r-0">
    {children}
  </td>
),
        h1: ({ children }) => (
          <h1 className="mb-3 text-xl font-bold">
            {children}
          </h1>
        ),

        h2: ({ children }) => (
          <h2 className="mb-2 mt-4 text-lg font-semibold">
            {children}
          </h2>
        ),

        p: ({ children }) => (
          <p className="mb-3 leading-7">
            {children}
          </p>
        ),

        ul: ({ children }) => (
          <ul className="mb-3 list-disc space-y-1 pl-5">
            {children}
          </ul>
        ),

        ol: ({ children }) => (
          <ol className="mb-3 list-decimal space-y-1 pl-5">
            {children}
          </ol>
        ),

        li: ({ children }) => (
          <li>{children}</li>
        ),

        blockquote: ({ children }) => (
          <blockquote className="my-3 border-l-4 border-cyan-500 bg-cyan-500/10 px-4 py-2 italic">
            {children}
          </blockquote>
        ),

        strong: ({ children }) => (
          <strong className="font-bold text-cyan-300">
            {children}
          </strong>
        ),

        code: ({ children }) => (
          <code className="rounded bg-slate-700 px-1 py-0.5 text-cyan-300">
            {children}
          </code>
        ),
      }}
    >
      {msg.content}
    </ReactMarkdown>
  ) : (
    <p className="whitespace-pre-wrap">
      {msg.content.replace(/<br\s*\/?>/g, "\n")}
    </p>
  )}
</div>

    </div>

  ))}

  <div ref={bottomRef} />

</div>
        {/* Suggestions */}

        <div className="mt-6">

          <p className="mb-3 text-sm font-semibold text-white">
            Gợi ý
          </p>

          <div className="flex flex-wrap gap-2">

            {suggestions.map((item) => (

              <button
                key={item}
                onClick={() => setMessage(item)}
                className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300 transition hover:bg-cyan-500/20"
              >
                {item}
              </button>

            ))}

          </div>

        </div>

      </div>

      {/* Input */}

      <div className="border-t border-slate-700 p-4">

        <div className="flex items-center gap-2">

          <input
            value={message}
            onChange={(e) =>
              setMessage(e.target.value)
            }
            onKeyDown={(e) => {
  if (e.key === "Enter") {
    sendMessage();
  }
}}
            placeholder={
  loading
    ? "GeoAI đang trả lời..."
    : "Hỏi về trang Atlat này..."
}
            className="flex-1 rounded-xl border border-slate-700 bg-[#081220] px-4 py-3 text-sm text-white outline-none focus:border-cyan-400"
          />

          <button 
            onClick={sendMessage}
            disabled={loading}
            className={`rounded-xl p-3 transition ${
  loading
    ? "cursor-not-allowed bg-slate-600"
    : "bg-cyan-500 hover:bg-cyan-400"
}`}
          >
            <Send
              size={18}
              className="text-white"
            />
          </button>

        </div>

      </div>

    </aside>
  );
}