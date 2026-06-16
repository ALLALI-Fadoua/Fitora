import { useState, useEffect } from 'react';
import { Search, Mail, Phone, Edit, Ban, CheckCircle, Eye, X, ChevronDown, BadgeCheck, Calendar, BookOpen, ShieldAlert, Sparkles, Star } from 'lucide-react';
import { USERS as MOCK_USERS } from '../../utils/mockData';

// ─── Modal: عرض التفاصيل ──────────────────────────────────────────────────────
const ViewModal = ({ user, onClose }) => {
    if (!user) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" dir="rtl">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-2xl border border-zinc-700/50 w-full max-w-md shadow-2xl animate-fadeIn">
                <div className="flex items-center justify-between p-5 border-b border-zinc-700/50">
                    <h2 className="text-lg font-bold text-white">تفاصيل المستخدم</h2>
                    <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-zinc-700 transition-all">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-5 space-y-5">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                            {user.name.charAt(0)}
                        </div>
                        <div>
                            <p className="text-xl font-bold text-white">{user.name}</p>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${user.type === 'COACH' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                {user.type === 'COACH' ? 'مدرب' : 'متدرب'}
                            </span>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                        {[
                            { icon: <Mail className="w-4 h-4 text-amber-400 shrink-0" />, label: 'البريد الإلكتروني', value: user.email },
                            { icon: <Phone className="w-4 h-4 text-amber-400 shrink-0" />, label: 'رقم الهاتف', value: user.phone },
                            {
                                icon: <Calendar className="w-4 h-4 text-amber-400 shrink-0" />,
                                label: 'تاريخ التسجيل',
                                value: `${new Date(user.joinDate).toLocaleDateString('ar-DZ', { year: 'numeric', month: '2-digit', day: '2-digit' })} - ${new Date(user.joinDate).toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' })}`,
                            },
                            { icon: <BookOpen className="w-4 h-4 text-amber-400 shrink-0" />, label: 'عدد الجلسات المحجوزة', value: user.bookings },
                        ].map(({ icon, label, value }) => (
                            <div key={label} className="flex items-center gap-3 bg-zinc-800/60 rounded-xl p-3">
                                {icon}
                                <div>
                                    <p className="text-xs text-gray-500 mb-0.5">{label}</p>
                                    <p className="text-sm text-white font-medium">{value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center justify-between bg-zinc-800/60 rounded-xl p-3">
                        <span className="text-sm text-gray-400">الحالة</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.status === 'نشط' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                            {user.status}
                        </span>
                    </div>
                </div>
                <div className="p-5 pt-0">
                    <button onClick={onClose} className="w-full py-2.5 rounded-xl bg-zinc-700 hover:bg-zinc-600 text-white text-sm font-semibold transition-all">
                        إغلاق
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─── Modal: تعديل ─────────────────────────────────────────────────────────────
const EditModal = ({ user, onClose, onSave }) => {
    // ✅ FIX: initialiser directement depuis les props — suppression du useEffect
    const [form, setForm] = useState({
        name:   user?.name   || '',
        email:  user?.email  || '',
        phone:  user?.phone  || '',
        status: user?.status || 'نشط',
    });
    const [saving, setSaving] = useState(false);

    if (!user) return null;

    const handleSave = () => {
        setSaving(true);
        setTimeout(() => {
            onSave && onSave({ ...user, ...form });
            setSaving(false);
            onClose();
        }, 600);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" dir="rtl">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-2xl border border-zinc-700/50 w-full max-w-md shadow-2xl animate-fadeIn">
                <div className="flex items-center justify-between p-5 border-b border-zinc-700/50">
                    <h2 className="text-lg font-bold text-white">تعديل المستخدم</h2>
                    <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-zinc-700 transition-all">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-5 space-y-4">
                    {[
                        { label: 'الاسم',             key: 'name',  type: 'text',  icon: <BadgeCheck className="w-4 h-4 text-gray-400" /> },
                        { label: 'البريد الإلكتروني', key: 'email', type: 'email', icon: <Mail       className="w-4 h-4 text-gray-400" /> },
                        { label: 'رقم الهاتف',        key: 'phone', type: 'text',  icon: <Phone      className="w-4 h-4 text-gray-400" /> },
                    ].map(({ label, key, type, icon }) => (
                        <div key={key}>
                            <label className="text-xs text-gray-400 mb-1.5 block">{label}</label>
                            <div className="relative">
                                <span className="absolute right-3 top-1/2 -translate-y-1/2">{icon}</span>
                                <input
                                    type={type}
                                    value={form[key]}
                                    onChange={e => setForm({ ...form, [key]: e.target.value })}
                                    className="w-full bg-zinc-800/60 border border-zinc-700 text-white text-sm px-4 py-2.5 pr-10 rounded-xl hover:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all"
                                />
                            </div>
                        </div>
                    ))}
                    <div>
                        <label className="text-xs text-gray-400 mb-1.5 block">الحالة</label>
                        <div className="relative">
                            <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            <select
                                value={form.status}
                                onChange={e => setForm({ ...form, status: e.target.value })}
                                className="w-full bg-zinc-800/60 border border-zinc-700 text-white text-sm px-4 py-2.5 rounded-xl appearance-none cursor-pointer hover:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all"
                            >
                                <option value="نشط">نشط</option>
                                <option value="معلق">معلق</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="p-5 pt-0 flex gap-3">
                    <button onClick={onClose} className="flex-1 py-2.5 rounded-xl bg-zinc-700 hover:bg-zinc-600 text-white text-sm font-semibold transition-all">
                        إلغاء
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black text-sm font-bold transition-all shadow-lg shadow-amber-500/20 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─── Modal: تعليق / تفعيل ─────────────────────────────────────────────────────
const BanModal = ({ user, onClose, onSave }) => {
    const [loading, setLoading] = useState(false);

    if (!user) return null;

    const isBanned = user.status === 'معلق';

    const handleToggle = () => {
        setLoading(true);
        setTimeout(() => {
            onSave && onSave({ ...user, status: isBanned ? 'نشط' : 'معلق' });
            setLoading(false);
            onClose();
        }, 600);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" dir="rtl">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
            <div className={`relative bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-2xl border w-full max-w-sm shadow-2xl animate-fadeIn ${isBanned ? 'border-green-500/30' : 'border-red-500/30'}`}>
                <div className="flex items-center justify-between p-5 border-b border-zinc-700/50">
                    <h2 className="text-lg font-bold text-white">
                        {isBanned ? 'تفعيل الحساب' : 'تعليق الحساب'}
                    </h2>
                    <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-zinc-700 transition-all">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-5 text-center space-y-4">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${isBanned ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'}`}>
                        {isBanned
                            ? <CheckCircle className="w-8 h-8 text-green-400" />
                            : <ShieldAlert className="w-8 h-8 text-red-400" />
                        }
                    </div>
                    <div>
                        <p className="text-white font-semibold text-base mb-1">هل أنت متأكد؟</p>
                        <p className="text-gray-400 text-sm">
                            {isBanned
                                ? <><span className="text-white font-semibold">{user.name}</span> سيتمكن من الوصول إلى المنصة مجدداً.</>
                                : <><span className="text-white font-semibold">{user.name}</span> لن يتمكن من الوصول إلى المنصة.</>
                            }
                        </p>
                    </div>
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${isBanned ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
                        <span>الحالة الحالية:</span>
                        <span>{user.status}</span>
                        <span>←</span>
                        <span className={isBanned ? 'text-green-400' : 'text-red-400'}>
                            {isBanned ? 'نشط' : 'معلق'}
                        </span>
                    </div>
                </div>
                <div className="p-5 pt-0 flex gap-3">
                    <button onClick={onClose} className="flex-1 py-2.5 rounded-xl bg-zinc-700 hover:bg-zinc-600 text-white text-sm font-semibold transition-all">
                        إلغاء
                    </button>
                    <button
                        onClick={handleToggle}
                        disabled={loading}
                        className={`flex-1 py-2.5 rounded-xl text-white text-sm font-bold transition-all shadow-lg disabled:opacity-60 disabled:cursor-not-allowed ${isBanned
                            ? 'bg-green-500 hover:bg-green-600 shadow-green-500/20'
                            : 'bg-red-500 hover:bg-red-600 shadow-red-500/20'
                        }`}
                    >
                        {loading
                            ? (isBanned ? 'جاري التفعيل...' : 'جاري التعليق...')
                            : (isBanned ? 'تفعيل الحساب' : 'تعليق الحساب')
                        }
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─── Main Component ────────────────────────────────────────────────────────────
const AdminUsers = () => {
    const [searchTerm,   setSearchTerm]   = useState('');
    const [filterType,   setFilterType]   = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [showFilters,  setShowFilters]  = useState(false);

    const [viewUser, setViewUser] = useState(null);
    const [editUser, setEditUser] = useState(null);
    const [banUser,  setBanUser]  = useState(null);

    const [users,   setUsers]   = useState([]);
    const [loading, setLoading] = useState(true);

    // ── Load mock users on mount ──────────────────────────────────────────────
    useEffect(() => {
        const t = setTimeout(() => {
            setUsers(MOCK_USERS);
            setLoading(false);
        }, 600);
        return () => clearTimeout(t);
    }, []);

    // ── Lock scroll when modal open ───────────────────────────────────────────
    useEffect(() => {
        document.body.style.overflow = (viewUser || editUser || banUser) ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [viewUser, editUser, banUser]);

    // ── Handlers ──────────────────────────────────────────────────────────────
    const handleSaveEdit = (updatedUser) => {
        setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    };

    const handleSaveBan = (updatedUser) => {
        setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    };

    // ── Filtered list ─────────────────────────────────────────────────────────
    const filteredUsers = users.filter(u => {
        const matchSearch = u.name?.includes(searchTerm) || u.email?.includes(searchTerm);
        const matchType   = filterType   === 'all' || (filterType === 'customer' ? u.type === 'CANDIDATE' : u.type === 'COACH');
        const matchStatus = filterStatus === 'all' || (filterStatus === 'active'  ? u.status === 'نشط' : u.status === 'معلق');
        return matchSearch && matchType && matchStatus;
    });

    // ── Stats ─────────────────────────────────────────────────────────────────
    const totalUsers     = users.length;
    const totalArtists   = users.filter(u => u.type === 'COACH').length;
    const activeUsers    = users.filter(u => u.status === 'نشط').length;
    const suspendedUsers = users.filter(u => u.status === 'معلق').length;

    return (
        <div className="min-h-screen bg-zinc-950 text-white p-6" dir="rtl">
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: scale(0.96) translateY(8px); }
                    to   { opacity: 1; transform: scale(1) translateY(0); }
                }
                .animate-fadeIn { animation: fadeIn 0.2s ease-out forwards; }
            `}</style>

            {/* ── Modals ── */}
            <ViewModal user={viewUser} onClose={() => setViewUser(null)} />
            <EditModal
                user={editUser}
                onClose={() => setEditUser(null)}
                onSave={handleSaveEdit}
            />
            <BanModal
                user={banUser}
                onClose={() => setBanUser(null)}
                onSave={handleSaveBan}
            />

            <div className="max-w-7xl mx-auto">

                {/* ── Title ── */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-amber-500 to-yellow-500 bg-clip-text text-transparent">
                        إدارة المستخدمين
                    </h1>
                    <p className="text-gray-400">إدارة حسابات المستخدمين والمدربين</p>
                </div>

                {/* ── Stats Cards ── */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    {[
                        { label: 'إجمالي المستخدمين',   value: totalUsers,     icon: <Sparkles    className="w-6 h-6 text-amber-400"  />, bg: 'bg-amber-500/20',  border: 'hover:border-amber-500/50'  },
                        { label: 'المدربون',             value: totalArtists,   icon: <Star        className="w-6 h-6 text-purple-400" />, bg: 'bg-purple-500/20', border: 'hover:border-purple-500/50' },
                        { label: 'المستخدمون النشطون',  value: activeUsers,    icon: <CheckCircle className="w-6 h-6 text-green-400"  />, bg: 'bg-green-500/20',  border: 'hover:border-green-500/50'  },
                        { label: 'الحسابات المعلقة',    value: suspendedUsers, icon: <Ban         className="w-6 h-6 text-red-400"    />, bg: 'bg-red-500/20',    border: 'hover:border-red-500/50'    },
                    ].map(({ label, value, icon, bg, border }) => (
                        <div key={label} className={`bg-gradient-to-br from-zinc-900/80 to-zinc-800/80 backdrop-blur-sm rounded-xl p-4 border border-zinc-700/50 ${border} transition-all`}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-xs mb-0.5">{label}</p>
                                    <p className="text-2xl font-bold text-white">{value}</p>
                                </div>
                                <div className={`${bg} p-3 rounded-lg`}>{icon}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Toggle Filters ── */}
                <div className="mb-4">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="w-full bg-gradient-to-br from-zinc-900/80 to-zinc-800/80 backdrop-blur-sm rounded-xl p-3 border border-zinc-700/50 hover:border-amber-500/50 transition-all flex items-center justify-between"
                    >
                        <span className="text-white font-semibold text-sm">{showFilters ? 'إخفاء الفلاتر' : 'إظهار الفلاتر'}</span>
                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} />
                    </button>
                </div>

                {/* ── Filters ── */}
                {showFilters && (
                    <div className="bg-gradient-to-br from-zinc-900/80 to-zinc-800/80 backdrop-blur-sm rounded-xl p-4 border border-zinc-700/50 mb-6">
                        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
                            <div className="relative flex-1 md:flex-[2]">
                                <input
                                    type="text"
                                    placeholder="البحث عن مستخدم..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-zinc-800/50 border border-zinc-700 text-white text-sm px-4 py-2.5 pr-10 rounded-lg hover:border-amber-500/50 transition-all focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                                    style={{ direction: 'rtl' }}
                                />
                                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            </div>
                            <div className="relative flex-1">
                                <select
                                    value={filterType}
                                    onChange={(e) => setFilterType(e.target.value)}
                                    className="w-full bg-zinc-800/50 border border-zinc-700 text-white text-sm px-4 py-2.5 pr-10 rounded-lg appearance-none cursor-pointer hover:border-amber-500/50 transition-all focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                                    style={{ direction: 'rtl' }}
                                >
                                    <option value="all">جميع المستخدمين</option>
                                    <option value="customer">زبائن</option>
                                    <option value="artist">مدربين</option>
                                </select>
                                <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                            <div className="relative flex-1">
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="w-full bg-zinc-800/50 border border-zinc-700 text-white text-sm px-4 py-2.5 pr-10 rounded-lg appearance-none cursor-pointer hover:border-amber-500/50 transition-all focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                                    style={{ direction: 'rtl' }}
                                >
                                    <option value="all">جميع الحالات</option>
                                    <option value="active">نشط</option>
                                    <option value="suspended">معلق</option>
                                </select>
                                <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                        </div>
                    </div>
                )}

                {/* ── Table ── */}
                {loading ? (
                    <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-2xl border border-gray-800 p-12 flex items-center justify-center">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                            <p className="text-gray-400 text-sm">جاري تحميل المستخدمين...</p>
                        </div>
                    </div>
                ) : (
                    <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-2xl border border-gray-800 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-zinc-800/50 border-b border-gray-700">
                                    <tr>
                                        <th className="text-right px-6 py-4 text-sm font-semibold text-gray-300">الاسم</th>
                                        <th className="text-right px-6 py-4 text-sm font-semibold text-gray-300">معلومات التواصل</th>
                                        <th className="text-right px-6 py-4 text-sm font-semibold text-gray-300">النوع</th>
                                        <th className="text-right px-6 py-4 text-sm font-semibold text-gray-300">تاريخ التسجيل</th>
                                        <th className="text-right px-6 py-4 text-sm font-semibold text-gray-300">الحجوزات</th>
                                        <th className="text-right px-6 py-4 text-sm font-semibold text-gray-300">الحالة</th>
                                        <th className="text-right px-6 py-4 text-sm font-semibold text-gray-300">الإجراءات</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800">
                                    {filteredUsers.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-16 text-center text-gray-500">لا يوجد مستخدمون مطابقون للبحث</td>
                                        </tr>
                                    ) : filteredUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-zinc-800/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center font-bold">
                                                        {user.name.charAt(0)}
                                                    </div>
                                                    <span className="font-semibold">{user.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2 text-sm text-gray-400">
                                                        <Mail className="w-4 h-4" /><span>{user.email}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-gray-400">
                                                        <Phone className="w-4 h-4" /><span>{user.phone}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.type === 'COACH' ? 'bg-purple-500/20 text-purple-500' : 'bg-blue-500/20 text-blue-500'}`}>
                                                    {user.type === 'COACH' ? 'مدرب' : 'متدرب'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <div className="text-white">
                                                    {new Date(user.joinDate).toLocaleDateString('ar-DZ', { year: 'numeric', month: '2-digit', day: '2-digit' })}
                                                </div>
                                                <div className="text-gray-400 text-xs mt-0.5">
                                                    {new Date(user.joinDate).toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="font-semibold">{user.bookings}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.status === 'نشط' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                                                    {user.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <button onClick={() => setViewUser(user)} className="p-2 bg-amber-500/10 text-amber-500 rounded-lg hover:bg-amber-500/20 transition-colors" title="عرض التفاصيل">
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => setEditUser(user)} className="p-2 bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-500/20 transition-colors" title="تعديل">
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => setBanUser(user)} className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors" title="تعليق الحساب">
                                                        <Ban className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminUsers;