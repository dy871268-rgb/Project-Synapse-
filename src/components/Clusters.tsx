import React from 'react';
import { useApp } from '../context/AppContext';
import { Share2, Plus, MoreVertical, Archive, Brain, Clock, Zap, Target, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export const Clusters: React.FC = () => {
  const { allGraphs, setActiveGraph, setCurrentView, saveGraph, deleteGraph } = useApp();

  const createNewGraph = () => {
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
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 p-4 md:p-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-2 md:px-6">
        <div>
          <p className="text-[9px] md:text-[10px] font-black uppercase text-primary tracking-[0.3em] mb-1 md:mb-2 text-center md:text-left">Neural Network Management</p>
          <h1 className="text-4xl md:text-6xl font-black font-headline text-on-background tracking-tighter italic leading-none text-center md:text-left uppercase">Topology Browser</h1>
        </div>
        <button 
          onClick={createNewGraph}
          className="w-full md:w-auto flex items-center justify-center gap-3 bg-primary text-white px-6 md:px-10 py-4 md:py-5 rounded-2xl md:rounded-[2rem] font-black shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Plus className="w-5 h-5 md:w-6 md:h-6" /> Create Neural Path
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 px-2 md:px-6">
        {allGraphs.map((graph, i) => {
          const completedCount = graph.nodes.filter((n: any) => n.data.status === 'completed').length;
          const totalNodes = graph.nodes.length || 1;
          const progress = Math.round((completedCount / totalNodes) * 100);

          return (
            <motion.div
              key={graph.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-white/5 rounded-[2.5rem] md:rounded-[3rem] border border-pink-50 dark:border-white/5 p-6 md:p-8 shadow-xl hover:shadow-2xl transition-all group flex flex-col h-full relative overflow-hidden"
            >
              {/* Progress Background */}
              <div 
                className="absolute bottom-0 left-0 h-1 bg-primary/20 transition-all duration-1000" 
                style={{ width: `${progress}%` }} 
              />

              <div className="flex justify-between items-start mb-4 md:mb-6">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-surface-container dark:bg-white/5 flex items-center justify-center text-primary">
                  <Brain className="w-6 h-6 md:w-8 md:h-8" />
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "px-3 py-1 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest",
                    progress === 100 ? "bg-secondary/10 text-secondary" : "bg-primary/10 text-primary"
                  )}>
                    {progress}% Mastery
                  </span>
                </div>
              </div>

              <div className="flex-1 space-y-3 md:space-y-4">
                <h3 className="text-xl md:text-2xl font-black tracking-tight text-on-surface line-clamp-1 italic">{graph.name}</h3>
                <p className="text-xs md:text-sm text-on-surface-variant font-medium line-clamp-2 leading-relaxed opacity-70">
                  {graph.description || "Synthesizing new neural connections for advanced mastery..."}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 md:gap-4 py-6 md:py-8 border-t border-b border-pink-50 dark:border-white/5 my-4 md:my-6">
                <div className="text-center">
                  <p className="text-[8px] md:text-[9px] font-black text-outline uppercase tracking-widest mb-1">Nodes</p>
                  <p className="text-lg md:text-xl font-black text-on-surface">{graph.nodes.length}</p>
                </div>
                <div className="text-center">
                  <p className="text-[8px] md:text-[9px] font-black text-outline uppercase tracking-widest mb-1">XP Value</p>
                  <p className="text-lg md:text-xl font-black text-on-surface">{graph.totalXp || 0}</p>
                </div>
                <div className="text-center">
                  <p className="text-[8px] md:text-[9px] font-black text-outline uppercase tracking-widest mb-1">Updated</p>
                  <p className="text-lg md:text-xl font-black text-on-surface flex items-center justify-center gap-1">
                    <Clock className="w-2.5 h-2.5 md:w-3 md:h-3 text-outline" /> 2h
                  </p>
                </div>
              </div>

              <div className="flex gap-2 md:gap-3">
                <button 
                  onClick={() => { setActiveGraph(graph); setCurrentView('graph'); }}
                  className="flex-1 bg-surface-container dark:bg-white/5 text-on-surface py-3 md:py-4 rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all"
                >
                  Enter Sequence
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(`Sever link to ${graph.name}? This cannot be undone.`)) {
                      deleteGraph(graph.id);
                    }
                  }}
                  className="p-3 md:p-4 bg-surface-container-low dark:bg-white/5 text-outline hover:text-red-500 rounded-xl md:rounded-2xl transition-colors"
                >
                  <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>
            </motion.div>
          );
        })}

        {/* Empty State / placeholder for more */}
        <motion.button 
          onClick={createNewGraph}
          className="border-4 border-dashed border-pink-100 rounded-[3rem] p-8 flex flex-col items-center justify-center h-full min-h-[350px] group hover:border-primary/30 transition-all opacity-50 hover:opacity-100"
        >
          <div className="w-20 h-20 rounded-full bg-pink-50 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
            <Plus className="w-10 h-10" />
          </div>
          <span className="mt-6 text-sm font-black uppercase text-outline tracking-[0.2em]">Initiate New Topology</span>
        </motion.button>
      </div>
    </div>
  );
};
