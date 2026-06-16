import { useState } from 'react';
import { Heart, BookOpen, User, Star, Trash2, Eye, Search, X, CalendarCheck } from 'lucide-react';
import { FAVORITES as MOCK_FAVORITES } from '../../utils/mockData';

const LearnerFavorites = () => {
    const [favorites, setFavorites] = useState(MOCK_FAVORITES);
    const [filter, setFilter]       = useState('all');
    const [search, setSearch]       = useState('');

    const handleRemove = (favId) => {
        setFavorites(prev => prev.filter(f => f.id !== favId));
    };

    const counts = {
        all:     favorites.length,
        coach:   favorites.filter(f => f.type === 'coach').length,
        session: favorites.filter(f => f.type === 'session').length,
        course:  favorites.filter(f => f.type === 'course').length,
    };

    const filtered = favorites.filter(f => {
        const mt = filter === 'all' || f.type === filter;
        const ms = !search ||
            (f.title || '').toLowerCase().includes(search.toLowerCase()) ||
            (f.instructor || '').toLowerCase().includes(search.toLowerCase());
        return mt && ms;
    });

    const typeConfig = (t) => {
        if (t === 'coach')   return { label: 'كوتش',    badge: 'bg-sky-500/10 text-sky-400',     border: 'border-sky-500/20',    icon: User        };
        if (t === 'session') return { label: 'جلسة',    badge: 'bg-amber-500/10 text-amber-400', border: 'border-amber-500/20',  icon: CalendarCheck };
        return                      { label: 'دورة',    badge: 'bg-violet-500/10 text-violet-400', border: 'border-violet-500/20', icon: BookOpen    };
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-6" dir="rtl">
            <div className="max-w-5xl mx-auto">

                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-black bg-gradient-to-l from-rose-400 to-pink-300
                                   bg-clip-text text-transparent mb-1">
                        المفضلة
                    </h1>
                    <p className="text-zinc-500 text-sm">Favorites · {favorites.length} عنصر</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-3 mb-5">
                    {[
                        { key: 'all',     ar: 'الكل',    value: counts.all,     icon: Heart,         color: 'text-rose-400',    bg: 'bg-rose-500/10'    },
                        { key: 'coach',   ar: 'كوتشات',  value: counts.coach,   icon: User,          color: 'text-sky-400',     bg: 'bg-sky-500/10'     },
                        { key: 'session', ar: 'جلسات',   value: counts.session, icon: CalendarCheck, color: 'text-amber-400',   bg: 'bg-amber-500/10'   },
                        { key: 'course',  ar: 'دورات',   value: counts.course,  icon: BookOpen,      color: 'text-violet-400',  bg: 'bg-violet-500/10'  },
                    ].map(s => (
                        <button key={s.key} onClick={() => setFilter(s.key)}
                                className={`bg-[#111] border rounded-2xl p-3 flex flex-col items-center gap-1.5 transition-all
                                            ${filter === s.key ? 'border-rose-500/30' : 'border-white/[0.07] hover:border-white/[0.12]'}`}>
                            <div className={`p-2 rounded-xl ${s.bg}`}>
                                <s.icon className={`w-4 h-4 ${s.color}`} />
                            </div>
                            <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
                            <p className="text-[10px] text-zinc-600">{s.ar}</p>
                        </button>
                    ))}
                </div>

                {/* Search */}
                <div className="relative mb-5">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                    <input type="text" dir="rtl"
                           placeholder="ابحث في المفضلة..."
                           value={search} onChange={e => setSearch(e.target.value)}
                           className="w-full bg-[#111] border border-white/[0.07] rounded-xl py-3 pr-10 pl-4
                                      text-sm focus:outline-none focus:border-rose-500/40 transition-colors
                                      placeholder-zinc-600 text-white" />
                    {search && (
                        <button onClick={() => setSearch('')} className="absolute left-3 top-1/2 -translate-y-1/2">
                            <X className="w-4 h-4 text-zinc-500 hover:text-white" />
                        </button>
                    )}
                </div>

                {/* Grid */}
                {filtered.length === 0 ? (
                    <div className="text-center py-20">
                        <Heart className="w-14 h-14 text-zinc-800 mx-auto mb-3" />
                        <p className="text-zinc-600 text-sm">لا توجد مفضلات</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filtered.map(item => {
                            const tc   = typeConfig(item.type);
                            const Icon = tc.icon;
                            return (
                                <div key={item.id}
                                     className="bg-[#111] border border-white/[0.07] hover:border-white/[0.14]
                                                rounded-2xl overflow-hidden transition-all group hover:scale-[1.01]">
                                    {/* Image */}
                                    <div className="relative h-44 overflow-hidden bg-zinc-900">
                                        {item.image ? (
                                            <img src={item.image} alt={item.title}
                                                 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                 onError={e => { e.target.style.display = 'none'; }} />
                                        ) : (
                                            <div className={`w-full h-full flex items-center justify-center
                                                             bg-gradient-to-br ${item.avatarColor || 'from-zinc-700 to-zinc-800'}`}>
                                                <Icon className="w-14 h-14 text-white/30" />
                                            </div>
                                        )}
                                        {/* Type badge */}
                                        <div className="absolute top-3 right-3">
                                            <span className={`text-[10px] font-bold px-2 py-1 rounded-full border
                                                              ${tc.badge} ${tc.border}`}>
                                                {tc.label}
                                            </span>
                                        </div>
                                        {/* Remove heart */}
                                        <button onClick={() => handleRemove(item.id)}
                                                className="absolute top-3 left-3 bg-rose-500/80 hover:bg-rose-500
                                                           text-white p-1.5 rounded-full transition-all">
                                            <Heart className="w-3.5 h-3.5 fill-current" />
                                        </button>
                                        {/* Price */}
                                        {item.price != null && (
                                            <div className="absolute bottom-3 left-3 bg-amber-500 text-black
                                                            font-black text-xs px-2.5 py-1 rounded-full shadow-lg">
                                                {item.price === 0 ? 'مجاني' : `${Number(item.price).toLocaleString()} DA`}
                                            </div>
                                        )}
                                    </div>

                                    {/* Body */}
                                    <div className="p-4">
                                        <h3 className="font-black text-sm text-white mb-1 truncate text-right">
                                            {item.title}
                                        </h3>
                                        {item.instructor && (
                                            <p className="text-xs text-zinc-500 flex items-center gap-1 justify-end mb-1">
                                                <User className="w-3 h-3" />{item.instructor}
                                            </p>
                                        )}
                                        {item.rating != null && (
                                            <div className="flex items-center justify-end gap-1">
                                                <span className="text-xs text-zinc-400">{item.rating}</span>
                                                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                                            </div>
                                        )}
                                        <div className="flex gap-2 mt-3 pt-3 border-t border-white/[0.06]">
                                            <button className="flex-1 bg-amber-500 hover:bg-amber-400 text-black
                                                               font-black text-xs py-2 rounded-xl transition-all
                                                               flex items-center justify-center gap-1">
                                                <Eye className="w-3.5 h-3.5" />
                                                عرض
                                            </button>
                                            <button onClick={() => handleRemove(item.id)}
                                                    className="bg-red-500/10 hover:bg-red-500 text-red-400
                                                               hover:text-white p-2 rounded-xl transition-all">
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
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

export default LearnerFavorites;