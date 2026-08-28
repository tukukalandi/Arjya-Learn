const fs = require('fs');
let code = fs.readFileSync('src/components/layout/PublicLayout.tsx', 'utf8');

code = code.replace(
  /const handleClickOutside = \(event: MouseEvent\) => {[\s\S]*?};/,
  \`const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.lang-dropdown-container')) {
        setIsLangMenuOpen(false);
      }
    };\`
);

fs.writeFileSync('src/components/layout/PublicLayout.tsx', code);
