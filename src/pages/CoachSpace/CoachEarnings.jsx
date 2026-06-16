import { useState } from 'react';
import { DollarSign, TrendingUp, Calendar, Download, CreditCard, ChevronDown, Search } from 'lucide-react';
import { EARNINGS } from '../../utils/mockData';

const CoachEarnings = () => {
    const stats           = EARNINGS.stats;
    const monthly         = EARNINGS.monthly;
    const transactions    = EARNINGS.transactions;
    const commissionRates = stats.commissionRates;

    const [showFilters, setShowFilters] = useState(false);
    const [filterType, setFilterType]   = useState('all');
    const [filterMonth, setFilterMonth] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const exportToPDF = () => {
        const date = new Date().toLocaleDateString('ar-DZ', { year: 'numeric', month: 'long', day: 'numeric' });
        const totalAmount     = filteredTransactions.reduce((s, t) => s + t.amount, 0);
        const totalCommission = filteredTransactions.reduce((s, t) => s + t.commission, 0);
        const totalNet        = filteredTransactions.reduce((s, t) => s + t.net, 0);

        const statusColor = (s) => s === 'مكتمل' ? '#22c55e' : '#eab308';

        const rows = filteredTransactions.map(t => `
            <tr>
                <td>${t.date}</td>
                <td>${t.type}</td>
                <td>${t.item}</td>
                <td>${t.customer}</td>
                <td>دج ${t.amount.toLocaleString()}</td>
                <td style="color:#ef4444">دج ${t.commission.toLocaleString()}</td>
                <td style="color:#22c55e;font-weight:700">دج ${t.net.toLocaleString()}</td>
                <td style="color:${statusColor(t.status)}">${t.status}</td>
            </tr>
        `).join('');

        const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8"/>
<title>سجل المعاملات</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap');
  @page { size: A4 landscape; margin: 10mm; }
  * { margin:0; padding:0; box-sizing:border-box; }
  html, body { width:100%; font-family:'Cairo',sans-serif; color:#000; background:#fff; direction:rtl; }
  .header { text-align:center; margin-bottom:16px; padding-bottom:12px; border-bottom:2px solid #d97706; }
  .header h1 { font-size:18px; font-weight:900; color:#b45309; margin-bottom:4px; }
  .header p { font-size:10px; color:#6b7280; }
  .stats { display:grid; grid-template-columns:repeat(4,1fr); gap:8px; margin-bottom:16px; }
  .stat { background:#fef3c7; border:1px solid #fcd34d; border-radius:8px; padding:8px 12px; text-align:center; }
  .stat .label { font-size:9px; color:#92400e; margin-bottom:2px; }
  .stat .value { font-size:13px; font-weight:700; color:#b45309; }
  table { width:100%; border-collapse:collapse; font-size:9px; }
  thead tr { background:#fef3c7; }
  thead th { padding:7px 8px; color:#92400e; font-weight:700; text-align:center; border:1px solid #fcd34d; }
  tbody tr { border-bottom:1px solid #e5e7eb; }
  tbody tr:nth-child(even) { background:#f9fafb; }
  tbody td { padding:6px 8px; text-align:center; color:#111; border:1px solid #e5e7eb; }
  tfoot tr { background:#fef3c7; }
  tfoot td { padding:7px 8px; text-align:center; color:#92400e; font-weight:700; border:1px solid #fcd34d; }
  .footer { text-align:center; margin-top:12px; font-size:8px; color:#9ca3af; }
  .no-print { text-align:center; margin-top:16px; }
  .btn-print { background:#b45309; color:#fff; border:none; padding:8px 24px; border-radius:6px; font-family:'Cairo',sans-serif; font-size:13px; font-weight:700; cursor:pointer; }
  @media print { .no-print { display:none !important; } }
</style>
</head>
<body>
  <div class="header">
    <h1>سجل المعاملات — الأرباح والمدفوعات</h1>
    <p>${date}</p>
  </div>
  <div class="stats">
    <div class="stat"><div class="label">إجمالي الأرباح</div><div class="value">دج ${stats.totalEarnings.toLocaleString()}</div></div>
    <div class="stat"><div class="label">هذا الشهر</div><div class="value">دج ${stats.thisMonth.toLocaleString()}</div></div>
    <div class="stat"><div class="label">عمولة الجلسات</div><div class="value">${commissionRates.workshop}%</div></div>
    <div class="stat"><div class="label">عمولة البرامج</div><div class="value">${commissionRates.course}%</div></div>
  </div>
  <table>
    <thead><tr><th>التاريخ</th><th>النوع</th><th>العنصر</th><th>العميل</th><th>المبلغ</th><th>العمولة</th><th>الصافي</th><th>الحالة</th></tr></thead>
    <tbody>${rows}</tbody>
    <tfoot><tr><td colspan="4">المجموع</td><td>دج ${totalAmount.toLocaleString()}</td><td>دج ${totalCommission.toLocaleString()}</td><td>دج ${totalNet.toLocaleString()}</td><td></td></tr></tfoot>
  </table>
  <div class="footer">${filteredTransactions.length} معاملة — تم التصدير بتاريخ ${date}</div>
  <div class="no-print"><button class="btn-print" onclick="window.print()">طباعة</button></div>
  <script>window.onload = () => setTimeout(() => window.print(), 500);</script>
</body>
</html>`;

        const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
        const url  = URL.createObjectURL(blob);
        const win  = window.open(url, '_blank');
        if (!win) {
            const a = document.createElement('a');
            a.href = url; a.download = 'earnings-' + new Date().toISOString().split('T')[0] + '.html'; a.click();
        }
        setTimeout(() => URL.revokeObjectURL(url), 10000);
    };

    const filteredTransactions = transactions.filter(t => {
        const matchType   = filterType  === 'all' || t.type === filterType;
        const matchMonth  = filterMonth === 'all' || t.date.startsWith(filterMonth);
        const matchSearch = searchQuery === '' ||
            t.item.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (t.customer || '').toLowerCase().includes(searchQuery.toLowerCase());
        return matchType && matchMonth && matchSearch;
    });

    const monthOptions = [...new Set(
        transactions.map(t => t.date ? t.date.substring(0, 7) : null).filter(Boolean)
    )].sort((a, b) => b.localeCompare(a));

    const statCards = [
        { label: 'إجمالي الأرباح', value: `دج ${stats.totalEarnings.toLocaleString()}`, iconBg: 'bg-green-500/20',  iconColor: 'text-green-400',  borderHover: 'hover:border-green-500/50',  Icon: DollarSign  },
        { label: 'هذا الشهر',      value: `دج ${stats.thisMonth.toLocaleString()}`,     iconBg: 'bg-blue-500/20',   iconColor: 'text-blue-400',   borderHover: 'hover:border-blue-500/50',   Icon: TrendingUp  },
        {
            label: 'العمولة',
            value: commissionRates.workshop === commissionRates.course
                ? `${commissionRates.workshop}%`
                : `${commissionRates.workshop}% / ${commissionRates.course}%`,
            iconBg: 'bg-purple-500/20', iconColor: 'text-purple-400', borderHover: 'hover:border-purple-500/50', Icon: CreditCard,
        },
    ];

    const maxEarnings = Math.max(...monthly.map(m => m.earnings), 1);

    return (
        <div className="min-h-screen bg-zinc-950 text-white p-6" dir="rtl">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold mb-1 bg-gradient-to-r from-amber-500 to-yellow-500 bg-clip-text text-transparent">
                        الأرباح والمدفوعات
                    </h1>
                    <p className="text-gray-400 text-sm">متابعة الإيرادات والمعاملات المالية</p>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    {statCards.map((stat, i) => (
                        <div key={i} className={`bg-gradient-to-br from-zinc-900/80 to-zinc-800/80 backdrop-blur-sm rounded-xl p-4 border border-zinc-700/50 ${stat.borderHover} transition-all`}>
                            <div className="flex items-center justify-between">
                                <div><p className="text-gray-400 text-xs mb-0.5">{stat.label}</p><p className="text-xl font-bold text-white">{stat.value}</p></div>
                                <div className={`${stat.iconBg} p-3 rounded-lg`}><stat.Icon className={`w-6 h-6 ${stat.iconColor}`} /></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Chart + Commission */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">

                    {/* Monthly Bar Chart */}
                    <div className="relative bg-gradient-to-br from-zinc-900/80 to-zinc-800/80 backdrop-blur-sm rounded-xl border border-zinc-700/50 overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/60 to-transparent" />
                        <div className="p-5">
                            <div className="flex items-center justify-between mb-1">
                                <div>
                                    <h2 className="text-sm font-semibold text-white">الأرباح الشهرية</h2>
                                    <p className="text-xs text-zinc-500 mt-0.5">آخر 6 أشهر — صافي بعد العمولة</p>
                                </div>
                                <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-2">
                                    <Calendar className="w-4 h-4 text-amber-400" />
                                </div>
                            </div>
                            <p className="text-2xl font-bold text-white mt-3 mb-5">
                                دج {monthly.reduce((s, m) => s + m.earnings, 0).toLocaleString()}
                                <span className="text-xs font-normal text-zinc-500 mr-2">إجمالي الفترة</span>
                            </p>
                            <div className="flex items-end gap-1.5" style={{ height: '110px' }}>
                                {monthly.map((data, index) => {
                                    const pct   = (data.earnings / maxEarnings) * 100;
                                    const isMax = data.earnings === maxEarnings && data.earnings > 0;
                                    return (
                                        <div key={index} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                                            <div className="relative w-full flex flex-col justify-end" style={{ height: '88px' }}>
                                                {data.earnings > 0 && (
                                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex flex-col items-center z-20 pointer-events-none">
                                                        <div className="bg-zinc-800 border border-zinc-600 text-white text-xs py-1.5 px-2.5 rounded-lg whitespace-nowrap shadow-xl">
                                                            <span className="text-amber-400 font-semibold">دج {data.earnings.toLocaleString()}</span>
                                                        </div>
                                                        <div className="w-1.5 h-1.5 bg-zinc-800 border-r border-b border-zinc-600 rotate-45 -mt-1" />
                                                    </div>
                                                )}
                                                <div
                                                    className={`w-full rounded-t-md transition-all duration-300 ${
                                                        isMax ? 'bg-gradient-to-t from-amber-500 to-yellow-400 shadow-lg shadow-amber-500/20'
                                                              : 'bg-gradient-to-t from-zinc-600 to-zinc-500 group-hover:from-amber-600 group-hover:to-yellow-500'
                                                    }`}
                                                    style={{ height: `${Math.max(pct, data.earnings > 0 ? 4 : 0)}%` }}
                                                />
                                            </div>
                                            <span className={`text-xs transition-colors ${isMax ? 'text-amber-400 font-semibold' : 'text-zinc-500 group-hover:text-zinc-300'}`}>
                                                {data.month}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Commission Details */}
                    <div className="relative bg-gradient-to-br from-zinc-900/80 to-zinc-800/80 backdrop-blur-sm rounded-xl border border-zinc-700/50 overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />
                        <div className="p-5">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h2 className="text-sm font-semibold text-white">توزيع العمولة</h2>
                                    <p className="text-xs text-zinc-500 mt-0.5">نسبة مقتطعة من كل نوع</p>
                                </div>
                                <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-2">
                                    <CreditCard className="w-4 h-4 text-purple-400" />
                                </div>
                            </div>
                            <div className="space-y-3">
                                {[
                                    { label: 'الجلسات',           from: 'from-amber-500',   to: 'to-yellow-400',  dot: 'bg-amber-400',   rateKey: 'workshop' },
                                    { label: 'البرامج التدريبية', from: 'from-emerald-500', to: 'to-green-400',   dot: 'bg-emerald-400', rateKey: 'course'   },
                                ].map((item, i) => {
                                    const rate = commissionRates[item.rateKey] ?? 15;
                                    return (
                                        <div key={i} className="group">
                                            <div className="flex items-center justify-between mb-1.5">
                                                <div className="flex items-center gap-2">
                                                    <span className={`w-2 h-2 rounded-full ${item.dot}`} />
                                                    <span className="text-zinc-300 text-xs">{item.label}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-white text-xs font-semibold bg-zinc-700/60 px-2 py-0.5 rounded-md">{+(100 - rate).toFixed(1)}% صافي</span>
                                                    <span className="text-zinc-500 text-xs">{rate}% عمولة</span>
                                                </div>
                                            </div>
                                            <div className="relative h-1.5 bg-zinc-700/60 rounded-full overflow-hidden">
                                                <div className={`absolute right-0 top-0 h-full bg-gradient-to-l ${item.from} ${item.to} rounded-full`} style={{ width: `${100 - rate}%` }} />
                                                <div className="absolute left-0 top-0 h-full bg-red-500/30 rounded-full" style={{ width: `${rate}%` }} />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="mt-4 flex items-start gap-3 p-3 bg-zinc-800/40 border border-zinc-700/40 rounded-lg">
                                <div className="mt-0.5 w-4 h-4 flex-shrink-0 rounded-full bg-amber-500/20 flex items-center justify-center">
                                    <span className="text-amber-400 text-xs font-bold">!</span>
                                </div>
                                <p className="text-xs text-zinc-400 leading-relaxed">
                                    تُخصم عمولة <span className="text-amber-400 font-semibold">{commissionRates.workshop}%</span> على الجلسات و<span className="text-amber-400 font-semibold">{commissionRates.course}%</span> على البرامج. تُحوَّل الأرباح خلال <span className="text-white font-semibold">7 أيام عمل</span>.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Toggle Filters */}
                <div className="mb-4">
                    <button onClick={() => setShowFilters(!showFilters)}
                        className="w-full bg-gradient-to-br from-zinc-900/80 to-zinc-800/80 backdrop-blur-sm rounded-xl p-3 border border-zinc-700/50 hover:border-amber-500/50 transition-all flex items-center justify-between">
                        <span className="text-white font-semibold text-sm">{showFilters ? 'إخفاء الفلاتر' : 'إظهار الفلاتر'}</span>
                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
                    </button>
                </div>

                {/* Filters */}
                {showFilters && (
                    <div className="bg-gradient-to-br from-zinc-900/80 to-zinc-800/80 backdrop-blur-sm rounded-xl p-4 border border-zinc-700/50 mb-4">
                        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
                            <div className="relative flex-1">
                                <select value={filterType} onChange={e => setFilterType(e.target.value)}
                                    className="w-full bg-zinc-800/50 border border-zinc-700 text-white text-sm px-4 py-2.5 pr-10 rounded-lg appearance-none cursor-pointer hover:border-amber-500/50 transition-all focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                                    style={{ direction: 'rtl' }}>
                                    <option value="all">جميع الأنواع</option>
                                    <option value="جلسة">جلسة</option>
                                    <option value="برنامج">برنامج</option>
                                    <option value="دورة">دورة</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                            <div className="relative flex-1">
                                <select value={filterMonth} onChange={e => setFilterMonth(e.target.value)}
                                    className="w-full bg-zinc-800/50 border border-zinc-700 text-white text-sm px-4 py-2.5 pr-10 rounded-lg appearance-none cursor-pointer hover:border-amber-500/50 transition-all focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                                    style={{ direction: 'rtl' }}>
                                    <option value="all">جميع الأشهر</option>
                                    {monthOptions.map(m => (
                                        <option key={m} value={m}>
                                            {new Date(m + '-01').toLocaleDateString('ar-DZ', { year: 'numeric', month: 'long' })}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                            <div className="relative flex-1 md:flex-[2]">
                                <input type="text" placeholder="ابحث عن معاملة..." value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    className="w-full bg-zinc-800/50 border border-zinc-700 text-white text-sm px-4 py-2.5 pl-10 rounded-lg hover:border-amber-500/50 transition-all focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                                    style={{ direction: 'rtl' }} />
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            </div>
                        </div>
                    </div>
                )}

                {/* Transactions Table */}
                <div className="bg-gradient-to-br from-zinc-900/80 to-zinc-800/80 backdrop-blur-sm rounded-xl border border-zinc-700/50 overflow-hidden">
                    <div className="p-4 flex items-center justify-between border-b border-zinc-700/50">
                        <div>
                            <h2 className="text-lg font-bold">سجل المعاملات</h2>
                            <p className="text-gray-400 text-xs mt-0.5">{filteredTransactions.length} معاملة</p>
                        </div>
                        <button onClick={exportToPDF} className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-black px-4 py-2 rounded-lg font-semibold text-sm hover:from-amber-600 hover:to-yellow-600 transition-all">
                            <Download className="w-4 h-4" /> تصدير
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-zinc-900/50">
                                <tr>
                                    {['التاريخ','النوع','العنصر','العميل','المبلغ','العمولة','الصافي','الحالة'].map(h => (
                                        <th key={h} className="px-4 py-4 text-right text-sm font-semibold text-gray-300">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {filteredTransactions.length === 0 ? (
                                    <tr><td colSpan="8" className="px-6 py-12 text-center text-gray-500">لا توجد معاملات تطابق الفلاتر المحددة</td></tr>
                                ) : filteredTransactions.map(t => (
                                    <tr key={t.id} className="hover:bg-zinc-800/50 transition-colors">
                                        <td className="px-4 py-4 text-sm text-gray-400">{t.date}</td>
                                        <td className="px-4 py-4">
                                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-500">{t.type}</span>
                                        </td>
                                        <td className="px-4 py-4 text-sm">{t.item}</td>
                                        <td className="px-4 py-4 text-sm text-gray-400">{t.customer}</td>
                                        <td className="px-4 py-4 text-sm font-semibold">دج {t.amount.toLocaleString()}</td>
                                        <td className="px-4 py-4 text-sm text-red-500">دج {t.commission.toLocaleString()}</td>
                                        <td className="px-4 py-4 text-sm font-bold text-green-500">دج {t.net.toLocaleString()}</td>
                                        <td className="px-4 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                t.status === 'مكتمل' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'
                                            }`}>{t.status}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CoachEarnings;