import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { BASE_URL } from '../config';
import { ShieldCheck, Eye, EyeOff, Loader2, AlertTriangle, CheckCircle2 } from 'lucide-react';

const getStrength = (pw) => {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
};

const Register = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setForm(f => ({ ...f, [e.target.name]: e.target.value }));
        setError('');
    };

    const strength = getStrength(form.password);
    const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][strength];
    const strengthColor = ['', 'bg-rose-400', 'bg-amber-400', 'bg-yellow-400', 'bg-emerald-500'][strength];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name || !form.email || !form.password) { setError('Please fill in all fields.'); return; }
        if (strength < 2) { setError('Please use a stronger password.'); return; }
        setLoading(true);
        try {
            const res = await axios.post(`${BASE_URL}/auth/register`, form);
            login(res.data.access_token, res.data.user);
            navigate('/', { replace: true });
        } catch (err) {
            setError(err.response?.data?.detail || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center space-y-2">
                    <div className="w-14 h-14 bg-teal-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-teal-600/30">
                        <ShieldCheck className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-slate-900">
                        Create your <span className="text-teal-600">AcneGuard</span> account
                    </h1>
                    <p className="text-slate-500 text-sm">Free forever. No credit card required.</p>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-5">
                    {error && (
                        <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-700 text-sm px-4 py-3 rounded-xl">
                            <AlertTriangle className="w-4 h-4 flex-shrink-0" /> {error}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
                            <input type="text" name="name" autoComplete="name" value={form.name} onChange={handleChange}
                                placeholder="Your full name"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email address</label>
                            <input type="email" name="email" autoComplete="email" value={form.email} onChange={handleChange}
                                placeholder="you@example.com"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
                            <div className="relative">
                                <input type={showPw ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange}
                                    placeholder="Choose a strong password"
                                    className="w-full px-4 py-3 pr-12 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                                />
                                <button type="button" onClick={() => setShowPw(v => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition">
                                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {form.password && (
                                <div className="mt-2 space-y-1">
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4].map(i => (
                                            <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= strength ? strengthColor : 'bg-slate-200'}`} />
                                        ))}
                                    </div>
                                    <p className="text-xs text-slate-500">{strengthLabel} password</p>
                                </div>
                            )}
                        </div>
                        <button type="submit" disabled={loading}
                            className="w-full flex items-center justify-center gap-2 py-3.5 bg-teal-600 text-white rounded-xl font-bold text-sm hover:bg-teal-500 transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99]">
                            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating account…</> : 'Create Account'}
                        </button>
                    </form>
                    <div className="h-px bg-slate-100" />
                    <p className="text-center text-sm text-slate-500">
                        Already have an account?{' '}
                        <Link to="/login" className="text-teal-600 font-bold hover:underline">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
