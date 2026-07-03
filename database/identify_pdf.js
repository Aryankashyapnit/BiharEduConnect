const fs = require('fs');
const pdf = require('pdf-parse');

const files = [
  'media__1782371187810.pdf',
  'media__1782373584582.pdf',
  'media__1782379808459.pdf'
];

const basePath = 'C:\\Users\\sahni\\.gemini\\antigravity\\brain\\c3a60d77-ed4f-4e96-ac11-38712ba96f74\\';

async function identify() {
  for (const file of files) {
    const filePath = basePath + file;
    if (fs.existsSync(filePath)) {
      try {
        const buffer = fs.readFileSync(filePath);
        const data = await pdf(buffer);
        console.log(`File: ${file} | Pages: ${data.numpages}`);
        if (data.text.includes("BCECE[ENGINEERING]")) {
          console.log(`>>> MATCH FOUND: ${file} is the BCECE PDF!`);
          fs.writeFileSync('C:\\Users\\sahni\\BiharEduConnect\\database\\raw_bcece_2025.txt', data.text);
          console.log(`Wrote text to C:\\Users\\sahni\\BiharEduConnect\\database\\raw_bcece_2025.txt`);
        }
      } catch (e) {
        console.error(`Error reading ${file}:`, e);
      }
    }
  }
}

identify();
