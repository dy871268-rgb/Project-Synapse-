import React, { createContext, useContext, useState, useEffect } from 'react';
import { GraphState, ViewType } from '../types';
import { PREBUILT_GRAPHS } from '../constants';

interface AppContextType {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  activeGraph: GraphState;
  setActiveGraph: (graph: GraphState) => void;
  allGraphs: GraphState[];
  saveGraph: (graph: GraphState) => void;
  deleteGraph: (id: string) => void;
  selectedNodeId: string | null;
  setSelectedNodeId: (id: string | null) => void;
  createNewNode: () => void;
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
  randomizeAllXp: () => void;
  userProfile: {
    name: string;
    level: number;
    xp: number;
    rank: string;
    avatar: string;
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [activeGraph, setActiveGraph] = useState<GraphState>(PREBUILT_GRAPHS[0]);
  const [allGraphs, setAllGraphs] = useState<GraphState[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('synapse_dark_mode') === 'true');

  const totalXp = allGraphs.reduce((acc, g) => acc + (g.totalXp || 0), 0);
  const level = Math.floor(Math.sqrt(totalXp / 100)) + 1;
  const rank = level > 10 ? 'Neural Architect' : level > 5 ? 'Synapse Weaver' : 'Mind Initiate';

  const userProfile = {
    name: "Architect Prime",
    level,
    xp: totalXp,
    rank,
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop"
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('synapse_dark_mode', String(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    const saved = localStorage.getItem('synapse_graphs');
    if (saved) {
      const parsed = JSON.parse(saved);
      setAllGraphs(parsed);
      const current = parsed.find((g: any) => g.id === activeGraph.id);
      if (current) setActiveGraph(current);
    } else {
      setAllGraphs(PREBUILT_GRAPHS);
    }
  }, []);

  const saveGraph = (graph: GraphState) => {
    // Recalculate total XP based on nodes
    const totalXp = graph.nodes.reduce((acc, node) => acc + (node.data?.xpValue || 0), 0);
    const graphWithTotalXp = { ...graph, totalXp };

    setAllGraphs(prev => {
      const updated = prev.map(g => g.id === graph.id ? graphWithTotalXp : g);
      if (!updated.find(g => g.id === graphWithTotalXp.id)) {
        updated.push(graphWithTotalXp);
      }
      localStorage.setItem('synapse_graphs', JSON.stringify(updated));
      return updated;
    });
    if (activeGraph.id === graphWithTotalXp.id) {
      setActiveGraph(graphWithTotalXp);
    }
  };

  const createNewNode = () => {
    const id = `node-${Date.now()}`;
    const newNode = {
      id,
      type: 'custom',
      position: { x: window.innerWidth / 2 - 300, y: 300 },
      data: { 
        label: 'New Neural Node', 
        type: 'core', 
        status: 'unlocked' as any, 
        progress: 0, 
        estimatedTime: '2h', 
        xpValue: 100,
        description: 'Synthesizing new knowledge...'
      },
    };
    const updated = {
      ...activeGraph,
      nodes: [...activeGraph.nodes, newNode],
      lastUpdated: new Date().toISOString()
    };
    saveGraph(updated);
    setSelectedNodeId(id);
  };

  const deleteGraph = (id: string) => {
    const updated = allGraphs.filter(g => g.id !== id);
    setAllGraphs(updated);
    localStorage.setItem('synapse_graphs', JSON.stringify(updated));
    if (activeGraph.id === id) {
      setActiveGraph(PREBUILT_GRAPHS[0]);
    }
  };

  const randomizeAllXp = () => {
    const updatedGraphs = allGraphs.map(graph => {
      const updatedNodes = graph.nodes.map(node => ({
        ...node,
        data: {
          ...node.data,
          xpValue: Math.floor(Math.random() * 500) + 100,
          estimatedTime: `${Math.floor(Math.random() * 10) + 1}h`
        }
      }));
      const totalXp = updatedNodes.reduce((acc, n) => acc + (n.data?.xpValue || 0), 0);
      return { ...graph, nodes: updatedNodes, totalXp };
    });
    
    setAllGraphs(updatedGraphs);
    localStorage.setItem('synapse_graphs', JSON.stringify(updatedGraphs));
    
    if (activeGraph) {
      const active = updatedGraphs.find(g => g.id === activeGraph.id);
      if (active) setActiveGraph(active);
    }
  };

  return (
    <AppContext.Provider value={{ 
      currentView, setCurrentView, 
      activeGraph, setActiveGraph, 
      allGraphs, saveGraph, deleteGraph,
      selectedNodeId, setSelectedNodeId,
      createNewNode,
      isDarkMode, setIsDarkMode,
      randomizeAllXp,
      userProfile
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
