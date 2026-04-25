import React, { useState, useEffect } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { NodeData } from '../types';
import { cn } from '../lib/utils';
import { useApp } from '../context/AppContext';
import { CheckCircle2, PlayCircle, Lock, Zap, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const CustomNode = ({ data, selected }: NodeProps) => {
  const { status, label, type, progress } = data as any;

  // Animation for unlock state
  const [justUnlocked, setJustUnlocked] = useState(false);
  useEffect(() => {
    if (status === 'unlocked' && !justUnlocked) {
      setJustUnlocked(true);
      const timer = setTimeout(() => setJustUnlocked(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const getIcon = () => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-5 h-5 text-white" />;
      case 'in-progress': return <PlayCircle className="w-5 h-5 text-primary group-hover:rotate-90 transition-transform duration-500" />;
      case 'locked': return <Lock className="w-4 h-4 text-outline/50" />;
      case 'unlocked': return justUnlocked ? <Sparkles className="w-4 h-4 text-secondary animate-spin-slow" /> : <Zap className="w-4 h-4 text-secondary" />;
      default: return <Zap className="w-4 h-4 text-secondary" />;
    }
  };

  return (
    <motion.div 
      initial={false}
      animate={{ 
        scale: selected ? 1.05 : 1,
        y: justUnlocked ? [0, -10, 0] : 0
      }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 20,
        y: justUnlocked ? { duration: 0.5, repeat: 2 } : { duration: 0.3 }
      }}
      className={cn(
        "px-8 py-5 rounded-[2.5rem] border-2 transition-all duration-500 shadow-xl group flex flex-col gap-2 min-w-[220px] relative overflow-hidden",
        status === 'completed' ? "bg-primary border-primary text-white shadow-primary/20" : 
        status === 'locked' ? "bg-surface-container-low border-surface-container opacity-60 grayscale" :
        status === 'unlocked' && justUnlocked ? "bg-white border-secondary shadow-xl shadow-secondary/20" :
        "bg-white border-pink-100 text-on-surface hover:border-primary/30",
        selected && "ring-4 ring-primary-container scale-[1.02]"
      )}
    >
      <AnimatePresence>
        {justUnlocked && (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1.5, opacity: 0.5 }}
            exit={{ scale: 2, opacity: 0 }}
            className="absolute inset-0 bg-secondary/20 z-0 pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Background Glow for In-Progress */}
      {status === 'in-progress' && (
        <div className="absolute inset-0 bg-primary/5 animate-pulse" />
      )}

      <Handle type="target" position={Position.Top} className="!bg-primary/30 !border-none !w-4 !h-4 hover:!scale-150 transition-transform" />
      
      <div className="flex items-center gap-4 relative z-10">
        <div className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500",
          status === 'completed' ? "bg-white/20 rotate-[360deg]" : 
          status === 'locked' ? "bg-outline/10" : "bg-primary-container text-primary shadow-inner",
          justUnlocked && "bg-secondary text-white"
        )}>
          {getIcon()}
        </div>

        <div className="flex flex-col">
          <span className="text-base font-black tracking-tighter leading-tight">{label}</span>
          <div className="flex items-center gap-2">
            <span className={cn(
              "text-[9px] font-black uppercase tracking-widest",
              status === 'completed' ? "text-white/70" : "text-outline"
            )}>{type}</span>
            {data.xpValue && (
               <>
                 <span className="w-1 h-1 rounded-full bg-outline/20" />
                 <span className={cn(
                   "text-[9px] font-black uppercase tracking-widest flex items-center gap-1",
                   status === 'completed' ? "text-white" : "text-secondary"
                 )}>
                   <Zap className="w-2.5 h-2.5" /> {data.xpValue} XP
                 </span>
               </>
            )}
          </div>
        </div>
      </div>

      {/* Mini Progress Bar */}
      {(status === 'in-progress' || status === 'completed') && (
        <div className="w-full h-1.5 bg-black/10 rounded-full mt-2 overflow-hidden relative z-10">
          <div 
            className={cn("h-full transition-all duration-1000", status === 'completed' ? "bg-white" : "bg-primary")} 
            style={{ width: `${progress || 0}%` }} 
          />
        </div>
      )}

      {status === 'locked' && (
        <div className="text-[8px] font-black text-outline uppercase tracking-widest flex items-center gap-1 opacity-50">
          Neural Prerequisite Missing
        </div>
      )}

      {justUnlocked && (
        <div className="text-[8px] font-black text-secondary uppercase tracking-widest flex items-center gap-1">
          <Sparkles className="w-3 h-3" /> Synthesis Ready
        </div>
      )}

      <Handle type="source" position={Position.Bottom} className="!bg-primary/30 !border-none !w-4 !h-4 hover:!scale-150 transition-transform" />
    </motion.div>
  );
};
