
"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
export default function AIPage() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [messages, setMessages] = useState<
    {
      role: string;
      text: string;
    }[]
  >([]);
  const [showMenu, setShowMenu] =
  useState(false);
  useEffect(() => {
  const saved = localStorage.getItem(
    "geoedu-history"
  );

  if (saved) {
    setHistory(JSON.parse(saved));
  }
}, []);

useEffect(() => {
  localStorage.setItem(
    "geoedu-history",
    JSON.stringify(history)
  );
}, [history]);

  async function askAI() {
    if (!question.trim() || loading) return;
const q = question.trim();

setHistory((prev) => {
  const next = [
    q,
    ...prev.filter((item) => item !== q),
  ];

  return next.slice(0, 20);
});


    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: q,
      },
    ]);

    setQuestion("");
    setLoading(true);

    try {
      const res = await fetch("/api/geo-ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: q,
        }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: data.answer,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Đã xảy ra lỗi.",
        },
      ]);
    }

    setLoading(false);
  }

  return (
    <main className="h-screen bg-slate-950 text-white flex overflow-hidden">

{/* Sidebar */}
<div
  className="
  hidden
  md:flex

  w-72

  border-r
  border-blue-500/20
  bg-slate-950

  p-5
  flex-col
  "
>
  <h1 className="text-2xl font-black text-blue-400">
    GeoEdu AI
  </h1>

  <p className="mt-2 text-sm text-slate-400">
    Trợ lý Địa lý Việt Nam
  </p>

  <div
  className="
  mt-8
  flex
  items-center
  justify-between
  "
>
  <h2 className="text-sm font-semibold text-slate-300">
    Lịch sử tìm kiếm
  </h2>

  <div className="relative">

    <button
      onClick={() =>
        setShowMenu(!showMenu)
      }
      className="
      w-8
      h-8
      rounded-lg
      hover:bg-slate-800
      transition
      "
    >
      ⋯
    </button>

    {showMenu && (
      <div
        className="
        absolute
        right-0
        top-10

        w-48

        bg-slate-900
        border
        border-blue-500/20

        rounded-xl

        overflow-hidden

        shadow-xl
        z-50
        "
      >

        <button
          onClick={() => {
            localStorage.removeItem(
              "geoedu-history"
            );

            setHistory([]);
            setShowMenu(false);
          }}
          className="
          w-full
          text-left
          px-4
          py-3

          hover:bg-slate-800
          text-red-400
          "
        >
          Xóa toàn bộ lịch sử
        </button>

        <button
          onClick={() =>
            setShowMenu(false)
          }
          className="
          w-full
          text-left
          px-4
          py-3

          hover:bg-slate-800
          "
        >
          Đóng
        </button>

      </div>
    )}

  </div>
</div>

  <div
    className="
    mt-4
    flex-1
    overflow-y-auto
    space-y-2
    "
  >
    {history.length === 0 && (
      <p className="text-slate-500 text-sm">
        Chưa có lịch sử
      </p>
    )}

    {history.map((item, index) => (
      <button
        key={index}
        onClick={() => setQuestion(item)}
        className="
        w-full
        text-left
        p-3
        rounded-xl
        bg-slate-900
        border
        border-blue-500/10
        hover:bg-slate-800
        hover:border-blue-400/30
        transition
        text-sm
        "
      >
        {item}
      </button>
    ))}
  </div>
</div>

<div className="md:hidden absolute top-4 left-4 z-50">
  <button
    onClick={() => setShowMenu(!showMenu)}
    className="
    bg-slate-900
    border
    border-blue-500/20
    px-3
    py-2
    rounded-xl
    "
  >
    ☰
  </button>
  {showMenu && (
  <div
    className="
    fixed
    inset-0
    bg-black/50
    z-30
    md:hidden
    "
    onClick={() => setShowMenu(false)}
  />
)}
  {showMenu && (
    
  <div
    className="
    md:hidden

    fixed
    inset-y-0
    left-0

    w-72

    bg-slate-950
    border-r
    border-blue-500/20

    z-40
    p-5
    "
  >
    <div className="flex items-center justify-between">
  <h2 className="text-xl font-bold text-blue-400">
    Lịch sử tìm kiếm
  </h2>

  <button
    onClick={() => setShowMenu(false)}
    className="
    w-8
    h-8
    rounded-lg
    hover:bg-slate-800
    "
  >
    ✕
  </button>
</div>
<button
  onClick={() => {
    localStorage.removeItem("geoedu-history");
    setHistory([]);
    setShowMenu(false);
  }}
  className="
  mt-4
  w-full

  bg-red-600/20
  border
  border-red-500/30

  text-red-400

  py-2
  rounded-xl

  hover:bg-red-600/30
  transition
  "
>
  Xóa toàn bộ lịch sử
</button>
    <div className="mt-4 space-y-2">
      {history.map((item, index) => (
        <button
          key={index}
          onClick={() => {
            setQuestion(item);
            setShowMenu(false);
          }}
          className="
          w-full
          text-left
          p-3
          rounded-xl
          bg-slate-900
          "
        >
          {item}
        </button>
      ))}
    </div>
  </div>
)}
</div>
      {/* Chat */}
      <div className="flex-1 flex flex-col">

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">

          <div className="max-w-5xl mx-auto px-6 py-6">

            {messages.length === 0 && !loading && (
              <div className="text-center mt-28">

                <h2 className="text-2xl md:text-4xl font-black">
                   GeoEdu AI
                </h2>

                <p className="mt-3 text-slate-400">
                  Hỏi bất kỳ điều gì về Địa lý Việt Nam
                </p>

              </div>
            )}

            {messages.map((m, i) => (
              <div
                key={i}
                className={
                  m.role === "user"
                    ? "flex justify-end mb-5 animate-fadeIn"
                    : "flex justify-start mb-5 animate-fadeIn"
                }
              >
                <div
                  className={
                    m.role === "user"
                      ? `
                        max-w-[90%] md:max-w-[520px]
                        bg-blue-600
                        px-4
                        py-3
                        rounded-2xl
                        text-sm
                        shadow-lg
                      `
                      : `
                        max-w-[90%] md:max-w-[700px]
                        bg-slate-900
                        border
                        border-blue-500/20
                        px-4
                        py-3
                        rounded-2xl
                        text-sm
                        shadow-lg
                      `
                  }
                >
                  <div
                    className="
                    prose
                    prose-invert
                    max-w-none
                    text-sm
                    leading-6
                    prose-p:my-2
                    prose-li:my-1
                    "
                  >
                    <ReactMarkdown>
                      {m.text}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">

                <div
                  className="
                  bg-slate-900
                  border
                  border-blue-500/20
                  rounded-2xl
                  px-4
                  py-3
                  "
                >
                  <div className="typing">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>

              </div>
            )}

          </div>

        </div>

        {/* Input */}
        <div
          className="
          border-t
          border-blue-500/20
          p-4
          "
        >
          <div
  className="
  max-w-5xl
  mx-auto

  flex

  gap-2
  md:gap-3

  px-2
  "
>

            <input
              value={question}
              onChange={(e) =>
                setQuestion(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  askAI();
                }
              }}
              placeholder="Hỏi về địa lý Việt Nam..."
              className="
              flex-1
              rounded-xl
              bg-slate-900
              border
              border-blue-500/20
              px-4
              py-3
              text-sm
              outline-none
              "
            />

            <button
              onClick={askAI}
              disabled={loading}
              className="
              w-12
              h-12
              rounded-xl
              bg-blue-600
              hover:bg-blue-500
              transition
              flex
              items-center
              justify-center
              text-lg
              "
            >
              ➜
            </button>

          </div>
        </div>

      </div>

    </main>
  );
}
