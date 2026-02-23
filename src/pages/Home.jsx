import React from 'react';
import { Link } from 'react-router-dom';
import {
    Sparkles, ArrowRight, ShieldCheck, Activity,
    Utensils, Moon, ScanFace, LayoutDashboard, History
} from 'lucide-react';

const Home = () => {
    return (
        <div className="space-y-16 py-8 animate-in fade-in duration-700">

            {/* Hero Section - Food & Skin Theme */}
            <section className="relative bg-teal-900 rounded-3xl overflow-hidden shadow-xl min-h-[400px] flex items-center">

                {/* Decorative Background Elements */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-800/50 backdrop-blur-sm -skew-x-12 translate-x-20"></div>
                <div className="absolute bottom-0 left-20 w-32 h-32 bg-teal-500/20 rounded-full blur-3xl"></div>

                <div className="relative z-10 grid md:grid-cols-2 gap-8 p-12 w-full">
                    <div className="space-y-6 text-white">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-500/20 border border-teal-500/30 rounded-full text-xs font-medium text-teal-300">
                            <Sparkles className="w-3 h-3" /> Bio-Individual Analysis
                        </div>
                        <h1 className="text-5xl font-bold tracking-tight leading-tight">
                            Nourish Your Skin <br />
                            <span className="text-teal-400">From Within.</span>
                        </h1>
                        <p className="text-slate-300 text-lg max-w-md">
                            Discover how your diet, environment, and routine impact your dermal health with our AI-powered correlation engine.
                        </p>

                        <div className="flex flex-wrap gap-4 pt-4">
                            <Link to="/assessment" className="bg-teal-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-teal-400 transition shadow-lg shadow-teal-900/50 flex items-center gap-2">
                                Start Full Analysis <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>

                        <div className="pt-6 border-t border-white/10">
                            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-3">Explore Key Factors</p>
                            <div className="flex flex-wrap gap-3">
                                <Link to="/factors/skin" className="px-4 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm font-medium hover:bg-blue-500/20 transition flex items-center gap-2">
                                    <ScanFace className="w-4 h-4" /> Skin
                                </Link>
                                <Link to="/factors/food" className="px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/20 text-green-300 text-sm font-medium hover:bg-green-500/20 transition flex items-center gap-2">
                                    <Utensils className="w-4 h-4" /> Diet
                                </Link>
                                <Link to="/factors/routine" className="px-4 py-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm font-medium hover:bg-purple-500/20 transition flex items-center gap-2">
                                    <Moon className="w-4 h-4" /> Routine
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Visual Card Stack */}
                    <div className="hidden md:flex justify-center items-center relative">
                        {/* ... same visual stack ... */}
                        <div className="absolute w-64 h-80 bg-white/10 backdrop-blur-md rounded-2xl -rotate-6 border border-white/10 shadow-2xl"></div>
                        <div className="absolute w-64 h-80 bg-slate-900 rounded-2xl rotate-3 border border-slate-700 shadow-xl overflow-hidden flex flex-col p-6 space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-rose-500/20 rounded-xl text-rose-500">
                                    <Utensils className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white">Dietary Impact</h4>
                                    <p className="text-xs text-slate-400">Sugar & Hydration Log</p>
                                </div>
                            </div>
                            <div className="h-px bg-slate-700 w-full"></div>
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-amber-500/20 rounded-xl text-amber-500">
                                    <ScanFace className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white">Skin Barrier</h4>
                                    <p className="text-xs text-slate-400">pH & Oil Levels</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Dashboard Grid Navigation */}
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-900 px-2">Your Skin Wellness Hub</h2>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* 1. Skin Analysis Factors */}
                    <Link to="/factors/skin" className="group p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 transition">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <ScanFace className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors">Skin Analysis Factors</h3>
                        <p className="text-sm text-slate-500">Visual diagnostics affecting your profile.</p>
                    </Link>

                    {/* 2. Food Recommendation Factors */}
                    <Link to="/factors/food" className="group p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-green-200 transition">
                        <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Utensils className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-green-700 transition-colors">Dietary Factors</h3>
                        <p className="text-sm text-slate-500">Glycemic index and nutritional inputs.</p>
                    </Link>

                    {/* 3. Daily Routine Factors */}
                    <Link to="/factors/routine" className="group p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-purple-200 transition">
                        <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Moon className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-purple-700 transition-colors">Daily Routine</h3>
                        <p className="text-sm text-slate-500">Sleep, stress, and environmental impact.</p>
                    </Link>

                    {/* 4. Dashboard (Results) */}
                    <Link to="/results" className="group p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-teal-200 transition">
                        <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <LayoutDashboard className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-teal-700 transition-colors">Active Dashboard</h3>
                        <p className="text-sm text-slate-500">View your current protocol and charts.</p>
                    </Link>

                    {/* 5. History Factors */}
                    <Link to="/history" className="group p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-amber-200 transition">
                        <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <History className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-amber-700 transition-colors">History Log</h3>
                        <p className="text-sm text-slate-500">Track progress over time.</p>
                    </Link>

                    {/* 6. Quick Start */}
                    <Link to="/assessment" className="group p-6 bg-slate-900 rounded-2xl border border-slate-800 shadow-sm hover:shadow-xl transition flex flex-col items-center justify-center text-center">
                        <div className="w-12 h-12 bg-white/10 text-teal-400 rounded-full flex items-center justify-center mb-4 group-hover:bg-teal-500 group-hover:text-white transition-colors">
                            <ArrowRight className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-1">New Scan</h3>
                        <p className="text-sm text-slate-400">Update your metrics</p>
                    </Link>
                </div>
            </div>

        </div>
    );
};

export default Home;
