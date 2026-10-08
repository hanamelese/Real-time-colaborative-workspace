
import Link from 'next/link';
import { Layers } from 'lucide-react';
import { FaGithub } from 'react-icons/fa6';

export function Navbar() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-600 rounded-lg text-white shadow-sm">
                        <Layers className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-lg tracking-tight text-slate-900">CanvasDoc</span>
                </div>

                <nav className="hidden md:flex items-center gap-8 text-sm text-slate-600 font-medium">
                    <Link href="#features" className="hover:text-slate-900 transition">Features</Link>
                    <Link href="#architecture" className="hover:text-slate-900 transition">Architecture</Link>
                    <Link href="#tech-stack" className="hover:text-slate-900 transition">Tech Stack</Link>
                </nav>

                <div className="flex items-center gap-4">
                    <Link
                        href="https://github.com"
                        target="_blank"
                        className="text-slate-500 hover:text-slate-900 transition p-2"
                    >
                        <FaGithub className="w-5 h-5" />
                    </Link>
                    <Link
                        href="/workspace"
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition shadow-md shadow-indigo-600/15"
                    >
                        Launch Studio
                    </Link>
                </div>
            </div>
        </header>
    );
}