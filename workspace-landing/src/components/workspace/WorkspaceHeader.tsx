import Link from 'next/link';
import { Layers, History, Share2, PanelRightClose, PanelRightOpen, ArrowLeft } from 'lucide-react';

interface WorkspaceHeaderProps {
    isMarkdownOpen: boolean;
    onToggleMarkdown: () => void;
}

export function WorkspaceHeader({ isMarkdownOpen, onToggleMarkdown }: WorkspaceHeaderProps) {
    return (
        <header className="h-14 bg-white border-b border-slate-200 px-4 flex items-center justify-between z-30 shadow-xs">
            {/* Title & Navigation */}
            <div className="flex items-center gap-3">
                <Link
                    href="/"
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition"
                    title="Back to Landing Page"
                >
                    <ArrowLeft className="w-4 h-4" />
                </Link>
                <div className="h-4 w-px bg-slate-200" />
                <div className="p-1.5 bg-indigo-600 rounded-md text-white">
                    <Layers className="w-4 h-4" />
                </div>
                <span className="font-semibold text-sm text-slate-800">system-architecture.canvasdoc</span>
                <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-mono">
                    Yjs Active
                </span>
            </div>

            {/* Collaboration Status & Actions */}
            <div className="flex items-center gap-3">
                {/* Active Collaborators */}
                <div className="flex items-center -space-x-2 border-r border-slate-200 pr-3">
                    <span className="w-7 h-7 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center border-2 border-white" title="Hana Melese (You)">HM</span>
                    <span className="w-7 h-7 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center border-2 border-white" title="Alex Chen">AC</span>
                    <span className="w-7 h-7 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center border-2 border-white" title="Sarah Jenkins">SJ</span>
                </div>

                {/* Time-Travel Commit History */}
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition">
                    <History className="w-3.5 h-3.5 text-indigo-600" /> Time Travel
                </button>

                {/* Share Button */}
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition">
                    <Share2 className="w-3.5 h-3.5" /> Share
                </button>

                {/* Toggle Markdown Panel */}
                <button
                    onClick={onToggleMarkdown}
                    className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
                    title={isMarkdownOpen ? 'Hide Markdown Panel' : 'Show Markdown Panel'}
                >
                    {isMarkdownOpen ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
                </button>
            </div>
        </header>
    );
}