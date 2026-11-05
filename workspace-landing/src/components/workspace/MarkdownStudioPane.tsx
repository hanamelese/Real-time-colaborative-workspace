import React, { useEffect, useState } from 'react';
import { CanvasNode, Connection } from '@/app/workspace/[roomId]/page';
import { FileText, Link as LinkIcon, Code2, CheckCircle, Trash2, Plus, ArrowRightLeft } from 'lucide-react';
import { useYjsMarkdown } from '@/hooks/useYjsMarkdown';

interface MarkdownStudioPaneProps {
    selectedNode: CanvasNode | null;
    nodes: CanvasNode[];
    connections: Connection[];
    onUpdateNodeDescription: (id: string, desc: string) => void;
    onUpdateNodeTitle: (id: string, title: string) => void;
    onDeleteNode: (id: string) => void;
    onAddConnection: (from: string, to: string, label: string, style: 'solid' | 'dashed') => void;
    onDeleteConnection: (from: string, to: string) => void;
    onSendCrdtUpdate?: (update: Uint8Array) => void;
}

export function MarkdownStudioPane({
    selectedNode,
    nodes,
    connections,
    onUpdateNodeDescription,
    onUpdateNodeTitle,
    onDeleteNode,
    onAddConnection,
    onDeleteConnection,
    onSendCrdtUpdate,
}: MarkdownStudioPaneProps) {
    const { text, updateLocalText } = useYjsMarkdown({
        roomId: selectedNode?.id || 'default-room',
        onSendBinary: (update) => {
            if (onSendCrdtUpdate) onSendCrdtUpdate(update);
        },
    });

    const [targetNodeId, setTargetNodeId] = useState<string>('');
    const [connLabel, setConnLabel] = useState<string>('HTTP');
    const [connStyle, setConnStyle] = useState<'solid' | 'dashed'>('solid');

    useEffect(() => {
        if (selectedNode) {
            updateLocalText(selectedNode.description);
            const available = nodes.filter(n => n.id !== selectedNode.id);
            if (available.length > 0) setTargetNodeId(available[0].id);
        }
    }, [selectedNode?.id, nodes]);

    if (!selectedNode) {
        return (
            <div className="h-full flex items-center justify-center p-6 text-center text-slate-400 text-sm">
                Select a node on the canvas to edit its documentation spec.
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col justify-between p-6 overflow-y-auto">
            <div className="space-y-6">
                {/* Pane Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase text-slate-400">
                        <FileText className="w-4 h-4 text-indigo-600" />
                        <span>Markdown Specification</span>
                    </div>
                    <span className="flex items-center gap-1 text-[11px] text-indigo-600 font-mono bg-indigo-50 px-2 py-0.5 rounded">
                        <LinkIcon className="w-3 h-3" /> Bound to: {selectedNode.id}
                    </span>
                </div>

                {/* Title Input & Delete Button */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-medium text-slate-500">Node Subject / Title</label>
                        <button
                            onClick={() => onDeleteNode(selectedNode.id)}
                            className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-medium bg-rose-50 hover:bg-rose-100 px-2 py-1 rounded-lg transition cursor-pointer"
                            title="Delete this node"
                        >
                            <Trash2 className="w-3.5 h-3.5" /> Delete Node
                        </button>
                    </div>
                    <input
                        type="text"
                        value={selectedNode.title}
                        onChange={(e) => onUpdateNodeTitle(selectedNode.id, e.target.value)}
                        className="w-full text-base font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                        placeholder="Node title..."
                    />
                </div>

                {/* Node Connections & Line Style Management */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-3">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                        <ArrowRightLeft className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Connections & Line Styles</span>
                    </div>

                    {/* Existing Connections List */}
                    <div className="space-y-1.5 max-h-32 overflow-y-auto">
                        {connections
                            .filter(c => c.from === selectedNode.id || c.to === selectedNode.id)
                            .map((conn, i) => {
                                const targetId = conn.from === selectedNode.id ? conn.to : conn.from;
                                const targetNode = nodes.find(n => n.id === targetId);
                                return (
                                    <div key={i} className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs">
                                        <div className="flex items-center gap-1.5 truncate text-slate-700">
                                            <span className="text-indigo-600 font-mono text-[10px] bg-indigo-50 px-1.5 py-0.5 rounded">
                                                {conn.label} ({conn.style || 'dashed'})
                                            </span>
                                            <span className="truncate">
                                                {conn.from === selectedNode.id ? '→ ' : '← '} {targetNode?.title || targetId}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => onDeleteConnection(conn.from, conn.to)}
                                            className="text-slate-400 hover:text-rose-600 transition cursor-pointer"
                                            title="Remove connection"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                );
                            })}
                    </div>

                    {/* Add Connection Controls */}
                    <div className="pt-2 border-t border-slate-200 flex flex-col gap-2">
                        <div className="flex gap-2">
                            <select
                                value={targetNodeId}
                                onChange={(e) => setTargetNodeId(e.target.value)}
                                className="flex-1 text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white text-slate-700 focus:outline-hidden"
                            >
                                {nodes
                                    .filter(n => n.id !== selectedNode.id)
                                    .map(n => (
                                        <option key={n.id} value={n.id}>{n.title}</option>
                                    ))}
                            </select>
                            <input
                                type="text"
                                value={connLabel}
                                onChange={(e) => setConnLabel(e.target.value)}
                                placeholder="Protocol"
                                className="w-20 text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white text-slate-700"
                            />
                        </div>
                        <div className="flex gap-2 items-center">
                            <select
                                value={connStyle}
                                onChange={(e) => setConnStyle(e.target.value as 'solid' | 'dashed')}
                                className="w-1/2 text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white text-slate-700"
                            >
                                <option value="solid">Solid Line (Sync)</option>
                                <option value="dashed">Dashed Line (Async)</option>
                            </select>
                            <button
                                onClick={() => {
                                    if (targetNodeId) {
                                        onAddConnection(selectedNode.id, targetNodeId, connLabel || 'API', connStyle);
                                    }
                                }}
                                className="w-1/2 flex items-center justify-center gap-1 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium transition cursor-pointer shadow-xs"
                            >
                                <Plus className="w-3.5 h-3.5" /> Connect
                            </button>
                        </div>
                    </div>
                </div>

                {/* Description Editor Area with CRDT backing */}
                <div>
                    <label className="text-xs font-medium text-slate-500 block mb-2">Technical Description & Specification</label>
                    <textarea
                        value={text}
                        onChange={(e) => {
                            const val = e.target.value;
                            updateLocalText(val);
                            onUpdateNodeDescription(selectedNode.id, val);
                        }}
                        rows={5}
                        className="w-full p-3 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition leading-relaxed resize-none"
                        placeholder="Type markdown or technical requirements..."
                    />
                </div>

                {/* Live Code Block Editor Mock */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                            <Code2 className="w-3.5 h-3.5 text-indigo-600" /> Rust Interface Contract
                        </label>
                        <span className="text-[10px] text-slate-400 font-mono">main.rs</span>
                    </div>
                    <div className="bg-slate-900 rounded-xl p-4 text-slate-100 font-mono text-xs shadow-inner space-y-1">
                        <div className="text-slate-500">// Auto-generated RPC handler signature</div>
                        <div><span className="text-indigo-400">pub async fn</span> <span className="text-emerald-400">verify_token</span>(ctx: Context) -&gt; Result&lt;Session&gt; &#123;</div>
                        <div className="pl-4 text-slate-300">let session = ctx.authenticate().<span className="text-indigo-300">await</span>?;</div>
                        <div className="pl-4 text-slate-300">Ok(session)</div>
                        <div>&#125;</div>
                    </div>
                </div>
            </div>

            {/* Footer Sync Status */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5 text-emerald-600 font-medium">
                    <CheckCircle className="w-3.5 h-3.5" /> CRDT In Sync (Yjs Active)
                </span>
                <span className="font-mono">Y.Doc Latency: 2ms</span>
            </div>
        </div>
    );
}