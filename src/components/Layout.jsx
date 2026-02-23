import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Activity } from 'lucide-react';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col">
            <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 text-teal-600 font-bold text-xl">
                        <Sparkles className="w-6 h-6" />
                        <span>SkinLogic</span>
                    </Link>
                    <div className="flex gap-4">
                        <Link to="/assessment" className="text-sm font-medium hover:text-teal-600 transition">
                            New Assessment
                        </Link>
                        <Link to="/history" className="text-sm font-medium hover:text-teal-600 transition">
                            History
                        </Link>
                    </div>
                </div>
            </nav>
            <main className="flex-grow pt-8 pb-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-[1400px] mx-auto w-full">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
