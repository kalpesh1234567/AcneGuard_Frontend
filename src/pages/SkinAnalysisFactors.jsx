import React from 'react';
import { ArrowRight, ScanFace, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const SkinAnalysisFactors = () => {
    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            <section className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                    <ScanFace className="w-4 h-4" /> Visual Diagnostics
                </div>
                <h1 className="text-4xl font-bold text-slate-900">Skin Analysis Factors</h1>
                <p className="text-slate-600 max-w-2xl mx-auto">
                    Our AI evaluates surface-level metrics to determine your baseline skin health.
                </p>
            </section>

            <div className="grid md:grid-cols-2 gap-8">
                {[
                    { title: "Cystic Acne", desc: "Deep, painful inflammation indicating hormonal or bacterial drivers." },
                    { title: "Comedonal", desc: "Surface-level blackheads and whiteheads from pore clogging." },
                    { title: "Pigmentation", desc: "Post-inflammatory hyperpigmentation marks from past breakouts." },
                    { title: "Barrier Health", desc: "Signs of dehydration, redness, or flaking." }
                ].map((item, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                        <p className="text-slate-500">{item.desc}</p>
                    </div>
                ))}
            </div>

            <div className="flex justify-center">
                <Link to="/assessment" className="flex items-center gap-2 bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition">
                    Start Analysis <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
};

export default SkinAnalysisFactors;
