import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/fitora-logo.png';
import { BookOpen, CheckCircle, LogOut } from 'lucide-react';
import { clearUserData } from '../../utils/auth';

const Logout = () => {
    const [isLoggingOut, setIsLoggingOut] = useState(true);
    const [loggedOut, setLoggedOut]       = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            clearUserData();
            setIsLoggingOut(false);
            setLoggedOut(true);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    const features = [
        { Icon: BookOpen,    label: 'دورات متنوعة' },
        { Icon: CheckCircle, label: 'نتائج مضمونة' },
        { Icon: LogOut,      label: 'تجربة سهلة'   },
    ];

    return (
        <div className="min-h-screen bg-zinc-950 text-white" dir="rtl">
            <header className="bg-black/80 backdrop-blur-md border-b border-amber-900/20 sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4 flex items-center justify-center">
                    <a href="/" className="flex items-center gap-3 shrink-0">
                        <img src={logo} alt="FITORA Logo" className="w-9 h-9 object-contain" />
                        <h1 className="text-xl font-semibold tracking-wide text-white">FITORA</h1>
                    </a>
                </div>
            </header>

            <div className="container mx-auto px-4 py-16">
                <div className="max-w-md mx-auto">
                    {isLoggingOut ? (
                        <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-3xl p-12 border border-gray-800 shadow-2xl text-center">
                            <div className="mb-8">
                                <div className="relative w-24 h-24 mx-auto">
                                    <div className="absolute inset-0 bg-amber-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
                                    <div className="relative w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-full flex items-center justify-center border-4 border-amber-500/30">
                                        <LogOut className="w-12 h-12 text-amber-500 animate-pulse" />
                                    </div>
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold mb-3 bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                                جاري تسجيل الخروج...
                            </h2>
                            <p className="text-gray-400">نأمل أن نراك قريباً</p>
                            <div className="mt-8 flex justify-center">
                                <div className="w-12 h-12 border-4 border-gray-700 border-t-amber-500 rounded-full animate-spin"></div>
                            </div>
                        </div>
                    ) : loggedOut ? (
                        <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-3xl p-12 border border-gray-800 shadow-2xl text-center">
                            <div className="mb-8">
                                <div className="relative w-24 h-24 mx-auto">
                                    <div className="absolute inset-0 bg-green-500 rounded-full blur-xl opacity-30"></div>
                                    <div className="relative w-full h-full bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                                        <CheckCircle className="w-12 h-12 text-white" />
                                    </div>
                                </div>
                            </div>
                            <h2 className="text-3xl font-bold mb-3 text-white">تم تسجيل الخروج بنجاح</h2>
                            <p className="text-gray-400 mb-8">شكراً لزيارتك، نتطلع لرؤيتك مرة أخرى</p>
                            <div className="space-y-4">
                                <button onClick={() => navigate('/', { replace: true })}
                                    className="block w-full bg-gradient-to-r from-amber-500 to-yellow-600 text-white py-4 rounded-xl font-bold hover:from-amber-600 hover:to-yellow-700 transition-all transform hover:scale-105 shadow-lg shadow-amber-500/20">
                                    العودة إلى الصفحة الرئيسية
                                </button>
                                <button onClick={() => navigate('/login', { replace: true })}
                                    className="block w-full bg-zinc-800 border border-gray-700 text-white py-4 rounded-xl font-bold hover:border-amber-500 transition-all">
                                    تسجيل الدخول مرة أخرى
                                </button>
                            </div>
                            <div className="mt-8 pt-8 border-t border-gray-700">
                                <p className="text-sm text-gray-400 mb-4">استكشف المزيد</p>
                                <div className="flex flex-wrap justify-center gap-4">
                                    <a href="/sessions" className="text-sm text-amber-500 hover:text-amber-400 transition-colors">الجلسات</a>
                                    <span className="text-gray-700">|</span>
                                    <a href="/courses"  className="text-sm text-amber-500 hover:text-amber-400 transition-colors">الدورات</a>
                                    <span className="text-gray-700">|</span>
                                    <a href="/coaches"  className="text-sm text-amber-500 hover:text-amber-400 transition-colors">الكوتشات</a>
                                    <span className="text-gray-700">|</span>
                                    <a href="/programs" className="text-sm text-amber-500 hover:text-amber-400 transition-colors">البرامج</a>
                                </div>
                            </div>
                        </div>
                    ) : null}

                    {loggedOut && (
                        <div className="mt-12 grid grid-cols-3 gap-4">
                            {features.map(({ Icon, label }, i) => {
                                const FeatureIcon = Icon;
                                return (
                                    <div key={i} className="bg-zinc-900 rounded-2xl p-4 border border-gray-800 text-center">
                                        <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                                            <FeatureIcon className="w-6 h-6 text-amber-500" />
                                        </div>
                                        <p className="text-xs text-gray-400">{label}</p>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-20 right-20 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 left-20 w-96 h-96 bg-yellow-600/5 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/5 rounded-full blur-3xl"></div>
            </div>
        </div>
    );
};

export default Logout;