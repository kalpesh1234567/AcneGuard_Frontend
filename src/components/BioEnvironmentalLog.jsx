import React from 'react';
import {
    Utensils, Droplets, Sun, Wind, Activity,
    ThermometerSun, Waves, Dna, FlaskConical, MapPin
} from 'lucide-react';

const BioEnvironmentalLog = ({ data, onChange }) => {

    const handleChange = (section, field, value) => {
        onChange({
            ...data,
            [field]: value
        });
    };

    // Helper for specific nested updates if needed, but flat structure is easier for now
    const updateField = (field, value) => {
        onChange({ ...data, [field]: value });
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* 1. Dietary Matrix */}
            <section className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Utensils className="w-5 h-5 text-teal-600" /> Dietary Matrix
                </h3>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm grid md:grid-cols-2 gap-6">

                    {/* Sugar Intake */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-slate-700 flex justify-between">
                            Daily Sugar Intake
                            <span className="text-teal-600 font-bold">{data.sugarIntake || 0}g</span>
                        </label>
                        <input
                            type="range" min="0" max="100" step="5"
                            value={data.sugarIntake || 0}
                            onChange={(e) => updateField('sugarIntake', parseInt(e.target.value))}
                            className="w-full h-2 bg-slate-200 rounded-lg accent-teal-600 cursor-pointer"
                        />
                        <div className="flex justify-between text-xs text-slate-400">
                            <span>0g</span>
                            <span>50g (Avg)</span>
                            <span>100g+</span>
                        </div>
                    </div>

                    {/* Processed Food */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-slate-700">Processed Food Frequency</label>
                        <div className="grid grid-cols-4 gap-2">
                            {['0', '1-2', '3-5', '7+'].map((opt) => (
                                <button
                                    key={opt}
                                    onClick={() => updateField('processedFood', opt)}
                                    className={`py-2 text-sm rounded-lg border transition-all ${data.processedFood === opt
                                        ? 'bg-teal-50 border-teal-500 text-teal-700 font-bold'
                                        : 'bg-white border-slate-200 text-slate-600 hover:border-teal-300'
                                        }`}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                        <p className="text-xs text-slate-400 text-right">Times per week</p>
                    </div>

                    {/* Hydration */}
                    <div className="col-span-full space-y-3">
                        <label className="text-sm font-medium text-slate-700 flex justify-between">
                            <span className="flex items-center gap-2"><Droplets className="w-4 h-4 text-sky-500" /> Daily Hydration</span>
                            <span className="text-sky-600 font-bold">{data.water || 0} L</span>
                        </label>
                        <input
                            type="range" min="0.5" max="5.0" step="0.1"
                            value={data.water || 2.0}
                            onChange={(e) => updateField('water', parseFloat(e.target.value))}
                            className="w-full h-2 bg-slate-200 rounded-lg accent-sky-500 cursor-pointer"
                        />
                    </div>
                </div>
            </section>

            {/* 2. Environmental & Climate */}
            <section className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Sun className="w-5 h-5 text-amber-500" /> Environmental Factor
                </h3>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Climate */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Location / Climate</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <select
                                    value={data.climate || 'Humid'}
                                    onChange={(e) => updateField('climate', e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                                >
                                    <option value="Arid">Arid / Dry</option>
                                    <option value="Humid">Humid</option>
                                    <option value="Tropical">Tropical</option>
                                    <option value="Cold">Cold / Dry</option>
                                </select>
                            </div>
                        </div>

                        {/* Water pH */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Water pH Level (1-14)</label>
                            <div className="relative">
                                <Waves className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="number" min="1" max="14" step="0.1"
                                    value={data.waterPh || 7.0}
                                    onChange={(e) => updateField('waterPh', parseFloat(e.target.value))}
                                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Sunlight & Pollution */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-slate-700 flex justify-between">
                                Sunlight Exposure
                                <span className="text-amber-500 font-bold">{data.sunlight || 0} mins</span>
                            </label>
                            <input
                                type="range" min="0" max="300" step="15"
                                value={data.sunlight || 30}
                                onChange={(e) => updateField('sunlight', parseInt(e.target.value))}
                                className="w-full h-2 bg-slate-200 rounded-lg accent-amber-500 cursor-pointer"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-medium text-slate-700 flex justify-between">
                                Outdoor vs Indoor
                                <span className="text-teal-600 font-bold">{data.outdoorRatio || 20}% Out</span>
                            </label>
                            <input
                                type="range" min="0" max="100" step="10"
                                value={data.outdoorRatio || 20}
                                onChange={(e) => updateField('outdoorRatio', parseInt(e.target.value))}
                                className="w-full h-2 bg-slate-200 rounded-lg accent-teal-600 cursor-pointer"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-medium text-slate-700">Pollution Level</label>
                            <div className="flex gap-2">
                                {['Low', 'Moderate', 'High'].map((level) => (
                                    <button
                                        key={level}
                                        onClick={() => updateField('pollution', level)}
                                        className={`flex-1 py-1 text-xs rounded-lg border transition-all ${data.pollution === level
                                            ? 'bg-slate-800 text-white border-slate-800'
                                            : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                                            }`}
                                    >
                                        {level}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Polluted Places Toggle */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                        <span className="text-sm text-slate-600">Do you work/live in a high-dust area?</span>
                        <button
                            onClick={() => updateField('pollutedPlaces', !data.pollutedPlaces)}
                            className={`w-12 h-6 rounded-full transition-colors relative ${data.pollutedPlaces ? 'bg-teal-600' : 'bg-slate-200'}`}
                        >
                            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${data.pollutedPlaces ? 'left-7' : 'left-1'}`} />
                        </button>
                    </div>

                </div>
            </section>

            {/* 3. Health & Genetics */}
            <section className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-rose-500" /> Health & Genetics
                </h3>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">

                    {/* Genetic Hierarchy */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                            <Dna className="w-4 h-4 text-slate-400" /> Family History (Genetics)
                        </label>
                        <div className="flex flex-wrap gap-3">
                            {['Acne', 'Rosacea', 'Eczema', 'None'].map((cond) => (
                                <button
                                    key={cond}
                                    onClick={() => {
                                        const current = data.familyHistory || [];
                                        const exists = current.includes(cond);
                                        const split = exists ? current.filter(c => c !== cond) : [...current, cond];
                                        updateField('familyHistory', split);
                                    }}
                                    className={`px-4 py-1.5 text-sm rounded-full border transition-all ${(data.familyHistory || []).includes(cond)
                                        ? 'bg-rose-50 border-rose-200 text-rose-700 font-medium'
                                        : 'bg-white border-slate-200 text-slate-500 hover:border-rose-200'
                                        }`}
                                >
                                    {cond}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Systemic Issues Toggle */}
                    <div className="grid sm:grid-cols-2 gap-4">
                        {[
                            { id: 'diabetes', label: 'Diabetes (HbA1c Concerns)' },
                            { id: 'acidity', label: 'Acidity / GERD' },
                            { id: 'hormonal', label: 'Hormonal Imbalance' },
                            { id: 'stress', label: 'High Stress Environment' }
                        ].map((item) => (
                            <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                                <span className="text-sm text-slate-700">{item.label}</span>
                                <button
                                    onClick={() => updateField(item.id, !data[item.id])}
                                    className={`w-10 h-5 rounded-full transition-colors relative ${data[item.id] ? 'bg-rose-500' : 'bg-slate-300'}`}
                                >
                                    <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-transform ${data[item.id] ? 'left-6' : 'left-1'}`} />
                                </button>
                            </div>
                        ))}
                    </div>

                </div>
            </section>

            {/* 4. Cosmetic Audit */}
            <section className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <FlaskConical className="w-5 h-5 text-indigo-500" /> Cosmetic Audit
                </h3>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <textarea
                        placeholder="List your current products (e.g., CeraVe Cleanser, Retinol 1%...)"
                        value={data.cosmetics || ''}
                        onChange={(e) => updateField('cosmetics', e.target.value)}
                        className="w-full h-24 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none text-sm placeholder:text-slate-400"
                    />
                </div>
            </section>

        </div>
    );
};

export default BioEnvironmentalLog;
