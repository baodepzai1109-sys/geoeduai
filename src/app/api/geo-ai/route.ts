import OpenAI from "openai";
import provinceInfo from "@/data/provinceInfo.json";

const client = new OpenAI({
apiKey: process.env.GROQ_API_KEY,
baseURL: "https://api.groq.com/openai/v1",
});

function normalizeText(text: string) {
return text
.toLowerCase()
.normalize("NFD")
.replace(/[\u0300-\u036f]/g, "")
.replace(/đ/g, "d")
.trim();
}

export async function POST(req: Request) {
try {
const { question } = await req.json();

const q = normalizeText(question);

// ====================
// TRẢ LỜI NHANH
// ====================

if (
  q.includes("bao nhieu tinh") ||
  q.includes("bao nhieu tinh thanh") ||
  q.includes("so tinh thanh viet nam")
) {
  return Response.json({
    answer: "Việt Nam hiện có 34 tỉnh/thành phố.",
  });
}

if (
  q.includes("bao nhieu song") ||
  q.includes("may con song") ||
  q.includes("so luong song")
) {
  return Response.json({
    answer:
      "Việt Nam có khoảng 2.360 con sông dài từ 10 km trở lên.",
  });
}

// ====================
// TÌM TỈNH ĐƯỢC NHẮC TỚI
// ====================

const provinceNames = Object.keys(provinceInfo);

const matchedProvince = provinceNames.find((province) =>
  q.includes(normalizeText(province))
);

let provinceContext = "";

if (matchedProvince) {
  provinceContext = JSON.stringify(
    provinceInfo[
      matchedProvince as keyof typeof provinceInfo
    ],
    null,
    2
  );
}

const response =
  await client.chat.completions.create({
    model: "openai/gpt-oss-120b",

    temperature: 0.1,

    messages: [
      {
        role: "system",
        content: `

Bạn là GeoEdu AI.

Nhiệm vụ:

* Chuyên gia Địa lý Việt Nam.
* Trả lời bằng tiếng Việt.
* Trả lời ngắn gọn nhưng chính xác.
* Không bịa thông tin.
* Nếu dữ liệu có câu trả lời thì phải ưu tiên dữ liệu.

Bạn phải hiểu các cách hỏi khác nhau:

Ví dụ:

"Bạc Liêu nhập vào đâu"
"Bạc Liêu sáp nhập vào tỉnh nào"
"Tỉnh nào nhận Bạc Liêu"
"tỉnh Bạc Liêu được sáp nhập vào tỉnh nào"
=> cùng một ý.

"Cà Mau được tạo từ tỉnh nào"
"Cà Mau sáp nhập từ đâu"
"Cà Mau hình thành từ đâu"

=> cùng một ý.

Người dùng có thể:

* viết thiếu dấu
* viết sai chính tả nhẹ
* không có dấu hỏi

Bạn phải tự hiểu.

Nếu dữ liệu không có câu trả lời:

* dùng kiến thức địa lý chính xác.
* không đoán.

DỮ LIỆU TỈNH ĐANG LIÊN QUAN:

${provinceContext || "Không xác định được tỉnh cụ thể"}

TOÀN BỘ DỮ LIỆU:

${JSON.stringify(provinceInfo)}
`,
},
      {
        role: "user",
        content: question,
      },
    ],
  });

return Response.json({
  answer:
    response.choices[0].message.content ||
    "Không có câu trả lời",
});

} catch (error: any) {
console.error(error);

return Response.json({
  answer: error?.message || "Đã xảy ra lỗi",
});

}
}
