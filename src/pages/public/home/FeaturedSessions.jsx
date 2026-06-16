import { useState } from 'react';
import { Heart, Star, MapPin, Wifi, Clock, Users } from 'lucide-react';
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

    const toggleFav = id => setFavorites(prev => {
        const next = new Set(prev);
        next.has(id) ? next.delete(id) : next.add(id);
        return next;
    });

    return (
        <section className="py-20 bg-[#0A0A0B]">
            <div className="container mx-auto px-6">
                <div className="flex items-end justify-between mb-10">
                    <div>
                        <h2 className="text-3xl font-extrabold text-white mb-1">
                            جلسات <span className="text-amber-400">كوتشينغ مميزة</span>
                        </h2>
                        <p className="text-sm text-zinc-500">اختر الجلسة الأنسب لتطوير مسيرتك المهنية</p>
                    </div>
                    <button onClick={() => onNavigate?.('sessions')} className="text-amber-500 text-sm font-semibold hover:text-amber-400 transition">
                        عرض الكل ←
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {sessions.map(session => {
                        const isFav  = favorites.has(session._id);
                        const isFree = !session.price || session.price === 0;
                        const isFull = (session.availableSeats ?? 0) <= 0;
                        const isOnline = session.format === 'online';
                        const duration = fmt(session.durationHours, session.durationMinutes);

                        return (
                            <div
                                key={session._id}
                                className="group bg-[#18181B] border border-[#2A2A30] rounded-2xl overflow-hidden hover:border-amber-500 hover:-translate-y-1 transition-all"
                            >
                                {/* Image */}
                                <div className="relative h-44 overflow-hidden">
                                    <img
                                        src={resolveImg(session.image)}
                                        alt={session.type}
                                        onError={e => { e.target.src = FALLBACK; }}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <button
                                        onClick={() => toggleFav(session._id)}
                                        className={`absolute top-3 left-3 w-8 h-8 rounded-full flex items-center justify-center transition ${isFav ? 'bg-amber-500 text-black' : 'bg-black/60 text-zinc-300 hover:bg-amber-500 hover:text-black'}`}
                                    >
                                        <Heart className={`w-4 h-4 ${isFav ? 'fill-black' : ''}`} />
                                    </button>
                                    {isFull  && <span className="absolute top-3 right-3 bg-red-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">مكتملة</span>}
                                    {isFree && !isFull && <span className="absolute top-3 right-3 bg-green-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">مجانية</span>}
                                </div>

                                {/* Body */}
                                <div className="p-4">
                                    <span className="inline-block bg-amber-500/15 text-amber-400 text-[10px] font-semibold px-2.5 py-0.5 rounded-md mb-2">
                                        {session.type || 'كوتشينغ'}
                                    </span>

                                    {session.rating && (
                                        <div className="flex items-center gap-1 text-amber-400 text-xs mb-1.5">
                                            <Star className="w-3 h-3 fill-amber-400" />
                                            <span className="font-semibold">{session.rating}</span>
                                            <span className="text-zinc-500">({session.reviews})</span>
                                        </div>
                                    )}

                                    <h3 className="text-sm font-bold text-white leading-snug mb-2">{session.title}</h3>

                                    <div className="flex flex-wrap gap-2 text-[11px] text-zinc-500 mb-3">
                                        {isOnline
                                            ? <span className="flex items-center gap-1"><Wifi className="w-3 h-3" />أونلاين</span>
                                            : <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{session.location || 'غير محدد'}</span>
                                        }
                                        {duration && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{duration}</span>}
                                        {session.availableSeats > 0 && <span className="flex items-center gap-1"><Users className="w-3 h-3" />{session.availableSeats} مقعد</span>}
                                    </div>

                                    <div className="flex items-center justify-between">
                                        {isFree
                                            ? <span className="text-lg font-black text-green-400">مجانية</span>
                                            : <span className="text-lg font-black text-amber-400">{session.price?.toLocaleString('ar-DZ')} <span className="text-xs text-zinc-500 font-normal">دج</span></span>
                                        }
                                        <button
                                            disabled={isFull}
                                            onClick={() => onNavigate?.('session-detail', session._id)}
                                            className={`text-xs font-bold px-4 py-1.5 rounded-lg transition ${isFull ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed' : 'bg-white text-black hover:bg-amber-400'}`}
                                        >
                                            {isFull ? 'مكتملة' : 'احجز الآن'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default FeaturedSessions;