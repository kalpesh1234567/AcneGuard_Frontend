import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BioEnvironmentalLog from '../components/BioEnvironmentalLog';
import WebcamInput from '../components/WebcamInput';
import { analyzeSkin } from '../utils/logicEngine';
import { saveResult } from '../utils/storage';
import { ArrowRight, Loader2 } from 'lucide-react';

const Assessment = () => {
    const navigate = useNavigate();
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [step, setStep] = useState(1);

    // State
    const [capturedImage, setCapturedImage] = useState(null);
    const [skinType, setSkinType] = useState('Cystic'); // Default for demo
    const [lifestyleData, setLifestyleData] = useState({
        // Original Defaults
        diet: 'Balanced',
        sleep: 7,
        stress: 5,
        water: 2,
        // Bio-Environmental Log additions
        sugarIntake: 20,
        processedFood: '1-2',
        climate: 'Humid',
        waterPh: 7.0,
        sunlight: 30, // minutes
        outdoorRatio: 20, // percentage
        pollution: 'Moderate',
        pollutedPlaces: false,
        familyHistory: [],
        diabetes: false,
        acidity: false,
        hormonal: false,
        cosmetics: ''
    });

    const handleAnalyze = () => {
        setIsAnalyzing(true);

        // Simulate AI Processing Delay
        setTimeout(() => {
            // Run Logic Locally
            const result = analyzeSkin(skinType, lifestyleData);

            // Save to History
            const inputs = { skinType, lifestyleData, capturedImage };
            saveResult({ type: 'Assessment', result, inputs });

            // Navigate to Results with Data
            navigate('/results', {
                state: {
                    result,
                    inputs
                }
            });
        }, 2000);
    };

    const isStep1Complete = capturedImage && skinType;

    return (
        <div className="space-y-8 max-w-3xl mx-auto">

            {/* Wizard Progress */}
            <div className="flex justify-between items-center mb-8 px-4">
                {[1, 2].map((s) => (
                    <div key={s} className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= s ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-500'
                            }`}>
                            {s}
                        </div>
                        <span className={`text-sm font-medium ${step >= s ? 'text-teal-900' : 'text-slate-400'}`}>
                            {s === 1 ? 'Visual Analysis' : 'Bio-Log'}
                        </span>
                        {s === 1 && <div className="w-12 h-0.5 bg-slate-200 mx-2" />}
                    </div>
                ))}
            </div>

            <div className="space-y-12">
                {/* Step 1: Visual */}
                {step === 1 && (
                    <section className="animate-in fade-in slide-in-from-left-4 duration-500">
                        <div className="text-center space-y-2 mb-8">
                            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Skin Assessment</h1>
                            <p className="text-slate-500">Let's start with a visual analysis of your skin.</p>
                        </div>
                        <WebcamInput
                            onCapture={setCapturedImage}
                            skinType={skinType}
                            setSkinType={setSkinType}
                        />
                        <div className="flex justify-end mt-8">
                            <button
                                onClick={() => setStep(2)}
                                disabled={!isStep1Complete}
                                className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all ${!isStep1Complete
                                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                    : 'bg-teal-600 text-white shadow-lg hover:bg-teal-700'
                                    }`}
                            >
                                Next Step <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    </section>
                )}

                {/* Step 2: Bio-Environmental Log */}
                {step === 2 && (
                    <section className="animate-in fade-in slide-in-from-right-4 duration-500 pb-24">
                        <div className="text-center space-y-2 mb-8">
                            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Bio-Environmental Log</h1>
                            <p className="text-slate-500">Help the AI understand your environment and health history.</p>
                        </div>

                        <BioEnvironmentalLog
                            data={lifestyleData}
                            onChange={(updated) => setLifestyleData({ ...lifestyleData, ...updated })}
                        />

                        {/* Action Area */}
                        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-slate-200 z-50">
                            <div className="max-w-3xl mx-auto flex items-center justify-between">
                                <button
                                    onClick={() => setStep(1)}
                                    className="px-6 py-3 text-slate-500 font-medium hover:text-slate-800"
                                >
                                    Back
                                </button>

                                <div className="flex items-center gap-6">
                                    <div className="hidden sm:block text-right">
                                        <p className="text-xs font-medium text-slate-500">Estimated Analysis Time</p>
                                        <p className="text-slate-900 font-bold">~2.5 Seconds</p>
                                    </div>
                                    <button
                                        onClick={handleAnalyze}
                                        disabled={isAnalyzing}
                                        className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold bg-teal-600 text-white shadow-lg shadow-teal-600/20 hover:bg-teal-700 hover:scale-105 active:scale-95 transition-all"
                                    >
                                        {isAnalyzing ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" /> Analyzing...
                                            </>
                                        ) : (
                                            <>
                                                Generate Protocol <ArrowRight className="w-5 h-5" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

export default Assessment;
