'use client';

import { useState } from 'react';
import { WorkspaceHeader } from '@/components/workspace/WorkspaceHeader';
import { CanvasPane } from '../../components/workspace/CanvasPane';
import { MarkdownStudioPane } from '@/components/workspace/MarkdownStudioPane';
import { BottomToolbar } from '@/components/workspace/BottomToolbar';

export type CanvasNode = {
    id: string;
    title: string;
    type: 'service' | 'database' | 'gateway';
    x: number;
    y: number;
    description: string;
};

export default function WorkspacePage() {
    // Active selected canvas node linked bidirectionally to Markdown
    const [selectedNodeId, setSelectedNodeId] = useState<string>('auth-node');

    // Panel state
    const [splitRatio, setSplitRatio] = useState<number>(55); // % for Canvas width
    const [isMarkdownOpen, setIsMarkdownOpen] = useState<boolean>(true);
    const [zoomLevel, setZoomLevel] = useState<number>(100);

    // Initial Mock Canvas Nodes
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

    return (
        <div className="h-screen w-screen flex flex-col bg-slate-100 overflow-hidden select-none">
            {/* Top Navigation & Status Bar */}
            <WorkspaceHeader
                isMarkdownOpen={isMarkdownOpen}
                onToggleMarkdown={() => setIsMarkdownOpen(!isMarkdownOpen)}
            />

            {/* Main Split-Screen Workspace Surface */}
            <div className="flex-1 flex relative overflow-hidden">

                {/* Left Pane: Infinite Canvas */}
                <div
                    style={{ width: isMarkdownOpen ? `${splitRatio}%` : '100%' }}
                    className="h-full relative transition-all duration-75 ease-out"
                >
                    <CanvasPane
                        nodes={nodes}
                        selectedNodeId={selectedNodeId}
                        onSelectNode={setSelectedNodeId}
                        zoomLevel={zoomLevel}
                    />
                </div>

                {/* Resizable Divider Handle */}
                {isMarkdownOpen && (
                    <div
                        className="w-1.5 bg-slate-200 hover:bg-indigo-500 cursor-col-resize transition-colors z-20 flex items-center justify-center group"
                        onMouseDown={(e) => {
                            const handleMouseMove = (moveEvent: MouseEvent) => {
                                const newRatio = (moveEvent.clientX / window.innerWidth) * 100;
                                if (newRatio > 25 && newRatio < 80) {
                                    setSplitRatio(newRatio);
                                }
                            };
                            const handleMouseUp = () => {
                                window.removeEventListener('mousemove', handleMouseMove);
                                window.removeEventListener('mouseup', handleMouseUp);
                            };
                            window.addEventListener('mousemove', handleMouseMove);
                            window.addEventListener('mouseup', handleMouseUp);
                        }}
                    >
                        <div className="w-0.5 h-8 bg-slate-400 group-hover:bg-white rounded-full" />
                    </div>
                )}

                {/* Right Pane: Linked Markdown Studio */}
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
                            }}
                        />
                    </div>
                )}

                {/* Floating Bottom Canvas Controls */}
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