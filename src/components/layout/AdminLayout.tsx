import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Tags, 
  Users, 
  LogOut, 
  Menu, 
  X,
  BookOpen
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../lib/utils';

export function AdminLayout({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Study Materials', href: '/admin/materials', icon: FileText },
    { name: 'Categories', href: '/admin/categories', icon: Tags },
    { name: 'Admins', href: '/admin/admins', icon: Users },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row font-sans">
      {/* Mobile Sidebar overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-[#0B1120] text-slate-300 transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0 border-r border-slate-800",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-16 flex items-center justify-between px-6 bg-[#0B1120] border-b border-slate-800">
          <Link to="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-xl">E</span>
            </div>
            <span className="font-bold text-lg text-white">Admin<span className="text-blue-500">Portal</span></span>
          </Link>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-slate-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="py-6 flex flex-col h-[calc(100vh-4rem)]">
          <nav className="flex-1 px-4 space-y-1.5">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href || (item.href !== '/admin' && location.pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-lg text-sm font-semibold transition-all group",
                    isActive 
                      ? "bg-blue-600/10 text-blue-500" 
                      : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                  )}
                >
                  <item.icon className={cn("mr-3 h-5 w-5 transition-colors", isActive ? "text-blue-500" : "text-slate-500 group-hover:text-slate-400")} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          
          <div className="p-4 mx-4 mt-auto bg-slate-900/50 rounded-xl border border-slate-800">
            <div className="flex items-center mb-4">
              <div className="w-9 h-9 rounded-md bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                {user?.email?.[0].toUpperCase()}
              </div>
              <div className="ml-3 overflow-hidden">
                <p className="text-sm font-bold text-slate-200 truncate">{user?.email}</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold truncate">Administrator</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex w-full items-center justify-center px-3 py-2 rounded-md text-xs font-bold text-slate-400 hover:bg-slate-800 hover:text-white transition-colors border border-slate-700/50"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC]">
        {/* Top Header (Visible on Desktop & Mobile) */}
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 border-b border-slate-200">
          <div className="flex items-center">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="text-slate-500 hover:text-slate-700 focus:outline-none md:hidden mr-4"
            >
              <span className="sr-only">Open sidebar</span>
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
            <span className="font-bold text-slate-800 md:hidden">Admin Portal</span>
          </div>
          <div className="flex items-center ml-auto">
            <Link to="/" className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-md transition-colors">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Return to Website</span>
              <span className="sm:hidden">Website</span>
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
