import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { Mail, Lock, ArrowRight, Loader2, User as UserIcon, Phone, Sparkles, TrendingUp, Wallet, Globe } from 'lucide-react';
import { Logo } from '@/components/layout/Logo';

export default function Login() {
    const { user } = useAuth();
    const { theme } = useTheme();
    const navigate = useNavigate();
    const { state } = useLocation();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [experience, setExperience] = useState('BEGINNER');
    const [capital, setCapital] = useState('100000');
    const [referralSource, setReferralSource] = useState('GOOGLE');
    const [isSignUp, setIsSignUp] = useState(state?.defaultSignUp || false);
    const [isSignUpComplete, setIsSignUpComplete] = useState(false);

    useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    if (user) return null;

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isSignUp) {
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: fullName,
                            phone_number: phone,
                            experience: experience,
                            initial_capital: parseFloat(capital) || 0,
                            referral_source: referralSource
                        }
                    }
                });
                if (error) throw error;

                if (data.user) {
                    // Manually trigger custom email via Edge Function to bypass Supabase limits & redirect issues
                    // Note: Supabase will still send its default email if not disabled, but this ensures a reliable custom one.
                    await supabase.functions.invoke('auth-mailer', {
                        body: {
                            email,
                            full_name: fullName,
                            confirmation_url: `https://tradeadhyayan.vercel.app/login?type=signup&email=${email}`
                        }
                    });

                    if (data.session) {
                        navigate('/dashboard');
                    } else {
                        setIsSignUpComplete(true);
                    }
                }
            } else {
                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });

                if (error) {
                    if (error.message.includes('Email not confirmed')) {
                        throw new Error('Please confirm your email address before logging in. Check your inbox (and spam folder) for the verification link.');
                    }
                    throw error;
                }

                if (data.session) {
                    navigate('/dashboard');
                }
            }
        } catch (error: any) {
            console.error('Auth Error:', error);
            alert(error.message || 'An unexpected error occurred during authentication.');
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-8 font-body">
            {/* Soft Ambient Background */}
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-indigo-500/5 blur-[120px] rounded-full -z-10" />

            <div className="w-full max-w-md bg-white p-12 rounded-[3.5rem] border border-slate-200 shadow-2xl shadow-indigo-500/5 relative overflow-hidden">
                {isSignUpComplete ? (
                    <div className="text-center py-10 space-y-8 animate-in zoom-in duration-500">
                        <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                            <Mail size={40} className="animate-bounce" />
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Check Your Inbox</h2>
                        <p className="text-slate-500 font-bold leading-relaxed text-sm">
                            We've sent a verification link to <span className="text-indigo-600 underline decoration-indigo-200 underline-offset-4">{email}</span>. Please click the link to activate your professional terminal access.
                        </p>
                        <div className="space-y-4 pt-4">
                            <button
                                onClick={() => window.open('https://mail.google.com', '_blank')}
                                className="w-full py-5 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-slate-900 transition-all shadow-xl shadow-indigo-500/10 flex items-center justify-center gap-3"
                            >
                                Open Gmail <ArrowRight size={18} />
                            </button>
                            <button
                                onClick={() => setIsSignUpComplete(false)}
                                className="text-[10px] font-bold uppercase  text-slate-400 hover:text-indigo-600 transition-colors"
                            >
                                Back to Login
                            </button>
                        </div>
                        <div className="p-6 bg-slate-50 border border-slate-100 rounded-3xl text-left">
                            <p className="text-[10px] font-bold text-slate-400 uppercase  mb-2 flex items-center gap-2">
                                <Sparkles size={12} className="text-amber-500" /> Pro Tip
                            </p>
                            <p className="text-[10px] font-bold text-slate-500 leading-normal">
                                If you don't see it within 2 minutes, check your **Spam** folder or ensures your email is typed correctly.
                            </p>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="text-center mb-12">
                            <div className="inline-flex items-center justify-center mb-10 transform hover:scale-110 transition-transform cursor-pointer" onClick={() => navigate('/')}>
                                <Logo className="scale-125" iconOnly />
                            </div>
                            <h1 className="text-4xl font-bold tracking-tight mb-3 text-slate-900 leading-none">
                                {isSignUp ? 'Create Account' : 'Welcome Back'}
                            </h1>
                            <p className="text-slate-400 text-xs font-bold tracking-wider uppercase">
                                {isSignUp ? 'Empower your trading journey' : 'Access your professional journal'}
                            </p>
                        </div>

                        <form onSubmit={handleAuth} className="space-y-6">
                            <div className="space-y-4">
                                {isSignUp && (
                                    <>
                                        <InputWrapper icon={<UserIcon size={18} />}>
                                            <input
                                                type="text"
                                                required
                                                placeholder="Full Name"
                                                className="login-input"
                                                value={fullName}
                                                onChange={(e) => setFullName(e.target.value)}
                                            />
                                        </InputWrapper>
                                        <InputWrapper icon={<Phone size={18} />}>
                                            <input
                                                type="tel"
                                                required
                                                placeholder="Phone Number"
                                                className="login-input"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                            />
                                        </InputWrapper>
                                        <InputWrapper icon={<TrendingUp size={18} />}>
                                            <select
                                                value={experience}
                                                onChange={(e) => setExperience(e.target.value)}
                                                className="login-input appearance-none"
                                            >
                                                <option value="BEGINNER">Beginner (0-1 Years)</option>
                                                <option value="INTERMEDIATE">Intermediate (1-3 Years)</option>
                                                <option value="ADVANCED">Advanced (3+ Years)</option>
                                            </select>
                                        </InputWrapper>
                                    </>
                                )}
                                <InputWrapper icon={<Mail size={18} />}>
                                    <input
                                        type="email"
                                        required
                                        placeholder="Email Address"
                                        className="login-input"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </InputWrapper>
                                <InputWrapper icon={<Lock size={18} />}>
                                    <input
                                        type="password"
                                        required
                                        placeholder="Account Password"
                                        className="login-input"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </InputWrapper>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-5 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-slate-900 transition-all shadow-xl shadow-indigo-500/10 flex items-center justify-center gap-3"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isSignUp ? 'Register Account' : 'Dashboard Access')}
                                {!loading && <ArrowRight size={18} />}
                            </button>
                        </form>

                        <div className="mt-10 text-center space-y-6">
                            <button
                                type="button"
                                onClick={() => setIsSignUp(!isSignUp)}
                                className="text-xs font-bold text-slate-400 hover:text-indigo-600 transition-all uppercase "
                            >
                                {isSignUp ? 'Already have an account? Login' : 'New to Trade Adhyayan? Sign Up'}
                            </button>

                            <div className="flex items-center gap-4 py-2">
                                <div className="h-[1px] flex-1 bg-slate-100" />
                                <span className="text-[10px] font-bold text-slate-300 uppercase ">or</span>
                                <div className="h-[1px] flex-1 bg-slate-100" />
                            </div>

                            <button
                                type="button"
                                onClick={() => navigate('/dashboard')}
                                className="w-full py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] font-bold uppercase  text-slate-500 hover:bg-slate-100 transition-all"
                            >
                                Demo Portal Access
                            </button>
                        </div>
                    </>
                )}
            </div>

            <p className="mt-10 text-[10px] text-slate-400 font-bold tracking-[0.4em] uppercase">
                Indian Market Infrastructure
            </p>

            <style>{`
                .login-input {
                    width: 100%;
                    background: transparent;
                    border: none;
                    padding: 1.25rem 1.25rem 1.25rem 3.5rem;
                    font-size: 0.875rem;
                    font-weight: 600;
                    color: #0f172a;
                    outline: none;
                }
                .login-input::placeholder {
                    color: #94a3b8;
                }
            `}</style>
        </div>
    );
}

function InputWrapper({ icon, children }: any) {
    return (
        <div className="relative group bg-slate-50 border border-slate-100 rounded-2xl focus-within:border-indigo-500 transition-all">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                {icon}
            </div>
            {children}
        </div>
    );
}
