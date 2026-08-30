const materials = [
  { subject: 'Science', title: 'States of matter' },
  { subject: 'English', title: 'English Grammar' }
];

const subjectFilter = "English";

const filtered = materials.filter(m => {
  const matchSubject = subjectFilter === 'All' || m.subject === subjectFilter;
  return matchSubject;
});
console.log(filtered);
