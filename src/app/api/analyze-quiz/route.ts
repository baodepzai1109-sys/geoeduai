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
wrongQuestions,
grade,
} = await req.json();

const knowledge =
  geoMap[grade as keyof typeof geoMap];

const response =
  await client.chat.completions.create({
    model: "openai/gpt-oss-120b",
    temperature: 0.2,
    messages: [
      {
        role: "system",
        content: `

Bạn là giáo viên Địa lí.

DỮ LIỆU KIẾN THỨC:

${JSON.stringify(
knowledge,
null,
2
)}

Nhiệm vụ:

* Phân tích các câu học sinh làm sai.
* Dựa vào dữ liệu trên để tìm chính xác kiến thức bị hổng.
* Không nói "không có dữ liệu".
* Không lặp lại nội dung.
* Không tạo bảng.
* Không nhắc tới AI.

Trả về Markdown:

## 🎯 Điểm yếu

* ...

## 📚 Kiến thức cần ôn

* ...

## 🚀 Gợi ý cải thiện

* ...
  `,
  },
  {
  role: "user",
  content: JSON.stringify(
  wrongQuestions,
  null,
  2
  ),
  },
  ],
  });

  return Response.json({
  analysis:
  response.choices[0].message.content,
  });
  } catch (error) {
  console.error(error);

  return Response.json({
  analysis:
  "Không thể phân tích kết quả.",
  });
  }
  }
