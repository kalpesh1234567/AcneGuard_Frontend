import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { analyzeImage } from '../utils/api';
import {
    ScanFace, Upload, Camera, Loader2, Image as ImageIcon, ArrowRight,
    AlertTriangle, X, CheckCircle, ZapIcon, RefreshCw
} from 'lucide-react';

const TIPS = [
    'Good, even lighting — natural light is ideal',
    'Face centered and forward-facing in frame',
    'No filters, heavy makeup or glasses',
    'Clear focus — avoid motion blur',
];

const STEPS = [
    { icon: '📤', label: 'Uploading image...' },
    { icon: '🧠', label: 'Detecting face & regions...' },
    { icon: '🔬', label: 'Running CNN severity model...' },
    { icon: '📋', label: 'Generating medical report...' },
];

const Assessment = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);

    const [tab, setTab] = useState('upload');          // 'upload' | 'camera'
    const [capturedImage, setCapturedImage] = useState(null); // File
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisStep, setAnalysisStep] = useState(0);
    const [error, setError] = useState('');
    const [cameraReady, setCameraReady] = useState(false);
    const [cameraDenied, setCameraDenied] = useState(false);

    // Questionnaire state
    const [showQuestionnaire, setShowQuestionnaire] = useState(false);
    const [routineData, setRoutineData] = useState({
        facewash_used: '',
        wash_frequency: '',
        products_used: '',
        sleep_hours: '',
        extra_details: ''
    });

    // ── Stop camera stream ────────────────────────────────────────────────────
    const stopStream = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(t => t.stop());
            streamRef.current = null;
        }
        setCameraReady(false);
    }, []);

    // ── Start camera when tab changes to 'camera' ─────────────────────────────
    useEffect(() => {
        if (tab === 'camera' && !capturedImage) {
            setCameraDenied(false);
            navigator.mediaDevices?.getUserMedia({ video: { facingMode: 'user' } })
                .then(stream => {
                    streamRef.current = stream;
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                        videoRef.current.play();
                        setCameraReady(true);
                    }
                })
                .catch(() => setCameraDenied(true));
        } else {
            stopStream();
        }
        return () => stopStream();
    }, [tab, capturedImage, stopStream]);

    // ── Capture snapshot from webcam ──────────────────────────────────────────
    const handleCapture = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas) return;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);
        canvas.toBlob(blob => {
            const file = new File([blob], `capture_${Date.now()}.jpg`, { type: 'image/jpeg' });
            setCapturedImage(file);
            setPreviewUrl(URL.createObjectURL(file));
            stopStream();
        }, 'image/jpeg', 0.92);
    };

    // ── File upload handlers ──────────────────────────────────────────────────
    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setError('');
        setCapturedImage(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (!file || !file.type.startsWith('image/')) {
            setError('Please drop a valid image file.');
            return;
        }
        setError('');
        setCapturedImage(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const handleClear = () => {
        setCapturedImage(null);
        setPreviewUrl(null);
        setError('');
        if (fileInputRef.current) fileInputRef.current.value = '';
        if (tab === 'camera') {
            // restart camera
            setCameraReady(false);
            navigator.mediaDevices?.getUserMedia({ video: { facingMode: 'user' } })
                .then(stream => {
                    streamRef.current = stream;
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                        videoRef.current.play();
                        setCameraReady(true);
                    }
                })
                .catch(() => setCameraDenied(true));
        }
    };

    // ── AI Analysis with step animation ──────────────────────────────────────
    const handleAnalyze = async () => {
        if (!capturedImage) return;
        setShowQuestionnaire(false);
        setIsAnalyzing(true);
        setError('');
        setAnalysisStep(0);

        // Animate steps
        const stepTimer = setInterval(() => {
            setAnalysisStep(s => (s < STEPS.length - 1 ? s + 1 : s));
        }, 2200);

        try {
            const result = await analyzeImage(capturedImage, routineData);
            clearInterval(stepTimer);
            navigate('/ai-results', { state: { result, previewUrl } });
        } catch (err) {
            clearInterval(stepTimer);
            const msg = err.response?.data?.detail || err.message || 'Analysis failed. Please try again.';
            setError(msg);
        } finally {
            setIsAnalyzing(false);
        }
    };

    // ── Tab switcher ──────────────────────────────────────────────────────────
    const switchTab = (t) => {
        if (t === tab) return;
        handleClear();
        setError('');
        setTab(t);
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8 py-4">

            {/* ── Header ── */}
            <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-700 text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-teal-200">
                    <ScanFace className="w-8 h-8" />
                </div>
                <h1 className="text-3xl font-extrabold text-slate-900">AI Skin Scan</h1>
                <p className="text-slate-500 max-w-md mx-auto">
                    Upload or capture a clear photo of your face. Our CNN model analyzes severity,
                    locates affected regions, and generates a personalized medical report.
                </p>
            </div>

            {/* ── Tab Selector ── */}
            {!capturedImage && (
                <div className="flex bg-slate-100 rounded-2xl p-1 gap-1">
                    {[
                        { id: 'upload', label: 'Upload Photo', icon: Upload },
                        { id: 'camera', label: 'Use Camera', icon: Camera },
                    ].map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => switchTab(id)}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${tab === id
                                ? 'bg-white text-teal-700 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            <Icon className="w-4 h-4" /> {label}
                        </button>
                    ))}
                </div>
            )}

            {/* ── Content Area ── */}
            {!capturedImage ? (

                tab === 'upload' ? (
                    /* Upload Mode */
                    <div className="space-y-4">
                        <div
                            onDrop={handleDrop}
                            onDragOver={(e) => e.preventDefault()}
                            onClick={() => fileInputRef.current?.click()}
                            className="group border-2 border-dashed border-slate-200 hover:border-teal-400 bg-slate-50 hover:bg-teal-50/40 rounded-3xl p-14 text-center cursor-pointer transition-all"
                        >
                            <div className="w-16 h-16 bg-white border-2 border-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:border-teal-300 transition shadow-sm">
                                <ImageIcon className="w-8 h-8 text-slate-300 group-hover:text-teal-500 transition" />
                            </div>
                            <p className="font-bold text-slate-700 mb-1 text-lg">Drag & drop your photo here</p>
                            <p className="text-sm text-slate-400 mb-1">or click to browse from your gallery</p>
                            <p className="text-xs text-slate-400">Supports JPG, PNG, WEBP · Max 10 MB</p>
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="hidden"
                        />

                        {/* Tips */}
                        <div className="bg-teal-50 border border-teal-100 rounded-2xl p-5">
                            <p className="text-sm font-bold text-teal-800 mb-3 flex items-center gap-2">
                                <ZapIcon className="w-4 h-4" /> Photo Tips for Best Results
                            </p>
                            <ul className="space-y-1.5">
                                {TIPS.map((tip, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-teal-700">
                                        <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-teal-500" />
                                        {tip}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ) : (
                    /* Camera Mode */
                    <div className="space-y-4">
                        <div className="relative bg-slate-900 rounded-3xl overflow-hidden aspect-video flex items-center justify-center">
                            {cameraDenied ? (
                                <div className="text-center space-y-3 p-8">
                                    <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto" />
                                    <p className="text-white font-semibold">Camera access denied</p>
                                    <p className="text-slate-400 text-sm">Please allow camera access in your browser settings and refresh.</p>
                                </div>
                            ) : (
                                <>
                                    <video
                                        ref={videoRef}
                                        autoPlay
                                        muted
                                        playsInline
                                        className="w-full h-full object-cover"
                                    />
                                    {/* Face outline guide */}
                                    {cameraReady && (
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                            <div className="w-48 h-60 border-2 border-teal-400/70 rounded-[50%] border-dashed opacity-70" />
                                        </div>
                                    )}
                                    {!cameraReady && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Loader2 className="w-8 h-8 animate-spin text-teal-400" />
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                        <canvas ref={canvasRef} className="hidden" />

                        {!cameraDenied && (
                            <button
                                onClick={handleCapture}
                                disabled={!cameraReady}
                                className="w-full flex items-center justify-center gap-3 py-4 bg-teal-600 text-white rounded-2xl font-bold text-base hover:bg-teal-500 transition disabled:opacity-40 shadow-lg shadow-teal-200"
                            >
                                <Camera className="w-5 h-5" /> Capture Photo
                            </button>
                        )}

                        <div className="bg-teal-50 border border-teal-100 rounded-2xl p-4 text-center">
                            <p className="text-sm text-teal-700 font-medium">
                                Position your face inside the oval guide, then tap <strong>Capture Photo</strong>.
                            </p>
                        </div>
                    </div>
                )

            ) : (
                /* ── Preview + Analyze ── */
                <div className="space-y-5">
                    {/* Image preview */}
                    <div className="relative rounded-3xl overflow-hidden border-2 border-teal-200 shadow-lg">
                        <img src={previewUrl} alt="Selected face" className="w-full max-h-96 object-cover" />
                        <button
                            onClick={handleClear}
                            className="absolute top-3 right-3 w-9 h-9 bg-slate-900/70 text-white rounded-full flex items-center justify-center hover:bg-rose-600 transition backdrop-blur"
                        >
                            <X className="w-4 h-4" />
                        </button>
                        <div className="absolute bottom-3 left-3 flex items-center gap-2 px-3 py-1.5 bg-white/90 backdrop-blur rounded-full text-xs font-semibold text-slate-700 border border-slate-200 shadow-sm">
                            <CheckCircle className="w-3.5 h-3.5 text-teal-600" /> Ready for analysis
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="flex items-start gap-2 bg-rose-50 border border-rose-200 text-rose-700 text-sm px-4 py-3 rounded-xl">
                            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" /> {error}
                        </div>
                    )}

                    {/* Analysis progress */}
                    {isAnalyzing && (
                        <div className="bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200 rounded-2xl p-6 space-y-4">
                            <p className="text-sm font-bold text-teal-900 text-center">🧠 AI is analyzing your skin…</p>
                            <div className="space-y-2">
                                {STEPS.map((step, i) => (
                                    <div key={i} className={`flex items-center gap-3 text-sm transition-all duration-300 ${i <= analysisStep ? 'opacity-100' : 'opacity-30'}`}>
                                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-base flex-shrink-0 ${i < analysisStep ? 'bg-teal-600 text-white' : i === analysisStep ? 'bg-teal-100 ring-2 ring-teal-500' : 'bg-slate-100'}`}>
                                            {i < analysisStep ? '✓' : step.icon}
                                        </div>
                                        <span className={i <= analysisStep ? 'text-teal-800 font-medium' : 'text-slate-400'}>
                                            {step.label}
                                        </span>
                                        {i === analysisStep && (
                                            <Loader2 className="w-3.5 h-3.5 animate-spin text-teal-600 ml-auto" />
                                        )}
                                    </div>
                                ))}
                            </div>
                            <p className="text-xs text-teal-600 text-center">This may take 10–20 seconds…</p>
                        </div>
                    )}

                    {/* Action buttons */}
                    {!isAnalyzing && !showQuestionnaire && (
                        <div className="flex gap-3">
                            <button
                                onClick={handleClear}
                                className="flex items-center gap-2 px-5 py-3.5 rounded-xl border-2 border-slate-200 text-slate-600 font-semibold hover:border-slate-300 transition text-sm"
                            >
                                <RefreshCw className="w-4 h-4" /> Retake
                            </button>
                            <button
                                onClick={() => setShowQuestionnaire(true)}
                                disabled={isAnalyzing}
                                className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-xl font-bold text-sm hover:from-teal-500 hover:to-teal-400 transition-all shadow-lg shadow-teal-200 disabled:opacity-60 hover:scale-[1.01] active:scale-[0.99]"
                            >
                                <ScanFace className="w-5 h-5" /> Analyze My Skin <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    {/* Questionnaire Section */}
                    {showQuestionnaire && !isAnalyzing && (
                        <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-lg shadow-slate-100/50 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                            <h3 className="font-extrabold text-slate-800 text-lg flex items-center gap-2">
                                <span className="text-xl">📋</span> Quick Skin Context
                            </h3>
                            <p className="text-sm text-slate-500 font-medium">Help our AI personalize your report by sharing a few details about your routine.</p>

                            <div className="space-y-3">
                                <div>
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 block">Face Wash / Cleanser</label>
                                    <select
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition text-slate-600"
                                        value={routineData.facewash_used}
                                        onChange={e => setRoutineData({ ...routineData, facewash_used: e.target.value })}
                                    >
                                        <option value="">Select...</option>
                                        <optgroup label="Popular Gentle Cleansers">
                                            <option value="Cetaphil Gentle Skin Cleanser">Cetaphil Gentle Skin Cleanser</option>
                                            <option value="Cetaphil Daily Exfoliating Cleanser">Cetaphil Daily Exfoliating Cleanser</option>
                                            <option value="CeraVe Hydrating Facial Cleanser">CeraVe Hydrating Facial Cleanser</option>
                                            <option value="Simple Refreshing Facial Wash">Simple Refreshing Facial Wash</option>
                                        </optgroup>
                                        <optgroup label="Popular Acne / Active Cleansers">
                                            <option value="CeraVe Renewing SA Cleanser">CeraVe Renewing SA Cleanser</option>
                                            <option value="Minimalist 2% Salicylic Acid Face Wash">Minimalist 2% Salicylic Acid Face Wash</option>
                                            <option value="PanOxyl Acne Foaming Wash (Benzoyl Peroxide)">PanOxyl Acne Foaming Wash (Benzoyl Peroxide)</option>
                                            <option value="Neutrogena Oil-Free Acne Wash">Neutrogena Oil-Free Acne Wash</option>
                                            <option value="Plum Green Tea Pore Cleansing Face Wash">Plum Green Tea Pore Cleansing Face Wash</option>
                                        </optgroup>
                                        <optgroup label="Everyday / Natural Brands">
                                            <option value="Mamaearth Ubtan Face Wash">Mamaearth Ubtan Face Wash</option>
                                            <option value="Mamaearth Tea Tree Face Wash">Mamaearth Tea Tree Face Wash</option>
                                            <option value="Himalaya Purifying Neem Face Wash">Himalaya Purifying Neem Face Wash</option>
                                            <option value="Garnier Men Acno Fight Face Wash">Garnier Men Action Fight Face Wash</option>
                                            <option value="Clean & Clear Foaming Face Wash">Clean & Clear Foaming Face Wash</option>
                                        </optgroup>
                                        <optgroup label="Other">
                                            <option value="Just Water">Just Water</option>
                                            <option value="Other / Not Listed">Other / Not Listed</option>
                                        </optgroup>
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 block">Wash Frequency</label>
                                        <select
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition text-slate-600"
                                            value={routineData.wash_frequency}
                                            onChange={e => setRoutineData({ ...routineData, wash_frequency: e.target.value })}
                                        >
                                            <option value="">Select...</option>
                                            <option value="rarely">Rarely</option>
                                            <option value="once a day">Once a day</option>
                                            <option value="twice a day">Twice a day</option>
                                            <option value="more than twice">More than 2x</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 block">Sleep per Night</label>
                                        <select
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition text-slate-600"
                                            value={routineData.sleep_hours}
                                            onChange={e => setRoutineData({ ...routineData, sleep_hours: e.target.value })}
                                        >
                                            <option value="">Select...</option>
                                            <option value="<5 hours">Less than 5 hrs</option>
                                            <option value="5-6 hours">5-6 hours</option>
                                            <option value="7-8 hours">7-8 hours</option>
                                            <option value=">8 hours">More than 8 hrs</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 block">Other Products Used</label>
                                    <select
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition text-slate-600"
                                        value={routineData.products_used}
                                        onChange={e => setRoutineData({ ...routineData, products_used: e.target.value })}
                                    >
                                        <option value="">Select...</option>
                                        <optgroup label="Serums & Actives">
                                            <option value="The Ordinary Niacinamide 10% + Zinc 1%">The Ordinary Niacinamide 10% + Zinc 1%</option>
                                            <option value="Minimalist 10% Niacinamide Face Serum">Minimalist 10% Niacinamide Face Serum</option>
                                            <option value="Paula's Choice 2% BHA Liquid Exfoliant">Paula's Choice 2% BHA Liquid Exfoliant</option>
                                            <option value="The Ordinary AHA 30% + BHA 2% Peeling Solution">The Ordinary AHA 30% + BHA 2% Peeling Solution</option>
                                            <option value="Vitamin C Serum (Any brand)">Vitamin C Serum (Any brand)</option>
                                            <option value="Retinol / Retinoid Serum (Any brand)">Retinol / Retinoid Serum (Any brand)</option>
                                        </optgroup>
                                        <optgroup label="Moisturizers & Treatments">
                                            <option value="Cetaphil Moisturizing Cream/Lotion">Cetaphil Moisturizing Cream/Lotion</option>
                                            <option value="CeraVe Daily Moisturizing Lotion">CeraVe Daily Moisturizing Lotion</option>
                                            <option value="Neutrogena Hydro Boost Water Gel">Neutrogena Hydro Boost Water Gel</option>
                                            <option value="Ponds Super Light Gel Face Moisturizer">Ponds Super Light Gel Face Moisturizer</option>
                                            <option value="CosRx Advanced Snail 96 Mucin Power Essence">CosRx Advanced Snail 96 Mucin Power Essence</option>
                                            <option value="Acne Pimple Patches (Mighty Patch, CosRx, etc.)">Acne Pimple Patches (Mighty Patch, CosRx, etc.)</option>
                                            <option value="Medical Ointment (Tretinoin, Adapalene, Benzoyl Peroxide)">Medical Ointment (Tretinoin, Adapalene, Benzoyl Peroxide)</option>
                                        </optgroup>
                                        <optgroup label="Other">
                                            <option value="Only Daily Sunscreen">Only Daily Sunscreen</option>
                                            <option value="Nothing">Nothing</option>
                                            <option value="Other / Not Listed">Other / Not Listed</option>
                                        </optgroup>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 block">Extra Context (Optional)</label>
                                    <textarea
                                        placeholder="Stressed lately? Change in diet? Hormone cycle?"
                                        rows={2}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition resize-none"
                                        value={routineData.extra_details}
                                        onChange={e => setRoutineData({ ...routineData, extra_details: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => setShowQuestionnaire(false)}
                                    className="px-5 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-semibold hover:border-slate-300 transition text-sm"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={handleAnalyze}
                                    className="flex-1 flex items-center justify-center py-3 bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-xl font-bold text-sm hover:from-teal-500 hover:to-teal-400 transition-all shadow-lg shadow-teal-200 shadow-md active:scale-[0.99]"
                                >
                                    Analyze & Generate Report
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Assessment;
