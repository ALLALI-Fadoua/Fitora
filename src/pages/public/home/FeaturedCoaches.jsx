import { MapPin, Briefcase, Star, CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { COACHES } from '../../../utils/mockData';

const FeaturedCoaches = ({ onNavigate }) => {
    const [activeIdx, setActiveIdx] = useState(0);

    const prev = () => setActiveIdx(i => (i - 1 + COACHES.length) % COACHES.length);
    const next = () => setActiveIdx(i => (i + 1) % COACHES.length);

    const coach = COACHES[activeIdx];
    const name = coach.coachingName || coach.fullName || '?';

    return (
        <section className="py-20 bg-[#111113]">
            <div className="container mx-auto px-6">
                {/* Header */}
                <div className="flex items-end justify-between mb-10">
                    <div>
                        <p className="text-xs text-emerald-500 font-semibold uppercase tracking-widest mb-2">المدربون</p>
                        <h2 className="text-3xl font-extrabold text-white">
                            مدربون <span className="text-emerald-400">مميزون</span>
                        </h2>
                    </div>
                    <button onClick={() => onNavigate?.('coaches')} className="flex items-center gap-2 text-emerald-500 text-sm font-semibold hover:text-emerald-400 transition">
                        عرض الكل <ArrowLeft className="w-4 h-4" />
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    {/* Left: Featured coach big card */}
                    <div
                        className="relative bg-[#0A0A0B] border border-[#2A2A30] rounded-3xl p-8 cursor-pointer hover:border-emerald-500/50 transition-all overflow-hidden"
                        onClick={() => onNavigate?.('coach-profile', coach.userId)}
                    >
                        {/* Glow bg */}
                        <div className={`absolute top-0 right-0 w-64 h-64 rounded-full bg-gradient-to-br ${coach.avatarColor} opacity-5 blur-3xl pointer-events-none`} />

                        <div className="relative flex items-start gap-6">
                            {/* Avatar */}
                            <div className="relative shrink-0">
                                <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${coach.avatarColor} flex items-center justify-center text-4xl font-black text-white`}>
                                    {name.charAt(0)}
                                </div>
                                {coach.isVerified && (
                                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-[#0A0A0B]">
                                        <CheckCircle className="w-3.5 h-3.5 text-black fill-black" />
                                    </div>
                                )}
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-xl font-black text-white">{name}</h3>
                                </div>
                                <p className="text-sm text-emerald-400 font-semibold mb-3">{coach.specialty}</p>

                                <div className="flex flex-wrap gap-3 text-xs text-zinc-400 mb-4">
                                    {coach.location
                                        ? <span className="flex items-center gap-1.5 bg-[#18181B] rounded-lg px-3 py-1.5"><MapPin className="w-3.5 h-3.5 text-emerald-500" />{coach.location}</span>
                                        : <span className="flex items-center gap-1.5 bg-[#18181B] rounded-lg px-3 py-1.5"><MapPin className="w-3.5 h-3.5 text-emerald-500" />أونلاين فقط</span>
                                    }
                                    {coach.experience > 0 && (
                                        <span className="flex items-center gap-1.5 bg-[#18181B] rounded-lg px-3 py-1.5">
                                            <Briefcase className="w-3.5 h-3.5 text-emerald-500" />
                                            {coach.experience} {coach.experience === 1 ? 'سنة' : 'سنوات'} خبرة
                                        </span>
                                    )}
                                </div>

                                {coach.rating && (
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(coach.rating) ? 'fill-emerald-400 text-emerald-400' : 'text-zinc-700'}`} />
                                            ))}
                                        </div>
                                        <span className="text-sm font-bold text-white">{coach.rating}</span>
                                        <span className="text-xs text-zinc-500">({coach.reviews} تقييم)</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-[#2A2A30] flex items-center justify-between">
                            <button
                                onClick={e => { e.stopPropagation(); onNavigate?.('coach-profile', coach.userId); }}
                                className="bg-emerald-500 text-black px-6 py-2.5 rounded-xl text-sm font-black hover:bg-emerald-400 transition"
                            >
                                زيارة الملف
                            </button>
                            {/* Navigation */}
                            <div className="flex items-center gap-2">
                                <button onClick={e => { e.stopPropagation(); prev(); }} className="w-9 h-9 rounded-xl bg-[#18181B] border border-[#2A2A30] flex items-center justify-center text-zinc-400 hover:border-emerald-500 hover:text-emerald-400 transition">
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                                <span className="text-xs text-zinc-600">{activeIdx + 1}/{COACHES.length}</span>
                                <button onClick={e => { e.stopPropagation(); next(); }} className="w-9 h-9 rounded-xl bg-[#18181B] border border-[#2A2A30] flex items-center justify-center text-zinc-400 hover:border-emerald-500 hover:text-emerald-400 transition">
                                    <ArrowLeft className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right: Other coaches list */}
                    <div className="flex flex-col gap-3">
                        {COACHES.filter((_, i) => i !== activeIdx).map((c) => {
                            const n = c.coachingName || c.fullName || '?';
                            return (
                                <div
                                    key={c._id}
                                    className="flex items-center gap-4 bg-[#0A0A0B] border border-[#2A2A30] rounded-2xl p-4 cursor-pointer hover:border-emerald-500/50 hover:-translate-x-1 transition-all group"
                                    onClick={() => onNavigate?.('coach-profile', c.userId)}
                                >
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c.avatarColor} flex items-center justify-center text-lg font-black text-white shrink-0`}>
                                        {n.charAt(0)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1.5 mb-0.5">
                                            <p className="text-sm font-bold text-white truncate">{n}</p>
                                            {c.isVerified && <CheckCircle className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500 shrink-0" />}
                                        </div>
                                        <p className="text-xs text-zinc-500 truncate">{c.specialty}</p>
                                    </div>
                                    {c.rating && (
                                        <div className="flex items-center gap-1 shrink-0">
                                            <Star className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
                                            <span className="text-xs font-bold text-white">{c.rating}</span>
                                        </div>
                                    )}
                                    <button
                                        onClick={e => { e.stopPropagation(); setActiveIdx(COACHES.indexOf(c)); }}
                                        className="text-[10px] font-bold text-zinc-500 group-hover:text-emerald-400 transition shrink-0"
                                    >
                                        عرض
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeaturedCoaches;