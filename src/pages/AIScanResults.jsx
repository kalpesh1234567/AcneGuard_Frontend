import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { saveFeedback } from '../utils/api';
import {
    ScanFace, AlertTriangle, CheckCircle2, Loader2,
    ThumbsUp, ThumbsDown, Activity, MapPin, Sparkles,
    Utensils, Droplets, HeartPulse, History, RotateCcw, ChevronRight
} from 'lucide-react';

const SEVERITY_CFG = {
    clear: { color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', dot: 'bg-emerald-500', bar: 'bg-emerald-500', scoreRing: 'text-emerald-500', scoreBg: 'bg-emerald-100' },
    mild: { color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', dot: 'bg-amber-400', bar: 'bg-amber-400', scoreRing: 'text-amber-500', scoreBg: 'bg-amber-100' },
    moderate: { color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', dot: 'bg-orange-500', bar: 'bg-orange-500', scoreRing: 'text-orange-500', scoreBg: 'bg-orange-100' },
    severe: { color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200', dot: 'bg-rose-600', bar: 'bg-rose-500', scoreRing: 'text-rose-500', scoreBg: 'bg-rose-100' },
};
const SEVERITIES = ['clear', 'mild', 'moderate', 'severe'];

const CircularProgress = ({ score, colorClass, bgClass }) => {
    const radius = 36;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    return (
        <div className="relative flex items-center justify-center w-24 h-24">
            <svg className="transform -rotate-90 w-24 h-24">
                <circle cx="48" cy="48" r={radius} className="stroke-slate-200" strokeWidth="8" fill="transparent" />
                <circle cx="48" cy="48" r={radius} className={`stroke-current ${colorClass}`} strokeWidth="8" fill="transparent"
                    strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" />
            </svg>
            <div className={`absolute inset-0 m-auto w-16 h-16 rounded-full flex flex-col items-center justify-center ${bgClass}`}>
                <span className={`text-xl font-extrabold ${colorClass}`}>{score}</span>
                <span className={`text-[9px] font-bold uppercase tracking-widest ${colorClass} opacity-80 -mt-1`}>Score</span>
            </div>
        </div>
    );
};

const AIScanResults = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { result, previewUrl } = location.state || {};

    const [showFeedback, setShowFeedback] = useState(false);
    const [feedbackSent, setFeedbackSent] = useState(false);
    const [feedbackLoading, setFeedbackLoading] = useState(false);
    const [feedbackForm, setFeedbackForm] = useState({ user_agrees: null, corrected_severity: '', comment: '' });

    if (!result) {
        return (
            <div className="max-w-xl mx-auto text-center py-24 space-y-4">
                <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto" />
                <p className="text-slate-600 font-semibold">No results to display.</p>
                <Link to="/assessment" className="inline-flex items-center gap-2 text-teal-600 font-bold hover:underline">
                    ← Start a new scan
                </Link>
            </div>
        );
    }

    const { analysis, explanation, assessment_id } = result;
    const severity = (analysis?.severity || 'mild').toLowerCase();
    const cfg = SEVERITY_CFG[severity] || SEVERITY_CFG.mild;
    const acneType = analysis?.acne_type || null;
    const location_ = analysis?.location || null;
    const regionScores = analysis?.localization?.region_scores || null;
    // const faceDetected  = analysis?.localization?.face_detected ?? true;

    // Severity scale bar
    const sevIndex = SEVERITIES.indexOf(severity);

    const handleFeedbackSubmit = async () => {
        if (feedbackForm.user_agrees === null) return;
        if (!assessment_id) { setFeedbackSent(true); return; }
        setFeedbackLoading(true);
        try {
            await saveFeedback(assessment_id, {
                user_agrees: feedbackForm.user_agrees,
                corrected_severity: feedbackForm.user_agrees ? null : feedbackForm.corrected_severity || null,
                comment: feedbackForm.comment || null,
            });
            setFeedbackSent(true);
        } catch { /* silently fail */ }
        finally { setFeedbackLoading(false); }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-5 pb-16">

            {/* ── Auto-saved banner ── */}
            <div className="flex items-center justify-center gap-2 bg-emerald-50 text-emerald-700 text-sm px-4 py-2 rounded-full font-bold my-4 w-max mx-auto border border-emerald-200 shadow-sm">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>Result securely saved to your History.</span>
            </div>

            {/* ── Header ── */}
            <div className="text-center space-y-2 mb-8">
                <div className="w-16 h-16 bg-white border border-slate-200 text-teal-600 rounded-3xl flex items-center justify-center mx-auto shadow-sm rotate-3">
                    <Sparkles className="w-8 h-8" />
                </div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Your Skin Analysis</h1>
            </div>

            {/* ── Hero Card ── */}
            <div className={`${cfg.bg} ${cfg.border} border-2 rounded-3xl overflow-hidden`}>
                {previewUrl && (
                    <img src={previewUrl} alt="Analyzed face" className="w-full h-48 object-cover object-top opacity-90 mix-blend-multiply" />
                )}
                <div className="p-6 md:p-8 space-y-6">

                    {/* Score + Severity */}
                    <div className="flex items-center gap-6">
                        {explanation?.skin_score && (
                            <CircularProgress score={explanation.skin_score} colorClass={cfg.scoreRing} bgClass={cfg.scoreBg} />
                        )}
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Detected Severity</p>
                            <h2 className={`text-4xl font-extrabold capitalize ${cfg.color}`}>{severity}</h2>
                            <div className="flex flex-wrap gap-2 mt-3 text-sm">
                                {acneType && (
                                    <span className="flex items-center gap-1.5 bg-white/60 px-3 py-1 rounded-full border border-slate-200 font-bold text-slate-700 capitalize">
                                        <Activity className="w-3.5 h-3.5 text-teal-600" /> {acneType}
                                    </span>
                                )}
                                {location_ && (
                                    <span className="flex items-center gap-1.5 bg-white/60 px-3 py-1 rounded-full border border-slate-200 font-bold text-slate-700 capitalize">
                                        <MapPin className="w-3.5 h-3.5 text-rose-500" /> {location_}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Scale bar */}
                    <div>
                        <div className="flex justify-between text-xs text-slate-400 mb-1.5 font-bold uppercase tracking-wider">
                            {SEVERITIES.map(s => (
                                <span key={s} className={s === severity ? cfg.color : ''}>{s}</span>
                            ))}
                        </div>
                        <div className="h-3.5 bg-white/50 rounded-full border border-white/60 p-0.5">
                            <div className={`h-full ${cfg.bar} rounded-full transition-all duration-700 shadow-sm`} style={{ width: `${((sevIndex + 1) / 4) * 100}%` }} />
                        </div>
                    </div>

                    {/* Simple Summary */}
                    {explanation?.simple_summary && (
                        <div className="bg-white/70 backdrop-blur-md rounded-2xl p-4 text-slate-700 text-sm leading-relaxed border border-white shadow-sm font-medium">
                            {explanation.simple_summary}
                        </div>
                    )}
                </div>
            </div>

            {/* ── Personalized Guidance ── */}
            {explanation && (
                <div className="space-y-4 pt-4">
                    <h2 className="text-xl font-extrabold text-slate-900 px-1">How exactly to improve it:</h2>

                    <div className="grid gap-4 md:grid-cols-2">
                        {/* Why it happened */}
                        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
                                    <ScanFace className="w-4 h-4 text-indigo-500" />
                                </div>
                                <h3 className="font-bold text-slate-800 text-sm">Why it's happening</h3>
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed">{explanation.why_it_happened}</p>
                        </div>

                        {/* Diet */}
                        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
                                    <Utensils className="w-4 h-4 text-amber-500" />
                                </div>
                                <h3 className="font-bold text-slate-800 text-sm">Dietary Adjustments</h3>
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed">{explanation.diet_suggestions}</p>
                        </div>

                        {/* Skincare */}
                        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-xl bg-cyan-50 flex items-center justify-center flex-shrink-0">
                                    <Droplets className="w-4 h-4 text-cyan-500" />
                                </div>
                                <h3 className="font-bold text-slate-800 text-sm">Skincare Routine</h3>
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed">{explanation.skincare_routine_suggestions}</p>
                        </div>

                        {/* Lifestyle */}
                        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center flex-shrink-0">
                                    <HeartPulse className="w-4 h-4 text-rose-500" />
                                </div>
                                <h3 className="font-bold text-slate-800 text-sm">Lifestyle & Habits</h3>
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed">{explanation.lifestyle_adjustments}</p>
                        </div>
                    </div>

                    {/* ── Food Recommendation Card ── */}
                    {explanation.food_card && (
                        <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 mt-6 shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-2xl bg-lime-100 flex items-center justify-center flex-shrink-0">
                                    <Utensils className="w-5 h-5 text-lime-600" />
                                </div>
                                <h2 className="text-xl font-extrabold text-slate-900">{explanation.food_card.title || "Food Recommendation"}</h2>
                            </div>

                            <p className="text-slate-600 font-medium mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm leading-relaxed">
                                <span className="font-bold text-slate-700 mr-2">Why:</span>
                                {explanation.food_card.why_this_food}
                            </p>

                            <div className="grid gap-6 md:grid-cols-2">
                                {/* Include More */}
                                <div className="space-y-3">
                                    <h3 className="flex items-center gap-2 font-bold text-emerald-700 text-sm">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                        Include More:
                                    </h3>
                                    <ul className="space-y-2">
                                        {explanation.food_card.recommended_foods?.map((food, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-slate-700 font-medium bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                                                <span className="text-emerald-600 mt-0.5 font-bold">✓</span> {food}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Reduce */}
                                <div className="space-y-3">
                                    <h3 className="flex items-center gap-2 font-bold text-rose-700 text-sm">
                                        <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                                        Reduce:
                                    </h3>
                                    <ul className="space-y-2">
                                        {explanation.food_card.foods_to_limit?.map((food, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-slate-700 font-medium bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-100">
                                                <span className="text-rose-600 mt-0.5 font-bold">✕</span> {food}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Timeline & Encouragement */}
                    <div className="bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-100 rounded-3xl p-6 mt-6 shadow-sm">
                        <div className="space-y-3">
                            <div>
                                <h3 className="font-extrabold text-teal-900 text-sm tracking-wide uppercase mb-1">Expected Recovery</h3>
                                <p className="text-teal-800 text-sm font-medium">{explanation.recovery_expectation}</p>
                            </div>
                            <div className="h-px bg-teal-200/50 w-full" />
                            <p className="text-teal-700 text-sm font-semibold">{explanation.encouragement_line}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Facial Region Heatmap ── */}
            {regionScores && (
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                    <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide">Acne Distribution</h3>
                    <div className="space-y-3">
                        {Object.entries(regionScores)
                            .sort(([, a], [, b]) => b - a)
                            .map(([region, score]) => {
                                const pct = Math.round((score || 0) * 100);
                                if (pct < 5) return null; // hide very low scores
                                return (
                                    <div key={region} className="grid grid-cols-[80px_1fr_40px] items-center gap-4 text-sm">
                                        <span className="text-slate-600 capitalize font-medium">{region.replace(/_/g, ' ')}</span>
                                        <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                            <div className={`h-full ${cfg.bar} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                                        </div>
                                        <span className="font-bold text-slate-500 text-right">{pct}%</span>
                                    </div>
                                );
                            })}
                    </div>
                </div>
            )}

            {/* ── Bottom Actions ── */}
            <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-200">
                <button onClick={() => navigate('/assessment')}
                    className="flex items-center gap-2 px-5 py-3 bg-white border-2 border-slate-200 text-slate-700 rounded-xl font-semibold text-sm hover:border-teal-300 hover:text-teal-700 transition">
                    <RotateCcw className="w-4 h-4" /> New Scan
                </button>
                <Link to="/history"
                    className="flex items-center gap-2 px-5 py-3 bg-white border-2 border-slate-200 text-slate-700 rounded-xl font-semibold text-sm hover:border-teal-300 hover:text-teal-700 transition">
                    <History className="w-4 h-4" /> View History
                </Link>
                <Link to="/diet-check"
                    className="flex items-center gap-2 px-5 py-3 bg-amber-500 text-white rounded-xl font-semibold text-sm hover:bg-amber-400 transition shadow-sm ml-auto">
                    Also Check Diet <ChevronRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
};

export default AIScanResults;
