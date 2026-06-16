import { useState } from 'react';
import {
    Users, Briefcase, Calendar, BookOpen, Clock, TrendingUp,
    RefreshCw, AlertCircle, DollarSign, CheckCircle, XCircle,
    Star, ArrowUpRight, Activity
} from 'lucide-react';
import {
    SESSIONS, COACH_COURSES, COACHES, BOOKINGS, EARNINGS
} from '../../utils/mockData';

const fmt = (n) => Number(n || 0).toLocaleString('fr-DZ');

const MOCK_USERS = [
    { _id: 'u1', role: 'CANDIDATE' },
    { _id: 'u2', role: 'CANDIDATE' },
    { _id: 'u3', role: 'CANDIDATE' },
    { _id: 'u4', role: 'CANDIDATE' },
    { _id: 'u5', role: 'CANDIDATE' },
    { _id: 'u6', role: 'ADMIN'     },
];

/* ── Stat Card ── */
const StatCard = ({ icon: Icon, ar, en, value, sub, accent, bg, onClick }) => (
    <button
        onClick={onClick}
        disabled={!onClick}
        className={`
            bg-[#111] border border-white/[0.07] rounded-2xl p-4
            text-right transition-all group w-full
            ${onClick ? 'hover:border-white/[0.14] hover:scale-[1.01] cursor-pointer' : 'cursor-default'}
        `}
    >
        <div className="flex items-start justify-between gap-3">
            <div className={`p-2.5 rounded-xl ${bg} flex-shrink-0`}>
                <Icon className={`w-4 h-4 ${accent}`} />
            </div>
            {onClick && (
                <ArrowUpRight className="w-3.5 h-3.5 text-zinc-700 group-hover:text-zinc-400 transition-colors mt-0.5 flex-shrink-0" />
            )}
        </div>
        <div className="mt-3">
            <p className="text-2xl font-black text-white leading-none">{value}</p>
            {sub && <p className={`text-[10px] font-bold mt-1 ${accent} opacity-70`}>{sub}</p>}
            <p className="text-[11px] text-zinc-500 mt-1 font-semibold">{ar}</p>
            <p className="text-[9px] text-zinc-700 uppercase tracking-wider">{en}</p>
        </div>
    </button>
);

/* ── Mini bar chart ── */
const MiniBar = ({ value, max, color }) => (
    <div className="h-1 bg-zinc-800 rounded-full overflow-hidden flex-1">
        <div
            className={`h-full rounded-full ${color}`}
            style={{ width: `${Math.min((value / Math.max(max, 1)) * 100, 100)}%` }}
        />
    </div>
);

