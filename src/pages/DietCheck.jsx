import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../config';
import { useAuth } from '../context/AuthContext';
import {
    Salad, Loader2, AlertTriangle, ArrowRight, Activity, Droplets,
    Moon, Utensils, Wheat, Fish, Flame, Coffee, HeartPulse, Brain, Zap, Check, CheckCircle2, ChevronRight
} from 'lucide-react';

const QUESTIONS = [
    {
        id: 'diet_type',
        label: 'What is your primary diet type?',
        icon: <Utensils className="w-5 h-5 text-emerald-500" />,
        type: 'cards',
        options: [
            { label: 'Veg', value: 'Veg', icon: <Salad className="w-6 h-6" /> },
            { label: 'Non-Veg', value: 'Non-Veg', icon: <Fish className="w-6 h-6" /> },
            { label: 'Vegan', value: 'Vegan', icon: <Wheat className="w-6 h-6" /> }
        ]
    },
    {
        id: 'specific_food_item',
        label: 'Which of these do you eat most frequently?',
        icon: <Salad className="w-5 h-5 text-orange-500" />,
        type: 'chips',
        options: [
            'Red Meat', 'Processed Meat', 'Starchy/Potato', 'Balanced Veg',
            'Leafy Greens', 'Legumes/Pulses', 'Fish', 'Nuts/Seeds',
            'Paneer/Dairy Rich', 'Eggs', 'Chicken'
        ]
    },
    {
        id: 'sugar_intake',
        label: 'How would you rate your added sugar intake?',
        icon: <Coffee className="w-5 h-5 text-amber-500" />,
        type: 'segmented',
        options: ['Low', 'Medium', 'High']
    },
    {
        id: 'dairy_intake',
        label: 'How often do you consume dairy products?',
        icon: <Droplets className="w-5 h-5 text-blue-400" />,
        type: 'segmented',
        options: ['None', 'Occasional', 'Daily']
    },
    {
        id: 'processed_food_freq',
        label: 'How often do you eat processed/junk food?',
        icon: <Utensils className="w-5 h-5 text-red-400" />,
        type: 'segmented',
        options: ['Low', 'Medium', 'High']
    },
    {
        id: 'spicy_food_freq',
        label: 'How often do you eat spicy food?',
        icon: <Flame className="w-5 h-5 text-red-500" />,
        type: 'segmented',
        options: ['Low', 'Medium', 'High']
    },
    {
        id: 'oily_food_level',
        label: 'How often do you eat oily/fried food?',
        icon: <Droplets className="w-5 h-5 text-yellow-500" />,
        type: 'segmented',
        options: ['Low', 'Medium', 'High']
    },
    {
        id: 'water_intake_liters',
        label: 'How many liters of water do you drink daily?',
        icon: <Droplets className="w-5 h-5 text-cyan-500" />,
        type: 'slider',
        min: 1.0, max: 4.0, step: 0.5, unit: 'L',
        options: ['1.0', '1.5', '2.0', '2.5', '3.0', '3.5', '4.0']
    },
    {
        id: 'sleep_hours',
        label: 'How many hours do you sleep per night?',
        icon: <Moon className="w-5 h-5 text-indigo-400" />,
        type: 'slider',
        min: 4, max: 10, step: 1, unit: 'hrs',
        options: ['4', '5', '6', '7', '8', '9', '10']
    },
    {
        id: 'stress_level',
        label: 'Rate your stress level (1=Low, 5=High)',
        icon: <Brain className="w-5 h-5 text-violet-500" />,
        type: 'slider',
        min: 1, max: 5, step: 1, unit: '',
        options: ['1', '2', '3', '4', '5']
    },
    {
        id: 'exercise',
        label: 'Do you exercise regularly?',
        icon: <HeartPulse className="w-5 h-5 text-rose-500" />,
        type: 'toggle',
        options: ['Yes', 'No']
    },
    {
        id: 'skin_type',
        label: 'What is your skin type?',
        icon: <Zap className="w-5 h-5 text-amber-500" />,
        type: 'cards',
        options: [
            { label: 'Dry', value: 'Dry', icon: <Droplets className="w-6 h-6 opacity-50" /> },
            { label: 'Normal', value: 'Normal', icon: <Check className="w-6 h-6 text-green-500" /> },
            { label: 'Oily', value: 'Oily', icon: <Droplets className="w-6 h-6 text-yellow-500" /> }
        ]
    }
];

