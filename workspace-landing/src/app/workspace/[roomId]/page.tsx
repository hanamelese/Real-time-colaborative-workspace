

// 'use client';

// import { useState, Suspense, useRef, useEffect } from 'react';
// import { WorkspaceHeader } from '@/components/workspace/WorkspaceHeader';
// import { CanvasPane } from '@/components/workspace/CanvasPane';
// import { MarkdownStudioPane } from '@/components/workspace/MarkdownStudioPane';
// import { BottomToolbar } from '@/components/workspace/BottomToolbar';
// import { useWebSocket } from '@/hooks/useWebSocket';
// import { useParams } from 'next/navigation';

// export type CanvasNode = {
//     id: string;
//     title: string;
//     type: 'service' | 'database' | 'gateway';
//     x: number;
//     y: number;
//     description: string;
// };

// export type RemoteCursor = {
//     x: number;
//     y: number;
// };

// function WorkspaceContent() {
//     const params = useParams();
//     const roomId = (params?.roomId as string) || 'default-room';

//     // Fix hydration mismatch by generating random user ID on client mount only
//     const [isMounted, setIsMounted] = useState(false);
//     const [userId, setUserId] = useState<string>('Connecting...');

//     useEffect(() => {
//         setIsMounted(true);
//         setUserId(`User-${Math.floor(Math.random() * 9000 + 1000)}`);
//     }, []);

//     const [selectedNodeId, setSelectedNodeId] = useState<string>('auth-node');
//     const [splitRatio, setSplitRatio] = useState<number>(55);
//     const [isMarkdownOpen, setIsMarkdownOpen] = useState<boolean>(true);
//     const [zoomLevel, setZoomLevel] = useState<number>(100);
//     const [remoteCursors, setRemoteCursors] = useState<Record<string, RemoteCursor>>({});

//     const [nodes, setNodes] = useState<CanvasNode[]>([
//         {
//             id: 'auth-node',
//             title: 'Auth Microservice',
//             type: 'service',
//             x: 180,
//             y: 120,
//             description: 'OAuth2 + JWT authentication service handling token issuing and mTLS validation.',
//         },
//         {
//             id: 'gateway-node',
//             title: 'API Gateway (Rust)',
//             type: 'gateway',
//             x: 180,
//             y: 300,
//             description: 'Rust-based Tokio async proxy handling WebSocket routing and rate limiting.',
//         },
//         {
//             id: 'db-node',
//             title: 'PostgreSQL Cluster',
//             type: 'database',
//             x: 560,
//             y: 200,
//             description: 'Primary database cluster storing user credentials and document state snapshots.',
//         },
//     ]);

//     // Fetch saved node states from SQLite backend on load
//     useEffect(() => {
//         async function fetchSavedNodes() {
//             try {
//                 const res = await fetch(`http://127.0.0.1:8080/api/rooms/${roomId}/nodes`);
//                 if (res.ok) {
//                     const savedNodes: [string, string][] = await res.json();
//                     if (savedNodes.length > 0) {
//                         setNodes((prevNodes) =>
//                             prevNodes.map((node) => {
//                                 const found = savedNodes.find(([nId]) => nId === node.id);
//                                 return found ? { ...node, description: found[1] } : node;
//                             })
//                         );
//                     }
//                 }
//             } catch (err) {
//                 console.error('Failed to fetch saved node states from backend:', err);
//             }
//         }

//         fetchSavedNodes();
//     }, [roomId]);

//     const handleIncomingMessage = (message: any) => {
//         if (message.type === 'NodeUpdate') {
//             setNodes((prev) =>
//                 prev.map((n) => (n.id === message.payload.node_id ? { ...n, description: message.payload.content } : n))
//             );
//         } else if (message.type === 'CursorUpdate') {
//             // Ignore our own cursor updates, track others
//             if (message.payload.user_id !== userId) {
//                 setRemoteCursors((prev) => ({
//                     ...prev,
//                     [message.payload.user_id]: {
//                         x: message.payload.x,
//                         y: message.payload.y,
//                     },
//                 }));
//             }
//         }
//     };

//     const { status, sendMessage } = useWebSocket({
//         roomId,
//         onMessage: handleIncomingMessage,
//     });

//     const handleAddNode = (type: 'service' | 'database' | 'gateway') => {
//         const newNode: CanvasNode = {
//             id: `node-${Date.now()}`,
//             title: `New ${type.toUpperCase()}`,
//             type,
//             x: 300 + Math.random() * 50,
//             y: 200 + Math.random() * 50,
//             description: 'Click to edit documentation spec for this service node.',
//         };
//         setNodes((prev) => [...prev, newNode]);
//         setSelectedNodeId(newNode.id);
//     };

