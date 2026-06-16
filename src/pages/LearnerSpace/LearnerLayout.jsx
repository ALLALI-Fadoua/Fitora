import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, CalendarCheck, Heart,
    CreditCard, Star, Bell, UserCircle2,
    LogOut, Menu, X, ChevronRight
} from 'lucide-react';
import logo from '../../assets/fitora-logo.png';
import LearnerDashboard     from './LearnerDashboard';
import LearnerBookings      from './LearnerBookings';
import LearnerFavorites     from './LearnerFavorites';
import LearnerPayments      from './LearnerPayments';
import LearnerReviews       from './LearnerReviews';
import LearnerProfile       from './LearnerProfile';
import LearnerNotifications from './LearnerNotifications';

const MENU = [
    { id: 'dashboard',     icon: LayoutDashboard, ar: 'الرئيسية',    en: 'Dashboard',     accent: 'from-amber-500 to-yellow-400' },
    { id: 'bookings',      icon: CalendarCheck,   ar: 'حجوزاتي',     en: 'My Bookings',   accent: 'from-sky-500 to-blue-400' },
    { id: 'payments',      icon: CreditCard,      ar: 'المدفوعات',   en: 'Payments',      accent: 'from-emerald-500 to-green-400' },
    { id: 'reviews',       icon: Star,            ar: 'تقييماتي',    en: 'Reviews',       accent: 'from-violet-500 to-purple-400' },
    { id: 'favorites',     icon: Heart,           ar: 'المفضلة',     en: 'Favorites',     accent: 'from-rose-500 to-pink-400' },
    { id: 'notifications', icon: Bell,            ar: 'الإشعارات',   en: 'Notifications', accent: 'from-orange-500 to-amber-400', badge: 3 },
    { id: 'profile',       icon: UserCircle2,     ar: 'ملفي الشخصي', en: 'Profile',       accent: 'from-zinc-400 to-zinc-300' },
];

