const fs = require('fs');
const content = fs.readFileSync('src/types.ts', 'utf8');
const newContent = content.replace(
  'htmlContent: string;',
  'fileUrl: string;'
);
fs.writeFileSync('src/types.ts', newContent);
