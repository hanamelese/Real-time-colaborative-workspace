// import { Sparkles, ArrowRight, Zap, ShieldCheck, Users } from 'lucide-react';
// import Link from 'next/link';

// export function HeroSection() {
//     return (
//         <section className="relative pt-32 pb-20 overflow-hidden bg-grid-pattern">
//             {/* Gradient Glow Effect */}
//             <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none" />

//             <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
//                 <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-semibold mb-6">
//                     <Sparkles className="w-3.5 h-3.5" /> Real-time CRDT Engine powered by Rust & WebAssembly
//                 </div>

//                 <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-100 max-w-4xl mx-auto leading-tight">
//                     Where Infinite Canvas Meets Live Markdown Documentation
//                 </h1>

//                 <p className="mt-6 text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
//                     Architect complex distributed systems visually while co-authoring real-time technical specs. Zero drift between diagrams and code docs.
//                 </p>

//                 <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
//                     <Link
//                         href="/workspace"
//                         className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-base flex items-center gap-2 transition shadow-xl shadow-indigo-600/25"
//                     >
//                         Open Interactive Workspace <ArrowRight className="w-4 h-4" />
//                     </Link>
//                     <a
//                         href="#architecture"
//                         className="px-6 py-3.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 font-semibold rounded-xl text-base transition"
//                     >
//                         View System Architecture
//                     </a>
//                 </div>

//                 {/* Feature Badges */}
//                 <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-xs font-medium text-slate-400">
//                     <span className="flex items-center gap-2"><Zap className="w-4 h-4 text-indigo-400" /> 60 FPS Canvas Rendering</span>
//                     <span className="flex items-center gap-2"><Users className="w-4 h-4 text-indigo-400" /> Multiplayer CRDT Sync</span>
//                     <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-indigo-400" /> Lock-Free Conflict Resolution</span>
//                 </div>
//             </div>
//         </section>
//     );
// }


import { Sparkles, ArrowRight, Zap, ShieldCheck, Users } from 'lucide-react';
import Link from 'next/link';

export function HeroSection() {
    return (
        <section className="relative pt-32 pb-20 overflow-hidden bg-grid-pattern">
            {/* Subtle Indigo Glow */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-200/50 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-200 bg-indigo-50 text-indigo-700 text-xs font-semibold mb-6 shadow-xs">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Real-time CRDT Engine powered by Rust & WebAssembly
                </div>

                <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto leading-tight">
                    Where Infinite Canvas Meets Live Markdown Documentation
                </h1>

                <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                    Architect complex distributed systems visually while co-authoring real-time technical specs. Zero drift between diagrams and code docs.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
                    {/* <Link
                        href="/workspace"
                        className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-base flex items-center gap-2 transition shadow-lg shadow-indigo-600/20"
                    >
                        Open Interactive Workspace <ArrowRight className="w-4 h-4" />
                    </Link> */}
                    <Link
                        href="/workspace/room-1"
                        className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-base flex items-center gap-2 transition shadow-lg shadow-indigo-600/20"
                    >
                        Open Interactive Workspace <ArrowRight className="w-4 h-4" />
                    </Link>
                    <a
                        href="#architecture"
                        className="px-6 py-3.5 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 font-semibold rounded-xl text-base transition shadow-xs"
                    >
                        View System Architecture
                    </a>
                </div>

                {/* Feature Badges */}
                <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-xs font-medium text-slate-600">
                    <span className="flex items-center gap-2"><Zap className="w-4 h-4 text-indigo-600" /> 60 FPS Canvas Rendering</span>
                    <span className="flex items-center gap-2"><Users className="w-4 h-4 text-indigo-600" /> Multiplayer CRDT Sync</span>
                    <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-indigo-600" /> Lock-Free Conflict Resolution</span>
                </div>
            </div>
        </section>
    );
}