

// 'use client';

// import React, { useState } from 'react';
// import { CanvasNode, RemoteCursor } from '@/app/workspace/[roomId]/page';

// interface CanvasPaneProps {
//     nodes: CanvasNode[];
//     selectedNodeId: string;
//     onSelectNode: (id: string) => void;
//     zoomLevel: number;
//     remoteCursors?: Record<string, RemoteCursor>;
//     onMouseMove?: (x: number, y: number) => void;
//     onUpdateNodePosition?: (id: string, x: number, y: number) => void;
// }

// export function CanvasPane({
//     nodes,
//     selectedNodeId,
//     onSelectNode,
//     zoomLevel,
//     remoteCursors = {},
//     onMouseMove,
//     onUpdateNodePosition,
// }: CanvasPaneProps) {
//     const [draggingId, setDraggingId] = useState<string | null>(null);
//     const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

//     // Helper to find node center coordinates for drawing connector lines
//     const getNodeCenter = (node: CanvasNode) => {
//         return {
//             x: node.x + 120, // Half of standard node width (240px)
//             y: node.y + 40,  // Half of standard node height
//         };
//     };

//     // Connections map between nodes (can be customized or dynamically linked)
//     const connections = [
//         { from: 'auth-node', to: 'db-node', label: 'mTLS / SQL' },
//         { from: 'gateway-node', to: 'auth-node', label: 'gRPC / RPC' },
//     ];

//     const handleMouseDownNode = (e: React.MouseEvent, node: CanvasNode) => {
//         e.stopPropagation();
//         onSelectNode(node.id);
//         setDraggingId(node.id);
//         setDragOffset({
//             x: e.clientX - node.x,
//             y: e.clientY - node.y,
//         });
//     };

//     const handleMouseMovePane = (e: React.MouseEvent) => {
//         const rect = e.currentTarget.getBoundingClientRect();
//         const cursorX = e.clientX - rect.left;
//         const cursorY = e.clientY - rect.top;

//         if (onMouseMove) {
//             onMouseMove(cursorX, cursorY);
//         }

//         // Handle active node dragging
//         if (draggingId && onUpdateNodePosition) {
//             const newX = e.clientX - dragOffset.x;
//             const newY = e.clientY - dragOffset.y;
//             onUpdateNodePosition(draggingId, newX, newY);
//         }
//     };

//     const handleMouseUp = () => {
//         setDraggingId(null);
//     };

//     return (
//         <div
//             className="h-full w-full relative bg-slate-50 overflow-auto select-none cursor-grab active:cursor-grabbing"
//             onMouseMove={handleMouseMovePane}
//             onMouseUp={handleMouseUp}
//         >
//             <div
//                 className="relative w-[3000px] h-[3000px]"
//                 style={{
//                     transform: `scale(${zoomLevel / 100})`,
//                     transformOrigin: 'top left',
//                 }}
//             >
//                 {/* SVG Background Layer for Connector Lines */}
//                 <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
//                     <defs>
//                         <marker
//                             id="arrow"
//                             viewBox="0 0 10 10"
//                             refX="7"
//                             refY="5"
//                             markerWidth="6"
//                             markerHeight="6"
//                             orient="auto-start-reverse"
//                         >
//                             <path d="M 0 1 L 10 5 L 0 9 z" fill="#6366f1" />
//                         </marker>
//                     </defs>

//                     {connections.map((conn, idx) => {
//                         const sourceNode = nodes.find((n) => n.id === conn.from);
//                         const targetNode = nodes.find((n) => n.id === conn.to);

//                         if (!sourceNode || !targetNode) return null;

//                         const start = getNodeCenter(sourceNode);
//                         const end = getNodeCenter(targetNode);

//                         // Smooth Bezier Curve Path Calculation
//                         const dx = Math.abs(end.x - start.x) * 0.5;
//                         const pathData = `M ${start.x} ${start.y} C ${start.x + dx} ${start.y}, ${end.x - dx} ${end.y}, ${end.x} ${end.y}`;

//                         const midX = (start.x + end.x) / 2;
//                         const midY = (start.y + end.y) / 2;

