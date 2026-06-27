"use client";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import geo6 from "@/data/geo6.json";
import geo7 from "@/data/geo7.json";
import geo8 from "@/data/geo8.json";
import geo9 from "@/data/geo9.json";
import geo10 from "@/data/geo10.json";
import geo11 from "@/data/geo11.json";
import geo12 from "@/data/geo12.json";
(pdfMake as any).vfs = pdfFonts.vfs;
import { saveAs } from "file-saver";
import {
  Document,
  Packer,
  Paragraph,
  HeadingLevel,
  AlignmentType,
} from "docx";
import { useEffect } from "react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
function cleanText(text: string) {
  return text
    .replace(/A\./g, "\nA.")
    .replace(/B\./g, "\nB.")
    .replace(/C\./g, "\nC.")
    .replace(/D\./g, "\nD.");
}
export default function TestPage() {
  const [grade, setGrade] = useState("6");
  const [lesson, setLesson] = useState("");
  const [questionTypes, setQuestionTypes] = useState({
  multiple: true,
  trueFalse: false,
  shortAnswer: false,
  essay: false,
});
const [questionCountByType, setQuestionCountByType] = useState({
  multiple: 10,
  trueFalse: 0,
  shortAnswer: 0,
  essay: 0,
});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [showWordMenu, setShowWordMenu] = useState(false);
  const [showPdfMenu, setShowPdfMenu] = useState(false);
 const geoMap: Record<string, any> = {
  "6": geo6,
  "7": geo7,
  "8": geo8,
  "9": geo9,
  "10": geo10,
  "11": geo11,
  "12": geo12,
};

const currentLessons = geoMap[grade] || [];
useEffect(() => {
  if (currentLessons.length > 0 && !lesson) {
    setLesson(currentLessons[0].tenBai);
  }
}, [grade]);
  async function generateTest() {
    function removeAnswer(text: string) {
  const index = text.indexOf("ĐÁP ÁN");

  if (index === -1) return text;

  return text.substring(0, index);
}
    setLoading(true);

    try {
      const res = await fetch(
        "/api/generate-test",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
          grade,
          lesson,
          questionTypes,
          questionCountByType,
        }),
        }
      );

