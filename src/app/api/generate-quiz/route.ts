import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
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
      await openai.chat.completions.create({
        model: "gpt-4.1-mini",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      });

    const text =
      response.choices[0].message.content;

    return Response.json({
      questions: JSON.parse(text || "[]"),
    });
  } catch {
    return Response.json(
      { error: "Lỗi tạo quiz" },
      { status: 500 }
    );
  }
}