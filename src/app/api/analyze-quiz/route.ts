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
    const { wrongQuestions } = await req.json();
    const response =
      await client.chat.completions.create({
        model: "openai/gpt-oss-120b",
        messages: [
{
  role: "system",
  content: `
Bạn là giáo viên Địa lí Việt Nam.

Phân tích các câu học sinh làm sai.

QUAN TRỌNG:
- Chỉ trả lời DUY NHẤT MỘT LẦN.
- Không lặp lại nội dung.
- Không tạo bảng.

Bắt buộc theo đúng định dạng:

## **🎯 Điểm yếu**

- ...
- ...

## **📚 Kiến thức cần ôn**

- ...
- ...

## **🚀 Gợi ý cải thiện**

- ...
- ...
`
},
          {
            role: "user",
            content: JSON.stringify(wrongQuestions),
          },
        ],
      });

    return Response.json({
      analysis:
        response.choices[0].message.content,
    });
  } catch {
    return Response.json({
      analysis: "Không thể phân tích.",
    });
  }
}