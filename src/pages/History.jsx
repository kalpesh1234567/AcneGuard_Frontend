import React, { useState, useEffect } from 'react';
import { getHistory, clearHistory } from '../utils/storage';
import { Link } from 'react-router-dom';
import { Calendar, Trash2, ChevronRight, Activity, Moon, Droplets, Zap } from 'lucide-react';

const History = () => {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        setHistory(getHistory());
    }, []);

    const handleClear = () => {
        if (window.confirm('Are you sure you want to delete all history?')) {
            clearHistory();
            setHistory([]);
        }
    };

    const formatDate = (isoString) => {
        return new Date(isoString).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Your History</h1>
                    <p className="text-slate-500">Track your skin journey over time.</p>
                </div>
                {history.length > 0 && (
                    <button
                        onClick={handleClear}
                        className="flex items-center gap-2 text-rose-500 hover:text-rose-700 text-sm font-medium transition"
                    >
                        <Trash2 className="w-4 h-4" /> Clear History
                    </button>
                )}
            </div>

            {history.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
                    <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Calendar className="w-8 h-8 text-slate-400" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">No Records Yet</h2>
                    <p className="text-slate-500 mb-6">Start an assessment or check-in to build your history.</p>
                    <Link to="/assessment" className="text-teal-600 font-bold hover:underline">Start Assessment</Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {history.map((entry) => (
                        <div key={entry.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition group">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl ${entry.type === 'Assessment' ? 'bg-indigo-100 text-indigo-600' : 'bg-teal-100 text-teal-600'
                                        }`}>
                                        {entry.type === 'Assessment' ? 'A' : 'R'}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                            {entry.type === 'Assessment' ? 'Skin Assessment' : 'Daily Recovery'}
                                            <span className="text-xs font-normal text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                                                {formatDate(entry.timestamp)}
                                            </span>
                                        </h3>
                                        <p className="text-sm text-slate-500 mt-1">
                                            {entry.type === 'Assessment'
                                                ? `Type: ${entry.inputs?.skinType || 'Unknown'} • Score: ${10 - (entry.result?.severityScore || 5)}/10`
                                                : `Status: ${entry.recoveryResult?.progressStatus || 'N/A'} • Score: ${10 - (entry.recoveryResult?.newSeverity || 5)}/10`
                                            }
                                        </p>
                                    </div>
                                </div>
                                <Link
                                    to="/results"
                                    state={entry /* Pass the full saved entry structure matching what Results expects */}
                                    className="p-2 text-slate-400 group-hover:text-teal-600 transition"
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </Link>
                            </div>

                            {/* Expanded Data Snippet */}
                            <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs text-slate-500">
                                <div>
                                    <span className="block font-bold text-slate-700 mb-1 flex items-center justify-center gap-1"><Moon className="w-3 h-3" /> Sleep</span>
                                    {entry.inputs?.lifestyleData?.sleep || entry.inputs?.sleep || '-'} hrs
                                </div>
                                <div>
                                    <span className="block font-bold text-slate-700 mb-1 flex items-center justify-center gap-1"><Droplets className="w-3 h-3" /> Water</span>
                                    {entry.inputs?.lifestyleData?.water || entry.inputs?.water || '-'} L
                                </div>
                                <div>
                                    <span className="block font-bold text-slate-700 mb-1 flex items-center justify-center gap-1"><Zap className="w-3 h-3" /> Stress</span>
                                    {entry.inputs?.lifestyleData?.stress || entry.inputs?.stress || '-'} / 10
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default History;
