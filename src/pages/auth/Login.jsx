import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/fitora-logo.png';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { setUserData } from '../../utils/auth';

// ===================== MOCK USERS =====================
const MOCK_USERS = [
    { id: 'u2', email: 'coach@coachini.dz',   password: 'coach123', role: 'COACH',   fullName: 'أحمد بن علي'  },
    { id: 'u3', email: 'learner@coachini.dz', password: 'learn123', role: 'LEARNER', fullName: 'سارة بوخالفة' },
];
// =====================================================

const Login = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError]       = useState('');
    const [loading, setLoading]   = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = () => {
        setError('');
        if (!formData.email || !formData.password) {
            setError('البريد الإلكتروني وكلمة المرور مطلوبان');
            return;
        }
        setLoading(true);
        setTimeout(() => {
            const user = MOCK_USERS.find(
                u => u.email === formData.email && u.password === formData.password
            );
            if (!user) {
                setError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
                setLoading(false);
                return;
            }
            setUserData(user);
            if (user.role === 'LEARNER')     navigate('/learner', { replace: true });
            else if (user.role === 'COACH')  navigate('/coach',   { replace: true });
            else if (user.role === 'ADMIN')  navigate('/admin',   { replace: true });
            else navigate('/');
        }, 600);
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-white" dir="rtl">
            <header className="bg-black/80 backdrop-blur-md border-b border-amber-900/20 sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <button onClick={() => navigate('/')} className="flex items-center gap-3 shrink-0">
                            <img src={logo} alt="Fitora Logo" className="w-9 h-9 object-contain" />
                            <h1 className="text-xl font-semibold tracking-wide text-white">FITORA</h1>
                        </button>
                        <button onClick={() => navigate('/signup')} className="text-gray-400 hover:text-amber-500 transition-colors">
                            ليس لديك حساب؟ <span className="text-amber-500 font-semibold">إنشاء حساب</span>
                        </button>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-16">
                <div className="max-w-md mx-auto">
                    <div className="text-center mb-8">
                        <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                            مرحباً بعودتك
                        </h2>
                        <p className="text-gray-400 text-lg">سجل الدخول للوصول إلى حسابك</p>
                    </div>


                    <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-3xl p-8 border border-gray-800 shadow-2xl">
                        {error && (
                            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm">
                                {error}
                            </div>
                        )}
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-gray-300">البريد الإلكتروني</label>
                                <div className="relative">
                                    <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input type="email" name="email" value={formData.email}
                                        onChange={handleChange} placeholder="example@email.com"
                                        className="w-full bg-zinc-800 border border-gray-700 rounded-xl py-3 pr-12 pl-4 focus:outline-none focus:border-amber-500 transition-colors" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-gray-300">كلمة المرور</label>
                                <div className="relative">
                                    <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password}
                                        onChange={handleChange} placeholder="أدخل كلمة المرور"
                                        className="w-full bg-zinc-800 border border-gray-700 rounded-xl py-3 pr-12 pl-12 focus:outline-none focus:border-amber-500 transition-colors" />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-amber-500 transition-colors">
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>
                            <button onClick={handleSubmit} disabled={loading}
                                className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 text-white py-4 rounded-xl font-bold hover:from-amber-600 hover:to-yellow-700 transition-all transform hover:scale-105 shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed">
                                {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
                            </button>
                        </div>
                    </div>

                    <div className="mt-6 text-center">
                        <button onClick={() => navigate('/signup')} className="text-gray-400 hover:text-amber-500 transition-colors">
                            ليس لديك حساب؟ <span className="text-amber-500 font-semibold">إنشاء حساب جديد</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-20 right-20 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 left-20 w-96 h-96 bg-yellow-600/5 rounded-full blur-3xl"></div>
            </div>
        </div>
    );
};

export default Login;