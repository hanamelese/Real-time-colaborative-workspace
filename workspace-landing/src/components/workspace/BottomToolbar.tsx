import { Plus, ZoomIn, ZoomOut, Server, Database, Cpu } from 'lucide-react';

interface BottomToolbarProps {
    zoomLevel: number;
    onZoomIn: () => void;
    onZoomOut: () => void;
    onAddNode: (type: 'service' | 'database' | 'gateway') => void;
}

export function BottomToolbar({ zoomLevel, onZoomIn, onZoomOut, onAddNode }: BottomToolbarProps) {
    return (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md border border-slate-200 rounded-2xl p-2 shadow-lg flex items-center gap-2 z-30">
            {/* Node Creation Tools */}
            <div className="flex items-center gap-1 border-r border-slate-200 pr-2">
                <button
                    onClick={() => onAddNode('service')}
                    className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-medium transition"
                >
                    <Server className="w-3.5 h-3.5 text-indigo-600" /> Service
                </button>
                <button
                    onClick={() => onAddNode('database')}
                    className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-medium transition"
                >
                    <Database className="w-3.5 h-3.5 text-emerald-600" /> Database
                </button>
                <button
                    onClick={() => onAddNode('gateway')}
                    className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-medium transition"
                >
                    <Cpu className="w-3.5 h-3.5 text-amber-600" /> Gateway
                </button>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-1 pl-1">
                <button
                    onClick={onZoomOut}
                    className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
                    title="Zoom Out"
                >
                    <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono font-medium text-slate-600 w-12 text-center">
                    {zoomLevel}%
                </span>
                <button
                    onClick={onZoomIn}
                    className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
                    title="Zoom In"
                >
                    <ZoomIn className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}