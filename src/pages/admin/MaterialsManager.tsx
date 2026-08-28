import { useState, useEffect } from 'react';
import { collection, query, getDocs, deleteDoc, doc, orderBy, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { StudyMaterial } from '../../types';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Edit, Trash2, Plus, Search, Eye, Download } from 'lucide-react';

export function MaterialsManager() {
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchMaterials = async () => {
    try {
      const q = query(collection(db, 'studyMaterials'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as StudyMaterial));
      
      // Auto-migrate corrupted 'Question Paper' records to 'Chapter'
      let needsRefresh = false;
      for (const m of data) {
        if (m.materialType === 'Question Paper' && m.id) {
          try {
            await updateDoc(doc(db, 'studyMaterials', m.id), { materialType: 'Chapter' });
            m.materialType = 'Chapter';
            needsRefresh = true;
          } catch (e) {
            console.error("Migration failed for", m.id);
          }
        }
      }
      
      setMaterials(data);
    } catch (error) {
      console.error('Error fetching materials:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this study material?')) {
      try {
        await deleteDoc(doc(db, 'studyMaterials', id));
        setMaterials(materials.filter(m => m.id !== id));
      } catch (error) {
        console.error('Error deleting material:', error);
      }
    }
  };

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, 'studyMaterials', id), {
        isPublished: !currentStatus,
        updatedAt: new Date().toISOString()
      });
      setMaterials(materials.map(m => 
        m.id === id ? { ...m, isPublished: !currentStatus } : m
      ));
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const filteredMaterials = materials.filter(m => 
    m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.classLevel.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Study Materials</h1>
        <Link
          to="/admin/materials/add"
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Add New Material
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div className="relative rounded-md shadow-sm max-w-sm w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-md py-2 px-3 border outline-none"
              placeholder="Search materials..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Title</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Category</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Stats</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center">
                    <div className="flex justify-center"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div></div>
                  </td>
                </tr>
              ) : filteredMaterials.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-slate-500">
                    No materials found.
                  </td>
                </tr>
              ) : (
                filteredMaterials.map((material) => (
                  <tr key={material.id}>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-slate-900">{material.title}</span>
                        <span className="text-xs text-slate-500">{format(new Date(material.createdAt), 'MMM d, yyyy')}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800 w-fit">
                          {material.classLevel}
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 w-fit">
                          {material.subject}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1 text-sm text-slate-500">
                        <span className="flex items-center gap-1"><Eye className="h-3 w-3"/> {material.viewCount || 0}</span>
                        <span className="flex items-center gap-1"><Download className="h-3 w-3"/> {material.downloadCount || 0}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button 
                        onClick={() => handleTogglePublish(material.id!, material.isPublished)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                          material.isPublished ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                        }`}
                      >
                        {material.isPublished ? 'Published' : 'Draft'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-3">
                        <Link to={`/admin/materials/edit/${material.id}`} className="text-blue-600 hover:text-blue-900">
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button onClick={() => handleDelete(material.id!)} className="text-red-600 hover:text-red-900">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
