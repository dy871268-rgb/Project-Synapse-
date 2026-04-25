import React from 'react';
import { motion } from 'motion/react';
import { Trophy, Medal, Star, Target, Crown, Zap, TrendingUp, Search } from 'lucide-react';
import { cn } from '../lib/utils';
import { useApp } from '../context/AppContext';

const LEADERBOARD_DATA = [
  { id: '1', name: 'NeuralNomad', level: 124, xp: 84200, rank: 'Neural Architect', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop' },
  { id: '2', name: 'DataDrifter', level: 98, xp: 62100, rank: 'Synapse Weaver', avatar: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=100&h=100&fit=crop' },
  { id: '3', name: 'LogicLink', level: 82, xp: 45000, rank: 'Synapse Weaver', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop' },
  { id: '4', name: 'CodeCatalyst', level: 75, xp: 38200, rank: 'Mind Initiate', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop' },
  { id: '5', name: 'CyberSage', level: 68, xp: 31000, rank: 'Mind Initiate', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop' },
  { id: '6', name: 'SynapseSorcerer', level: 54, xp: 22400, rank: 'Mind Initiate', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop' },
];

export const Leaderboard: React.FC = () => {
  const { userProfile } = useApp();

  return (
    <div className="max-w-5xl mx-auto space-y-8 md:space-y-12 pb-32 p-4 md:p-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 md:gap-8">
        <motion.div
           initial={{ opacity: 0, x: -50 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.8 }}
           className="w-full lg:w-auto"
        >
          <div className="flex items-center gap-2 mb-2 md:mb-4">
            <div className="w-8 h-1 bg-primary rounded-full" />
            <span className="text-[9px] md:text-[10px] font-black uppercase text-primary tracking-[0.4em]">Peer Neural Networks</span>
          </div>
          <h1 className="text-4xl md:text-8xl font-black tracking-tighter italic uppercase leading-none">Neural<br/>Leaders</h1>
          <p className="text-on-surface-variant font-medium text-xs md:text-lg mt-2 md:mt-4 opacity-60 max-w-lg">
            High-potential synapses identified within the global knowledge lattice.
          </p>
        </motion.div>

        <div className="flex gap-2 md:gap-4 w-full md:w-auto">
           <div className="flex-1 md:flex-none bg-white dark:bg-white/5 p-4 md:p-6 rounded-2xl md:rounded-3xl border border-pink-50 dark:border-white/5 flex items-center gap-3 md:gap-4 shadow-xl">
             <Trophy className="w-6 h-6 md:w-10 md:h-10 text-primary" />
             <div>
                <p className="text-[7px] md:text-[8px] font-black uppercase tracking-widest text-outline">Your Rank</p>
                <p className="text-xl md:text-3xl font-black italic">#724</p>
             </div>
           </div>
           <div className="flex-1 md:flex-none bg-primary text-white p-4 md:p-6 rounded-2xl md:rounded-3xl flex items-center gap-3 md:gap-4 shadow-xl shadow-primary/20">
             <Zap className="w-6 h-6 md:w-10 md:h-10" />
             <div>
                <p className="text-[7px] md:text-[8px] font-black uppercase tracking-widest opacity-60">Percentile</p>
                <p className="text-xl md:text-3xl font-black italic">Top 12%</p>
             </div>
           </div>
        </div>
      </header>

      {/* Podium */}
      <section className="flex flex-col md:grid md:grid-cols-3 gap-12 md:gap-8 items-end pt-12">
        {LEADERBOARD_DATA.slice(0, 3).map((player, i) => {
          const height = i === 0 ? 'min-h-[320px] md:h-[400px]' : i === 1 ? 'min-h-[280px] md:h-[340px]' : 'min-h-[240px] md:h-[300px]';
          const scale = i === 0 ? 'md:scale-110' : 'scale-100';
          const zIndex = i === 0 ? 'z-20' : 'z-10';

          return (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              className={cn(
                "w-full relative group",
                i === 0 ? "md:order-1 order-first" : i === 1 ? "md:order-0 order-2" : "md:order-2 order-3"
              )}
            >
              <div className={cn(
                "bg-white dark:bg-white/5 rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-8 border-2 border-pink-50 dark:border-white/5 shadow-2xl flex flex-col items-center justify-between transition-all duration-500 hover:shadow-primary/10",
                height, scale, zIndex
              )}>
                 <div className="absolute -top-8 md:-top-12 left-1/2 -translate-x-1/2">
                    <div className="relative">
                       <img src={player.avatar} className="w-16 h-16 md:w-24 md:h-24 rounded-2xl md:rounded-[2rem] object-cover border-4 border-white dark:border-surface-container shadow-2xl" alt="" />
                       <div className="absolute -bottom-1 -right-1 md:-bottom-2 md:-right-2 w-7 h-7 md:w-10 md:h-10 bg-primary text-white rounded-lg md:rounded-xl flex items-center justify-center font-black italic shadow-lg text-xs md:text-base">
                          #{i + 1}
                       </div>
                    </div>
                 </div>

                 <div className="text-center pt-8 md:pt-12">
                    <h3 className="text-xl md:text-2xl font-black italic tracking-tight">{player.name}</h3>
                    <p className="text-[9px] md:text-[10px] font-black uppercase text-primary tracking-widest mt-1">{player.rank}</p>
                 </div>

                 <div className="w-full space-y-3 md:space-y-4 my-6 md:my-0">
                    <div className="flex justify-between items-center text-[10px] md:text-xs font-black uppercase border-b border-pink-50 dark:border-white/5 pb-2">
                       <span className="text-outline">Level</span>
                       <span className="text-primary">{player.level}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] md:text-xs font-black uppercase">
                       <span className="text-outline">Total XP</span>
                       <span>{player.xp.toLocaleString()}</span>
                    </div>
                 </div>

                 <button 
                   className="w-full py-4 bg-surface-container dark:bg-white/5 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest text-outline hover:bg-primary hover:text-white transition-all"
                 >
                   View Synapse
                 </button>
              </div>
            </motion.div>
          );
        })}
      </section>

      {/* List */}
      <section className="bg-white dark:bg-surface-container rounded-[4rem] border border-pink-50 dark:border-white/5 shadow-2xl overflow-hidden">
        <div className="p-8 border-b border-pink-50 dark:border-white/5 flex justify-between items-center bg-pink-50/20 dark:bg-white/5">
           <h3 className="text-xl font-black italic">Extended Network</h3>
           <div className="relative hidden md:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
              <input 
                placeholder="Search Architects..." 
                className="pl-10 pr-6 py-2 bg-white dark:bg-surface-container rounded-full text-xs font-bold outline-none border border-pink-100 dark:border-white/10"
              />
           </div>
        </div>
        
        <div className="divide-y divide-pink-50 dark:divide-white/5">
           {LEADERBOARD_DATA.slice(3).concat([
             { id: 'user', ...userProfile, level: userProfile.level, xp: userProfile.xp, name: 'You (Prime)', avatar: userProfile.avatar }
           ]).map((player, i) => (
             <motion.div 
               key={player.id}
               initial={{ opacity: 0 }}
               whileInView={{ opacity: 1 }}
               className={cn(
                 "p-6 flex items-center gap-6 hover:bg-pink-50/30 dark:hover:bg-white/5 transition-colors cursor-pointer group",
                 player.id === 'user' ? "bg-primary/5 border-l-4 border-l-primary" : ""
               )}
             >
                <div className="w-8 text-xl font-black italic text-outline group-hover:text-primary transition-colors">
                  {player.id === 'user' ? '724' : i + 4}
                </div>
                <div className="w-12 h-12 rounded-xl bg-surface-container overflow-hidden shrink-0">
                  <img src={player.avatar} className="w-full h-full object-cover" alt="" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-black italic text-lg tracking-tight truncate">{player.name}</h4>
                  <p className="text-[10px] font-black uppercase text-outline tracking-widest">{player.rank}</p>
                </div>
                <div className="hidden sm:flex items-center gap-8">
                   <div className="text-center">
                      <p className="text-[8px] font-black uppercase text-outline tracking-widest mb-1">XP Surge</p>
                      <div className="flex items-center gap-1 text-secondary font-black">
                         <TrendingUp className="w-3 h-3" /> +12%
                      </div>
                   </div>
                   <div className="text-right min-w-[80px]">
                      <p className="text-[8px] font-black uppercase text-outline tracking-widest mb-1">Total XP</p>
                      <p className="font-black italic leading-none">{player.xp.toLocaleString()}</p>
                   </div>
                </div>
                <div className="w-12 h-12 bg-surface-container dark:bg-white/5 rounded-xl flex items-center justify-center font-black italic text-lg text-primary">
                  {player.level}
                </div>
             </motion.div>
           ))}
        </div>
      </section>
    </div>
  );
};
