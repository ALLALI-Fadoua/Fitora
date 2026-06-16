import { useState, useEffect, useCallback } from 'react';
import { DollarSign, TrendingUp, Calendar, Download, Loader2, AlertCircle, ChevronDown, Search, Settings, BarChart3, Sparkles, Percent, Check, X } from 'lucide-react';

// ── MOCK DATA ─────────────────────────────────────────────────────────────────

const MOCK_STATS = {
    totalRevenue:         104000,
    totalPlatformGain:    15800,
    totalArtistEarning:   88200,
    thisMonthRevenue:     35000,
    thisMonthPlatformGain: 5250,
    transactionCount:     7,
};

const MOCK_MONTHLY = [
    { month: 'ديس', revenue: 12000, commission: 1800 },
    { month: 'جان', revenue: 18000, commission: 2700 },
    { month: 'فيف', revenue: 9000,  commission: 1350 },
    { month: 'مار', revenue: 21000, commission: 3150 },
    { month: 'أفر', revenue: 9000,  commission: 1350 },
    { month: 'ماي', revenue: 35000, commission: 5250 },
];

const MOCK_TRANSACTIONS = [
    {
        id: 't1', date: '2025-05-12', type: 'دورة',
        item: 'برنامج القيادة الفعّالة', customer: 'محمد الأمين',
        artist: 'أحمد بن علي', amount: 15000, commission: 2250,
        commissionRate: 15, net: 12750, status: 'مكتملة',
    },
    {
        id: 't2', date: '2025-05-08', type: 'دورة',
        item: 'ريادة الأعمال من الصفر', customer: 'خديجة عمر',
        artist: 'يوسف حمدان', amount: 25000, commission: 3750,
        commissionRate: 15, net: 21250, status: 'مكتملة',
    },
    {
        id: 't3', date: '2025-05-05', type: 'ورشة',
        item: 'ورشة التواصل الفعّال', customer: 'عمر بلقاسم',
        artist: 'سارة المنصوري', amount: 8000, commission: 800,
        commissionRate: 10, net: 7200, status: 'مكتملة',
    },
    {
        id: 't4', date: '2025-04-22', type: 'ورشة',
        item: 'ورشة إدارة الوقت', customer: 'فاطمة الزهراء',
        artist: 'نور الدين كمال', amount: 6000, commission: 600,
        commissionRate: 10, net: 5400, status: 'مكتملة',
    },
    {
        id: 't5', date: '2025-04-10', type: 'دورة',
        item: 'أسرار التسويق الرقمي', customer: 'يونس مراد',
        artist: 'سارة المنصوري', amount: 12000, commission: 1800,
        commissionRate: 15, net: 10200, status: 'مكتملة',
    },
    {
        id: 't6', date: '2025-03-18', type: 'ورشة',
        item: 'ورشة القيادة الإبداعية', customer: 'محمد الأمين',
        artist: 'أحمد بن علي', amount: 9000, commission: 900,
        commissionRate: 10, net: 8100, status: 'مكتملة',
    },
    {
        id: 't7', date: '2025-03-05', type: 'دورة',
        item: 'برنامج الصحة والعافية', customer: 'عمر بلقاسم',
        artist: 'نور الدين كمال', amount: 29000, commission: 3700,
        commissionRate: 15, net: 25300, status: 'مكتملة',
    },
];

const MOCK_COMMISSIONS = {
    workshop: 0.10,
    course:   0.15,
};

const MOCK_TYPE_BREAKDOWN = {
    'ورشة': { count: 3, revenue: 23000, platformGain: 2300 },
    'دورة': { count: 4, revenue: 81000, platformGain: 11250 },
};

// ── helpers ───────────────────────────────────────────────────────────────────

const fmt = (n) => Number(n ?? 0).toLocaleString('ar-DZ');
const delay = (ms = 700) => new Promise(r => setTimeout(r, ms));

const TYPE_META = {
    'ورشة': { dot: 'bg-amber-400',   bar: 'from-amber-500 to-yellow-400',  key: 'workshop' },
    'دورة': { dot: 'bg-emerald-400', bar: 'from-emerald-500 to-green-400', key: 'course'   },
};
const defaultMeta = { dot: 'bg-blue-400', bar: 'from-blue-500 to-cyan-400', key: '' };
const getTypeMeta = (type) => TYPE_META[type] ?? { ...defaultMeta, key: type };

