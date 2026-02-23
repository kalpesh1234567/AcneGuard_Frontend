import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { analyzeImage } from '../utils/api';
import {
    ScanFace, Upload, Camera, Loader2, Image, ArrowRight,
    AlertTriangle, X
} from 'lucide-react';

const Assessment = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [capturedImage, setCapturedImage] = useState(null); // base64 or File
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState('');
    const [mode, setMode] = useState(null); // 'upload' | 'webcam'

    // ── Image selection helpers ───────────────────────────────────────────────

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setError('');
        setCapturedImage(file);
        setPreviewUrl(URL.createObjectURL(file));
        setMode('upload');
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (!file || !file.type.startsWith('image/')) { setError('Please drop a valid image.'); return; }
        setError('');
        setCapturedImage(file);
        setPreviewUrl(URL.createObjectURL(file));
        setMode('upload');
    };

    const handleClear = () => {
        setCapturedImage(null);
        setPreviewUrl(null);
        setMode(null);
        setError('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    // ── AI Analysis ───────────────────────────────────────────────────────────

    const handleAnalyze = async () => {
        if (!capturedImage) return;
        setIsAnalyzing(true);
        setError('');
        try {
            const result = await analyzeImage(capturedImage);
            navigate('/ai-results', { state: { result, previewUrl } });
        } catch (err) {
            const msg = err.response?.data?.detail || err.message || 'Analysis failed.';
            setError(msg);
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8 py-4">
            {/* Header */}
            <div className="text-center space-y-2">
                <div className="w-14 h-14 bg-teal-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-teal-200">
                    <ScanFace className="w-7 h-7" />
                </div>
                <h1 className="text-3xl font-extrabold text-slate-900">AI Skin Scan</h1>
                <p className="text-slate-500">Upload a clear photo of your face or capture one with your camera. Our CNN model will analyze it instantly.</p>
            </div>

            {/* Image Input Area */}
            {!capturedImage ? (
                <div className="space-y-4">
                    {/* Drop Zone */}
                    <div
                        onDrop={handleDrop}
                        onDragOver={(e) => e.preventDefault()}
                        onClick={() => fileInputRef.current?.click()}
                        className="group border-2 border-dashed border-slate-300 hover:border-teal-400 bg-slate-50 hover:bg-teal-50/50 rounded-2xl p-12 text-center cursor-pointer transition-all"
                    >
                        <div className="w-14 h-14 bg-white border border-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:border-teal-300 transition">
                            <Image className="w-7 h-7 text-slate-400 group-hover:text-teal-500 transition" />
                        </div>
                        <p className="font-semibold text-slate-700 mb-1">Drag & Drop your photo here</p>
                        <p className="text-sm text-slate-400">or click to browse from your gallery</p>
                        <p className="text-xs text-slate-400 mt-3">Supports JPG, PNG, WEBP • Max 10MB</p>
                    </div>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handleFileSelect}
                        className="hidden"
                    />

                    {/* OR row */}
                    <div className="flex items-center gap-3 text-slate-400 text-sm">
                        <div className="flex-1 h-px bg-slate-200" />
                        <span>or</span>
                        <div className="flex-1 h-px bg-slate-200" />
                    </div>

                    {/* Camera Button */}
                    <button
                        onClick={() => { fileInputRef.current?.click(); }}
                        className="w-full flex items-center justify-center gap-3 py-4 border border-slate-200 rounded-2xl bg-white text-slate-700 font-semibold hover:border-teal-400 hover:text-teal-700 transition"
                    >
                        <Camera className="w-5 h-5" />
                        Capture with Camera
                    </button>

                    {/* Tips */}
                    <div className="bg-teal-50 border border-teal-100 rounded-2xl p-5 space-y-2">
                        <p className="text-sm font-bold text-teal-800">📸 Photo Tips for Best Results</p>
                        <ul className="text-sm text-teal-700 space-y-1 list-inside list-disc">
                            <li>Good, even lighting (natural light is best)</li>
                            <li>Face centered and forward-facing</li>
                            <li>No filters or heavy makeup</li>
                            <li>Clear focus — avoid motion blur</li>
                        </ul>
                    </div>
                </div>
            ) : (
                /* Image Preview */
                <div className="space-y-6">
                    <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                        <img src={previewUrl} alt="Selected face" className="w-full max-h-96 object-cover" />
                        <button
                            onClick={handleClear}
                            className="absolute top-3 right-3 w-8 h-8 bg-slate-900/70 text-white rounded-full flex items-center justify-center hover:bg-rose-600 transition"
                        >
                            <X className="w-4 h-4" />
                        </button>
                        <div className="absolute bottom-3 left-3 px-3 py-1 bg-white/90 backdrop-blur rounded-full text-xs font-semibold text-slate-700 border border-slate-200">
                            Ready for analysis
                        </div>
                    </div>

                    {error && (
                        <div className="flex items-start gap-2 bg-rose-50 border border-rose-200 text-rose-700 text-sm px-4 py-3 rounded-xl">
                            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" /> {error}
                        </div>
                    )}

                    <div className="flex gap-3">
                        <button
                            onClick={handleClear}
                            className="px-6 py-3.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:border-slate-300 transition text-sm"
                        >
                            Change Photo
                        </button>
                        <button
                            onClick={handleAnalyze}
                            disabled={isAnalyzing}
                            className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-teal-600 text-white rounded-xl font-bold text-sm hover:bg-teal-500 transition-all shadow-lg shadow-teal-200 disabled:opacity-60 hover:scale-[1.01] active:scale-[0.99]"
                        >
                            {isAnalyzing ? (
                                <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing with AI…</>
                            ) : (
                                <><ScanFace className="w-5 h-5" /> Analyze My Skin <ArrowRight className="w-4 h-4" /></>
                            )}
                        </button>
                    </div>

                    {isAnalyzing && (
                        <div className="bg-teal-50 border border-teal-100 rounded-2xl p-5 text-center space-y-2 animate-pulse">
                            <p className="text-sm font-semibold text-teal-800">🧠 AI is analyzing your skin…</p>
                            <p className="text-xs text-teal-600">Running CNN severity detection + MediaPipe facial mapping. This may take 5–15 seconds.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Assessment;
