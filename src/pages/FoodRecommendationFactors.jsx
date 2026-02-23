import React from 'react';
import { ArrowRight, Utensils, Apple, Droplets } from 'lucide-react';
import { Link } from 'react-router-dom';

const FoodRecommendationFactors = () => {
    return (
        <div className="space-y-12 animate-in fade-in duration-700">

            <section className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                    <Utensils className="w-4 h-4" /> Metabolic Inputs
                </div>
                <h1 className="text-4xl font-bold text-slate-900">Nutritional Logic</h1>
                <p className="text-slate-600 max-w-2xl mx-auto">
                    Your gut health directly reflects on your skin. We track these key metabolic drivers.
                </p>
            </section>

            <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-rose-50 p-6 rounded-2xl border border-rose-100">
                    <h3 className="text-lg font-bold text-rose-800 mb-2">Glycemic Impact</h3>
                    <p className="text-rose-600 text-sm">
                        High sugar intake (&gt;50g/day) triggers insulin spikes, leading to sebum overproduction and glycation (aging).
                    </p>
                </div>
                <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100">
                    <h3 className="text-lg font-bold text-amber-800 mb-2">Processed Foods</h3>
                    <p className="text-amber-600 text-sm">
                        Preservatives and trans-fats increase systemic inflammation, worsening cystic acne and redness.
                    </p>
                </div>
                <div className="bg-sky-50 p-6 rounded-2xl border border-sky-100">
                    <h3 className="text-lg font-bold text-sky-800 mb-2">Hydration Levels</h3>
                    <p className="text-sky-600 text-sm">
                        Water intake under 2L/day compromises the skin barrier, leading to oil overcompensation.
                    </p>
                </div>
            </div>

            <div className="flex justify-center">
                <Link to="/assessment" className="flex items-center gap-2 bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 transition">
                    Log Your Diet <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
};

export default FoodRecommendationFactors;
