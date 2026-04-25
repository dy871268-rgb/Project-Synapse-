import React, { useState, useEffect, useCallback } from 'react';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  SelectionMode,
  MarkerType,
  BackgroundVariant
} from '@xyflow/react';
import { toPng } from 'html-to-image';
import download from 'downloadjs';
import '@xyflow/react/dist/style.css';
import { useApp } from '../context/AppContext';
import { CustomNode } from './CustomNode';
import { GroupNode } from './GroupNode';
import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink, BookOpen, Clock, Trophy, Edit3, Sparkles, AlertCircle, Trash2, Download, Grid3X3, Maximize2, Plus as PlusIcon, Zap, PlayCircle, Lock, Unlock, Activity } from 'lucide-react';
import { expandNode } from '../services/geminiService';

const nodeTypes = {
  custom: CustomNode,
  group: GroupNode,
};

// Cycle Detection O(V+E)
const hasCycle = (nodes: any[], edges: Edge[], newEdge: { source: string; target: string }) => {
  const adj = new Map<string, string[]>();
  edges.forEach(e => {
    if (!adj.has(e.source)) adj.set(e.source, []);
    adj.get(e.source)!.push(e.target);
  });
  if (!adj.has(newEdge.source)) adj.set(newEdge.source, []);
  adj.get(newEdge.source)!.push(newEdge.target);

  const visited = new Set<string>();
  const recStack = new Set<string>();

  const isCyclic = (u: string): boolean => {
    visited.add(u);
    recStack.add(u);
    const neighbors = adj.get(u) || [];
    for (const v of neighbors) {
      if (!visited.has(v)) {
        if (isCyclic(v)) return true;
      } else if (recStack.has(v)) {
        return true;
      }
    }
    recStack.delete(u);
    return false;
  };

  for (const node of nodes) {
    if (!visited.has(node.id)) {
      if (isCyclic(node.id)) return true;
    }
  }
  return false;
};

// Auto Unlock Logic
const calculateNodeStatuses = (nodes: any[], edges: Edge[]) => {
  return nodes.map(node => {
    const incomingEdges = edges.filter(e => e.target === node.id);
    if (incomingEdges.length === 0) {
      // Roots are at least unlocked if not better
      if (node.data.status === 'locked') return { ...node, data: { ...node.data, status: 'unlocked' } };
      return node;
    }

    const preresolved = incomingEdges.every(e => {
      const sourceNode = nodes.find(n => n.id === e.source);
      return sourceNode?.data.status === 'completed';
    });

    if (preresolved) {
      if (node.data.status === 'locked') return { ...node, data: { ...node.data, status: 'unlocked' } };
      return node;
    } else {
      return { ...node, data: { ...node.data, status: 'locked', progress: 0 } };
    }
  });
};

