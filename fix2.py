import os

path = 'src/pages/public/Home.tsx'
with open(path, 'r') as f:
    content = f.read()

content = content.replace('className={}', 'className={`relative overflow-hidden rounded-sm p-6 shadow-sm hover:shadow-md transition-all flex flex-col items-start justify-center min-h-[140px] group ${CARD_COLORS[idx % CARD_COLORS.length]}`}')
content = content.replace('to={}', 'to={`/quiz/${quiz.id}`}')

with open(path, 'w') as f:
    f.write(content)

path = 'src/pages/public/Quizzes.tsx'
with open(path, 'r') as f:
    content = f.read()

content = content.replace('to={}', 'to={`/quiz/${quiz.id}`}')
with open(path, 'w') as f:
    f.write(content)
