const fs = require('fs');

const path = 'src/pages/admin/MaterialForm.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  '<label className="block text-sm font-medium text-slate-700">Exam Name (e.g. IMO)</label>',
  '{formData.materialType === "NCERT Book" ? (\n                <label className="block text-sm font-medium text-slate-700">Chapter No.</label>\n              ) : (\n                <label className="block text-sm font-medium text-slate-700">Exam Name (e.g. IMO)</label>\n              )}'
);

content = content.replace(
  "materialType: 'Chapter',",
  "materialType: 'NCERT Book',"
);

fs.writeFileSync(path, content);
