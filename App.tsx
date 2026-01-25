
import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import Navbar from './components/Navbar.tsx';
import Sidebar from './components/Sidebar.tsx';
import LandingPage from './components/LandingPage.tsx';
import { User, Trade } from './types.ts';
import { db } from './services/db.ts';
import { LayoutDashboard, List, PlusCircle, Sparkles, User as UserIcon, Loader2 } from 'lucide-react';

// Lazy load heavy views for performance
const Dashboard = lazy(() => import('./components/Dashboard.tsx'));
const TradeList = lazy(() => import('./components/TradeList.tsx'));
const AddTradeForm = lazy(() => import('./components/AddTradeForm.tsx'));
const AuthForms = lazy(() => import('./components/AuthForms.tsx'));
const LiveCoach = lazy(() => import('./components/LiveCoach.tsx'));
const AnalysisView = lazy(() => import('./components/AnalysisView.tsx'));
const DisciplineView = lazy(() => import('./components/DisciplineView.tsx'));
const UserProfile = lazy(() => import('./components/UserProfile.tsx'));
const ToolsView = lazy(() => import('./components/ToolsView.tsx'));
const AffiliateView = lazy(() => import('./components/AffiliateView.tsx'));
const TradeCalendar = lazy(() => import('./components/TradeCalendar.tsx'));
const Settings = lazy(() => import('./components/Settings.tsx'));

const ProtectedRoute: React.FC<{user: User|null, onNavigate: any, children: React.ReactNode}> = ({ user, onNavigate, children }) => {
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 flex-col px-4 text-center">
        <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6">
          <UserIcon className="h-8 w-8 text-indigo-600" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Authentication Required</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-xs">Access your professional trading journal and AI coach.</p>
        <button onClick={() => onNavigate('/login')} className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-xl hover:bg-indigo-700 transition-all">Sign In to Dashboard</button>
      </div>
    );
  }
  return <Suspense fallback={<LoadingState />}>{children}</Suspense>;
};

const LoadingState = () => (
  <div className="h-full w-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 min-h-[400px]">
    <Loader2 className="h-10 w-10 text-indigo-600 animate-spin mb-4" />
    <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Hydrating Session...</p>
  </div>
);

