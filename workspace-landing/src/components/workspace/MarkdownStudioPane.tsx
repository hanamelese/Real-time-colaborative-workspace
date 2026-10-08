import { CanvasNode } from '@/app/workspace/page';
import { FileText, Link as LinkIcon, Code2, CheckCircle } from 'lucide-react';

interface MarkdownStudioPaneProps {
    selectedNode: CanvasNode | null;
    onUpdateNodeDescription: (id: string, desc: string) => void;
}

export function MarkdownStudioPane({ selectedNode, onUpdateNodeDescription }: MarkdownStudioPaneProps) {
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

                {/* Title Input */}
                <div>
                    <label className="text-xs font-medium text-slate-500 block mb-1">Node Subject</label>
                    <h2 className="text-xl font-bold text-slate-900">{selectedNode.title}</h2>
                </div>

                {/* Description Editor Area */}
                <div>
                    <label className="text-xs font-medium text-slate-500 block mb-2">Technical Description & Specification</label>
                    <textarea
                        value={selectedNode.description}
                        onChange={(e) => onUpdateNodeDescription(selectedNode.id, e.target.value)}
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
                    <CheckCircle className="w-3.5 h-3.5" /> CRDT In Sync
                </span>
                <span className="font-mono">Y.Doc Latency: 4ms</span>
            </div>
        </div>
    );
}