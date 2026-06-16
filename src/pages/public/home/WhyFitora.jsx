import { MapPin, Award, CheckCircle, Shield, Sparkles } from 'lucide-react';

const benefits = [
    { icon: MapPin,      text: 'جلسات أونلاين وبالحضور' },
    { icon: Award,       text: 'كوتشات معتمدون دولياً'  },
    { icon: CheckCircle, text: 'نتائج مضمونة'           },
    { icon: Shield,      text: 'شهادات موثوقة'          },
    { icon: Sparkles,    text: 'تجربة رقمية سهلة'       },
];

const WhyFITORA = () => (
    <section className="py-20 bg-[#111113]">
        <div className="container mx-auto px-6">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-extrabold text-white mb-2">
                    لماذا <span className="text-amber-400">FITORA؟</span>
                </h2>
                <p className="text-sm text-zinc-500 max-w-md mx-auto">
                    نقدم لك تجربة تدريبية فريدة تجمع بين الاحترافية والنتائج الملموسة
                </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {benefits.map((b, i) => (
                    <div
                        key={i}
                        className="bg-[#18181B] border border-[#2A2A30] rounded-2xl p-6 text-center hover:border-amber-500 hover:-translate-y-1 transition-all cursor-pointer group"
                    >
                        <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-amber-500/20 transition">
                            <b.icon className="w-5 h-5 text-amber-400" />
                        </div>
                        <p className="text-sm font-semibold text-white">{b.text}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

export default WhyFITORA;