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

CHỈ sử dụng dữ liệu dưới đây để tạo câu hỏi.

=====================
DỮ LIỆU
=====================

Tên bài:
${lessonData.tenBai}

Kiến thức:
${lessonData.kienThucChinh.map((k:any)=>"- " + k.noiDung).join("\n")}

Từ khóa:
${lessonData.tuKhoa.join(", ")}

=====================
YÊU CẦU BẮT BUỘC
=====================

- Tạo đúng ${count} câu hỏi trắc nghiệm
- Mỗi câu có đúng 4 đáp án
- Chỉ 1 đáp án đúng
- answer là số (0–3)
- topic luôn là tên bài
- KHÔNG được thêm thông tin ngoài dữ liệu
- KHÔNG giải thích
- KHÔNG markdown
- CHỈ trả về JSON hợp lệ
- Không được có chữ ngoài JSON
- Nếu không chắc, vẫn phải tạo đủ ${count} câu

=====================
QUY TẮC QUAN TRỌNG
=====================

- Không được lặp lại cùng một ý hỏi giữa các câu
- Mỗi câu hỏi phải khác cách diễn đạt
- Không được copy nguyên câu từ dữ liệu
- Phải tự biến đổi cách hỏi

=====================
ĐỘ KHÓ (PHÂN BIỆT RÕ RÀNG)
=====================

${difficulty === "de"
? `
DỄ:
- Chỉ hỏi 1 ý duy nhất trong dữ liệu
- Câu hỏi dạng nhận biết hoặc định nghĩa
- Không kết hợp nhiều thông tin
- Không yêu cầu suy luận
- Câu hỏi phải ngắn và trực tiếp
`
: difficulty === "trungbinh"
? `
TRUNG BÌNH:
- Kết hợp 2 ý trong dữ liệu để hỏi
- Yêu cầu hiểu nội dung bài học
- Có nhiễu nhẹ giữa các đáp án
- Có thể so sánh hoặc liên hệ đơn giản
`
: `
KHÓ:
- Kết hợp từ 2 đến 3 ý khác nhau trong bài
- Câu hỏi yêu cầu phân tích hoặc suy luận nhẹ
- Không được hỏi trực tiếp từ một dòng kiến thức
- Phải biến đổi cách hỏi (không được giống EASY hoặc MEDIUM)
- Đáp án gây nhiễu nhưng vẫn rõ ràng
- Tuyệt đối không vượt ngoài dữ liệu
`
}

=====================
FORMAT BẮT BUỘC
=====================

Trả về đúng JSON array:

[
  {
    "question": "string",
    "options": ["A","B","C","D"],
    "answer": 0,
    "topic": "${lessonData.tenBai}"
  }
]

=====================
QUY TẮC CUỐI
=====================
- Sử dụng 100% Tiếng Việt
- Không giải thích
- Không markdown
- Không thêm text ngoài JSON
- Nếu không đủ dữ liệu thì vẫn phải tạo đủ câu hỏi
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
