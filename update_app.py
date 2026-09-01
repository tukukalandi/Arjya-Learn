import os

path = 'src/App.tsx'
with open(path, 'r') as f:
    content = f.read()

if 'import { Quizzes } from' not in content:
    content = content.replace(
        'import { VideoCorner } from \'./pages/public/VideoCorner\';',
        'import { VideoCorner } from \'./pages/public/VideoCorner\';\nimport { Quizzes } from \'./pages/public/Quizzes\';'
    )
    content = content.replace(
        '<Route path=\"/video-corner/*\" element={<PublicLayout><VideoCorner /></PublicLayout>} />',
        '<Route path=\"/video-corner/*\" element={<PublicLayout><VideoCorner /></PublicLayout>} />\n          <Route path=\"/quizzes\" element={<PublicLayout><Quizzes /></PublicLayout>} />'
    )
    with open(path, 'w') as f:
        f.write(content)
