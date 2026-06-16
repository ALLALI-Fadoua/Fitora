import { useState } from 'react';
import {
    CalendarCheck, Clock, MapPin, User,
    Search, ChevronDown, X, CheckCircle2,
    AlertCircle, XCircle, Dumbbell
} from 'lucide-react';
import { BOOKINGS as MOCK_BOOKINGS } from '../../utils/mockData';

/* ── Status config ── */
const STATUS = {
    confirmed: { label: 'Confirmé',   ar: 'مؤكد',       cls: 'bg-green-500/15 text-green-400 border-green-500/30' },
    pending:   { label: 'En attente', ar: 'في الانتظار', cls: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
    cancelled: { label: 'Annulé',     ar: 'ملغي',        cls: 'bg-red-500/15   text-red-400   border-red-500/30'   },
    completed: { label: 'Terminé',    ar: 'مكتملة',      cls: 'bg-zinc-500/15  text-zinc-400  border-zinc-500/30'  },
};

const StatusBadge = ({ status }) => {
    const s = STATUS[status] || STATUS.pending;
    return (
        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${s.cls}`}>
            {s.ar} · {s.label}
        </span>
    );
};

/* ── Booking Card ── */
const BookingCard = ({ booking, onCancel }) => {
    const [expanded, setExpanded] = useState(false);
    const date = booking.date ? new Date(booking.date) : null;

    return (
        <div className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700
                        rounded-2xl overflow-hidden transition-all">
            {/* Header */}
            <div className="p-4 flex items-start gap-4">
                {/* Date block */}
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600
                                flex flex-col items-center justify-center flex-shrink-0
                                shadow-lg shadow-amber-500/20">
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
                        <StatusBadge status={booking.status} />
                        <h3 className="font-black text-sm text-white truncate">
                            {booking.sessionTitle || 'جلسة تدريبية'}
                        </h3>
                    </div>
                    <div className="flex items-center justify-end gap-3 text-xs text-zinc-500 flex-wrap">
                        {booking.coachId?.fullName && (
                            <span className="flex items-center gap-1">
                                <User className="w-3 h-3" />
                                {booking.coachId.fullName}
                            </span>
                        )}
                        {booking.time && (
                            <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {booking.time}
                            </span>
                        )}
                        {booking.location && (
                            <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {booking.location}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="px-4 pb-3 flex items-center justify-between border-t border-zinc-800 pt-3">
                <div className="flex items-center gap-2">
                    {booking.status === 'pending' && (
                        <button
                            onClick={() => onCancel(booking._id)}
                            className="text-xs text-red-400 hover:text-red-300 font-semibold
                                       flex items-center gap-1 transition-colors"
                        >
                            <XCircle className="w-3.5 h-3.5" />
                            إلغاء الحجز
                        </button>
                    )}
                </div>
                <button
                    onClick={() => setExpanded(v => !v)}
                    className="text-xs text-zinc-500 hover:text-zinc-300 flex items-center gap-1 transition-colors"
                >
                    {expanded ? 'إخفاء' : 'التفاصيل'}
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expanded ? 'rotate-180' : ''}`} />
                </button>
            </div>

            {/* Expanded details */}
            {expanded && (
                <div className="px-4 pb-4 pt-0 border-t border-zinc-800 grid grid-cols-2 gap-3">
                    {[
                        { label: 'نوع الجلسة',   value: booking.sessionType || 'فردي' },
                        { label: 'المدة',         value: booking.duration ? `${booking.duration} دقيقة` : '—' },
                        { label: 'السعر',         value: booking.price != null ? (booking.price === 0 ? 'مجاني' : `${booking.price.toLocaleString()} DA`) : '—' },
                        { label: 'تاريخ الحجز',  value: booking.createdAt ? new Date(booking.createdAt).toLocaleDateString('ar-DZ') : '—' },
                    ].map(d => (
                        <div key={d.label} className="bg-zinc-800/50 rounded-xl p-3">
                            <p className="text-[10px] text-zinc-500 mb-1">{d.label}</p>
                            <p className="text-sm font-bold text-white">{d.value}</p>
                        </div>
                    ))}
                    {booking.notes && (
                        <div className="col-span-2 bg-zinc-800/50 rounded-xl p-3">
                            <p className="text-[10px] text-zinc-500 mb-1">ملاحظات</p>
                            <p className="text-xs text-zinc-300">{booking.notes}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

/* ── Main ── */
const LearnerBookings = () => {
    const [bookings,     setBookings] = useState(MOCK_BOOKINGS);
    const [filterStatus, setFilter]   = useState('all');
    const [search,       setSearch]   = useState('');

    const handleCancel = (id) => {
        if (!window.confirm('هل تريد إلغاء هذا الحجز؟')) return;
        setBookings(prev => prev.map(b => b._id === id ? { ...b, status: 'cancelled' } : b));
    };

    const filtered = bookings.filter(b => {
        const matchStatus = filterStatus === 'all' || b.status === filterStatus;
        const matchSearch = !search ||
            (b.sessionTitle || '').toLowerCase().includes(search.toLowerCase()) ||
            (b.coachId?.fullName || '').toLowerCase().includes(search.toLowerCase());
        return matchStatus && matchSearch;
    });

    const counts = {
        all:       bookings.length,
        confirmed: bookings.filter(b => b.status === 'confirmed').length,
        pending:   bookings.filter(b => b.status === 'pending').length,
        cancelled: bookings.filter(b => b.status === 'cancelled').length,
        completed: bookings.filter(b => b.status === 'completed').length,
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-white p-4 md:p-6" dir="rtl">
            <div className="max-w-4xl mx-auto">

                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-black bg-gradient-to-r from-amber-400 to-yellow-500
                                   bg-clip-text text-transparent mb-1">
                        حجوزاتي
                    </h1>
                    <p className="text-zinc-500 text-sm">My Bookings · {bookings.length} حجز</p>
                </div>

                {/* Stats strip */}
                <div className="grid grid-cols-4 gap-2 mb-5">
                    {[
                        { key: 'confirmed', icon: CheckCircle2, color: 'text-green-400'  },
                        { key: 'pending',   icon: AlertCircle,  color: 'text-amber-400'  },
                        { key: 'completed', icon: Dumbbell,     color: 'text-blue-400'   },
                        { key: 'cancelled', icon: XCircle,      color: 'text-red-400'    },
                    ].map(s => (
                        <button
                            key={s.key}
                            onClick={() => setFilter(s.key)}
                            className={`bg-zinc-900 border rounded-xl p-3 text-center transition-all
                                        ${filterStatus === s.key ? 'border-amber-500/50' : 'border-zinc-800 hover:border-zinc-700'}`}
                        >
                            <s.icon className={`w-4 h-4 ${s.color} mx-auto mb-1`} />
                            <p className={`text-lg font-black ${s.color}`}>{counts[s.key]}</p>
                            <p className="text-[10px] text-zinc-500 capitalize">{STATUS[s.key]?.ar}</p>
                        </button>
                    ))}
                </div>

                {/* Search + filters */}
                <div className="mb-4 space-y-2">
                    <div className="relative">
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <input
                            type="text"
                            placeholder="ابحث عن جلسة أو كوتش..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pr-10 pl-4
                                       text-sm focus:outline-none focus:border-amber-500/50 transition-colors"
                            dir="rtl"
                        />
                        {search && (
                            <button onClick={() => setSearch('')}
                                    className="absolute left-3 top-1/2 -translate-y-1/2">
                                <X className="w-4 h-4 text-zinc-500 hover:text-white" />
                            </button>
                        )}
                    </div>

                    {/* Filter tabs */}
                    <div className="flex gap-2 overflow-x-auto pb-1">
                        {['all', 'confirmed', 'pending', 'completed', 'cancelled'].map(s => (
                            <button
                                key={s}
                                onClick={() => setFilter(s)}
                                className={`flex-shrink-0 text-xs font-bold px-3 py-1.5 rounded-lg transition-all
                                            ${filterStatus === s
                                                ? 'bg-amber-500 text-black'
                                                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}
                            >
                                {s === 'all' ? `الكل (${counts.all})` : `${STATUS[s]?.ar} (${counts[s]})`}
                            </button>
                        ))}
                    </div>
                </div>

                {/* List */}
                {filtered.length === 0 ? (
                    <div className="text-center py-20">
                        <CalendarCheck className="w-14 h-14 text-zinc-700 mx-auto mb-3" />
                        <p className="text-zinc-500 text-sm">لا توجد حجوزات</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filtered.map(b => (
                            <BookingCard key={b._id} booking={b} onCancel={handleCancel} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LearnerBookings;