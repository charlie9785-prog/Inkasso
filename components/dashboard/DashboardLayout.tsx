import React, { ReactNode, useState } from 'react';
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  LogOut,
  Menu,
  X,
  User,
  ChevronDown,
  History,
  Link2,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { DashboardView } from '../../types/dashboard';
import { navigate } from '../../lib/navigation';
import Notifications from './Notifications';

interface DashboardLayoutProps {
  children: ReactNode;
  currentView: DashboardView;
  onViewChange: (view: DashboardView) => void;
  onSelectCase?: (caseId: string) => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  currentView,
  onViewChange,
  onSelectCase,
}) => {
  const { user, tenant, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navigation = [
    { id: 'overview' as DashboardView, label: 'Översikt', icon: LayoutDashboard },
    { id: 'cases' as DashboardView, label: 'Ärenden', icon: FileText },
    { id: 'stats' as DashboardView, label: 'Statistik', icon: BarChart3 },
    { id: 'analysis' as DashboardView, label: 'Analys', icon: History },
    { id: 'integrations' as DashboardView, label: 'Integrationer', icon: Link2 },
  ];

  const handleNavClick = (view: DashboardView) => {
    onViewChange(view);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 glass-strong border-r border-white/10 transform transition-transform duration-300 lg:transform-none ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-white/10">
            <button onClick={() => navigate('/')} className="flex items-center gap-3 group">
              <img
                src="/logo.png"
                alt="Zylora"
                className="h-8 w-auto group-hover:scale-105 transition-transform duration-300"
              />
            </button>
            <button
              className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                    isActive
                      ? 'bg-violet-500/20 text-white border border-violet-500/30'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-violet-400' : ''}`} />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User Info (Bottom) */}
          <div className="p-4 border-t border-white/10">
            <div className="glass rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{tenant?.name || user?.email}</p>
                  <p className="text-xs text-gray-500 truncate">{tenant?.org_number || ''}</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logga ut</span>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 glass-strong border-b border-white/10 flex items-center justify-between px-6">
          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Page Title */}
          <h1 className="text-lg font-display font-semibold text-white lg:ml-0 ml-4">
            {navigation.find((n) => n.id === currentView)?.label || 'Dashboard'}
          </h1>

          {/* Right side: Notifications + User Menu */}
          <div className="flex items-center gap-3">
            {/* Notifications */}
            <Notifications
              onViewCase={(caseId) => {
                if (onSelectCase) {
                  onSelectCase(caseId);
                  onViewChange('cases');
                }
              }}
            />

            {/* User Menu (Desktop) */}
            <div className="relative hidden lg:block">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 transition-colors"
              >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium text-white">{tenant?.name || user?.email}</span>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {userMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setUserMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-48 glass-strong border border-white/10 rounded-xl overflow-hidden z-50">
                  <div className="p-2">
                    <div className="px-3 py-2 border-b border-white/10 mb-2">
                      <p className="text-sm text-white font-medium">{tenant?.name || 'Användare'}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logga ut</span>
                    </button>
                  </div>
                </div>
              </>
            )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
