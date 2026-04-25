import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  TrendingUp, 
  Target, 
  Zap, 
  Clock, 
  BarChart3, 
  Activity,
  Brain,
  PlayCircle,
  LayoutGrid,
  Layers,
  Flame
} from 'lucide-react';
import { motion } from 'motion/react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, Radar,
  BarChart, Bar, Legend
} from 'recharts';
import { cn } from '../lib/utils';

export const Analytics: React.FC = () => {
  const { allGraphs } = useApp();

  const totalNodes = allGraphs.reduce((acc, g) => acc + g.nodes.length, 0);
  const completedNodes = allGraphs.reduce((acc, g) => acc + g.nodes.filter((n: any) => n.data.status === 'completed').length, 0);
  const inProgressNodes = allGraphs.reduce((acc, g) => acc + g.nodes.filter((n: any) => n.data.status === 'in-progress').length, 0);
  const lockedNodes = totalNodes - completedNodes - inProgressNodes;

  const totalEarnedXp = allGraphs.reduce((acc, g) => {
    return acc + g.nodes.reduce((nodeAcc: number, n: any) => {
      const xp = n.data.xpValue || 0;
      const progress = n.data.progress || (n.data.status === 'completed' ? 100 : 0);
      return nodeAcc + (xp * (progress / 100));
    }, 0);
  }, 0);

  // Status Distribution per Graph
  const distributionData = allGraphs.map(g => {
    const total = g.nodes.length || 1;
    return {
      name: g.name.substring(0, 10) + '...',
      fullName: g.name,
      completed: g.nodes.filter((n: any) => n.data.status === 'completed').length,
      inProgress: g.nodes.filter((n: any) => n.data.status === 'in-progress').length,
      locked: g.nodes.filter((n: any) => n.data.status !== 'completed' && n.data.status !== 'in-progress').length,
    };
  });

  // Global XP Heatmap Simulation (Grid of data)
  // We'll create a 7x4 grid of activity
  const heatmapData = Array.from({ length: 28 }, (_, i) => ({
    id: i,
    intensity: Math.floor(Math.random() * 100),
    day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i % 7],
    week: Math.floor(i / 7)
  }));

  const stats = [
    { label: 'Total XP', value: Math.round(totalEarnedXp).toLocaleString(), icon: Zap, color: 'text-primary' },
    { label: 'Mastery', value: `${Math.round((completedNodes / (totalNodes || 1)) * 100)}%`, icon: Target, color: 'text-secondary' },
    { label: 'Global Rank', value: 'Architect II', icon: Brain, color: 'text-fuchsia-500' },
    { label: 'Nodes Sync', value: `${completedNodes}/${totalNodes}`, icon: Activity, color: 'text-primary' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-24 md:pb-32 p-4 md:p-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
        >
          <div className="flex items-center gap-2 mb-2 md:mb-4">
            <div className="w-8 h-1 bg-primary rounded-full animate-pulse" />
            <span className="text-[9px] md:text-[10px] font-black uppercase text-primary tracking-[0.4em]">Neural Efficiency Protocol</span>
          </div>
          <h1 className="text-4xl md:text-7xl font-black italic tracking-tighter leading-[0.8] mb-2 uppercase">Neural<br/>Analytics</h1>
          <p className="text-on-surface-variant font-medium text-xs md:text-lg opacity-60">Deep synthesis tracking across {allGraphs.length} primary clusters</p>
        </motion.div>
        
        <div className="flex gap-2 md:gap-4 w-full md:w-auto">
          <motion.div 
            whileHover={{ y: -5, scale: 1.02 }}
            className="flex-1 md:flex-none px-4 md:px-8 py-3 md:py-4 bg-white dark:bg-white/5 rounded-2xl md:rounded-[2rem] border border-pink-50 dark:border-white/5 shadow-xl"
          >
             <p className="text-[7px] md:text-[9px] font-black text-outline dark:text-white/40 uppercase tracking-widest mb-1">Active Clusters</p>
             <p className="text-lg md:text-3xl font-black">{allGraphs.length}</p>
          </motion.div>
          <motion.div 
            whileHover={{ y: -5, scale: 1.02 }}
            className="flex-1 md:flex-none px-4 md:px-8 py-3 md:py-4 bg-primary text-white rounded-2xl md:rounded-[2rem] shadow-xl shadow-primary/20"
          >
             <p className="text-[7px] md:text-[9px] font-black text-white/50 uppercase tracking-widest mb-1">Weekly Pulse</p>
             <p className="text-lg md:text-3xl font-black">+1.2k XP</p>
          </motion.div>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
            className="bg-white dark:bg-white/5 p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] border border-pink-50 dark:border-white/5 shadow-xl flex items-center gap-4 md:gap-6 relative overflow-hidden group hover:scale-[1.05] transition-all duration-500"
          >
            <div className={cn("w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-surface-container dark:bg-white/5 flex items-center justify-center relative z-10 transition-transform group-hover:rotate-12 group-hover:scale-110", stat.color)}>
              <stat.icon className="w-6 h-6 md:w-8 md:h-8" />
            </div>
            <div className="relative z-10">
              <p className="text-[8px] md:text-[10px] font-black uppercase text-outline tracking-widest mb-1">{stat.label}</p>
              <p className="text-2xl md:text-4xl font-black text-on-surface tracking-tighter leading-none">{stat.value}</p>
            </div>
          </motion.div>
        ))}

        {/* Status Distribution Stacked Bar */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="col-span-1 sm:col-span-2 lg:col-span-3 bg-white dark:bg-white/5 p-8 md:p-12 rounded-[3rem] md:rounded-[4rem] border border-pink-50 dark:border-white/5 shadow-2xl min-h-[400px] md:h-[500px]"
        >
          <div className="flex justify-between items-center mb-6 md:mb-8">
            <div>
              <h3 className="text-xl md:text-3xl font-black flex items-center gap-2 md:gap-3 italic">
                <Layers className="text-secondary w-6 h-6 md:w-8 md:h-8" /> Topology Saturation
              </h3>
              <p className="text-[8px] md:text-xs text-outline font-black uppercase tracking-[0.2em] mt-1 ml-8 md:ml-11">Relative completion across domains</p>
            </div>
          </div>
          <div className="h-[280px] md:h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distributionData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f080c011" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 900, fill: '#888' }} width={70} />
                <Tooltip 
                  cursor={{ fill: '#f080c011' }}
                  contentStyle={{ borderRadius: '24px', border: 'none', shadow: 'none', padding: '12px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                <Bar dataKey="completed" stackId="a" fill="#e040a0" radius={[10, 0, 0, 10]} barSize={16} animationDuration={2000} />
                <Bar dataKey="inProgress" stackId="a" fill="#f080c0" barSize={16} animationDuration={2500} />
                <Bar dataKey="locked" stackId="a" fill="#ffecf5" radius={[0, 10, 10, 0]} barSize={16} animationDuration={3000} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Global XP Heatmap */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="col-span-1 sm:col-span-2 lg:col-span-1 bg-[#1a1a1a] p-8 md:p-10 rounded-[3rem] md:rounded-[4rem] shadow-2xl min-h-[400px] md:h-[500px] text-white flex flex-col"
        >
          <h3 className="text-lg md:text-xl font-black text-center mb-6 md:mb-8 flex items-center justify-center gap-2">
            <Flame className="text-primary w-5 h-5 animate-bounce" /> Neural Heatmap
          </h3>
          <div className="grid grid-cols-7 gap-1 md:gap-2 flex-1">
            {heatmapData.map((cell) => (
              <motion.div 
                key={cell.id}
                whileHover={{ scale: 1.2, zIndex: 10 }}
                className="aspect-square rounded-md md:rounded-lg transition-colors cursor-help"
                style={{ 
                  backgroundColor: `rgba(224, 64, 160, ${cell.intensity / 100})`,
                  border: cell.intensity > 80 ? '1px solid rgba(255,255,255,0.3)' : 'none'
                }}
                title={`${cell.day}: ${cell.intensity}% activity`}
              />
            ))}
          </div>
          <div className="mt-4 md:mt-6 flex justify-between items-center px-1">
            <span className="text-[7px] md:text-[8px] font-black text-white/30 uppercase tracking-widest">Low Pulse</span>
            <div className="flex gap-1">
              {[0.1, 0.3, 0.6, 0.9].map((o, i) => (
                <div key={i} className="w-2 h-2 md:w-3 md:h-3 rounded-sm" style={{ background: `rgba(224, 64, 160, ${o})` }} />
              ))}
            </div>
            <span className="text-[7px] md:text-[8px] font-black text-white/30 uppercase tracking-widest">Peak</span>
          </div>
        </motion.div>

        {/* Cognitive Load Radar */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="col-span-1 sm:col-span-2 lg:col-span-2 bg-white dark:bg-white/5 p-8 md:p-12 rounded-[3rem] md:rounded-[4rem] border border-pink-50 dark:border-white/5 shadow-2xl h-[400px] md:h-[450px]"
        >
          <div className="flex justify-between items-start mb-6 md:mb-8">
            <div>
              <h3 className="text-xl md:text-2xl font-black italic">Cognitive Load</h3>
              <p className="text-outline text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] mt-1">Difficulty per domain</p>
            </div>
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-surface-container dark:bg-white/5 flex items-center justify-center text-primary transition-transform">
               <Brain className="w-5 h-5 md:w-6 md:h-6" />
            </div>
          </div>
          <div className="h-[240px] md:h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={allGraphs.slice(0, 6).map(g => ({
                subject: g.name.split(' ')[0],
                A: g.totalXp || 100,
              }))}>
                <PolarGrid stroke="#f080c022" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#888', fontSize: 8, fontWeight: 900 }} />
                <Radar
                   name="Complexity"
                   dataKey="A"
                   stroke="#e040a0"
                   fill="#e040a0"
                   fillOpacity={0.4}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Global Mastery Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, type: "spring" }}
          className="col-span-1 sm:col-span-2 lg:col-span-2 bg-gradient-to-br from-primary to-fuchsia-600 p-8 md:p-12 rounded-[3rem] md:rounded-[4rem] shadow-2xl min-h-[400px] md:h-[450px] relative overflow-hidden group"
        >
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex justify-between items-start">
              <motion.div 
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="w-16 h-16 md:w-20 md:h-20 bg-white/20 backdrop-blur-xl rounded-2xl md:rounded-3xl flex items-center justify-center text-white"
              >
                <Flame className="w-8 h-8 md:w-12 md:h-12" />
              </motion.div>
              <div className="text-right">
                <div className="px-4 md:px-6 py-1 md:py-2 bg-white/20 backdrop-blur-xl rounded-full inline-block">
                  <span className="text-[10px] md:text-[12px] font-black uppercase tracking-widest text-white">Neural Standing</span>
                </div>
                <h4 className="text-3xl md:text-5xl font-black text-white mt-2 md:mt-4 drop-shadow-2xl italic tracking-tighter">ELITE ARCHITECT</h4>
              </div>
            </div>

            <div className="space-y-4 md:space-y-6">
              <h3 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
                <Activity className="w-5 h-5 md:w-6 md:h-6" /> Pulse Stability: 98.4%
              </h3>
              <div className="w-full h-3 md:h-4 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: '98.4%' }}
                   transition={{ duration: 2, delay: 1 }}
                   className="h-full bg-white shadow-[0_0_20px_rgba(255,255,255,0.5)]" 
                />
              </div>
              <p className="text-white/60 font-black text-[10px] md:text-xs uppercase tracking-widest leading-relaxed">
                Synthesis velocity is optimal. Neural pathways show high density. <br className="hidden md:block"/>
                Maintenance of current pulse is recommended for Tier III ascension.
              </p>
            </div>
          </div>
          <div className="absolute right-[-10%] bottom-[-10%] opacity-10 group-hover:rotate-12 group-hover:scale-110 transition-all duration-1000">
             <Activity size={300} className="text-white" />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

