import { Link } from 'react-router-dom';
import { Trophy } from 'lucide-react';

export function Olympiad() {
  const categories = [
    { name: 'Mathematics Olympiad', desc: 'IMO, UIMO, logic and reasoning' },
    { name: 'Science Olympiad', desc: 'NSO, physics, chemistry, biology basics' },
    { name: 'English Olympiad', desc: 'IEO, grammar, comprehension' },
    { name: 'General Knowledge', desc: 'IGKO, current affairs, facts' },
    { name: 'Computer Olympiad', desc: 'NCO, digital literacy, coding basics' },
    { name: 'Reasoning', desc: 'Logical reasoning and aptitude' },
  ];

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4 shadow-sm border border-orange-200">
            <Trophy className="text-orange-600 w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Olympiad Preparation</h1>
          <p className="mt-3 text-sm text-slate-600 max-w-2xl leading-relaxed">Access premium study notes, previous year papers, mock tests, and practice resources for competitive examinations.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/materials?examType=Olympiad&subject=${encodeURIComponent(cat.name.replace(' Olympiad', ''))}`}
              className="bg-white rounded-xl p-6 border border-slate-200 hover:border-orange-300 shadow-sm hover:shadow transition-all group"
            >
              <h2 className="text-lg font-bold text-slate-800 mb-1 group-hover:text-orange-600 transition-colors">{cat.name}</h2>
              <p className="text-xs text-slate-500 mb-5">{cat.desc}</p>
              <span className="inline-flex items-center text-xs font-bold text-orange-600 group-hover:text-orange-700">
                View Resources &rarr;
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
