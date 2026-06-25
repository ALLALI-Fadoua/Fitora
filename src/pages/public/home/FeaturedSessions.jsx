import { useState } from 'react';
import { Heart, Star, MapPin, Wifi, Clock, Users, ArrowLeft } from 'lucide-react';
import { SESSIONS } from '../../../utils/mockData';

const FALLBACK = 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=600';

const fmt = (h = 0, m = 0) => {
    const parts = [];
    if (h) parts.push(`${h}س`);
    if (m) parts.push(`${m}د`);
    return parts.join(' ') || null;
};

const resolveImg = img => {
    if (!img) return FALLBACK;
    if (img.startsWith('http')) return img;
    return `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${img}`;
};

const FeaturedSessions = ({ onNavigate }) => {
    const [sessions] = useState(SESSIONS);
    const [favorites, setFavorites] = useState(new Set());
    const [active, setActive] = useState(0);

    const toggleFav = (e, id) => {
        e.stopPropagation();
        setFavorites(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const current = sessions[active];
    const isFree = !current?.price || current.price === 0;
    const isFull = (current?.availableSeats ?? 0) <= 0;
    const isOnline = current?.format === 'online';
    const duration = fmt(current?.durationHours, current?.durationMinutes);

    return (
        <section className="py-20 bg-[#0A0A0B]">
            <div className="container mx-auto px-6">
                {/* Header */}
                <div className="flex items-end justify-between mb-10">
                    <div>
                        <p className="text-xs text-emerald-500 font-semibold uppercase tracking-widest mb-2">جلسات التدريب</p>
                        <h2 className="text-3xl font-extrabold text-white">
                            جلسات <span className="text-emerald-400">مميزة</span>
                        </h2>
                    </div>
                    <button onClick={() => onNavigate?.('sessions')} className="flex items-center gap-2 text-emerald-500 text-sm font-semibold hover:text-emerald-400 transition">
                        عرض الكل <ArrowLeft className="w-4 h-4" />
                    </button>
                </div>

                {/* Layout: tabs list + featured panel */}
                <div className="flex gap-6 flex-col lg:flex-row">
                    {/* Left: session tabs */}
                    <div className="flex flex-col gap-3 lg:w-64 shrink-0">
                        {sessions.map((session, i) => {
                            const isFav = favorites.has(session._id);
                            const free = !session.price || session.price === 0;
                            const full = (session.availableSeats ?? 0) <= 0;
                            return (
                                <button
                                    key={session._id}
                                    onClick={() => setActive(i)}
                                    className={`w-full text-right p-4 rounded-2xl border transition-all ${i === active ? 'bg-emerald-500/10 border-emerald-500 text-white' : 'bg-[#18181B] border-[#2A2A30] text-zinc-400 hover:border-zinc-600'}`}
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex flex-col gap-1 flex-1 min-w-0">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md self-start ${i === active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-700/40 text-zinc-500'}`}>
                                                {session.type}
                                            </span>
                                            <p className="text-sm font-semibold leading-snug line-clamp-2 text-right">
                                                {session.title}
                                            </p>
                                            <p className={`text-sm font-black mt-1 ${free ? 'text-green-400' : 'text-emerald-400'}`}>
                                                {free ? 'مجانية' : `${session.price?.toLocaleString('ar-DZ')} دج`}
                                            </p>
                                        </div>
                                        {full && (
                                            <span className="text-[9px] font-bold bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded shrink-0">مكتمل</span>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Right: featured card */}
                    {current && (
                        <div className="flex-1 bg-[#18181B] border border-[#2A2A30] rounded-2xl overflow-hidden flex flex-col lg:flex-row">
                            {/* Image */}
                            <div className="relative lg:w-72 h-56 lg:h-auto shrink-0 overflow-hidden">
                                <img
                                    src={resolveImg(current.image)}
                                    alt={current.title}
                                    onError={e => { e.target.src = FALLBACK; }}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:bg-gradient-to-l" />
                                <button
                                    onClick={e => toggleFav(e, current._id)}
                                    className={`absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center transition ${favorites.has(current._id) ? 'bg-emerald-500 text-black' : 'bg-black/60 text-zinc-300 hover:bg-emerald-500 hover:text-black'}`}
                                >
                                    <Heart className={`w-4 h-4 ${favorites.has(current._id) ? 'fill-black' : ''}`} />
                                </button>
                                {isFull && (
                                    <span className="absolute top-4 left-4 bg-red-500/90 text-white text-[10px] font-bold px-2 py-1 rounded-md">مكتملة</span>
                                )}
                                {isFree && !isFull && (
                                    <span className="absolute top-4 left-4 bg-green-500/90 text-white text-[10px] font-bold px-2 py-1 rounded-md">مجانية</span>
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex flex-col justify-between p-7 flex-1">
                                <div>
                                    <span className="inline-block bg-emerald-500/15 text-emerald-400 text-[11px] font-bold px-3 py-1 rounded-lg mb-4">
                                        {current.type || 'تدريب رياضي'}
                                    </span>

                                    <h3 className="text-2xl font-black text-white leading-snug mb-4">
                                        {current.title}
                                    </h3>

                                    {current.rating && (
                                        <div className="flex items-center gap-1.5 mb-5">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={`w-4 h-4 ${i < Math.floor(current.rating) ? 'fill-emerald-400 text-emerald-400' : 'text-zinc-700'}`} />
                                            ))}
                                            <span className="text-sm font-bold text-white mr-1">{current.rating}</span>
                                            <span className="text-xs text-zinc-500">({current.reviews} تقييم)</span>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-2 gap-3 mb-6">
                                        {[
                                            {
                                                icon: isOnline ? Wifi : MapPin,
                                                label: 'المكان',
                                                value: isOnline ? 'أونلاين' : (current.location || 'غير محدد'),
                                            },
                                            duration && { icon: Clock, label: 'المدة', value: duration },
                                            current.availableSeats > 0 && { icon: Users, label: 'المقاعد المتاحة', value: `${current.availableSeats} مقعد` },
                                        ].filter(Boolean).map((item, i) => (
                                            <div key={i} className="flex items-start gap-2 bg-[#111113] rounded-xl p-3">
                                                <item.icon className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                                                <div>
                                                    <p className="text-[10px] text-zinc-600 mb-0.5">{item.label}</p>
                                                    <p className="text-xs font-semibold text-white">{item.value}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between border-t border-[#2A2A30] pt-5">
                                    <div>
                                        <p className="text-[10px] text-zinc-600 mb-0.5">السعر</p>
                                        {isFree
                                            ? <p className="text-2xl font-black text-green-400">مجانية</p>
                                            : <p className="text-2xl font-black text-emerald-400">{current.price?.toLocaleString('ar-DZ')} <span className="text-xs text-zinc-500 font-normal">دج</span></p>
                                        }
                                    </div>
                                    <button
                                        disabled={isFull}
                                        onClick={() => onNavigate?.('session-detail', current._id)}
                                        className={`px-8 py-3 rounded-xl text-sm font-black transition hover:-translate-y-0.5 ${isFull ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed' : 'bg-emerald-500 text-black hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.25)]'}`}
                                    >
                                        {isFull ? 'مكتملة' : 'احجز الآن'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default FeaturedSessions;