const DietCheck = () => {
    const navigate = useNavigate();
    const { getAuthHeader } = useAuth();

    // Default values for sliders so they don't start blank
    const [answers, setAnswers] = useState({
        water_intake_liters: '2.5',
        sleep_hours: '7',
        stress_level: '3'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const answeredCount = Object.keys(answers).length;
    const allAnswered = QUESTIONS.every(q => answers[q.id]);
    const progress = Math.round((answeredCount / QUESTIONS.length) * 100);

    const handleSubmit = async () => {
        if (!allAnswered) { setError('Please answer all questions before submitting.'); return; }
        setLoading(true); setError('');
        try {
            const payload = {
                ...answers,
                water_intake_liters: parseFloat(answers.water_intake_liters),
                sleep_hours: parseInt(answers.sleep_hours, 10),
                stress_level: parseInt(answers.stress_level, 10)
            };

            const res = await axios.post(
                `${BASE_URL}/diet/predict`,
                payload,
                { headers: { ...getAuthHeader(), 'Content-Type': 'application/json' } }
            );
            navigate('/diet-results', { state: { result: res.data, answers: payload } });
        } catch (err) {
            setError(err.response?.data?.detail || 'Analysis failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = (id, value) => setAnswers(prev => ({ ...prev, [id]: value }));

    return (
        <div className="min-h-screen bg-[#fafafa] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto space-y-10">

                {/* Header Section */}
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 text-white rounded-3xl shadow-xl shadow-orange-200 transform hover:scale-105 transition-transform">
                        <Salad className="w-10 h-10" />
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Diet Risk Check</h1>
                    <p className="text-lg text-slate-500 max-w-xl mx-auto">
                        Your lifestyle directly impacts your skin health. Answer {QUESTIONS.length} precise questions to reveal your personalized AI risk score.
                    </p>

                    {/* Progress Bar */}
                    <div className="max-w-md mx-auto mt-8 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                        <div className="flex items-center justify-between text-sm font-bold text-slate-700 mb-2">
                            <span>Profile Completion</span>
                            <span className="text-amber-600">{progress}%</span>
                        </div>
                        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-700 ease-out"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="flex items-center gap-3 bg-rose-50 border-l-4 border-rose-500 text-rose-800 p-4 rounded-r-xl shadow-sm animate-in fade-in slide-in-from-top-2">
                        <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                        <span className="font-medium">{error}</span>
                    </div>
                )}

                {/* Questions Feed */}
                <div className="space-y-8">
                    {QUESTIONS.map((q, idx) => (
                        <div key={q.id} className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-6 sm:p-8 transition-all hover:shadow-md hover:border-slate-300/60">

                            <div className="flex items-center gap-4 mb-6">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-colors ${answers[q.id] ? 'bg-amber-100 text-amber-700' : 'bg-slate-50 text-slate-400'}`}>
                                    {answers[q.id] ? <CheckCircle2 className="w-6 h-6 text-amber-600" /> : q.icon}
                                </div>
                                <h3 className="text-lg font-bold text-slate-800">
                                    <span className="text-slate-400 mr-2">{idx + 1}.</span>
                                    {q.label}
                                </h3>
                            </div>

                            <div className="pl-0 sm:pl-16">
                                {/* CARD Type (Diet, Skin Type) */}
                                {q.type === 'cards' && (
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        {q.options.map(opt => {
                                            const isSelected = answers[q.id] === opt.value;
                                            return (
                                                <button
                                                    key={opt.value}
                                                    onClick={() => handleSelect(q.id, opt.value)}
                                                    className={`relative p-5 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all duration-200 ${isSelected
                                                        ? 'border-amber-500 bg-amber-50 shadow-inner'
                                                        : 'border-slate-100 bg-white hover:border-amber-200 hover:bg-slate-50'
                                                        }`}
                                                >
                                                    <div className={isSelected ? 'text-amber-600' : 'text-slate-400'}>{opt.icon}</div>
                                                    <span className={`font-bold ${isSelected ? 'text-amber-800' : 'text-slate-600'}`}>{opt.label}</span>
                                                    {isSelected && <div className="absolute top-3 right-3 w-3 h-3 bg-amber-500 rounded-full" />}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}

                                {/* CHIPS Type (Specific Food) */}
                                {q.type === 'chips' && (
                                    <div className="flex flex-wrap gap-2.5">
                                        {q.options.map(opt => {
                                            const isSelected = answers[q.id] === opt;
                                            return (
                                                <button
                                                    key={opt}
                                                    onClick={() => handleSelect(q.id, opt)}
                                                    className={`px-4 py-2.5 rounded-full text-sm font-semibold border-2 transition-all duration-200 ${isSelected
                                                        ? 'bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-200/50'
                                                        : 'bg-white text-slate-600 border-slate-200 hover:border-amber-300 hover:text-amber-700'
                                                        }`}
                                                >
                                                    {opt}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}

                                {/* SEGMENTED Type (Frequency, Intake levels) */}
                                {q.type === 'segmented' && (
                                    <div className="flex bg-slate-100 p-1.5 rounded-2xl w-full sm:w-max">
                                        {q.options.map(opt => {
                                            const isSelected = answers[q.id] === opt;
                                            return (
                                                <button
                                                    key={opt}
                                                    onClick={() => handleSelect(q.id, opt)}
                                                    className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${isSelected
                                                        ? 'bg-white text-slate-900 shadow-sm ring-1 ring-black/5'
                                                        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                                                        }`}
                                                >
                                                    {opt}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}

                                {/* SLIDER Type (Water, Sleep, Stress) */}
                                {q.type === 'slider' && (
                                    <div className="pt-8 pb-4 px-2 w-full max-w-lg">
                                        <div className="relative">
                                            {/* Track */}
                                            <div className="absolute top-1/2 -translate-y-1/2 w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-amber-400 rounded-full"
                                                    style={{ width: `${((parseFloat(answers[q.id] || q.min) - q.min) / (q.max - q.min)) * 100}%` }}
                                                />
                                            </div>

                                            {/* Native Range Input (Invisible overlay for exactly matching discrete options) */}
                                            <input
                                                type="range"
                                                min={q.min}
                                                max={q.max}
                                                step={q.step}
                                                value={answers[q.id] || q.min}
                                                onChange={(e) => handleSelect(q.id, e.target.value)}
                                                className="absolute top-1/2 -translate-y-1/2 w-full h-8 opacity-0 cursor-pointer z-10"
                                            />

                                            {/* Custom Thumb (Visual only) */}
                                            <div
                                                className="absolute top-1/2 -translate-y-1/2 w-8 h-8 bg-white border-4 border-amber-500 rounded-full shadow-md pointer-events-none transform -translate-x-1/2"
                                                style={{ left: `${((parseFloat(answers[q.id] || q.min) - q.min) / (q.max - q.min)) * 100}%` }}
                                            />

                                            {/* Floating Label */}
                                            <div
                                                className="absolute -top-10 -translate-x-1/2 bg-slate-800 text-white font-bold text-sm px-3 py-1 rounded-lg pointer-events-none shadow-lg whitespace-nowrap"
                                                style={{ left: `${((parseFloat(answers[q.id] || q.min) - q.min) / (q.max - q.min)) * 100}%` }}
                                            >
                                                {answers[q.id] || q.min} {q.unit}
                                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800 rotate-45" />
                                            </div>
                                        </div>
                                        <div className="flex justify-between mt-6 text-xs font-bold text-slate-400 px-1">
                                            <span>{q.min} {q.unit}</span>
                                            <span>{q.max} {q.unit}</span>
                                        </div>
                                    </div>
                                )}

                                {/* TOGGLE Type (Exercise) */}
                                {q.type === 'toggle' && (
                                    <div className="flex gap-4">
                                        {q.options.map(opt => {
                                            const isSelected = answers[q.id] === opt;
                                            return (
                                                <button
                                                    key={opt}
                                                    onClick={() => handleSelect(q.id, opt)}
                                                    className={`px-8 py-3 rounded-xl font-bold text-lg transition-all duration-200 border-2 ${isSelected
                                                        ? 'bg-amber-500 text-white border-amber-500 shadow-lg shadow-amber-200/50'
                                                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                                        }`}
                                                >
                                                    {opt}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Submit Action */}
                <div className="pt-4 pb-20 sticky bottom-0 bg-gradient-to-t from-[#fafafa] via-[#fafafa] to-transparent z-20">
                    <button
                        onClick={handleSubmit}
                        disabled={loading || !allAnswered}
                        className="w-full sm:w-auto sm:min-w-[400px] mx-auto flex items-center justify-center gap-3 py-5 px-8 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black text-lg transition-all shadow-xl shadow-slate-900/20 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
                    >
                        {loading ? (
                            <><Loader2 className="w-6 h-6 animate-spin text-amber-400" /> Processing AI Analysis…</>
                        ) : (
                            <>
                                <span className={allAnswered ? 'text-amber-400' : 'text-slate-400'}>
                                    {allAnswered ? <Zap className="w-6 h-6 fill-amber-400" /> : <Activity className="w-6 h-6" />}
                                </span>
                                Generate Risk Report
                                <ChevronRight className="w-5 h-5 ml-2" />
                            </>
                        )}
                    </button>
                    {!allAnswered && (
                        <p className="text-center text-sm font-semibold text-slate-400 mt-4">
                            Complete {QUESTIONS.length - answeredCount} more questions to unlock your risk report
                        </p>
                    )}
                </div>

            </div>
        </div>
    );
};

export default DietCheck;
