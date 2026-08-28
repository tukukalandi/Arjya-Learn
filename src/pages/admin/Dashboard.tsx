import { useState, useEffect } from 'react';
import { collection, query, getDocs, orderBy, limit, addDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { StudyMaterial } from '../../types';
import { FileText, Download, Eye, Users, BookOpen, Clock, Database } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

export function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    drafts: 0,
    totalViews: 0,
    totalDownloads: 0
  });
  const [recentMaterials, setRecentMaterials] = useState<StudyMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const materialsRef = collection(db, 'studyMaterials');
      const q = query(materialsRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      
      let total = 0;
      let published = 0;
      let drafts = 0;
      let totalViews = 0;
      let totalDownloads = 0;
      const recent: StudyMaterial[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data() as StudyMaterial;
        total++;
        if (data.isPublished) published++;
        else drafts++;
        totalViews += (data.viewCount || 0);
        totalDownloads += (data.downloadCount || 0);
        
        if (recent.length < 5) {
          recent.push({ id: doc.id, ...data });
        }
      });

      setStats({ total, published, drafts, totalViews, totalDownloads });
      setRecentMaterials(recent);
    } catch (error) {
      console.error("Error fetching dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleSeedData = async () => {
    if (!window.confirm('Are you sure you want to seed demo data?')) return;
    setSeeding(true);
    try {
      const now = new Date().toISOString();
      const demoData: Partial<StudyMaterial>[] = [
        {
          title: '[DEMO] Class 5 Mathematics Model Paper',
          description: 'A comprehensive model paper covering fractions, decimals, and basic geometry.',
          classLevel: 'Class 5',
          subject: 'Mathematics',
          examType: 'School Examination',
          examName: '',
          materialType: 'Model Papers',
          academicYear: '2026-27',
          language: 'English',
          fileName: 'Class5_Math_Model.pdf',
          googleDriveUrl: 'https://docs.google.com/document/d/1234567890/edit',
          googleDriveFileId: '1234567890',
          uploadedBy: 'demo_admin',
          createdAt: now,
          updatedAt: now,
          isPublished: true,
          downloadCount: 0,
          viewCount: 0,
          tags: ['demo', 'fractions', 'geometry']
        },
        {
          title: '[DEMO] Class 6 Science Notes',
          description: 'Revision notes for Physics and Chemistry chapters.',
          classLevel: 'Class 6',
          subject: 'Science',
          examType: 'School Examination',
          examName: '',
          materialType: 'Study Notes',
          academicYear: '2026-27',
          language: 'English',
          fileName: 'Class6_Science_Notes.pdf',
          googleDriveUrl: 'https://docs.google.com/document/d/1234567890/edit',
          googleDriveFileId: '1234567890',
          uploadedBy: 'demo_admin',
          createdAt: now,
          updatedAt: now,
          isPublished: true,
          downloadCount: 0,
          viewCount: 0,
          tags: ['demo', 'physics', 'chemistry']
        },
        {
          title: '[DEMO] Class 7 English Worksheet',
          description: 'Grammar exercises focusing on tenses and active/passive voice.',
          classLevel: 'Class 7',
          subject: 'English',
          examType: 'School Examination',
          examName: '',
          materialType: 'Worksheets',
          academicYear: '2026-27',
          language: 'English',
          fileName: 'Class7_English_Worksheet.pdf',
          googleDriveUrl: 'https://docs.google.com/document/d/1234567890/edit',
          googleDriveFileId: '1234567890',
          uploadedBy: 'demo_admin',
          createdAt: now,
          updatedAt: now,
          isPublished: true,
          downloadCount: 0,
          viewCount: 0,
          tags: ['demo', 'grammar']
        },
        {
          title: '[DEMO] Class 8 Mathematics Previous Year Paper',
          description: 'Actual question paper from the 2025 final examinations.',
          classLevel: 'Class 8',
          subject: 'Mathematics',
          examType: 'School Examination',
          examName: '',
          materialType: 'Previous Year Papers',
          academicYear: '2025-26',
          language: 'English',
          fileName: 'Class8_Math_2025.pdf',
          googleDriveUrl: 'https://docs.google.com/document/d/1234567890/edit',
          googleDriveFileId: '1234567890',
          uploadedBy: 'demo_admin',
          createdAt: now,
          updatedAt: now,
          isPublished: true,
          downloadCount: 0,
          viewCount: 0,
          tags: ['demo', 'previous year']
        },
        {
          title: '[DEMO] Class 9 Science Revision Notes',
          description: 'Quick summary notes for biology and cell structures.',
          classLevel: 'Class 9',
          subject: 'Science',
          examType: 'School Examination',
          examName: '',
          materialType: 'Revision Notes',
          academicYear: '2026-27',
          language: 'English',
          fileName: 'Class9_Science_Rev.pdf',
          googleDriveUrl: 'https://docs.google.com/document/d/1234567890/edit',
          googleDriveFileId: '1234567890',
          uploadedBy: 'demo_admin',
          createdAt: now,
          updatedAt: now,
          isPublished: true,
          downloadCount: 0,
          viewCount: 0,
          tags: ['demo', 'biology']
        },
        {
          title: '[DEMO] Class 10 Mathematics Important Questions',
          description: 'Selected important questions for board exam preparation.',
          classLevel: 'Class 10',
          subject: 'Mathematics',
          examType: 'School Examination',
          examName: 'Board',
          materialType: 'Practice Papers',
          academicYear: '2026-27',
          language: 'English',
          fileName: 'Class10_Math_Imp.pdf',
          googleDriveUrl: 'https://docs.google.com/document/d/1234567890/edit',
          googleDriveFileId: '1234567890',
          uploadedBy: 'demo_admin',
          createdAt: now,
          updatedAt: now,
          isPublished: true,
          downloadCount: 0,
          viewCount: 0,
          tags: ['demo', 'boards', 'important']
        },
        {
          title: '[DEMO] Mathematics Olympiad Practice Paper',
          description: 'Challenging problems for IMO preparation, Class 5-6 level.',
          classLevel: 'Class 5',
          subject: 'Mathematics',
          examType: 'Olympiad',
          examName: 'IMO',
          materialType: 'Practice Papers',
          academicYear: '2026-27',
          language: 'English',
          fileName: 'Math_Olympiad_Prep.pdf',
          googleDriveUrl: 'https://docs.google.com/document/d/1234567890/edit',
          googleDriveFileId: '1234567890',
          uploadedBy: 'demo_admin',
          createdAt: now,
          updatedAt: now,
          isPublished: true,
          downloadCount: 0,
          viewCount: 0,
          tags: ['demo', 'olympiad', 'imo']
        },
        {
          title: '[DEMO] Science Olympiad Question Paper',
          description: 'Previous year paper for National Science Olympiad.',
          classLevel: 'Class 8',
          subject: 'Science',
          examType: 'Olympiad',
          examName: 'NSO',
          materialType: 'Previous Year Papers',
          academicYear: '2025-26',
          language: 'English',
          fileName: 'Science_Olympiad_NSO.pdf',
          googleDriveUrl: 'https://docs.google.com/document/d/1234567890/edit',
          googleDriveFileId: '1234567890',
          uploadedBy: 'demo_admin',
          createdAt: now,
          updatedAt: now,
          isPublished: true,
          downloadCount: 0,
          viewCount: 0,
          tags: ['demo', 'olympiad', 'nso']
        }
      ];

      for (const material of demoData) {
        await addDoc(collection(db, 'studyMaterials'), material);
      }
      
      await fetchDashboardData();
      alert('Demo data seeded successfully!');
    } catch (error) {
      console.error('Error seeding data:', error);
      alert('Failed to seed demo data.');
    } finally {
      setSeeding(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  const statCards = [
    { name: 'Total Materials', value: stats.total, icon: FileText, color: 'text-red-600', bg: 'bg-red-100' },
    { name: 'Published', value: stats.published, icon: BookOpen, color: 'text-green-600', bg: 'bg-green-100' },
    { name: 'Drafts', value: stats.drafts, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100' },
    { name: 'Total Views', value: stats.totalViews, icon: Eye, color: 'text-purple-600', bg: 'bg-purple-100' },
    { name: 'Total Downloads', value: stats.totalDownloads, icon: Download, color: 'text-red-600', bg: 'bg-red-100' },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
        <button 
          onClick={handleSeedData}
          disabled={seeding}
          className="inline-flex items-center px-4 py-2 border border-slate-300 shadow-sm text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
        >
          <Database className="mr-2 h-4 w-4 text-slate-400" />
          {seeding ? 'Seeding...' : 'Seed Demo Data'}
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {statCards.map((stat) => (
          <div key={stat.name} className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.bg}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-500">{stat.name}</p>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-900">Recent Materials</h2>
          <Link to="/admin/materials" className="text-sm font-medium text-red-600 hover:text-red-700">
            View All
          </Link>
        </div>
        <div className="divide-y divide-slate-100">
          {recentMaterials.length === 0 ? (
            <div className="p-6 text-center text-slate-500">No materials found. Start adding some!</div>
          ) : (
            recentMaterials.map((material) => (
              <div key={material.id} className="p-6 hover:bg-slate-50 transition-colors flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-slate-900">{material.title}</h3>
                  <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                    <span className="bg-slate-100 px-2 py-0.5 rounded-full">{material.classLevel}</span>
                    <span className="bg-slate-100 px-2 py-0.5 rounded-full">{material.subject}</span>
                    <span>• {format(new Date(material.createdAt), 'MMM d, yyyy')}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    material.isPublished ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {material.isPublished ? 'Published' : 'Draft'}
                  </span>
                  <Link to={`/admin/materials/edit/${material.id}`} className="text-red-600 hover:text-red-900 text-sm font-medium">
                    Edit
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
