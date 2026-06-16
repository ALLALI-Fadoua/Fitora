import {
    Dumbbell, Flame, CalendarCheck, Trophy,
    TrendingUp, Clock, Droplets, ChevronRight,
    Zap, Target, Star, Play, CreditCard, Bell,
    Activity
} from 'lucide-react';

/* ── Shared logo used inside pages ── */
const FitoraLogo = ({ size = 28 }) => (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
        <defs>
            <linearGradient id="dlg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#eab308" />
            </linearGradient>
        </defs>
        <path d="M12 12 L12 88 L28 88 L28 56 L58 56 L58 42 L28 42 L28 28 L72 28 L72 12 Z" fill="url(#dlg)" />
        <circle cx="74" cy="34" r="7" fill="url(#dlg)" />
        <path d="M66 44 Q82 38 86 54 Q90 66 78 74 Q68 80 56 85"
              stroke="url(#dlg)" strokeWidth="7" strokeLinecap="round" fill="none" />
    </svg>
);

/* ── Mock data ── */
const PROFILE = {
    fullName: 'Ahmed Benali',
    activeProgram: {
        title: 'Force & Endurance Pro',
        coachName: 'Coach Khalid Amrani',
        progress: 65,
        currentWeek: 3,
        totalWeeks: 8,
        nextSession: 'غداً · Tomorrow 10:00',
    },
};
const BOOKINGS = [
    { _id: 'b1', sessionTitle: 'تدريب القوة · Strength Training', status: 'confirmed', date: '2026-05-28', time: '10:00', coachId: { fullName: 'Coach Khalid Amrani' } },
    { _id: 'b2', sessionTitle: 'كارديو متقدم · Advanced Cardio',  status: 'confirmed', date: '2026-06-02', time: '08:30', coachId: { fullName: 'Coach Sara Mansouri' } },
    { _id: 'b3', sessionTitle: 'تدريب أساسي · Core Training',    status: 'confirmed', date: '2026-06-05', time: '11:00', coachId: { fullName: 'Coach Khalid Amrani' } },
];
const PAYMENTS = [
    { status: 'paid', amount: 1500 },
    { status: 'paid', amount: 3500 },
    { status: 'paid', amount: 1000 },
    { status: 'pending', amount: 1200 },
];
const NOTIFS = [{ read: false }, { read: false }, { read: false }, { read: true }];
const WEEK = [
    { day: 'Mon', ar: 'الإث', value: 80 }, { day: 'Tue', ar: 'الثل', value: 60 },
    { day: 'Wed', ar: 'الأر', value: 90 }, { day: 'Thu', ar: 'الخم', value: 45 },
    { day: 'Fri', ar: 'الجم', value: 75 }, { day: 'Sat', ar: 'السب', value: 100 },
    { day: 'Sun', ar: 'الأح', value: 30 },
];
const NUTRITION = [
    { label: 'Calories',  ar: 'السعرات',      value: 1840, max: 2400, unit: 'kcal', color: '#f97316' },
    { label: 'Protein',   ar: 'البروتين',      value: 120,  max: 180,  unit: 'g',    color: '#38bdf8' },
    { label: 'Carbs',     ar: 'الكربوهيدرات', value: 220,  max: 300,  unit: 'g',    color: '#facc15' },
    { label: 'Fats',      ar: 'الدهون',        value: 55,   max: 80,   unit: 'g',    color: '#a78bfa' },
];

const pct = (v, m) => Math.min(100, Math.round((v / m) * 100));
const todayIdx = (new Date().getDay() + 6) % 7;

/* ── Stat Card ── */
const StatCard = ({ icon: Icon, ar, en, value, unit, color, bg, onClick }) => (
    <button onClick={onClick}
            className="bg-[#111] border border-white/[0.07] rounded-2xl p-4 flex items-center gap-3
                       hover:border-white/[0.14] transition-all group text-right w-full">
        <div className={`p-2.5 rounded-xl ${bg} flex-shrink-0`}>
            <Icon className={`w-4 h-4 ${color}`} />
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-[10px] text-zinc-600 font-semibold uppercase tracking-wider">{en}</p>
            <p className={`text-xl font-black ${color} leading-none mt-0.5`}>
                {value}{unit && <span className="text-xs font-semibold text-zinc-600 mr-0.5">{unit}</span>}
            </p>
            <p className="text-[10px] text-zinc-500 mt-0.5">{ar}</p>
        </div>
    </button>
);

