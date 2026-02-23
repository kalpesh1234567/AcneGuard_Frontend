import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { BASE_URL } from '../config';
import { ShieldCheck, Eye, EyeOff, Loader2, AlertTriangle } from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const from = location.state?.from?.pathname || '/';

    const [form, setForm] = useState({ email: '', password: '' });
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setForm(f => ({ ...f, [e.target.name]: e.target.value }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.email || !form.password) { setError('Please fill in all fields.'); return; }
        setLoading(true);
        try {
            const res = await axios.post(`${BASE_URL}/auth/login`, form);
            login(res.data.access_token, res.data.user);
            navigate(from, { replace: true });
        } catch (err) {
            setError(err.response?.data?.detail || 'Login failed. Please try again.');
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
                        Welcome back to <span className="text-teal-600">AcneGuard</span>
                    </h1>
                    <p className="text-slate-500 text-sm">Sign in to your account to continue</p>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-5">
                    {error && (
                        <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-700 text-sm px-4 py-3 rounded-xl">
                            <AlertTriangle className="w-4 h-4 flex-shrink-0" /> {error}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email address</label>
                            <input id="login-email" type="email" name="email" autoComplete="email"
                                value={form.email} onChange={handleChange} placeholder="you@example.com"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                            />
                        </div>
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="block text-sm font-semibold text-slate-700">Password</label>
                                <Link to="/forgot-password" className="text-xs text-teal-600 hover:underline font-medium">Forgot password?</Link>
                            </div>
                            <div className="relative">
                                <input id="login-password" type={showPw ? 'text' : 'password'} name="password"
                                    autoComplete="current-password" value={form.password} onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full px-4 py-3 pr-12 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                                />
                                <button type="button" onClick={() => setShowPw(v => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition">
                                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                        <button id="btn-login" type="submit" disabled={loading}
                            className="w-full flex items-center justify-center gap-2 py-3.5 bg-teal-600 text-white rounded-xl font-bold text-sm hover:bg-teal-500 transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99]">
                            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in…</> : 'Sign In'}
                        </button>
                    </form>
                    <div className="h-px bg-slate-100" />
                    <p className="text-center text-sm text-slate-500">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-teal-600 font-bold hover:underline">Create one free</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
