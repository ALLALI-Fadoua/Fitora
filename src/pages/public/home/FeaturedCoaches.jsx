import { MapPin, Briefcase, Star, CheckCircle } from 'lucide-react';
import { COACHES } from '../../../utils/mockData';

const FeaturedCoaches = ({ onNavigate }) => (
    <section className="py-20 bg-[#0A0A0B]">
        <div className="container mx-auto px-6">
            <div className="flex items-end justify-between mb-10">
                <div>
                    <h2 className="text-3xl font-extrabold text-white mb-1">
                        كوتشات <span className="text-amber-400">مميزون</span>
                    </h2>
                    <p className="text-sm text-zinc-500">تعرف على أفضل المدربين والكوتشات لدينا</p>
                </div>
                <button onClick={() => onNavigate?.('coaches')} className="text-amber-500 text-sm font-semibold hover:text-amber-400 transition">
                    عرض الكل ←
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {COACHES.map(coach => {
                    const name = coach.coachingName || coach.fullName || '?';
                    return (
                        <div
                            key={coach._id}
                            className="bg-[#18181B] border border-[#2A2A30] rounded-2xl p-5 text-center hover:border-amber-500 hover:-translate-y-1 transition-all cursor-pointer group"
                            onClick={() => onNavigate?.('coach-profile', coach.userId)}
                        >
                            {/* Avatar */}
                            <div className="relative w-20 h-20 mx-auto mb-4">
                                <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${coach.avatarColor} flex items-center justify-center text-2xl font-black text-white`}>
                                    {name.charAt(0)}
                                </div>
                                {coach.isVerified && (
                                    <div className="absolute bottom-0.5 right-0.5 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center border-2 border-[#18181B]">
                                        <CheckCircle className="w-3 h-3 text-black fill-black" />
                                    </div>
                                )}
                            </div>

                            <h3 className="text-sm font-bold text-white mb-1">{name}</h3>
                            <p className="text-xs text-amber-400 font-semibold mb-3">{coach.specialty}</p>

                            <div className="flex flex-col gap-1 mb-3 text-[11px] text-zinc-500">
                                {coach.location
                                    ? <span className="flex items-center justify-center gap-1"><MapPin className="w-3 h-3" />{coach.location}</span>
                                    : <span className="flex items-center justify-center gap-1"><MapPin className="w-3 h-3" />أونلاين فقط</span>
                                }
                                {coach.experience > 0 && (
                                    <span className="flex items-center justify-center gap-1">
                                        <Briefcase className="w-3 h-3" />
                                        {coach.experience} {coach.experience === 1 ? 'سنة خبرة' : 'سنوات خبرة'}
                                    </span>
                                )}
                            </div>

                            {coach.rating && (
                                <div className="flex items-center justify-center gap-1 text-amber-400 text-xs font-bold mb-4">
                                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                                    {coach.rating}
                                    <span className="text-zinc-600 font-normal">({coach.reviews} تقييم)</span>
                                </div>
                            )}

                            <button className="w-full bg-[#1E1E22] border border-[#383840] text-white rounded-lg py-2 text-xs font-bold group-hover:bg-amber-500 group-hover:text-black group-hover:border-amber-500 transition">
                                زيارة الملف
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    </section>
);

export default FeaturedCoaches;