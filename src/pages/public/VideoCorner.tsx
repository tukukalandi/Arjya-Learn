import React, { useEffect, useState } from 'react';
import { Routes, Route, useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { collection, query, getDocs, orderBy, where } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Video } from '../../types';
import { Play, Youtube, ChevronRight, Video as VideoIcon, BookOpen, Layers, Award, LayoutGrid } from 'lucide-react';

// Utility for URL slugs
const toSlug = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
const fromSlugToRegex = (slug: string) => new RegExp(slug.replace(/-/g, '.*'), 'i');

export function VideoCorner() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const q = query(collection(db, 'videos'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Video));
        setVideos(data);
      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#F8FAFC] dark:bg-slate-950 min-h-screen">
      <Routes>
        <Route path="/" element={<Landing videos={videos} />} />
        <Route path="/:p1" element={<Level1 videos={videos} />} />
        <Route path="/:p1/:p2" element={<Level2 videos={videos} />} />
        <Route path="/:p1/:p2/:p3" element={<Level3 videos={videos} />} />
        <Route path="/:p1/:p2/:p3/:p4" element={<Level4 videos={videos} />} />
        <Route path="/:p1/:p2/:p3/:p4/:videoSlug" element={<VideoPlayer videos={videos} />} />
      </Routes>
    </div>
  );
}

// Extract Youtube ID
const extractYoutubeId = (url: string) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

const CARD_THEMES = [
  { leftBg: 'bg-[#BA312E]', rightBg: 'bg-[#DA433E]', iconText: 'text-[#BA312E]' },
  { leftBg: 'bg-[#18665A]', rightBg: 'bg-[#29917A]', iconText: 'text-[#18665A]' },
  { leftBg: 'bg-[#48289F]', rightBg: 'bg-[#6439C7]', iconText: 'text-[#48289F]' },
  { leftBg: 'bg-[#2662BB]', rightBg: 'bg-[#4089DE]', iconText: 'text-[#2662BB]' },
  { leftBg: 'bg-[#D76C1B]', rightBg: 'bg-[#F48D31]', iconText: 'text-[#D76C1B]' },
];

function CategoryCard({ title, subtitle, to, index }: { title: string, subtitle: string, to: string, index: number }) {
  const theme = CARD_THEMES[index % CARD_THEMES.length];
  return (
    <Link to={to} className="flex rounded-md overflow-hidden shadow-sm hover:shadow-md transition-transform hover:-translate-y-1 h-24">
      <div className={`${theme.leftBg} w-20 sm:w-24 flex items-center justify-center flex-shrink-0`}>
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center">
          <LayoutGrid className={`w-5 h-5 sm:w-6 sm:h-6 ${theme.iconText}`} strokeWidth={2} />
        </div>
      </div>
      <div className={`${theme.rightBg} flex-1 p-4 flex items-center justify-between min-w-0`}>
        <div className="truncate pr-2">
          <h3 className="text-white font-bold text-sm sm:text-base mb-1 truncate">{title}</h3>
          <p className="text-white/80 text-[10px] sm:text-xs font-bold uppercase tracking-wider truncate">{subtitle}</p>
        </div>
        <ChevronRight className="w-4 h-4 text-white/50 flex-shrink-0" />
      </div>
    </Link>
  );
}

// --- Breadcrumbs Component ---
function Breadcrumbs({ paths }: { paths: { name: string, url: string }[] }) {
  return (
    <nav className="flex items-center text-sm text-slate-500 mb-6 flex-wrap gap-2">
      <Link to="/video-corner" className="hover:text-red-600 transition-colors">Video Corner</Link>
      {paths.map((p, i) => (
        <React.Fragment key={i}>
          <ChevronRight className="w-4 h-4 mx-1 flex-shrink-0" />
          <Link to={p.url} className="hover:text-red-600 transition-colors capitalize">{p.name}</Link>
        </React.Fragment>
      ))}
    </nav>
  );
}