const AdminDashboard = ({ onNavigate }) => {
    const [refreshKey, setRefreshKey] = useState(0);

    const learners        = MOCK_USERS.filter(u => u.role === 'CANDIDATE').length;
    const coachesCount    = COACHES.length;
    const sessionsCount   = SESSIONS.length;
    const coursesCount    = COACH_COURSES.length;
    const activeSessions  = SESSIONS.filter(s => s.availableSeats > 0).length;
    const activeCourses   = COACH_COURSES.filter(c => c.status === 'نشط').length;
    const pendingBookings = BOOKINGS.filter(b => b.status === 'قيد الانتظار').length;
    const cancelledCount  = BOOKINGS.filter(b => b.status === 'ملغي').length;
    const completedCount  = BOOKINGS.filter(b => b.status === 'مكتمل').length;
    const enrolledTotal   = COACH_COURSES.reduce((s, c) => s + (c.enrolledStudents || 0), 0);
    const revenue         = EARNINGS.stats.thisMonth;
    const totalRevenue    = EARNINGS.stats.totalEarnings;

    const stats1 = [
        { icon: Users,     ar: 'المتدربون',          en: 'Learners',  value: fmt(learners),       sub: `${learners} مسجل`,          accent: 'text-amber-400',   bg: 'bg-amber-500/10',   nav: 'users'    },
        { icon: Briefcase, ar: 'الكوتشات',           en: 'Coaches',   value: fmt(coachesCount),   sub: `${coachesCount} مدرب`,       accent: 'text-violet-400',  bg: 'bg-violet-500/10',  nav: 'coaches'  },
        { icon: Calendar,  ar: 'الجلسات',            en: 'Sessions',  value: fmt(sessionsCount),  sub: `${activeSessions} نشطة`,     accent: 'text-emerald-400', bg: 'bg-emerald-500/10', nav: 'sessions' },
        { icon: BookOpen,  ar: 'البرامج التدريبية',  en: 'Programs',  value: fmt(coursesCount),   sub: `${activeCourses} نشطة`,      accent: 'text-sky-400',     bg: 'bg-sky-500/10',     nav: 'courses'  },
    ];

    const stats2 = [
        { icon: Clock,       ar: 'حجوزات معلقة',     en: 'Pending',    value: fmt(pendingBookings), sub: 'بانتظار التأكيد',  accent: 'text-orange-400',  bg: 'bg-orange-500/10',  nav: 'sessions' },
        { icon: CheckCircle, ar: 'حجوزات مكتملة',    en: 'Completed',  value: fmt(completedCount),  sub: null,              accent: 'text-teal-400',    bg: 'bg-teal-500/10',    nav: null        },
        { icon: Users,       ar: 'متدربو البرامج',   en: 'Enrolled',   value: fmt(enrolledTotal),   sub: 'مسجل في برنامج',  accent: 'text-blue-400',    bg: 'bg-blue-500/10',    nav: 'courses'  },
        { icon: TrendingUp,  ar: 'إيرادات الشهر',    en: 'Revenue',    value: `${fmt(revenue)} DA`, sub: null,              accent: 'text-green-400',   bg: 'bg-green-500/10',   nav: 'earning'  },
    ];

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-6" dir="rtl">
            <div className="max-w-7xl mx-auto">

                {/* ── HEADER ── */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-black bg-gradient-to-l from-amber-400 to-yellow-300 bg-clip-text text-transparent mb-1">
                            لوحة التحكم
                        </h1>
                        <p className="text-zinc-500 text-sm">Admin Dashboard · نظرة عامة على المنصة</p>
                    </div>
                    <button
                        onClick={() => setRefreshKey(k => k + 1)}
                        className="flex items-center gap-2 text-zinc-500 hover:text-amber-400 transition-colors text-xs border border-white/[0.07] hover:border-amber-500/30 px-3 py-2 rounded-lg bg-white/[0.02]"
                    >
                        <RefreshCw className="w-3.5 h-3.5" />
                        تحديث
                    </button>
                </div>

                {/* ── PENDING ALERT ── */}
                {pendingBookings > 0 && (
                    <div className="mb-5 bg-amber-500/5 border border-amber-500/20 rounded-2xl px-5 py-4 flex items-center gap-3">
                        <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse flex-shrink-0" />
                        <p className="text-amber-300/80 text-sm font-medium">
                            لديك{' '}
                            <span className="font-black text-amber-400 text-base">{pendingBookings}</span>
                            {' '}حجز في انتظار تأكيد الدفع
                        </p>
                    </div>
                )}

                {/* ── STATS ROW 1 ── */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
                    {stats1.map(s => (
                        <StatCard
                            key={s.ar} {...s}
                            onClick={s.nav && onNavigate ? () => onNavigate(s.nav) : null}
                        />
                    ))}
                </div>

                {/* ── STATS ROW 2 ── */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                    {stats2.map(s => (
                        <StatCard
                            key={s.ar} {...s}
                            onClick={s.nav && onNavigate ? () => onNavigate(s.nav) : null}
                        />
                    ))}
                </div>

                {/* ── SUMMARY PANELS ── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                    {/* Pending breakdown */}
                    <div className="bg-[#111] border border-white/[0.07] rounded-2xl overflow-hidden">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-orange-400" />
                                <h2 className="font-bold text-sm">الطلبات المعلقة</h2>
                            </div>
                            {pendingBookings > 0 && (
                                <span className="bg-orange-500/10 text-orange-400 text-[10px] font-black px-2.5 py-1 rounded-full border border-orange-500/20 animate-pulse">
                                    {pendingBookings} معلق
                                </span>
                            )}
                        </div>
                        <div className="p-5 space-y-4">
                            {[
                                { label: 'جلسات معلقة',  value: BOOKINGS.filter(b => b.status === 'قيد الانتظار' && b.category === 'جلسة').length,   color: 'bg-orange-400', accent: 'text-orange-400', total: sessionsCount },
                                { label: 'برامج معلقة',  value: BOOKINGS.filter(b => b.status === 'قيد الانتظار' && b.category === 'برنامج').length,  color: 'bg-yellow-400', accent: 'text-yellow-400', total: coursesCount  },
                            ].map(({ label, value, color, accent, total }) => (
                                <div key={label}>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className={`text-sm font-bold ${value > 0 ? accent : 'text-zinc-600'}`}>{value}</span>
                                        <span className="text-sm text-zinc-500">{label}</span>
                                    </div>
                                    <MiniBar value={value} max={total} color={color} />
                                </div>
                            ))}
                            <div className="mt-3 pt-3 border-t border-white/[0.06] flex items-center justify-between">
                                <span className="text-lg font-black text-white">{pendingBookings}</span>
                                <span className="text-xs text-zinc-600">إجمالي المعلقة</span>
                            </div>
                        </div>
                    </div>

                    {/* Sessions summary */}
                    <div className="bg-[#111] border border-white/[0.07] rounded-2xl overflow-hidden">
                        <div className="flex items-center gap-2 px-5 py-4 border-b border-white/[0.06]">
                            <Calendar className="w-4 h-4 text-emerald-400" />
                            <h2 className="font-bold text-sm">ملخص الجلسات</h2>
                        </div>
                        <div className="p-5 space-y-1">
                            {[
                                { label: 'إجمالي الجلسات', value: fmt(sessionsCount), color: 'text-white'       },
                                { label: 'جلسات متاحة',    value: fmt(activeSessions), color: 'text-emerald-400' },
                                { label: 'جلسات مكتملة',   value: fmt(completedCount), color: 'text-sky-400'     },
                                { label: 'جلسات ملغية',    value: fmt(cancelledCount), color: 'text-red-400'     },
                            ].map(({ label, value, color }) => (
                                <div key={label} className="flex items-center justify-between py-2.5 border-b border-white/[0.04] last:border-0">
                                    <span className={`text-sm font-bold ${color}`}>{value}</span>
                                    <span className="text-sm text-zinc-500">{label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Revenue summary */}
                    <div className="bg-[#111] border border-white/[0.07] rounded-2xl overflow-hidden">
                        <div className="flex items-center gap-2 px-5 py-4 border-b border-white/[0.06]">
                            <DollarSign className="w-4 h-4 text-green-400" />
                            <h2 className="font-bold text-sm">ملخص الأرباح</h2>
                        </div>
                        <div className="p-5 space-y-1">
                            {[
                                { label: 'إجمالي الأرباح', value: `${fmt(totalRevenue)} DA`, color: 'text-white'       },
                                { label: 'هذا الشهر',      value: `${fmt(revenue)} DA`,      color: 'text-green-400'   },
                                { label: 'عمولة الجلسات', value: `${EARNINGS.stats.commissionRates.workshop}%`, color: 'text-amber-400' },
                                { label: 'عمولة البرامج', value: `${EARNINGS.stats.commissionRates.course}%`,  color: 'text-amber-400' },
                            ].map(({ label, value, color }) => (
                                <div key={label} className="flex items-center justify-between py-2.5 border-b border-white/[0.04] last:border-0">
                                    <span className={`text-sm font-bold ${color}`}>{value}</span>
                                    <span className="text-sm text-zinc-500">{label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── RECENT BOOKINGS ── */}
                <div className="mt-4 bg-[#111] border border-white/[0.07] rounded-2xl overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
                        <button
                            onClick={() => onNavigate && onNavigate('sessions')}
                            className="text-xs text-amber-400 hover:text-amber-300 transition-colors font-semibold flex items-center gap-1"
                        >
                            عرض الكل
                            <ArrowUpRight className="w-3 h-3" />
                        </button>
                        <div className="flex items-center gap-2">
                            <Activity className="w-4 h-4 text-amber-400" />
                            <h2 className="font-bold text-sm">آخر الحجوزات</h2>
                        </div>
                    </div>
                    <div className="divide-y divide-white/[0.04]">
                        {BOOKINGS.slice(0, 5).map(b => {
                            const statusConfig = {
                                'نشط':           { cls: 'bg-sky-500/10 text-sky-400 border-sky-500/20',       dot: 'bg-sky-400'     },
                                'مكتمل':         { cls: 'bg-green-500/10 text-green-400 border-green-500/20', dot: 'bg-green-400'   },
                                'قيد الانتظار':  { cls: 'bg-amber-500/10 text-amber-400 border-amber-500/20', dot: 'bg-amber-400'   },
                                'ملغي':          { cls: 'bg-red-500/10 text-red-400 border-red-500/20',       dot: 'bg-red-400'     },
                            }[b.status] || { cls: 'bg-zinc-700/10 text-zinc-400 border-zinc-500/20', dot: 'bg-zinc-500' };

                            return (
                                <div key={b._id} className="flex items-center justify-between px-5 py-3 hover:bg-white/[0.02] transition-colors">
                                    <div className="flex items-center gap-2.5">
                                        <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${statusConfig.cls}`}>
                                            {b.status}
                                        </span>
                                        <span className="text-[10px] font-bold text-amber-500/70 bg-amber-500/8 px-2 py-0.5 rounded-full border border-amber-500/15">
                                            {b.category}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-white truncate max-w-[200px]">{b.name}</p>
                                        <p className="text-[11px] text-zinc-600">{b.date}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminDashboard;