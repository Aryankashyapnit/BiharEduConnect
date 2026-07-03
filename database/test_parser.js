const fs = require('fs');
const { PDFParse } = require('pdf-parse');

const pdfPath = 'C:\\Users\\sahni\\.gemini\\antigravity\\brain\\c3a60d77-ed4f-4e96-ac11-38712ba96f74\\media__1782379808459.pdf';

async function test() {
  try {
    const buffer = fs.readFileSync(pdfPath);
    const uint8 = new Uint8Array(buffer);
    const parser = new PDFParse(uint8);
    await parser.load();
    const text = await parser.getText();
    console.log("Returned text type:", typeof text);
    console.log("Returned text keys/value:", text);
  } catch (e) {
    console.error("Test error:", e);
  }
}
test();
