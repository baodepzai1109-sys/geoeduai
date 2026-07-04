import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});
console.log(process.env.GROQ_API_KEY);
export async function POST(req: Request) {
  try {
    const {
      currentPage,
      context,
      question,
    } = await req.json();

    const prompt = `
Bạn là GeoAI Assistant.

Bạn chỉ được sử dụng dữ liệu Atlat dưới đây để trả lời.

====================

Trang Atlat:
${currentPage}

Thông tin:

${context}

====================

Câu hỏi:

${question}

====================

Yêu cầu:

- Trả lời bằng tiếng Việt.
- Nếu câu hỏi liên quan đến trang hiện tại thì chỉ dùng dữ liệu trên.
- Nếu thiếu dữ liệu hãy nói rõ.
- Không tự bịa.
- Trả lời dễ hiểu.
- Có thể dùng bullet.
`;

    const response =
      await client.chat.completions.create({
        model: "openai/gpt-oss-120b",
        temperature: 0.2,
        messages: [
          {
            role: "system",
            content:
              "Bạn là giáo viên Địa lí Việt Nam.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      });
console.log(response);
    return Response.json({
      answer:
        response.choices[0].message.content ??
        "Không có phản hồi.",
    });
} catch (error: any) {
  console.error("Assistant API Error:", error);

  return Response.json(
    {
      error: error.message,
      answer: error.message,
    },
    {
      status: 500,
    }
  );
}
}