
import React, { useState } from 'react';
import { Menu, X, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AuthModule from './AuthModule';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
    const { user } = useAuth();

    const handleAuthClick = (mode) => {
        setAuthMode(mode);
        setIsAuthOpen(true);
        setIsMenuOpen(false);
    };

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 bg-[#111415]/95  backdrop-blur-sm border-b border-[#272927] z-40">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <div className="flex items-center">
                            <span className="text-2xl font-bold">🔮 MTG</span>
                        </div>

                        {/* Desktop Auth Buttons */}
                        {!user && (
                            <div className="hidden md:flex items-center gap-4">
                                <button
                                    onClick={() => handleAuthClick('login')}
                                    className="inline-flex items-center gap-2 px-4 py-2 hover:bg-slate-800 rounded-lg transition-colors"
                                >
                                    <LogIn className="w-5 h-5" />
                                    <span>Login/Register</span>
                                </button>
                            </div>
                        )}

                        {/* Mobile Menu Button */}
                        {!user && (
                            <div className="md:hidden">
                                <button
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    className="p-2 hover:bg-slate-800 rounded-lg"
                                >
                                    {isMenuOpen ? (
                                        <X className="w-6 h-6" />
                                    ) : (
                                        <Menu className="w-6 h-6" />
                                    )}
                                </button>
                            </div>
                        )}

                        {/* User Profile (when logged in) */}
                        {user && (
                            <div className="flex items-center">
                                <img
                                    src={user.photoURL || 'https://via.placeholder.com/32'}
                                    alt="Profile"
                                    className="w-8 h-8 rounded-full"
                                />
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu */}
                    {isMenuOpen && !user && (
                        <div className="md:hidden py-4 space-y-2">
                            <button
                                onClick={() => handleAuthClick('login')}
                                className="w-full inline-flex items-center gap-2 px-4 py-2 hover:bg-slate-800 rounded-lg transition-colors"
                            >
                                <LogIn className="w-5 h-5" />
                                <span>Login/Register</span>
                            </button>
                        </div>
                    )}
                </div>
            </nav>

            {/* Auth Module */}
            {isAuthOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black/50 z-40"
                        onClick={() => setIsAuthOpen(false)}
                    />
                    <AuthModule
                        onClose={() => setIsAuthOpen(false)}
                        defaultIsLogin={authMode === 'login'}
                    />
                </>
            )}
        </>
    );
};

export default Navbar;