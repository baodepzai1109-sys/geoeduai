import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export async function POST(req: Request) {
  try {
    const {
      grade,
      lesson,
      difficulty,
      count,
    } = await req.json();

    const prompt = `
Tạo ${count} câu hỏi trắc nghiệm Địa lí lớp ${grade}
thuộc ${lesson}.

Độ khó: ${difficulty}

Trả về JSON đúng định dạng:

[
  {
    "question":"...",
    "options":["A","B","C","D"],
    "answer":0,
    "topic":"..."
  }
]

Chỉ trả JSON.
`;

    const response =
      await client.chat.completions.create({
        model: "openai/gpt-oss-120b",
        temperature: 0.3,
        messages: [
          {
            role: "system",
            content:
              "Bạn là chuyên gia Địa lí Việt Nam. Chỉ trả về JSON hợp lệ.",
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

    console.log(text);

    return Response.json({
      questions: JSON.parse(text),
    });
  } catch (error: any) {
    console.error(error);

    return Response.json(
      {
        error: error?.message || "Lỗi tạo quiz",
      },
      {
        status: 500,
      }
    );
  }
}