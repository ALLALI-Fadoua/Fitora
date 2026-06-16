import { useState, useEffect } from 'react';
import {
    Search, Star, Sparkles, Calendar, DollarSign, CheckCircle,
    XCircle, Edit, Eye, ChevronDown, Mail, Phone, MapPin,
    Briefcase, ArrowUpRight, BadgeCheck, X
} from 'lucide-react';
import { COACHES, SESSIONS, EARNINGS } from '../../utils/mockData';

const buildCoaches = () =>
    COACHES.map(c => {
        const coachSessions = SESSIONS.filter(s => s.coachId._id === c._id);
        const coachRevenue  = EARNINGS.transactions
            .filter(t => t.customer && coachSessions.some(s => s.title === t.item))
            .reduce((sum, t) => sum + (t.net || 0), 0);
        return {
            id:            c._id,
            name:          c.fullName,
            specialty:     c.specialty,
            location:      c.location,
            experience:    c.experience,
            rating:        c.rating,
            reviewsCount:  c.reviews,
            sessionsCount: coachSessions.length,
            learnersCount: coachSessions.reduce((s, sess) =>
                s + (sess.availableSeats !== undefined ? (20 - sess.availableSeats) : 0), 0),
            revenue:       `DA ${(coachRevenue || Math.floor(Math.random() * 200000 + 50000)).toLocaleString()}`,
            verified:      c.isVerified,
            status:        'نشط',
            avatarColor:   c.avatarColor,
            email:         `${c._id}@fitora.dz`,
            phone:         '+213 5XX XXX XXX',
        };
    });

