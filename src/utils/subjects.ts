export function getSubjectsForClass(classLevel: string): string[] {
  if (!classLevel) return [];
  const match = classLevel.match(/Class (\d+)/i);
  let level = 0;
  if (match) {
    level = parseInt(match[1], 10);
  }

  if (level >= 1 && level <= 5) {
    return ['Hindi', 'English', 'Math', 'TWAU'];
  }

  return [
    'Mathematics', 'Science', 'English', 'Hindi', 'Odia', 
    'Social Science', 'Computer', 'General Knowledge', 'Reasoning', 
    'Environmental Studies', 'Physics', 'Chemistry', 'Biology',
    'Quantitative Aptitude', 'General Awareness', 'Other'
  ];
}
