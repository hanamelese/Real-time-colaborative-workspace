'use client';

import { useState } from 'react';
import {
    FileText,
    Network,
    Code2,
    Users,
    Sparkles,
    CheckCircle2,
    MousePointer2
} from 'lucide-react';

export function InteractivePreview() {
    const [activeNode, setActiveNode] = useState<'auth' | 'api' | 'db'>('auth');

    return (
        <section className="py-12 px-6 max-w-7xl mx-auto">
            {/* Container Frame */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">

                {/* Workspace Mock Header */}
                <div className="bg-slate-100/80 px-4 py-3 border-b border-slate-200 flex items-center justify-between text-xs font-medium text-slate-600">
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-rose-400 inline-block" />
                        <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
                        <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />
                        <span className="ml-2 font-semibold text-slate-700">architecture-spec.canvasdoc</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full border border-emerald-200">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            Live Sync (CRDT Active)
                        </div>

                        {/* Active Users */}
                        <div className="flex items-center -space-x-2">
                            <span className="w-7 h-7 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">HM</span>
                            <span className="w-7 h-7 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">AK</span>
                            <span className="w-7 h-7 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">+3</span>
                        </div>
                    </div>
                </div>

                {/* Split Screen Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 min-h-[480px]">

                    {/* Left Panel: Infinite Canvas View */}
                    <div className="p-6 bg-slate-50/50 bg-grid-pattern relative flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                                    <Network className="w-4 h-4 text-indigo-600" /> Infinite Canvas
                                </span>
                                <span className="text-xs text-slate-500">Click a node to inspect binding</span>
                            </div>

                            {/* Node Graph Mock */}
                            <div className="relative mt-8 space-y-6">

                                {/* Node 1: Auth Service */}
                                <div
                                    onClick={() => setActiveNode('auth')}
                                    className={`p-4 rounded-xl border transition-all cursor-pointer relative shadow-sm ${activeNode === 'auth'
                                            ? 'bg-indigo-50/80 border-indigo-500 ring-2 ring-indigo-500/20'
                                            : 'bg-white border-slate-200 hover:border-slate-300'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="font-semibold text-sm text-slate-800">Auth Microservice (OAuth2 + JWT)</span>
                                        <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded font-mono">
                                            y-text: #node-auth
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1">Handles mTLS authentication and token verification.</p>

                                    {/* Simulated Multiplayer Cursor */}
                                    {activeNode === 'auth' && (
                                        <div className="absolute -top-3 -right-3 flex items-center gap-1 bg-indigo-600 text-white text-[10px] px-2 py-0.5 rounded-full shadow-md animate-bounce">
                                            <MousePointer2 className="w-3 h-3 fill-white" /> Hana is editing
                                        </div>
                                    )}
                                </div>

                                {/* Node Connection Line */}
                                <div className="w-0.5 h-6 bg-indigo-300 ml-8" />

                                {/* Node 2: API Gateway */}
                                <div
                                    onClick={() => setActiveNode('api')}
                                    className={`p-4 rounded-xl border transition-all cursor-pointer shadow-sm ${activeNode === 'api'
                                            ? 'bg-indigo-50/80 border-indigo-500 ring-2 ring-indigo-500/20'
                                            : 'bg-white border-slate-200 hover:border-slate-300'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="font-semibold text-sm text-slate-800">API Gateway & Router</span>
                                        <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                                            y-text: #node-api
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1">Rust-based WebSocket routing and rate limiting layer.</p>
                                </div>

                            </div>
                        </div>

                        <div className="text-xs text-slate-400 mt-6 flex items-center gap-2">
                            <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> WebAssembly R-Tree spatial index running at 60 FPS
                        </div>
                    </div>

                    {/* Right Panel: Markdown Studio View */}
                    <div className="p-6 bg-white flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                                    <FileText className="w-4 h-4 text-indigo-600" /> Linked Documentation Spec
                                </span>
                                <span className="text-xs text-indigo-600 font-medium">Synced via Y.Doc CRDT</span>
                            </div>

                            {/* Dynamic Content based on active canvas node */}
                            {activeNode === 'auth' ? (
                                <div className="space-y-4 text-slate-700">
                                    <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">
                                        # Authentication Architecture Specification
                                    </h3>
                                    <p className="text-xs leading-relaxed text-slate-600">
                                        The auth layer enforces mutual TLS (mTLS) handshakes using X.509 client certificates and validates OAuth2 Bearer tokens on protected RPC endpoints.
                                    </p>

                                    <div className="bg-slate-900 rounded-lg p-3 text-slate-100 font-mono text-xs overflow-x-auto shadow-inner">
                                        <div className="text-slate-400">// Auth Handshake Definition</div>
                                        <div><span className="text-indigo-400">pub struct</span> <span className="text-emerald-400">AuthSession</span> &#123;</div>
                                        <div className="pl-4"><span className="text-indigo-300">pub user_id</span>: UUID,</div>
                                        <div className="pl-4"><span className="text-indigo-300">pub permissions</span>: Vec&lt;String&gt;,</div>
                                        <div>&#125;</div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4 text-slate-700">
                                    <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">
                                        # API Gateway Routing Rules
                                    </h3>
                                    <p className="text-xs leading-relaxed text-slate-600">
                                        Routes incoming WebSocket clients to dedicated room instances. Managed by Tokio async runtime tasks with zero-copy packet forwarding.
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                            <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Bidirectional Binding Active</span>
                            <span className="font-mono">Last synced 2ms ago</span>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}