import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../config';
import { ShieldCheck, Eye, EyeOff, Loader2, AlertTriangle, CheckCircle2 } from 'lucide-react';

const ResetPassword = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token') || '';

    const [form, setForm] = useState({ password: '', confirm: '' });
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.password) { setError('Please enter a new password.'); return; }
        if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
        if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
        setLoading(true); setError('');
        try {
            await axios.post(`${BASE_URL}/auth/reset-password`, { token, new_password: form.password });
            setSuccess(true);
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.response?.data?.detail || 'Reset failed. The link may have expired.');
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
                    <h1 className="text-3xl font-extrabold text-slate-900">Set a new password</h1>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-5">
                    {success ? (
                        <div className="text-center py-4 space-y-3">
                            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                            <p className="font-semibold text-slate-800">Password changed!</p>
                            <p className="text-sm text-slate-500">Redirecting you to sign in…</p>
                        </div>
                    ) : (
                        <>
                            {error && (
                                <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-700 text-sm px-4 py-3 rounded-xl">
                                    <AlertTriangle className="w-4 h-4 flex-shrink-0" /> {error}
                                </div>
                            )}
                            {!token && (
                                <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-sm px-4 py-3 rounded-xl">
                                    <AlertTriangle className="w-4 h-4 flex-shrink-0" /> Invalid or missing reset token.
                                </div>
                            )}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">New Password</label>
                                    <div className="relative">
                                        <input type={showPw ? 'text' : 'password'} value={form.password}
                                            onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="••••••••"
                                            className="w-full px-4 py-3 pr-12 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                                        />
                                        <button type="button" onClick={() => setShowPw(v => !v)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition">
                                            {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Confirm Password</label>
                                    <input type="password" value={form.confirm}
                                        onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))} placeholder="••••••••"
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                                    />
                                </div>
                                <button type="submit" disabled={loading || !token}
                                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-teal-600 text-white rounded-xl font-bold text-sm hover:bg-teal-500 transition-all shadow-sm disabled:opacity-60">
                                    {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</> : 'Reset Password'}
                                </button>
                            </form>
                            <p className="text-center text-sm text-slate-500">
                                <Link to="/login" className="text-teal-600 font-bold hover:underline">Back to Sign In</Link>
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