// --- LANDING PAGE ---
function Landing({ videos }: { videos: Video[] }) {
  const classVideos = videos.filter(v => v.categoryType === 'Class');
  const compVideos = videos.filter(v => v.categoryType === 'Competitive Exam');
  const olymVideos = videos.filter(v => v.categoryType === 'Olympiad Exam');

  const classes = Array.from(new Set(classVideos.map(v => v.classOrExam))).sort((a,b) => a.localeCompare(b, undefined, {numeric: true}));
  const comps = Array.from(new Set(compVideos.map(v => v.classOrExam))).sort();
  const olyms = Array.from(new Set(olymVideos.map(v => v.classOrExam))).sort((a,b) => a.localeCompare(b, undefined, {numeric: true}));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Video Corner</h1>
      <p className="text-slate-600 dark:text-slate-400 mb-10">Explore our structured collection of educational videos.</p>

      {videos.length === 0 && (
        <div className="bg-white p-12 text-center rounded-xl shadow-sm">
          <p className="text-slate-500">No videos available yet.</p>
        </div>
      )}

      {classes.length > 0 && (
        <div className="mb-12">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
            <BookOpen className="w-5 h-5 mr-2 text-red-600" /> Classes
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {classes.map((c, i) => (
              <CategoryCard 
                key={c} 
                to={`/video-corner/${toSlug(c)}`} 
                title={c} 
                subtitle={`${classVideos.filter(v => v.classOrExam === c).length} ITEMS IN CATEGORY`} 
                index={i} 
              />
            ))}
          </div>
        </div>
      )}

      {comps.length > 0 && (
        <div className="mb-12">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
            <Layers className="w-5 h-5 mr-2 text-red-600" /> Competitive Exams
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {comps.map((c, i) => (
              <CategoryCard 
                key={c} 
                to={`/video-corner/competitive/${toSlug(c)}`} 
                title={c} 
                subtitle={`${compVideos.filter(v => v.classOrExam === c).length} ITEMS IN CATEGORY`} 
                index={i} 
              />
            ))}
          </div>
        </div>
      )}

      {olyms.length > 0 && (
        <div className="mb-12">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
            <Award className="w-5 h-5 mr-2 text-red-600" /> Olympiad Exams
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {olyms.map((c, i) => (
              <CategoryCard 
                key={c} 
                to={`/video-corner/olympiad/${toSlug(c)}`} 
                title={c} 
                subtitle={`${olymVideos.filter(v => v.classOrExam === c).length} ITEMS IN CATEGORY`} 
                index={i} 
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// --- LEVEL 1 (E.g. /video-corner/class-5 OR /video-corner/competitive OR /video-corner/olympiad) ---
function Level1({ videos }: { videos: Video[] }) {
  const { p1 } = useParams();
  
  if (p1 === 'competitive') {
    // Shows all competitive exams
    const compVideos = videos.filter(v => v.categoryType === 'Competitive Exam');
    const comps = Array.from(new Set(compVideos.map(v => v.classOrExam))).sort();
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Breadcrumbs paths={[{name: 'Competitive Exams', url: `/video-corner/competitive`}]} />
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Competitive Exams</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {comps.map((c, i) => (
            <CategoryCard 
              key={c} 
              to={`/video-corner/competitive/${toSlug(c)}`} 
              title={c} 
              subtitle={`${compVideos.filter(v => v.classOrExam === c).length} ITEMS IN CATEGORY`} 
              index={i} 
            />
          ))}
        </div>
      </div>
    );
  }

  if (p1 === 'olympiad') {
    const olymVideos = videos.filter(v => v.categoryType === 'Olympiad Exam');
    const olyms = Array.from(new Set(olymVideos.map(v => v.classOrExam))).sort((a,b) => a.localeCompare(b, undefined, {numeric: true}));
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Breadcrumbs paths={[{name: 'Olympiad Exams', url: `/video-corner/olympiad`}]} />
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Olympiad Exams</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {olyms.map((c, i) => (
            <CategoryCard 
              key={c} 
              to={`/video-corner/olympiad/${toSlug(c)}`} 
              title={c} 
              subtitle={`${olymVideos.filter(v => v.classOrExam === c).length} ITEMS IN CATEGORY`} 
              index={i} 
            />
          ))}
        </div>
      </div>
    );
  }

  // Otherwise it's a specific class (e.g. class-5)
  // We need to show Subjects for this class
  const classVideos = videos.filter(v => v.categoryType === 'Class' && toSlug(v.classOrExam) === p1);
  const subjects = Array.from(new Set(classVideos.map(v => v.subject))).sort();
  const originalClassName = classVideos.length > 0 ? classVideos[0].classOrExam : p1;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumbs paths={[{name: originalClassName || '', url: `/video-corner/${p1}`}]} />
      <h1 className="text-3xl font-bold text-slate-900 mb-2">{originalClassName}</h1>
      <p className="text-slate-600 mb-8">Select a subject to view chapters.</p>
      
      {subjects.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-xl shadow-sm text-slate-500">No subjects available yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {subjects.map((subj, i) => {
            const subjVideos = classVideos.filter(v => v.subject === subj);
            const chaptersCount = new Set(subjVideos.map(v => v.chapter)).size;
            return (
              <CategoryCard 
                key={subj} 
                to={`/video-corner/${p1}/${toSlug(subj)}`} 
                title={subj} 
                subtitle={`${chaptersCount} CHAPTERS`} 
                index={i} 
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

// --- LEVEL 2 (E.g. /video-corner/competitive/tet OR /video-corner/class-5/mathematics) ---
function Level2({ videos }: { videos: Video[] }) {
  const { p1, p2 } = useParams();

  if (p1 === 'competitive' || p1 === 'olympiad') {
    // p2 is the exam name (e.g. tet). We show Subjects
    const categoryFilter = p1 === 'competitive' ? 'Competitive Exam' : 'Olympiad Exam';
    const examVideos = videos.filter(v => v.categoryType === categoryFilter && toSlug(v.classOrExam) === p2);
    const subjects = Array.from(new Set(examVideos.map(v => v.subject))).sort();
    const originalExamName = examVideos.length > 0 ? examVideos[0].classOrExam : p2;

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Breadcrumbs paths={[
          {name: p1, url: `/video-corner/${p1}`},
          {name: originalExamName || '', url: `/video-corner/${p1}/${p2}`}
        ]} />
        <h1 className="text-3xl font-bold text-slate-900 mb-2">{originalExamName}</h1>
        <p className="text-slate-600 mb-8">Select a subject to view chapters.</p>
        
        {subjects.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-xl shadow-sm text-slate-500">No subjects available yet.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {subjects.map((subj, i) => {
              const subjVideos = examVideos.filter(v => v.subject === subj);
              const chaptersCount = new Set(subjVideos.map(v => v.chapter)).size;
              return (
                <CategoryCard 
                  key={subj} 
                  to={`/video-corner/${p1}/${p2}/${toSlug(subj)}`} 
                  title={subj} 
                  subtitle={`${chaptersCount} CHAPTERS`} 
                  index={i} 
                />
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // Otherwise it's a specific class + subject (e.g. class-5/mathematics). We show Chapters.
  const classVideos = videos.filter(v => v.categoryType === 'Class' && toSlug(v.classOrExam) === p1 && toSlug(v.subject) === p2);
  const chapters = Array.from(new Set(classVideos.map(v => v.chapter)));
  const originalClass = classVideos.length > 0 ? classVideos[0].classOrExam : p1;
  const originalSubject = classVideos.length > 0 ? classVideos[0].subject : p2;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumbs paths={[
        {name: originalClass || '', url: `/video-corner/${p1}`},
        {name: originalSubject || '', url: `/video-corner/${p1}/${p2}`}
      ]} />
      <h1 className="text-3xl font-bold text-slate-900 mb-2">{originalSubject}</h1>
      <p className="text-slate-600 mb-8">{originalClass} - Select a chapter</p>

      {chapters.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-xl shadow-sm text-slate-500">No chapters available yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {chapters.map((chap, i) => {
            const chapVideos = classVideos.filter(v => v.chapter === chap);
            return (
              <CategoryCard 
                key={chap} 
                to={`/video-corner/${p1}/${p2}/${toSlug(chap)}`} 
                title={chap} 
                subtitle={`${chapVideos.length} VIDEOS`} 
                index={i} 
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

// --- LEVEL 3 (E.g. /video-corner/competitive/tet/mathematics OR /video-corner/class-5/mathematics/fractions) ---
function Level3({ videos }: { videos: Video[] }) {
  const { p1, p2, p3 } = useParams();

  if (p1 === 'competitive' || p1 === 'olympiad') {
    // p2 = exam, p3 = subject. Show Chapters
    const categoryFilter = p1 === 'competitive' ? 'Competitive Exam' : 'Olympiad Exam';
    const subjVideos = videos.filter(v => v.categoryType === categoryFilter && toSlug(v.classOrExam) === p2 && toSlug(v.subject) === p3);
    const chapters = Array.from(new Set(subjVideos.map(v => v.chapter)));
    const originalExam = subjVideos.length > 0 ? subjVideos[0].classOrExam : p2;
    const originalSubject = subjVideos.length > 0 ? subjVideos[0].subject : p3;

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Breadcrumbs paths={[
          {name: p1, url: `/video-corner/${p1}`},
          {name: originalExam || '', url: `/video-corner/${p1}/${p2}`},
          {name: originalSubject || '', url: `/video-corner/${p1}/${p2}/${p3}`}
        ]} />
        <h1 className="text-3xl font-bold text-slate-900 mb-2">{originalSubject}</h1>
        <p className="text-slate-600 mb-8">{originalExam} - Select a chapter</p>

        {chapters.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-xl shadow-sm text-slate-500">No chapters available yet.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {chapters.map((chap, i) => {
              const chapVideos = subjVideos.filter(v => v.chapter === chap);
              return (
                <CategoryCard 
                  key={chap} 
                  to={`/video-corner/${p1}/${p2}/${p3}/${toSlug(chap)}`} 
                  title={chap} 
                  subtitle={`${chapVideos.length} VIDEOS`} 
                  index={i} 
                />
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // Otherwise it's Class + Subject + Chapter (e.g. class-5/mathematics/fractions). Show Videos!
  const chapVideos = videos.filter(v => v.categoryType === 'Class' && toSlug(v.classOrExam) === p1 && toSlug(v.subject) === p2 && toSlug(v.chapter) === p3);
  const originalClass = chapVideos.length > 0 ? chapVideos[0].classOrExam : p1;
  const originalSubject = chapVideos.length > 0 ? chapVideos[0].subject : p2;
  const originalChapter = chapVideos.length > 0 ? chapVideos[0].chapter : p3;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumbs paths={[
        {name: originalClass || '', url: `/video-corner/${p1}`},
        {name: originalSubject || '', url: `/video-corner/${p1}/${p2}`},
        {name: originalChapter || '', url: `/video-corner/${p1}/${p2}/${p3}`}
      ]} />
      <h1 className="text-3xl font-bold text-slate-900 mb-2">{originalChapter}</h1>
      <p className="text-slate-600 mb-8">Videos for {originalChapter}</p>

      {chapVideos.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-xl shadow-sm text-slate-500">No videos available yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {chapVideos.map(video => <VideoCard key={video.id} video={video} baseUrl={`/video-corner/${p1}/${p2}/${p3}/player`} />)}
        </div>
      )}
    </div>
  );
}

// --- LEVEL 4 (E.g. /video-corner/competitive/tet/mathematics/fractions) ---
function Level4({ videos }: { videos: Video[] }) {
  const { p1, p2, p3, p4 } = useParams();

  // This can only be Competitive/Olympiad + Exam + Subject + Chapter. Show Videos!
  const categoryFilter = p1 === 'competitive' ? 'Competitive Exam' : 'Olympiad Exam';
  const chapVideos = videos.filter(v => v.categoryType === categoryFilter && toSlug(v.classOrExam) === p2 && toSlug(v.subject) === p3 && toSlug(v.chapter) === p4);
  
  const originalExam = chapVideos.length > 0 ? chapVideos[0].classOrExam : p2;
  const originalSubject = chapVideos.length > 0 ? chapVideos[0].subject : p3;
  const originalChapter = chapVideos.length > 0 ? chapVideos[0].chapter : p4;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumbs paths={[
        {name: p1 || '', url: `/video-corner/${p1}`},
        {name: originalExam || '', url: `/video-corner/${p1}/${p2}`},
        {name: originalSubject || '', url: `/video-corner/${p1}/${p2}/${p3}`},
        {name: originalChapter || '', url: `/video-corner/${p1}/${p2}/${p3}/${p4}`}
      ]} />
      <h1 className="text-3xl font-bold text-slate-900 mb-2">{originalChapter}</h1>
      <p className="text-slate-600 mb-8">Videos for {originalChapter}</p>

      {chapVideos.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-xl shadow-sm text-slate-500">No videos available yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {chapVideos.map(video => <VideoCard key={video.id} video={video} baseUrl={`/video-corner/${p1}/${p2}/${p3}/${p4}/player`} />)}
        </div>
      )}
    </div>
  );
}

// --- SHARED VIDEO CARD COMPONENT ---
const VideoCard: React.FC<{ video: Video, baseUrl: string }> = ({ video, baseUrl }) => {
  const ytId = extractYoutubeId(video.videoUrl);
  const thumb = ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : null;

  return (
    <Link to={`${baseUrl}/${video.id}`} className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg border border-slate-200 transition-all block">
      <div className="aspect-video bg-slate-900 relative">
        {thumb ? (
          <img src={thumb} alt={video.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <VideoIcon className="w-12 h-12 text-slate-600" />
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 bg-red-600/90 rounded-full flex items-center justify-center shadow-lg group-hover:bg-red-600 group-hover:scale-110 transition-transform">
            <Play className="w-5 h-5 text-white fill-white ml-1" />
          </div>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-slate-800 line-clamp-2 mb-2 group-hover:text-red-600">{video.title}</h3>
        <p className="text-xs text-slate-500">{new Date(video.createdAt).toLocaleDateString()}</p>
      </div>
    </Link>
  );
}

// --- VIDEO PLAYER PAGE ---
function VideoPlayer({ videos }: { videos: Video[] }) {
  const { videoSlug } = useParams(); // The ID of the video
  const navigate = useNavigate();
  
  const video = videos.find(v => v.id === videoSlug);
  
  if (!video) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-slate-800 mb-4">Video Not Found</h1>
        <button onClick={() => navigate(-1)} className="text-red-600 hover:underline">Go Back</button>
      </div>
    );
  }

  const ytId = extractYoutubeId(video.videoUrl);
  const relatedVideos = videos.filter(v => v.chapter === video.chapter && v.id !== video.id).slice(0, 3);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <button onClick={() => navigate(-1)} className="text-slate-500 hover:text-red-600 mb-6 flex items-center text-sm font-medium">
        <ChevronRight className="w-4 h-4 rotate-180 mr-1" /> Back to Chapter
      </button>

      <div className="bg-slate-900 rounded-xl overflow-hidden shadow-lg aspect-video mb-6">
        {ytId ? (
          <iframe 
            src={`https://www.youtube.com/embed/${ytId}?autoplay=1`} 
            title={video.title}
            className="w-full h-full"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          ></iframe>
        ) : (
          <video 
            src={video.videoUrl} 
            controls 
            autoPlay 
            className="w-full h-full object-contain"
          >
            Your browser does not support the video tag.
          </video>
        )}
      </div>

      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">{video.title}</h1>
      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-400 mb-8 border-b border-slate-200 dark:border-slate-800 pb-6">
        <span className="bg-red-50 text-red-700 px-3 py-1 rounded-full font-medium">{video.classOrExam}</span>
        <span>•</span>
        <span>{video.subject}</span>
        <span>•</span>
        <span>{video.chapter}</span>
      </div>

      {video.description && (
        <div className="mb-12">
          <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Description</h3>
          <p className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap">{video.description}</p>
        </div>
      )}

      {relatedVideos.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">More from {video.chapter}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {relatedVideos.map(v => <VideoCard key={v.id} video={v} baseUrl={`..`} />)}
          </div>
        </div>
      )}
    </div>
  );
}
