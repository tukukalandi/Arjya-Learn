import os

path = 'src/pages/public/Quizzes.tsx'
with open(path, 'r') as f:
    content = f.read()

content = content.replace(
    "import { HelpCircle, ArrowRight } from 'lucide-react';",
    "import { HelpCircle, ArrowRight } from 'lucide-react';\nimport { Link } from 'react-router-dom';"
)
content = content.replace('<a', '<Link')
content = content.replace('href={quiz.fileUrl}', 'to={`/quiz/${quiz.id}`}')
content = content.replace('target="_blank"', '')
content = content.replace('rel="noopener noreferrer"', '')
content = content.replace('</a>', '</Link>')

with open(path, 'w') as f:
    f.write(content)

path = 'src/pages/public/Home.tsx'
with open(path, 'r') as f:
    content = f.read()

content = content.replace('<a', '<Link')
content = content.replace('href={quiz.fileUrl}', 'to={`/quiz/${quiz.id}`}')
content = content.replace('target="_blank"', '')
content = content.replace('rel="noopener noreferrer"', '')
content = content.replace('</a>', '</Link>')

with open(path, 'w') as f:
    f.write(content)
