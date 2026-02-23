import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { saveAssessment, saveFeedback } from '../utils/api';
import {
    ScanFace, AlertTriangle, CheckCircle2, Loader2,
    ThumbsUp, ThumbsDown, BookOpen, Shield, Utensils, Sun,
    Save, RotateCcw, History, ChevronRight, Star
} from 'lucide-react';

const SEVERITY_CFG = {
    clear: { color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', dot: 'bg-emerald-500', barColor: 'bg-emerald-500' },
    mild: { color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', dot: 'bg-amber-400', barColor: 'bg-amber-400' },
    moderate: { color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', dot: 'bg-orange-500', barColor: 'bg-orange-500' },
    severe: { color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200', dot: 'bg-rose-600', barColor: 'bg-rose-500' },
};
const SEVERITIES = ['clear', 'mild', 'moderate', 'severe'];

const AIScanResults = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { result, previewUrl } = location.state || {};

    const [saving, setSaving] = useState(false);
    const [savedId, setSavedId] = useState(null);
    const [saveError, setSaveError] = useState('');
    const [showFeedback, setShowFeedback] = useState(false);
    const [feedbackSent, setFeedbackSent] = useState(false);
    const [feedbackLoading, setFeedbackLoading] = useState(false);
    const [feedbackForm, setFeedbackForm] = useState({
        user_agrees: null, corrected_severity: '', comment: '',
    });

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

    // ── Parse API response ────────────────────────────────────────────────────
    // API returns: { analysis: AcneAnalysis, explanation: AcneExplanation }
    // AcneAnalysis: { severity, acne_type, location, indicators[], localization? }
    // AcneExplanation: { why_it_happened, dietary_guidance, lifestyle_tips, prevention_guide }
    const { analysis, explanation } = result;

    const severity = (analysis?.severity || 'mild').toLowerCase();
    const cfg = SEVERITY_CFG[severity] || SEVERITY_CFG.mild;
    const acneType = analysis?.acne_type || null;
    const location_ = analysis?.location || null;
    const indicators = analysis?.indicators || [];
    const confidence = analysis?.localization?.confidence
        ? Math.round(analysis.localization.confidence * 100)
        : null;
    const regionScores = analysis?.localization?.region_scores || null;
    const faceDetected = analysis?.localization?.face_detected ?? true;
    const detectionMethod = analysis?.localization?.method || null;

    // ── Save to DB ────────────────────────────────────────────────────────────
    const handleSave = async () => {
        if (savedId) return;
        setSaving(true); setSaveError('');
        try {
            const res = await saveAssessment({
                severity: analysis?.severity || 'mild',
                acne_type: analysis?.acne_type || 'pustules',
                location: analysis?.location || 'cheeks',
                confidence: analysis?.localization?.confidence || null,
                indicators: indicators,
                region_scores: regionScores,
                explanation: explanation || null,
            });
            setSavedId(res.id);
        } catch (err) {
            setSaveError(err.response?.data?.detail || 'Could not save. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    // ── Feedback ──────────────────────────────────────────────────────────────
    const handleFeedbackSubmit = async () => {
        if (!savedId || feedbackForm.user_agrees === null) return;
        setFeedbackLoading(true);
        try {
            await saveFeedback(savedId, {
                user_agrees: feedbackForm.user_agrees,
                corrected_severity: feedbackForm.user_agrees ? null : feedbackForm.corrected_severity || null,
                comment: feedbackForm.comment || null,
            });
            setFeedbackSent(true);
        } catch { /* silently fail */ }
        finally { setFeedbackLoading(false); }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6 pb-12">
            {/* Header */}
            <div className="text-center space-y-2">
                <div className="w-14 h-14 bg-teal-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-teal-200">
                    <ScanFace className="w-7 h-7" />
                </div>
                <h1 className="text-3xl font-extrabold text-slate-900">Scan Results</h1>
                <p className="text-slate-500 text-sm">AI-powered acne analysis</p>
            </div>

            {/* Severity hero card */}
            <div className={`${cfg.bg} ${cfg.border} border rounded-2xl overflow-hidden`}>
                {previewUrl && (
                    <img src={previewUrl} alt="Analyzed face"
                        className="w-full max-h-64 object-cover object-top" />
                )}
                <div className="p-6">
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1">Detected Severity</p>
                            <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${cfg.dot}`} />
                                <span className={`text-4xl font-extrabold capitalize ${cfg.color}`}>{severity}</span>
                            </div>
                        </div>
                        {confidence !== null && (
                            <div className="text-right">
                                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1">Confidence</p>
                                <p className={`text-4xl font-extrabold ${cfg.color}`}>{confidence}%</p>
                            </div>
                        )}
                    </div>

                    {/* Meta row */}
                    <div className="flex flex-wrap gap-3 mt-3 text-sm text-slate-600">
                        {acneType && <span className="bg-white/70 px-3 py-1 rounded-full border border-slate-200 capitalize">Type: <strong>{acneType}</strong></span>}
                        {location_ && <span className="bg-white/70 px-3 py-1 rounded-full border border-slate-200 capitalize">Region: <strong>{location_}</strong></span>}
                        {!faceDetected && <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-semibold">⚠️ Face not clearly detected</span>}
                    </div>

                    {/* Indicators */}
                    {indicators.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                            {indicators.map((ind, i) => (
                                <span key={i} className="text-xs bg-white/70 border border-slate-200 text-slate-600 px-2 py-1 rounded-full capitalize">{ind}</span>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Region Scores (localization heatmap) */}
            {regionScores && (
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                    <h2 className="font-extrabold text-slate-900 flex items-center gap-2">
                        <ScanFace className="w-5 h-5 text-teal-600" /> Facial Region Breakdown
                        {detectionMethod && (
                            <span className="ml-auto text-xs text-slate-400 font-normal">{detectionMethod}</span>
                        )}
                    </h2>
                    <div className="space-y-3">
                        {Object.entries(regionScores).map(([region, score]) => {
                            const pct = Math.round((score || 0) * 100);
                            return (
                                <div key={region}>
                                    <div className="flex items-center justify-between text-sm mb-1">
                                        <span className="text-slate-600 capitalize font-medium">{region.replace(/_/g, ' ')}</span>
                                        <span className="font-bold text-slate-700">{pct}%</span>
                                    </div>
                                    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                        <div className={`h-full ${cfg.barColor} rounded-full transition-all duration-700`}
                                            style={{ width: `${pct}%` }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Explanation cards — API returns strings, not arrays */}
            {explanation && (
                <>
                    {explanation.why_it_happened && (
                        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-2">
                            <h2 className="font-extrabold text-slate-900 flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-rose-500" /> Why It Happened
                            </h2>
                            <p className="text-sm text-slate-700 leading-relaxed">{explanation.why_it_happened}</p>
                        </div>
                    )}

                    {explanation.dietary_guidance && (
                        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-2">
                            <h2 className="font-extrabold text-slate-900 flex items-center gap-2">
                                <Utensils className="w-5 h-5 text-amber-500" /> Diet Guidance
                            </h2>
                            <p className="text-sm text-slate-700 leading-relaxed">{explanation.dietary_guidance}</p>
                        </div>
                    )}

                    {explanation.lifestyle_tips && (
                        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-2">
                            <h2 className="font-extrabold text-slate-900 flex items-center gap-2">
                                <Sun className="w-5 h-5 text-teal-500" /> Lifestyle Tips
                            </h2>
                            <p className="text-sm text-slate-700 leading-relaxed">{explanation.lifestyle_tips}</p>
                        </div>
                    )}

                    {explanation.prevention_guide && (
                        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-2">
                            <h2 className="font-extrabold text-slate-900 flex items-center gap-2">
                                <Shield className="w-5 h-5 text-indigo-500" /> Prevention Guide
                            </h2>
                            <p className="text-sm text-slate-700 leading-relaxed">{explanation.prevention_guide}</p>
                        </div>
                    )}
                </>
            )}

            {/* Save to History */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                <h2 className="font-extrabold text-slate-900 flex items-center gap-2">
                    <Save className="w-5 h-5 text-teal-600" /> Save to History
                </h2>
                <p className="text-sm text-slate-500">
                    Save this result to your personal health timeline for future tracking.
                </p>

                {saveError && (
                    <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-700 text-sm px-4 py-3 rounded-xl">
                        <AlertTriangle className="w-4 h-4 flex-shrink-0" /> {saveError}
                    </div>
                )}

                {savedId ? (
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-3 rounded-xl">
                            <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> Saved to your history!
                        </div>

                        {/* Feedback prompt */}
                        {!feedbackSent && !showFeedback && (
                            <button onClick={() => setShowFeedback(true)}
                                className="w-full py-3 border border-slate-200 rounded-xl text-sm text-slate-600 font-semibold hover:border-teal-300 hover:text-teal-700 transition flex items-center justify-center gap-2">
                                <Star className="w-4 h-4" /> Was this result accurate? Give feedback
                            </button>
                        )}

                        {/* Feedback form */}
                        {showFeedback && !feedbackSent && (
                            <div className="border border-slate-200 rounded-2xl p-5 space-y-4">
                                <p className="text-sm font-semibold text-slate-800">Was the AI result accurate?</p>
                                <div className="flex gap-3">
                                    {[
                                        { val: true, icon: ThumbsUp, label: 'Yes, looks right', activeCls: 'bg-emerald-50 border-emerald-400 text-emerald-700' },
                                        { val: false, icon: ThumbsDown, label: 'Not quite', activeCls: 'bg-rose-50 border-rose-400 text-rose-700' },
                                    ].map(({ val, icon: Icon, label, activeCls }) => (
                                        <button key={String(val)}
                                            onClick={() => setFeedbackForm(f => ({ ...f, user_agrees: val }))}
                                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border font-semibold text-sm transition ${feedbackForm.user_agrees === val ? activeCls : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}>
                                            <Icon className="w-4 h-4" /> {label}
                                        </button>
                                    ))}
                                </div>

                                {feedbackForm.user_agrees === false && (
                                    <div className="space-y-3">
                                        <p className="text-sm font-semibold text-slate-700">What should the severity be?</p>
                                        <div className="flex flex-wrap gap-2">
                                            {SEVERITIES.map(s => (
                                                <button key={s}
                                                    onClick={() => setFeedbackForm(f => ({ ...f, corrected_severity: s }))}
                                                    className={`px-4 py-2 rounded-full text-xs font-bold border capitalize transition ${feedbackForm.corrected_severity === s ? 'bg-teal-600 text-white border-teal-600' : 'border-slate-200 text-slate-600 hover:border-teal-400'}`}>
                                                    {s}
                                                </button>
                                            ))}
                                        </div>
                                        <input type="text" placeholder="Optional comment…"
                                            value={feedbackForm.comment}
                                            onChange={e => setFeedbackForm(f => ({ ...f, comment: e.target.value }))}
                                            className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                                        />
                                    </div>
                                )}

                                <button onClick={handleFeedbackSubmit}
                                    disabled={feedbackLoading || feedbackForm.user_agrees === null}
                                    className="w-full py-3 bg-teal-600 text-white rounded-xl font-bold text-sm hover:bg-teal-500 transition disabled:opacity-50 flex items-center justify-center gap-2">
                                    {feedbackLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</> : 'Submit Feedback'}
                                </button>
                            </div>
                        )}

                        {feedbackSent && (
                            <p className="flex items-center gap-2 text-emerald-700 text-sm font-semibold">
                                <CheckCircle2 className="w-4 h-4" /> Thank you! Feedback helps retrain the model.
                            </p>
                        )}
                    </div>
                ) : (
                    <button onClick={handleSave} disabled={saving}
                        className="w-full flex items-center justify-center gap-2 py-3.5 bg-teal-600 text-white rounded-xl font-bold text-sm hover:bg-teal-500 transition shadow-lg shadow-teal-200 disabled:opacity-60">
                        {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</> : <><Save className="w-4 h-4" /> Save to History</>}
                    </button>
                )}
            </div>

            {/* Bottom actions */}
            <div className="flex flex-wrap gap-3">
                <button onClick={() => navigate('/assessment')}
                    className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-semibold text-sm hover:border-teal-300 transition">
                    <RotateCcw className="w-4 h-4" /> New Scan
                </button>
                <Link to="/history"
                    className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-semibold text-sm hover:border-teal-300 transition">
                    <History className="w-4 h-4" /> View History
                </Link>
                <Link to="/diet-check"
                    className="flex items-center gap-2 px-5 py-3 bg-amber-500 text-white rounded-xl font-semibold text-sm hover:bg-amber-400 transition">
                    Check Diet Risk <ChevronRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
};

export default AIScanResults;
