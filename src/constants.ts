import { GraphState } from './types';

export const PREBUILT_GRAPHS: GraphState[] = [
  {
    id: 'data-science',
    name: 'Data Science Catalyst',
    description: 'A master path from statistics to advanced neural architectures.',
    lastUpdated: new Date().toISOString(),
    totalXp: 1200,
    nodes: [
      { id: '1', position: { x: 250, y: 0 }, data: { label: 'Python Base', type: 'core', status: 'completed', progress: 100, estimatedTime: '10h', xpValue: 100, description: 'Mastering Python fundamentals for data analysis. Focus on lists, dictionaries, and list comprehensions.', resources: [{ id: 'r1', title: 'Python for Data Science', url: 'https://realpython.com', type: 'article' }, { id: 'r1-2', title: 'Official Python Tutorial', url: 'https://docs.python.org/3/tutorial/', type: 'doc' }] }, type: 'custom' },
      { id: '2', position: { x: 100, y: 150 }, data: { label: 'NumPy', type: 'core', status: 'completed', progress: 100, estimatedTime: '5h', xpValue: 150, description: 'Numerical computing with N-dimensional arrays. Vectorization is key.', resources: [{ id: 'r2', title: 'NumPy Quickstart', url: 'https://numpy.org', type: 'doc' }, { id: 'r2-2', title: 'Visual NumPy', url: 'https://jalammar.github.io/visual-numpy/', type: 'article' }] }, type: 'custom' },
      { id: '3', position: { x: 400, y: 150 }, data: { label: 'Pandas', type: 'core', status: 'in-progress', progress: 45, estimatedTime: '8h', xpValue: 200, description: 'Data structures for data manipulation. DataFrames and Series are the heart of Pandas.', resources: [{ id: 'r3', title: 'Pandas 10min', url: 'https://pandas.pydata.org/docs/user_guide/10min.html', type: 'doc' }, { id: 'r3-2', title: 'DataCamp: Data Manipulation', url: 'https://www.datacamp.com/courses/data-manipulation-with-pandas', type: 'course' }] }, type: 'custom' },
      { id: '4', position: { x: 250, y: 300 }, data: { label: 'Scikit-Learn', type: 'advanced', status: 'unlocked', progress: 0, estimatedTime: '15h', xpValue: 300, description: 'Machine learning algorithms in Python. Implement linear regression and clustering.', resources: [{ id: 'r4', title: 'Scikit-Learn Tutorials', url: 'https://scikit-learn.org/stable/tutorial/index.html', type: 'doc' }] }, type: 'custom' },
      { id: '5', position: { x: 250, y: 450 }, data: { label: 'PyTorch', type: 'expert', status: 'locked', progress: 0, estimatedTime: '40h', xpValue: 450, description: 'Deep learning frameworks. Building neural networks from scratch.', resources: [{ id: 'r5', title: 'PyTorch Tutorials', url: 'https://pytorch.org/tutorials/', type: 'doc' }] }, type: 'custom' },
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2', animated: true },
      { id: 'e1-3', source: '1', target: '3', animated: true },
      { id: 'e2-4', source: '2', target: '4' },
      { id: 'e3-4', source: '3', target: '4' },
      { id: 'e4-5', source: '4', target: '5' },
    ]
  },
  {
    id: 'cybersecurity',
    name: 'Offensive Security',
    description: 'Ethical hacking and network penetration path focusing on real-world vulns.',
    lastUpdated: new Date().toISOString(),
    totalXp: 2000,
    nodes: [
      { id: '1', position: { x: 250, y: 0 }, data: { label: 'Networking Basics', type: 'core', status: 'completed', progress: 100, estimatedTime: '10h', xpValue: 200, description: 'Understanding TCP/IP and HTTP protocols.', resources: [{ id: 'r10', title: 'Cisco Networking Acad', url: 'https://www.netacad.com/', type: 'course' }] }, type: 'custom' },
      { id: '2', position: { x: 0, y: 150 }, data: { label: 'Linux Internals', type: 'core', status: 'in-progress', progress: 60, estimatedTime: '12h', xpValue: 300, description: 'Mastering the shell and system administration.', resources: [{ id: 'r11', title: 'Linux Journey', url: 'https://linuxjourney.com/', type: 'article' }] }, type: 'custom' },
      { id: '3', position: { x: 500, y: 150 }, data: { label: 'Web PenTesting', type: 'advanced', status: 'unlocked', progress: 0, estimatedTime: '20h', xpValue: 500, description: 'Exploiting web applications safely.', resources: [{ id: 'r12', title: 'OWASP Guide', url: 'https://owasp.org/www-project-top-ten/', type: 'doc' }] }, type: 'custom' },
      { id: '4', position: { x: 250, y: 300 }, data: { label: 'Metasploit Mastery', type: 'expert', status: 'locked', progress: 0, estimatedTime: '50h', xpValue: 1000, description: 'Exploitation frameworks and custom modules.' }, type: 'custom' },
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2' },
      { id: 'e1-3', source: '1', target: '3' },
      { id: 'e2-4', source: '2', target: '4' },
      { id: 'e3-4', source: '3', target: '4' },
    ]
  },
  {
    id: 'ai-engineering',
    name: 'LLM Systems Architect',
    description: 'Prompt engineering, RAG, and agentic workflows for modern AI.',
    lastUpdated: new Date().toISOString(),
    totalXp: 2500,
    nodes: [
      { id: '1', position: { x: 250, y: 0 }, data: { label: 'Transformer Core', type: 'core', status: 'completed', progress: 100, estimatedTime: '5h', xpValue: 300, description: 'Self-attention and feed-forward layers.', resources: [{ id: 'r30', title: 'Attention is All You Need', url: 'https://arxiv.org/abs/1706.03762', type: 'paper' }] }, type: 'custom' },
      { id: '2', position: { x: 250, y: 150 }, data: { label: 'RAG Implementation', type: 'core', status: 'in-progress', progress: 75, estimatedTime: '10h', xpValue: 500, description: 'Retrieval Augmented Generation with vector DBs.', resources: [{ id: 'r31', title: 'LlamaIndex Docs', url: 'https://docs.llamaindex.ai/', type: 'doc' }] }, type: 'custom' },
      { id: '3', position: { x: 250, y: 300 }, data: { label: 'Vector Databases', type: 'advanced', status: 'unlocked', progress: 0, estimatedTime: '15h', xpValue: 500, description: 'Pinecone, Milvus, and Weaviate.', resources: [{ id: 'r32', title: 'Pinecone Learning', url: 'https://pinecone.io/learn', type: 'article' }] }, type: 'custom' },
      { id: '4', position: { x: 250, y: 450 }, data: { label: 'Agentic Reasoning', type: 'expert', status: 'locked', progress: 0, estimatedTime: '40h', xpValue: 1200, description: 'Autonomous agents and multi-agent systems.' }, type: 'custom' },
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2' },
      { id: 'e2-3', source: '2', target: '3' },
      { id: 'e3-4', source: '3', target: '4' },
    ]
  },
  {
    id: 'blockchain-dev',
    name: 'Solidity & Web3',
    description: 'Smart contracts, DApps, and security audits.',
    lastUpdated: new Date().toISOString(),
    totalXp: 2000,
    nodes: [
      { id: '1', position: { x: 250, y: 0 }, data: { label: 'Ethereum Basics', type: 'core', status: 'completed', progress: 100, estimatedTime: '5h', xpValue: 200, description: 'Accounts, gas, and the EVM.' }, type: 'custom' },
      { id: '2', position: { x: 100, y: 150 }, data: { label: 'Solidity Core', type: 'core', status: 'in-progress', progress: 40, estimatedTime: '15h', xpValue: 600, description: 'Types, functions, and inheritence.' }, type: 'custom' },
      { id: '3', position: { x: 400, y: 150 }, data: { label: 'Foundry/Hardhat', type: 'advanced', status: 'unlocked', progress: 0, estimatedTime: '12h', xpValue: 400, description: 'Development and testing environments.' }, type: 'custom' },
      { id: '4', position: { x: 250, y: 320 }, data: { label: 'Smart Contract Audit', type: 'expert', status: 'locked', progress: 0, estimatedTime: '40h', xpValue: 800, description: 'Reentrancy, overflow, and logic flaws.' }, type: 'custom' },
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2' },
      { id: 'e1-3', source: '1', target: '3' },
      { id: 'e2-4', source: '2', target: '4' },
    ]
  },
  {
    id: 'ui-design',
    name: 'Visual Systems Mastery',
    description: 'Design language, motion systems, and accessibility.',
    lastUpdated: new Date().toISOString(),
    totalXp: 1800,
    nodes: [
      { id: '1', position: { x: 250, y: 0 }, data: { label: 'Typography', type: 'core', status: 'completed', progress: 100, estimatedTime: '6h', xpValue: 300, description: 'Scale, rhythm, and font selection.' }, type: 'custom' },
      { id: '2', position: { x: 250, y: 150 }, data: { label: 'Layout Systems', type: 'core', status: 'in-progress', progress: 60, estimatedTime: '10h', xpValue: 400, description: 'Grids, bento, and auto-layout.' }, type: 'custom' },
      { id: '3', position: { x: 250, y: 300 }, data: { label: 'Motion Design', type: 'advanced', status: 'unlocked', progress: 0, estimatedTime: '15h', xpValue: 500, description: 'Framer Motion and GSAP.' }, type: 'custom' },
      { id: '4', position: { x: 250, y: 450 }, data: { label: 'Design Tokens', type: 'expert', status: 'locked', progress: 0, estimatedTime: '20h', xpValue: 600, description: 'Variables and multi-theme systems.' }, type: 'custom' },
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2' },
      { id: 'e2-3', source: '2', target: '3' },
      { id: 'e3-4', source: '3', target: '4' },
    ]
  },
  {
    id: 'game-engine',
    name: 'Unreal C++ Expert',
    description: 'High-performance gameplay systems and custom shaders.',
    lastUpdated: new Date().toISOString(),
    totalXp: 4000,
    nodes: [
      { id: '1', position: { x: 250, y: 0 }, data: { label: 'C++ for UE5', type: 'core', status: 'completed', progress: 100, estimatedTime: '40h', xpValue: 1000, description: 'UObjects, Actors, and Memory.' }, type: 'custom' },
      { id: '2', position: { x: 250, y: 150 }, data: { label: 'Enhanced Input', type: 'core', status: 'in-progress', progress: 20, estimatedTime: '15h', xpValue: 500, description: 'Action mapping and input triggers.' }, type: 'custom' },
      { id: '3', position: { x: 250, y: 300 }, data: { label: 'Niagara Systems', type: 'advanced', status: 'unlocked', progress: 0, estimatedTime: '25h', xpValue: 1000, description: 'High-end particle effects.' }, type: 'custom' },
      { id: '4', position: { x: 250, y: 450 }, data: { label: 'HLSL Shaders', type: 'expert', status: 'locked', progress: 0, estimatedTime: '50h', xpValue: 1500, description: 'Custom rendering pipelines.' }, type: 'custom' },
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2' },
      { id: 'e2-3', source: '2', target: '3' },
      { id: 'e3-4', source: '3', target: '4' },
    ]
  },
  {
    id: 'devops-ninja',
    name: 'SRE & Cloud Ops',
    description: 'Kubernetes, Prometheus, and multi-region cloud strategy.',
    lastUpdated: new Date().toISOString(),
    totalXp: 3000,
    nodes: [
      { id: '1', position: { x: 250, y: 0 }, data: { label: 'Docker Core', type: 'core', status: 'completed', progress: 100, estimatedTime: '10h', xpValue: 400, description: 'Image optimization and registries.' }, type: 'custom' },
      { id: '2', position: { x: 250, y: 150 }, data: { label: 'Kubernetes Admin', type: 'advanced', status: 'in-progress', progress: 10, estimatedTime: '60h', xpValue: 1200, description: 'Scheduling, networking, and state.' }, type: 'custom' },
      { id: '3', position: { x: 250, y: 300 }, data: { label: 'Helm Charts', type: 'advanced', status: 'locked', progress: 0, estimatedTime: '15h', xpValue: 600, description: 'Package management for K8s.' }, type: 'custom' },
      { id: '4', position: { x: 250, y: 450 }, data: { label: 'ArgoCD / GitOps', type: 'expert', status: 'locked', progress: 0, estimatedTime: '20h', xpValue: 800, description: 'Continuous delivery pipelines.' }, type: 'custom' },
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2' },
      { id: 'e2-3', source: '2', target: '3' },
      { id: 'e3-4', source: '3', target: '4' },
    ]
  },
  {
    id: 'quantum-comp',
    name: 'Quantum Logic',
    description: 'Circuit building and error correction models.',
    lastUpdated: new Date().toISOString(),
    totalXp: 5000,
    nodes: [
      { id: '1', position: { x: 250, y: 0 }, data: { label: 'Qubits & Gates', type: 'core', status: 'completed', progress: 100, estimatedTime: '20h', xpValue: 1000, description: 'Bloch sphere and matrix gates.' }, type: 'custom' },
      { id: '2', position: { x: 250, y: 150 }, data: { label: 'Quantum Algorithms', type: 'advanced', status: 'in-progress', progress: 5, estimatedTime: '80h', xpValue: 2000, description: 'Grover\'s and Shor\'s algorithms.' }, type: 'custom' },
      { id: '3', position: { x: 250, y: 300 }, data: { label: 'Error Correction', type: 'expert', status: 'locked', progress: 0, estimatedTime: '100h', xpValue: 2000, description: 'Fault-tolerant computing.' }, type: 'custom' },
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2' },
      { id: 'e2-3', source: '2', target: '3' },
    ]
  },
  {
    id: 'rust-advanced',
    name: 'Rust Performance',
    description: 'Tokio, actix, and zero-copy data processing.',
    lastUpdated: new Date().toISOString(),
    totalXp: 2800,
    nodes: [
      { id: '1', position: { x: 250, y: 0 }, data: { label: 'Borrow Checker', type: 'core', status: 'completed', progress: 100, estimatedTime: '20h', xpValue: 800, description: 'Mastering lifetimes and safety.' }, type: 'custom' },
      { id: '2', position: { x: 250, y: 150 }, data: { label: 'Async Rust', type: 'advanced', status: 'unlocked', progress: 0, estimatedTime: '30h', xpValue: 1000, description: 'Tokio and future polling.' }, type: 'custom' },
      { id: '3', position: { x: 250, y: 300 }, data: { label: 'Unsafe Systems', type: 'expert', status: 'locked', progress: 0, estimatedTime: '40h', xpValue: 1000, description: 'FFI and raw pointers.' }, type: 'custom' },
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2' },
      { id: 'e2-3', source: '2', target: '3' },
    ]
  },
  {
    id: 'edge-computing',
    name: 'Edge & Wasm',
    description: 'High-performance edge applications with WebAssembly.',
    lastUpdated: new Date().toISOString(),
    totalXp: 2500,
    nodes: [
      { id: '1', position: { x: 250, y: 0 }, data: { label: 'Wasm Basics', type: 'core', status: 'completed', progress: 100, estimatedTime: '5h', xpValue: 400, description: 'Wat, binary format, and runtimes.' }, type: 'custom' },
      { id: '2', position: { x: 250, y: 150 }, data: { label: 'Edge Runtimes', type: 'advanced', status: 'unlocked', progress: 0, estimatedTime: '15h', xpValue: 800, description: 'V8 Isolate and Cloudflare Workers.' }, type: 'custom' },
      { id: '3', position: { x: 250, y: 300 }, data: { label: 'Distributed State', type: 'expert', status: 'locked', progress: 0, estimatedTime: '30h', xpValue: 1300, description: 'Durable Objects and CRDTs.' }, type: 'custom' },
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2' },
      { id: 'e2-3', source: '2', target: '3' },
    ]
  }
];
