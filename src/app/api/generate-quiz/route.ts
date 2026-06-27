import OpenAI from "openai";

import geo6 from "@/data/geo6.json";
import geo7 from "@/data/geo7.json";
import geo8 from "@/data/geo8.json";
import geo9 from "@/data/geo9.json";
import geo10 from "@/data/geo10.json";
import geo11 from "@/data/geo11.json";
import geo12 from "@/data/geo12.json";
const client = new OpenAI({
apiKey: process.env.GROQ_API_KEY,
baseURL: "https://api.groq.com/openai/v1",
});

const geoMap = {
"6": geo6,
"7": geo7,
"8": geo8,
"9": geo9,
"10": geo10,
"11": geo11,
"12": geo12,
};

export async function POST(req: Request) {
try {
const {
grade,
lesson,
difficulty,
count,
} = await req.json();

const lessons =
  geoMap[grade as keyof typeof geoMap];

if (!Array.isArray(lessons)) {
  return Response.json(
    { error: "Dữ liệu lớp không hợp lệ." },
    { status: 400 }
  );
}

const lessonData = lessons[Number(lesson)];
if (!lessonData) {
  return Response.json(
    { error: "Không tìm thấy bài học." },
    { status: 400 }
  );
}
function getKnowledge(
  lessonData: any,
  difficulty: string
) {
  const maxFacts =
    difficulty === "de"
      ? 2
      : difficulty === "trungbinh"
      ? 3
      : 5;

  return lessonData.kienThucChinh
    .slice(0, maxFacts)
    .map((item: any) => item.noiDung);
}

const facts = getKnowledge(lessonData, difficulty);

const context = {
  lesson: lessonData.tenBai,
  keywords: lessonData.tuKhoa,
  facts,
};
const difficultyRule =
  difficulty === "de"
    ? `
Độ khó: Dễ.
- Mỗi câu chỉ kiểm tra 1 fact.
- Dạng nhận biết hoặc định nghĩa.
- Không suy luận.
`
    : difficulty === "trungbinh"
    ? `
Độ khó: Trung bình.
- Mỗi câu kết hợp đúng 2 facts.
- Yêu cầu hiểu và liên hệ đơn giản.
- Đáp án nhiễu hợp lí nhưng dễ phân biệt.
`
    : `
Độ khó: Khó.
- Mỗi câu kết hợp 2-3 facts.
- Không hỏi trực tiếp theo nguyên văn.
- Buộc người học phải phân tích hoặc suy luận từ các facts.
- Có thể yêu cầu so sánh, tổng hợp hoặc xác định mối liên hệ giữa các facts.
- Đáp án nhiễu phải hợp lí và gần đúng, nhưng chỉ có 1 đáp án chính xác.
- Không sử dụng kiến thức ngoài dữ liệu.
`;

const prompt = `
Bạn là AI tạo câu hỏi Địa lí.

Dữ liệu:
${JSON.stringify(context)}

Tạo đúng ${count} câu hỏi.

Quy tắc:
- Chỉ dùng dữ liệu trên.
- Không tự bổ sung kiến thức.
- Không lặp lại ý hỏi.
- Không sao chép nguyên văn.
- Viết lại bằng cách diễn đạt khác.
${difficultyRule}

Mỗi câu gồm:
- question
- options (4 đáp án)
- answer (0-3)
- topic = "${lessonData.tenBai}"

Chỉ trả về JSON Array.

Ví dụ:

[
  {
    "question":"...",
    "options":["A","B","C","D"],
    "answer":0,
    "topic":"${lessonData.tenBai}"
  }
]
`;

const response =
  await client.chat.completions.create({
    model: "openai/gpt-oss-120b",
    temperature: 0.2,
    messages: [
      {
        role: "system",
        content:
          "Bạn là giáo viên Địa lí. Chỉ trả về JSON hợp lệ.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

const text =
  response.choices[0].message.content
    ?.replace(/```json/g, "")
    .replace(/```/g, "")
    .trim() || "[]";
console.log("========== AI RAW ==========");
console.log(text);
console.log("============================");
let questions = [];

try {
  questions = JSON.parse(text);
} catch {
  return Response.json({
    questions: [],
    error: "AI trả về JSON lỗi"
  });
}
if (!Array.isArray(questions)){
  questions = [];
}

const shuffledQuestions = questions.map((q: any) => {
  if (
    !q ||
    !Array.isArray(q.options) ||
    typeof q.answer !== "number"
  ) {
    return null;
  }
  const correctAnswer = q.options[q.answer];

  const shuffledOptions = [...q.options].sort(
    () => Math.random() - 0.5
  );

  const newAnswer =
    shuffledOptions.indexOf(correctAnswer);

  return {
    ...q,
    options: shuffledOptions,
    answer: newAnswer,
  };
});
return Response.json({
  questions: shuffledQuestions,
});


} catch (error: any) {
console.error(error);

return Response.json(
  {
    error:
      error?.message ||
      "Lỗi tạo quiz",
  },
  {
    status: 500,
  }
);

}
}
