import { Link, useNavigate } from 'react-router-dom';
import { Trophy, ArrowLeft } from 'lucide-react';

export function Olympiad() {
  const navigate = useNavigate();
  const categories = [
    { name: 'Mathematics Olympiad', desc: 'IMO, UIMO, logic and reasoning' },
    { name: 'Science Olympiad', desc: 'NSO, physics, chemistry, biology basics' },
    { name: 'English Olympiad', desc: 'IEO, grammar, comprehension' },
    { name: 'General Knowledge', desc: 'IGKO, current affairs, facts' },
    { name: 'Computer Olympiad', desc: 'NCO, digital literacy, coding basics' },
    { name: 'Reasoning', desc: 'Logical reasoning and aptitude' },
  ];

  return (
    <div className="bg-[#F8FAFC] dark:bg-slate-950 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <button onClick={() => navigate(-1)} className="inline-flex items-center text-[11px] font-bold text-slate-500 dark:text-slate-400 hover:text-red-600 mb-6 transition-colors uppercase tracking-wide">
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Back
        </button>
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4 shadow-sm border border-yellow-200">
            <Trophy className="text-yellow-600 w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">Olympiad Preparation</h1>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">Access premium study notes, previous year papers, mock tests, and practice resources for competitive examinations.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/materials?examType=Olympiad&subject=${encodeURIComponent(cat.name.replace(' Olympiad', ''))}`}
              className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 hover:border-yellow-300 shadow-sm hover:shadow transition-all group"
            >
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1 group-hover:text-yellow-600 transition-colors">{cat.name}</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">{cat.desc}</p>
              <span className="inline-flex items-center text-xs font-bold text-yellow-600 group-hover:text-yellow-700">
                View Resources &rarr;
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
