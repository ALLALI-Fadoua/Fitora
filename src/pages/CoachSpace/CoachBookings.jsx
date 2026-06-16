import { useState } from 'react';
import {
    Calendar, Sparkles, CheckCircle2, XCircle, Clock, Activity,
    AlertCircle, Search, X, Users
} from 'lucide-react';
import { BOOKINGS } from '../../utils/mockData';

// ─── Helpers ──────────────────────────────────────────────────
const getDisplayStatus = (booking) => {
    if (booking.status === 'ملغي') return 'ملغي';

    if (booking.category === 'جلسة') {
        const today     = new Date();
        const isExpired = booking.date ? new Date(booking.date) < today : false;
        const isFull    = booking.capacity != null &&
                          booking.capacity > 0 &&
                          Number(booking.rawParticipants || 0) >= Number(booking.capacity);
        if (isExpired || isFull) return 'مكتمل';
        if (booking.status === 'قيد الانتظار') return 'قيد الانتظار';
        return 'نشط';
    }

    if (booking.category === 'برنامج') {
        if (booking.status === 'قيد الانتظار') return 'قيد الانتظار';
        const isFull = booking.capacity != null &&
                       booking.capacity > 0 &&
                       Number(booking.enrolledStudents || 0) >= Number(booking.capacity);
        if (isFull) return 'مكتمل';
        return 'نشط';
    }

    return booking.status;
};

const STATUS_STYLES = {
    'نشط':           'bg-sky-500/10 text-sky-400 border-sky-500/25',
    'مكتمل':        'bg-green-500/10 text-green-400 border-green-500/25',
    'قيد الانتظار': 'bg-amber-500/10 text-amber-400 border-amber-500/25',
    'ملغي':         'bg-red-500/10 text-red-400 border-red-500/25',
};

