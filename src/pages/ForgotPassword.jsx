import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../config';
import { ShieldCheck, Loader2, AlertTriangle, CheckCircle2, Mail } from 'lucide-react';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) { setError('Please enter your email address.'); return; }
        setLoading(true); setError('');
        try {
            await axios.post(`${BASE_URL}/auth/forgot-password`, { email });
            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to send reset email. Try again.');
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
                    <h1 className="text-3xl font-extrabold text-slate-900">Forgot password?</h1>
                    <p className="text-slate-500 text-sm">Enter your email and we'll send you a reset link.</p>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-5">
                    {success ? (
                        <div className="text-center space-y-4 py-4">
                            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                            <p className="text-slate-700 font-semibold">Check your inbox!</p>
                            <p className="text-sm text-slate-500">We've sent a password reset link to <strong>{email}</strong>.</p>
                            <Link to="/login" className="inline-block text-teal-600 font-bold hover:underline text-sm">Back to Sign In</Link>
                        </div>
                    ) : (
                        <>
                            {error && (
                                <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-700 text-sm px-4 py-3 rounded-xl">
                                    <AlertTriangle className="w-4 h-4 flex-shrink-0" /> {error}
                                </div>
                            )}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                        <input type="email" value={email} onChange={e => { setEmail(e.target.value); setError(''); }}
                                            placeholder="you@example.com"
                                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                                        />
                                    </div>
                                </div>
                                <button type="submit" disabled={loading}
                                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-teal-600 text-white rounded-xl font-bold text-sm hover:bg-teal-500 transition-all shadow-sm disabled:opacity-60">
                                    {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</> : 'Send Reset Link'}
                                </button>
                            </form>
                            <p className="text-center text-sm text-slate-500">
                                Remember your password? <Link to="/login" className="text-teal-600 font-bold hover:underline">Sign in</Link>
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
