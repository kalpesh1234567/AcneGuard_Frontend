import React from 'react';
import { Moon, Droplets, Zap, Utensils } from 'lucide-react';

const LifestyleTracker = ({ data, onChange }) => {
    const handleChange = (field, value) => {
        onChange({ ...data, [field]: value });
    };

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold text-slate-900">2. Lifestyle Factors</h3>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Diet Toggle */}
                <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm transition hover:shadow-md">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-rose-100 text-rose-600 rounded-lg">
                            <Utensils className="w-5 h-5" />
                        </div>
                        <label className="font-medium text-slate-700">Dietary Habits</label>
                    </div>
                    <div className="flex gap-2">
                        {['Balanced', 'High-Sugar'].map(option => (
                            <button
                                key={option}
                                onClick={() => handleChange('diet', option)}
                                className={`flex-1 py-2 text-sm rounded-lg transition-all ${data.diet === option
                                        ? 'bg-rose-500 text-white shadow-md'
                                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                    }`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Stress Slider */}
                <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm transition hover:shadow-md">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                                <Zap className="w-5 h-5" />
                            </div>
                            <label className="font-medium text-slate-700">Stress Level</label>
                        </div>
                        <span className="text-amber-600 font-bold">{data.stress}/10</span>
                    </div>
                    <input
                        type="range"
                        min="1"
                        max="10"
                        value={data.stress}
                        onChange={(e) => handleChange('stress', parseInt(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                </div>

                {/* Sleep Slider */}
                <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm transition hover:shadow-md">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                                <Moon className="w-5 h-5" />
                            </div>
                            <label className="font-medium text-slate-700">Sleep (Hours)</label>
                        </div>
                        <span className="text-indigo-600 font-bold">{data.sleep}h</span>
                    </div>
                    <input
                        type="range"
                        min="4"
                        max="10"
                        step="0.5"
                        value={data.sleep}
                        onChange={(e) => handleChange('sleep', parseFloat(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                </div>

                {/* Water Slider */}
                <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm transition hover:shadow-md">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-cyan-100 text-cyan-600 rounded-lg">
                                <Droplets className="w-5 h-5" />
                            </div>
                            <label className="font-medium text-slate-700">Water (Liters)</label>
                        </div>
                        <span className="text-cyan-600 font-bold">{data.water}L</span>
                    </div>
                    <input
                        type="range"
                        min="0.5"
                        max="4"
                        step="0.5"
                        value={data.water}
                        onChange={(e) => handleChange('water', parseFloat(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                    />
                </div>
            </div>
        </div>
    );
};

export default LifestyleTracker;