/* ── Toast Notification ── */
const Toast = ({ n, onClose }) => {
    if (!n.show) return null;
    return (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[100] animate-bounce-in">
            <div className={`flex items-center gap-3 px-5 py-3 rounded-xl border backdrop-blur-xl shadow-2xl ${
                n.type === 'success'
                    ? 'bg-emerald-500/90 border-emerald-400/50 text-white'
                    : 'bg-amber-500/90 border-amber-400/50 text-white'
            }`}>
                {n.type === 'success'
                    ? <CheckCircle className="w-4 h-4 flex-shrink-0" />
                    : <Sparkles   className="w-4 h-4 flex-shrink-0" />}
                <span className="font-bold text-sm">{n.message}</span>
                <button onClick={onClose} className="mr-1 opacity-70 hover:opacity-100">
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

/* ── Info Row (modal) ── */
const InfoRow = ({ icon: Icon, label, value }) => {
    if (!value) return null;
    return (
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.05] last:border-0">
            <span className="text-zinc-300 text-sm text-left break-all">{value}</span>
            <div className="flex items-center gap-2 text-zinc-500 text-sm flex-shrink-0 mr-3">
                <span>{label}</span>
                <Icon className="w-4 h-4 text-amber-500" />
            </div>
        </div>
    );
};

const AdminCoaches = () => {
    const [coaches,       setCoaches]       = useState(buildCoaches());
    const [searchTerm,    setSearchTerm]    = useState('');
    const [filterStatus,  setFilterStatus]  = useState('all');
    const [showFilters,   setShowFilters]   = useState(false);
    const [selectedCoach, setSelectedCoach] = useState(null);
    const [editMode,      setEditMode]      = useState(false);
    const [editForm,      setEditForm]      = useState({});
    const [notification,  setNotification]  = useState({ show: false, type: '', message: '' });

    const showNotif = (type, message) => {
        setNotification({ show: true, type, message });
        setTimeout(() => setNotification({ show: false, type: '', message: '' }), 3200);
    };

    useEffect(() => {
        document.body.style.overflow = selectedCoach ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [selectedCoach]);

    const openModal  = (coach) => { setSelectedCoach(coach); setEditMode(false); };
    const closeModal = () => { setSelectedCoach(null); setEditMode(false); setEditForm({}); };
    const openEdit   = (coach) => {
        setEditForm({ name: coach.name, email: coach.email, phone: coach.phone, specialty: coach.specialty, location: coach.location || '', experience: coach.experience });
        setEditMode(true);
    };

    const handleSaveEdit = () => {
        setCoaches(prev => prev.map(c => c.id !== selectedCoach.id ? c : { ...c, ...editForm }));
        setSelectedCoach(prev => ({ ...prev, ...editForm }));
        setEditMode(false);
        showNotif('success', 'تم حفظ التعديلات بنجاح');
    };

    const handleVerify = (coachId) => {
        setCoaches(prev => prev.map(c => c.id !== coachId ? c : { ...c, verified: true }));
        if (selectedCoach?.id === coachId) setSelectedCoach(prev => ({ ...prev, verified: true }));
        showNotif('success', 'تم توثيق الكوتش بنجاح');
    };

    const filtered = coaches.filter(c => {
        const matchSearch = !searchTerm || c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.specialty.toLowerCase().includes(searchTerm.toLowerCase());
        const matchStatus = filterStatus === 'all' || (filterStatus === 'verified' && c.verified) || (filterStatus === 'pending' && !c.verified);
        return matchSearch && matchStatus;
    });

    const getInitials = (name) => name?.trim().split(' ').map(w => w[0]).slice(0, 2).join('') || '؟';

    return (
        <>
        <Toast n={notification} onClose={() => setNotification({ show: false, type: '', message: '' })} />
        <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-6" dir="rtl">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-black bg-gradient-to-l from-violet-400 to-purple-300 bg-clip-text text-transparent mb-1">
                        الكوتشات والمدربون
                    </h1>
                    <p className="text-zinc-500 text-sm">Coaches · إدارة حسابات الكوتشات</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                    {[
                        { label: 'إجمالي الكوتشات',  en: 'Total',    value: coaches.length,                         icon: Briefcase,   accent: 'text-violet-400', bg: 'bg-violet-500/10' },
                        { label: 'الكوتشات الموثقون', en: 'Verified', value: coaches.filter(c => c.verified).length, icon: BadgeCheck,  accent: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                        { label: 'إجمالي المتدربين',  en: 'Learners', value: coaches.reduce((s, c) => s + (c.learnersCount || 0), 0), icon: Sparkles, accent: 'text-sky-400', bg: 'bg-sky-500/10' },
                    ].map(({ label, en, value, icon: Icon, accent, bg }) => (
                        <div key={label} className="bg-[#111] border border-white/[0.07] rounded-2xl p-4 flex items-center gap-4">
                            <div className={`p-3 rounded-xl ${bg} flex-shrink-0`}>
                                <Icon className={`w-5 h-5 ${accent}`} />
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] text-zinc-600 font-semibold uppercase tracking-wider">{en} · {label}</p>
                                <p className={`text-2xl font-black ${accent} mt-0.5`}>{value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Filter toggle */}
                <div className="mb-3">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="w-full bg-[#111] border border-white/[0.07] rounded-xl p-3 hover:border-white/[0.12] transition-all flex items-center justify-between"
                    >
                        <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                        <span className="text-white font-semibold text-sm">{showFilters ? 'إخفاء الفلاتر' : 'إظهار الفلاتر'}</span>
                    </button>
                </div>

                {showFilters && (
                    <div className="bg-[#111] border border-white/[0.07] rounded-xl p-4 mb-5">
                        <div className="flex flex-col md:flex-row gap-3">
                            <div className="relative flex-1">
                                <select
                                    value={filterStatus}
                                    onChange={e => setFilterStatus(e.target.value)}
                                    className="w-full bg-zinc-900 border border-white/[0.07] text-white text-sm px-4 py-2.5 rounded-xl appearance-none focus:outline-none focus:border-violet-500/40 transition-colors"
                                    style={{ direction: 'rtl' }}
                                >
                                    <option value="all">جميع الكوتشات</option>
                                    <option value="verified">موثق</option>
                                    <option value="pending">غير موثق</option>
                                </select>
                                <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                            </div>
                            <div className="relative flex-1 md:flex-[2]">
                                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                <input
                                    type="text"
                                    placeholder="ابحث عن كوتش..."
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    className="w-full bg-zinc-900 border border-white/[0.07] text-white text-sm px-4 py-2.5 pr-10 rounded-xl focus:outline-none focus:border-violet-500/40 transition-colors"
                                    style={{ direction: 'rtl' }}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Grid */}
                {filtered.length === 0 ? (
                    <div className="text-center py-20 text-zinc-600">لا يوجد كوتشات مطابقون للبحث</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filtered.map(coach => (
                            <div key={coach.id} className="bg-[#111] border border-white/[0.07] hover:border-white/[0.14] rounded-2xl overflow-hidden transition-all group">

                                {/* Card header */}
                                <div className="relative bg-[#161616] px-5 pt-5 pb-4">
                                    <div className="absolute top-3 left-3 flex gap-2">
                                        {coach.verified && (
                                            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 text-[10px] font-bold">
                                                <BadgeCheck className="w-3 h-3" /> موثق
                                            </span>
                                        )}
                                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                            {coach.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 mt-6">
                                        <div className={`w-14 h-14 flex-shrink-0 rounded-2xl bg-gradient-to-br ${coach.avatarColor} flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300`}>
                                            <span className="text-lg font-black text-white">{getInitials(coach.name)}</span>
                                        </div>
                                        <div className="text-right flex-1 min-w-0">
                                            <h3 className="text-base font-black text-white truncate">{coach.name}</h3>
                                            <p className="text-amber-400 text-xs font-bold truncate">{coach.specialty}</p>
                                            {coach.location && (
                                                <p className="text-zinc-600 text-[11px] flex items-center gap-1 justify-end mt-0.5">
                                                    <MapPin className="w-3 h-3" />{coach.location}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Card body */}
                                <div className="p-4">
                                    <div className="flex items-center justify-end gap-2 mb-4 pb-3 border-b border-white/[0.06]">
                                        <span className="text-zinc-500 text-xs">({coach.reviewsCount} تقييم)</span>
                                        <span className="font-black text-base text-white">{coach.rating}</span>
                                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 mb-4">
                                        {[
                                            { icon: Calendar,  label: 'الجلسات',    value: coach.sessionsCount, accent: 'text-amber-400',   bg: 'bg-amber-500/8'  },
                                            { icon: Sparkles,  label: 'المتدربون',  value: coach.learnersCount, accent: 'text-sky-400',     bg: 'bg-sky-500/8'    },
                                            { icon: Briefcase, label: 'الخبرة',     value: `${coach.experience}س`, accent: 'text-violet-400', bg: 'bg-violet-500/8' },
                                        ].map(({ icon: Icon, label, value, accent, bg }) => (
                                            <div key={label} className={`${bg} border border-white/[0.04] rounded-xl p-2.5 text-center`}>
                                                <Icon className={`w-3.5 h-3.5 ${accent} mx-auto mb-1`} />
                                                <p className="text-[10px] text-zinc-600 mb-0.5">{label}</p>
                                                <p className={`text-sm font-black ${accent}`}>{value}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => openModal(coach)}
                                            className="flex-1 flex items-center justify-center gap-1.5 bg-amber-500/10 text-amber-400 py-2 rounded-xl hover:bg-amber-500/20 transition-colors text-xs font-bold border border-amber-500/15 hover:border-amber-500/30"
                                        >
                                            <Eye className="w-3.5 h-3.5" /> عرض
                                        </button>
                                        <button
                                            onClick={() => { openModal(coach); openEdit(coach); }}
                                            className="flex-1 flex items-center justify-center gap-1.5 bg-sky-500/10 text-sky-400 py-2 rounded-xl hover:bg-sky-500/20 transition-colors text-xs font-bold border border-sky-500/15 hover:border-sky-500/30"
                                        >
                                            <Edit className="w-3.5 h-3.5" /> تعديل
                                        </button>
                                        {!coach.verified && (
                                            <button
                                                onClick={() => handleVerify(coach.id)}
                                                className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-500/10 text-emerald-400 py-2 rounded-xl hover:bg-emerald-500/20 transition-colors text-xs font-bold border border-emerald-500/15 hover:border-emerald-500/30"
                                            >
                                                <BadgeCheck className="w-3.5 h-3.5" /> توثيق
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>

        {/* Modal */}
        {selectedCoach && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={closeModal}>
                <div
                    className="bg-[#111] border border-white/[0.1] rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Modal header */}
                    <div className="flex items-center justify-between p-5 border-b border-white/[0.06] flex-shrink-0">
                        <button onClick={closeModal} className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-white/[0.06] transition-all">
                            <X className="w-5 h-5" />
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <h2 className="text-base font-black text-white">{selectedCoach.name}</h2>
                                <p className="text-amber-400 text-xs font-semibold">{selectedCoach.specialty}</p>
                            </div>
                            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${selectedCoach.avatarColor} flex items-center justify-center shadow-lg`}>
                                <span className="text-base font-black text-white">{getInitials(selectedCoach.name)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Modal body */}
                    <div className="overflow-y-auto flex-1 p-5 space-y-5" dir="rtl">
                        {editMode ? (
                            <div className="space-y-3">
                                <p className="text-[10px] text-amber-500/60 font-black tracking-widest uppercase border-r-2 border-amber-500/40 pr-2">
                                    تعديل بيانات الكوتش
                                </p>
                                {[
                                    { label: 'الاسم الكامل',  field: 'name'       },
                                    { label: 'البريد',        field: 'email'      },
                                    { label: 'الهاتف',        field: 'phone'      },
                                    { label: 'التخصص',        field: 'specialty'  },
                                    { label: 'الموقع',        field: 'location'   },
                                    { label: 'سنوات الخبرة', field: 'experience', type: 'number' },
                                ].map(({ label, field, type }) => (
                                    <div key={field}>
                                        <label className="text-[11px] text-zinc-500 block mb-1">{label}</label>
                                        <input
                                            type={type || 'text'}
                                            value={editForm[field] || ''}
                                            onChange={e => setEditForm(p => ({ ...p, [field]: e.target.value }))}
                                            className="w-full bg-zinc-900 border border-white/[0.07] text-white text-sm px-3 py-2.5 rounded-xl focus:outline-none focus:border-amber-500/40 transition-colors"
                                            dir="rtl"
                                        />
                                    </div>
                                ))}
                                <div className="flex gap-2 pt-2">
                                    <button onClick={handleSaveEdit} className="flex-1 bg-amber-500/15 text-amber-400 py-2.5 rounded-xl hover:bg-amber-500/25 transition-colors text-sm font-black border border-amber-500/25">
                                        حفظ التغييرات
                                    </button>
                                    <button onClick={() => setEditMode(false)} className="flex-1 bg-white/[0.04] text-zinc-400 py-2.5 rounded-xl hover:bg-white/[0.08] transition-colors text-sm border border-white/[0.07]">
                                        إلغاء
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-5">
                                <div>
                                    <p className="text-[10px] text-amber-500/60 font-black tracking-widest uppercase border-r-2 border-amber-500/40 pr-2 mb-2">
                                        معلومات الحساب
                                    </p>
                                    <div className="bg-[#161616] rounded-xl border border-white/[0.05] overflow-hidden">
                                        <InfoRow icon={Mail}     label="البريد"  value={selectedCoach.email} />
                                        <InfoRow icon={Phone}    label="الهاتف"  value={selectedCoach.phone} />
                                        <InfoRow icon={MapPin}   label="الموقع"  value={selectedCoach.location} />
                                        <InfoRow icon={Briefcase} label="الخبرة" value={selectedCoach.experience ? `${selectedCoach.experience} سنوات` : null} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { icon: Star,      label: 'التقييم',   value: selectedCoach.rating,        accent: 'text-amber-400',   bg: 'bg-amber-500/10'  },
                                        { icon: Calendar,  label: 'الجلسات',   value: selectedCoach.sessionsCount, accent: 'text-sky-400',     bg: 'bg-sky-500/10'    },
                                        { icon: DollarSign, label: 'الإيرادات', value: selectedCoach.revenue,      accent: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                                    ].map(({ icon: Icon, label, value, accent, bg }) => (
                                        <div key={label} className={`${bg} border border-white/[0.04] rounded-xl p-3 text-center`}>
                                            <Icon className={`w-4 h-4 ${accent} mx-auto mb-1`} />
                                            <p className="text-[10px] text-zinc-600">{label}</p>
                                            <p className={`text-sm font-black ${accent} mt-0.5`}>{value}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex gap-2 pt-1 border-t border-white/[0.06]">
                                    <button onClick={() => openEdit(selectedCoach)} className="flex-1 flex items-center justify-center gap-2 bg-sky-500/10 text-sky-400 py-2.5 rounded-xl hover:bg-sky-500/20 transition-colors text-xs font-bold border border-sky-500/15">
                                        <Edit className="w-4 h-4" /> تعديل
                                    </button>
                                    {!selectedCoach.verified && (
                                        <button onClick={() => handleVerify(selectedCoach.id)} className="flex-1 flex items-center justify-center gap-2 bg-emerald-500/10 text-emerald-400 py-2.5 rounded-xl hover:bg-emerald-500/20 transition-colors text-xs font-bold border border-emerald-500/15">
                                            <BadgeCheck className="w-4 h-4" /> توثيق
                                        </button>
                                    )}
                                    <button onClick={closeModal} className="flex-1 flex items-center justify-center gap-2 bg-white/[0.04] text-zinc-400 py-2.5 rounded-xl hover:bg-white/[0.08] transition-colors text-xs border border-white/[0.07]">
                                        إغلاق
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )}
        </>
    );
};

export default AdminCoaches;