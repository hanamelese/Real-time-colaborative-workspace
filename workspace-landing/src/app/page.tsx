

import { Navbar } from '@/components/landing/Navbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { InteractivePreview } from '@/components/landing/InteractivePreview';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { TechStackSection } from '@/components/landing/TechStackSection';
export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <main>
        <HeroSection />
        <InteractivePreview />
        <FeaturesSection />
        <TechStackSection />

      </main>
    </div>
  );
}



// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { Sparkles, ArrowRight, Layers, Cpu, ShieldCheck, Zap, LayoutGrid } from 'lucide-react';

// export default function HomePage() {
//   const [roomInput, setRoomInput] = useState('');
//   const router = useRouter();

//   const handleJoinRoom = (e: React.FormEvent) => {
//     e.preventDefault();
//     const targetRoom = roomInput.trim()
//       ? roomInput.trim().toLowerCase().replace(/\s+/g, '-')
//       : `room-${Math.floor(Math.random() * 9000 + 1000)}`;
//     router.push(`/workspace/${targetRoom}`);
//   };

//   const handleQuickStart = () => {
//     const randomRoom = `project-${Math.floor(Math.random() * 9000 + 1000)}`;
//     router.push(`/workspace/${randomRoom}`);
//   };

//   return (
//     <div className="min-h-screen w-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-x-hidden font-sans select-none">
//       {/* Top Navigation Bar */}
//       <header className="w-full border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-md px-6 py-4 flex items-center justify-between z-20 sticky top-0">
//         <div className="flex items-center gap-2.5">
//           <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
//             <LayoutGrid className="w-4 h-4 text-white" />
//           </div>
//           <span className="font-bold text-sm tracking-wide text-white">
//             CanvasDocs <span className="text-indigo-400 text-xs font-mono">v1.0</span>
//           </span>
//         </div>
//         <div className="flex items-center gap-4 text-xs">
//           <span className="hidden sm:inline-block text-slate-400">Rust + Axum + Yjs Engine</span>
//           <button
//             onClick={handleQuickStart}
//             className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium px-3.5 py-1.5 rounded-lg transition cursor-pointer"
//           >
//             Demo Room
//           </button>
//         </div>
//       </header>

//       {/* Background Ambient Lights & Grid Overlay */}
//       <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
//       <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/15 blur-[140px] rounded-full pointer-events-none" />

//       {/* Main Hero & Card Section */}
//       <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 z-10">
//         <div className="max-w-2xl w-full text-center space-y-8">

//           {/* Feature Badge */}
//           <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium shadow-inner">
//             <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
//             <span>Real-Time Multi-User Architecture Studio</span>
//           </div>

//           {/* Main Headline */}
//           <div className="space-y-4">
//             <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
//               Architect systems <br />
//               <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-violet-300 to-indigo-200">
//                 together in real-time.
//               </span>
//             </h1>
//             <p className="text-slate-400 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
//               Infinite collaborative canvas powered by a high-throughput Rust backend, SQLite session persistence, and Yjs CRDT conflict resolution.
//             </p>
//           </div>

//           {/* Interactive Room Action Card */}
//           <div className="bg-slate-900/90 border border-slate-800 p-6 sm:p-8 rounded-2xl shadow-2xl backdrop-blur-xl space-y-6 text-left max-w-lg mx-auto">
//             <div className="space-y-1">
//               <label className="text-xs font-semibold text-slate-200 uppercase tracking-wider block">
//                 Workspace Access
//               </label>
//               <p className="text-xs text-slate-400">
//                 Enter a custom project title or join an existing session.
//               </p>
//             </div>

//             {/* Room Form Input */}
//             <form onSubmit={handleJoinRoom} className="space-y-3">
//               <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition overflow-hidden p-1.5">
//                 <span className="text-slate-500 text-xs font-mono px-3 border-r border-slate-800 select-none">
//                   workspace/
//                 </span>
//                 <input
//                   type="text"
//                   value={roomInput}
//                   onChange={(e) => setRoomInput(e.target.value)}
//                   placeholder="e.g. system-architecture"
//                   className="flex-1 bg-transparent border-0 px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-0"
//                 />
//                 <button
//                   type="submit"
//                   className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 transition shadow-md shadow-indigo-600/30 cursor-pointer"
//                 >
//                   <span>Enter</span>
//                   <ArrowRight className="w-3.5 h-3.5" />
//                 </button>
//               </div>
//             </form>

//             <div className="relative flex items-center justify-center">
//               <div className="absolute inset-0 flex items-center">
//                 <div className="w-full border-t border-slate-800" />
//               </div>
//               <span className="relative bg-slate-900 px-3 text-[10px] uppercase font-mono tracking-widest text-slate-500">
//                 OR
//               </span>
//             </div>

//             {/* Instant Random Generator */}
//             <button
//               type="button"
//               onClick={handleQuickStart}
//               className="w-full bg-slate-800/80 hover:bg-slate-800 text-slate-200 hover:text-white font-medium py-3 rounded-xl text-xs flex items-center justify-center gap-2 transition border border-slate-700/60 shadow-sm cursor-pointer"
//             >
//               <Layers className="w-4 h-4 text-indigo-400" />
//               <span>Create Instant Workspace Room</span>
//             </button>
//           </div>

//           {/* Tech Badges */}
//           <div className="grid grid-cols-3 gap-3 pt-4 text-slate-400 text-xs font-mono">
//             <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-3 flex flex-col items-center gap-1">
//               <Zap className="w-4 h-4 text-emerald-400" />
//               <span className="text-[11px] font-sans text-slate-300 font-semibold">Rust Axum</span>
//               <span className="text-[10px] text-slate-500">WebSocket Broadcast</span>
//             </div>
//             <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-3 flex flex-col items-center gap-1">
//               <ShieldCheck className="w-4 h-4 text-indigo-400" />
//               <span className="text-[11px] font-sans text-slate-300 font-semibold">SQLite DB</span>
//               <span className="text-[10px] text-slate-500">Persistent States</span>
//             </div>
//             <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-3 flex flex-col items-center gap-1">
//               <Cpu className="w-4 h-4 text-amber-400" />
//               <span className="text-[11px] font-sans text-slate-300 font-semibold">Yjs CRDTs</span>
//               <span className="text-[10px] text-slate-500">Conflict-Free Text</span>
//             </div>
//           </div>

//         </div>
//       </main>

//       {/* Footer */}
//       <footer className="w-full border-t border-slate-900 py-4 px-6 text-center text-xs text-slate-500 z-10">
//         Built with Next.js 15, Tailwind CSS, Axum, and Tokio.
//       </footer>
//     </div>
//   );
// }