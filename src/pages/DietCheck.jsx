import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../config';
import { useAuth } from '../context/AuthContext';
import {
    Salad, Loader2, AlertTriangle, ArrowRight, ChevronRight,
    CheckCircle2, Droplets, Moon, Activity, Utensils
} from 'lucide-react';

const QUESTIONS = [
    {
        id: 'dairy_intake',
        label: 'How often do you consume dairy products?',
        icon: <Droplets className="w-5 h-5" />,
        options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Daily']
    },
    {
        id: 'sugar_intake',
        label: 'How much added sugar do you consume daily?',
        icon: <Utensils className="w-5 h-5" />,
        options: ['None', 'Low (<25g)', 'Moderate (25-50g)', 'High (>50g)']
    },
    {
        id: 'processed_food',
        label: 'How often do you eat processed / junk food?',
        icon: <Utensils className="w-5 h-5" />,
        options: ['Never', 'Rarely', '1-2x/week', '3-5x/week', 'Daily']
    },
    {
        id: 'water_intake',
        label: 'How many liters of water do you drink daily?',
        icon: <Droplets className="w-5 h-5" />,
        options: ['<1L', '1-1.5L', '1.5-2L', '2-2.5L', '>2.5L']
    },
    {
        id: 'sleep_hours',
        label: 'How many hours do you sleep per night?',
        icon: <Moon className="w-5 h-5" />,
        options: ['<5', '5-6', '6-7', '7-8', '>8']
    },
    {
        id: 'stress_level',
        label: 'How would you rate your stress level?',
        icon: <Activity className="w-5 h-5" />,
        options: ['Very Low', 'Low', 'Moderate', 'High', 'Very High']
    },
    {
        id: 'exercise_frequency',
        label: 'How often do you exercise per week?',
        icon: <Activity className="w-5 h-5" />,
        options: ['Never', '1-2x', '3-4x', '5-6x', 'Daily']
    },
    {
        id: 'fruit_veg_intake',
        label: 'How many servings of fruits & vegetables per day?',
        icon: <Salad className="w-5 h-5" />,
        options: ['0', '1-2', '3-4', '5+']
    },
    {
        id: 'omega3_intake',
        label: 'Do you consume omega-3 rich foods (fish, nuts, seeds)?',
        icon: <Utensils className="w-5 h-5" />,
        options: ['Never', 'Rarely', 'Sometimes', 'Regularly']
    },
    {
        id: 'alcohol_consumption',
        label: 'How often do you consume alcohol?',
        icon: <Utensils className="w-5 h-5" />,
        options: ['Never', 'Rarely', 'Occasionally', 'Weekly', 'Daily']
    },
    {
        id: 'smoking_status',
        label: 'What is your smoking status?',
        icon: <Activity className="w-5 h-5" />,
        options: ['Non-smoker', 'Ex-smoker', 'Light smoker', 'Heavy smoker']
    },
    {
        id: 'specific_food_item',
        label: 'Which food type do you eat most?',
        icon: <Utensils className="w-5 h-5" />,
        options: ['Fast Food', 'Home Cooked', 'Vegetarian', 'Vegan', 'Mixed']
    }
];

const DietCheck = () => {
    const navigate = useNavigate();
    const { getAuthHeader } = useAuth();
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const allAnswered = QUESTIONS.every(q => answers[q.id]);

    const handleSubmit = async () => {
        if (!allAnswered) { setError('Please answer all questions before submitting.'); return; }
        setLoading(true); setError('');
        try {
            const res = await axios.post(
                `${BASE_URL}/diet/predict`,
                answers,
                { headers: { ...getAuthHeader(), 'Content-Type': 'application/json' } }
            );
            navigate('/diet-results', { state: { result: res.data, answers } });
        } catch (err) {
            setError(err.response?.data?.detail || 'Analysis failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const answeredCount = Object.keys(answers).length;

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            {/* Header */}
            <div className="text-center space-y-2">
                <div className="w-14 h-14 bg-amber-500 text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-amber-200">
                    <Salad className="w-7 h-7" />
                </div>
                <h1 className="text-3xl font-extrabold text-slate-900">Diet Risk Check</h1>
                <p className="text-slate-500">Answer {QUESTIONS.length} quick questions about your lifestyle to get your acne risk score.</p>
                {/* Progress */}
                <div className="mt-4">
                    <div className="flex items-center justify-between text-sm text-slate-500 mb-1.5">
                        <span>{answeredCount} of {QUESTIONS.length} answered</span>
                        <span>{Math.round((answeredCount / QUESTIONS.length) * 100)}%</span>
                    </div>
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-amber-500 rounded-full transition-all duration-500"
                            style={{ width: `${(answeredCount / QUESTIONS.length) * 100}%` }}
                        />
                    </div>
                </div>
            </div>

            {error && (
                <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-700 text-sm px-4 py-3 rounded-xl">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" /> {error}
                </div>
            )}

            {/* Questions */}
            <div className="space-y-6">
                {QUESTIONS.map((q, idx) => (
                    <div key={q.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-3">
                        <div className="flex items-start gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${answers[q.id] ? 'bg-amber-500 text-white' : 'bg-amber-50 text-amber-600'}`}>
                                {answers[q.id] ? <CheckCircle2 className="w-4 h-4" /> : q.icon}
                            </div>
                            <p className="font-semibold text-slate-800 text-sm leading-snug">{idx + 1}. {q.label}</p>
                        </div>
                        <div className="flex flex-wrap gap-2 pl-11">
                            {q.options.map(opt => (
                                <button
                                    key={opt}
                                    onClick={() => setAnswers(a => ({ ...a, [q.id]: opt }))}
                                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${answers[q.id] === opt
                                            ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-amber-300 hover:text-amber-700'
                                        }`}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Submit */}
            <div className="pb-8">
                <button
                    onClick={handleSubmit}
                    disabled={loading || !allAnswered}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-amber-500 text-white rounded-2xl font-bold text-sm hover:bg-amber-400 transition-all shadow-lg shadow-amber-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99]"
                >
                    {loading ? (
                        <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing your diet…</>
                    ) : (
                        <> <Salad className="w-5 h-5" /> Get My Risk Score <ArrowRight className="w-4 h-4" /></>
                    )}
                </button>
            </div>
        </div>
    );
};

export default DietCheck;
