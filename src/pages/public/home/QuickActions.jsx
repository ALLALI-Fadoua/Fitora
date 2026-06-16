import { Calendar, BookOpen, Users, Award } from 'lucide-react';

const actions = [
    { icon: Calendar, label: 'احجز جلسة كوتشينغ', sub: '1,200 جلسة متاحة', badge: '1,200', amber: true,  route: 'sessions' },
    { icon: BookOpen, label: 'الدورات التدريبية',  sub: '340 دورة متاحة',   badge: '340',   amber: true,  route: 'courses'  },
    { icon: Users,    label: 'تصفح الكوتشات',      sub: '180 كوتش محترف',   badge: null,    amber: false, route: 'coaches'  },
    { icon: Award,    label: 'الشهادات والبرامج',  sub: 'برامج معتمدة دولياً', badge: null, amber: false, route: 'programs' },
];

const QuickActions = ({ onNavigate }) => (
    <section className="py-16 bg-[#111113]">
        <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {actions.map((a, i) => (
                    <button
                        key={i}
                        onClick={() => onNavigate?.(a.route)}
                        className="group relative bg-[#18181B] border border-[#2A2A30] rounded-2xl p-6 text-center hover:border-amber-500 hover:-translate-y-1 transition-all text-right"
                    >
                        {a.badge && (
                            <span className="absolute top-3 left-3 bg-amber-500 text-black rounded-full px-2 py-0.5 text-[10px] font-bold">
                                {a.badge}
                            </span>
                        )}
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 ${a.amber ? 'bg-amber-500/15 text-amber-400' : 'bg-zinc-700/30 text-zinc-400'}`}>
                            <a.icon className="w-5 h-5" />
                        </div>
                        <p className="text-sm font-bold text-white">{a.label}</p>
                        <p className="text-xs text-zinc-500 mt-1">{a.sub}</p>
                    </button>
                ))}
            </div>
        </div>
    </section>
);

export default QuickActions;