//     // Throttled mouse move broadcaster for cursor presence
//     const lastSentRef = useRef<number>(0);
//     const handleMouseMove = (x: number, y: number) => {
//         const now = Date.now();
//         if (now - lastSentRef.current > 50) { // Limit to ~20 updates per second
//             lastSentRef.current = now;
//             sendMessage({
//                 type: 'CursorUpdate',
//                 payload: { user_id: userId, x, y },
//             });
//         }
//     };

//     return (
//         <div className="h-screen w-screen flex flex-col bg-slate-100 overflow-hidden select-none">
//             <div className="relative">
//                 <WorkspaceHeader
//                     isMarkdownOpen={isMarkdownOpen}
//                     onToggleMarkdown={() => setIsMarkdownOpen(!isMarkdownOpen)}
//                 />
//                 <div className="absolute top-3 right-20 z-50 flex items-center gap-3 rounded-full bg-slate-900 px-3 py-1 text-xs border border-slate-800 shadow-sm text-white">
//                     <span className="text-slate-400 font-mono">
//                         {isMounted ? userId : 'Loading...'}
//                     </span>
//                     <div className="flex items-center gap-1.5">
//                         <span
//                             className={`h-2 w-2 rounded-full ${status === 'Connected'
//                                 ? 'bg-emerald-500 animate-pulse'
//                                 : status === 'Connecting'
//                                     ? 'bg-amber-500'
//                                     : 'bg-rose-500'
//                                 }`}
//                         />
//                         <span className="font-medium">Sync: {status}</span>
//                     </div>
//                 </div>
//             </div>

//             <div className="flex-1 flex relative overflow-hidden">
//                 <div
//                     style={{ width: isMarkdownOpen ? `${splitRatio}%` : '100%' }}
//                     className="h-full relative transition-all duration-75 ease-out"
//                 >
//                     {/* <CanvasPane
//                         nodes={nodes}
//                         selectedNodeId={selectedNodeId}
//                         onSelectNode={setSelectedNodeId}
//                         zoomLevel={zoomLevel}
//                         remoteCursors={remoteCursors}
//                         onMouseMove={handleMouseMove}
//                     /> */}
//                     <CanvasPane
//                         nodes={nodes}
//                         selectedNodeId={selectedNodeId}
//                         onSelectNode={setSelectedNodeId}
//                         zoomLevel={zoomLevel}
//                         remoteCursors={remoteCursors}
//                         onMouseMove={handleMouseMove}
//                         onUpdateNodePosition={(id, x, y) => {
//                             setNodes((prev) =>
//                                 prev.map((n) => (n.id === id ? { ...n, x, y } : n))
//                             );
//                         }}
//                     />
//                 </div>

//                 {isMarkdownOpen && (
//                     <div
//                         className="w-1.5 bg-slate-200 hover:bg-indigo-500 cursor-col-resize transition-colors z-20 flex items-center justify-center group"
//                         onMouseDown={() => {
//                             const handleMouseMoveResize = (moveEvent: MouseEvent) => {
//                                 const newRatio = (moveEvent.clientX / window.innerWidth) * 100;
//                                 if (newRatio > 25 && newRatio < 80) {
//                                     setSplitRatio(newRatio);
//                                 }
//                             };
//                             const handleMouseUpResize = () => {
//                                 window.removeEventListener('mousemove', handleMouseMoveResize);
//                                 window.removeEventListener('mouseup', handleMouseUpResize);
//                             };
//                             window.addEventListener('mousemove', handleMouseMoveResize);
//                             window.addEventListener('mouseup', handleMouseUpResize);
//                         }}
//                     >
//                         <div className="w-0.5 h-8 bg-slate-400 group-hover:bg-white rounded-full" />
//                     </div>
//                 )}

//                 {isMarkdownOpen && (
//                     <div
//                         style={{ width: `${100 - splitRatio}%` }}
//                         className="h-full bg-white border-l border-slate-200 z-10"
//                     >
//                         <MarkdownStudioPane
//                             selectedNode={nodes.find((n) => n.id === selectedNodeId) || null}
//                             onUpdateNodeDescription={(id, desc) => {
//                                 setNodes((prev) =>
//                                     prev.map((n) => (n.id === id ? { ...n, description: desc } : n))
//                                 );

//                                 // @ts-ignore
//                                 clearTimeout(window._nodeUpdateTimer);
//                                 // @ts-ignore
//                                 window._nodeUpdateTimer = setTimeout(() => {
//                                     sendMessage({
//                                         type: 'NodeUpdate',
//                                         payload: { node_id: id, content: desc },
//                                     });
//                                 }, 300);
//                             }}
//                         />
//                     </div>
//                 )}