// ─── Component ────────────────────────────────────────────────
const CoachBookings = () => {
    const [bookings, setBookings]         = useState(BOOKINGS);
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterType, setFilterType]     = useState('all');
    const [searchQuery, setSearchQuery]   = useState('');

    const handleReject = (id) => {
        setBookings(prev =>
            prev.map(b => b._id === id ? { ...b, status: 'ملغي' } : b)
        );
    };

    const filteredBookings = bookings.filter(booking => {
        const displayStatus = getDisplayStatus(booking);
        const matchStatus = filterStatus === 'all' || displayStatus === filterStatus;
        const matchType   = filterType   === 'all' || booking.category === filterType;
        const matchSearch = searchQuery  === '' ||
            (booking.name || '').toLowerCase().includes(searchQuery.toLowerCase());
        return matchStatus && matchType && matchSearch;
    });

    const counts = {
        all:              bookings.length,
        نشط:              bookings.filter(b => getDisplayStatus(b) === 'نشط').length,
        مكتمل:            bookings.filter(b => getDisplayStatus(b) === 'مكتمل').length,
        'قيد الانتظار':  bookings.filter(b => getDisplayStatus(b) === 'قيد الانتظار').length,
        ملغي:             bookings.filter(b => getDisplayStatus(b) === 'ملغي').length,
    };

    const stats = [
        { key: 'نشط',           icon: Activity,     color: 'text-sky-400'   },
        { key: 'مكتمل',         icon: CheckCircle2, color: 'text-green-400' },
        { key: 'قيد الانتظار',  icon: Clock,        color: 'text-amber-400' },
        { key: 'ملغي',          icon: AlertCircle,  color: 'text-red-400'   },
    ];

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-6" dir="rtl">
            <div className="max-w-5xl mx-auto">

                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-black bg-gradient-to-l from-emerald-400 to-green-300
                                   bg-clip-text text-transparent mb-1">
                        إدارة الحجوزات
                    </h1>
                    <p className="text-zinc-500 text-sm">Bookings · متابعة وإدارة حجوزات الجلسات والبرامج · {bookings.length} حجز</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-2 mb-5">
                    {stats.map(s => (
                        <button
                            key={s.key}
                            onClick={() => setFilterStatus(s.key)}
                            className={`bg-[#111] border rounded-2xl p-3 text-center transition-all
                                        ${filterStatus === s.key ? 'border-emerald-500/40' : 'border-white/[0.07] hover:border-white/[0.12]'}`}
                        >
                            <s.icon className={`w-4 h-4 ${s.color} mx-auto mb-1`} />
                            <p className={`text-lg font-black ${s.color}`}>{counts[s.key]}</p>
                            <p className="text-[10px] text-zinc-600 mt-0.5">{s.key}</p>
                        </button>
                    ))}
                </div>

                {/* Search + filters */}
                <div className="mb-5 space-y-2">
                    <div className="relative">
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                        <input
                            type="text" dir="rtl"
                            placeholder="ابحث عن جلسة أو برنامج..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full bg-[#111] border border-white/[0.07] rounded-xl py-3 pr-10 pl-4
                                       text-sm focus:outline-none focus:border-emerald-500/40 transition-colors
                                       placeholder-zinc-600 text-white"
                        />
                        {searchQuery && (
                            <button onClick={() => setSearchQuery('')}
                                    className="absolute left-3 top-1/2 -translate-y-1/2">
                                <X className="w-4 h-4 text-zinc-500 hover:text-white" />
                            </button>
                        )}
                    </div>

                    {/* Status tabs */}
                    <div className="flex gap-2 overflow-x-auto pb-1">
                        {['all', 'نشط', 'مكتمل', 'قيد الانتظار', 'ملغي'].map(s => (
                            <button
                                key={s}
                                onClick={() => setFilterStatus(s)}
                                className={`flex-shrink-0 text-xs font-bold px-3 py-1.5 rounded-lg transition-all
                                            ${filterStatus === s
                                                ? 'bg-emerald-500 text-black'
                                                : 'bg-zinc-800/60 text-zinc-400 hover:bg-zinc-700/60'}`}
                            >
                                {s === 'all' ? `الكل (${counts.all})` : `${s} (${counts[s]})`}
                            </button>
                        ))}
                    </div>

                    {/* Type tabs */}
                    <div className="flex gap-2 overflow-x-auto pb-1">
                        {['all', 'جلسة', 'برنامج'].map(t => (
                            <button
                                key={t}
                                onClick={() => setFilterType(t)}
                                className={`flex-shrink-0 text-xs font-bold px-3 py-1.5 rounded-lg transition-all
                                            ${filterType === t
                                                ? 'bg-zinc-200 text-black'
                                                : 'bg-zinc-800/60 text-zinc-400 hover:bg-zinc-700/60'}`}
                            >
                                {t === 'all' ? 'كل الأنواع' : t}
                            </button>
                        ))}
                    </div>
                </div>

                {/* List */}
                {filteredBookings.length === 0 ? (
                    <div className="text-center py-20">
                        <Users className="w-14 h-14 text-zinc-800 mx-auto mb-3" />
                        <p className="text-zinc-600 text-sm">لا توجد حجوزات تطابق الفلاتر المحددة</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filteredBookings.map(booking => {
                            const status = getDisplayStatus(booking);
                            const date   = booking.date ? new Date(booking.date) : null;
                            return (
                                <div key={booking._id}
                                     className="bg-[#111] border border-white/[0.07] hover:border-white/[0.12]
                                                rounded-2xl overflow-hidden transition-all">
                                    <div className="p-4 flex items-start gap-4">
                                        {/* Date block */}
                                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600
                                                        flex flex-col items-center justify-center flex-shrink-0
                                                        shadow-lg shadow-emerald-500/20">
                                            <span className="text-lg font-black text-black leading-none">
                                                {date ? date.getDate() : '—'}
                                            </span>
                                            <span className="text-[10px] font-bold text-black/70 uppercase">
                                                {date ? date.toLocaleString('fr-FR', { month: 'short' }) : '—'}
                                            </span>
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0 text-right">
                                            <div className="flex items-start justify-between gap-2 mb-1">
                                                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${STATUS_STYLES[status] || STATUS_STYLES['نشط']}`}>
                                                    {status}
                                                </span>
                                                <h3 className="font-black text-sm text-white truncate">
                                                    {booking.name}
                                                </h3>
                                            </div>
                                            <div className="flex items-center justify-end gap-3 text-xs text-zinc-500 flex-wrap">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {booking.date} {booking.time && `· ${booking.time}`}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Sparkles className="w-3 h-3" />
                                                    {booking.participants ?? booking.enrolledStudents ?? 0}
                                                    {booking.capacity != null ? `/${booking.capacity}` : ''} مشارك
                                                </span>
                                                <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-bold border border-amber-500/20">
                                                    {booking.category}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div className="px-4 pb-3 flex items-center justify-between border-t border-white/[0.05] pt-3">
                                        <div>
                                            {booking.status === 'قيد الانتظار' && status === 'قيد الانتظار' ? (
                                                <button
                                                    onClick={() => handleReject(booking._id)}
                                                    className="text-xs text-red-400 hover:text-red-300 font-semibold
                                                               flex items-center gap-1 transition-colors"
                                                >
                                                    <XCircle className="w-3.5 h-3.5" />
                                                    إلغاء الحجز
                                                </button>
                                            ) : (
                                                <span className="text-xs text-zinc-600">لا توجد إجراءات</span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-4 text-right">
                                            <div>
                                                <p className="text-[10px] text-zinc-600">سعر الوحدة</p>
                                                <p className="text-xs font-bold text-amber-400">دج {(booking.unitPrice ?? 0).toLocaleString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-zinc-600">الإجمالي</p>
                                                <p className="text-sm font-black text-green-400">{booking.totalPrice}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CoachBookings;