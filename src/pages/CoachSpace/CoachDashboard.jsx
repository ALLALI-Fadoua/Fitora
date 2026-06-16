import { useState } from 'react';
import {
    Calendar, Sparkles, DollarSign, BookOpen,
    Clock, CheckCircle, AlertCircle,
    ChevronRight, ChevronLeft, Star,
    XCircle
} from 'lucide-react';
import { BOOKINGS, EARNINGS, COACH_PROFILE } from '../../utils/mockData';

// ─── Helpers ──────────────────────────────────────────────────
const fmt = (n) => Number(n || 0).toLocaleString('fr-DZ');

const getAvailabilityStatus = (item) => {
    const today = new Date();
    if (item.category === 'جلسة') {
        const isExpired = item.date ? new Date(item.date) < today : false;
        const isFull    = item.capacity != null && item.rawParticipants >= item.capacity;
        return (isExpired || isFull) ? 'مكتمل' : 'نشط';
    }
    if (item.category === 'برنامج') {
        const isFull = item.capacity != null && item.enrolledStudents >= item.capacity;
        return isFull ? 'مكتمل' : 'نشط';
    }
    return 'نشط';
};

// ─── StatCard ─────────────────────────────────────────────────
const StatCard = ({ icon, label, value, sub, color, onClick }) => {
    const IconComp = icon;
    return (
        <button
            onClick={onClick}
            disabled={!onClick}
            className={`bg-[#111] border border-white/[0.07] rounded-2xl p-4 text-right transition-all
                        ${onClick ? 'hover:border-white/[0.14] cursor-pointer' : 'cursor-default'}`}
        >
            <div className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                    <p className="text-zinc-500 text-[11px] mb-0.5">{label}</p>
                    <p className="text-xl font-black text-white leading-snug">
                        {value}
                        {sub && (
                            <span className={`text-[11px] font-semibold ${color.text} opacity-80 mr-1`}>({sub})</span>
                        )}
                    </p>
                </div>
                <div className={`${color.bg} p-2.5 rounded-xl flex-shrink-0`}>
                    <IconComp className={`w-4 h-4 ${color.text}`} />
                </div>
            </div>
        </button>
    );
};

