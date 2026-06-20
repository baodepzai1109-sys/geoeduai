"use client";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

(pdfMake as any).vfs = pdfFonts.vfs;
import { saveAs } from "file-saver";
import {
  Document,
  Packer,
  Paragraph,
  HeadingLevel,
  AlignmentType,
} from "docx";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
export default function TestPage() {
  const [grade, setGrade] = useState("6");
  const [lesson, setLesson] = useState("bai1");
  const [count, setCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [showWordMenu, setShowWordMenu] = useState(false);
  const [showPdfMenu, setShowPdfMenu] = useState(false);
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
            count,
          }),
        }
      );

      const data = await res.json();

      setResult(data.answer);
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

  const doc = new Document({
  sections: [
    {
      children: [

  new Paragraph({
    text: "TRƯỜNG: .................................................",
  }),

  new Paragraph({
    text: "LỚP: .....................",
  }),

  new Paragraph({
    text: "HỌ VÀ TÊN: .................................................",
  }),

  new Paragraph(""),

  new Paragraph({
    text: "ĐỀ KIỂM TRA ĐỊA LÍ",
    heading: HeadingLevel.HEADING_1,
    alignment: AlignmentType.CENTER,
  }),

  new Paragraph({
    text: "Thời gian làm bài: ........ phút",
    alignment: AlignmentType.CENTER,
  }),

  new Paragraph({
    text: "────────────────────────────────────────",
    alignment: AlignmentType.CENTER,
  }),

        new Paragraph(""),

        ...removeAnswer(result)
  .split("\n")
  .map(
    (line) =>
      new Paragraph({
        text: line,
      })
  )
      ],
    },
  ],
});

  const blob = await Packer.toBlob(doc);

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "de-kiem-tra.docx";
  a.click();

  URL.revokeObjectURL(url);
}
function downloadPDF() {
  if (!result) return;

  const docDefinition: any = {
    content: [
  {
    text: "TRƯỜNG: ........................................",
    margin: [0, 0, 0, 5],
  },

  {
    text: "LỚP: .....................",
    margin: [0, 0, 0, 5],
  },

  {
    text: "HỌ VÀ TÊN: ........................................",
    margin: [0, 0, 0, 15],
  },

  {
    text: "ĐỀ KIỂM TRA ĐỊA LÍ",
    style: "title",
  },

  {
    text: "Thời gian làm bài: ........ phút",
    alignment: "center",
    margin: [0, 0, 0, 15],
  },

  {
  canvas: [
    {
      type: "line",
      x1: 0,
      y1: 5,
      x2: 500,
      y2: 5,
      lineWidth: 1,
    },
  ],
  margin: [0, 10, 0, 15],
},

...removeAnswer(result)
  .replace(/###/g, "")
  .split("\n")
  .map((line) => {
    if (line.startsWith("Câu")) {
      return {
        text: line,
        style: "question",
        margin: [0, 10, 0, 4],
      };
    }

    return {
      text: line,
      margin: [0, 2, 0, 2],
    };
  })
],

styles: {
  title: {
    fontSize: 20,
    bold: true,
    alignment: "center",
    color: "#1d4ed8",
  },

  question: {
    bold: true,
    fontSize: 12,
  },
}
  };

  pdfMake
    .createPdf(docDefinition)
    .download("de-kiem-tra.pdf");
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

      <div className="relative z-10 max-w-5xl mx-auto p-8">

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
          <div className="grid md:grid-cols-3 gap-5">

            {/* Khối */}
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
                border-blue-500/20
                rounded-2xl
                px-4
                py-3
                "
              >
                <option value="6">
                  Địa lí 6
                </option>

                <option value="7">
                  Địa lí 7
                </option>

                <option value="8">
                  Địa lí 8
                </option>

                <option value="9">
                  Địa lí 9
                </option>

                <option value="10">
                  Địa lí 10
                </option>

                <option value="11">
                  Địa lí 11
                </option>

                <option value="12">
                  Địa lí 12
                </option>
              </select>
            </div>

            {/* Bài */}
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
                border-blue-500/20
                rounded-2xl
                px-4
                py-3
                "
              >
                <option value="bai1">
                  Bài 1
                </option>

                <option value="bai2">
                  Bài 2
                </option>

                <option value="bai3">
                  Bài 3
                </option>
              </select>
            </div>

            {/* Số câu */}
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
                border-blue-500/20
                rounded-2xl
                px-4
                py-3
                "
              >
                <option value={10}>
                  10 câu
                </option>

                <option value={20}>
                  20 câu
                </option>

                <option value={30}>
                  30 câu
                </option>

                <option value={40}>
                  40 câu
                </option>
              </select>
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
        <div
          className="
          mt-8

          rounded-3xl
          border
          border-blue-500/20

          bg-slate-900/40
          backdrop-blur-xl

          p-8

          max-w-4xl
          mx-auto
          "
        >
          {result ? (
            <div
              className="
  prose
  prose-invert
  max-w-none
  whitespace-pre-wrap
  prose-headings:text-blue-300
  prose-strong:text-cyan-300
"
            >

              <ReactMarkdown
  remarkPlugins={[remarkGfm]}
>
  {result
    .replace(/Câu\s+(\d+)/g, "\n\n Câu $1\n")
    .replace(/A\./g, "\nA.")
    .replace(/B\./g, "\nB.")
    .replace(/C\./g, "\nC.")
    .replace(/D\./g, "\nD.")
    .replace(/ĐÁP ÁN/g, "\n\n ĐÁP ÁN\n")}
</ReactMarkdown>
            </div>
          ) : (
            <div
              className="
              h-full
              flex
              items-center
              justify-center

              text-slate-500
              "
            >
              Đề kiểm tra sẽ xuất hiện ở đây
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
