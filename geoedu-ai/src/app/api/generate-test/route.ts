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

export async function POST(req: Request) {
try {
const {
grade,
lesson,
count,
} = await req.json();

let data: any;

switch (grade) {
  case "Địa lí 6":
    data = geo6;
    break;

  case "Địa lí 7":
    data = geo7;
    break;

  case "Địa lí 8":
    data = geo8;
    break;

  case "Địa lí 9":
    data = geo9;
    break;

  case "Địa lí 10":
    data = geo10;
    break;

  case "Địa lí 11":
    data = geo11;
    break;

  case "Địa lí 12":
    data = geo12;
    break;

  default:
    data = geo6;
}

const lessonData =
  data[lesson] ||
  JSON.stringify(data);

const response =
  await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",

    messages: [
      {
        role: "system",
        content: `

Bạn là giáo viên Địa lí Việt Nam.

CHỈ được sử dụng dữ liệu được cung cấp.

Không tự bịa kiến thức.

Tạo đề kiểm tra rõ ràng bằng Markdown.
KHÔNG dùng:
#
##
###
****
---
Mẫu:


Câu 1

Nội dung câu hỏi

A. ...
B. ...
C. ...
D. ...

Câu 2

...

ĐÁP ÁN

| Câu | Đáp án |
| --- | ------ |
| 1   | B      |
| 2   | A      |
 `,

      },

      {
        role: "user",
        content: `

Khối: ${grade}

Bài học: ${lesson}

Số câu: ${count}

Dữ liệu bài học:

${JSON.stringify(
lessonData,
null,
2
)}

Hãy tạo ${count} câu trắc nghiệm.
`,
},
],

    temperature: 0.3,
  });

return Response.json({
  answer:
    response.choices[0]
      .message.content ??
    "Không tạo được đề",
});

} catch (error: any) {
console.error(error);

return Response.json({
  answer:
    error?.message ||
    "Đã xảy ra lỗi",
});

}
}
