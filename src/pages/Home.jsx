import React from 'react';
import { Link } from 'react-router-dom';
import {
    Sparkles, ArrowRight, ShieldCheck, ScanFace, Salad,
    History, Brain, Activity, Users, Star
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Home = () => {
    const { user } = useAuth();

    return (
        <div className="space-y-20 py-4 animate-in fade-in duration-700">

            {/* ── Hero ───────────────────────────────────────────────────── */}
            <section className="relative bg-gradient-to-br from-teal-900 via-slate-900 to-slate-900 rounded-3xl overflow-hidden shadow-2xl min-h-[480px] flex items-center">
                {/* Decorative blobs */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-400/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />

                <div className="relative z-10 p-10 md:p-16 w-full">
                    <div className="max-w-2xl space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-500/20 border border-teal-500/30 rounded-full text-xs font-semibold text-teal-300 tracking-wide uppercase">
                            <Sparkles className="w-3 h-3" /> AI-Powered Skin Intelligence
                        </div>

                        <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
                            Know Your Skin.{' '}
                            <span className="text-teal-400">Inside Out.</span>
                        </h1>

                        <p className="text-slate-300 text-lg leading-relaxed">
                            Instantly detect acne severity from your selfie using Computer Vision,
                            or analyze how your diet impacts your skin with our ML Risk Engine.
                        </p>

                        {/* Dual CTA */}
                        <div className="flex flex-wrap gap-4 pt-2">
                            <Link
                                to={user ? '/assessment' : '/register'}
                                className="flex items-center gap-2 bg-teal-500 text-white px-7 py-3.5 rounded-xl font-bold text-sm hover:bg-teal-400 transition-all shadow-lg shadow-teal-900/50 hover:scale-105 active:scale-95"
                            >
                                <ScanFace className="w-5 h-5" /> Start Skin Scan
                            </Link>
                            <Link
                                to={user ? '/diet-check' : '/register'}
                                className="flex items-center gap-2 bg-white/10 backdrop-blur text-white border border-white/20 px-7 py-3.5 rounded-xl font-bold text-sm hover:bg-white/20 transition-all hover:scale-105 active:scale-95"
                            >
                                <Salad className="w-5 h-5" /> Check Diet Risk
                            </Link>
                        </div>

                        {/* Social proof */}
                        <div className="flex items-center gap-6 pt-4 border-t border-white/10 text-sm">
                            <div className="flex items-center gap-1.5 text-slate-300">
                                <Users className="w-4 h-4 text-teal-400" />
                                <span><strong className="text-white">10,000+</strong> Analyses done</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-300">
                                <Star className="w-4 h-4 text-amber-400" />
                                <span><strong className="text-white">4.9</strong> Accuracy rating</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Feature Grid ──────────────────────────────────────────── */}
            <section className="space-y-6">
                <div className="text-center space-y-2">
                    <h2 className="text-3xl font-extrabold text-slate-900">Two Powerful Ways to Understand Your Skin</h2>
                    <p className="text-slate-500 max-w-xl mx-auto">Combine visual AI with lifestyle science for the most comprehensive acne analysis available.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* AI Skin Scan Card */}
                    <div className="group relative bg-gradient-to-br from-teal-50 to-white rounded-2xl border border-teal-100 p-8 shadow-sm hover:shadow-lg transition-shadow overflow-hidden">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-teal-100/50 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3 pointer-events-none" />
                        <div className="relative z-10 space-y-4">
                            <div className="w-14 h-14 bg-teal-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-teal-200">
                                <ScanFace className="w-7 h-7" />
                            </div>
                            <div>
                                <h3 className="text-xl font-extrabold text-slate-900">AI Skin Scan</h3>
                                <p className="text-slate-500 mt-1 leading-relaxed">Upload a selfie or use your webcam. Our CNN model grades severity and maps acne to specific facial regions in seconds.</p>
                            </div>
                            <ul className="space-y-2 text-sm text-slate-600">
                                <li className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-teal-500 flex-shrink-0" /> Severity grading (Clear → Severe)</li>
                                <li className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-teal-500 flex-shrink-0" /> Facial region mapping</li>
                                <li className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-teal-500 flex-shrink-0" /> Personalized medical recommendations</li>
                            </ul>
                            <Link to={user ? '/assessment' : '/register'} className="inline-flex items-center gap-2 text-teal-700 font-bold text-sm hover:gap-3 transition-all">
                                Start Scan <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>

                    {/* Diet Risk Check Card */}
                    <div className="group relative bg-gradient-to-br from-amber-50 to-white rounded-2xl border border-amber-100 p-8 shadow-sm hover:shadow-lg transition-shadow overflow-hidden">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-100/50 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3 pointer-events-none" />
                        <div className="relative z-10 space-y-4">
                            <div className="w-14 h-14 bg-amber-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-amber-200">
                                <Salad className="w-7 h-7" />
                            </div>
                            <div>
                                <h3 className="text-xl font-extrabold text-slate-900">Diet Risk Check</h3>
                                <p className="text-slate-500 mt-1 leading-relaxed">Answer 12 lifestyle questions. Our Random Forest ML model (82% accuracy) predicts your dietary acne risk and explains exactly why.</p>
                            </div>
                            <ul className="space-y-2 text-sm text-slate-600">
                                <li className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-amber-500 flex-shrink-0" /> Low / Medium / High risk score</li>
                                <li className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-amber-500 flex-shrink-0" /> Top 5 trigger factors identified</li>
                                <li className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-amber-500 flex-shrink-0" /> Actionable nutrition guidance</li>
                            </ul>
                            <Link to={user ? '/diet-check' : '/register'} className="inline-flex items-center gap-2 text-amber-700 font-bold text-sm hover:gap-3 transition-all">
                                Check Diet Risk <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Stats ─────────────────────────────────────────────────── */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                    { value: '43MB', label: 'Trained CNN Model', icon: <Brain className="w-5 h-5" /> },
                    { value: '82%', label: 'Diet Model Accuracy', icon: <Activity className="w-5 h-5" /> },
                    { value: '10K+', label: 'Training Samples', icon: <Users className="w-5 h-5" /> },
                    { value: '4', label: 'Severity Grades', icon: <Star className="w-5 h-5" /> },
                ].map(({ value, label, icon }) => (
                    <div key={label} className="bg-white rounded-2xl border border-slate-200 p-6 text-center shadow-sm">
                        <div className="w-10 h-10 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center mx-auto mb-3">{icon}</div>
                        <p className="text-3xl font-extrabold text-slate-900">{value}</p>
                        <p className="text-sm text-slate-500 mt-1">{label}</p>
                    </div>
                ))}
            </section>

            {/* ── CTA Banner ────────────────────────────────────────────── */}
            {!user && (
                <section className="text-center bg-gradient-to-r from-teal-600 to-teal-500 rounded-3xl p-12 shadow-xl">
                    <h2 className="text-3xl font-extrabold text-white mb-3">Ready to understand your skin?</h2>
                    <p className="text-teal-100 mb-8 max-w-md mx-auto">Join thousands of users discovering the connection between their lifestyle and their skin.</p>
                    <Link to="/register" className="inline-flex items-center gap-2 bg-white text-teal-700 font-extrabold px-8 py-4 rounded-xl hover:bg-teal-50 transition-all hover:scale-105 shadow-lg text-sm">
                        Get Started Free <ArrowRight className="w-4 h-4" />
                    </Link>
                </section>
            )}
        </div>
    );
};

export default Home;
