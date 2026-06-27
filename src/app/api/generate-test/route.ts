import OpenAI from "openai";
import { retrieveKnowledge } from "@/lib/rag/retrieve";
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
function normalizeMCQ(mcq: any[] = []) {
  return mcq.map((q) => {
    const opt = q.options || {};

    // nếu AI trả array thì convert sang object
    const options =
      Array.isArray(opt)
        ? {
            A: opt[0] ?? "",
            B: opt[1] ?? "",
            C: opt[2] ?? "",
            D: opt[3] ?? "",
          }
        : {
            A: opt.A ?? "",
            B: opt.B ?? "",
            C: opt.C ?? "",
            D: opt.D ?? "",
          };

    return {
      question: q.question ?? "",
      options,
      answer: typeof q.answer === "number" ? q.answer : 0,
    };
  });
}
export async function POST(req: Request) {
try {
const body = await req.json();

const {
  grade,
  lesson,
  questionTypes,
  questionCountByType,
  count
} = body;

let typePrompt = "";
if (questionTypes?.mcq) {
  typePrompt += `
- Trắc nghiệm: 4 đáp án A B C D, chỉ 1 đúng.
`;
}
if (questionTypes?.trueFalse) {
  typePrompt += `
- Đúng/Sai: mỗi câu gồm 4 ý a,b,c,d.
- Học sinh chọn đúng hoặc sai từng ý.
`;
}
if (questionTypes?.shortAnswer) {
  typePrompt += `
- Trả lời ngắn: chỉ 1 đáp án là số 
- Không có lựa chọn.
`;
}
if (questionTypes?.essay) {
  typePrompt += `
- Tự luận: câu hỏi phân tích + có gợi ý trả lời.
`;
}
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
const allLessons =
  data as any[];

const lessonData = allLessons.find(
  (item) => item.tenBai === lesson
);
if (!lessonData) {
  return Response.json({
    answer: "Không tìm thấy bài học",
  });
}
const rag = retrieveKnowledge(lessonData, Math.min(8, count));

const facts = Array.isArray(rag)
  ? rag
  : rag?.facts || [];

const compactRag = facts
  .slice(0, 5)
  .map((r: any) =>
    typeof r === "string" ? r : r?.noiDung || ""
  )
  .filter(Boolean)
  .join("\n");

const countByType = {
  mcq: questionCountByType?.multiple || 0,
  trueFalse: questionCountByType?.trueFalse || 0,
  shortAnswer: questionCountByType?.shortAnswer || 0,
  essay: questionCountByType?.essay || 0,
};
const selectedTypes = Object.entries(questionTypes || {})
  .filter(([_, v]) => v === true)
  .map(([k]) => k);
  const perType = selectedTypes.length > 0
  ? Math.floor(count / selectedTypes.length)
  : 0;
const response =
  await client.chat.completions.create({
    model: "openai/gpt-oss-120b",

    messages: [
      {
        role: "system",
        content: `

Bạn là giáo viên Địa lí Việt Nam.

CHỈ được sử dụng dữ liệu được cung cấp (RAG).
Không tự bịa kiến thức.

YÊU CẦU:
- Tạo đề kiểm tra theo đúng loại câu hỏi được chỉ định
- Không được sáng tạo kiến thức ngoài dữ liệu
- Không lặp câu hỏi
- Không giải thích

CHỈ trả về JSON, KHÔNG TEXT.

FORMAT BẮT BUỘC:

{
  "mcq": [
    {
      "question": "",
options: {
  "A": string,
  "B": string,
  "C": string,
  "D": string
},
"answer": 0
    }
  ],

  "trueFalse": [
    {
      "question": "",
      "items": [
        "A ...",
        "B ...",
        "C ...",
        "D ..."
      ],
      "answer": ["Đúng","Sai","Đúng","Sai"]
    }
  ],

  "shortAnswer": [
    {
      "question": "",
      "answer": ""
    }
  ],

  "essay": [
    {
      "question": "",
      "hint": ""
    }
  ]
}

QUY TẮC BẮT BUỘC JSON OUTPUT:

1. Trắc nghiệm (mcq):
- options PHẢI là object:
{
  "A": string,
  "B": string,
  "C": string,
  "D": string
}

2. answer là số:
0 = A
1 = B
2 = C
3 = D

3. KHÔNG ĐƯỢC dùng array cho options

4. KHÔNG được để undefined hoặc null

5. Nếu không biết, tự điền nội dung hợp lý

OUTPUT CHỈ JSON, không giải thích.
`

      },

      {
        role: "user",
        content: `

KHỐI: ${grade}

BÀI HỌC:
${lessonData.tenBai}

DỮ LIỆU (RAG):
${compactRag}

TỪ KHÓA:
${lessonData.tuKhoa.join(", ")}

SỐ CÂU THEO TỪNG LOẠI:

${Object.entries(countByType)
  .map(([k, v]) => `- ${k}: ${v}`)
  .join("\n")}

QUY TẮC:
- Nếu số câu của từng loại > 0 → bắt buộc đúng y số đó
- Nếu tất cả = 0 → tự chia đều theo count
BẮT BUỘC TUÂN THEO:

${typePrompt}

Nếu nhiều loại được chọn:
- Phải chia đều số câu theo từng loại
- Không được chỉ sinh 1 loại duy nhất

YÊU CẦU:
- Dựa đúng loại câu hỏi ở trên
- Không bịa kiến thức
- Không giải thích
- Không markdown ngoài format đề
`,
},
],

    temperature: 0.3,
  });
const aiText = response.choices[0]?.message?.content ?? "{}";

let raw;
try {
  raw = JSON.parse(aiText);
} catch (e) {
  return Response.json({
    answer: "AI trả về JSON lỗi",
  });
}

const result = {
  mcq: normalizeMCQ(raw.mcq),
  trueFalse: raw.trueFalse || [],
  shortAnswer: raw.shortAnswer || [],
  essay: raw.essay || [],
};

return Response.json({
  answer: result,
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
