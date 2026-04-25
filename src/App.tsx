import React from 'react';
import { useApp } from './context/AppContext';
import { Dashboard } from './components/Dashboard';
import { GraphView } from './components/GraphView';
import { Sidebar } from './components/Sidebar';
import { Settings } from './components/Settings';
import { Clusters } from './components/Clusters';
import { Analytics } from './components/Analytics';
import { Leaderboard } from './components/Leaderboard';
import { 
  Maximize2, 
  Minimize2, 
  Grid3X3, 
  Wand2, 
  Menu,
  ChevronLeft,
  Network,
  Settings as SettingsIcon,
  Plus,
  Trophy,
  X
} from 'lucide-react';
import { cn } from './lib/utils';

export default function App() {
  const { currentView, setCurrentView, createNewNode } = useApp();

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard />;
      case 'graph': return <GraphView />;
      case 'clusters': return <Clusters />;
      case 'analytics': return <Analytics />;
      case 'settings': return <Settings />;
      case 'leaderboard': return <Leaderboard />;
      default: return (
        <div className="flex flex-col items-center justify-center h-full gap-4 text-outline">
          <Wand2 className="w-16 h-16 animate-pulse" />
          <h2 className="text-2xl font-black italic tracking-tighter">Synthesizing Module...</h2>
          <button 
            onClick={() => setCurrentView('dashboard')}
            className="flex items-center gap-2 text-primary font-bold hover:underline"
          >
            <ChevronLeft className="w-4 h-4" /> Return to Core
          </button>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col md:flex-row">
      {/* Mobile Header */}
      <header className="md:hidden flex justify-between items-center w-full px-6 py-4 bg-white/80 backdrop-blur-md border-b-2 border-pink-100 z-50 sticky top-0">
        <h1 className="text-2xl font-black text-primary italic font-headline tracking-tighter">Synapse</h1>
        <button onClick={() => {}} className="p-2 hover:bg-pink-50 rounded-full text-primary">
          <Menu className="w-6 h-6" />
        </button>
      </header>

      <Sidebar />

      {/* Main Container */}
      <main className={cn(
        "flex-1 transition-all duration-500 overflow-hidden",
        currentView === 'graph' ? "p-0 md:ml-72 relative" : "p-6 md:p-12 md:ml-72 relative"
      )}>
        {renderContent()}
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-4 bg-white/90 dark:bg-black/80 backdrop-blur-xl rounded-full px-6 py-3 border border-pink-50 dark:border-white/10 shadow-2xl overflow-x-auto scrollbar-hide max-w-[90vw]">
        <button onClick={() => setCurrentView('dashboard')} className={cn("flex flex-col items-center shrink-0 min-w-[50px]", currentView === 'dashboard' ? "text-primary" : "text-outline")}>
          <Grid3X3 className="w-5 h-5" />
          <span className="text-[6px] font-black uppercase tracking-widest mt-1">Home</span>
        </button>
        <button onClick={() => setCurrentView('graph')} className={cn("flex flex-col items-center shrink-0 min-w-[50px]", currentView === 'graph' ? "text-primary" : "text-outline")}>
          <Network className="w-5 h-5" />
          <span className="text-[6px] font-black uppercase tracking-widest mt-1">Canvas</span>
        </button>
        <button onClick={() => setCurrentView('leaderboard')} className={cn("flex flex-col items-center shrink-0 min-w-[50px]", currentView === 'leaderboard' ? "text-primary" : "text-outline")}>
          <Trophy className="w-5 h-5" />
          <span className="text-[6px] font-black uppercase tracking-widest mt-1">Leaders</span>
        </button>
        <button onClick={() => setCurrentView('clusters')} className={cn("flex flex-col items-center shrink-0 min-w-[50px]", currentView === 'clusters' ? "text-primary" : "text-outline")}>
          <Grid3X3 className="w-5 h-5" />
          <span className="text-[6px] font-black uppercase tracking-widest mt-1">Bank</span>
        </button>
        <button onClick={() => setCurrentView('settings')} className={cn("flex flex-col items-center shrink-0 min-w-[50px]", currentView === 'settings' ? "text-primary" : "text-outline")}>
          <SettingsIcon className="w-5 h-5" />
          <span className="text-[6px] font-black uppercase tracking-widest mt-1">Config</span>
        </button>
      </nav>
    </div>
  );
}
