import re

with open('src/pages/public/Home.tsx', 'r') as f:
    content = f.read()

import_statement = "import { collection, query, getDocs, orderBy, limit } from 'firebase/firestore';\nimport { db } from '../../lib/firebase';\nimport { Video } from '../../types';\nimport { Play, Youtube } from 'lucide-react';\n"
content = content.replace('import { CARD_COLORS', import_statement + 'import { CARD_COLORS')

# add state
state_block = """  const [videos, setVideos] = useState<Video[]>([]);
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const q = query(collection(db, 'videos'), orderBy('createdAt', 'desc'), limit(6));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Video));
        setVideos(data);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };
    fetchVideos();
  }, []);

  const extractYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };
"""

content = content.replace("  const navigate = useNavigate();", "  const navigate = useNavigate();\n" + state_block)


# add Videos Corner section
videos_section = """
      {/* Videos Corner */}
      {videos.length > 0 && (
        <section className="py-12 bg-[#F8FAFC] dark:bg-slate-950 px-4 sm:px-6 lg:px-8 border-t border-slate-200 dark:border-slate-800 transition-colors duration-200">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 text-center mb-8 uppercase tracking-wide">
              VIDEOS CORNER
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map(video => {
                const videoId = extractYoutubeId(video.youtubeUrl);
                const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : '';
                return (
                  <a 
                    href={video.youtubeUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    key={video.id} 
                    className="group relative rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border-4 border-white dark:border-slate-800 block"
                  >
                    <div className="aspect-[16/9] relative bg-slate-900">
                      {thumbnailUrl && (
                        <img 
                          src={thumbnailUrl} 
                          alt={video.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100" 
                        />
                      )}
                      
                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-12 bg-red-600 rounded-xl flex items-center justify-center shadow-lg group-hover:bg-red-700 transition-colors">
                          <Play className="w-6 h-6 text-white fill-white" />
                        </div>
                      </div>

                      {/* YouTube Logo / Watch on YT Bar */}
                      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent flex items-center justify-between">
                         <div className="flex items-center gap-2 text-white font-medium text-sm">
                           <Youtube className="w-5 h-5 text-white" />
                           <span className="truncate max-w-[200px] text-xs">{video.title}</span>
                         </div>
                         <div className="text-white/90 text-xs font-semibold px-2 py-1 bg-white/20 rounded backdrop-blur-sm whitespace-nowrap">
                           Watch on YouTube
                         </div>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </section>
      )}
"""

content = content.replace("    </div>\n  );\n}", videos_section + "\n    </div>\n  );\n}")

with open('src/pages/public/Home.tsx', 'w') as f:
    f.write(content)
