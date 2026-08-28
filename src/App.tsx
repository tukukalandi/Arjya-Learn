import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { PublicLayout } from './components/layout/PublicLayout';
import { AdminLayout } from './components/layout/AdminLayout';
import { ProtectedRoute } from './components/ProtectedRoute';

// Public Pages
import { Home } from './pages/public/Home';
import { Classes } from './pages/public/Classes';
import { ClassDetails } from './pages/public/ClassDetails';
import { TypeDetails } from './pages/public/TypeDetails';
import { Olympiad } from './pages/public/Olympiad';
import { Materials } from './pages/public/Materials';
import { MaterialDetails } from './pages/public/MaterialDetails';
import { Login } from './pages/Login';

// Admin Pages
import { Dashboard } from './pages/admin/Dashboard';
import { MaterialsManager } from './pages/admin/MaterialsManager';
import { MaterialForm } from './pages/admin/MaterialForm';
import { CategoriesManager } from './pages/admin/CategoriesManager';
import { AdminsManager } from './pages/admin/AdminsManager';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/classes" element={<PublicLayout><Classes /></PublicLayout>} />
          <Route path="/class/:className" element={<PublicLayout><ClassDetails /></PublicLayout>} />
          <Route path="/type/:materialType" element={<PublicLayout><TypeDetails /></PublicLayout>} />
          <Route path="/olympiad" element={<PublicLayout><Olympiad /></PublicLayout>} />
          <Route path="/materials" element={<PublicLayout><Materials /></PublicLayout>} />
          <Route path="/material/:id" element={<PublicLayout><MaterialDetails /></PublicLayout>} />
          <Route path="/login" element={<Login />} />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout><Dashboard /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/materials" element={
            <ProtectedRoute>
              <AdminLayout><MaterialsManager /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/materials/add" element={
            <ProtectedRoute>
              <AdminLayout><MaterialForm /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/materials/edit/:id" element={
            <ProtectedRoute>
              <AdminLayout><MaterialForm /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/categories" element={
            <ProtectedRoute>
              <AdminLayout><CategoriesManager /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/admins" element={
            <ProtectedRoute>
              <AdminLayout><AdminsManager /></AdminLayout>
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
