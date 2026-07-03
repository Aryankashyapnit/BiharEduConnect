const fs = require('fs');
const { PDFParse } = require('pdf-parse');

const pdfPath = 'C:\\Users\\sahni\\.gemini\\antigravity\\brain\\c3a60d77-ed4f-4e96-ac11-38712ba96f74\\media__1782379808459.pdf';
const outputPath = 'C:\\Users\\sahni\\BiharEduConnect\\database\\raw_bcece_2025.txt';

async function extract() {
  try {
    const buffer = fs.readFileSync(pdfPath);
    const uint8 = new Uint8Array(buffer);
    const parser = new PDFParse(uint8);
    await parser.load();
    const result = await parser.getText();
    fs.writeFileSync(outputPath, result.text);
    console.log(`Successfully extracted BCECE PDF to ${outputPath}`);
  } catch (e) {
    console.error("Extraction error:", e);
  }
}

extract();
