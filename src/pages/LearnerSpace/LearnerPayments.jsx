import { useState } from 'react';
import {
    CreditCard, TrendingUp, CheckCircle2, Clock,
    Search, X, ChevronDown
} from 'lucide-react';
import { PAYMENTS as MOCK_PAYMENTS } from '../../utils/mockData';

const PAY_STATUS = {
    paid:     { ar: 'مدفوع',       en: 'Paid',     cls: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25' },
    pending:  { ar: 'في الانتظار', en: 'Pending',  cls: 'bg-amber-500/10  text-amber-400  border-amber-500/25'  },
    failed:   { ar: 'فشل',         en: 'Failed',   cls: 'bg-red-500/10    text-red-400    border-red-500/25'    },
    refunded: { ar: 'مسترد',       en: 'Refunded', cls: 'bg-sky-500/10    text-sky-400    border-sky-500/25'    },
};

const PAY_METHODS = {
    cash:      { label: 'نقداً',    icon: '💵' },
    card:      { label: 'بطاقة',    icon: '💳' },
    transfer:  { label: 'تحويل',   icon: '🏦' },
    ccp:       { label: 'CCP',      icon: '📮' },
    baridimob: { label: 'BaridiMob', icon: '📱' },
};

const LearnerPayments = () => {
    const [payments] = useState(MOCK_PAYMENTS);
    const [filter,   setFilter]   = useState('all');
    const [search,   setSearch]   = useState('');
    const [expanded, setExpanded] = useState(null);

    const totalPaid     = payments.filter(p => p.status === 'paid').reduce((s, p) => s + (p.amount || 0), 0);
    const totalPending  = payments.filter(p => p.status === 'pending').reduce((s, p) => s + (p.amount || 0), 0);
    const totalRefunded = payments.filter(p => p.status === 'refunded').reduce((s, p) => s + (p.amount || 0), 0);

    const filtered = payments.filter(p => {
        const ms = filter === 'all' || p.status === filter;
        const mq = !search || (p.description || '').toLowerCase().includes(search.toLowerCase());
        return ms && mq;
    });

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-6" dir="rtl">
            <div className="max-w-4xl mx-auto">

                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-black bg-gradient-to-l from-emerald-400 to-green-300
                                   bg-clip-text text-transparent mb-1">
                        المدفوعات
                    </h1>
                    <p className="text-zinc-500 text-sm">Payment History · {payments.length} عملية</p>
                </div>

                {/* Summary cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                    {[
                        { icon: CheckCircle2, ar: 'إجمالي المدفوع', en: 'Total Paid', value: totalPaid,     iconC: 'text-emerald-400', bg: 'bg-emerald-500/10', textC: 'text-emerald-400' },
                        { icon: Clock,        ar: 'في الانتظار',    en: 'Pending',    value: totalPending,  iconC: 'text-amber-400',   bg: 'bg-amber-500/10',   textC: 'text-amber-400'  },
                        { icon: TrendingUp,   ar: 'المسترد',        en: 'Refunded',   value: totalRefunded, iconC: 'text-sky-400',     bg: 'bg-sky-500/10',     textC: 'text-sky-400'    },
                    ].map(c => (
                        <div key={c.en}
                             className="bg-[#111] border border-white/[0.07] rounded-2xl p-4 flex items-center gap-4">
                            <div className={`p-3 rounded-xl ${c.bg}`}>
                                <c.icon className={`w-5 h-5 ${c.iconC}`} />
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] text-zinc-600 font-semibold uppercase tracking-wider">
                                    {c.en} · {c.ar}
                                </p>
                                <p className={`text-xl font-black ${c.textC} mt-0.5`}>
                                    {c.value.toLocaleString()}
                                    <span className="text-sm font-semibold text-zinc-600 mr-1">DA</span>
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Search */}
                <div className="relative mb-3">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                    <input type="text" dir="rtl"
                           placeholder="ابحث في المدفوعات..."
                           value={search} onChange={e => setSearch(e.target.value)}
                           className="w-full bg-[#111] border border-white/[0.07] rounded-xl py-3 pr-10 pl-4
                                      text-sm focus:outline-none focus:border-emerald-500/40 transition-colors
                                      placeholder-zinc-600 text-white" />
                    {search && (
                        <button onClick={() => setSearch('')} className="absolute left-3 top-1/2 -translate-y-1/2">
                            <X className="w-4 h-4 text-zinc-500 hover:text-white" />
                        </button>
                    )}
                </div>

                {/* Filter tabs */}
                <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
                    {['all', 'paid', 'pending', 'failed', 'refunded'].map(s => (
                        <button key={s} onClick={() => setFilter(s)}
                                className={`flex-shrink-0 text-xs font-bold px-3 py-1.5 rounded-lg transition-all
                                            ${filter === s
                                                ? 'bg-emerald-500 text-black'
                                                : 'bg-zinc-800/60 text-zinc-400 hover:bg-zinc-700/60'}`}>
                            {s === 'all'
                                ? `الكل (${payments.length})`
                                : `${PAY_STATUS[s]?.ar} (${payments.filter(p => p.status === s).length})`}
                        </button>
                    ))}
                </div>

                {/* List */}
                {filtered.length === 0 ? (
                    <div className="text-center py-20">
                        <CreditCard className="w-14 h-14 text-zinc-800 mx-auto mb-3" />
                        <p className="text-zinc-600 text-sm">لا توجد مدفوعات</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {filtered.map((p, i) => {
                            const isExp    = expanded === i;
                            const st       = PAY_STATUS[p.status] || PAY_STATUS.pending;
                            const meth     = PAY_METHODS[p.method] || { label: p.method || '—', icon: '💰' };
                            const date     = p.createdAt ? new Date(p.createdAt) : null;
                            const amtColor = p.status === 'paid'
                                ? 'text-emerald-400'
                                : p.status === 'pending' ? 'text-amber-400' : 'text-red-400';

                            return (
                                <div key={p._id}
                                     className="bg-[#111] border border-white/[0.07] hover:border-white/[0.12]
                                                rounded-2xl overflow-hidden transition-all">
                                    <div className="flex items-center gap-4 p-4 cursor-pointer"
                                         onClick={() => setExpanded(isExp ? null : i)}>
                                        <div className="w-11 h-11 rounded-xl bg-zinc-900 flex items-center
                                                        justify-center text-xl flex-shrink-0 border border-white/[0.06]">
                                            {meth.icon}
                                        </div>
                                        <div className="flex-1 min-w-0 text-right">
                                            <p className="font-bold text-sm text-white truncate">
                                                {p.description || 'دفع جلسة تدريبية'}
                                            </p>
                                            <p className="text-xs text-zinc-600 mt-0.5">
                                                {date ? date.toLocaleDateString('ar-DZ') : '—'} · {meth.label}
                                                {p.coachId?.fullName && ` · ${p.coachId.fullName}`}
                                            </p>
                                        </div>
                                        <div className="text-left flex-shrink-0">
                                            <p className={`font-black text-base ${amtColor}`}>
                                                {p.amount === 0 ? 'مجاني' : `${(p.amount || 0).toLocaleString()} DA`}
                                            </p>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${st.cls}`}>
                                                {st.ar}
                                            </span>
                                        </div>
                                        <ChevronDown className={`w-4 h-4 text-zinc-700 transition-transform flex-shrink-0
                                                                  ${isExp ? 'rotate-180' : ''}`} />
                                    </div>

                                    {isExp && (
                                        <div className="border-t border-white/[0.05] px-4 pb-4 pt-3
                                                        grid grid-cols-2 md:grid-cols-3 gap-2">
                                            {[
                                                { label: 'المرجع',   value: p._id?.slice(-8).toUpperCase() || '—' },
                                                { label: 'الطريقة', value: meth.label },
                                                { label: 'الحالة',  value: st.ar },
                                                { label: 'المبلغ',  value: p.amount === 0 ? 'مجاني' : `${(p.amount || 0).toLocaleString()} DA` },
                                                { label: 'التاريخ', value: date ? date.toLocaleDateString('ar-DZ') : '—' },
                                                { label: 'الكوتش',  value: p.coachId?.fullName || '—' },
                                            ].map(d => (
                                                <div key={d.label} className="bg-zinc-900/60 rounded-xl p-3">
                                                    <p className="text-[10px] text-zinc-600 mb-1 font-semibold">{d.label}</p>
                                                    <p className="text-xs font-bold text-white">{d.value}</p>
                                                </div>
                                            ))}
                                            {p.notes && (
                                                <div className="col-span-full bg-zinc-900/60 rounded-xl p-3">
                                                    <p className="text-[10px] text-zinc-600 mb-1 font-semibold">ملاحظات</p>
                                                    <p className="text-xs text-zinc-400">{p.notes}</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LearnerPayments;