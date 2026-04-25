import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  LayoutGrid, 
  Share2, 
  Network, 
  Settings, 
  TrendingUp, 
  LogOut,
  Sparkles,
  Plus,
  Trophy
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { Key } from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { currentView, setCurrentView, allGraphs, setActiveGraph, saveGraph, userProfile } = useApp();
  const [showQuickSwitch, setShowQuickSwitch] = React.useState(false);
  const [apiKey, setApiKey] = React.useState(localStorage.getItem('gemini_api_key') || '');
  const [showApiKeyInput, setShowApiKeyInput] = React.useState(false);

  const createNewGraph = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newGraph = {
      id: `graph-${Date.now()}`,
      name: 'Untitled Neural Path',
      description: 'A new sequence for cognitive expansion.',
      lastUpdated: new Date().toISOString(),
      totalXp: 0,
      nodes: [],
      edges: []
    };
    saveGraph(newGraph);
    setActiveGraph(newGraph);
    setCurrentView('graph');
    setShowQuickSwitch(false);
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
    { id: 'graph', label: 'Skill Tree', icon: Network },
    { id: 'clusters', label: 'Clusters', icon: Share2 },
    { id: 'leaderboard', icon: Trophy, label: 'Leaderboard' },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className={cn(
      "fixed left-0 top-0 h-full flex flex-col py-8 gap-4 bg-white dark:bg-surface-container-low w-72 rounded-r-[40px] border-r-2 border-pink-50 dark:border-white/5 shadow-[10px_0_30px_rgba(224,64,160,0.1)] z-50 transition-transform duration-500 md:translate-x-0",
      isOpen ? "translate-x-0" : "-translate-x-full"
    )}>
      {onClose && (
        <button 
          onClick={onClose}
          className="md:hidden absolute top-4 -right-12 p-2 bg-white dark:bg-surface-container-low rounded-r-xl border-y-2 border-r-2 border-pink-50 dark:border-white/5 text-primary shadow-lg"
        >
          <Plus className="w-6 h-6 rotate-45" />
        </button>
      )}
      <div className="px-8 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="text-primary w-6 h-6" />
          <h1 className="text-xl font-black text-primary font-headline tracking-tight italic">Project Synapse</h1>
        </div>
        <div className="flex items-center gap-3 mt-4 p-3 bg-surface-container dark:bg-white/5 rounded-3xl border border-outline-variant">
          <img 
            src={userProfile.avatar} 
            className="w-10 h-10 rounded-2xl object-cover border-2 border-primary/20"
            alt="Profile"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-black text-on-surface truncate">{userProfile.name}</p>
            <div className="flex items-center justify-between text-[8px] font-black uppercase text-primary tracking-tighter">
               <span>Lvl {userProfile.level}</span>
               <span className="text-outline uppercase">{userProfile.rank}</span>
            </div>
            <div className="w-full h-1 bg-background dark:bg-surface-container-high rounded-full overflow-hidden mt-1">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: `${userProfile.xp % 100}%` }}
                 className="h-full bg-primary"
               />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 space-y-2 relative">
        {menuItems.map((item) => (
          <div 
            key={item.id}
            onMouseEnter={() => item.id === 'graph' && setShowQuickSwitch(true)}
            onMouseLeave={() => item.id === 'graph' && setShowQuickSwitch(false)}
            className="relative"
          >
            <button
              onClick={() => setCurrentView(item.id as any)}
              className={cn(
                "w-full flex items-center gap-4 py-3 px-6 rounded-full font-medium text-sm transition-all duration-300 group hover:translate-x-1",
                currentView === item.id 
                  ? "bg-primary text-white shadow-lg shadow-primary/30" 
                  : "text-outline hover:bg-pink-50 hover:text-primary"
              )}
            >
              <item.icon className={cn("w-5 h-5", currentView === item.id ? "text-white" : "group-hover:text-primary")} />
              {item.label}
            </button>

            {item.id === 'graph' && (
              <AnimatePresence>
                {showQuickSwitch && (
                  <motion.div 
                    initial={{ opacity: 0, x: -20, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -10, scale: 0.95 }}
                    className="absolute left-[105%] top-0 w-64 bg-white rounded-3xl shadow-2xl border border-pink-50 p-4 z-50 max-h-[400px] overflow-y-auto scrollbar-hide"
                  >
                    <div className="flex justify-between items-center mb-4 px-2">
                       <span className="text-[10px] font-black uppercase text-outline tracking-widest">Active Paths</span>
                       <button onClick={createNewGraph} className="p-1.5 hover:bg-pink-50 rounded-lg text-primary transition-colors">
                          <Plus className="w-4 h-4" />
                       </button>
                    </div>
                    <div className="space-y-1">
                      {allGraphs.map(g => (
                        <button
                          key={g.id}
                          onClick={() => { setActiveGraph(g); setCurrentView('graph'); }}
                          className="w-full text-left p-3 rounded-xl hover:bg-pink-50 transition-colors group/item"
                        >
                          <p className="text-xs font-bold text-on-surface line-clamp-1 group-hover/item:text-primary">{g.name}</p>
                          <p className="text-[9px] text-outline font-black uppercase tracking-wider">{g.nodes.length} Nodes</p>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        ))}
      </div>

      <div className="px-6 mt-auto space-y-4">
        <div className="relative">
          <button 
            onClick={() => setShowApiKeyInput(!showApiKeyInput)}
            className={cn(
              "w-full flex items-center justify-center gap-3 py-3 rounded-full font-black text-[10px] uppercase tracking-widest transition-all",
              apiKey ? "bg-secondary/10 text-secondary" : "bg-primary/10 text-primary"
            )}
          >
            <Key className="w-4 h-4" /> {apiKey ? 'API KEY ACTIVE' : 'ENTER API KEY'}
          </button>
          
          <AnimatePresence>
            {showApiKeyInput && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-full left-0 right-0 mb-4 bg-white dark:bg-surface-container p-4 rounded-3xl shadow-2xl border border-pink-50 dark:border-white/10 space-y-4"
              >
                <div className="flex justify-between items-center">
                  <p className="text-[10px] font-black uppercase text-outline tracking-widest leading-none">Neural API Key</p>
                  <button onClick={() => setShowApiKeyInput(false)} className="text-outline hover:text-primary"><Plus className="w-4 h-4 rotate-45" /></button>
                </div>
                <input 
                  type="password"
                  placeholder="Paste GEMINI_API_KEY..."
                  className="w-full bg-surface-container dark:bg-white/5 p-3 rounded-xl text-xs font-mono outline-none border border-outline-variant focus:border-primary transition-colors"
                  value={apiKey}
                  onChange={(e) => {
                    setApiKey(e.target.value);
                    localStorage.setItem('gemini_api_key', e.target.value);
                  }}
                />
                <p className="text-[8px] text-outline leading-tight font-medium">
                  Locally persistence only. Used for autonomous engram synthesis and neural path expansion.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button 
          onClick={() => {
            setCurrentView('settings');
            onClose?.();
          }}
          className="w-full bg-primary-container text-on-primary-container font-bold py-4 rounded-full shadow-md hover:scale-[1.02] active:scale-95 transition-all bento-glow"
        >
          Synthesize Archive
        </button>
      </div>
    </nav>
  );
};
