import OpenAI from "openai";
import provinceInfo from "@/data/provinceInfo.json";

const client = new OpenAI({
apiKey: process.env.GROQ_API_KEY,
baseURL: "https://api.groq.com/openai/v1",
});

export async function POST(req: Request) {
try {
const { question } = await req.json();

let context = "";

// Tìm tỉnh xuất hiện trong câu hỏi
const provinces = Object.keys(provinceInfo);

for (const province of provinces) {
  if (
    question
      .toLowerCase()
      .includes(province.toLowerCase())
  ) {
    context = JSON.stringify(
      provinceInfo[
        province as keyof typeof provinceInfo
      ],
      null,
      2
    );
    break;
  }
}

const response =
  await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",

    messages: [
      {
        role: "system",
        content: `

Bạn là GeoEdu AI.

Nhiệm vụ:

* Chuyên gia Địa lý Việt Nam.
* Trả lời bằng tiếng Việt.
* Trả lời dễ hiểu cho học sinh.
* Không bịa thông tin.
* Nếu có dữ liệu được cung cấp thì phải ưu tiên sử dụng.
* Nếu dữ liệu không có thì mới dùng kiến thức chung.

LUẬT BẮT BUỘC:

- Việt Nam hiện có 34 tỉnh/thành.
- Nếu người dùng hỏi:
  "Việt Nam có bao nhiêu tỉnh"
  "Việt Nam có bao nhiêu tỉnh thành"
  "Số tỉnh thành Việt Nam"

=> luôn trả lời:

"Việt Nam hiện có 34 tỉnh/thành phố."

DỮ LIỆU THAM KHẢO:

${context || "Không có dữ liệu địa phương phù hợp."}
`,
},
{
role: "user",
content: question,
},
],

    temperature: 0.2,
  });

return Response.json({
  answer:
    response.choices[0].message.content ??
    "Không có câu trả lời",
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
