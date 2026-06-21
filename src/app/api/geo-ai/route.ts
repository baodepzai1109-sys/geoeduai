import OpenAI from "openai";
import provinceInfo from "@/data/provinceInfo.json";

const client = new OpenAI({
apiKey: process.env.GROQ_API_KEY,
baseURL: "https://api.groq.com/openai/v1",
});

export async function POST(req: Request) {
try {
const { question } = await req.json();
const q = normalizeText(question);
function normalizeText(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .trim();
}
const context = JSON.stringify(
  provinceInfo,
  null,
  2
);
const response =
  await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",

    messages: [
      {
        role: "system",
        content: `

Bạn là GeoEdu AI.

Nhiệm vụ:

- Chuyên gia Địa lý Việt Nam.
- Trả lời bằng tiếng Việt.
- Trả lời dễ hiểu.
- Không bịa thông tin.
- Ưu tiên dữ liệu được cung cấp.

Quy tắc:

1. Hiểu các câu hỏi viết thiếu dấu.
2. Hiểu câu hỏi không có dấu hỏi.
3. Hiểu cách diễn đạt khác nhau.

Ví dụ:

"Bạc Liêu sáp nhập từ đâu"
"Bạc Liêu được sáp nhập từ tỉnh nào"
"Tỉnh nào tạo thành Bạc Liêu"

=> cùng một ý.

"Việt Nam có bao nhiêu sông"
"VN có mấy con sông"
"Số lượng sông ở Việt Nam"

=> cùng một ý.

4. Nếu dữ liệu chứa câu trả lời thì phải dùng dữ liệu đó.

5. Nếu dữ liệu không có thì dùng kiến thức địa lý chính xác.

6. Nếu người dùng hỏi:
- Việt Nam có bao nhiêu tỉnh
- Việt Nam có bao nhiêu tỉnh thành
- Số tỉnh thành Việt Nam

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
