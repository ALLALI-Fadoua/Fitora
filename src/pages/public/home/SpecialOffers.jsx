const SpecialOffers = ({ onNavigate }) => (
    <section className="py-20 bg-[#0A0A0B]">
        <div className="container mx-auto px-6">
            <div className="relative bg-[#1a1000] border border-amber-500/20 rounded-3xl p-14 text-center overflow-hidden">
                {/* Glow */}
                <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-40 bg-amber-500/10 blur-3xl rounded-full pointer-events-none" />

                <span className="relative inline-block bg-amber-500 text-black rounded-lg px-4 py-1 text-sm font-black mb-5">
                    ⚡ عرض لفترة محدودة
                </span>

                <h2 className="relative text-3xl md:text-4xl font-black text-white mb-3">
                    خصم <span className="text-amber-400">30%</span> على أول جلسة
                </h2>
                <p className="relative text-zinc-400 mb-8 text-base">
                    احصل على خصم حصري على أول جلسة كوتشينغ تحجزها — العرض ينتهي قريباً
                </p>

                <button
                    onClick={() => onNavigate?.('offers')}
                    className="relative bg-amber-500 text-black px-10 py-3 rounded-xl font-bold text-sm hover:bg-amber-400 transition hover:-translate-y-0.5 shadow-[0_0_30px_rgba(245,166,35,0.3)]"
                >
                    اكتشف العروض الآن
                </button>
            </div>
        </div>
    </section>
);

export default SpecialOffers;