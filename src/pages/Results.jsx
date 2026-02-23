import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle2, AlertCircle, Calendar, ShieldAlert } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

const Results = () => {
    const { state } = useLocation();
    const { result, inputs, recoveryResult } = state || {};

    // Determine what data to show (Assessment vs Recovery)
    const activeResult = recoveryResult || result;
    const isRecovery = !!recoveryResult;

    if (!activeResult) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-slate-900">No results found.</h2>
                <Link to="/assessment" className="text-teal-600 hover:underline">Start Assessment</Link>
            </div>
        );
    }

    // Calculate Progress Ring based on Severity
    const severity = isRecovery ? activeResult.newSeverity : activeResult.severityScore;
    const healthScore = 10 - severity;
    const ringCircumference = 2 * Math.PI * 54;
    const ringOffset = ringCircumference - (healthScore / 10) * ringCircumference;

    // Data for Radar Chart
    const riskData = activeResult.riskFactors ? [
        { subject: 'Dietary', A: activeResult.riskFactors.diet, fullMark: 100 },
        { subject: 'Environment', A: activeResult.riskFactors.environment, fullMark: 100 },
        { subject: 'Health/Genetics', A: activeResult.riskFactors.health, fullMark: 100 },
    ] : [];

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-12">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">{isRecovery ? 'Daily Progress' : 'Your Bio-Protocol'}</h1>
                    <p className="text-slate-500">
                        {isRecovery
                            ? `Status: ${activeResult.progressStatus}`
                            : `Analysis for ${inputs.skinType} Skin Type`}
                    </p>
                </div>
                <div className="text-right">
                    <span className="inline-block px-3 py-1 bg-slate-100 rounded-full text-xs font-medium text-slate-600">ID: #SL-{Math.floor(Math.random() * 10000)}</span>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">

                {/* Score Card / Radar Chart */}
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-32 bg-teal-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>

                        <h3 className="font-medium text-slate-400 mb-6">Skin Health Score</h3>

                        <div className="flex items-center justify-center mb-6">
                            <div className="relative w-32 h-32">
                                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                                    <circle cx="60" cy="60" r="54" fill="none" stroke="#1e293b" strokeWidth="8" />
                                    <circle
                                        cx="60" cy="60" r="54"
                                        fill="none"
                                        stroke="#0d9488"
                                        strokeWidth="8"
                                        strokeDasharray={ringCircumference}
                                        strokeDashoffset={ringOffset}
                                        strokeLinecap="round"
                                        className="transition-all duration-1000 ease-out"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-4xl font-bold">{healthScore.toFixed(1)}</span>
                                </div>
                            </div>
                        </div>

                        <p className="text-sm text-slate-400 text-center">
                            {healthScore > 7 ? 'Excellent Balance' : healthScore > 4 ? 'Action Required' : 'Critical Care Needed'}
                        </p>
                    </div>

                    {/* Radar Chart for Risk Analysis */}
                    {!isRecovery && activeResult.riskFactors && (
                        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <ShieldAlert className="w-4 h-4 text-rose-500" /> Risk Profile
                            </h3>
                            <div className="h-[200px] w-full text-xs">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={riskData}>
                                        <PolarGrid stroke="#e2e8f0" />
                                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 10 }} />
                                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                        <Radar
                                            name="Risk Level"
                                            dataKey="A"
                                            stroke="#0d9488"
                                            fill="#0d9488"
                                            fillOpacity={0.6}
                                        />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                            <p className="text-xs text-center text-slate-400 mt-2">Higher area = Higher Risk Load</p>
                        </div>
                    )}
                </div>

                {/* Recommendations */}
                <div className="md:col-span-2 space-y-6">

                    {/* Products / Daily Tips */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-teal-600" /> Clinical Recommendations
                        </h3>
                        <div className="grid gap-3">
                            {isRecovery ? (
                                <ul className="space-y-3">
                                    {activeResult.dailyTips.map((tip, i) => (
                                        <li key={i} className="flex gap-3 text-slate-700 bg-teal-50 p-4 rounded-xl border border-teal-100">
                                            <span className="font-bold text-teal-600">Tip #{i + 1}:</span> {tip}
                                        </li>
                                    ))}
                                    {activeResult.dailyTips.length === 0 && <p className="text-slate-500 italic">No specific adjustments needed today. Keep it up!</p>}
                                </ul>
                            ) : (
                                activeResult.products.map((prod, i) => (
                                    <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3 transition hover:border-teal-200">
                                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm text-teal-600 font-bold text-sm flex-shrink-0">
                                            {i + 1}
                                        </div>
                                        <span className="font-medium text-slate-700">{prod}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Lifestyle Tips (Now derived from Logic Engine) */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-amber-500" /> Bio-Environmental Insights
                        </h3>
                        <ul className="space-y-3">
                            {(isRecovery ? [] : activeResult.lifestyleTips).map((tip, i) => (
                                <li key={i} className="flex gap-3 text-sm text-slate-600 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                                    <span className="h-full w-1 bg-amber-500 rounded-full flex-shrink-0 mt-0.5 min-h-[1.25rem]"></span>
                                    {tip}
                                </li>
                            ))}
                            {!isRecovery && activeResult.lifestyleTips.length === 0 && (
                                <p className="text-sm text-slate-400 italic">Your lifestyle seems balanced. No critical alerts.</p>
                            )}
                        </ul>
                    </div>

                </div>
            </div>

            {/* Recovery Timeline (Modified for Genetics) */}
            {!isRecovery && (
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-8">
                        <Calendar className="w-5 h-5 text-teal-600" />
                        <h3 className="text-lg font-bold text-slate-900">Projected Recovery Path</h3>
                    </div>

                    <div className="relative">
                        {/* Connector Line */}
                        <div className="absolute top-8 left-4 right-4 h-0.5 bg-slate-100 hidden md:block"></div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {result.recoveryPath.map((node, i) => (
                                <div key={i} className="relative z-10 bg-white md:bg-transparent">
                                    <div className="flex flex-col md:items-center text-left md:text-center gap-4">
                                        <div className="w-16 h-16 bg-white border-4 border-teal-50 text-teal-600 font-bold rounded-2xl flex items-center justify-center shadow-lg transform transition hover:scale-110">
                                            W{node.week}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 mb-1">{node.title}</h4>
                                            <p className="text-xs text-slate-500 leading-relaxed max-w-[200px] mx-auto">{node.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <div className="flex justify-center pt-8">
                <Link to="/" className="text-slate-400 hover:text-slate-600 text-sm font-medium">Save Results to Profile (Demo)</Link>
            </div>

        </div>
    );
};

export default Results;