const LearnerLayout = ({ onNavigate }) => {
    const [active,   setActive]   = useState('dashboard');
    const [sideOpen, setSideOpen] = useState(true);
    const navigate = useNavigate();

    const renderPage = () => {
        switch (active) {
            case 'dashboard':     return <LearnerDashboard     onNavigate={setActive} />;
            case 'bookings':      return <LearnerBookings       onNavigate={setActive} />;
            case 'payments':      return <LearnerPayments       onNavigate={setActive} />;
            case 'reviews':       return <LearnerReviews        onNavigate={setActive} />;
            case 'favorites':     return <LearnerFavorites      onNavigate={setActive} />;
            case 'notifications': return <LearnerNotifications  onNavigate={setActive} />;
            case 'profile':       return <LearnerProfile        onNavigate={setActive} />;
            default:              return <LearnerDashboard      onNavigate={setActive} />;
        }
    };

    const current = MENU.find(m => m.id === active);

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col"
             style={{ fontFamily: "'Cairo', 'Tajawal', sans-serif" }}
             dir="rtl">

            {/* ── HEADER ── */}
            <header className="sticky top-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/[0.06]">
                <div className="px-4 md:px-6 h-[60px] flex items-center justify-between gap-4">

                    {/* Logo + toggle */}
                    <div className="flex items-center gap-3">
                        <button onClick={() => setSideOpen(v => !v)}
                                className="p-2 rounded-lg hover:bg-white/[0.06] transition-colors">
                            {sideOpen
                                ? <X    className="w-5 h-5 text-zinc-400" />
                                : <Menu className="w-5 h-5 text-zinc-400" />}
                        </button>
                        <button onClick={() => onNavigate?.('home')}
                                className="flex items-center gap-2.5 group">
                            <img src={logo} alt="FITORA"
                                 className="h-9 w-auto object-contain" />
                            <div className="hidden sm:block leading-none">
                                <p className="text-[15px] font-black tracking-[0.15em]
                                              bg-gradient-to-r from-amber-400 to-orange-500
                                              bg-clip-text text-transparent">
                                    FITORA
                                </p>
                                <p className="text-[9px] font-bold tracking-widest text-amber-500 uppercase">
                                    Train Smarter. Live Stronger.
                                </p>
                            </div>
                        </button>
                    </div>

                    {/* Breadcrumb */}
                    <div className="hidden md:flex items-center gap-2 text-sm">
                        <span className="text-zinc-600 text-xs">Learner Space</span>
                        <ChevronRight className="w-3 h-3 text-zinc-700" />
                        <span className="text-white font-bold text-xs">{current?.ar}</span>
                        <span className="text-zinc-600 text-xs">· {current?.en}</span>
                    </div>

                    {/* Logout */}
                    <button onClick={() => navigate('/logout')}
                            className="flex items-center gap-2 text-zinc-500 hover:text-amber-400
                                       transition-colors text-xs font-semibold px-3 py-2 rounded-lg
                                       hover:bg-white/[0.04] border border-transparent
                                       hover:border-white/[0.08]">
                        <LogOut className="w-4 h-4" />
                        <span className="hidden md:inline">خروج · Logout</span>
                    </button>
                </div>
            </header>

            {/* ── BODY ── */}
            <div className="flex flex-1 overflow-hidden">

                {/* SIDEBAR */}
                <aside className={`
                    fixed lg:sticky top-[60px] right-0 z-40
                    h-[calc(100vh-60px)] overflow-y-auto
                    bg-[#0d0d0d] border-l border-white/[0.06]
                    transition-all duration-300 ease-in-out flex-shrink-0
                    ${sideOpen ? 'w-60' : 'w-0 lg:w-[68px]'}
                `}>
                    <nav className="p-2.5 space-y-0.5 pt-3">
                        {MENU.map(item => {
                            const isActive = active === item.id;
                            const Icon = item.icon;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        setActive(item.id);
                                        if (window.innerWidth < 1024) setSideOpen(false);
                                    }}
                                    className={`
                                        w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
                                        transition-all duration-200 group relative overflow-hidden
                                        ${isActive
                                            ? `bg-gradient-to-l ${item.accent} text-black shadow-lg`
                                            : 'text-zinc-500 hover:bg-white/[0.05] hover:text-zinc-200'}
                                    `}
                                >
                                    <div className="relative flex-shrink-0">
                                        <Icon className="w-[18px] h-[18px]" />
                                        {item.badge && !isActive && (
                                            <span className="absolute -top-1.5 -left-1.5 w-4 h-4
                                                             bg-red-500 text-white text-[8px] font-black
                                                             rounded-full flex items-center justify-center">
                                                {item.badge}
                                            </span>
                                        )}
                                    </div>
                                    {sideOpen && (
                                        <div className="flex-1 text-right overflow-hidden leading-none">
                                            <p className={`text-[13px] font-bold truncate
                                                          ${isActive ? 'text-black' : ''}`}>
                                                {item.ar}
                                            </p>
                                            <p className={`text-[10px] mt-0.5 font-medium tracking-wide
                                                          ${isActive ? 'text-black/60' : 'text-zinc-600 group-hover:text-zinc-500'}`}>
                                                {item.en}
                                            </p>
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </nav>

                    {/* Sidebar footer */}
                    {sideOpen && (
                        <div className="p-3 mt-4 border-t border-white/[0.06]">
                            <div className="bg-gradient-to-br from-amber-500/10 to-transparent
                                           border border-amber-500/20 rounded-xl p-3 text-center">
                                <img src={logo} alt="FITORA" className="h-7 w-auto object-contain mx-auto" />
                                <p className="text-[11px] font-bold text-amber-400 mt-1.5">مرحباً بك</p>
                                <p className="text-[9px] text-zinc-600 mt-0.5 tracking-widest uppercase">Learner Space</p>
                            </div>
                        </div>
                    )}
                </aside>

                {/* MAIN */}
                <main className="flex-1 overflow-auto min-w-0">
                    {renderPage()}
                </main>
            </div>

            {/* Mobile overlay */}
            {sideOpen && (
                <div className="fixed inset-0 bg-black/70 lg:hidden z-30 backdrop-blur-sm"
                     onClick={() => setSideOpen(false)} />
            )}
        </div>
    );
};

export default LearnerLayout;