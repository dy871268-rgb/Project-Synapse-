export type NodeStatus = 'locked' | 'unlocked' | 'in-progress' | 'completed';

export interface Resource {
  id: string;
  title: string;
  url: string;
  type: 'article' | 'video' | 'course' | 'doc';
}

export interface NodeData {
  label: string;
  description?: string;
  type: 'core' | 'advanced' | 'expert';
  status: NodeStatus;
  progress: number; // 0 to 100
  notes?: string;
  resources?: Resource[];
  estimatedTime: string;
  xpValue: number;
}

export interface GraphState {
  id: string;
  name: string;
  description: string;
  nodes: any[];
  edges: any[];
  lastUpdated: string;
  totalXp: number;
}

export type ViewType = 'dashboard' | 'graph' | 'clusters' | 'analytics' | 'settings' | 'leaderboard';
