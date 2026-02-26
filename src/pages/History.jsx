import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getAssessments, deleteAssessment } from '../utils/api';
import {
    Calendar, Trash2, ScanFace, Salad, Loader2,
    AlertTriangle, RefreshCw, ChevronDown, ChevronUp,
    MapPin, Activity, X, Droplets, HeartPulse, Utensils
} from 'lucide-react';

const SEVERITY_COLOR = {
    clear: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    mild: 'bg-amber-100  text-amber-700  border-amber-200',
    moderate: 'bg-orange-100 text-orange-700 border-orange-200',
    severe: 'bg-rose-100   text-rose-700   border-rose-200',
};
const SEVERITY_BAR = {
    clear: 'bg-emerald-500', mild: 'bg-amber-400',
    moderate: 'bg-orange-500', severe: 'bg-rose-500',
};

const formatDate = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
    });
};

/* ── Delete Confirmation Modal ─────────────────────────────────────────── */
const DeleteModal = ({ onConfirm, onCancel, loading }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onCancel} />
        <div className="relative bg-white rounded-2xl p-6 shadow-2xl max-w-sm w-full space-y-4 animate-[fadeInUp_0.2s_ease]">
            <button onClick={onCancel} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
            </button>
            <div className="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6 text-rose-600" />
            </div>
            <div className="text-center space-y-1">
                <h3 className="font-extrabold text-slate-900 text-lg">Delete this scan?</h3>
                <p className="text-sm text-slate-500">This action cannot be undone. The record will be permanently removed from your history.</p>
            </div>
            <div className="flex gap-3 pt-1">
                <button onClick={onCancel}
                    className="flex-1 py-2.5 border-2 border-slate-200 text-slate-700 font-semibold rounded-xl hover:border-slate-300 transition text-sm">
                    Cancel
                </button>
                <button onClick={onConfirm} disabled={loading}
                    className="flex-1 py-2.5 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-500 transition text-sm disabled:opacity-60 flex items-center justify-center gap-2">
                    {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Deleting…</> : 'Yes, Delete'}
                </button>
            </div>
        </div>
    </div>
);

