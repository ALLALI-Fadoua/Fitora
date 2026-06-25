import { useState, useEffect } from 'react';

const heroSlides = [
    {
        title: 'طوّر جسمك مع\nأفضل مدربي اللياقة',
        description: 'جلسات تدريب رياضي احترافية، برامج تغذية معتمدة، ومدربون متخصصون\nكل ما تحتاجه لتحقيق هدفك الرياضي في مكان واحد',
        image: 'https://images.pexels.com/photos/1547248/pexels-photo-1547248.jpeg?auto=compress&cs=tinysrgb&w=1920',
    },
    {
        title: 'جلسات تدريب\nشخصي حصرية',
        description: 'تمرّن مع نخبة من مدربي اللياقة البدنية المعتمدين',
        image: 'https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&cs=tinysrgb&w=1920',
    },
    {
        title: 'اكتشف برامج\nاللياقة البدنية',
        description: 'برامج تدريبية متكاملة مع شهادات معتمدة دولياً',
        image: 'https://images.pexels.com/photos/2261477/pexels-photo-2261477.jpeg?auto=compress&cs=tinysrgb&w=1920',
    },
];

const stats = [
    { value: '+1,200', label: 'جلسة تدريب متاحة' },
    { value: '+340',   label: 'برنامج رياضي' },
    { value: '+180',   label: 'مدرب لياقة محترف' },
    { value: '+15K',   label: 'متدرب نشط' },
];

const Hero = ({ onNavigate }) => {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const t = setInterval(() => setCurrent(p => (p + 1) % heroSlides.length), 5000);
        return () => clearInterval(t);
    }, []);

    return (
        <section className="relative h-[580px] overflow-hidden flex items-center justify-center">
            {/* Background */}
            <div className="absolute inset-0 bg-[#0A0A0B]" />
            {/* Grid */}
            <div
                className="absolute inset-0 opacity-30"
                style={{
                    backgroundImage: 'linear-gradient(#2A2A30 1px, transparent 1px), linear-gradient(90deg, #2A2A30 1px, transparent 1px)',
                    backgroundSize: '60px 60px',
                }}
            />
            {/* Glow */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/10 blur-3xl rounded-full pointer-events-none" />

            {/* Slide images */}
            {heroSlides.map((slide, i) => (
                <div
                    key={i}
                    className={`absolute inset-0 transition-opacity duration-1000 ${i === current ? 'opacity-20' : 'opacity-0'}`}
                >
                    <img src={slide.image} alt="" className="w-full h-full object-cover" />
                </div>
            ))}

            {/* Content */}
            <div className="relative z-10 text-center px-6 max-w-3xl">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-4 py-1 text-xs text-emerald-400 mb-6">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    منصة التدريب الرياضي واللياقة البدنية الذكية                         
                </div>

                <h1 className="text-4xl md:text-6xl font-black leading-tight mb-4 bg-gradient-to-r from-white via-emerald-300 to-white bg-clip-text text-transparent whitespace-pre-line">
                    {heroSlides[current].title}
                </h1>
                <p className="text-base md:text-lg text-zinc-400 mb-8 leading-relaxed whitespace-pre-line">
                    {heroSlides[current].description}
                </p>

                <div className="flex gap-3 justify-center flex-wrap mb-10">
                    <button
                        onClick={() => onNavigate?.('sessions')}
                        className="bg-emerald-500 text-black px-8 py-3 rounded-xl font-bold text-sm hover:bg-emerald-400 transition hover:-translate-y-0.5 shadow-[0_0_30px_rgba(16,185,129,0.3)]"
                    >
                        احجز جلسة تدريب الآن
                    </button>
                    <button
                        onClick={() => onNavigate?.('courses')}
                        className="bg-transparent border border-[#383840] text-white px-8 py-3 rounded-xl font-bold text-sm hover:border-emerald-500 hover:text-emerald-400 transition"
                    >
                        استكشف البرامج الرياضية
                    </button>
                </div>

                <div className="flex items-center justify-center gap-8 flex-wrap">
                    {stats.map((s, i) => (
                        <div key={i} className="text-center">
                            <p className="text-2xl font-black text-emerald-400">{s.value}</p>
                            <p className="text-xs text-zinc-500">{s.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Dots */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
                {heroSlides.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrent(i)}
                        className={`h-1.5 rounded-full transition-all ${i === current ? 'w-5 bg-emerald-500' : 'w-1.5 bg-[#383840]'}`}
                    />
                ))}
            </div>
        </section>
    );
};

export default Hero;