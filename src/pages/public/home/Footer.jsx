import logo from '../../../assets/fitora-logo.png';

const Footer = () => (
    <footer className="bg-[#050505] border-t border-[#2A2A30] pt-14 pb-6 px-6">
        <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
                {/* Brand */}
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <img src={logo} alt="FITORA" className="h-9 w-auto object-contain" />
                        <span className="font-black text-xl bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
                            FITORA
                        </span>
                    </div>
                    <p className="text-zinc-500 text-sm leading-relaxed">
                        منصة تدريبية شاملة تجمع الكوتشات والمتدربين في مكان واحد لتحقيق النتائج المرجوة
                    </p>
                    <div className="flex gap-2 mt-4">
                        {['ti-brand-facebook','ti-brand-linkedin','ti-brand-instagram','ti-brand-youtube'].map(icon => (
                            <button
                                key={icon}
                                className="w-9 h-9 rounded-lg bg-[#18181B] border border-[#2A2A30] flex items-center justify-center text-zinc-400 hover:bg-emerald-500 hover:border-emerald-500 hover:text-black transition text-sm"
                            >
                                <i className={`ti ${icon}`} />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Links */}
                {[
                    { title: 'روابط سريعة', links: ['من نحن','اتصل بنا','الأسئلة الشائعة','المدونة'] },
                    { title: 'سياسات',      links: ['سياسة الخصوصية','شروط الاستخدام','سياسة الاسترجاع'] },
                    { title: 'الدعم',       links: ['مركز المساعدة','الإبلاغ عن مشكلة','شراكات'] },
                ].map(col => (
                    <div key={col.title}>
                        <h4 className="text-sm font-bold text-white mb-4">{col.title}</h4>
                        <ul className="space-y-2">
                            {col.links.map(link => (
                                <li key={link}>
                                    <a href="#" className="text-zinc-500 text-sm hover:text-emerald-400 transition">
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <div className="border-t border-[#2A2A30] pt-5 text-center text-zinc-600 text-xs">
                © 2025 FITORA. جميع الحقوق محفوظة — TRAIN SMARTER. LIVE STRONGER.
            </div>
        </div>
    </footer>
);

export default Footer;