//                         return (
//                             <g key={idx}>
//                                 <path
//                                     d={pathData}
//                                     fill="none"
//                                     stroke="#6366f1"
//                                     strokeWidth="2.5"
//                                     strokeDasharray="6 6"
//                                     className="opacity-70 animate-pulse"
//                                     markerEnd="url(#arrow)"
//                                 />
//                                 <foreignObject x={midX - 45} y={midY - 12} width="90" height="26">
//                                     <div className="flex items-center justify-center">
//                                         <span className="bg-slate-900 text-indigo-300 font-mono text-[9px] px-2 py-0.5 rounded shadow border border-slate-800">
//                                             {conn.label}
//                                         </span>
//                                     </div>
//                                 </foreignObject>
//                             </g>
//                         );
//                     })}
//                 </svg>

//                 {/* Render Draggable Canvas Nodes */}
//                 {nodes.map((node) => (
//                     <div
//                         key={node.id}
//                         onMouseDown={(e) => handleMouseDownNode(e, node)}
//                         onClick={(e) => {
//                             e.stopPropagation();
//                             onSelectNode(node.id);
//                         }}
//                         className={`absolute p-4 rounded-xl border bg-white shadow-lg cursor-pointer transition-shadow z-10 ${selectedNodeId === node.id
//                                 ? 'border-indigo-600 ring-2 ring-indigo-200 shadow-indigo-500/20'
//                                 : 'border-slate-200 hover:border-slate-300'
//                             }`}
//                         style={{ left: node.x, top: node.y, width: 240 }}
//                     >
//                         <div className="flex items-center justify-between mb-1">
//                             <h3 className="font-semibold text-slate-800 text-xs">{node.title}</h3>
//                             <span className="text-[9px] font-mono uppercase bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
//                                 {node.type}
//                             </span>
//                         </div>
//                         <p className="text-xs text-slate-500 truncate">{node.description}</p>
//                     </div>
//                 ))}

//                 {/* Render Remote Cursors */}
//                 {Object.entries(remoteCursors).map(([userId, pos]) => (
//                     <div
//                         key={userId}
//                         className="absolute pointer-events-none z-40 transition-all duration-75 ease-linear flex items-center gap-1"
//                         style={{ left: pos.x, top: pos.y }}
//                     >
//                         <svg className="w-5 h-5 text-indigo-600 fill-indigo-600 drop-shadow" viewBox="0 0 24 24">
//                             <path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87c.45 0 .67-.54.35-.85L6.35 2.86a.5.5 0 0 0-.85.35z" />
//                         </svg>
//                         <span className="bg-indigo-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-medium shadow">
//                             {userId}
//                         </span>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }




'use client';

import React, { useState } from 'react';
import { CanvasNode, RemoteCursor } from '@/app/workspace/[roomId]/page';

interface CanvasPaneProps {
    nodes: CanvasNode[];
    selectedNodeId: string;
    onSelectNode: (id: string) => void;
    zoomLevel: number;
    remoteCursors?: Record<string, RemoteCursor>;
    onMouseMove?: (x: number, y: number) => void;
    onUpdateNodePosition?: (id: string, x: number, y: number) => void;
}