const data = await res.json();
setResult(
  typeof data.answer === "string"
    ? JSON.parse(data.answer)
    : data.answer
);
    } catch {
      setResult(
        "Không thể tạo đề kiểm tra."
      );
    }

    setLoading(false);
  }
    function removeAnswer(text: string) {
  const index = text.indexOf("ĐÁP ÁN");

  if (index === -1) return text;

  return text.substring(0, index);
}
async function downloadWord() {
  if (!result) return;

  const allQuestions = result;

const mcqParagraphs =
  (allQuestions.mcq || []).flatMap((q: any, i: number) => {
    const question = q?.question ?? "Không có câu hỏi";

    const opt = q?.options ?? {};

    return [
      new Paragraph({
        text: `Câu ${i + 1}: ${question}`,
      }),
      new Paragraph({
        text: `A. ${opt.A ?? ""}`,
      }),
      new Paragraph({
        text: `B. ${opt.B ?? ""}`,
      }),
      new Paragraph({
        text: `C. ${opt.C ?? ""}`,
      }),
      new Paragraph({
        text: `D. ${opt.D ?? ""}`,
      }),
      new Paragraph({ text: "" }),
    ];
  });
const tfParagraphs =
  (allQuestions.trueFalse || []).flatMap((q: any, i: number) => [
    new Paragraph({ text: `Câu Đ/S ${i + 1}: ${q.question}` }),
    ...((q.items || []).map((it: string) =>
      new Paragraph({ text: `- ${it}` })
    )),
    new Paragraph({ text: "" }),
  ]);

const saParagraphs =
  (allQuestions.shortAnswer || []).map((q: any, i: number) =>
    new Paragraph({ text: `Câu TL ${i + 1}: ${q.question}` })
  );

const essayParagraphs =
  (allQuestions.essay || []).map((q: any, i: number) =>
    new Paragraph({ text: `Câu TL ${i + 1}: ${q.question}` })
  );
  const tfText =
    allQuestions.trueFalse?.map((q: any, i: number) => {
      return [
        `Câu Đ/S ${i + 1}: ${q.question}`,
        ...q.items.map((it: string) => `- ${it}`),
        ""
      ].join("\n");
    }).join("\n") || "";

  const saText =
    allQuestions.shortAnswer?.map((q: any, i: number) =>
      `Câu TL ${i + 1}: ${q.question}\n`
    ).join("\n") || "";

  const essayText =
    allQuestions.essay?.map((q: any, i: number) =>
      `Câu NL ${i + 1}: ${q.question}\n`
    ).join("\n") || "";

  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            text: "TRƯỜNG THPT ................................",
          }),
          new Paragraph({
            text: "LỚP: ............",
          }),
          new Paragraph({
            text: "HỌ VÀ TÊN: ................................",
          }),

          new Paragraph(""),

          new Paragraph({
            text: "ĐỀ KIỂM TRA ĐỊA LÍ",
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
          }),

          new Paragraph({
            text: "Thời gian: 45 phút",
            alignment: AlignmentType.CENTER,
          }),

          new Paragraph(""),

          
        ...mcqParagraphs,

          // TRUE/FALSE
          ...tfParagraphs,

          // SHORT ANSWER
          ...saParagraphs,

          // ESSAY
          ...essayParagraphs,

          new Paragraph(""),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "de-thi-dia-li.docx";
  a.click();

  URL.revokeObjectURL(url);
}
function downloadPDF() {
  if (!result) return;

  const allQuestions = result;

  const content: any[] = [];

  content.push(
    { text: "TRƯỜNG THPT ................................", margin: [0, 0, 0, 5] },
    { text: "LỚP: ............", margin: [0, 0, 0, 5] },
    { text: "HỌ VÀ TÊN: ................................", margin: [0, 0, 0, 10] },

    {
      text: "ĐỀ KIỂM TRA ĐỊA LÍ",
      style: "header",
      alignment: "center",
      margin: [0, 0, 0, 10],
    }
  );

  // MCQ
  allQuestions.mcq?.forEach((q: any, i: number) => {
    content.push({
      text: `Câu ${i + 1}: ${q.question}`,
      margin: [0, 10, 0, 5],
    });

    content.push({
      ul: [
        `A. ${q.options.A}`,
        `B. ${q.options.B}`,
        `C. ${q.options.C}`,
        `D. ${q.options.D}`,
      ],
    });
  });

  // TrueFalse
  allQuestions.trueFalse?.forEach((q: any, i: number) => {
    content.push({
      text: `Câu Đ/S ${i + 1}: ${q.question}`,
      margin: [0, 10, 0, 5],
    });

    content.push({
      ul: q.items,
    });
  });

  // Answer
  content.push({
    text: "\nĐÁP ÁN",
    bold: true,
    margin: [0, 20, 0, 10],
  });

  content.push({
    text: JSON.stringify(allQuestions, null, 2),
    fontSize: 8,
  });

  const docDefinition: any = {
    content,
    styles: {
      header: {
        fontSize: 18,
        bold: true,
      },
    },
  };

  pdfMake.createPdf(docDefinition).download("de-thi.pdf");
}
  return (
    <main
      className="
      min-h-screen
      bg-gradient-to-br
      from-slate-950
      via-[#071a3b]
      to-slate-950
      text-white
      overflow-hidden
      "
    >
      {/* Glow */}
      <div
        className="
        fixed
        top-0
        left-1/2
        -translate-x-1/2

        w-[900px]
        h-[500px]

        bg-blue-600/20
        blur-[180px]

        pointer-events-none
        "
      />

      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 sm:px-10 py-10">

        {/* Header */}
        <div
          className="
          rounded-3xl
          border
          border-blue-500/20

          bg-slate-900/50
          backdrop-blur-xl

          p-8
          shadow-[0_0_40px_rgba(59,130,246,.15)]
          "
        >
          <h1
            className="
            text-5xl
            font-black

            bg-gradient-to-r
            from-white
            via-blue-300
            to-cyan-400

            bg-clip-text
            text-transparent
            "
          >
             AI Tạo Đề Kiểm Tra
          </h1>

          <p
            className="
            mt-3
            text-slate-400
            "
          >
            Tạo đề kiểm tra tự động bằng AI
            dựa trên dữ liệu SGK Địa lí.
          </p>
        </div>

        {/* Control Panel */}
        <div
          className="
          mt-8

          rounded-3xl
          border
          border-blue-500/20

          bg-slate-900/40
          backdrop-blur-xl

          p-8
          "
        >
         <div className="grid grid-cols-1 gap-5">

<div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full items-stretch">

  {/* KHỐI */}
  <div
    className="
p-6 rounded-2xl
w-full
min-h-[140px]

bg-slate-900/40
border border-blue-500/20
backdrop-blur-xl

shadow-[0_0_30px_rgba(59,130,246,0.18)]
hover:border-blue-400/40
transition
    "
  >
    <label className="text-slate-300 text-sm font-medium">
      Khối học
    </label>

    <select
      value={grade}
      onChange={(e) => setGrade(e.target.value)}
      className="
      mt-3 w-full
      px-4 py-3
      rounded-xl
      bg-slate-950
      border border-blue-500/30
      text-white
      focus:outline-none
      focus:border-cyan-400
      transition
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

  {/* BÀI HỌC */}
  <div
    className="
p-6 rounded-2xl
w-full
min-h-[140px]

bg-slate-900/40
border border-cyan-500/20
backdrop-blur-xl

shadow-[0_0_30px_rgba(0,255,255,0.10)]
hover:border-cyan-400/40
transition
    "
  >
    <label className="text-slate-300 text-sm font-medium">
      Bài học
    </label>

    <select
      value={lesson}
      onChange={(e) => setLesson(e.target.value)}
      className="
      mt-3 w-full
      px-4 py-3
      rounded-xl
      bg-slate-950
      border border-cyan-500/30
      text-white
      focus:outline-none
      focus:border-cyan-400
      transition
      "
    >
      {currentLessons.map((item: any) => (
        <option key={item.tenBai} value={item.tenBai}>
          {item.tenBai}
        </option>
      ))}
    </select>
  </div>

</div>
<div className="md:col-span-3 mt-4">
  <label className="text-slate-300 text-sm font-semibold">
    Loại câu hỏi + số lượng
  </label>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">

    {/* MCQ */}
    <div>
<label className="
flex items-center gap-3
p-3 rounded-xl
bg-slate-900/60
border border-blue-500/20
hover:border-blue-400/40
transition
">
        <input
          type="checkbox"
          checked={questionTypes.multiple}
          onChange={(e) =>
            setQuestionTypes({
              ...questionTypes,
              multiple: e.target.checked,
            })
          }
        />
        Trắc nghiệm
      </label>

      {questionTypes.multiple && (
        <input
          type="number"
          value={questionCountByType.multiple}
          onChange={(e) =>
            setQuestionCountByType({
              ...questionCountByType,
              multiple: Number(e.target.value),
            })
          }
          className="
mt-2 w-full
px-3 py-2
rounded-xl
bg-slate-950
border border-blue-500/30
text-white
focus:outline-none
focus:border-cyan-400
transition
"
        />
      )}
    </div>

    {/* TRUE FALSE */}
    <div>
      <label className="
flex items-center gap-3
p-3 rounded-xl
bg-slate-900/60
border border-blue-500/20
hover:border-blue-400/40
transition
">
        <input
          type="checkbox"
          checked={questionTypes.trueFalse}
          onChange={(e) =>
            setQuestionTypes({
              ...questionTypes,
              trueFalse: e.target.checked,
            })
          }
        />
        Đúng / Sai
      </label>

      {questionTypes.trueFalse && (
        <input
          type="number"
          value={questionCountByType.trueFalse}
          onChange={(e) =>
            setQuestionCountByType({
              ...questionCountByType,
              trueFalse: Number(e.target.value),
            })
          }
          className="
mt-2 w-full
px-3 py-2
rounded-xl
bg-slate-950
border border-blue-500/30
text-white
focus:outline-none
focus:border-cyan-400
transition
"
        />
      )}
    </div>

    {/* SHORT */}
    <div>
<label className="
flex items-center gap-3
p-3 rounded-xl
bg-slate-900/60
border border-blue-500/20
hover:border-blue-400/40
transition
">
        <input
          type="checkbox"
          checked={questionTypes.shortAnswer}
          onChange={(e) =>
            setQuestionTypes({
              ...questionTypes,
              shortAnswer: e.target.checked,
            })
          }
        />
        Trả lời ngắn
      </label>

      {questionTypes.shortAnswer && (
        <input
          type="number"
          value={questionCountByType.shortAnswer}
          onChange={(e) =>
            setQuestionCountByType({
              ...questionCountByType,
              shortAnswer: Number(e.target.value),
            })
          }
          className="
mt-2 w-full
px-3 py-2
rounded-xl
bg-slate-950
border border-blue-500/30
text-white
focus:outline-none
focus:border-cyan-400
transition
"
        />
      )}
    </div>

    {/* ESSAY */}
    <div>
<label className="
flex items-center gap-3
p-3 rounded-xl
bg-slate-900/60
border border-blue-500/20
hover:border-blue-400/40
transition
">
        <input
          type="checkbox"
          checked={questionTypes.essay}
          onChange={(e) =>
            setQuestionTypes({
              ...questionTypes,
              essay: e.target.checked,
            })
          }
        />
        Tự luận
      </label>

      {questionTypes.essay && (
        <input
          type="number"
          value={questionCountByType.essay}
          onChange={(e) =>
            setQuestionCountByType({
              ...questionCountByType,
              essay: Number(e.target.value),
            })
          }
          className="
mt-2 w-full
px-3 py-2
rounded-xl
bg-slate-950
border border-blue-500/30
text-white
focus:outline-none
focus:border-cyan-400
transition
"
        />
      )}
    </div>

  </div>
</div>
          </div>

          <button
            onClick={generateTest}
            disabled={loading}
            className="
            mt-8

            px-8
            py-4

            rounded-2xl

            bg-gradient-to-r
            from-blue-600
            to-cyan-500

            font-bold

            hover:scale-105

            transition-all
            duration-300

            shadow-[0_0_25px_rgba(59,130,246,.5)]
            "
          >
            {loading
              ? "Đang tạo đề..."
              : "Tạo đề kiểm tra"}
          </button>
        </div>
                <div className="flex gap-4 mt-4">

  <button
    onClick={downloadWord}
    disabled={!result}
    className="
    flex
    items-center
    gap-3

    px-6
    py-3

    rounded-2xl

    bg-blue-950/60
    border
    border-blue-500/20

    hover:border-blue-400/50
    hover:bg-blue-900/60

    transition-all

    disabled:opacity-50
    "
  >
    {/* Logo Word */}
    <img
  src="/word-logo.png"
  alt="Word"
  className="w-8 h-8"
/>

    <span className="font-semibold">
      Tải Word
    </span>
  </button>
<button
  onClick={downloadPDF}
  disabled={!result}
  className="
  flex
  items-center
  gap-3

  px-6
  py-3

  rounded-2xl

  bg-red-950/60
  border
  border-red-500/20

  hover:border-red-400/50
  hover:bg-red-900/60

  transition-all

  disabled:opacity-50
  "
>
<img
  src="/pdf-logo.png"
  alt="Word"
  className="w-8 h-8"
/>

  <span className="font-semibold">
    Tải PDF
  </span>
</button>
</div>
        {/* Result */}
{/* Result */}
<div className="mt-8 w-full rounded-3xl border border-blue-500/20 bg-slate-900/40 backdrop-blur-xl p-8">

  {result ? (
    <div className="space-y-6">

      {/* MCQ */}
      {result.mcq?.map((q: any, i: number) => (
<div className="p-5 border border-slate-700 rounded-xl w-full">

  <p className="font-bold mb-3 whitespace-pre-wrap break-words leading-relaxed">
    Câu {i + 1}: {q.question}
  </p>

  <div className="ml-4 flex flex-col gap-1">
    {Object.entries(q.options).map(([key, value]: any) => (
      <p
        key={key}
        className="whitespace-pre-wrap break-words"
      >
        {key}. {value}
      </p>
    ))}
  </div>

  <p className="text-green-400 mt-3">
    Đáp án: {["A","B","C","D"][q.answer]}
  </p>

</div>
      ))}

      {/* True/False */}
      {result.trueFalse?.map((q: any, i: number) => (
        <div key={i} className="p-4 border border-slate-700 rounded-xl">
          <p className="font-bold">{q.question}</p>

          <div className="ml-4 mt-2">
            {q.items.map((item: string, idx: number) => (
              <p key={idx}>
                {item} → {String(q.answer[idx])}
              </p>
            ))}
          </div>
        </div>
      ))}

      {/* Short Answer */}
      {result.shortAnswer?.map((q: any, i: number) => (
        <div key={i} className="p-4 border border-slate-700 rounded-xl">
          <p>{q.question}</p>
          <p className="text-green-400">Đáp án: {q.answer}</p>
        </div>
      ))}

      {/* Essay */}
      {result.essay?.map((q: any, i: number) => (
        <div key={i} className="p-4 border border-slate-700 rounded-xl">
          <p className="font-bold">{q.question}</p>
          <p className="text-blue-300 mt-2">Gợi ý: {q.hint}</p>
        </div>
      ))}

    </div>
  ) : (
    <div className="text-slate-500 text-center">
      Đề kiểm tra sẽ xuất hiện ở đây
    </div>
  )}

</div>

      </div>
    </main>
  );
}
