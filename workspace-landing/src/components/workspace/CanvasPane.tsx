import { CanvasNode } from '@/app/workspace/page';
import { Database, Server, Cpu, MousePointer2 } from 'lucide-react';

interface CanvasPaneProps {
    nodes: CanvasNode[];
    selectedNodeId: string;
    onSelectNode: (id: string) => void;
    zoomLevel: number;
}

export function CanvasPane({ nodes, selectedNodeId, onSelectNode, zoomLevel }: CanvasPaneProps) {
    const getNodeIcon = (type: CanvasNode['type']) => {
        switch (type) {
            case 'database':
                return <Database className="w-4 h-4 text-emerald-600" />;
            case 'gateway':
                return <Cpu className="w-4 h-4 text-amber-600" />;
            default:
                return <Server className="w-4 h-4 text-indigo-600" />;
        }
    };

    return (
        <div className="w-full h-full bg-slate-50 bg-grid-pattern relative overflow-hidden flex items-center justify-center">

            {/* Zoomable Container Viewport */}
            <div
                style={{ transform: `scale(${zoomLevel / 100})` }}
                className="w-full h-full relative transition-transform duration-100 origin-center"
            >
                {/* Render Connection Line SVG between nodes */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-slate-300 stroke-2">
                    <line x1="280" y1="160" x2="280" y2="300" strokeDasharray="4 4" />
                    <line x1="380" y1="160" x2="560" y2="240" />
                </svg>

                {/* Render Dynamic Canvas Nodes */}
                {nodes.map((node) => {
                    const isSelected = node.id === selectedNodeId;
                    return (
                        <div
                            key={node.id}
                            onClick={() => onSelectNode(node.id)}
                            style={{ left: `${node.x}px`, top: `${node.y}px` }}
                            className={`absolute p-4 w-64 rounded-xl border transition-all cursor-pointer shadow-sm ${isSelected
                                    ? 'bg-indigo-50/90 border-indigo-500 ring-2 ring-indigo-500/20 shadow-md'
                                    : 'bg-white border-slate-200 hover:border-slate-300'
                                }`}
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <div className="p-1.5 rounded-md bg-slate-100">
                                    {getNodeIcon(node.type)}
                                </div>
                                <span className="font-semibold text-xs text-slate-800">{node.title}</span>
                            </div>
                            <p className="text-[11px] text-slate-500 line-clamp-2">{node.description}</p>

                            {/* Simulated Multiplayer Active Cursor */}
                            {isSelected && (
                                <div className="absolute -top-3 -right-2 flex items-center gap-1 bg-indigo-600 text-white text-[9px] px-2 py-0.5 rounded-full shadow-md">
                                    <MousePointer2 className="w-2.5 h-2.5 fill-white" /> Hana (Editing)
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}