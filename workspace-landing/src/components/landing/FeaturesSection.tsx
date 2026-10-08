import { Cpu, History, RefreshCw, Zap, Shield, Layers } from 'lucide-react';

const features = [
    {
        icon: RefreshCw,
        title: 'Multiplayer CRDT Synchronization',
        description:
            'Real-time document co-authoring backed by Yjs/Automerge CRDTs. Edit canvas nodes and markdown specs simultaneously without lock contention or data loss.',
    },
    {
        icon: Zap,
        title: '60 FPS Canvas Engine',
        description:
            'Hardware-accelerated HTML5 Canvas with OffscreenCanvas workers and spatial R-Tree indexing to smoothly render thousands of diagram elements.',
    },
    {
        icon: History,
        title: 'Time-Travel & Delta Snapshots',
        description:
            'Scrub through historical commits using state vectors. Inspect past architecture decisions and restore previous document states effortlessly.',
    },
    {
        icon: Cpu,
        title: 'Rust & WebAssembly Core',
        description:
            'Heavy layout calculations, graph diffs, and spatial transformations offloaded to high-performance Rust compiled straight to Wasm.',
    },
    {
        icon: Shield,
        title: 'Conflict-Free Text & State',
        description:
            'Lamport clocks and vector clocks resolve concurrent character insertions and node movements smoothly across all active client sessions.',
    },
    {
        icon: Layers,
        title: 'Bidirectional Document Linking',
        description:
            'Bind code blocks and text descriptions directly to visual canvas nodes. Highlight a diagram element to bring up its corresponding spec.',
    },
];

export function FeaturesSection() {
    return (
        <section id="features" className="py-20 px-6 max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-3">
                    Built for Systems Engineers
                </h2>
                <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                    Engineered for Deep Real-Time Collaboration
                </p>
                <p className="mt-4 text-base text-slate-600">
                    Eliminate the gap between visual system designs and live documentation specs in a single unified surface.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature, idx) => {
                    const Icon = feature.icon;
                    return (
                        <div
                            key={idx}
                            className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all group"
                        >
                            <div className="p-3 w-fit rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors mb-4">
                                <Icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                            <p className="text-sm text-slate-600 leading-relaxed">{feature.description}</p>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}