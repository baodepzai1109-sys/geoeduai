const fs = require("fs");
const path = require("path");
const { createCanvas } = require("canvas");

const pdfjsLib = require("pdfjs-dist/legacy/build/pdf.js");

const pdfPath = path.join(__dirname, "../public/atlat.pdf");
const outputDir = path.join(__dirname, "../public/thumbnails");

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function generate() {
  const loadingTask = pdfjsLib.getDocument(pdfPath);

  const pdf = await loadingTask.promise;

  console.log(`PDF có ${pdf.numPages} trang`);

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
    const page = await pdf.getPage(pageNumber);

    const viewport = page.getViewport({
      scale: 0.35,
    });

    const canvas = createCanvas(
      viewport.width,
      viewport.height
    );

    const context = canvas.getContext("2d");

    await page.render({
      canvasContext: context,
      viewport,
    }).promise;

    const output = path.join(
      outputDir,
      `page-${pageNumber}.png`
    );

    fs.writeFileSync(
      output,
      canvas.toBuffer("image/png")
    );

    console.log(`✔ Trang ${pageNumber}`);
  }

  console.log("Hoàn thành.");
}

generate();