//                 <BottomToolbar
//                     zoomLevel={zoomLevel}
//                     onZoomIn={() => setZoomLevel((z) => Math.min(200, z + 10))}
//                     onZoomOut={() => setZoomLevel((z) => Math.max(50, z - 10))}
//                     onAddNode={handleAddNode}
//                 />
//             </div>
//         </div>
//     );
// }

// export default function WorkspacePage() {
//     return (
//         <Suspense fallback={<div className="h-screen w-screen flex items-center justify-center bg-slate-100 text-slate-500">Loading workspace...</div>}>
//             <WorkspaceContent />
//         </Suspense>
//     );
// }



'use client';

import { useState, Suspense, useRef, useEffect } from 'react';
import { WorkspaceHeader } from '@/components/workspace/WorkspaceHeader';
import { CanvasPane } from '@/components/workspace/CanvasPane';
import { MarkdownStudioPane } from '@/components/workspace/MarkdownStudioPane';
import { BottomToolbar } from '@/components/workspace/BottomToolbar';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useParams } from 'next/navigation';

export type CanvasNode = {
    id: string;
    title: string;
    type: 'service' | 'database' | 'gateway';
    x: number;
    y: number;
    description: string;
};

export type RemoteCursor = {
    x: number;
    y: number;
};

function WorkspaceContent() {
    const params = useParams();
    const roomId = (params?.roomId as string) || 'default-room';

    // Fix hydration mismatch by generating random user ID on client mount only
    const [isMounted, setIsMounted] = useState(false);
    const [userId, setUserId] = useState<string>('Connecting...');

    useEffect(() => {
        setIsMounted(true);
        setUserId(`User-${Math.floor(Math.random() * 9000 + 1000)}`);
    }, []);

    const [selectedNodeId, setSelectedNodeId] = useState<string>('auth-node');
    const [splitRatio, setSplitRatio] = useState<number>(55);
    const [isMarkdownOpen, setIsMarkdownOpen] = useState<boolean>(true);
    const [zoomLevel, setZoomLevel] = useState<number>(100);
    const [remoteCursors, setRemoteCursors] = useState<Record<string, RemoteCursor>>({});

    const [nodes, setNodes] = useState<CanvasNode[]>([
        {
            id: 'auth-node',
            title: 'Auth Microservice',
            type: 'service',
            x: 180,
            y: 120,
            description: 'OAuth2 + JWT authentication service handling token issuing and mTLS validation.',
        },
        {
            id: 'gateway-node',
            title: 'API Gateway (Rust)',
            type: 'gateway',
            x: 180,
            y: 300,
            description: 'Rust-based Tokio async proxy handling WebSocket routing and rate limiting.',
        },
        {
            id: 'db-node',
            title: 'PostgreSQL Cluster',
            type: 'database',
            x: 560,
            y: 200,
            description: 'Primary database cluster storing user credentials and document state snapshots.',
        },
    ]);

    // Fetch saved node states from SQLite backend on load
    useEffect(() => {
        async function fetchSavedNodes() {
            try {
                const res = await fetch(`https://real-time-collaborative-workspace-production.up.railway.app/api/rooms/${roomId}/nodes`);
                if (res.ok) {
                    const savedNodes: [string, string][] = await res.json();
                    if (savedNodes.length > 0) {
                        setNodes((prevNodes) =>
                            prevNodes.map((node) => {
                                const found = savedNodes.find(([nId]) => nId === node.id);
                                return found ? { ...node, description: found[1] } : node;
                            })
                        );
                    }
                }
            } catch (err) {
                console.error('Failed to fetch saved node states from backend:', err);
            }
        }

        fetchSavedNodes();
    }, [roomId]);

    const handleIncomingMessage = (message: any) => {
        if (message.type === 'NodeUpdate') {
            setNodes((prev) =>
                prev.map((n) => (n.id === message.payload.node_id ? { ...n, description: message.payload.content } : n))
            );
        } else if (message.type === 'CursorUpdate') {
            // Ignore our own cursor updates, track others
            if (message.payload.user_id !== userId) {
                setRemoteCursors((prev) => ({
                    ...prev,
                    [message.payload.user_id]: {
                        x: message.payload.x,
                        y: message.payload.y,
                    },
                }));
            }
        }
    };

    const { status, sendMessage } = useWebSocket({
        roomId,
        onMessage: handleIncomingMessage,
    });

    const handleAddNode = (type: 'service' | 'database' | 'gateway') => {
        const newNode: CanvasNode = {
            id: `node-${Date.now()}`,
            title: `New ${type.toUpperCase()}`,
            type,
            x: 300 + Math.random() * 50,
            y: 200 + Math.random() * 50,
            description: 'Click to edit documentation spec for this service node.',
        };
        setNodes((prev) => [...prev, newNode]);
        setSelectedNodeId(newNode.id);
    };

    // Throttled mouse move broadcaster for cursor presence
    const lastSentRef = useRef<number>(0);
    const handleMouseMove = (x: number, y: number) => {
        const now = Date.now();
        if (now - lastSentRef.current > 50) { // Limit to ~20 updates per second
            lastSentRef.current = now;
            sendMessage({
                type: 'CursorUpdate',
                payload: { user_id: userId, x, y },
            });
        }
    };

    return (
        <div className="h-screen w-screen flex flex-col bg-slate-100 overflow-hidden select-none">
            <div className="relative">
                <WorkspaceHeader
                    isMarkdownOpen={isMarkdownOpen}
                    onToggleMarkdown={() => setIsMarkdownOpen(!isMarkdownOpen)}
                />
                <div className="absolute top-3 right-20 z-50 flex items-center gap-3 rounded-full bg-slate-900 px-3 py-1 text-xs border border-slate-800 shadow-sm text-white">
                    <span className="text-slate-400 font-mono">
                        {isMounted ? userId : 'Loading...'}
                    </span>
                    <div className="flex items-center gap-1.5">
                        <span
                            className={`h-2 w-2 rounded-full ${status === 'Connected'
                                ? 'bg-emerald-500 animate-pulse'
                                : status === 'Connecting'
                                    ? 'bg-amber-500'
                                    : 'bg-rose-500'
                                }`}
                        />
                        <span className="font-medium">Sync: {status}</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex relative overflow-hidden">
                <div
                    style={{ width: isMarkdownOpen ? `${splitRatio}%` : '100%' }}
                    className="h-full relative transition-all duration-75 ease-out"
                >
                    <CanvasPane
                        nodes={nodes}
                        selectedNodeId={selectedNodeId}
                        onSelectNode={setSelectedNodeId}
                        zoomLevel={zoomLevel}
                        remoteCursors={remoteCursors}
                        onMouseMove={handleMouseMove}
                        onUpdateNodePosition={(id, x, y) => {
                            setNodes((prev) =>
                                prev.map((n) => (n.id === id ? { ...n, x, y } : n))
                            );
                        }}
                    />
                </div>

                {isMarkdownOpen && (
                    <div
                        className="w-1.5 bg-slate-200 hover:bg-indigo-500 cursor-col-resize transition-colors z-20 flex items-center justify-center group"
                        onMouseDown={() => {
                            const handleMouseMoveResize = (moveEvent: MouseEvent) => {
                                const newRatio = (moveEvent.clientX / window.innerWidth) * 100;
                                if (newRatio > 25 && newRatio < 80) {
                                    setSplitRatio(newRatio);
                                }
                            };
                            const handleMouseUpResize = () => {
                                window.removeEventListener('mousemove', handleMouseMoveResize);
                                window.removeEventListener('mouseup', handleMouseUpResize);
                            };
                            window.addEventListener('mousemove', handleMouseMoveResize);
                            window.addEventListener('mouseup', handleMouseUpResize);
                        }}
                    >
                        <div className="w-0.5 h-8 bg-slate-400 group-hover:bg-white rounded-full" />
                    </div>
                )}

                {isMarkdownOpen && (
                    <div
                        style={{ width: `${100 - splitRatio}%` }}
                        className="h-full bg-white border-l border-slate-200 z-10"
                    >
                        <MarkdownStudioPane
                            selectedNode={nodes.find((n) => n.id === selectedNodeId) || null}
                            onUpdateNodeDescription={(id, desc) => {
                                setNodes((prev) =>
                                    prev.map((n) => (n.id === id ? { ...n, description: desc } : n))
                                );

                                // @ts-ignore
                                clearTimeout(window._nodeUpdateTimer);
                                // @ts-ignore
                                window._nodeUpdateTimer = setTimeout(() => {
                                    sendMessage({
                                        type: 'NodeUpdate',
                                        payload: { node_id: id, content: desc },
                                    });
                                }, 300);
                            }}
                        />
                    </div>
                )}

                <BottomToolbar
                    zoomLevel={zoomLevel}
                    onZoomIn={() => setZoomLevel((z) => Math.min(200, z + 10))}
                    onZoomOut={() => setZoomLevel((z) => Math.max(50, z - 10))}
                    onAddNode={handleAddNode}
                />
            </div>
        </div>
    );
}

export default function WorkspacePage() {
    return (
        <Suspense fallback={<div className="h-screen w-screen flex items-center justify-center bg-slate-100 text-slate-500">Loading workspace...</div>}>
            <WorkspaceContent />
        </Suspense>
    );
}