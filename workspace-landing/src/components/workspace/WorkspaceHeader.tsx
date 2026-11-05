// import Link from 'next/link';
// import { Layers, History, Share2, PanelRightClose, PanelRightOpen, ArrowLeft } from 'lucide-react';

// interface WorkspaceHeaderProps {
//     isMarkdownOpen: boolean;
//     onToggleMarkdown: () => void;
// }

// export function WorkspaceHeader({ isMarkdownOpen, onToggleMarkdown }: WorkspaceHeaderProps) {
//     return (
//         <header className="h-14 bg-white border-b border-slate-200 px-4 flex items-center justify-between z-30 shadow-xs">
//             {/* Title & Navigation */}
//             <div className="flex items-center gap-3">
//                 <Link
//                     href="/"
//                     className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition"
//                     title="Back to Landing Page"
//                 >
//                     <ArrowLeft className="w-4 h-4" />
//                 </Link>
//                 <div className="h-4 w-px bg-slate-200" />
//                 <div className="p-1.5 bg-indigo-600 rounded-md text-white">
//                     <Layers className="w-4 h-4" />
//                 </div>
//                 <span className="font-semibold text-sm text-slate-800">system-architecture.canvasdoc</span>
//                 <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-mono">
//                     Yjs Active
//                 </span>
//             </div>

//             {/* Collaboration Status & Actions */}
//             <div className="flex items-center gap-3">
//                 {/* Active Collaborators */}
//                 <div className="flex items-center -space-x-2 border-r border-slate-200 pr-3">
//                     <span className="w-7 h-7 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center border-2 border-white" title="Hana Melese (You)">HM</span>
//                     <span className="w-7 h-7 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center border-2 border-white" title="Alex Chen">AC</span>
//                     <span className="w-7 h-7 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center border-2 border-white" title="Sarah Jenkins">SJ</span>
//                 </div>

//                 {/* Time-Travel Commit History */}
//                 <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition">
//                     <History className="w-3.5 h-3.5 text-indigo-600" /> Time Travel
//                 </button>

//                 {/* Share Button */}
//                 <button className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition">
//                     <Share2 className="w-3.5 h-3.5" /> Share
//                 </button>

//                 {/* Toggle Markdown Panel */}
//                 <button
//                     onClick={onToggleMarkdown}
//                     className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
//                     title={isMarkdownOpen ? 'Hide Markdown Panel' : 'Show Markdown Panel'}
//                 >
//                     {isMarkdownOpen ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
//                 </button>
//             </div>
//         </header>
//     );
// }


'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Layers, Share2, Download, FileImage, FileCode, FileText, PanelRightClose, PanelRightOpen, ArrowLeft } from 'lucide-react';
import { exportCanvasAsPng, exportCanvasAsSvg, exportCanvasAsPdf } from '@/lib/exportCanvas';

interface WorkspaceHeaderProps {
    isMarkdownOpen: boolean;
    onToggleMarkdown: () => void;
    canvasRef: React.RefObject<HTMLDivElement | null>;
    userId?: string;
    syncStatus?: string;
    isMounted?: boolean;
}

export function WorkspaceHeader({
    isMarkdownOpen,
    onToggleMarkdown,
    canvasRef,
    userId = 'User-1000',
    syncStatus = 'Connected',
    isMounted = true,
}: WorkspaceHeaderProps) {
    const [isExportOpen, setIsExportOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsExportOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleExport = async (type: 'png' | 'svg' | 'pdf') => {
        if (!canvasRef.current) return;
        setIsExportOpen(false);

        if (type === 'png') await exportCanvasAsPng(canvasRef.current);
        if (type === 'svg') await exportCanvasAsSvg(canvasRef.current);
        if (type === 'pdf') await exportCanvasAsPdf(canvasRef.current);
    };

    return (
        <header className="h-14 bg-white border-b border-slate-200 px-4 flex items-center justify-between z-30 shadow-xs relative">
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

            <div className="flex items-center gap-3">
                {/* Sync & User ID Pill (Placed to the left of Export) */}
                <div className="flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1 text-xs border border-slate-800 shadow-sm text-white">
                    <span className="text-slate-400 font-mono">
                        {isMounted ? userId : 'Loading...'}
                    </span>
                    <div className="flex items-center gap-1.5">
                        <span
                            className={`h-2 w-2 rounded-full ${syncStatus === 'Connected'
                                ? 'bg-emerald-500 animate-pulse'
                                : syncStatus === 'Connecting'
                                    ? 'bg-amber-500'
                                    : 'bg-rose-500'
                                }`}
                        />
                        <span className="font-medium">Sync: {syncStatus}</span>
                    </div>
                </div>

                {/* Export Dropdown Button */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setIsExportOpen(!isExportOpen)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-medium transition cursor-pointer"
                    >
                        <Download className="w-5.5 h-5.5 text-indigo-800" /> Export
                    </button>

                    {isExportOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-50 text-xs text-slate-700">
                            <button
                                onClick={() => handleExport('png')}
                                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-50 transition text-left cursor-pointer"
                            >
                                <FileImage className="w-4 h-4 text-emerald-600" /> Export High-Res PNG
                            </button>
                            <button
                                onClick={() => handleExport('svg')}
                                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-50 transition text-left cursor-pointer"
                            >
                                <FileCode className="w-4 h-4 text-indigo-600" /> Export Vector SVG
                            </button>
                            <button
                                onClick={() => handleExport('pdf')}
                                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-50 transition text-left cursor-pointer"
                            >
                                <FileText className="w-4 h-4 text-rose-600" /> Export Document PDF
                            </button>
                        </div>
                    )}
                </div>

                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition cursor-pointer">
                    <Share2 className="w-3.5 h-3.5" /> Share
                </button>

                <button
                    onClick={onToggleMarkdown}
                    className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                    title={isMarkdownOpen ? 'Hide Markdown Panel' : 'Show Markdown Panel'}
                >
                    {isMarkdownOpen ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
                </button>
            </div>
        </header>
    );
}