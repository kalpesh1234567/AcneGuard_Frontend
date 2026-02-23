import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Loader2, Smile, Frown, Meh, Moon, Droplets, Zap, Utensils, X, CheckCircle } from 'lucide-react';
import { analyzeRecovery } from '../utils/logicEngine';
import { saveResult } from '../utils/storage';

const RecoveryCheckin = () => {
    const navigate = useNavigate();
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [showFeedback, setShowFeedback] = useState(false);
    const [feedbackResult, setFeedbackResult] = useState(null);

    const [formData, setFormData] = useState({
        progress: 'Same', // Better, Same, Worse
        sleep: 7,
        water: 2,
        stress: 5,
        sugar: 20, // New field
        adherence: true,
    });

    const handleAnalyze = () => {
        setIsAnalyzing(true);
        // Simulate processing
        setTimeout(() => {
            const prevSeverity = 5; // Mock
            const result = analyzeRecovery(prevSeverity, formData);
            setFeedbackResult(result);
            setIsAnalyzing(false);
            setShowFeedback(true);
        }, 1000);
    };

    const handleComplete = () => {
        // Save to History
        const inputs = { type: 'Recovery', ...formData };
        saveResult({ type: 'Recovery', recoveryResult: feedbackResult, inputs });

        navigate('/results', {
            state: {
                recoveryResult: feedbackResult,
                inputs
            }
        });
    };

    if (showFeedback && feedbackResult) {
        return (
            <div className="max-w-2xl mx-auto space-y-8 animate-in zoom-in duration-500">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold text-slate-900">Daily Analysis Report</h1>
                    <p className="text-slate-500">Here's how yesterday's choices impacted your skin.</p>
                </div>

                <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 space-y-6">
                    {/* Status Badge */}
                    <div className={`p-4 rounded-xl flex items-center gap-4 ${feedbackResult.progressStatus === 'Improving' ? 'bg-green-50 text-green-700 border border-green-200' :
                            feedbackResult.progressStatus === 'Regression' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                                'bg-slate-50 text-slate-700 border border-slate-200'
                        }`}>
                        {feedbackResult.progressStatus === 'Improving' && <Smile className="w-8 h-8" />}
                        {feedbackResult.progressStatus === 'Regression' && <Frown className="w-8 h-8" />}
                        {feedbackResult.progressStatus === 'Stable' && <Meh className="w-8 h-8" />}
                        <div>
                            <h3 className="font-bold text-lg">Status: {feedbackResult.progressStatus}</h3>
                            <p className="text-sm opacity-80">Based on your visual assessment.</p>
                        </div>
                    </div>

                    {/* Factor Breakdown */}
                    <div className="space-y-4">
                        <h4 className="font-bold text-slate-900 uppercase tracking-wider text-sm">Factor Breakdown</h4>
                        {feedbackResult.factorFeedback.map((item, idx) => (
                            <div key={idx} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                                {item.status === 'good' && <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />}
                                {item.status === 'bad' && <X className="w-5 h-5 text-rose-500 mt-0.5" />}
                                {item.status === 'warning' && <Zap className="w-5 h-5 text-amber-500 mt-0.5" />}
                                {item.status === 'neutral' && <Meh className="w-5 h-5 text-slate-400 mt-0.5" />}

                                <div>
                                    <span className="font-bold text-slate-900">{item.factor}: </span>
                                    <span className="text-slate-600">{item.message}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Actionable Tips */}
                    {feedbackResult.dailyTips.length > 0 && (
                        <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                            <h4 className="font-bold text-indigo-900 mb-2 flex items-center gap-2">
                                <Zap className="w-4 h-4" /> Recommended Adjustments
                            </h4>
                            <ul className="list-disc list-inside space-y-1 text-indigo-800 text-sm">
                                {feedbackResult.dailyTips.map((tip, i) => (
                                    <li key={i}>{tip}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                </div>

                <button
                    onClick={handleComplete}
                    className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all"
                >
                    Update Dashboard <ArrowRight className="w-5 h-5" />
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Daily Recovery Check-in</h1>
                <p className="text-slate-500">Track your progress and calibrate your daily protocol.</p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 space-y-8">

                {/* 1. Progress */}
                <div className="space-y-4">
                    <label className="text-sm font-bold text-slate-900 uppercase tracking-wider">How is your skin today?</label>
                    <div className="grid grid-cols-3 gap-4">
                        {['Better', 'Same', 'Worse'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFormData({ ...formData, progress: status })}
                                className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${formData.progress === status
                                    ? 'border-teal-500 bg-teal-50 text-teal-700'
                                    : 'border-slate-200 hover:border-slate-300 text-slate-500'
                                    }`}
                            >
                                {status === 'Better' && <Smile className="w-8 h-8" />}
                                {status === 'Same' && <Meh className="w-8 h-8" />}
                                {status === 'Worse' && <Frown className="w-8 h-8" />}
                                <span className="font-bold">{status}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* 2. Lifestyle Quick Inputs */}
                <div className="space-y-6">
                    <label className="text-sm font-bold text-slate-900 uppercase tracking-wider">Daily Vitals</label>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Sleep */}
                        <div className="bg-slate-50 p-4 rounded-xl space-y-2">
                            <div className="flex items-center gap-2 text-slate-700 font-bold">
                                <Moon className="w-5 h-5 text-indigo-500" /> Sleep (Hours)
                            </div>
                            <input
                                type="range" min="0" max="12" step="0.5"
                                value={formData.sleep}
                                onChange={(e) => setFormData({ ...formData, sleep: parseFloat(e.target.value) })}
                                className="w-full accent-teal-600"
                            />
                            <div className="text-right text-sm font-bold text-slate-500">{formData.sleep} hrs</div>
                        </div>

                        {/* Water */}
                        <div className="bg-slate-50 p-4 rounded-xl space-y-2">
                            <div className="flex items-center gap-2 text-slate-700 font-bold">
                                <Droplets className="w-5 h-5 text-blue-500" /> Water (Liters)
                            </div>
                            <input
                                type="range" min="0" max="5" step="0.25"
                                value={formData.water}
                                onChange={(e) => setFormData({ ...formData, water: parseFloat(e.target.value) })}
                                className="w-full accent-teal-600"
                            />
                            <div className="text-right text-sm font-bold text-slate-500">{formData.water} L</div>
                        </div>

                        {/* Sugar Intake (New) */}
                        <div className="bg-slate-50 p-4 rounded-xl space-y-2">
                            <div className="flex items-center gap-2 text-slate-700 font-bold">
                                <Utensils className="w-5 h-5 text-rose-500" /> Sugar Intake (g)
                            </div>
                            <input
                                type="range" min="0" max="100" step="5"
                                value={formData.sugar}
                                onChange={(e) => setFormData({ ...formData, sugar: parseInt(e.target.value) })}
                                className="w-full accent-rose-500"
                            />
                            <div className="text-right text-sm font-bold text-slate-500">{formData.sugar}g</div>
                        </div>

                        {/* Stress */}
                        <div className="bg-slate-50 p-4 rounded-xl space-y-2">
                            <div className="flex items-center gap-2 text-slate-700 font-bold">
                                <Zap className="w-5 h-5 text-amber-500" /> Stress (1-10)
                            </div>
                            <input
                                type="range" min="1" max="10"
                                value={formData.stress}
                                onChange={(e) => setFormData({ ...formData, stress: parseInt(e.target.value) })}
                                className="w-full accent-teal-600"
                            />
                            <div className="flex justify-between text-xs text-slate-400 font-medium px-1">
                                <span>Zen</span>
                                <span>Chaos</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Adherence */}
                <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl">
                    <input
                        type="checkbox"
                        id="adherence"
                        checked={formData.adherence}
                        onChange={(e) => setFormData({ ...formData, adherence: e.target.checked })}
                        className="w-6 h-6 text-teal-600 rounded focus:ring-teal-500 border-gray-300"
                    />
                    <label htmlFor="adherence" className="text-slate-700 font-medium">
                        I followed yesterday's routine faithfully
                    </label>
                </div>

            </div>

            <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-teal-600 text-white rounded-xl font-bold shadow-lg shadow-teal-600/20 hover:bg-teal-700 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {isAnalyzing ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" /> Analyzing Factors...
                    </>
                ) : (
                    <>
                        Generate Daily Report <ArrowRight className="w-5 h-5" />
                    </>
                )}
            </button>
        </div>
    );
};

export default RecoveryCheckin;
