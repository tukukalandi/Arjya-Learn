import os

path = 'src/pages/public/Quizzes.tsx'
with open(path, 'r') as f:
    content = f.read()

# Removing duplicate import Link
content = content.replace("import { Link } from 'react-router-dom';\nimport { Link } from 'react-router-dom';", "import { Link } from 'react-router-dom';")

with open(path, 'w') as f:
    f.write(content)
