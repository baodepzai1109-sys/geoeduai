"use client";

import { useState } from "react";

export default function QuizPage() {
const [grade, setGrade] = useState("6");
const [lesson, setLesson] = useState("bai1");
const [difficulty, setDifficulty] = useState("de");
const [count, setCount] = useState(10);
const [questions, setQuestions] =
  useState<any[]>([]);

const [current, setCurrent] =
  useState(0);

const [score, setScore] =
  useState(0);

const [wrongTopics, setWrongTopics] =
  useState<string[]>([]);

const [finished, setFinished] =
  useState(false);
  async function generateQuiz() {
  const res = await fetch(
    "/api/generate-quiz",
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        grade,
        lesson,
        difficulty,
        count,
      }),
    }
  );

  const data = await res.json();

  setQuestions(data.questions);

  setCurrent(0);

  setScore(0);

  setWrongTopics([]);

  setFinished(false);
}
return ( <main
   className="
   min-h-screen
   bg-gradient-to-br
   from-slate-950
   via-[#071a3b]
   to-slate-950
   text-white
   "
 > <div
     className="
     fixed
     top-0
     left-1/2
     -translate-x-1/2
     w-[900px]
     h-[500px]
     bg-cyan-500/10
     blur-[180px]
     pointer-events-none
     "
   />

  <div className="relative z-10 max-w-6xl mx-auto p-8">

    <div
      className="
      rounded-3xl
      border
      border-cyan-500/20
      bg-slate-900/50
      backdrop-blur-xl
      p-8
      "
    >
      <h1
        className="
        text-5xl
        font-black
        bg-gradient-to-r
        from-white
        via-cyan-300
        to-blue-400
        bg-clip-text
        text-transparent
        "
      >
        Quiz Địa Lí
      </h1>

      <p className="mt-3 text-slate-400">
        Luyện tập kiến thức Địa lí bằng AI với hệ thống
        chấm điểm và đánh giá năng lực tự động.
      </p>
    </div>

    <div
      className="
      mt-8
      rounded-3xl
      border
      border-cyan-500/20
      bg-slate-900/40
      backdrop-blur-xl
      p-8
      "
    >
      <h2 className="font-bold text-xl mb-6">
        Thiết lập Quiz
      </h2>

      <div className="grid md:grid-cols-4 gap-5">

        <div>
          <label className="text-slate-300 text-sm">
            Khối
          </label>

          <select
            value={grade}
            onChange={(e) =>
              setGrade(e.target.value)
            }
            className="
            mt-2
            w-full
            bg-slate-950
            border
            border-cyan-500/20
            rounded-2xl
            px-4
            py-3
            "
          >
            <option value="6">Địa lí 6</option>
            <option value="7">Địa lí 7</option>
            <option value="8">Địa lí 8</option>
            <option value="9">Địa lí 9</option>
            <option value="10">Địa lí 10</option>
            <option value="11">Địa lí 11</option>
            <option value="12">Địa lí 12</option>
          </select>
        </div>

        <div>
          <label className="text-slate-300 text-sm">
            Bài học
          </label>

          <select
            value={lesson}
            onChange={(e) =>
              setLesson(e.target.value)
            }
            className="
            mt-2
            w-full
            bg-slate-950
            border
            border-cyan-500/20
            rounded-2xl
            px-4
            py-3
            "
          >
            <option value="bai1">Bài 1</option>
            <option value="bai2">Bài 2</option>
            <option value="bai3">Bài 3</option>
          </select>
        </div>

        <div>
          <label className="text-slate-300 text-sm">
            Độ khó
          </label>

          <select
            value={difficulty}
            onChange={(e) =>
              setDifficulty(e.target.value)
            }
            className="
            mt-2
            w-full
            bg-slate-950
            border
            border-cyan-500/20
            rounded-2xl
            px-4
            py-3
            "
          >
            <option value="de">
              Dễ
            </option>

            <option value="trungbinh">
              Trung bình
            </option>

            <option value="kho">
              Khó
            </option>

            <option value="sieukho">
              Siêu khó
            </option>
          </select>
        </div>

        <div>
          <label className="text-slate-300 text-sm">
            Số câu
          </label>

          <select
            value={count}
            onChange={(e) =>
              setCount(
                Number(e.target.value)
              )
            }
            className="
            mt-2
            w-full
            bg-slate-950
            border
            border-cyan-500/20
            rounded-2xl
            px-4
            py-3
            "
          >
            <option value={10}>10 câu</option>
            <option value={20}>20 câu</option>
            <option value={30}>30 câu</option>
            <option value={40}>40 câu</option>
          </select>
        </div>

      </div>

      <button
        className="
        mt-8
        px-8
        py-4
        rounded-2xl
        bg-gradient-to-r
        from-cyan-500
        to-blue-600
        font-bold
        hover:scale-105
        transition-all
        shadow-[0_0_30px_rgba(34,211,238,.4)]
        "
      >
        🚀 Bắt đầu Quiz
      </button>
    </div>

    <div
      className="
      mt-8
      rounded-3xl
      border
      border-cyan-500/20
      bg-slate-900/40
      backdrop-blur-xl
      p-8
      min-h-[300px]
      "
    >
      <div
        className="
        h-full
        flex
        items-center
        justify-center
        text-slate-500
        "
      >
        Câu hỏi Quiz sẽ xuất hiện ở đây
      </div>
    </div>

  </div>
</main>

);
}