/* ── LearnerDashboard ── */
const LearnerDashboard = ({ onNavigate }) => {
    const firstName  = PROFILE.fullName.split(' ')[0];
    const confirmed  = BOOKINGS.filter(b => b.status === 'confirmed');
    const totalSpent = PAYMENTS.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0);
    const unread     = NOTIFS.filter(n => !n.read).length;
    const prog       = PROFILE.activeProgram;

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-6" dir="rtl">
            <div className="max-w-6xl mx-auto space-y-5">

                {/* ── HERO BANNER ── */}
                <div className="relative overflow-hidden bg-[#111] border border-white/[0.07]
                                rounded-2xl p-5 md:p-7">
                    <div className="absolute -top-10 -right-10 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-orange-500/8 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Flame className="w-3.5 h-3.5 text-amber-400" />
                                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-[0.15em]">
                                    Active · نشط
                                </span>
                            </div>
                            <h1 className="text-2xl md:text-3xl font-black text-white mb-1">
                                مرحباً، {firstName}! 
                            </h1>
                            <p className="text-zinc-500 text-sm">
                                Welcome back to FITORA · أهلاً بعودتك
                            </p>
                        </div>

                        <div className="flex items-center gap-3 bg-black/40 border border-amber-500/20
                                        rounded-2xl px-5 py-3 flex-shrink-0">
                            <div className="text-right">
                                <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">
                                    Next Session · الجلسة القادمة
                                </p>
                                <p className="font-black text-amber-400 text-sm mt-0.5">{prog.nextSession}</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center">
                                <Play className="w-5 h-5 text-amber-400" />
                            </div>
                        </div>
                    </div>

                    {/* Active Program */}
                    <div className="relative mt-5 pt-5 border-t border-white/[0.06]">
                        <div className="flex items-start justify-between gap-4 mb-3">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold text-zinc-500">
                                    Week {prog.currentWeek} / {prog.totalWeeks}
                                </span>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-black text-white">{prog.title}</p>
                                <p className="text-xs text-zinc-500">{prog.coachName}</p>
                            </div>
                        </div>
                        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-l from-amber-500 to-orange-500 rounded-full
                                           transition-all duration-700"
                                 style={{ width: `${prog.progress}%` }} />
                        </div>
                        <div className="flex justify-between mt-1.5">
                            <span className="text-[10px] text-zinc-600">0%</span>
                            <span className="text-[10px] text-amber-400 font-bold">{prog.progress}%</span>
                            <span className="text-[10px] text-zinc-600">100%</span>
                        </div>
                    </div>
                </div>

                {/* ── STATS ── */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <StatCard icon={CalendarCheck} ar="حجوزات مؤكدة" en="Confirmed"
                              value={confirmed.length}              color="text-sky-400"     bg="bg-sky-500/10"
                              onClick={() => onNavigate('bookings')} />
                    <StatCard icon={CreditCard}    ar="إجمالي مدفوع"  en="Total Paid"
                              value={totalSpent.toLocaleString()}   unit="DA"
                              color="text-emerald-400" bg="bg-emerald-500/10"
                              onClick={() => onNavigate('payments')} />
                    <StatCard icon={Bell}          ar="إشعارات جديدة" en="Unread"
                              value={unread}                        color="text-orange-400"  bg="bg-orange-500/10"
                              onClick={() => onNavigate('notifications')} />
                    <StatCard icon={Star}          ar="تقييماتي"       en="My Reviews"
                              value={0}                             color="text-violet-400"  bg="bg-violet-500/10"
                              onClick={() => onNavigate('reviews')} />
                </div>

                {/* ── MIDDLE ROW ── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                    {/* Weekly Activity */}
                    <div className="bg-[#111] border border-white/[0.07] rounded-2xl p-5">
                        <div className="flex items-center justify-between mb-5">
                            <span className="text-[10px] text-zinc-600 font-semibold uppercase tracking-wider">
                                This Week · هذا الأسبوع
                            </span>
                            <div className="flex items-center gap-2">
                                <Activity className="w-4 h-4 text-amber-400" />
                                <h2 className="text-sm font-black">النشاط الأسبوعي · Weekly Activity</h2>
                            </div>
                        </div>
                        <div className="flex items-end justify-between gap-2 h-24">
                            {WEEK.map((d, i) => (
                                <div key={d.day} className="flex flex-col items-center gap-1 flex-1">
                                    <div className="w-full bg-zinc-800/80 rounded-lg relative overflow-hidden"
                                         style={{ height: 64 }}>
                                        <div className={`absolute bottom-0 w-full rounded-lg transition-all duration-700
                                                        ${i === todayIdx
                                                            ? 'bg-gradient-to-t from-amber-600 to-yellow-400'
                                                            : 'bg-zinc-700'}`}
                                             style={{ height: `${d.value}%` }} />
                                    </div>
                                    <span className={`text-[9px] font-bold ${i === todayIdx ? 'text-amber-400' : 'text-zinc-600'}`}>
                                        {d.ar}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Nutrition */}
                    <div className="bg-[#111] border border-white/[0.07] rounded-2xl p-5">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[10px] text-zinc-600 font-semibold uppercase tracking-wider">
                                Today · اليوم
                            </span>
                            <div className="flex items-center gap-2">
                                <Target className="w-4 h-4 text-emerald-400" />
                                <h2 className="text-sm font-black">التغذية · Nutrition</h2>
                            </div>
                        </div>
                        <div className="space-y-3">
                            {NUTRITION.map(n => (
                                <div key={n.label}>
                                    <div className="flex justify-between text-xs mb-1.5">
                                        <span className="font-bold" style={{ color: n.color }}>
                                            {n.value} <span className="text-zinc-600 font-normal">/ {n.max} {n.unit}</span>
                                        </span>
                                        <span className="text-zinc-500">
                                            {n.ar} <span className="text-zinc-700">· {n.label}</span>
                                        </span>
                                    </div>
                                    <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                        <div className="h-full rounded-full transition-all duration-700"
                                             style={{ width: `${pct(n.value, n.max)}%`, backgroundColor: n.color }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* Water */}
                        <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                                <Droplets className="w-3.5 h-3.5 text-sky-400" />
                                <span className="text-xs text-zinc-500">Water · الماء</span>
                            </div>
                            <div className="flex gap-1">
                                {Array.from({ length: 8 }, (_, i) => (
                                    <div key={i} className={`w-3 h-3 rounded-full border
                                        ${i < 5 ? 'bg-sky-500 border-sky-400' : 'bg-zinc-800 border-zinc-700'}`} />
                                ))}
                                <span className="text-[10px] text-zinc-500 mr-1">5/8 L</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── UPCOMING SESSIONS ── */}
                <div className="bg-[#111] border border-white/[0.07] rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-4">
                        <button onClick={() => onNavigate('bookings')}
                                className="text-xs text-amber-400 hover:text-amber-300 font-semibold
                                           flex items-center gap-1 transition-colors">
                            عرض الكل · View All <ChevronRight className="w-3 h-3" />
                        </button>
                        <div className="flex items-center gap-2">
                            <CalendarCheck className="w-4 h-4 text-sky-400" />
                            <h2 className="font-black text-sm">الجلسات القادمة · Upcoming Sessions</h2>
                        </div>
                    </div>
                    <div className="space-y-2">
                        {confirmed.slice(0, 3).map(b => {
                            const d = new Date(b.date);
                            return (
                                <div key={b._id}
                                     className="flex items-center gap-3 bg-zinc-900/60 hover:bg-zinc-800/60
                                                rounded-xl p-3 transition-colors">
                                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20
                                                    flex flex-col items-center justify-center flex-shrink-0">
                                        <span className="text-sm font-black text-amber-400 leading-none">{d.getDate()}</span>
                                        <span className="text-[8px] font-bold text-amber-600 uppercase">
                                            {d.toLocaleString('en', { month: 'short' })}
                                        </span>
                                    </div>
                                    <div className="flex-1 text-right">
                                        <p className="text-sm font-bold text-white truncate">{b.sessionTitle}</p>
                                        <p className="text-[11px] text-zinc-500">
                                            {b.coachId.fullName} · {b.time}
                                        </p>
                                    </div>
                                    <span className="text-[9px] font-bold bg-emerald-500/10 text-emerald-400
                                                      border border-emerald-500/20 px-2 py-0.5 rounded-full flex-shrink-0">
                                        Confirmed ✓
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* ── QUICK ACTIONS ── */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                        { icon: CalendarCheck, ar: 'احجز جلسة', en: 'Book Session',  page: 'bookings',      from: 'from-sky-600',     to: 'to-blue-500'   },
                        { icon: CreditCard,    ar: 'المدفوعات', en: 'Payments',      page: 'payments',      from: 'from-emerald-600', to: 'to-green-500'  },
                        { icon: Star,          ar: 'تقييماتي',  en: 'My Reviews',    page: 'reviews',       from: 'from-violet-600',  to: 'to-purple-500' },
                        { icon: Zap,           ar: 'الإشعارات', en: 'Notifications', page: 'notifications', from: 'from-orange-600',  to: 'to-amber-500'  },
                    ].map(a => (
                        <button key={a.page} onClick={() => onNavigate(a.page)}
                                className={`bg-gradient-to-br ${a.from} ${a.to} p-4 rounded-2xl text-white
                                            hover:opacity-90 hover:scale-[1.02] transition-all shadow-lg text-right group`}>
                            <a.icon className="w-5 h-5 mb-2.5 opacity-80 group-hover:opacity-100" />
                            <p className="font-black text-sm">{a.ar}</p>
                            <p className="text-[10px] opacity-70 font-medium mt-0.5">{a.en}</p>
                        </button>
                    ))}
                </div>

                {/* ── ACHIEVEMENTS ── */}
                <div className="bg-[#111] border border-white/[0.07] rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-4">
                        <button onClick={() => onNavigate('profile')}
                                className="text-xs text-amber-400 hover:text-amber-300 font-semibold
                                           flex items-center gap-1 transition-colors">
                            عرض الكل <ChevronRight className="w-3 h-3" />
                        </button>
                        <div className="flex items-center gap-2">
                            <Trophy className="w-4 h-4 text-amber-400" />
                            <h2 className="font-black text-sm">الإنجازات · Achievements</h2>
                        </div>
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-1">
                        {[
                            { icon: '🏃', ar: 'أول جلسة',     en: '1st Session',  earned: true  },
                            { icon: '💪', ar: '10 جلسات',     en: '10 Sessions',  earned: false },
                            { icon: '📅', ar: 'شهر كامل',     en: 'Full Month',   earned: false },
                            { icon: '🎯', ar: 'هدف محقق',     en: 'Goal Reached', earned: false },
                            { icon: '🌅', ar: 'محارب الصباح', en: 'Morning Hero', earned: false },
                            { icon: '🏆', ar: 'بطل الثبات',   en: 'Consistency',  earned: false },
                        ].map((a, i) => (
                            <div key={i}
                                 className={`flex-shrink-0 w-[86px] rounded-xl border p-3 text-center
                                             ${a.earned
                                                 ? 'bg-amber-500/10 border-amber-500/30'
                                                 : 'bg-zinc-900/60 border-zinc-800/60 opacity-40'}`}>
                                <div className="text-2xl mb-1.5">{a.icon}</div>
                                <p className={`text-[10px] font-bold leading-tight ${a.earned ? 'text-amber-400' : 'text-zinc-500'}`}>
                                    {a.ar}
                                </p>
                                <p className="text-[9px] text-zinc-600 mt-0.5">{a.en}</p>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default LearnerDashboard;