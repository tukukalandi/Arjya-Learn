import re

with open('src/components/layout/PublicLayout.tsx', 'r') as f:
    code = f.read()

replacement = """const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.lang-dropdown-container')) {
        setIsLangMenuOpen(false);
      }
    };"""

code = re.sub(r"const handleClickOutside = \(event: MouseEvent\) => {.*?};", replacement, code, flags=re.DOTALL)

with open('src/components/layout/PublicLayout.tsx', 'w') as f:
    f.write(code)
