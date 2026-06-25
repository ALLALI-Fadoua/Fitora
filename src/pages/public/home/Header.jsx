import { Search, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logo from '../../../assets/fitora-logo.png';

const Header = ({ onNavigate }) => {
    const navigate = useNavigate();

    return (
<header className="fixed top-0 left-0 right-0 z-50 bg-black/85 backdrop-blur-xl border-b border-[#2A2A30] px-6 h-[60px] flex items-center justify-between">            {/* Logo */}
            <div
                className="flex items-center gap-2 shrink-0 cursor-pointer"
                onClick={() => navigate('/')}
            >
                <img src={logo} alt="FITORA" className="h-9 w-auto object-contain" />
                <span className="font-black text-xl tracking-wide bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent hidden sm:block">
                    FITORA
                </span>
            </div>

            {/* Search */}
            <div className="hidden md:block flex-1 max-w-sm mx-6 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                <input
                    type="text"
                    placeholder= "ابحث عن مدرب رياضي، حصة تدريبية أو برنامج لياقة بدنية..."
                    className="w-full bg-[#18181B] border border-[#2A2A30] rounded-xl px-4 py-2 pr-4 pl-10 text-sm text-white placeholder-zinc-500 outline-none focus:border-emerald-500 focus:bg-[#1E1E22] transition"
                />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
                <button
                    onClick={() => navigate('/login')}
                    className="border border-[#383840] text-white rounded-xl px-5 py-[7px] text-sm font-medium hover:border-emerald-500 hover:text-emerald-400 transition"
                >
                    تسجيل الدخول
                </button>
                <button
                    onClick={() => navigate('/signup')}
                    className="bg-emerald-500 text-black rounded-xl px-5 py-[7px] text-sm font-bold hover:bg-emerald-400 transition"
                >
                    ابدأ الآن
                </button>
                <button className="md:hidden p-2 rounded-lg hover:bg-white/10 transition">
                    <Menu className="w-5 h-5 text-white" />
                </button>
            </div>
        </header>
    );
};

export default Header;