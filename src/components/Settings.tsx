import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Database, 
  Trash2, 
  Download, 
  ToggleLeft, 
  ToggleRight, 
  Share2, 
  Sparkles, 
  CheckCircle2, 
  Moon, 
  Sun,
  Shield,
  Zap,
  Cpu,
  FileArchive,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toPng } from 'html-to-image';
import { cn } from '../lib/utils';
import JSZip from 'jszip';
import { jsPDF } from 'jspdf';

export const Settings: React.FC = () => {
  const { allGraphs, deleteGraph, isDarkMode, setIsDarkMode, activeGraph } = useApp();
  const [isExporting, setIsExporting] = useState(false);

  const handleDeepSynthesis = async () => {
    setIsExporting(true);
    try {
      const zip = new JSZip();
      
      // 1. Capture current graph PNG (if visible)
      // Note: We expect the user to have a graph open or we capture the viewport
      const el = document.querySelector('.react-flow__renderer') as HTMLElement;
      const dashboardEl = document.querySelector('main') as HTMLElement;
      
      if (el) {
        const pngData = await toPng(el, { quality: 1, pixelRatio: 3, backgroundColor: isDarkMode ? '#1a1a1b' : '#fef7ff' });
        const base64Png = pngData.split(',')[1];
        zip.file(`active_engram_${activeGraph?.name || 'unknown'}.png`, base64Png, { base64: true });
      } else if (dashboardEl) {
        const pngData = await toPng(dashboardEl, { quality: 0.8, pixelRatio: 2 });
        const base64Png = pngData.split(',')[1];
        zip.file(`neural_dashboard_snapshot.png`, base64Png, { base64: true });
      }

      // 2. Generate Analytics PDF
      const doc = new jsPDF();
      doc.setTextColor(isDarkMode ? 255 : 0);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(24);
      doc.text("NEURAL SYNAPSE REPORT", 20, 30);
      doc.setFontSize(10);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 40);
      
      doc.setFontSize(16);
      doc.text("Global Network Statistics", 20, 60);
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text(`Total Clusters: ${allGraphs.length}`, 20, 70);
      doc.text(`Total Nodes (Engrams): ${allGraphs.reduce((acc, g) => acc + g.nodes.length, 0)}`, 20, 80);
      
      let yPos = 100;
      allGraphs.forEach((g, i) => {
        if (yPos > 250) {
          doc.addPage();
          yPos = 30;
        }
        doc.setFont("helvetica", "bold");
        doc.text(`${i + 1}. Cluster: ${g.name}`, 20, yPos);
        doc.setFont("helvetica", "normal");
        doc.text(`Nodes: ${g.nodes.length} | Last Sync: ${new Date(g.lastUpdated).toLocaleDateString()}`, 25, yPos + 7);
        doc.text(`Status: ${g.nodes.filter(n => n.data?.status === 'completed').length} / ${g.nodes.length} completed`, 25, yPos + 14);
        yPos += 30;
      });

      const pdfBlob = doc.output('blob');
      zip.file("neural_analytics_summary.pdf", pdfBlob);

      // 3. Metadata JSON
      zip.file("metadata.json", JSON.stringify({
        version: "2.0.4",
        exportDate: new Date().toISOString(),
        graphs: allGraphs
      }, null, 2));

      // 4. Generate and download ZIP
      const content = await zip.generateAsync({ type: "blob" });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = `SYNAPSE_ENGRAM_BUNDLE_${Date.now()}.zip`;
      link.click();
    } catch (err) {
      console.error(err);
      alert("Synthesis overflow. Check console for neural errors.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleClearState = () => {
    if (confirm("Initiate Neural Wipe? This deletes all custom clusters and resets local synapses.")) {
      localStorage.removeItem('synapse_graphs');
      window.location.reload();
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 md:space-y-12 pb-32 p-4 md:p-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full md:w-auto"
        >
          <div className="flex items-center gap-2 mb-2 md:mb-4">
            <div className="w-8 h-1 bg-primary rounded-full" />
            <span className="text-[9px] md:text-[10px] font-black uppercase text-primary tracking-[0.4em]">Core Configuration</span>
          </div>
          <h1 className="text-4xl md:text-7xl font-black tracking-tighter italic uppercase leading-none">Neural<br/>Settings</h1>
          <p className="text-on-surface-variant font-medium text-sm md:text-lg mt-2 md:mt-4 opacity-60 max-w-lg">
            Calibrate your interface parity and secure your neural engrams through local persistence protocols.
          </p>
        </motion.div>
        
        <div className="flex flex-row md:flex-col items-start md:items-end gap-2 md:gap-3 w-full md:w-auto">
          <div className="flex-1 md:flex-none px-4 md:px-6 py-2 md:py-3 bg-surface-container dark:bg-surface-container-high rounded-full flex items-center gap-2 md:gap-3 border border-outline-variant">
             <Cpu className="w-3 md:w-4 h-3 md:h-4 text-primary" />
             <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-outline">v2.0.4</span>
          </div>
          <div className="flex-1 md:flex-none px-4 md:px-6 py-2 md:py-3 bg-primary/10 rounded-full flex items-center gap-2 md:gap-3 border border-primary/20">
             <Shield className="w-3 md:w-4 h-3 md:h-4 text-primary" />
             <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-primary">Active</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Theme Calibration */}
        <motion.div 
          whileHover={{ y: -8 }}
          className="md:col-span-1 bg-white dark:bg-surface-container-low p-8 md:p-10 rounded-[2.5rem] md:rounded-[4rem] border border-pink-50 dark:border-white/5 shadow-2xl flex flex-col justify-between min-h-[350px] md:h-[450px]"
        >
          <div className="space-y-4 md:space-y-6">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-primary/10 rounded-2xl md:rounded-3xl flex items-center justify-center text-primary">
              <Sun className="w-6 md:w-8 h-6 md:h-8 dark:hidden" />
              <Moon className="w-6 md:w-8 h-6 md:h-8 hidden dark:block" />
            </div>
            <h3 className="text-2xl md:text-3xl font-black italic tracking-tight">Interface Parity</h3>
            <p className="text-on-surface-variant font-medium leading-relaxed opacity-70 text-sm md:text-base">
              Toggle between high-contrast lumen mode or deep neural night for reduced cognitive strain.
            </p>
          </div>
          
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={cn(
              "p-6 rounded-[2.5rem] flex items-center justify-between transition-all duration-500 bouncy",
              isDarkMode ? "bg-primary text-white shadow-xl shadow-primary/30" : "bg-surface-container dark:bg-surface-container-high text-primary"
            )}
          >
            <span className="text-lg font-black uppercase tracking-widest">{isDarkMode ? 'Night Mode' : 'Lumen Mode'}</span>
            <div className={cn(
              "w-12 h-6 rounded-full relative transition-colors duration-500",
              isDarkMode ? "bg-white/30" : "bg-primary/20"
            )}>
              <div className={cn(
                "absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-500 shadow-lg",
                isDarkMode ? "left-7" : "left-1"
              )} />
            </div>
          </button>
        </motion.div>

        {/* Persistence Engine */}
        <motion.div 
          whileHover={{ y: -8 }}
          className="md:col-span-2 bg-white dark:bg-surface-container-low p-8 md:p-10 rounded-[2.5rem] md:rounded-[4rem] border border-pink-50 dark:border-white/5 shadow-2xl flex flex-col justify-between min-h-[350px] md:h-[450px]"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
            <div className="space-y-4 md:space-y-6 max-w-md">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-secondary/10 rounded-2xl md:rounded-3xl flex items-center justify-center text-secondary">
                <Database className="w-6 md:w-8 h-6 md:h-8" />
              </div>
              <h3 className="text-2xl md:text-3xl font-black italic tracking-tight">Neural Persistence</h3>
              <p className="text-on-surface-variant font-medium leading-relaxed opacity-70 text-sm md:text-base">
                Data is indexed within your localized browser engram. Clearing the state will irreversibly sever all synaptic links.
              </p>
            </div>
            <div className="w-full sm:w-auto bg-surface-container dark:bg-surface-container-high p-4 md:p-6 rounded-2xl md:rounded-3xl text-center min-w-[120px]">
               <p className="text-[8px] md:text-[10px] font-black uppercase text-outline dark:text-white/40 tracking-widest mb-1">Total Engrams</p>
               <p className="text-3xl md:text-4xl font-black text-primary">{allGraphs.length}</p>
            </div>
          </div>

          <div className="flex gap-4">
             <button 
                onClick={handleClearState}
                className="flex-1 flex items-center justify-center gap-3 py-6 rounded-[2.5rem] bg-red-50 dark:bg-red-950/20 text-red-500 font-black hover:bg-red-500 hover:text-white transition-all bouncy"
              >
                <Trash2 className="w-6 h-6" /> Neural Wipe
              </button>
              <button className="px-8 py-6 rounded-[2.5rem] bg-surface-container dark:bg-surface-container-high text-outline dark:text-white/40 font-black hover:bg-outline hover:text-white dark:hover:bg-primary dark:hover:text-white transition-all bouncy">
                Sync Cloud
              </button>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -8 }}
          className="md:col-span-3 bg-primary text-white p-8 md:p-12 rounded-[3rem] md:rounded-[5rem] shadow-3xl relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 group-hover:rotate-12 transition-transform duration-1000">
            <FileArchive className="w-96 h-96" />
          </div>
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="space-y-4 md:space-y-8 text-center md:text-left">
              <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-xl px-4 md:px-6 py-2 rounded-full">
                <Sparkles className="w-4 h-4 animate-pulse" />
                <span className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.3em]">Deep Synthesis Protocol</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter leading-none">Synthesize<br/>Neural Bundle</h2>
              <p className="text-white/70 font-medium text-sm md:text-lg leading-relaxed max-w-md mx-auto md:mx-0">
                Generate a full Neural Engine Archive (ZIP). Includes high-res PNG engrams, JSON architecture data, and AI-generated synthesis analytics.
              </p>
              <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={handleDeepSynthesis}
                disabled={isExporting}
                className="w-full md:w-auto flex items-center justify-center gap-4 bg-white text-primary px-8 md:px-12 py-4 md:py-7 rounded-full font-black text-base md:text-xl shadow-2xl hover:shadow-white/20 transition-all group/btn disabled:opacity-50"
              >
                {isExporting ? <Loader2 className="w-6 md:w-8 h-6 md:h-8 animate-spin" /> : <Download className="w-6 md:w-8 h-6 md:h-8 group-hover:-translate-y-1 transition-transform" />}
                {isExporting ? "Synthesizing..." : "Synthesize Archive"}
              </motion.button>
            </div>
            
            <div className="hidden lg:block relative">
              <div className="aspect-video bg-white/10 backdrop-blur-md rounded-[3rem] p-2 border-2 border-white/20 rotate-3 group-hover:rotate-0 transition-transform duration-700 shadow-2xl">
                 <div className="w-full h-full bg-white/5 rounded-[2.5rem] flex items-center justify-center overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?w=800&h=450&fit=crop" 
                      className="w-full h-full object-cover opacity-60 mix-blend-overlay grayscale group-hover:grayscale-0 transition-all duration-1000"
                      alt="Neural Visualization"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
                    <div className="absolute bottom-8 left-8 right-8">
                       <p className="text-[10px] font-black uppercase tracking-widest text-white opacity-60 mb-1">Architecture Preview</p>
                       <p className="text-xl font-black text-white italic text-center">Full System Archive Synthesis</p>
                    </div>
                 </div>
              </div>
              {/* Floating decorations */}
              <motion.div 
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-10 -right-10 w-24 h-24 bg-secondary/50 backdrop-blur-xl rounded-full border border-white/20 flex items-center justify-center shadow-xl"
              >
                 <Zap className="w-10 h-10 text-white" />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

