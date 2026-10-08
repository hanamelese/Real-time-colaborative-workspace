export function TechStackSection() {
    const stack = [
        { name: 'Next.js 15', role: 'Frontend Framework & App Router', color: 'bg-slate-900 text-white' },
        { name: 'Rust + Wasm', role: 'Spatial Indexing & Graph Layouts', color: 'bg-amber-600 text-white' },
        { name: 'Yjs (CRDT)', role: 'Conflict-Free Real-time State Sync', color: 'bg-indigo-600 text-white' },
        { name: 'WebSockets', role: 'Low-Latency Room Message Transport', color: 'bg-emerald-600 text-white' },
        { name: 'HTML5 Canvas', role: 'Hardware-Accelerated Node Rendering', color: 'bg-blue-600 text-white' },
        { name: 'Tailwind CSS', role: 'Utility-First Workspace Interface', color: 'bg-cyan-600 text-white' },
    ];

    return (
        <section id="tech-stack" className="py-20 px-6 bg-slate-100/70 border-y border-slate-200">
            <div className="max-w-7xl mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <h2 className="text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-2">
                        Technical Architecture
                    </h2>
                    <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                        Powered by a Modern Distributed Stack
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {stack.map((item, idx) => (
                        <div
                            key={idx}
                            className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs text-center flex flex-col justify-between"
                        >
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full w-fit mx-auto mb-3 ${item.color}`}>
                                {item.name}
                            </span>
                            <p className="text-xs font-medium text-slate-600 leading-snug">{item.role}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}