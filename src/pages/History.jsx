import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getAssessments, deleteAssessment } from '../utils/api';
import {
    Calendar, Trash2, ScanFace, Salad, Loader2,
    AlertTriangle, RefreshCw, ChevronRight, ThumbsUp, ThumbsDown
} from 'lucide-react';

const SEVERITY_COLOR = {
    clear: 'bg-emerald-100 text-emerald-700',
    mild: 'bg-amber-100 text-amber-700',
    moderate: 'bg-orange-100 text-orange-700',
    severe: 'bg-rose-100 text-rose-700',
};

const formatDate = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
};

const History = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deleting, setDeleting] = useState(null); // id being deleted

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

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this scan from your history?')) return;
        setDeleting(id);
        try {
            await deleteAssessment(id);
            setRecords(prev => prev.filter(r => r.id !== id));
        } catch (err) {
            alert(err.response?.data?.detail || 'Delete failed.');
        } finally {
            setDeleting(null);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900">Your History</h1>
                    <p className="text-slate-500 mt-1">Track your skin journey over time.</p>
                </div>
                <button onClick={fetchRecords} disabled={loading}
                    className="flex items-center gap-2 text-sm text-slate-500 hover:text-teal-700 font-medium transition">
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
                </button>
            </div>

            {/* Error */}
            {error && (
                <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-700 text-sm px-4 py-3 rounded-xl">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" /> {error}
                </div>
            )}

            {/* Loading */}
            {loading && (
                <div className="text-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-teal-600 mx-auto" />
                    <p className="text-slate-500 mt-3 text-sm">Loading your history…</p>
                </div>
            )}

            {/* Empty state */}
            {!loading && records.length === 0 && !error && (
                <div className="text-center py-24 bg-white rounded-3xl border border-slate-100 shadow-sm">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Calendar className="w-8 h-8 text-slate-400" />
                    </div>
                    <h2 className="text-xl font-extrabold text-slate-900 mb-2">No Records Yet</h2>
                    <p className="text-slate-500 mb-6 text-sm">Start your first AI scan or diet check to build your history.</p>
                    <div className="flex items-center justify-center gap-3">
                        <Link to="/assessment"
                            className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white rounded-xl font-bold text-sm hover:bg-teal-500 transition">
                            <ScanFace className="w-4 h-4" /> Start Skin Scan
                        </Link>
                        <Link to="/diet-check"
                            className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-white rounded-xl font-bold text-sm hover:bg-amber-400 transition">
                            <Salad className="w-4 h-4" /> Diet Check
                        </Link>
                    </div>
                </div>
            )}

            {/* Records list */}
            {!loading && records.length > 0 && (
                <div className="space-y-4">
                    <p className="text-sm text-slate-400 font-medium">{records.length} record{records.length !== 1 ? 's' : ''}</p>
                    {records.map((rec) => {
                        const sev = (rec.severity || 'mild').toLowerCase();
                        const sevCls = SEVERITY_COLOR[sev] || SEVERITY_COLOR.mild;
                        const hasFeedback = rec.feedback != null;

                        return (
                            <div key={rec.id}
                                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition group">
                                <div className="flex items-start justify-between gap-4">
                                    {/* Icon + info */}
                                    <div className="flex items-start gap-4">
                                        <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center flex-shrink-0">
                                            <ScanFace className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h3 className="font-extrabold text-slate-900">AI Skin Scan</h3>
                                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full capitalize ${sevCls}`}>
                                                    {rec.severity}
                                                </span>
                                                {hasFeedback && (
                                                    <span className="flex items-center gap-1 text-xs text-emerald-600 font-semibold">
                                                        {rec.feedback?.user_agrees
                                                            ? <ThumbsUp className="w-3 h-3" />
                                                            : <ThumbsDown className="w-3 h-3" />
                                                        }
                                                        Feedback given
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-slate-500 mt-0.5">{formatDate(rec.created_at)}</p>
                                            <div className="flex flex-wrap gap-3 mt-2 text-xs text-slate-500">
                                                {rec.acne_type && <span>Type: <span className="font-semibold text-slate-700">{rec.acne_type}</span></span>}
                                                {rec.location && <span>Region: <span className="font-semibold text-slate-700">{rec.location}</span></span>}
                                                {rec.confidence && <span>Confidence: <span className="font-semibold text-slate-700">{Math.round(rec.confidence * 100)}%</span></span>}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <button
                                            onClick={() => handleDelete(rec.id)}
                                            disabled={deleting === rec.id}
                                            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition"
                                            title="Delete"
                                        >
                                            {deleting === rec.id
                                                ? <Loader2 className="w-4 h-4 animate-spin" />
                                                : <Trash2 className="w-4 h-4" />
                                            }
                                        </button>
                                    </div>
                                </div>

                                {/* Indicators */}
                                {rec.indicators?.length > 0 && (
                                    <div className="mt-4 pt-4 border-t border-slate-100">
                                        <div className="flex flex-wrap gap-2">
                                            {rec.indicators.slice(0, 5).map((ind, i) => (
                                                <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">{ind}</span>
                                            ))}
                                            {rec.indicators.length > 5 && (
                                                <span className="text-xs text-slate-400">+{rec.indicators.length - 5} more</span>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default History;