// ─── Arabic helpers ───────────────────────────────────────────
const AR_MONTHS = ['جانفي','فيفري','مارس','أفريل','ماي','جوان','جويلية','أوت','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
const AR_DAYS   = ['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'];
const MODULE_NOW_TS = Date.now() - 86400000;

const toKey = (dateRaw) => {
    if (!dateRaw) return null;
    const d = new Date(dateRaw);
    if (isNaN(d)) return null;
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
};

// ─── CalendarSection ──────────────────────────────────────────
const CalendarSection = ({ workshopBookings, courseBookings, onNavigate }) => {
    const today = new Date();
    const [viewDate,     setViewDate]     = useState(new Date(today.getFullYear(), today.getMonth(), 1));
    const [selectedDate, setSelectedDate] = useState(null);

    const eventMap = {};
    const push = (key, ev) => {
        if (!key) return;
        if (!eventMap[key]) eventMap[key] = [];
        eventMap[key].push(ev);
    };

    workshopBookings.forEach(b => {
        const key = toKey(b.date);
        push(key, {
            type:               'workshop',
            label:              b.name || 'جلسة',
            time:               b.time || '',
            availabilityStatus: getAvailabilityStatus(b),
            totalPrice:         b.totalPrice || '',
            participants:       b.participants,
            capacity:           b.capacity,
            rawParticipants:    b.rawParticipants,
        });
    });

    courseBookings.forEach(b => {
        const key = toKey(b.date || b.bookingDate);
        push(key, {
            type:               'course',
            label:              b.name || 'برنامج',
            availabilityStatus: getAvailabilityStatus(b),
            totalPrice:         b.totalPrice || '',
            enrolledStudents:   b.enrolledStudents,
            capacity:           b.capacity,
        });
    });

    const year        = viewDate.getFullYear();
    const month       = viewDate.getMonth();
    const firstDay    = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const todayKey    = toKey(today);
    const getCellKey  = (day) => `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;

    const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
    const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

    const selectedEvents = selectedDate ? (eventMap[selectedDate] || []) : [];

    const renderStatusBadge = (ev) => {
        const s = ev.availabilityStatus || 'نشط';
        const cls = s === 'مكتمل'
            ? 'bg-green-500/10 text-green-400 border-green-500/25'
            : 'bg-sky-500/10 text-sky-400 border-sky-500/25';
        return (
            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${cls}`}>{s}</span>
        );
    };

    return (
        <div className="bg-[#111] border border-white/[0.07] rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-400" />
                    <h2 className="font-black text-sm">التقويم — مواعيد الجلسات والبرامج</h2>
                </div>
                <div className="flex items-center gap-4 text-xs text-zinc-500">
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />جلسة</span>
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-sky-400 inline-block" />برنامج</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x lg:divide-x-reverse divide-white/[0.06]">

                {/* Calendar grid */}
                <div className="lg:col-span-2 p-5">
                    <div className="flex items-center justify-between mb-5">
                        <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-white/[0.06] text-zinc-500 hover:text-white transition-colors">
                            <ChevronRight className="w-4 h-4" />
                        </button>
                        <h3 className="font-black text-white text-base">{AR_MONTHS[month]} {year}</h3>
                        <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-white/[0.06] text-zinc-500 hover:text-white transition-colors">
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="grid grid-cols-7 mb-2">
                        {AR_DAYS.map(d => <div key={d} className="text-center text-[10px] font-semibold text-zinc-600 py-1">{d}</div>)}
                    </div>
                    <div className="grid grid-cols-7 gap-y-1">
                        {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
                        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                            const key    = getCellKey(day);
                            const events = eventMap[key] || [];
                            const isToday = key === todayKey;
                            const isSel   = key === selectedDate;
                            const hasW    = events.some(e => e.type === 'workshop');
                            const hasC    = events.some(e => e.type === 'course');
                            return (
                                <button key={day} onClick={() => setSelectedDate(isSel ? null : key)}
                                    className={`relative flex flex-col items-center justify-start pt-1 pb-1.5 rounded-lg min-h-[44px] transition-all text-sm font-medium
                                        ${isSel   ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' :
                                          isToday ? 'bg-white/[0.06] text-amber-400 ring-1 ring-amber-500/40' :
                                          events.length > 0 ? 'hover:bg-white/[0.05] text-white cursor-pointer' :
                                          'text-zinc-600 hover:bg-white/[0.03] cursor-pointer'}`}>
                                    <span>{day}</span>
                                    {events.length > 0 && (
                                        <div className="flex gap-0.5 mt-0.5">
                                            {hasW && <span className={`w-1.5 h-1.5 rounded-full ${isSel ? 'bg-black' : 'bg-amber-400'}`} />}
                                            {hasC && <span className={`w-1.5 h-1.5 rounded-full ${isSel ? 'bg-black/60' : 'bg-sky-400'}`} />}
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Events panel */}
                <div className="p-4 flex flex-col gap-2 overflow-y-auto max-h-[420px]">
                    {selectedDate ? (
                        <>
                            <div className="flex items-center justify-between mb-2">
                                <div>
                                    <p className="text-white font-bold text-sm">
                                        {(() => { const [y,m,d] = selectedDate.split('-'); return `${parseInt(d)} ${AR_MONTHS[parseInt(m)-1]} ${y}`; })()}
                                    </p>
                                    <p className="text-zinc-600 text-[10px] mt-0.5">{selectedEvents.length} حدث</p>
                                </div>
                                <button onClick={() => setSelectedDate(null)}
                                    className="text-[10px] text-zinc-500 hover:text-zinc-300 transition-colors border border-white/[0.07] rounded-lg px-2 py-1">
                                    ✕ إغلاق
                                </button>
                            </div>
                            {selectedEvents.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-8 text-center gap-2">
                                    <Calendar className="w-8 h-8 text-zinc-800" />
                                    <p className="text-zinc-600 text-xs">لا توجد أحداث في هذا اليوم</p>
                                </div>
                            ) : (
                                selectedEvents.map((ev, idx) => (
                                    <div key={idx} className={`rounded-xl border overflow-hidden ${ev.type === 'workshop' ? 'border-amber-500/20 bg-amber-500/5' : 'border-sky-500/20 bg-sky-500/5'}`}>
                                        <div className={`px-3 py-1.5 flex items-center justify-between ${ev.type === 'workshop' ? 'bg-amber-500/10' : 'bg-sky-500/10'}`}>
                                            <span className={`text-[10px] font-bold ${ev.type === 'workshop' ? 'text-amber-400' : 'text-sky-400'}`}>
                                                {ev.type === 'workshop' ? 'جلسة' : 'برنامج'}
                                            </span>
                                            {renderStatusBadge(ev)}
                                        </div>
                                        <div className="p-3 flex flex-col gap-2">
                                            <p className="text-white text-xs font-bold">{ev.label}</p>
                                            {ev.time && (
                                                <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
                                                    <Clock className="w-3 h-3 text-amber-400/70" /><span>{ev.time}</span>
                                                </div>
                                            )}
                                            {ev.type === 'workshop' && ev.capacity != null && (
                                                <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
                                                    <Sparkles className="w-3 h-3 text-amber-400/70" />
                                                    <span>{ev.rawParticipants ?? ev.participants ?? 0}/{ev.capacity} مشارك
                                                        {ev.rawParticipants >= ev.capacity && <span className="text-green-400 mr-1">(ممتلئ)</span>}
                                                    </span>
                                                </div>
                                            )}
                                            {ev.type === 'course' && ev.capacity != null && (
                                                <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
                                                    <Sparkles className="w-3 h-3 text-sky-400/70" />
                                                    <span>{ev.enrolledStudents ?? 0}/{ev.capacity} مسجّل
                                                        {ev.enrolledStudents >= ev.capacity && <span className="text-green-400 mr-1">(ممتلئ)</span>}
                                                    </span>
                                                </div>
                                            )}
                                            {ev.totalPrice && (
                                                <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
                                                    <span className="text-[8px] font-bold text-amber-400/70">DA</span>
                                                    <span>الإيرادات: <span className="text-amber-300 font-bold">{ev.totalPrice}</span></span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </>
                    ) : (
                        <>
                            <p className="text-zinc-500 text-xs font-semibold mb-1">جميع الأحداث القادمة</p>
                            {(() => {
                                const upcoming = Object.entries(eventMap)
                                    .filter(([key]) => new Date(key).getTime() >= MODULE_NOW_TS)
                                    .sort(([a], [b]) => new Date(a) - new Date(b))
                                    .flatMap(([key, evs]) => evs.map(ev => ({ ...ev, key })));

                                if (upcoming.length === 0) return (
                                    <div className="flex flex-col items-center justify-center py-10 text-center gap-2">
                                        <Calendar className="w-10 h-10 text-zinc-800" />
                                        <p className="text-zinc-600 text-sm">لا توجد أحداث قادمة</p>
                                        <button onClick={() => onNavigate && onNavigate('sessions')} className="text-amber-500 hover:text-amber-400 text-xs font-semibold transition-colors mt-1">
                                            إضافة جلسة جديدة ←
                                        </button>
                                    </div>
                                );

                                return upcoming.map((ev, idx) => {
                                    const [, m, d] = ev.key.split('-');
                                    return (
                                        <button key={idx} onClick={() => setSelectedDate(ev.key)}
                                            className="flex items-start gap-3 py-2.5 px-2 border-b border-white/[0.04] last:border-0 hover:bg-white/[0.04] rounded-lg transition-colors text-right w-full">
                                            <div className={`w-10 h-10 rounded-lg flex flex-col items-center justify-center flex-shrink-0 ${ev.type === 'workshop' ? 'bg-amber-500/10' : 'bg-sky-500/10'}`}>
                                                <span className={`text-xs font-bold leading-none ${ev.type === 'workshop' ? 'text-amber-400' : 'text-sky-400'}`}>{parseInt(d)}</span>
                                                <span className={`text-[8px] mt-0.5 ${ev.type === 'workshop' ? 'text-amber-500/70' : 'text-sky-500/70'}`}>{AR_MONTHS[parseInt(m)-1]}</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-white text-xs font-semibold truncate">{ev.label}</p>
                                                <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                                                    <span className={`text-[9px] font-semibold ${ev.type === 'workshop' ? 'text-amber-400' : 'text-sky-400'}`}>
                                                        {ev.type === 'workshop' ? 'جلسة' : 'برنامج'}
                                                    </span>
                                                    {ev.time && <span className="text-zinc-600 text-[9px]">• {ev.time}</span>}
                                                    {renderStatusBadge(ev)}
                                                </div>
                                            </div>
                                        </button>
                                    );
                                });
                            })()}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

// ─── Main CoachDashboard ──────────────────────────────────────
const CoachDashboard = ({ onNavigate }) => {
    const profile  = COACH_PROFILE;
    const earnings = EARNINGS;
    const bookings = BOOKINGS;

    const workshopBookings  = bookings.filter(b => b.category === 'جلسة');
    const courseBookings    = bookings.filter(b => b.category === 'برنامج');
    const pendingBookings   = bookings.filter(b => b.status === 'قيد الانتظار');
    const cancelledBookings = bookings.filter(b => b.status === 'ملغي');

    const activeWorkshops    = workshopBookings.filter(b => getAvailabilityStatus(b) === 'نشط');
    const completedWorkshops = workshopBookings.filter(b => getAvailabilityStatus(b) === 'مكتمل');
    const activeCourses      = courseBookings.filter(b => getAvailabilityStatus(b) === 'نشط');
    const completedCourses   = courseBookings.filter(b => getAvailabilityStatus(b) === 'مكتمل');

    const firstName = profile?.fullName?.split(' ')[0] || '';

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-6" dir="rtl">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-black bg-gradient-to-l from-amber-400 to-yellow-300
                                   bg-clip-text text-transparent mb-1">
                        {firstName ? `أهلاً، ${firstName}` : 'لوحة التحكم'}
                    </h1>
                    <p className="text-zinc-500 text-sm">Coach Dashboard · أدِر جلساتك وبرامجك التدريبية وتابع أرباحك</p>
                </div>

                {/* Pending alert */}
                {pendingBookings.length > 0 && (
                    <div className="mb-5 bg-amber-500/10 border border-amber-500/25 rounded-2xl px-5 py-4 flex items-center gap-3">
                        <div className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-pulse flex-shrink-0" />
                        <p className="text-amber-300 text-sm font-medium">
                            لديك <span className="font-bold text-amber-400">{pendingBookings.length}</span> حجز{pendingBookings.length > 1 ? 'ات' : ''} في انتظار تأكيد الدفع من الإدارة
                        </p>
                    </div>
                )}

                {/* Stats row 1 */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
                    <StatCard icon={Calendar}   label="الجلسات النشطة"          value={fmt(activeWorkshops.length)}  sub={`${completedWorkshops.length} مكتملة`}   color={{ bg: 'bg-amber-500/10',  text: 'text-amber-400'  }} onClick={() => onNavigate && onNavigate('sessions')} />
                    <StatCard icon={BookOpen}   label="البرامج التدريبية النشطة" value={fmt(activeCourses.length)}    sub={`${completedCourses.length} مكتملة`}    color={{ bg: 'bg-sky-500/10',    text: 'text-sky-400'    }} onClick={() => onNavigate && onNavigate('courses')} />
                    <StatCard icon={DollarSign} label="أرباح هذا الشهر"         value={`DA ${fmt(earnings.stats?.thisMonth)}`}                                       color={{ bg: 'bg-emerald-500/10', text: 'text-emerald-400' }} onClick={() => onNavigate && onNavigate('earnings')} />
                    <StatCard icon={Star}       label="عمولة المنصة"             value={`${earnings.stats.commissionRates.workshop}% / ${earnings.stats.commissionRates.course}%`} sub="جلسة / برنامج" color={{ bg: 'bg-violet-500/10', text: 'text-violet-400' }} onClick={null} />
                </div>

                {/* Stats row 2 */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                    <StatCard icon={Sparkles}    label="مجموع الحجوزات"            value={fmt(bookings.length)}                                  color={{ bg: 'bg-indigo-500/10', text: 'text-indigo-400' }} onClick={() => onNavigate && onNavigate('bookings')} />
                    <StatCard icon={Clock}       label="حجوزات معلّقة"             value={fmt(pendingBookings.length)}   sub="بانتظار الإدارة"   color={{ bg: 'bg-orange-500/10', text: 'text-orange-400' }} onClick={() => onNavigate && onNavigate('bookings')} />
                    <StatCard icon={CheckCircle} label="جلسات + برامج مكتملة"     value={fmt(completedWorkshops.length + completedCourses.length)} color={{ bg: 'bg-teal-500/10',   text: 'text-teal-400'   }} onClick={null} />
                    <StatCard icon={XCircle}     label="حجوزات ملغية"              value={fmt(cancelledBookings.length)}                          color={{ bg: 'bg-red-500/10',    text: 'text-red-400'    }} onClick={null} />
                </div>

                {/* Calendar */}
                <CalendarSection
                    workshopBookings={workshopBookings}
                    courseBookings={courseBookings}
                    onNavigate={onNavigate}
                />
            </div>
        </div>
    );
};

export default CoachDashboard;