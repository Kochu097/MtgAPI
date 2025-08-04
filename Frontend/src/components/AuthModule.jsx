import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, Mail, Lock, UserPlus, Chrome, LogOut, Upload, Menu, X } from 'lucide-react';

const AuthModule = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [avatar, setAvatar] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    const { login, register, loginWithGoogle, logout, user, uploadAvatar } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                await login(email, password);
            } else {
                await register(email, password);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await loginWithGoogle();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const url = await uploadAvatar(file);
                setAvatar(url);
            } catch (err) {
                setError(err.message);
            }
        }
    };

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };


    if (user) {
        return (
            <div className="fixed top-20 right-4 z-50">
                <div className="bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-700 w-80">

                    <div className="fixed top-4 right-4 flex items-center gap-4">
                    <div className="md:flex items-center gap-2 bg-slate-800 rounded-lg p-2 border border-slate-700">
                        {/* Mobile menu button */}
                        <button
                            onClick={toggleMenu}
                            className="md:hidden p-2 hover:bg-slate-700 rounded-lg transition-colors"
                        >
                            {isOpen ? (
                                <X className="w-5 h-5 text-slate-300" />
                            ) : (
                                <Menu className="w-5 h-5 text-slate-300" />
                            )}
                        </button>

                        {/* Content */}
                        <div className={`${isOpen ? 'flex' : 'hidden'} md:flex items-center gap-2`}>
                            <div className="relative">
                                <img
                                    src={user.photoURL || avatar || 'https://via.placeholder.com/40'}
                                    alt="Avatar"
                                    className="w-10 h-10 rounded-full"
                                />
                                <label className="absolute bottom-0 right-0 cursor-pointer">
                                    <Upload className="w-4 h-4 text-purple-400" />
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleAvatarUpload}
                                    />
                                </label>
                            </div>
                            <span >{user.email}</span>
                            <button
                                onClick={logout}
                                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                            >
                                <LogOut className="w-5 h-5 text-slate-300" />
                            </button>
                        </div>
                    </div>
                </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed top-4 right-4 z-50">
            {/* Mobile menu button */}
            <button
                onClick={toggleMenu}
                className="md:hidden mb-2 p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors float-right"
            >
                {isOpen ? (
                    <X className="w-5 h-5 text-slate-300" />
                ) : (
                    <Menu className="w-5 h-5 text-slate-300" />
                )}
            </button>

            {/* Auth form */}
            <div className={`${isOpen ? 'block' : 'hidden'} md:block clear-both`}>
                <div className="bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-700 w-80">
                    <h2 className="text-xl font-bold mb-4">
                        {isLogin ? 'Login' : 'Register'}
                    </h2>

                    {error && (
                        <div className="mb-4 p-2 bg-red-500/10 border border-red-500 rounded text-red-500 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-slate-700 rounded-lg border border-slate-600 focus:border-purple-500 focus:outline-none"
                                    placeholder="Email"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-slate-700 rounded-lg border border-slate-600 focus:border-purple-500 focus:outline-none"
                                    placeholder="Password"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                'Processing...'
                            ) : isLogin ? (
                                <>
                                    <LogIn className="w-5 h-5" />
                                    Login
                                </>
                            ) : (
                                <>
                                    <UserPlus className="w-5 h-5" />
                                    Register
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-4">
                        <button
                            onClick={handleGoogleLogin}
                            className="w-full px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors flex items-center justify-center gap-2"
                        >
                            <Chrome className="w-5 h-5" /> {/* Changed from Google to Chrome */}
                            Continue with Google
                        </button>
                    </div>

                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="w-full mt-4 text-sm text-slate-400 hover:transition-colors"
                    >
                        {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthModule;