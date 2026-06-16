import { useState } from 'react';
import {
    Bell, BellOff, CalendarCheck, CreditCard, Star,
    BookOpen, Info, CheckCheck, Trash2
} from 'lucide-react';
import { NOTIFICATIONS as MOCK_NOTIFS } from '../../utils/mockData';

const NOTIF_TYPES = {
    booking:  { icon: CalendarCheck, color: 'text-sky-400',     bg: 'bg-sky-500/10',     en: 'Booking',  ar: 'حجز'    },
    payment:  { icon: CreditCard,    color: 'text-emerald-400', bg: 'bg-emerald-500/10', en: 'Payment',  ar: 'دفع'    },
    review:   { icon: Star,          color: 'text-violet-400',  bg: 'bg-violet-500/10',  en: 'Review',   ar: 'تقييم'  },
    program:  { icon: BookOpen,      color: 'text-amber-400',   bg: 'bg-amber-500/10',   en: 'Program',  ar: 'دورة'   },
    reminder: { icon: Bell,          color: 'text-orange-400',  bg: 'bg-orange-500/10',  en: 'Reminder', ar: 'تذكير'  },
    info:     { icon: Info,          color: 'text-zinc-400',    bg: 'bg-zinc-500/10',    en: 'Info',     ar: 'معلومة' },
};

const timeAgo = (dateStr) => {
    if (!dateStr) return '—';
    const diff  = Date.now() - new Date(dateStr).getTime();
    const mins  = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days  = Math.floor(diff / 86400000);
    if (mins < 1)   return 'الآن';
    if (mins < 60)  return `منذ ${mins} دقيقة`;
    if (hours < 24) return `منذ ${hours} ساعة`;
    return `منذ ${days} يوم`;
};

const NotifItem = ({ notif, onRead, onDelete }) => {
    const cfg  = NOTIF_TYPES[notif.type] || NOTIF_TYPES.info;
    const Icon = cfg.icon;

    return (
        <div className={`flex items-start gap-4 p-4 rounded-2xl border transition-all
                         ${notif.read
                             ? 'bg-[#0f0f0f] border-white/[0.05] opacity-60'
                             : 'bg-[#111] border-white/[0.09]'}`}>
            <div className={`p-2.5 rounded-xl ${cfg.bg} flex-shrink-0 mt-0.5`}>
                <Icon className={`w-4 h-4 ${cfg.color}`} />
            </div>

            <div className="flex-1 min-w-0 text-right">
                <div className="flex items-start justify-between gap-2 mb-0.5">
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                        {!notif.read && (
                            <button onClick={() => onRead(notif._id)}
                                    className="text-zinc-700 hover:text-emerald-400 transition-colors"
                                    title="تحديد كمقروء">
                                <CheckCheck className="w-3.5 h-3.5" />
                            </button>
                        )}
                        <button onClick={() => onDelete(notif._id)}
                                className="text-zinc-700 hover:text-red-400 transition-colors"
                                title="حذف">
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    </div>
                    <div>
                        <p className={`text-sm font-bold ${notif.read ? 'text-zinc-500' : 'text-white'}`}>
                            {notif.title || 'إشعار'}
                        </p>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`}>
                            {cfg.ar}
                        </span>
                    </div>
                </div>
                {notif.message && (
                    <p className="text-xs text-zinc-600 leading-relaxed mt-1.5">{notif.message}</p>
                )}
                <p className="text-[10px] text-zinc-700 mt-1.5">{timeAgo(notif.createdAt)}</p>
            </div>

            {!notif.read && (
                <div className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0 mt-2" />
            )}
        </div>
    );
};

const LearnerNotifications = () => {
    const [notifs, setNotifs] = useState(MOCK_NOTIFS);
    const [filter, setFilter] = useState('all');

    const handleRead    = (id) => setNotifs(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
    const handleDelete  = (id) => setNotifs(prev => prev.filter(n => n._id !== id));
    const handleReadAll = ()   => setNotifs(prev => prev.map(n => ({ ...n, read: true })));

    const unread   = notifs.filter(n => !n.read).length;
    const filtered = notifs.filter(n => {
        if (filter === 'all')    return true;
        if (filter === 'unread') return !n.read;
        return n.type === filter;
    });

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-6" dir="rtl">
            <div className="max-w-3xl mx-auto">

                {/* Header */}
                <div className="mb-6 flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black bg-gradient-to-l from-orange-400 to-amber-300
                                       bg-clip-text text-transparent mb-1">
                            الإشعارات
                        </h1>
                        <p className="text-zinc-500 text-sm">
                            Notifications
                            {unread > 0 && (
                                <span className="text-amber-400 font-bold mr-2">
                                    · {unread} غير مقروء
                                </span>
                            )}
                        </p>
                    </div>
                    {unread > 0 && (
                        <button onClick={handleReadAll}
                                className="flex items-center gap-2 text-xs font-bold text-emerald-400
                                           hover:text-emerald-300 bg-emerald-500/10 border border-emerald-500/20
                                           px-3 py-2 rounded-xl transition-all flex-shrink-0">
                            <CheckCheck className="w-3.5 h-3.5" />
                            تحديد الكل كمقروء
                        </button>
                    )}
                </div>

                {/* Stats strip */}
                <div className="grid grid-cols-4 gap-2 mb-5">
                    {[
                        { key: 'all',     ar: 'الكل',       count: notifs.length,                                   color: 'text-white'     },
                        { key: 'unread',  ar: 'غير مقروء',  count: unread,                                          color: 'text-amber-400' },
                        { key: 'booking', ar: 'حجوزات',     count: notifs.filter(n => n.type === 'booking').length,  color: 'text-sky-400'   },
                        { key: 'program', ar: 'دورات',      count: notifs.filter(n => n.type === 'program').length,  color: 'text-amber-400' },
                    ].map(s => (
                        <button key={s.key} onClick={() => setFilter(s.key)}
                                className={`bg-[#111] border rounded-xl p-3 text-center transition-all
                                            ${filter === s.key ? 'border-orange-500/40' : 'border-white/[0.07] hover:border-white/[0.12]'}`}>
                            <p className={`text-xl font-black ${s.color}`}>{s.count}</p>
                            <p className="text-[9px] text-zinc-600 mt-0.5">{s.ar}</p>
                        </button>
                    ))}
                </div>

                {/* Filter pills */}
                <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
                    {['all', 'unread', 'booking', 'payment', 'program', 'reminder'].map(f => (
                        <button key={f} onClick={() => setFilter(f)}
                                className={`flex-shrink-0 text-xs font-bold px-3 py-1.5 rounded-lg transition-all
                                            ${filter === f
                                                ? 'bg-orange-500 text-black'
                                                : 'bg-zinc-800/60 text-zinc-400 hover:bg-zinc-700/60'}`}>
                            {f === 'all'    ? 'الكل'
                           : f === 'unread' ? 'غير مقروء'
                           : NOTIF_TYPES[f] ? NOTIF_TYPES[f].ar
                           : f}
                        </button>
                    ))}
                </div>

                {/* List */}
                {filtered.length === 0 ? (
                    <div className="text-center py-20">
                        <BellOff className="w-14 h-14 text-zinc-800 mx-auto mb-3" />
                        <p className="text-zinc-600 text-sm">
                            {filter === 'unread' ? 'كل الإشعارات مقروءة ✓' : 'لا توجد إشعارات'}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {filtered.map(n => (
                            <NotifItem key={n._id} notif={n} onRead={handleRead} onDelete={handleDelete} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LearnerNotifications;