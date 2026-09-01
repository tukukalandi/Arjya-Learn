import os

path = 'src/App.tsx'
with open(path, 'r') as f:
    content = f.read()

if 'import { QuizDetails }' not in content:
    content = content.replace(
        "import { Quizzes } from './pages/public/Quizzes';",
        "import { Quizzes } from './pages/public/Quizzes';\nimport { QuizDetails } from './pages/public/QuizDetails';"
    )
    content = content.replace(
        '<Route path="/quizzes" element={<PublicLayout><Quizzes /></PublicLayout>} />',
        '<Route path="/quizzes" element={<PublicLayout><Quizzes /></PublicLayout>} />\n          <Route path="/quiz/:id" element={<PublicLayout><QuizDetails /></PublicLayout>} />'
    )
    with open(path, 'w') as f:
        f.write(content)
