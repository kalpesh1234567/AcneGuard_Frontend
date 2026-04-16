import React, { useRef, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

import {
    Salad, AlertTriangle, ArrowLeft, ShieldCheck,
    TrendingUp, ListChecks, ChevronRight, RefreshCw, Download, Loader2
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
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownloadPDF = async () => {
        setIsDownloading(true);
        try {
            // Give React a moment to render the hidden PDF node
            await new Promise(resolve => setTimeout(resolve, 50));

            const element = document.getElementById('pdf-diet-report-container');
            if (!element) return;

            // Render it temporarily visible in a fixed background container to ensure correct dimensions
            element.style.display = 'block';

            const canvas = await html2canvas(element, { scale: 2, useCORS: true });

            element.style.display = 'none';

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'px',
                format: [canvas.width, canvas.height]
            });

            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
            pdf.save('AcneGuard_Diet_Report.pdf');
        } catch (error) {
            console.error("Failed to generate PDF:", error);
            alert("Sorry, failed to generate the PDF report.");
        } finally {
            setIsDownloading(false);
        }
    };

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
                <button onClick={handleDownloadPDF} disabled={isDownloading}
                    className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition disabled:opacity-75">
                    {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                    Download PDF
                </button>
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

            {/* ── Hidden Printable PDF Layout ── */}
            <div id="pdf-diet-report-container" style={{ display: 'none', position: 'absolute', top: '-10000px', width: '800px', background: 'white', padding: '40px', fontFamily: 'sans-serif' }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '30px', borderBottom: '2px solid #e2e8f0', paddingBottom: '20px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '40px', height: '40px', backgroundColor: '#d97706', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 13.92V21a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-7.08"/><path d="M12 2A2 2 0 0 0 10 4v6.5a1.5 1.5 0 0 0 1.5 1.5h1a1.5 1.5 0 0 0 1.5-1.5V4a2 2 0 0 0-2-2z"/><path d="M8 6h8"/><path d="M8 9h8"/></svg>
                        </div>
                        <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>AcneGuard AI</h1>
                    </div>
                    <p style={{ color: '#64748b', marginTop: '8px' }}>Personalized Diet & Lifestyle Risk Report</p>
                </div>

                {/* Body Content */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
                    <div>
                        <p style={{ color: '#64748b', fontSize: '14px', textTransform: 'uppercase', marginBottom: '4px', fontWeight: 'bold' }}>Acne Diet Risk Level</p>
                        <h2 style={{ fontSize: '36px', fontWeight: 'bold', textTransform: 'capitalize', color: '#0f172a', margin: 0 }}>{riskLevel}</h2>
                    </div>
                    <div style={{ textAlign: 'center', background: '#f8fafc', padding: '15px 25px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                        <p style={{ fontSize: '42px', fontWeight: 'bold', color: '#d97706', margin: 0 }}>{score}%</p>
                        <p style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: '#64748b', margin: 0 }}>Confidence</p>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '30px' }}>
                    {causes.length > 0 && (
                        <div style={{ background: '#fef2f2', padding: '24px', borderRadius: '16px', border: '1px solid #fee2e2' }}>
                            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#9f1239', margin: '0 0 16px 0' }}>Top Triggers Identified</h3>
                            <ul style={{ fontSize: '15px', color: '#881337', paddingLeft: '20px', margin: 0, lineHeight: '1.6' }}>
                                {causes.map((c, i) => <li key={i}>{c}</li>)}
                            </ul>
                        </div>
                    )}
                    {recommendations && recommendations.length > 0 && (
                        <div style={{ background: '#f0fdf4', padding: '24px', borderRadius: '16px', border: '1px solid #dcfce3' }}>
                            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#166534', margin: '0 0 16px 0' }}>Lifestyle & Diet Fixes</h3>
                            <ul style={{ fontSize: '15px', color: '#14532d', paddingLeft: '20px', margin: 0, lineHeight: '1.6' }}>
                                {recommendations.map((r, i) => <li key={i}>{r}</li>)}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Required Disclaimer */}
                <div style={{ marginTop: '50px', paddingTop: '20px', borderTop: '2px dashed #cbd5e1', textAlign: 'center' }}>
                    <p style={{ color: '#0f172a', fontWeight: 'bold', fontSize: '15px', marginBottom: '8px' }}>Important Medical Disclaimer</p>
                    <p style={{ color: '#64748b', fontSize: '13px', maxWidth: '600px', margin: '0 auto', lineHeight: '1.5' }}>
                        This is an AI generated report. For better treatment and professional diagnosis, please take an appointment from a certified dermatologist or doctor.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DietResults;
