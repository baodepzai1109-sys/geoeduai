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

const prompt = `

Bạn là giáo viên Địa lí.

CHỈ được tạo câu hỏi từ dữ liệu dưới đây.

DỮ LIỆU:

Tên bài:
${lessonData.tenBai}

Kiến thức chính:
${lessonData.kienThucChinh
  .map((k:any)=>"- "+k.noiDung)
  .join("\n")}

Từ khóa:
${lessonData.tuKhoa.join(", ")}

Yêu cầu:

* Chỉ sử dụng kiến thức trong dữ liệu.
* Không tự bổ sung kiến thức bên ngoài.
* Tạo ${count} câu hỏi trắc nghiệm.
ĐỘ KHÓ:
${
difficulty === "de"
? `
ĐỘ KHÓ DỄ:
- Chỉ hỏi nhận biết.
- Đáp án đúng rất rõ ràng.
- Không cần suy luận.
- Chủ yếu học thuộc kiến thức.
`
: difficulty === "trungbinh"
? `
ĐỘ KHÓ TRUNG BÌNH:
- Cần hiểu nội dung bài học.
- Có đáp án gây nhiễu nhẹ.
- Có thể phải so sánh giữa các khái niệm.
`
: difficulty === "kho"
? `
ĐỘ KHÓ KHÓ:
- Kết hợp nhiều ý trong bài.
- Đáp án rất giống nhau.
- Cần phân tích trước khi chọn.
- Có câu hỏi vận dụng.
`
: difficulty === "sieukho"
? `
ĐỘ KHÓ SIÊU KHÓ:
- Không hỏi học thuộc lòng đơn thuần.
- Bắt buộc suy luận từ dữ liệu.
- Kết hợp nhiều kiến thức trong bài.
- Đáp án nhiễu rất mạnh.
- Có thể xuất hiện câu hỏi phủ định.
- Có thể xuất hiện câu hỏi so sánh.
- Có thể xuất hiện câu hỏi tình huống.
- Tạo các phương án sai nhưng hợp lý.
- Chỉ học sinh nắm rất chắc kiến thức mới dễ đạt trên 80%.
`
:""
}
* Mỗi câu có 4 đáp án.
* Chỉ có 1 đáp án đúng.
* topic phải ghi đúng tên bài.

Trả về JSON hợp lệ:

[
{
"question":"...",
"options":["A","B","C","D"],
"answer":0,
"topic":"..."
}
]

KHÔNG giải thích.
KHÔNG markdown.
KHÔNG code block.
CHỈ JSON.
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
const questions = JSON.parse(text);

const shuffledQuestions = questions.map((q: any) => {
  const correctAnswer = q.options[q.answer];

  const shuffledOptions = [...q.options]
    .sort(() => Math.random() - 0.5);

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
