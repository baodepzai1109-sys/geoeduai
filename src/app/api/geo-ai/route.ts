import OpenAI from "openai";
import provinceInfo from "@/data/provinceInfo.json";
import faq from "@/data/faq.json";
const client = new OpenAI({
apiKey: process.env.GROQ_API_KEY,
baseURL: "https://api.groq.com/openai/v1",
});
function findMergedInto(question: string) {
  const q = normalizeText(question);

  for (const [province, info] of Object.entries(provinceInfo)) {
    const merged = normalizeText(info.sapNhapTu || "");

    // bỏ tên chính của tỉnh mới
    const oldProvinces = merged
      .split(",")
      .map(x => x.trim())
      .filter(x => x && x !== normalizeText(province));

    for (const old of oldProvinces) {
      if (q.includes(old)) {
        return {
  oldProvince: info.sapNhapTu
    .split(",")
    .map(x => x.trim())
    .find(x => normalizeText(x) === old),
  newProvince: province,
};
      }
    }
  }

  return null;
}
function normalizeText(text: string) {
return text
.toLowerCase()
.normalize("NFD")
.replace(/[\u0300-\u036f]/g, "")
.replace(/đ/g, "d")
.trim();
}
function retrieveFAQ(question: string) {
  const q = normalizeText(question);

  let best: any = null;
  let bestScore = 0;

  for (const item of faq) {
    const text = normalizeText(item.question + " " + item.answer);

    let score = 0;
    const words = q.split(/\s+/);

    for (const w of words) {
      if (w.length > 2 && text.includes(w)) {
        score++;
      }
    }

    if (score > bestScore) {
      bestScore = score;
      best = item;
    }
  }

  return best ? best.answer : null;
}
function retrieveProvince(question: string) {
  const q = normalizeText(question);
  const docs: any[] = [];

  const words = q.split(/\s+/).filter(w => w.length >= 2);

  for (const [province, info] of Object.entries(provinceInfo)) {

    const diaDanh =
      Array.isArray(info.diaDanhNoiTieng)
        ? info.diaDanhNoiTieng
            .map(x => typeof x === "string" ? x : x.ten)
            .join(" ")
        : "";

    const searchableText = normalizeText(
      [
        province,
        info.ten,
        info.trungTam,
        info.sapNhapTu,
        info.vungMien,
        info.viTriDiaLy,
        info.dienTich,
        info.danSo,
        diaDanh
      ].join(" ")
    );

    let score = 0;

    // match tỉnh chính
    if (q.includes(normalizeText(province))) score += 100;
    if (q.includes(normalizeText(info.ten))) score += 80;

    // match keyword
    for (const w of words) {
      if (searchableText.includes(w)) {
        score += 3;
      }
    }

    if (score > 0) {
      docs.push({
        province,
        score,
        context: info,
      });
    }
  }

  return docs.sort((a, b) => b.score - a.score).slice(0, 3);
}

export async function POST(req: Request) {
try {
const { question } = await req.json();

const q = normalizeText(question);
const mergedInto = findMergedInto(question);
if (
  mergedInto &&
  (
    q.includes("sap nhap vao") ||
    q.includes("nhap vao") ||
    q.includes("vao tinh nao") ||
    q.includes("thuoc tinh nao")
  )
) {
  return Response.json({
    answer: `tỉnh **${mergedInto.oldProvince}** được sáp nhập vào tỉnh **${mergedInto.newProvince}.**`
  });
}
const provinceNames = Object.keys(provinceInfo);
const isListRequest =
  q.includes("34 tinh") ||
  q.includes("danh sach tinh") ||
  q.includes("ke ten") ||
  q.includes("tinh thanh viet nam");
const faqAnswer = retrieveFAQ(question);
const isProvinceQuestion =
  retrieveProvince(question).length > 0;
// ====================
// TRẢ LỜI NHANH
// ====================

// ====================
// TÌM TỈNH ĐƯỢC NHẮC TỚI
// ====================
const retrieval = retrieveProvince(question);

const provinceContext =
  isListRequest
    ? `Danh sách 34 tỉnh/thành:
${provinceNames.join(", ")}`
    : retrieval.length > 0
    ? retrieval
        .map(
          (d) =>
            `Tỉnh: ${d.province}\n${JSON.stringify(d.context, null, 2)}`
        )
        .join("\n\n------------------\n\n")
    : "";
    if (isListRequest) {
  return Response.json({
    answer:
      `Việt Nam có ${provinceNames.length} tỉnh/thành:\n\n` +
      provinceNames.join(", "),
  });
}
const response =
  await client.chat.completions.create({
    model: "openai/gpt-oss-120b",

    temperature: 0,
    top_p: 1,

    frequency_penalty: 0,

    presence_penalty: 0,
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
"Bạc Liêu được sáp nhập vào tỉnh nào"
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

1. Nếu dữ liệu RAG có câu trả lời:
   PHẢI trả lời theo dữ liệu.
⚠️ QUY TẮC DÀNH RIÊNG CHO DANH SÁCH TỈNH:

- Nếu câu hỏi yêu cầu liệt kê toàn bộ tỉnh/thành Việt Nam
→ CHỈ được dùng provinceInfo JSON
→ KHÔNG được tự đoán
→ KHÔNG được dùng kiến thức bên ngoài
Nếu không có provinceContext nhưng là câu hỏi danh sách:
→ phải trả lời: "Không có dữ liệu danh sách tỉnh trong hệ thống"

2. Không được dùng trí nhớ nếu dữ liệu đã có.

3. Nếu dữ liệu RAG không có:
   mới được dùng kiến thức của bạn.

4. Được phép suy luận từ kiến thức địa lý nếu:
   - câu hỏi mang tính phổ thông
   - hoặc không có dữ liệu RAG

5. Chỉ trả lời "Tôi chưa có dữ liệu để trả lời" khi:
   - câu hỏi quá cụ thể về dữ liệu nội bộ tỉnh
   - hoặc không thể suy luận hợp lý từ kiến thức địa lý chung
⚠️ QUY TẮC QUAN TRỌNG:

Nếu câu hỏi là giải thích địa lý (vì sao, nguyên nhân, tại sao):
→ LUÔN phải trả lời bằng kiến thức địa lý
→ KHÔNG được trả lời giới thiệu hệ thống
→ KHÔNG được trả lời chung chung

Chỉ dùng “không có dữ liệu” khi:
- hỏi dữ liệu thống kê cụ thể không suy luận được
DỮ LIỆU TỈNH ĐANG LIÊN QUAN:
Các tài liệu sau được truy xuất từ cơ sở dữ liệu (RAG).
QUY TẮC RAG:

1. Không được trả lời trực tiếp từ FAQ nếu chưa qua LLM.

2. Luôn ưu tiên dữ liệu theo thứ tự:
   PROVINCE DATA > FAQ > kiến thức chung

3. Nếu có danh sách (ví dụ 34 tỉnh):
   → chỉ dùng provinceInfo JSON
   → không được tự suy đoán

4. KHÔNG BAO GIỜ trả lời giới thiệu hệ thống

5. Nếu không có dữ liệu:
   → dùng kiến thức địa lý phổ thông
DỮ LIỆU RAG:
- Nếu có dữ liệu liên quan → ưu tiên dùng
- Nếu không có dữ liệu → vẫn được dùng kiến thức địa lý phổ thông để trả lời
- Không được từ chối chỉ vì thiếu dữ liệu
${provinceContext?.trim()
  ? provinceContext
  : "KHÔNG CÓ DỮ LIỆU RAG VỀ TỈNH NÀY"}
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
