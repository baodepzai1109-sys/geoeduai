// scripts/crawlGeo6.js
console.log("SCRIPT START");
const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

const BASE =
  "https://www.vietjack.com/dia-li-6-ket-noi/";

async function getLessonLinks() {
  const { data } = await axios.get(
    "https://www.vietjack.com/dia-li-6-ket-noi/ly-thuyet-dia-li-lop-6.jsp"
  );

  const $ = cheerio.load(data);

  const lessons = [];

  $("a").each((_, el) => {
    const href = $(el).attr("href");

    if (
      href &&
      href.includes("/dia-li-6-ket-noi/") &&
      href.endsWith(".jsp") &&
      !href.includes(
        "ly-thuyet-dia-li-lop-6.jsp"
      )
    ) {
      lessons.push({
        title: $(el).text().trim(),
        url: new URL(
  href,
  "https://www.vietjack.com"
).href,
      });
    }
  });

  return [...new Map(
    lessons.map(x => [x.url, x])
  ).values()];
}

async function crawlLesson(title, url) {
  try {
    console.log("Đang tải:", url);

    const { data } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0 Safari/537.36",
      },
    });

    const $ = cheerio.load(data);

    const content =
      $(".content").text().trim();

    if (!content) {
      console.log(
        "Không lấy được nội dung:",
        title
      );
      return null;
    }

    return {
      ten: title,
      noiDung: content,
      url,
    };
  } catch (err) {
    console.error(
      "Lỗi bài:",
      title
    );

    console.error(
      err.response?.status ||
      err.message
    );

    return null;
  }
}

async function main() {
  console.log(
    "Đang lấy danh sách bài..."
  );

  const lessons =
    await getLessonLinks();

  const result = {};

  for (
    let i = 0;
    i < lessons.length;
    i++
  ) {
    const lesson =
      lessons[i];

    console.log(
      `[${i + 1}/${lessons.length}] ${lesson.title}`
    );

    const data =
      await crawlLesson(
        lesson.title,
        lesson.url
      );

    if (data) {
      result[`bai${i + 1}`] =
        data;
    }
  }

  fs.writeFileSync(
    "./geo6.json",
    JSON.stringify(
      result,
      null,
      2
    ),
    "utf8"
  );

  console.log(
    "Hoàn tất!"
  );
}

main();
