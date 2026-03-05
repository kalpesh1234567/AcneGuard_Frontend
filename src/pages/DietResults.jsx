import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import {
    Salad, AlertTriangle, ArrowLeft, ShieldCheck,
    TrendingUp, ListChecks, ChevronRight, RefreshCw
} from 'lucide-react';

const RISK_CONFIG = {
    Low: { color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', bar: 'bg-emerald-500', label: 'Low Risk' },
    Medium: { color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', bar: 'bg-amber-500', label: 'Medium Risk' },
    High: { color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200', bar: 'bg-rose-500', label: 'High Risk' },
};

const DietResults = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { result, answers } = location.state || {};

    if (!result) {
        return (
            <div className="max-w-xl mx-auto text-center py-24 space-y-4">
                <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto" />
                <p className="text-slate-600 font-semibold">No results to display.</p>
                <Link to="/diet-check" className="inline-flex items-center gap-2 text-teal-600 font-bold hover:underline">
                    <ArrowLeft className="w-4 h-4" /> Take the Diet Check
                </Link>
            </div>
        );
    }

    const riskLevel = result.risk_level || 'Medium';
    const cfg = RISK_CONFIG[riskLevel] || RISK_CONFIG.Medium;
    const score = Math.round((result.confidence_score || 0.5) * 100);
    const causes = result.main_causes || [];
    const recommendations = result.recommendations || {};

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
                <div className="w-14 h-14 bg-amber-500 text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-amber-200">
                    <Salad className="w-7 h-7" />
                </div>
                <h1 className="text-3xl font-extrabold text-slate-900">Diet Risk Results</h1>
                <p className="text-slate-500 text-sm">Based on your lifestyle and dietary habits</p>
            </div>

            {/* Risk Score Card */}
            <div className={`${cfg.bg} ${cfg.border} border rounded-2xl p-8 text-center space-y-4`}>
                <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">Your Acne Diet Risk</p>
                <div className={`text-6xl font-extrabold ${cfg.color}`}>{riskLevel}</div>
                <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm text-slate-500">
                        <span>Confidence</span>
                        <span className={`font-bold ${cfg.color}`}>{score}%</span>
                    </div>
                    <div className="h-3 bg-white/70 rounded-full overflow-hidden border border-slate-200">
                        <div className={`h-full ${cfg.bar} rounded-full transition-all duration-1000`} style={{ width: `${score}%` }} />
                    </div>
                </div>
            </div>

            {/* Main Causes */}
            {causes.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-3">
                    <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="w-5 h-5 text-rose-500" />
                        <h2 className="font-extrabold text-slate-900">Top Triggers Identified</h2>
                    </div>
                    <ul className="space-y-2">
                        {causes.map((cause, i) => (
                            <li key={i} className="flex items-center gap-3 text-sm text-slate-700">
                                <span className="w-6 h-6 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0">{i + 1}</span>
                                {cause}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Recommendations */}
            {recommendations && recommendations.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-3">
                    <div className="flex items-center gap-2 mb-1">
                        <ListChecks className="w-5 h-5 text-teal-600" />
                        <h2 className="font-extrabold text-slate-900">Lifestyle & Diet Fixes</h2>
                    </div>
                    <ul className="space-y-3">
                        {recommendations.map((item, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                                <ShieldCheck className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-4 pb-8">
                <button onClick={() => navigate('/diet-check')}
                    className="flex items-center gap-2 px-6 py-3 bg-amber-500 text-white rounded-xl font-bold text-sm hover:bg-amber-400 transition">
                    <RefreshCw className="w-4 h-4" /> Retake Check
                </button>
                <Link to="/assessment"
                    className="flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-xl font-bold text-sm hover:bg-teal-500 transition">
                    <ChevronRight className="w-4 h-4" /> Also Do Skin Scan
                </Link>
                <Link to="/history"
                    className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:border-teal-300 transition">
                    View History
                </Link>
            </div>
        </div>
    );
};

export default DietResults;