export function CanvasPane({
    nodes,
    selectedNodeId,
    onSelectNode,
    zoomLevel,
    remoteCursors = {},
    onMouseMove,
    onUpdateNodePosition,
}: CanvasPaneProps) {
    const [draggingId, setDraggingId] = useState<string | null>(null);
    const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

    // Helper to find node center coordinates for drawing connector lines
    const getNodeCenter = (node: CanvasNode) => {
        return {
            x: node.x + 120, // Half of standard node width (240px)
            y: node.y + 40,  // Half of standard node height
        };
    };

    // Dynamically map connections with fallbacks so lines render between any active nodes
    const connections = [
        {
            from: nodes.find(n => n.id === 'gateway-node')?.id || nodes[1]?.id || nodes[0]?.id,
            to: nodes.find(n => n.id === 'auth-node')?.id || nodes[0]?.id,
            label: 'gRPC / RPC'
        },
        {
            from: nodes.find(n => n.id === 'auth-node')?.id || nodes[0]?.id,
            to: nodes.find(n => n.id === 'db-node')?.id || nodes[2]?.id || nodes[nodes.length - 1]?.id,
            label: 'mTLS / SQL'
        },
    ].filter(c => c.from && c.to && c.from !== c.to);

    const handleMouseDownNode = (e: React.MouseEvent, node: CanvasNode) => {
        e.stopPropagation();
        onSelectNode(node.id);
        setDraggingId(node.id);
        setDragOffset({
            x: e.clientX - node.x,
            y: e.clientY - node.y,
        });
    };

    const handleMouseMovePane = (e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const cursorX = e.clientX - rect.left;
        const cursorY = e.clientY - rect.top;

        if (onMouseMove) {
            onMouseMove(cursorX, cursorY);
        }

        // Handle active node dragging
        if (draggingId && onUpdateNodePosition) {
            const newX = e.clientX - dragOffset.x;
            const newY = e.clientY - dragOffset.y;
            onUpdateNodePosition(draggingId, newX, newY);
        }
    };

    const handleMouseUp = () => {
        setDraggingId(null);
    };

    return (
        <div
            className="h-full w-full relative bg-slate-50 overflow-auto select-none cursor-grab active:cursor-grabbing"
            onMouseMove={handleMouseMovePane}
            onMouseUp={handleMouseUp}
        >
            <div
                className="relative w-[3000px] h-[3000px]"
                style={{
                    transform: `scale(${zoomLevel / 100})`,
                    transformOrigin: 'top left',
                }}
            >
                {/* SVG Background Layer for Connector Lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                    <defs>
                        <marker
                            id="arrow"
                            viewBox="0 0 10 10"
                            refX="7"
                            refY="5"
                            markerWidth="6"
                            markerHeight="6"
                            orient="auto-start-reverse"
                        >
                            <path d="M 0 1 L 10 5 L 0 9 z" fill="#6366f1" />
                        </marker>
                    </defs>

                    {connections.map((conn, idx) => {
                        const sourceNode = nodes.find((n) => n.id === conn.from);
                        const targetNode = nodes.find((n) => n.id === conn.to);

                        if (!sourceNode || !targetNode) return null;

                        const start = getNodeCenter(sourceNode);
                        const end = getNodeCenter(targetNode);

                        // Smooth Bezier Curve Path Calculation
                        const dx = Math.abs(end.x - start.x) * 0.5;
                        const pathData = `M ${start.x} ${start.y} C ${start.x + dx} ${start.y}, ${end.x - dx} ${end.y}, ${end.x} ${end.y}`;

                        const midX = (start.x + end.x) / 2;
                        const midY = (start.y + end.y) / 2;

                        return (
                            <g key={idx}>
                                <path
                                    d={pathData}
                                    fill="none"
                                    stroke="#6366f1"
                                    strokeWidth="2.5"
                                    strokeDasharray="6 6"
                                    className="opacity-70 animate-pulse"
                                    markerEnd="url(#arrow)"
                                />
                                <foreignObject x={midX - 45} y={midY - 12} width="90" height="26">
                                    <div className="flex items-center justify-center">
                                        <span className="bg-slate-900 text-indigo-300 font-mono text-[9px] px-2 py-0.5 rounded shadow border border-slate-800">
                                            {conn.label}
                                        </span>
                                    </div>
                                </foreignObject>
                            </g>
                        );
                    })}
                </svg>

                {/* Render Draggable Canvas Nodes */}
                {nodes.map((node) => (
                    <div
                        key={node.id}
                        onMouseDown={(e) => handleMouseDownNode(e, node)}
                        onClick={(e) => {
                            e.stopPropagation();
                            onSelectNode(node.id);
                        }}
                        className={`absolute p-4 rounded-xl border bg-white shadow-lg cursor-pointer transition-shadow z-10 ${selectedNodeId === node.id
                                ? 'border-indigo-600 ring-2 ring-indigo-200 shadow-indigo-500/20'
                                : 'border-slate-200 hover:border-slate-300'
                            }`}
                        style={{ left: node.x, top: node.y, width: 240 }}
                    >
                        <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold text-slate-800 text-xs">{node.title}</h3>
                            <span className="text-[9px] font-mono uppercase bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                                {node.type}
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 truncate">{node.description}</p>
                    </div>
                ))}

                {/* Render Remote Cursors */}
                {Object.entries(remoteCursors).map(([userId, pos]) => (
                    <div
                        key={userId}
                        className="absolute pointer-events-none z-40 transition-all duration-75 ease-linear flex items-center gap-1"
                        style={{ left: pos.x, top: pos.y }}
                    >
                        <svg className="w-5 h-5 text-indigo-600 fill-indigo-600 drop-shadow" viewBox="0 0 24 24">
                            <path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87c.45 0 .67-.54.35-.85L6.35 2.86a.5.5 0 0 0-.85.35z" />
                        </svg>
                        <span className="bg-indigo-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-medium shadow">
                            {userId}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}