import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Trophy, 
  Lightbulb, 
  CheckCircle2, 
  PlayCircle, 
  History, 
  Plus, 
  PlusCircle,
  Zap,
  ArrowRight,
  Brain,
  Sparkles,
  Layers,
  Activity,
  Flame,
  ArrowUpRight
} from 'lucide-react';
import { motion } from 'motion/react';
import { generateSkillTree } from '../services/geminiService';
import { cn } from '../lib/utils';

export const Dashboard: React.FC = () => {
  const { allGraphs, activeGraph, setActiveGraph, setCurrentView, saveGraph, randomizeAllXp } = useApp();
  const [isGenerating, setIsGenerating] = useState(false);
  const [topic, setTopic] = useState("");

  React.useEffect(() => {
    // Randomize XP on first dashboard visit if not set
    const hasXp = allGraphs.some(g => g.totalXp && g.totalXp > 0);
    if (!hasXp && allGraphs.length > 0) {
      randomizeAllXp?.();
    }
  }, [allGraphs, randomizeAllXp]);

  const handleGenerate = async () => {
    if (!topic) return;
    setIsGenerating(true);
    try {
      const data = await generateSkillTree(topic);
      const newGraph = {
        id: `ai-${Date.now()}`,
        name: topic,
        description: `AI-generated roadmap for ${topic}`,
        lastUpdated: new Date().toISOString(),
        nodes: data.nodes.map((n: any) => ({ ...n, type: 'custom', selected: false })),
        edges: data.edges
      };
      saveGraph(newGraph as any);
      setActiveGraph(newGraph as any);
      setCurrentView('graph');
    } catch (e) {
      alert("Failed to generate tree. Check your API key.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-32 space-y-16 md:space-y-24">
      {/* Hero Section */}
      <section className="relative h-[450px] sm:h-[500px] md:h-[700px] flex items-center justify-center overflow-hidden rounded-[2.5rem] md:rounded-[5rem] group mx-2 md:mx-0 shadow-3xl bg-black">
        <motion.div 
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute inset-0 z-0"
        >
          <img 
            src="input_file_0.png" 
            className="w-full h-full object-cover transition-transform duration-[15s] group-hover:scale-110 opacity-70"
            alt="Neural Background"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-primary/20 mix-blend-overlay" />
        </motion.div>

        <div className="relative z-10 text-center px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, type: "spring" }}
            className="flex flex-col items-center gap-8"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="hidden md:inline-flex px-8 py-3 bg-white/10 backdrop-blur-2xl rounded-full border border-white/20 items-center gap-4 shadow-2xl"
            >
              <span className="relative flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-primary"></span>
              </span>
              <span className="text-xs font-black uppercase text-white tracking-[0.5em] drop-shadow-md">Neural Synapse Protocol Active</span>
            </motion.div>
            
            <h1 className="text-4xl sm:text-7xl md:text-9xl font-black italic text-white tracking-tighter leading-[0.85] uppercase drop-shadow-2xl">
              Synthesize<br/>
              <span className="text-primary italic">Intelligence</span>
            </h1>
            
            <p className="text-white/80 text-sm sm:text-lg md:text-2xl font-medium max-w-2xl leading-relaxed drop-shadow-lg">
              Architect your own cognitive evolution. Map complex domains and transcend your mental limits through neural engram optimization.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 mt-6">
              <motion.button 
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(224,64,160,0.4)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentView('clusters')}
                className="px-8 md:px-12 py-4 md:py-6 bg-primary text-white rounded-full font-black text-lg md:text-xl shadow-2xl flex items-center justify-center gap-4 group"
              >
                Launch Architect <ArrowRight className="w-5 md:w-6 h-5 md:h-6 group-hover:translate-x-2 transition-transform" />
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05, background: "rgba(255,255,255,0.2)" }}
                className="hidden md:block px-8 md:px-12 py-4 md:py-6 bg-white/10 backdrop-blur-md text-white rounded-full font-black text-lg md:text-xl border border-white/20 transition-all shadow-xl"
              >
                Quick Neural Scan
              </motion.button>
            </div>
          </motion.div>
        </div>

        <div className="hidden md:flex absolute bottom-8 md:bottom-16 left-8 md:left-16 right-8 md:right-16 z-10 flex justify-between items-end">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 0.6, x: 0 }}
            transition={{ delay: 1.5 }}
            className="space-y-0.5 md:space-y-2"
          >
            <p className="text-[7px] md:text-[10px] font-black text-white uppercase tracking-widest">Active Engrams</p>
            <p className="text-xl md:text-4xl font-black text-white">{allGraphs.reduce((acc, g) => acc + g.nodes.length, 0)} Nodes</p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 0.6, x: 0 }}
            transition={{ delay: 1.5 }}
            className="text-right space-y-0.5 md:space-y-2 text-white"
          >
            <p className="text-[7px] md:text-[10px] font-black uppercase tracking-widest">Topology Integrity</p>
            <p className="text-xl md:text-4xl font-black font-mono">99.98%</p>
          </motion.div>
        </div>
      </section>

      {/* Synthesis Section */}
      <section className="px-4 md:px-0">
        <motion.div
           initial={{ opacity: 0, y: 100 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true, margin: "-100px" }}
           transition={{ duration: 1, type: "spring" }}
           className="bg-white dark:bg-surface-container-low rounded-[2rem] md:rounded-[5rem] p-8 md:p-16 border-2 border-pink-50 dark:border-white/5 shadow-2xl relative overflow-hidden"
        >
          <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-center text-center md:text-left">
            <div className="flex-1 space-y-6 md:space-y-8 flex flex-col items-center md:items-start w-full">
               <div className="inline-flex items-center gap-3 bg-pink-50 dark:bg-white/5 px-4 md:px-6 py-2 rounded-full">
                  <Sparkles className="w-4 md:w-5 h-4 md:h-5 text-primary animate-pulse" />
                  <span className="text-[9px] md:text-xs font-black uppercase text-primary tracking-[0.3em]">AI Synthesis Engine</span>
               </div>
               <h2 className="text-3xl md:text-6xl font-black italic tracking-tighter leading-tight uppercase">Automated Skill<br/>Generation</h2>
               <p className="text-on-surface-variant text-sm md:text-xl font-medium leading-relaxed opacity-70 max-w-xl">
                 Input any domain and watch as the Synapse AI constructs a multi-tiered neural roadmap tailored to your cognitive profile.
               </p>
               <div className="flex flex-col sm:flex-row gap-3 p-1 md:p-2 md:bg-surface-container md:dark:bg-surface-container-high rounded-3xl md:rounded-full md:border md:border-outline-variant w-full max-w-lg">
                  <input 
                    placeholder="Enter a domain e.g. Quantum Computing..."
                    className="flex-1 bg-surface-container dark:bg-surface-container-high md:bg-transparent px-6 py-4 rounded-2xl md:rounded-none outline-none font-medium text-sm md:text-lg placeholder:opacity-30 w-full"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                  />
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="px-8 py-4 md:py-0 bg-primary text-white rounded-2xl md:rounded-full font-black shadow-xl disabled:opacity-50 whitespace-nowrap"
                  >
                    {isGenerating ? "Synthesizing..." : "Generate"}
                  </motion.button>
               </div>
            </div>
            <div className="w-48 h-48 md:w-1/3 md:aspect-square bg-pink-50 dark:bg-white/5 rounded-[2.5rem] md:rounded-[4rem] relative flex items-center justify-center group shrink-0">
               <motion.div 
                 animate={{ rotate: 360 }}
                 transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                 className="absolute inset-4 border-4 border-dashed border-primary/20 rounded-full"
               />
               <Brain className="w-20 h-20 md:w-40 md:h-40 text-primary group-hover:scale-110 transition-transform duration-700" />
               <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent" />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Grid Sections */}
      <section className="space-y-8 md:space-y-12 px-4 md:px-0">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 md:gap-6">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-center md:text-left w-full"
          >
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2 md:mb-4">
              <div className="w-6 md:w-8 h-1 bg-primary rounded-full" />
              <span className="text-[9px] md:text-[10px] font-black uppercase text-primary tracking-[0.4em]">Neural Topology</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter leading-none mb-2 uppercase">Active Clusters</h2>
            <p className="text-on-surface-variant font-medium text-sm md:text-lg opacity-60">High-density knowledge branches</p>
          </motion.div>
          <button 
            onClick={() => setCurrentView('clusters')}
            className="w-full md:w-auto flex items-center justify-center gap-3 text-[10px] md:text-sm font-black uppercase tracking-widest hover:text-primary transition-colors"
          >
            Manage Clusters <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allGraphs.slice(0, 3).map((cluster, i) => (
            <motion.div
              key={cluster.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, type: "spring" }}
              whileHover={{ y: -12, rotate: i % 2 === 0 ? 1 : -1 }}
              onClick={() => { setActiveGraph(cluster); setCurrentView('graph'); }}
              className="bg-white dark:bg-surface-container-low p-6 md:p-10 rounded-[2.5rem] md:rounded-[4rem] border-2 border-pink-50 dark:border-white/5 shadow-xl hover:shadow-2xl transition-all cursor-pointer group relative overflow-hidden min-h-[350px] md:h-[420px] flex flex-col justify-between"
            >
              <div className="relative z-10 space-y-4 md:space-y-6">
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-surface-container dark:bg-surface-container-high rounded-2xl md:rounded-3xl flex items-center justify-center text-primary group-hover:rotate-12 transition-transform duration-500">
                    <Layers className="w-6 h-6 md:w-8 md:h-8" />
                  </div>
                  <div className="px-3 py-1 bg-pink-50 dark:bg-white/5 rounded-full">
                     <span className="text-[9px] md:text-[10px] font-black uppercase text-primary tracking-widest">{cluster.nodes.length} Nodes</span>
                  </div>
                </div>
 
                <div>
                  <h3 className="text-2xl md:text-4xl font-black tracking-tighter italic mb-2 md:mb-4 leading-none uppercase">{cluster.name}</h3>
                  <p className="text-on-surface-variant text-xs md:text-sm font-medium opacity-60 line-clamp-3 leading-relaxed">
                    {cluster.description || 'Analyzing neural pathways and optimizing engram connectivity for maximum retention.'}
                  </p>
                </div>
              </div>

              <div className="relative z-10 pt-8 border-t border-pink-50 dark:border-white/5">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                     <Activity className="w-4 h-4 text-secondary" />
                     <span className="text-xs font-black uppercase tracking-widest text-outline">Pulse: Optimal</span>
                  </div>
                  <ArrowUpRight className="w-6 h-6 text-primary group-hover:scale-125 transition-transform" />
                </div>
              </div>
              
              <div className="absolute right-[-10%] bottom-[-10%] opacity-[0.05] rotate-12 group-hover:scale-110 group-hover:rotate-0 transition-all duration-1000">
                 <Brain size={250} className="text-primary" />
              </div>
            </motion.div>
          ))}
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
            onClick={() => setCurrentView('clusters')}
            className="flex flex-col items-center justify-center gap-4 md:gap-6 border-4 border-dashed border-pink-100 dark:border-white/5 rounded-[2.5rem] md:rounded-[4rem] text-outline font-black py-10 md:py-12 hover:bg-pink-50 dark:hover:bg-white/5 transition-all hover:border-primary hover:text-primary group cursor-pointer min-h-[300px]"
          >
            <div className="w-16 h-16 md:w-24 md:h-24 bg-pink-50 dark:bg-white/5 rounded-full flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
               <PlusCircle className="w-8 h-8 md:w-12 md:h-12" /> 
            </div>
            <div className="text-center">
              <span className="text-lg md:text-xl block italic tracking-tighter uppercase leading-none">Enter Neural Bank</span>
              <span className="text-[8px] md:text-[10px] uppercase font-black tracking-[0.4em] opacity-40">Access all domains</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bottom Quote */}
      <section className="mx-4 md:mx-0">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="h-[350px] md:h-[500px] bg-[#1a1a1a] rounded-[2.5rem] md:rounded-[5rem] flex items-center justify-center relative overflow-hidden shadow-3xl"
        >
          <div className="absolute inset-0 opacity-10">
            <div className="grid grid-cols-6 md:grid-cols-12 h-full">
              {Array.from({ length: 48 }).map((_, i) => (
                <div key={i} className="border border-white/20 aspect-square" />
              ))}
            </div>
          </div>
          <div className="relative z-10 text-center max-w-3xl px-6">
             <motion.div
               animate={{ y: [0, -10, 0] }}
               transition={{ duration: 4, repeat: Infinity }}
             >
               <Flame className="text-primary w-10 md:w-16 h-10 md:h-16 mx-auto mb-6 md:mb-8 drop-shadow-[0_0_20px_rgba(224,64,160,0.8)]" />
             </motion.div>
             <h3 className="text-3xl md:text-6xl font-black italic text-white tracking-tighter leading-tight uppercase">
               Transcend Your<br/>Limited Hardware
             </h3>
             <p className="text-white/40 text-[9px] md:text-xs font-black uppercase tracking-[0.5em] mt-8 md:mt-10">Neural Forge Protocol V.2.0.4</p>
          </div>
        </motion.div>
      </section>
    </div>
  );
};
