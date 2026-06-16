import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/fitora-logo.png';
import { Eye, EyeOff, Mail, Lock, ShieldCheck } from 'lucide-react';
import { setUserData } from '../../utils/auth';

// ===================== MOCK USERS =====================
const MOCK_USERS = [
    { id: 'u1', email: 'admin@coachini.dz', password: 'admin123', role: 'ADMIN', fullName: 'مسؤول النظام' },
];
// =====================================================

const AdminLogin = () => {
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
            if (user.role !== 'ADMIN') {
                setError('هذه المنطقة مخصصة للمسؤولين فقط');
                setLoading(false);
                return;
            }
            setUserData(user);
            navigate('/admin', { replace: true });
        }, 600);
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-white" dir="rtl">
            <header className="bg-black/80 backdrop-blur-md border-b border-amber-900/20 sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <button onClick={() => navigate('/')} className="flex items-center gap-3 shrink-0">
                        <img src={logo} alt="fitora Logo" className="w-9 h-9 object-contain" />
                        <h1 className="text-xl font-semibold tracking-wide text-white">Fitora Admin</h1>
                    </button>
                </div>
            </header>

            <div className="container mx-auto px-4 py-16">
                <div className="max-w-md mx-auto">
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-4">
                            <div className="bg-gradient-to-r from-amber-500 to-yellow-600 p-4 rounded-2xl shadow-lg shadow-amber-500/30">
                                <ShieldCheck className="w-12 h-12 text-white" />
                            </div>
                        </div>
                        <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                            تسجيل دخول المسؤول
                        </h2>
                        <p className="text-gray-400 text-lg">الوصول إلى لوحة التحكم الإدارية</p>
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
                                        onChange={handleChange} placeholder="admin@coachini.dz"
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
                                {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول كمسؤول'}
                            </button>
                        </div>
                    </div>

                    <div className="mt-6 text-center">
                        <p className="text-gray-500 text-sm">صفحة محمية - للمسؤولين فقط</p>
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

export default AdminLogin;