const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState(window.location.hash.slice(1) || '/');
  const [user, setUser] = useState<User | null>(() => db.getSession());
  const [trades, setTrades] = useState<Trade[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchUserTrades = useCallback(async (userId: string) => {
    setIsLoading(true);
    try {
      const data = await db.getTradesForUser(userId);
      setTrades(data);
    } catch (e) {
      console.error("Scale-Sync Error:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) fetchUserTrades(user.id);
  }, [user, fetchUserTrades]);

  useEffect(() => {
    const handleHashChange = () => setCurrentPath(window.location.hash.slice(1) || '/');
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (path: string) => { window.location.hash = path; };

  const handleAuthSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    navigate('/dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setTrades([]);
    db.clearSession();
    navigate('/');
  };

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('trade_adhyayan_theme');
    return saved === 'dark' ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('trade_adhyayan_theme', theme);
  }, [theme]);

  const renderContent = () => {
    switch (currentPath) {
      case '/': return user ? <Dashboard trades={trades} onNavigate={navigate} user={user} onUpdateUser={setUser} /> : <LandingPage onNavigate={navigate} />;
      case '/login': return <AuthForms type="LOGIN" onAuthSuccess={handleAuthSuccess} onNavigate={navigate} />;
      case '/signup': return <AuthForms type="SIGNUP" onAuthSuccess={handleAuthSuccess} onNavigate={navigate} />;
      case '/dashboard': return <ProtectedRoute user={user} onNavigate={navigate}><Dashboard trades={trades} onNavigate={navigate} user={user!} onUpdateUser={setUser} /></ProtectedRoute>;
      case '/trades': return <ProtectedRoute user={user} onNavigate={navigate}><TradeList trades={trades} onDeleteTrade={(id) => setTrades(t => t.filter(x => x.id !== id))} /></ProtectedRoute>;
      case '/add-trade': return <ProtectedRoute user={user} onNavigate={navigate}><AddTradeForm onAddTrade={async (t) => {
        await db.addTrade(t);
        setTrades(prev => [t, ...prev]);
      }} onNavigate={navigate} /></ProtectedRoute>;
      case '/live-coach': return <ProtectedRoute user={user} onNavigate={navigate}><LiveCoach trades={trades} /></ProtectedRoute>;
      case '/reports':
      case '/strategies':
      case '/ai-insight': return <ProtectedRoute user={user} onNavigate={navigate}><AnalysisView initialTab={currentPath.slice(1)} trades={trades} user={user} /></ProtectedRoute>;
      case '/profile': return <ProtectedRoute user={user} onNavigate={navigate}><UserProfile user={user!} onUpdateUser={setUser} /></ProtectedRoute>;
      case '/settings': return <ProtectedRoute user={user} onNavigate={navigate}><Settings theme={theme} onToggleTheme={setTheme} /></ProtectedRoute>;
      case '/tools': return <ProtectedRoute user={user} onNavigate={navigate}><ToolsView /></ProtectedRoute>;
      case '/affiliate': return <ProtectedRoute user={user} onNavigate={navigate}><AffiliateView user={user!} /></ProtectedRoute>;
      case '/calendar': return <ProtectedRoute user={user} onNavigate={navigate}><TradeCalendar trades={trades} /></ProtectedRoute>;
      case '/rules':
      case '/mistakes':
      case '/challenges':
      case '/roadmap':
      case '/tutorials': return <ProtectedRoute user={user} onNavigate={navigate}><DisciplineView initialTab={currentPath.slice(1)} trades={trades} /></ProtectedRoute>;
      default: return <LandingPage onNavigate={navigate} />;
    }
  };

  return (
    <div className={`font-sans transition-colors duration-300 ${user ? 'flex h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden' : 'min-h-screen bg-white dark:bg-slate-900'}`}>
      {user ? (
        <Sidebar user={user} onLogout={handleLogout} currentPage={currentPath} onNavigate={navigate} />
      ) : (
        currentPath !== '/' && <Navbar user={user} onLogout={handleLogout} currentPage={currentPath} onNavigate={navigate} />
      )}
      <main className={`flex-1 ${user ? 'overflow-y-auto h-full relative pt-16 md:pt-0 pb-20 md:pb-0' : ''}`}>
        <Suspense fallback={<LoadingState />}>
          {renderContent()}
        </Suspense>
      </main>
      
      {/* Mobile Bottom Navigation for Reachability */}
      {user && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-4 py-2 flex justify-around items-center z-50 pb-safe shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
          <button onClick={() => navigate('/dashboard')} className={`p-2 flex flex-col items-center flex-1 ${currentPath === '/dashboard' ? 'text-indigo-600' : 'text-slate-400'}`}>
            <LayoutDashboard className="h-5 w-5" />
            <span className="text-[9px] mt-1 font-bold uppercase tracking-tighter">Home</span>
          </button>
          <button onClick={() => navigate('/trades')} className={`p-2 flex flex-col items-center flex-1 ${currentPath === '/trades' ? 'text-indigo-600' : 'text-slate-400'}`}>
            <List className="h-5 w-5" />
            <span className="text-[9px] mt-1 font-bold uppercase tracking-tighter">Journal</span>
          </button>
          <div className="flex-1 flex justify-center -mt-8">
              <button onClick={() => navigate('/add-trade')} className="bg-indigo-600 text-white p-4 rounded-2xl shadow-xl border-4 border-slate-50 dark:border-slate-900 active:scale-90 transition-transform">
                  <PlusCircle className="h-6 w-6" />
              </button>
          </div>
          <button onClick={() => navigate('/live-coach')} className={`p-2 flex flex-col items-center flex-1 ${currentPath === '/live-coach' ? 'text-indigo-600' : 'text-slate-400'}`}>
            <Sparkles className="h-5 w-5" />
            <span className="text-[9px] mt-1 font-bold uppercase tracking-tighter">Coach</span>
          </button>
          <button onClick={() => navigate('/profile')} className={`p-2 flex flex-col items-center flex-1 ${currentPath === '/profile' ? 'text-indigo-600' : 'text-slate-400'}`}>
            <UserIcon className="h-5 w-5" />
            <span className="text-[9px] mt-1 font-bold uppercase tracking-tighter">Profile</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