// ── Commission Editor ─────────────────────────────────────────────────────────

const CommissionEditorInner = ({ initialRates, onSave, saving }) => {
    const [localRates, setLocalRates] = useState(initialRates);
    const [isDirty,    setIsDirty]    = useState(false);

    const handleChange = (key, val) => {
        setLocalRates(prev => ({ ...prev, [key]: val }));
        setIsDirty(true);
    };

    const handleSave = () => {
        const payload = {};
        for (const [k, v] of Object.entries(localRates)) {
            const num = parseFloat(v);
            if (isNaN(num) || num < 0 || num > 100) return;
            payload[k] = +(num / 100).toFixed(4);
        }
        onSave(payload);
        setIsDirty(false);
    };

    const handleReset = () => { setLocalRates(initialRates); setIsDirty(false); };

    const labels = { workshop: 'الجلسات', course: 'الدورات' };

    return (
        <div className="relative bg-gradient-to-br from-zinc-900/80 to-zinc-800/80 backdrop-blur-sm rounded-xl border border-zinc-700/50 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/60 to-transparent" />
            <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-sm font-semibold text-white">إدارة نسب العمولة</h2>
                        <p className="text-xs text-zinc-500 mt-0.5">عمولة المنصة لكل نوع</p>
                    </div>
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-2">
                        <Settings className="w-4 h-4 text-amber-400" />
                    </div>
                </div>

                <div className="space-y-3">
                    {Object.entries(localRates).map(([key, val]) => {
                        const label = labels[key] ?? key;
                        const meta  = Object.values(TYPE_META).find(m => m.key === key) ?? defaultMeta;
                        const num   = parseFloat(val);
                        const valid = !isNaN(num) && num >= 0 && num <= 100;
                        return (
                            <div key={key} className="flex items-center gap-3">
                                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${meta.dot}`} />
                                <span className="text-zinc-300 text-xs flex-1">{label}</span>
                                <div className="relative">
                                    <input
                                        type="number" min="0" max="100" step="0.5" value={val}
                                        onChange={(e) => handleChange(key, e.target.value)}
                                        className={`w-20 bg-zinc-800 border text-white text-xs px-2 py-1.5 rounded-lg text-center appearance-none focus:outline-none focus:ring-1 focus:ring-amber-500/50 transition-colors ${
                                            valid ? 'border-zinc-700 hover:border-amber-500/40' : 'border-red-500/60'
                                        }`}
                                    />
                                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-zinc-500 text-xs">%</span>
                                </div>
                                <div className="flex-1 max-w-[80px] h-1.5 bg-zinc-700/60 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full bg-gradient-to-l ${meta.bar} rounded-full transition-all`}
                                        style={{ width: `${Math.min(valid ? num : 0, 100)}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>

                {isDirty && (
                    <div className="flex gap-2 mt-4">
                        <button
                            onClick={handleSave} disabled={saving}
                            className="flex-1 flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-black text-xs font-bold px-3 py-2 rounded-lg transition-colors"
                        >
                            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                            حفظ
                        </button>
                        <button onClick={handleReset}
                            className="flex items-center justify-center gap-1.5 bg-zinc-700 hover:bg-zinc-600 text-zinc-300 text-xs px-3 py-2 rounded-lg transition-colors">
                            <X className="w-3.5 h-3.5" />
                        </button>
                    </div>
                )}

                <div className="mt-4 p-3 bg-zinc-800/40 border border-zinc-700/40 rounded-lg text-xs text-zinc-400 leading-relaxed">
                    تُطبَّق العمولة على كل معاملة مكتملة. الكوتش يستلم <span className="text-white font-semibold">الصافي</span>، والمنصة تحتفظ بـ <span className="text-amber-400 font-semibold">العمولة</span>.
                </div>
            </div>
        </div>
    );
};

const CommissionEditor = ({ commissions, onSave, saving }) => {
    const initialRates = {};
    for (const [k, v] of Object.entries(commissions)) {
        initialRates[k] = (v * 100).toFixed(1);
    }
    return (
        <CommissionEditorInner
            key={JSON.stringify(commissions)}
            initialRates={initialRates}
            onSave={onSave}
            saving={saving}
        />
    );
};

// ── Main Component ────────────────────────────────────────────────────────────

const AdminEarnings = () => {
    const [loading,     setLoading]     = useState(true);
    const [error,       setError]       = useState(null);
    const [saving,      setSaving]      = useState(false);
    const [saveMsg,     setSaveMsg]     = useState(null);

    const [stats,        setStats]       = useState(null);
    const [monthly,      setMonthly]     = useState([]);
    const [transactions, setTrans]       = useState([]);
    const [commissions,  setCommissions] = useState({});
    const [typeBreakdown,setBreakdown]   = useState({});

    // Filters
    const [showFilters, setShowFilters] = useState(false);
    const [filterType,  setFilterType]  = useState('all');
    const [filterMonth, setFilterMonth] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const fetchAll = useCallback(async (isRefresh = false) => {
        if (!isRefresh) setLoading(true);
        setError(null);
        await delay(isRefresh ? 300 : 700);
        try {
            setStats(MOCK_STATS);
            setMonthly(MOCK_MONTHLY);
            setTrans(MOCK_TRANSACTIONS);
            setCommissions(MOCK_COMMISSIONS);
            setBreakdown(MOCK_TYPE_BREAKDOWN);
        } catch {
            setError('حدث خطأ في جلب بيانات الأرباح');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAll();
        const interval = setInterval(() => fetchAll(true), 60_000);
        return () => clearInterval(interval);
    }, [fetchAll]);

    // Save commissions — updates mock state locally
    const handleSaveCommissions = async (payload) => {
        try {
            setSaving(true);
            setSaveMsg(null);
            await delay(500);
            setCommissions(payload);
            setSaveMsg('✓ تم حفظ نسب العمولة');
        } catch {
            setSaveMsg('✗ خطأ في الحفظ');
        } finally {
            setSaving(false);
            setTimeout(() => setSaveMsg(null), 3000);
        }
    };

    // Filtered transactions
    const filtered = transactions.filter(t => {
        const matchType   = filterType  === 'all' || t.type === filterType;
        const matchMonth  = filterMonth === 'all' || t.date.startsWith(filterMonth);
        const matchSearch = searchQuery === '' ||
            t.item.toLowerCase().includes(searchQuery.toLowerCase())     ||
            t.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.artist.toLowerCase().includes(searchQuery.toLowerCase());
        return matchType && matchMonth && matchSearch;
    });

    const monthOptions = [...new Set(
        transactions.map(t => t.date?.substring(0, 7)).filter(Boolean)
    )].sort((a, b) => b.localeCompare(a));

    const uniqueTypes = [...new Set(transactions.map(t => t.type))];

    // PDF Export
    const exportToPDF = () => {
        const date        = new Date().toLocaleDateString('ar-DZ', { year: 'numeric', month: 'long', day: 'numeric' });
        const totalAmount = filtered.reduce((s, t) => s + t.amount, 0);
        const totalComm   = filtered.reduce((s, t) => s + t.commission, 0);
        const totalNet    = filtered.reduce((s, t) => s + t.net, 0);

        const rows = filtered.map(t => `
            <tr>
                <td>${t.date}</td>
                <td><span class="badge">${t.type}</span></td>
                <td>${t.item}</td>
                <td>${t.customer}</td>
                <td>${t.artist}</td>
                <td>دج ${t.amount.toLocaleString()}</td>
                <td style="color:#ef4444">دج ${t.commission.toLocaleString()} (${t.commissionRate}%)</td>
                <td style="color:#22c55e;font-weight:700">دج ${t.net.toLocaleString()}</td>
            </tr>
        `).join('');

        const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8"/>
<title>تقرير الأرباح — الإدارة</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap');
  @page { size: A4 landscape; margin: 10mm; }
  * { margin:0; padding:0; box-sizing:border-box; }
  html, body { font-family:'Cairo',sans-serif; color:#000; background:#fff; direction:rtl; }
  .header { text-align:center; margin-bottom:16px; padding-bottom:12px; border-bottom:2px solid #d97706; }
  .header h1 { font-size:18px; font-weight:900; color:#b45309; margin-bottom:4px; }
  .header p { font-size:10px; color:#6b7280; }
  .stats { display:grid; grid-template-columns:repeat(5,1fr); gap:8px; margin-bottom:16px; }
  .stat { background:#fef3c7; border:1px solid #fcd34d; border-radius:8px; padding:8px 12px; text-align:center; }
  .stat .label { font-size:9px; color:#92400e; margin-bottom:2px; }
  .stat .value { font-size:12px; font-weight:700; color:#b45309; }
  table { width:100%; border-collapse:collapse; font-size:9px; }
  thead tr { background:#fef3c7; }
  thead th { padding:7px 8px; color:#92400e; font-weight:700; text-align:center; border:1px solid #fcd34d; }
  tbody tr { border-bottom:1px solid #e5e7eb; }
  tbody tr:nth-child(even) { background:#f9fafb; }
  tbody td { padding:6px 8px; text-align:center; color:#111; border:1px solid #e5e7eb; }
  tfoot tr { background:#fef3c7; }
  tfoot td { padding:7px 8px; text-align:center; color:#92400e; font-weight:700; border:1px solid #fcd34d; }
  .badge { background:#fef3c7; color:#92400e; padding:2px 6px; border-radius:99px; font-size:8px; border:1px solid #fcd34d; }
  .footer { text-align:center; margin-top:12px; font-size:8px; color:#9ca3af; }
  .no-print { text-align:center; margin-top:16px; }
  .btn-print { background:#b45309; color:#fff; border:none; padding:8px 24px; border-radius:6px; font-family:'Cairo',sans-serif; font-size:13px; font-weight:700; cursor:pointer; }
  @media print { .no-print { display:none !important; } }
</style>
</head>
<body>
  <div class="header">
    <h1>تقرير أرباح المنصة — لوحة الإدارة</h1>
    <p>${date}</p>
  </div>
  <div class="stats">
    <div class="stat"><div class="label">إجمالي الإيرادات</div><div class="value">دج ${fmt(stats?.totalRevenue)}</div></div>
    <div class="stat"><div class="label">أرباح المنصة</div><div class="value">دج ${fmt(stats?.totalPlatformGain)}</div></div>
    <div class="stat"><div class="label">أرباح الكوتشات</div><div class="value">دج ${fmt(stats?.totalArtistEarning)}</div></div>
    <div class="stat"><div class="label">هذا الشهر</div><div class="value">دج ${fmt(stats?.thisMonthRevenue)}</div></div>
    <div class="stat"><div class="label">عدد المعاملات</div><div class="value">${stats?.transactionCount ?? 0}</div></div>
  </div>
  <table>
    <thead>
      <tr>
        <th>التاريخ</th><th>النوع</th><th>العنصر</th><th>العميل</th><th>الكوتش</th>
        <th>المبلغ الكلي</th><th>عمولة المنصة</th><th>صافي الكوتش</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
    <tfoot>
      <tr>
        <td colspan="5">المجموع (${filtered.length} معاملة)</td>
        <td>دج ${totalAmount.toLocaleString()}</td>
        <td>دج ${totalComm.toLocaleString()}</td>
        <td>دج ${totalNet.toLocaleString()}</td>
      </tr>
    </tfoot>
  </table>
  <div class="footer">تم التصدير بتاريخ ${date}</div>
  <div class="no-print">
    <button class="btn-print" onclick="window.print()">طباعة</button>
  </div>
  <scr` + `ipt>window.onload = () => setTimeout(() => window.print(), 500);</scr` + `ipt>
</body>
</html>`;

        const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
        const url  = URL.createObjectURL(blob);
        const win  = window.open(url, '_blank');
        if (!win) {
            const a = document.createElement('a');
            a.href = url;
            a.download = `admin-earnings-${new Date().toISOString().split('T')[0]}.html`;
            a.click();
        }
        setTimeout(() => URL.revokeObjectURL(url), 10000);
    };

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
                    <p className="text-gray-400">جاري تحميل بيانات الأرباح...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
                <div className="flex flex-col items-center gap-3 text-center">
                    <AlertCircle className="w-10 h-10 text-red-500" />
                    <p className="text-red-400">{error}</p>
                    <button onClick={() => fetchAll()}
                        className="mt-2 bg-amber-500 hover:bg-amber-600 text-black font-semibold px-4 py-2 rounded-lg transition-colors">
                        إعادة المحاولة
                    </button>
                </div>
            </div>
        );
    }

    const statCards = [
        {
            label: 'إجمالي الإيرادات',   value: `دج ${fmt(stats?.totalRevenue)}`,
            sub: 'المبلغ الكلي للمعاملات',
            iconBg: 'bg-green-500/20',   iconColor: 'text-green-400',   border: 'hover:border-green-500/50',   Icon: DollarSign,
        },
        {
            label: 'أرباح المنصة',        value: `دج ${fmt(stats?.totalPlatformGain)}`,
            sub: 'صافي العمولات المحصّلة',
            iconBg: 'bg-amber-500/20',   iconColor: 'text-amber-400',   border: 'hover:border-amber-500/50',   Icon: TrendingUp,
        },
        {
            label: 'أرباح الكوتشات',     value: `دج ${fmt(stats?.totalArtistEarning)}`,
            sub: 'صافي ما يستلمه الكوتشون',
            iconBg: 'bg-purple-500/20',  iconColor: 'text-purple-400',  border: 'hover:border-purple-500/50',  Icon: Sparkles,
        },
        {
            label: 'هذا الشهر',           value: `دج ${fmt(stats?.thisMonthRevenue)}`,
            sub: `عمولة: دج ${fmt(stats?.thisMonthPlatformGain)}`,
            iconBg: 'bg-blue-500/20',    iconColor: 'text-blue-400',    border: 'hover:border-blue-500/50',    Icon: Calendar,
        },
        {
            label: 'المعاملات',            value: (stats?.transactionCount ?? 0).toLocaleString(),
            sub: 'إجمالي العمليات المكتملة',
            iconBg: 'bg-rose-500/20',    iconColor: 'text-rose-400',    border: 'hover:border-rose-500/50',    Icon: BarChart3,
        },
    ];

    const maxRevenue = Math.max(...monthly.map(m => m.revenue), 1);

    return (
        <div className="min-h-screen bg-zinc-950 text-white p-6" dir="rtl">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold mb-1 bg-gradient-to-r from-amber-500 to-yellow-500 bg-clip-text text-transparent">
                        أرباح المنصة
                    </h1>
                    <p className="text-gray-400 text-sm">إجمالي الإيرادات والعمولات والمعاملات المالية</p>
                </div>

                {/* Save message */}
                {saveMsg && (
                    <div className={`mb-4 px-4 py-2.5 rounded-lg text-sm font-semibold ${
                        saveMsg.startsWith('✓')
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}>
                        {saveMsg}
                    </div>
                )}

                {/* Stat Cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-4">
                    {statCards.map((s, i) => (
                        <div key={i} className={`bg-gradient-to-br from-zinc-900/80 to-zinc-800/80 rounded-xl p-4 border border-zinc-700/50 ${s.border} transition-all`}>
                            <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                    <p className="text-gray-400 text-xs mb-0.5 truncate">{s.label}</p>
                                    <p className="text-lg font-bold text-white leading-tight">{s.value}</p>
                                    <p className="text-zinc-600 text-xs mt-0.5 truncate">{s.sub}</p>
                                </div>
                                <div className={`${s.iconBg} p-2 rounded-lg flex-shrink-0`}>
                                    <s.Icon className={`w-4 h-4 ${s.iconColor}`} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Chart + Commission Editor */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">

                    {/* Monthly Bar Chart */}
                    <div className="relative bg-gradient-to-br from-zinc-900/80 to-zinc-800/80 rounded-xl border border-zinc-700/50 overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/60 to-transparent" />
                        <div className="p-5">
                            <div className="flex items-center justify-between mb-1">
                                <div>
                                    <h2 className="text-sm font-semibold text-white">الإيرادات الشهرية</h2>
                                    <p className="text-xs text-zinc-500 mt-0.5">آخر 6 أشهر — إجمالي المنصة</p>
                                </div>
                                <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-2">
                                    <BarChart3 className="w-4 h-4 text-amber-400" />
                                </div>
                            </div>
                            <p className="text-2xl font-bold text-white mt-3 mb-5">
                                دج {monthly.reduce((s, m) => s + m.revenue, 0).toLocaleString()}
                                <span className="text-xs font-normal text-zinc-500 mr-2">إجمالي الفترة</span>
                            </p>
                            {monthly.every(m => m.revenue === 0) ? (
                                <div className="h-32 flex items-center justify-center text-zinc-600 text-sm border border-dashed border-zinc-700 rounded-lg">
                                    لا توجد بيانات بعد
                                </div>
                            ) : (
                                <div className="flex items-end gap-1.5" style={{ height: '110px' }}>
                                    {monthly.map((data, index) => {
                                        const pct   = (data.revenue / maxRevenue) * 100;
                                        const isMax = data.revenue === maxRevenue && data.revenue > 0;
                                        return (
                                            <div key={index} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                                                <div className="relative w-full flex flex-col justify-end" style={{ height: '88px' }}>
                                                    {data.revenue > 0 && (
                                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex flex-col items-center z-20 pointer-events-none">
                                                            <div className="bg-zinc-800 border border-zinc-600 text-white text-xs py-1.5 px-2.5 rounded-lg whitespace-nowrap shadow-xl">
                                                                <div className="text-amber-400 font-semibold">دج {data.revenue.toLocaleString()}</div>
                                                                <div className="text-green-400 text-xs">عمولة: دج {data.commission.toLocaleString()}</div>
                                                            </div>
                                                            <div className="w-1.5 h-1.5 bg-zinc-800 border-r border-b border-zinc-600 rotate-45 -mt-1" />
                                                        </div>
                                                    )}
                                                    <div
                                                        className={`w-full rounded-t-md transition-all duration-300 ${
                                                            isMax
                                                                ? 'bg-gradient-to-t from-amber-500 to-yellow-400 shadow-lg shadow-amber-500/20'
                                                                : 'bg-gradient-to-t from-zinc-600 to-zinc-500 group-hover:from-amber-600 group-hover:to-yellow-500'
                                                        }`}
                                                        style={{ height: `${Math.max(pct, data.revenue > 0 ? 4 : 0)}%` }}
                                                    />
                                                </div>
                                                <span className={`text-xs transition-colors ${isMax ? 'text-amber-400 font-semibold' : 'text-zinc-500 group-hover:text-zinc-300'}`}>
                                                    {data.month}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Commission Editor */}
                    <CommissionEditor
                        commissions={commissions}
                        onSave={handleSaveCommissions}
                        saving={saving}
                    />
                </div>

                {/* Type Breakdown */}
                {Object.keys(typeBreakdown).length > 0 && (
                    <div className="bg-gradient-to-br from-zinc-900/80 to-zinc-800/80 rounded-xl border border-zinc-700/50 p-5 mb-4">
                        <div className="flex items-center gap-2 mb-4">
                            <Percent className="w-4 h-4 text-amber-400" />
                            <h2 className="text-sm font-semibold text-white">توزيع الإيرادات حسب النوع</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {Object.entries(typeBreakdown).map(([type, data]) => {
                                const meta     = getTypeMeta(type);
                                const totalRev = stats?.totalRevenue || 1;
                                const pct      = ((data.revenue / totalRev) * 100).toFixed(1);
                                return (
                                    <div key={type} className="bg-zinc-800/50 rounded-lg p-3 border border-zinc-700/40">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className={`w-2 h-2 rounded-full ${meta.dot}`} />
                                            <span className="text-white text-sm font-semibold">{type}</span>
                                            <span className="mr-auto text-xs text-zinc-500">{data.count} معاملة</span>
                                        </div>
                                        <div className="text-lg font-bold text-white mb-1">دج {fmt(data.revenue)}</div>
                                        <div className="flex items-center justify-between text-xs mb-2">
                                            <span className="text-green-400">عمولة المنصة: دج {fmt(data.platformGain)}</span>
                                            <span className="text-zinc-500">{pct}%</span>
                                        </div>
                                        <div className="h-1.5 bg-zinc-700/60 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full bg-gradient-to-l ${meta.bar} rounded-full transition-all`}
                                                style={{ width: `${pct}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Filter Toggle */}
                <div className="mb-4">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="w-full bg-gradient-to-br from-zinc-900/80 to-zinc-800/80 rounded-xl p-3 border border-zinc-700/50 hover:border-amber-500/50 transition-all flex items-center justify-between"
                    >
                        <span className="text-white font-semibold text-sm">{showFilters ? 'إخفاء الفلاتر' : 'إظهار الفلاتر'}</span>
                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
                    </button>
                </div>

                {/* Filters */}
                {showFilters && (
                    <div className="bg-gradient-to-br from-zinc-900/80 to-zinc-800/80 rounded-xl p-4 border border-zinc-700/50 mb-4">
                        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
                            <div className="relative flex-1">
                                <select value={filterType} onChange={(e) => setFilterType(e.target.value)}
                                    className="w-full bg-zinc-800/50 border border-zinc-700 text-white text-sm px-4 py-2.5 pr-10 rounded-lg appearance-none cursor-pointer hover:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all"
                                    style={{ direction: 'rtl' }}>
                                    <option value="all">جميع الأنواع</option>
                                    {uniqueTypes.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                            <div className="relative flex-1">
                                <select value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)}
                                    className="w-full bg-zinc-800/50 border border-zinc-700 text-white text-sm px-4 py-2.5 pr-10 rounded-lg appearance-none cursor-pointer hover:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all"
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
                                <input type="text" placeholder="ابحث عن عميل أو فنان أو عنصر..."
                                    value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-zinc-800/50 border border-zinc-700 text-white text-sm px-4 py-2.5 pl-10 rounded-lg hover:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all"
                                    style={{ direction: 'rtl' }} />
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            </div>
                        </div>
                    </div>
                )}

                {/* Transactions Table */}
                <div className="bg-gradient-to-br from-zinc-900/80 to-zinc-800/80 rounded-xl border border-zinc-700/50 overflow-hidden">
                    <div className="p-4 flex items-center justify-between border-b border-zinc-700/50">
                        <div>
                            <h2 className="text-lg font-bold">سجل المعاملات الكامل</h2>
                            <p className="text-gray-400 text-xs mt-0.5">{filtered.length} معاملة</p>
                        </div>
                        <button
                            onClick={exportToPDF}
                            className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-black px-4 py-2 rounded-lg font-semibold text-sm hover:from-amber-600 hover:to-yellow-600 transition-all"
                        >
                            <Download className="w-4 h-4" />
                            تصدير PDF
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-zinc-900/50">
                                <tr>
                                    {['التاريخ','النوع','العنصر','العميل','الكوتش','المبلغ الكلي','عمولة المنصة','صافي الكوتش','الحالة'].map(h => (
                                        <th key={h} className="px-4 py-4 text-right text-xs font-semibold text-gray-300 whitespace-nowrap">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan="9" className="px-6 py-12 text-center text-gray-500">
                                            لا توجد معاملات تطابق الفلاتر المحددة
                                        </td>
                                    </tr>
                                ) : filtered.map((t) => (
                                    <tr key={t.id} className="hover:bg-zinc-800/50 transition-colors">
                                        <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">{t.date}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                                t.type === 'ورشة' ? 'bg-amber-500/20 text-amber-400'
                                              : t.type === 'دورة' ? 'bg-emerald-500/20 text-emerald-400'
                                              :                     'bg-blue-500/20 text-blue-400'
                                            }`}>
                                                {t.type}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm max-w-[140px] truncate">{t.item}</td>
                                        <td className="px-4 py-3 text-xs text-gray-400">{t.customer}</td>
                                        <td className="px-4 py-3 text-xs text-gray-400">{t.artist}</td>
                                        <td className="px-4 py-3 text-sm font-semibold whitespace-nowrap">دج {t.amount.toLocaleString()}</td>
                                        <td className="px-4 py-3 text-sm text-green-400 font-semibold whitespace-nowrap">
                                            دج {t.commission.toLocaleString()}
                                            <span className="text-zinc-600 text-xs mr-1">({t.commissionRate}%)</span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-amber-400 font-bold whitespace-nowrap">دج {t.net.toLocaleString()}</td>
                                        <td className="px-4 py-3">
                                            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400">
                                                {t.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filtered.length > 0 && (
                        <div className="p-4 border-t border-zinc-700/50 bg-zinc-900/30">
                            <div className="flex flex-wrap gap-4 text-sm">
                                <span className="text-zinc-400">
                                    إجمالي المبالغ: <span className="text-white font-bold">دج {filtered.reduce((s, t) => s + t.amount, 0).toLocaleString()}</span>
                                </span>
                                <span className="text-zinc-400">
                                    عمولات المنصة: <span className="text-green-400 font-bold">دج {filtered.reduce((s, t) => s + t.commission, 0).toLocaleString()}</span>
                                </span>
                                <span className="text-zinc-400">
                                    صافي الكوتشات: <span className="text-amber-400 font-bold">دج {filtered.reduce((s, t) => s + t.net, 0).toLocaleString()}</span>
                                </span>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default AdminEarnings;