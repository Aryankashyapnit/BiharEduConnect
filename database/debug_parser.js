const fs = require('fs');

const rawTextPath = 'database/raw_ocr.txt';
const content = fs.readFileSync(rawTextPath, 'utf-8');
const lines = content.split('\n');

lines.slice(0, 30).forEach((line, index) => {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("Page No:-") || trimmed.startsWith("INSTITUTE")) return;

  const parts = trimmed.split("\t").map(s => s.trim());
  console.log(`Line ${index}: len=${parts.length}, parts=${JSON.stringify(parts)}`);
});