/* ── History Record Card ──────────────────────────────────────────────── */
const HistoryCard = ({ rec, onDelete }) => {
    const [expanded, setExpanded] = useState(false);
    const sev = (rec.severity || 'mild').toLowerCase();
    const sevCls = SEVERITY_COLOR[sev] || SEVERITY_COLOR.mild;
    const barCls = SEVERITY_BAR[sev] || SEVERITY_BAR.mild;
    const rs = rec.region_scores || null;
    const expl = rec.explanation || null;

    return (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            {/* Card header */}
            <div className="p-5 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0 flex-1">
                    {/* Score Circle / Icon */}
                    <div className="relative w-12 h-12 rounded-full border-4 border-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5 overflow-hidden">
                        {expl?.skin_score ? (
                            <div className="absolute inset-0 bg-slate-50 flex items-center justify-center font-extrabold text-slate-700 text-sm">
                                {expl.skin_score}
                            </div>
                        ) : (
                            <div className="absolute inset-0 bg-teal-50 text-teal-600 flex items-center justify-center">
                                <ScanFace className="w-5 h-5" />
                            </div>
                        )}
                        {/* Fake progress ring based on score */}
                        {expl?.skin_score && (
                            <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                                <circle cx="50%" cy="50%" r="50%" fill="transparent" strokeWidth="4"
                                    className={SEVERITY_BAR[sev] || 'text-teal-500'} stroke="currentColor"
                                    strokeDasharray="100 100" strokeDashoffset={`${100 - expl.skin_score}`} />
                            </svg>
                        )}
                    </div>

                    <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                            <h3 className="font-extrabold text-slate-900 text-sm">Skin Analysis</h3>
                            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border ${sevCls}`}>
                                {rec.severity}
                            </span>
                        </div>
                        <p className="text-xs text-slate-400 font-medium">{formatDate(rec.created_at)}</p>

                        <div className="flex flex-wrap gap-3 mt-2 text-xs text-slate-500">
                            {rec.acne_type && (
                                <span className="flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                                    <Activity className="w-3 h-3 text-teal-500" />
                                    <span className="capitalize">{rec.acne_type.replace('_', ' ')}</span>
                                </span>
                            )}
                            {rec.location && (
                                <span className="flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                                    <MapPin className="w-3 h-3 text-rose-500" />
                                    <span className="capitalize">{rec.location}</span>
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={() => setExpanded(e => !e)}
                        className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 hover:text-teal-600 hover:bg-teal-50 transition">
                        {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    <button onClick={onDelete}
                        className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition">
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* ── Expanded Detail Panel ── */}
            {expanded && (
                <div className="border-t border-slate-100 bg-slate-50 p-5 space-y-6">

                    {/* Summary */}
                    {expl?.simple_summary && (
                        <p className="text-sm font-medium text-slate-700 leading-relaxed bg-white p-3 rounded-xl border border-slate-200">
                            {expl.simple_summary}
                        </p>
                    )}

                    <div className="grid gap-4 md:grid-cols-2">
                        {/* Why it happened */}
                        {expl?.why_it_happened && (
                            <div className="space-y-1.5">
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                    <ScanFace className="w-3.5 h-3.5 text-indigo-400" /> Why it happened
                                </h4>
                                <p className="text-xs text-slate-600 leading-relaxed bg-indigo-50/50 p-2.5 rounded-lg border border-indigo-100/50">
                                    {expl.why_it_happened}
                                </p>
                            </div>
                        )}
                        {/* Diet */}
                        {expl?.diet_suggestions && (
                            <div className="space-y-1.5">
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                    <Utensils className="w-3.5 h-3.5 text-amber-400" /> Diet Advice
                                </h4>
                                <p className="text-xs text-slate-600 leading-relaxed bg-amber-50/50 p-2.5 rounded-lg border border-amber-100/50">
                                    {expl.diet_suggestions}
                                </p>
                            </div>
                        )}
                        {/* Skincare */}
                        {expl?.skincare_routine_suggestions && (
                            <div className="space-y-1.5">
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                    <Droplets className="w-3.5 h-3.5 text-cyan-400" /> Skincare
                                </h4>
                                <p className="text-xs text-slate-600 leading-relaxed bg-cyan-50/50 p-2.5 rounded-lg border border-cyan-100/50">
                                    {expl.skincare_routine_suggestions}
                                </p>
                            </div>
                        )}
                        {/* Lifestyle */}
                        {expl?.lifestyle_adjustments && (
                            <div className="space-y-1.5">
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                    <HeartPulse className="w-3.5 h-3.5 text-rose-400" /> Lifestyle
                                </h4>
                                <p className="text-xs text-slate-600 leading-relaxed bg-rose-50/50 p-2.5 rounded-lg border border-rose-100/50">
                                    {expl.lifestyle_adjustments}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Timeline */}
                    {expl?.recovery_expectation && (
                        <p className="text-xs text-teal-700 font-semibold text-center bg-teal-50 py-2 rounded-lg border border-teal-100">
                            ⏱ {expl.recovery_expectation}
                        </p>
                    )}

                    {/* Food Card */}
                    {expl?.food_card && (
                        <div className="bg-white border text-left border-lime-200 rounded-2xl p-4 space-y-3 mt-4 shadow-sm">
                            <h4 className="text-xs font-bold text-lime-700 uppercase tracking-wider flex items-center gap-1.5 border-b border-lime-100 pb-2">
                                <Utensils className="w-4 h-4 text-lime-600" /> {expl.food_card.title}
                            </h4>
                            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                                <span className="font-bold text-slate-700 mr-1">Why:</span>
                                {expl.food_card.why_this_food}
                            </p>
                            <div className="grid grid-cols-2 gap-3 mt-2">
                                <div className="space-y-1.5">
                                    <h5 className="text-[10px] font-bold text-emerald-600 uppercase tracking-wide">Include More</h5>
                                    <ul className="space-y-1">
                                        {expl.food_card.recommended_foods?.map((f, i) => (
                                            <li key={i} className="text-[11px] text-slate-700 font-medium flex gap-1"><span className="text-emerald-500 font-bold">✓</span> {f}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="space-y-1.5">
                                    <h5 className="text-[10px] font-bold text-rose-600 uppercase tracking-wide">Reduce</h5>
                                    <ul className="space-y-1">
                                        {expl.food_card.foods_to_limit?.map((f, i) => (
                                            <li key={i} className="text-[11px] text-slate-700 font-medium flex gap-1"><span className="text-rose-500 font-bold">✕</span> {f}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Region scores */}
                    {rs && (
                        <div className="space-y-2 pt-2 border-t border-slate-200/60">
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Region Distribution</p>
                            {Object.entries(rs)
                                .sort(([, a], [, b]) => b - a)
                                .map(([region, score]) => {
                                    const pct = Math.round((score || 0) * 100);
                                    if (pct < 5) return null;
                                    return (
                                        <div key={region} className="grid grid-cols-[60px_1fr_40px] items-center gap-3 text-xs">
                                            <span className="text-slate-500 capitalize">{region.replace(/_/g, ' ')}</span>
                                            <div className="h-1.5 bg-white rounded-full overflow-hidden border border-slate-200">
                                                <div className={`h-full ${barCls} rounded-full`} style={{ width: `${pct}%` }} />
                                            </div>
                                            <span className="font-bold text-slate-400 text-right">{pct}%</span>
                                        </div>
                                    );
                                })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

/* ══════════════════════════════════════════════════════════════════════════
   History Page
   ══════════════════════════════════════════════════════════════════════════ */
const History = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const fetchRecords = useCallback(async () => {
        setLoading(true); setError('');
        try {
            const data = await getAssessments();
            setRecords(data);
        } catch (err) {
            setError(err.response?.data?.detail || 'Could not load history.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchRecords(); }, [fetchRecords]);

    const confirmDelete = async () => {
        if (!deleteTarget) return;
        setDeleteLoading(true);
        try {
            await deleteAssessment(deleteTarget);
            setRecords(prev => prev.filter(r => r.id !== deleteTarget));
            setDeleteTarget(null);
        } catch (err) {
            alert(err.response?.data?.detail || 'Delete failed. Please try again.');
        } finally {
            setDeleteLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8">

            {/* ── Delete modal ── */}
            {deleteTarget && (
                <DeleteModal
                    loading={deleteLoading}
                    onConfirm={confirmDelete}
                    onCancel={() => setDeleteTarget(null)}
                />
            )}

            {/* ── Header ── */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Skin Log</h1>
                    <p className="text-sm text-slate-500 font-medium">Track your skin health and scores over time.</p>
                </div>
                <button onClick={fetchRecords} disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-slate-500 hover:text-teal-700 font-semibold border border-slate-200 rounded-xl hover:border-teal-300 transition">
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
                </button>
            </div>

            {/* ── Error ── */}
            {error && (
                <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-700 text-sm px-4 py-3 rounded-xl font-medium">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" /> {error}
                </div>
            )}

            {/* ── Loading ── */}
            {loading && (
                <div className="text-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-teal-600 mx-auto" />
                    <p className="text-slate-500 mt-3 text-sm font-medium">Loading your logs…</p>
                </div>
            )}

            {/* ── Empty state ── */}
            {!loading && records.length === 0 && !error && (
                <div className="text-center py-24 bg-white rounded-3xl border border-slate-200 shadow-sm border-dashed">
                    <div className="w-16 h-16 bg-teal-50 text-teal-400 rounded-full flex items-center justify-center mx-auto mb-5 shadow-sm">
                        <Calendar className="w-8 h-8" />
                    </div>
                    <h2 className="text-xl font-extrabold text-slate-900 mb-2 tracking-tight">Your log is empty</h2>
                    <p className="text-slate-500 mb-8 text-sm max-w-sm mx-auto font-medium">
                        Start your first AI skin scan to generate your baseline score and personalized insights.
                    </p>
                    <div className="flex items-center justify-center gap-3">
                        <Link to="/assessment"
                            className="flex items-center gap-2 px-5 py-3 bg-teal-600 text-white rounded-xl font-bold text-sm hover:hover:bg-teal-500 transition shadow-sm">
                            <ScanFace className="w-4 h-4" /> Start Scan
                        </Link>
                    </div>
                </div>
            )}

            {/* ── Records ── */}
            {!loading && records.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                            Latest First
                        </p>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                            {records.length} total
                        </p>
                    </div>

                    <div className="space-y-3">
                        {records.map(rec => (
                            <HistoryCard
                                key={rec.id}
                                rec={rec}
                                onDelete={() => setDeleteTarget(rec.id)}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default History;
