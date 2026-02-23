import React from 'react';
import { ArrowRight, Moon, Zap, Sun } from 'lucide-react';
import { Link } from 'react-router-dom';

const DailyRoutineFactors = () => {
    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            <section className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-full text-sm font-medium">
                    <Zap className="w-4 h-4" /> Lifestyle Sync
                </div>
                <h1 className="text-4xl font-bold text-slate-900">Daily Routine Factors</h1>
                <p className="text-slate-600 max-w-2xl mx-auto">
                    Circadian rhythms and environmental exposure dictate your skin's healing cycles.
                </p>
            </section>

            <div className="space-y-6">
                <div className="flex gap-4 items-start p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
                    <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
                        <Moon className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">Sleep & Regeneration</h3>
                        <p className="text-slate-600">
                            Skin repair peaks between 10PM and 2AM. Less than 7 hours of sleep creates Cortisol spikes, inhibiting healing.
                        </p>
                    </div>
                </div>

                <div className="flex gap-4 items-start p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
                    <div className="p-3 bg-amber-100 text-amber-600 rounded-xl">
                        <Sun className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">Environmental Exposure</h3>
                        <p className="text-slate-600">
                            UV index and pollution levels require specific antioxidant and cleansing protocols to prevent oxidative stress.
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex justify-center">
                <Link to="/assessment" className="flex items-center gap-2 bg-purple-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-purple-700 transition">
                    Audit Your Routine <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
};

export default DailyRoutineFactors;
