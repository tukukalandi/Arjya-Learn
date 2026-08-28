import { Link } from 'react-router-dom';
import { Book } from 'lucide-react';
import { CARD_COLORS } from '../../utils/colors';

export function Classes() {
  const classes = [
    { name: 'Class 1', desc: 'Foundational learning materials' },
    { name: 'Class 2', desc: 'Basic concepts and exercises' },
    { name: 'Class 3', desc: 'Primary level resources' },
    { name: 'Class 4', desc: 'Intermediate primary studies' },
    { name: 'Class 5', desc: 'Upper primary preparations' },
    { name: 'Class 6', desc: 'Middle school introduction' },
    { name: 'Class 7', desc: 'Advanced middle school concepts' },
    { name: 'Class 8', desc: 'Pre-high school fundamentals' },
    { name: 'Class 9', desc: 'High school core subjects' },
    { name: 'Class 10', desc: 'Board examination preparation' },
  ];

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span> 
            Study Materials by Class
          </h1>
          <p className="mt-2 text-sm text-slate-600 ml-3.5">Select your class to browse available subjects and materials.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {classes.map((cls, idx) => (
            <Link
              key={cls.name}
              to={`/class/${encodeURIComponent(cls.name)}`}
              className={`relative overflow-hidden rounded-sm p-6 shadow-sm hover:shadow-md transition-all flex flex-col items-start justify-center min-h-[140px] group ${CARD_COLORS[idx % CARD_COLORS.length]}`}
            >
              <div className="absolute -right-4 top-1/2 -translate-y-1/2 opacity-20 group-hover:scale-110 group-hover:opacity-30 transition-all duration-300">
                <Book className="w-24 h-24 text-white" strokeWidth={1.5} />
              </div>
              <h2 className="relative z-10 font-bold text-xl mb-2 text-white">{cls.name}</h2>
              <p className="relative z-10 text-white/80 text-xs mb-4 flex-1">{cls.desc}</p>
              <div className="relative z-10 text-white text-[11px] font-bold uppercase tracking-wider bg-white/20 px-3 py-1.5 rounded w-full text-center hover:bg-white/30 transition-colors mt-auto">
                Browse Materials
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
