import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
    ShieldCheck, History, ScanFace, Salad, Plus,
    ChevronDown, User, LogOut, X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navLinks = [
    { to: '/assessment', label: 'Skin Scan', icon: <ScanFace className="w-4 h-4" />, auth: true },
    { to: '/diet-check', label: 'Diet Check', icon: <Salad className="w-4 h-4" />, auth: true },
    { to: '/history', label: 'History', icon: <History className="w-4 h-4" />, auth: true },
];

const Layout = ({ children }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [actionOpen, setActionOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const actionRef = useRef(null);
    const profileRef = useRef(null);

    useEffect(() => {
        const handleClick = (e) => {
            if (actionRef.current && !actionRef.current.contains(e.target)) setActionOpen(false);
            if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const handleLogout = () => { logout(); navigate('/login'); };

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

                    {/* Brand */}
                    <Link to="/" className="flex items-center gap-2 text-teal-600 font-extrabold text-xl tracking-tight">
                        <ShieldCheck className="w-6 h-6" />
                        <span>AcneGuard<span className="text-slate-800">AI</span></span>
                    </Link>

                    {/* Nav Links */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.filter(l => !l.auth || user).map(({ to, label, icon }) => (
                            <Link
                                key={to}
                                to={to}
                                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition ${location.pathname === to
                                        ? 'bg-teal-50 text-teal-700'
                                        : 'text-slate-600 hover:text-teal-600 hover:bg-slate-100'
                                    }`}
                            >
                                {icon} {label}
                            </Link>
                        ))}
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-3">
                        {user ? (
                            <>
                                {/* New Action Dropdown */}
                                <div className="relative" ref={actionRef}>
                                    <button
                                        onClick={() => setActionOpen(o => !o)}
                                        className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-bold hover:bg-teal-500 transition shadow-sm"
                                    >
                                        <Plus className="w-4 h-4" /> New <ChevronDown className="w-3 h-3" />
                                    </button>
                                    {actionOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-50">
                                            <Link to="/assessment" onClick={() => setActionOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-teal-50 hover:text-teal-700 transition">
                                                <ScanFace className="w-4 h-4 text-teal-600" /> New Skin Scan
                                            </Link>
                                            <Link to="/diet-check" onClick={() => setActionOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-teal-50 hover:text-teal-700 transition">
                                                <Salad className="w-4 h-4 text-teal-600" /> New Diet Analysis
                                            </Link>
                                        </div>
                                    )}
                                </div>

                                {/* User Profile */}
                                <div className="relative" ref={profileRef}>
                                    <button onClick={() => setProfileOpen(o => !o)} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 hover:border-teal-300 transition text-sm">
                                        <div className="w-7 h-7 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold text-xs">
                                            {user.name?.[0]?.toUpperCase() || <User className="w-3.5 h-3.5" />}
                                        </div>
                                        <span className="hidden md:block font-medium text-slate-700 max-w-[90px] truncate">{user.name || 'Account'}</span>
                                        <ChevronDown className="w-3 h-3 text-slate-400" />
                                    </button>
                                    {profileOpen && (
                                        <div className="absolute right-0 mt-2 w-44 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-50">
                                            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-rose-600 hover:bg-rose-50 transition">
                                                <LogOut className="w-4 h-4" /> Sign Out
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link to="/login" className="text-sm font-medium text-slate-600 px-3 py-2 hover:text-teal-600 transition">Login</Link>
                                <Link to="/register" className="text-sm font-bold bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-500 transition">Get Started</Link>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            <main className="flex-grow pt-8 pb-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto w-full">
                    {children}
                </div>
            </main>

            <footer className="border-t border-slate-200 bg-white py-6 text-center text-sm text-slate-400">
                © {new Date().getFullYear()} AcneGuard AI — Powered by Computer Vision &amp; ML
            </footer>
        </div>
    );
};

export default Layout;