export const GraphView: React.FC = () => {
  const { activeGraph, setSelectedNodeId, selectedNodeId, saveGraph } = useApp();
  const [nodes, setNodes, onNodesChange] = useNodesState(activeGraph.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(activeGraph.edges);
  const [isExpanding, setIsExpanding] = useState(false);

  // Sync state when activeGraph changes from outside
  useEffect(() => {
    setNodes(activeGraph.nodes);
    setEdges(activeGraph.edges);
  }, [activeGraph.id, setNodes, setEdges]);

  useEffect(() => {
    const updatedNodes = calculateNodeStatuses(nodes, edges);
    const nodesChanged = JSON.stringify(updatedNodes) !== JSON.stringify(nodes);
    if (nodesChanged) {
      setNodes(updatedNodes);
      saveGraph({ ...activeGraph, nodes: updatedNodes, edges });
    }
  }, [edges, activeGraph, nodes, saveGraph, setNodes]);

  const onConnect = useCallback((params: Connection) => {
    if (params.source === params.target) return;
    if (hasCycle(nodes, edges, params as any)) {
      alert("Temporal paradox detected: Dependency cycles are forbidden in Synapse topologies.");
      return;
    }
    const edgeWithStyle = { ...params, markerEnd: { type: MarkerType.ArrowClosed, color: '#e040a0' } };
    setEdges((eds) => {
      const newEdges = addEdge(edgeWithStyle, eds);
      return newEdges;
    });
    // Call saveGraph after state update to avoid rendering issues
    setTimeout(() => {
      saveGraph({ ...activeGraph, nodes, edges: addEdge(edgeWithStyle, edges) });
    }, 0);
  }, [nodes, edges, activeGraph, saveGraph, setEdges]);

  const handleExpand = async () => {
    if (!selectedNodeId) return;
    const node = nodes.find(n => n.id === selectedNodeId);
    if (!node) return;

    setIsExpanding(true);
    try {
      const label = (node.data.label as string) || '';
      const existingLabels = nodes.map(n => (n.data.label as string) || '');
      const data = await expandNode(label, node.id, existingLabels);
      const newNodes = data.nodes.map((n: any, i: number) => ({
        ...n,
        type: 'custom',
        position: { x: node.position.x + (i - 1) * 250, y: node.position.y + 200 }
      }));
      const newEdges = data.edges.map((e: any) => ({ ...e, markerEnd: { type: MarkerType.ArrowClosed, color: '#e040a0' } }));

      setNodes(prev => [...prev, ...newNodes]);
      setEdges(prev => [...prev, ...newEdges]);
      saveGraph({ ...activeGraph, nodes: [...nodes, ...newNodes], edges: [...edges, ...newEdges], lastUpdated: new Date().toISOString() });
    } catch (e) {
      alert("AI Synthesis failed. Check logs.");
    } finally {
      setIsExpanding(false);
    }
  };

  const updateNodeData = (nodeId: string, newData: any) => {
    const updatedNodes = nodes.map(n => n.id === nodeId ? { ...n, data: { ...n.data, ...newData } } : n);
    setNodes(updatedNodes);
    saveGraph({ ...activeGraph, nodes: updatedNodes, edges });
  };

  const deleteSelected = () => {
    if (!selectedNodeId) return;
    const nextNodes = nodes.filter(n => n.id !== selectedNodeId);
    const nextEdges = edges.filter(e => e.source !== selectedNodeId && e.target !== selectedNodeId);
    setNodes(nextNodes);
    setEdges(nextEdges);
    setSelectedNodeId(null);
    saveGraph({ ...activeGraph, nodes: nextNodes, edges: nextEdges });
  };

  const onNodeDragStop = useCallback((_: any, node: any) => {
    const updatedNodes = nodes.map(n => n.id === node.id ? node : n);
    setNodes(updatedNodes);
    saveGraph({ ...activeGraph, nodes: updatedNodes, edges });
  }, [nodes, edges, activeGraph, setNodes, saveGraph]);

  const onNodesDelete = useCallback((deleted: any[]) => {
    setSelectedNodeId(null);
    const nextNodes = nodes.filter(n => !deleted.find(d => d.id === n.id));
    const nextEdges = edges.filter(e => !deleted.find(d => d.id === e.source || d.id === e.target));
    setNodes(nextNodes);
    setEdges(nextEdges);
    saveGraph({
      ...activeGraph,
      nodes: nextNodes,
      edges: nextEdges
    });
  }, [nodes, edges, activeGraph, saveGraph, setNodes, setEdges, setSelectedNodeId]);

  const selectedNode = nodes.find(n => n.id === selectedNodeId);

  const exportAsPng = useCallback(() => {
    const el = document.querySelector('.react-flow__viewport') as HTMLElement;
    if (!el) return;
    toPng(el, { backgroundColor: '#fdfcfe' })
      .then((dataUrl) => {
        download(dataUrl, `synapse-${activeGraph.name.toLowerCase().replace(/\s+/g, '-')}.png`);
      })
      .catch((err) => {
        console.error('PNG Export Error:', err);
      });
  }, [activeGraph]);

  const groupSelectedNodes = useCallback(() => {
    const selectedNodes = nodes.filter(n => n.selected);
    if (selectedNodes.length < 2) return;

    const id = `group-${Date.now()}`;
    const padding = 50;
    
    const minX = Math.min(...selectedNodes.map(n => n.position.x)) - padding;
    const minY = Math.min(...selectedNodes.map(n => n.position.y)) - padding;
    const maxX = Math.max(...selectedNodes.map(n => n.position.x + 220)) + padding;
    const maxY = Math.max(...selectedNodes.map(n => n.position.y + 100)) + padding;

    const groupNode = {
      id,
      type: 'group',
      position: { x: minX, y: minY },
      style: { width: maxX - minX, height: maxY - minY, backgroundColor: 'rgba(224, 64, 160, 0.05)', borderRadius: '2rem', border: '2px dashed #e040a0' },
      data: { label: 'New Neural Module' }
    };

    const updatedNodes = [
      ...nodes.map(n => {
        if (n.selected) {
          return { 
            ...n, 
            parentId: id, 
            position: { 
              x: n.position.x - minX, 
              y: n.position.y - minY 
            } 
          };
        }
        return n;
      }),
      groupNode
    ];

    setNodes(updatedNodes);
    saveGraph({ ...activeGraph, nodes: updatedNodes, edges });
  }, [nodes, edges, activeGraph]);

  return (
    <div className="w-full h-full relative graph-canvas">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        onNodeClick={(_, node) => setSelectedNodeId(node.id)}
        onPaneClick={() => setSelectedNodeId(null)}
        onNodeDragStop={onNodeDragStop}
        onNodesDelete={onNodesDelete}
        snapToGrid={true}
        snapGrid={[20, 20]}
        selectionOnDrag={true}
        selectionMode={SelectionMode.Partial}
        panOnScroll={true}
        selectionKeyCode="Shift"
        multiSelectionKeyCode="Control"
        fitView
      >
        <Background gap={20} color="#e0d6e0" variant={BackgroundVariant.Dots} />
        <Controls />
        <MiniMap zoomable pannable className="!bg-white/50 !border-2 !border-pink-100/50 !rounded-[2.5rem] !shadow-2xl" />
        
        {/* Graph Specific Toolbar */}
        <div className="absolute top-4 md:top-8 left-1/2 -translate-x-1/2 bg-white/90 dark:bg-black/80 backdrop-blur-xl border border-pink-100/50 dark:border-white/10 px-4 md:px-8 py-2 md:py-4 rounded-full shadow-2xl z-40 flex items-center gap-3 md:gap-6 max-w-[95vw] overflow-x-auto scrollbar-hide">
          <button onClick={() => window.print()} className="p-2 hover:bg-pink-50 rounded-full text-primary transition-all bouncy shrink-0" title="Print Topology"><Maximize2 className="w-4 md:w-5 h-4 md:h-5" /></button>
          <button onClick={exportAsPng} className="p-2 hover:bg-pink-50 rounded-full text-primary transition-all bouncy shrink-0" title="Export as PNG"><Download className="w-4 md:w-5 h-4 md:h-5" /></button>
          <div className="h-6 w-px bg-pink-100 dark:bg-white/10 shrink-0" />
          <button 
            onClick={groupSelectedNodes}
            disabled={nodes.filter(n => n.selected).length < 2}
            className="p-2 hover:bg-pink-50 rounded-full text-primary transition-all bouncy disabled:opacity-30 shrink-0" 
            title="Module Cluster (Select 2+)"
          >
            <Grid3X3 className="w-4 md:w-5 h-4 md:h-5" />
          </button>
          <button 
            onClick={() => {
              const id = `node-${Date.now()}`;
              const newNode = {
                id,
                type: 'custom',
                position: { x: 500, y: 300 },
                data: { label: 'New Neural Node', type: 'core', status: 'unlocked', progress: 0, estimatedTime: '1h', xpValue: 50 },
              };
              setNodes(prev => [...prev, newNode]);
              saveGraph({ ...activeGraph, nodes: [...nodes, newNode], edges });
              setSelectedNodeId(id);
            }}
            className="p-2 hover:bg-pink-50 rounded-full text-primary transition-all bouncy shrink-0" 
            title="New Node"
          >
            <PlusIcon className="w-4 md:w-5 h-4 md:h-5" />
          </button>
          <div className="h-6 w-px bg-pink-100 dark:bg-white/10 shrink-0" />
          <button 
            onClick={async () => {
              const topic = prompt("Enter a topic to generate a complementary sub-branch:");
              if (!topic) return;
              setIsExpanding(true);
              try {
                const data = await expandNode(topic, selectedNodeId || 'root', nodes.map(n => (n.data.label as string) || ''));
                const newNodes = data.nodes.map((n: any, i: number) => ({
                  ...n,
                  type: 'custom',
                  position: { x: Math.random() * 500, y: Math.random() * 500 }
                }));
                const newEdges = data.edges.map((e: any) => ({ ...e, markerEnd: { type: MarkerType.ArrowClosed, color: '#e040a0' } }));
                setNodes(prev => [...prev, ...newNodes]);
                setEdges(prev => [...prev, ...newEdges]);
                saveGraph({ ...activeGraph, nodes: [...nodes, ...newNodes], edges: [...edges, ...newEdges] });
              } catch (e) {
                alert("AI Synthesis failed.");
              } finally {
                setIsExpanding(false);
              }
            }}
            disabled={isExpanding}
            className="p-2 hover:bg-pink-50 rounded-full text-secondary transition-all bouncy flex items-center gap-2 group shrink-0" 
            title="Gen AI Roadmap"
          >
            <Sparkles className={cn("w-4 md:w-5 h-4 md:h-5", isExpanding && "animate-spin")} />
            <span className="text-[10px] font-black uppercase tracking-widest hidden md:group-hover:inline max-w-0 group-hover:max-w-[100px] overflow-hidden transition-all duration-500">Synthesize Branch</span>
          </button>
        </div>
      </ReactFlow>

      {/* Global Progress Badge */}
      <div className="absolute top-16 md:top-24 left-4 md:left-8 z-10 flex flex-col gap-2 md:gap-3">
        <div className="bg-white/90 dark:bg-surface-container/90 backdrop-blur-md p-3 md:p-4 rounded-2xl md:rounded-3xl border border-pink-100 dark:border-white/10 shadow-xl flex items-center gap-3 md:gap-4">
          <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-primary flex items-center justify-center text-white shadow-lg">
            <Trophy className="w-4 md:w-6 h-4 md:h-6" />
          </div>
          <div>
            <p className="text-[8px] md:text-[10px] font-black uppercase text-outline tracking-widest leading-none mb-1">Traversal</p>
            <p className="text-lg md:text-2xl font-black text-on-surface leading-none">
              {Math.round((nodes.filter(n => n.data.status === 'completed').length / (nodes.length || 1)) * 100)}%
            </p>
          </div>
        </div>

        <div className="bg-white/90 dark:bg-surface-container/90 backdrop-blur-md p-3 md:p-4 rounded-2xl md:rounded-3xl border border-pink-100 dark:border-white/10 shadow-xl flex items-center gap-3 md:gap-4">
          <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-secondary flex items-center justify-center text-white shadow-lg">
            <Zap className="w-4 md:w-6 h-4 md:h-6" />
          </div>
          <div>
            <p className="text-[8px] md:text-[10px] font-black uppercase text-outline tracking-widest leading-none mb-1">Topology</p>
            <p className="text-lg md:text-2xl font-black text-on-surface leading-none">
              {activeGraph.totalXp?.toLocaleString() || 0} <span className="text-[10px] uppercase text-outline font-black">XP</span>
            </p>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedNode && (
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="absolute right-0 top-0 bottom-0 w-full md:w-[480px] bg-white z-50 shadow-2xl rounded-l-[3rem] flex flex-col border-l-4 border-pink-100/50 overflow-hidden"
          >
            <div className="p-10 border-b border-surface-container flex justify-between items-start bg-gradient-to-br from-white to-pink-50/30">
              <div className="flex-1">
                <input 
                  className="text-3xl font-black text-on-surface tracking-tighter bg-transparent border-none focus:ring-0 w-full p-0"
                  value={selectedNode.data.label || ''}
                  onChange={(e) => updateNodeData(selectedNode.id, { label: e.target.value })}
                />
                <div className="flex gap-2 mt-4">
                  <span className="bg-primary-container text-on-primary-container px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                    {selectedNode.data.type}
                  </span>
                  <span className={cn(
                    "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest",
                    selectedNode.data.status === 'completed' ? "bg-green-100 text-green-700" : 
                    selectedNode.data.status === 'in-progress' ? "bg-primary text-white" : "bg-surface-container text-outline"
                  )}>
                    {selectedNode.data.status}
                  </span>
                </div>
              </div>
              <button onClick={() => setSelectedNodeId(null)} className="p-2 hover:bg-pink-100 rounded-full transition-colors"><X /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-10 space-y-10 scrollbar-hide">
              {/* Node Status Selection */}
              <div className="space-y-4">
                <h3 className="text-xs font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                  <Activity className="w-4 h-4" /> Neural State
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'locked', label: 'Locked', color: 'bg-outline/10 text-outline', icon: Lock },
                    { id: 'unlocked', label: 'Unlocked', color: 'bg-blue-50 text-blue-500', icon: Zap },
                    { id: 'in-progress', label: 'In Progress', color: 'bg-primary/10 text-primary', icon: PlayCircle },
                    { id: 'completed', label: 'Completed', color: 'bg-secondary/10 text-secondary', icon: Trophy },
                  ].map((status) => (
                    <button
                      key={status.id}
                      onClick={() => {
                        const progress = status.id === 'completed' ? 100 : (status.id === 'in-progress' ? 50 : (status.id === 'unlocked' ? 0 : 0));
                        updateNodeData(selectedNode.id, { status: status.id as any, progress });
                      }}
                      className={cn(
                        "flex items-center gap-3 p-4 rounded-2xl border transition-all text-[10px] font-black uppercase tracking-widest",
                        selectedNode.data.status === status.id 
                          ? "border-primary bg-primary/5 shadow-md scale-[0.98]" 
                          : "border-transparent bg-surface-container-low hover:border-pink-200"
                      )}
                    >
                      <status.icon className={cn("w-4 h-4", selectedNode.data.status === status.id ? "text-primary" : "opacity-40")} />
                      {status.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-surface-container-low p-6 rounded-[2.5rem] border border-surface-container group hover:border-primary/20 transition-all">
                  <div className="flex items-center gap-2 text-outline mb-2">
                    <Clock className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase">Complexity</span>
                  </div>
                  <input 
                    className="text-2xl font-black text-primary bg-transparent border-none focus:ring-0 p-0 w-full placeholder:opacity-20"
                    value={selectedNode.data.estimatedTime || ''}
                    placeholder="e.g. 10h"
                    onChange={(e) => updateNodeData(selectedNode.id, { estimatedTime: e.target.value })}
                  />
                </div>
                <div className="bg-surface-container-low p-6 rounded-[2.5rem] border border-surface-container group hover:border-secondary/20 transition-all">
                  <div className="flex items-center gap-2 text-outline mb-2">
                    <Zap className="w-4 h-4 text-secondary" />
                    <span className="text-[10px] font-black uppercase">Reward</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input 
                      type="number"
                      className="text-2xl font-black text-secondary bg-transparent border-none focus:ring-0 p-0 w-24"
                      value={selectedNode.data.xpValue || 0}
                      onChange={(e) => updateNodeData(selectedNode.id, { xpValue: parseInt(e.target.value) || 0 })}
                    />
                    <span className="text-xl font-black text-secondary/50">XP</span>
                  </div>
                </div>
              </div>

              {/* Description Section */}
              <div className="space-y-3">
                <h3 className="text-xs font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                  <BookOpen className="w-4 h-4" /> Neural Descriptor
                </h3>
                <textarea 
                  className="w-full min-h-[100px] bg-surface-container-low border border-pink-50 rounded-3xl p-6 text-sm font-medium leading-relaxed outline-none focus:border-primary/30 transition-all resize-none"
                  value={selectedNode.data.description || ''}
                  placeholder="Define this neural node's purpose..."
                  onChange={(e) => updateNodeData(selectedNode.id, { description: e.target.value })}
                />
              </div>

              {/* Resources Section */}
              <div className="space-y-4">
                <h3 className="text-xs font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" /> Mastery Resources
                </h3>
                {(selectedNode.data.resources as any[]) && (selectedNode.data.resources as any[]).length > 0 ? (
                  <div className="grid grid-cols-1 gap-3">
                    {(selectedNode.data.resources as any[]).map((res: any) => (
                      <a 
                        key={res.id} 
                        href={res.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-pink-50 hover:border-primary/40 hover:shadow-lg transition-all group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                          <ExternalLink className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-on-surface truncate">{res.title}</p>
                          <p className="text-[9px] font-black uppercase text-outline tracking-widest">{res.type}</p>
                        </div>
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-outline italic">No resources attached. AI can suggest some below.</p>
                )}
              </div>

              {/* Progress Slider */}
              <div className="space-y-4">
                <h3 className="text-xs font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                  <Zap className="w-4 h-4" /> Integration Depth
                </h3>
                <div className="bg-surface-container-low p-8 rounded-[2rem] border border-surface-container">
                  <input 
                    type="range" min="0" max="100" step="1"
                    className="w-full accent-primary h-2 bg-pink-100 rounded-lg appearance-none cursor-pointer"
                    value={selectedNode.data.progress ?? 0}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      const status = val === 100 ? 'completed' : (val > 0 ? 'in-progress' : 'unlocked');
                      updateNodeData(selectedNode.id, { progress: val, status });
                    }}
                  />
                  <div className="flex justify-between mt-6 text-outline font-black text-[10px] uppercase tracking-[0.1em]">
                    <span>Dormant</span>
                    <span className="text-primary text-3xl font-black">{selectedNode.data.progress ?? 0}%</span>
                    <span>Synthesized</span>
                  </div>
                </div>
              </div>

              {/* AI AI Recommendations / Suggestions */}
              <div className="space-y-4">
                <h3 className="text-xs font-black text-secondary uppercase tracking-[0.2em] flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> Neural Suggestions
                </h3>
                <div className="flex flex-wrap gap-2">
                  {["Performance Heuristics", "Cloud Abstractions", "Security Paradigms", "Latency Optimization"].map((s, i) => (
                    <button 
                      key={i}
                      className="px-4 py-2 rounded-xl bg-pink-50/50 border border-pink-100 text-[11px] font-bold text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
                    >
                      + {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-black text-on-surface uppercase tracking-widest flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-primary" /> Heuristic Notes
                </h3>
                <textarea 
                  className="w-full h-40 bg-surface-container-low border border-pink-50 rounded-[2rem] p-6 text-sm font-medium focus:ring-4 focus:ring-primary/10 outline-none transition-all resize-none shadow-inner"
                  placeholder="Annotate your progress and resource heuristics..."
                  value={selectedNode.data.notes || ''}
                  onChange={(e) => updateNodeData(selectedNode.id, { notes: e.target.value })}
                />
              </div>
              
              <div className="pb-16 flex flex-col gap-4">
                <button 
                  onClick={() => {
                    updateNodeData(selectedNode.id, { progress: 100, status: 'completed' });
                  }}
                  disabled={selectedNode.data.status === 'completed'}
                  className="w-full h-16 bg-primary text-white rounded-3xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                >
                  {selectedNode.data.status === 'completed' ? <><Trophy className="w-6 h-6" /> Mastery Attained</> : "Finalize Integration"}
                </button>
                <button 
                  onClick={deleteSelected}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-red-50 text-red-500 font-bold hover:bg-red-500 hover:text-white transition-all text-[11px] uppercase tracking-widest"
                >
                  <Trash2 className="w-4 h-4" /> Sever Connection
                </button>
              </div>
            </div>

            <div className="p-8 bg-surface-container-high border-t border-pink-50">
              <button 
                onClick={handleExpand}
                disabled={isExpanding || selectedNode.data.status === 'locked'}
                className="w-full bg-white border-2 border-primary/20 text-primary py-5 rounded-3xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                <Sparkles className="w-5 h-5" /> 
                {isExpanding ? "Expanding Topology..." : "Trigger AI Synthesis"}
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
};

import { cn } from '../lib/utils';
