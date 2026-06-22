"use client";
import ReactMarkdown from "react-markdown";
import { useState, useRef } from "react";
type Question = {
  question: string;
  options: string[];
  answer: number;
  topic?: string;
};
export default function QuizPage() {
const [grade, setGrade] = useState("6");
const [analysis, setAnalysis] =
  useState("");
const [lesson, setLesson] = useState("bai1");
const [difficulty, setDifficulty] = useState("de");
const [count, setCount] = useState(10);
const [wrongQuestions, setWrongQuestions] =
  useState<string[]>([]);
const [questions, setQuestions] =
  useState<Question[]>([]);

const [current, setCurrent] =
  useState(0);

const [score, setScore] =
  useState(0);

const [wrongTopics, setWrongTopics] =
  useState<string[]>([]);

const [finished, setFinished] =
  useState(false);
const [selected, setSelected] =
  useState<number | null>(null);
const resultRef = useRef<HTMLDivElement>(null);
const [showResult, setShowResult] =
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

  console.log(data);

  setQuestions(data.questions);
  setCurrent(0);

  setScore(0);

  setWrongTopics([]);

  setFinished(false);
}
function checkAnswer(selectedIndex: number) {
  if (showResult) return;

  const q = questions[current];

  setSelected(selectedIndex);
  setShowResult(true);
  setTimeout(() => {
  resultRef.current?.scrollIntoView({
    behavior: "smooth",
    block: "center",
  });
}, 100);

  const correct =
    selectedIndex === q.answer;

  if (correct) {
    setScore((prev) => prev + 10);
  } else {
setWrongQuestions((prev) => [
  ...prev,
  q.question,
]);
  }
setTimeout(async () => {
  if (current + 1 >= questions.length) {

    const res = await fetch(
      "/api/analyze-quiz",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          wrongQuestions,
        }),
      }
    );

    const data = await res.json();

    setAnalysis(data.analysis);

    setFinished(true);

  } else {
    setCurrent((prev) => prev + 1);
  }

  setSelected(null);
  setShowResult(false);

}, 1200);
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
  rounded-[32px]
  border
  border-cyan-400/20
  bg-slate-900/50
  backdrop-blur-2xl
  p-8
  min-h-[350px]
  shadow-[0_0_40px_rgba(34,211,238,.08)]
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
  onClick={generateQuiz}
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
  {questions.length > 0 ? (
    finished ? (
      <div className="text-center">
    <h2
      className="
      text-7xl
      drop-shadow-[0_0_20px_rgba(34,211,238,.8)]
      font-black
      text-cyan-400
      "
    >
      🏆 {score} điểm
    </h2>

    <p className="mt-4 text-slate-300">
      Bạn trả lời đúng
      {" "}
      {score / 10}
      {" "}
      /
      {" "}
      {questions.length}
      câu
    </p>

    <div
      className="
      mt-8
      text-left
      rounded-2xl
      bg-slate-950/50
      p-6
      "
    >
      <h3
 className="
 text-xl
 font-bold
 mb-4
 text-cyan-400
 "
>
🧠 AI Phân tích kết quả
</h3>

<div
 className="
 whitespace-pre-line
 text-slate-300
 leading-8
 "
>
<div
  className="
  prose
  prose-invert
  max-w-none
  prose-headings:text-cyan-400
  prose-strong:text-white
  prose-li:text-slate-300
  prose-p:text-slate-300
  "
>
</div>
</div>

{wrongQuestions.length === 0 ? (
  <p className="text-green-400 text-lg">
    🎉 Xuất sắc! Bạn đã trả lời đúng toàn bộ câu hỏi.
  </p>
) : (
  <ReactMarkdown>
    {analysis}
  </ReactMarkdown>
)}
    </div>

  </div>
) : (
  <>

<div
  className="
  w-full
  h-4
  bg-slate-800
  rounded-full
  overflow-hidden
  mb-8
  border
  border-cyan-500/20
  "
>
      <div
        className="
        h-full
        bg-gradient-to-r
        from-cyan-400
        to-blue-600
        shadow-[0_0_20px_rgba(34,211,238,.8)]
        transition-all
        duration-500
        "
        style={{
          width: `${
            ((current + 1) /
              questions.length) *
            100
          }%`,
        }}
      />
    </div>

    <p className="text-cyan-400">
      Câu {current + 1} / {questions.length}
    </p>

    <h2
      className="
        text-3xl
        font-bold
        mt-4
        mb-8
        leading-relaxed
        text-white
      "
    >
      {questions[current]?.question}
    </h2>

    <div className="grid gap-4">

      {questions[current]?.options?.map(
        (
          option: string,
          index: number
        ) => (
          <button
            key={index}
            onClick={() =>
              checkAnswer(index)
            }
            className={`
p-4
rounded-2xl
border
text-left
transition-all
duration-300

${
  showResult &&
  index === questions[current].answer
    ? "bg-green-600 border-green-400 scale-105"
    : ""
}

${
  showResult &&
  selected === index &&
  index !== questions[current].answer
    ? "bg-red-600 border-red-400 animate-pulse"
    : ""
}

${
  !showResult
    ? "bg-slate-800/60 border-slate-700 hover:border-cyan-400 hover:bg-slate-700"
    : ""
}
`}
          >
            {option}
          </button>
        )
      )}

    </div>
{showResult && (
  <div className="mt-8">

    {selected === questions[current].answer ? (
      <div
        className="
        rounded-2xl
        bg-green-500/15
        border
        border-green-400/30
        p-5
        text-green-300
        text-center
        text-xl
        font-bold
        animate-bounce
        "
      >
        ✅ Chính xác! +10 điểm
      </div>
    ) : (
      <div
        className="
        rounded-2xl
        bg-red-500/15
        border
        border-red-400/30
        p-5
        text-center
        "
      >
        <div className="text-red-300 text-xl font-bold">
          ❌ Chưa chính xác
        </div>

        <div className="mt-3 text-green-300">
          Đáp án đúng:
          {" "}
          {
            questions[current].options[
              questions[current].answer
            ]
          }
        </div>
      </div>
    )}

  </div>
)}
  </>
)

) : ( <div
   className="
   h-full
   flex
   items-center
   justify-center
   text-slate-500
   "
 >
Câu hỏi Quiz sẽ xuất hiện ở đây </div>
)}
    </div>
  </div>
</main>
);
}
