import { useState, useEffect } from 'react';
import {
    Search, Plus, Edit, Sparkles, Clock, DollarSign, CheckCircle,
    XCircle, X, BookOpen, ChevronDown, Award, Layers, AlertCircle
} from 'lucide-react';
import { COACH_COURSES, COACHES } from '../../utils/mockData';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const delay = (ms = 400) => new Promise(r => setTimeout(r, ms));

const CATEGORIES = [
    'تطوير الذات', 'القيادة والإدارة', 'التسويق والمبيعات',
    'الصحة والعافية', 'التقنية والبرمجة', 'ريادة الأعمال', 'مالية', 'أخرى',
];

const STATUS_MAP = {
    'نشط':     { color: 'bg-green-500/20 text-green-400 border-green-500/40'  },
    'موقوف':   { color: 'bg-red-500/20   text-red-400   border-red-500/40'    },
    'غير نشط': { color: 'bg-gray-500/20  text-gray-400  border-gray-500/40'   },
};

const LEVEL_COLOR = {
    'مبتدئ': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
    'متوسط': 'bg-blue-500/20    text-blue-400    border-blue-500/40',
    'متقدم': 'bg-purple-500/20  text-purple-400  border-purple-500/40',
};

const EMPTY_FORM = {
    coachId: '', title: '', description: '', category: '', level: 'مبتدئ',
    type: 'مدفوعة', price: '', duration: '', hasCertificate: false, status: 'نشط',
};

// ─── Notification ─────────────────────────────────────────────────────────────
const Notification = ({ n, onClose }) => {
    if (!n.show) return null;
    return (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100]">
            <div className={`flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl border backdrop-blur-sm ${
                n.type === 'success' ? 'bg-green-500/90 border-green-400 text-white'
                : n.type === 'error' ? 'bg-red-500/90 border-red-400 text-white'
                : 'bg-amber-500/90 border-amber-400 text-white'
            }`}>
                {n.type === 'success' && <CheckCircle className="w-5 h-5" />}
                {n.type === 'error'   && <XCircle className="w-5 h-5" />}
                {n.type === 'warning' && <AlertCircle className="w-5 h-5" />}
                <span className="font-semibold text-sm">{n.message}</span>
                <button onClick={onClose} className="ml-2 hover:opacity-70"><X className="w-4 h-4" /></button>
            </div>
        </div>
    );
};

// ─── Main ─────────────────────────────────────────────────────────────────────
const AdminCourses = () => {
    const [courses,       setCourses]      = useState(COACH_COURSES);
    const [searchTerm,    setSearchTerm]   = useState('');
    const [filterStatus,  setFilterStatus] = useState('all');
    const [filterType,    setFilterType]   = useState('all');
    const [showFilters,   setShowFilters]  = useState(false);
    const [showModal,     setShowModal]    = useState(false);
    const [isEditMode,    setIsEditMode]   = useState(false);
    const [editingId,     setEditingId]    = useState(null);
    const [form,          setForm]         = useState(EMPTY_FORM);
    const [modalLoading,  setModalLoading] = useState(false);
    const [modalError,    setModalError]   = useState(null);
    const [confirmCourse, setConfirmCourse]= useState(null);
    const [deleteLoading, setDeleteLoading]= useState(false);
    const [notification,  setNotification] = useState({ show: false, type: '', message: '' });

    const showNotif = (type, message) => {
        setNotification({ show: true, type, message });
        setTimeout(() => setNotification({ show: false, type: '', message: '' }), 3500);
    };

    useEffect(() => {
        document.body.style.overflow = (showModal || !!confirmCourse) ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [showModal, confirmCourse]);

    const resetModal = () => {
        setForm(EMPTY_FORM);
        setModalError(null);
        setIsEditMode(false);
        setEditingId(null);
    };

    const openAdd  = () => { resetModal(); setShowModal(true); };
    const closeModal = () => { setShowModal(false); resetModal(); };

    const openEdit = (course) => {
        resetModal();
        setIsEditMode(true);
        setEditingId(course._id);
        setForm({
            coachId:       course.coachId || COACHES[0]?._id || '',
            title:         course.title || '',
            description:   course.description || '',
            category:      course.category || '',
            level:         course.level || 'مبتدئ',
            type:          course.type || 'مدفوعة',
            price:         course.price != null ? String(course.price) : '',
            duration:      course.duration || '',
            hasCertificate: course.hasCertificate || false,
            status:        course.status || 'نشط',
        });
        setShowModal(true);
    };

    const handleSubmit = async () => {
        setModalError(null);
        if (!form.title)    return setModalError('يرجى إدخال عنوان البرنامج');
        if (!form.category) return setModalError('يرجى اختيار التصنيف');
        if (form.type === 'مدفوعة' && !form.price) return setModalError('يرجى إدخال السعر');
        setModalLoading(true);
        await delay(500);
        if (isEditMode) {
            setCourses(prev => prev.map(c => c._id !== editingId ? c : {
                ...c, ...form, price: form.type === 'مجانية' ? 0 : Number(form.price) || 0,
            }));
            showNotif('success', 'تم تعديل البرنامج بنجاح');
        } else {
            const coach = COACHES.find(co => co._id === form.coachId);
            setCourses(prev => [{
                _id: `cc_${Date.now()}`, ...form,
                price: form.type === 'مجانية' ? 0 : Number(form.price) || 0,
                enrolledStudents: 0, confirmedStudents: 0,
                modules: [], image: null,
                coachName: coach?.fullName || '',
            }, ...prev]);
            showNotif('success', 'تم إضافة البرنامج بنجاح');
        }
        setModalLoading(false);
        closeModal();
    };

    const handleDelete = async (course) => {
        setDeleteLoading(true);
        await delay(400);
        if ((course.enrolledStudents || 0) >= 1) {
            setCourses(prev => prev.map(c => c._id === course._id ? { ...c, status: 'موقوف' } : c));
            showNotif('success', 'تم إيقاف البرنامج بنجاح');
        } else {
            setCourses(prev => prev.filter(c => c._id !== course._id));
            showNotif('success', 'تم حذف البرنامج بنجاح');
        }
        setDeleteLoading(false);
        setConfirmCourse(null);
    };

    const getAvail = (course) => (course.status === 'موقوف' || course.status === 'غير نشط') ? 'موقوف' : 'نشط';
    const formatPrice = (p) => (!p || p === 0 || p === '0') ? 'مجاني' : `DA ${Number(p).toLocaleString()}`;

    const filtered = courses.filter(c => {
        const isFree = !c.price || c.price === 0 || c.type === 'مجانية';
        return (filterStatus === 'all' || c.status === filterStatus)
            && (filterType === 'all' || (filterType === 'مجانية' ? isFree : !isFree))
            && (!searchTerm || c.title?.includes(searchTerm) || c.category?.includes(searchTerm));
    });

    const totalActive   = courses.filter(c => getAvail(c) === 'نشط').length;
    const totalStudents = courses.reduce((s, c) => s + (c.enrolledStudents || 0), 0);

    return (
        <>
        <Notification n={notification} onClose={() => setNotification({ show: false, type: '', message: '' })} />
        <div className="min-h-screen bg-zinc-950 text-white p-6" dir="rtl">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-bold mb-1 bg-gradient-to-r from-amber-500 to-yellow-500 bg-clip-text text-transparent">
                            البرامج التدريبية
                        </h1>
                        <p className="text-gray-400 text-sm">إدارة وتنظيم جميع البرامج والدورات التدريبية</p>
                    </div>
                    <button onClick={openAdd}
                        className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-600 text-white px-6 py-3 rounded-xl font-bold hover:from-amber-600 hover:to-yellow-700 transition-all transform hover:scale-105 shadow-lg shadow-amber-500/20">
                        <Plus className="w-5 h-5" /> إضافة برنامج جديد
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    {[
                        { label: 'إجمالي البرامج',  value: courses.length, icon: BookOpen, color: 'text-amber-400', bg: 'bg-amber-500/20', border: 'hover:border-amber-500/50' },
                        { label: 'البرامج النشطة',  value: totalActive,    icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/20', border: 'hover:border-green-500/50' },
                        { label: 'إجمالي المتدربين', value: totalStudents, icon: Sparkles, color: 'text-blue-400', bg: 'bg-blue-500/20', border: 'hover:border-blue-500/50' },
                    ].map(({ label, value, icon: Icon, color, bg, border }) => (
                        <div key={label} className={`bg-gradient-to-br from-zinc-900/80 to-zinc-800/80 backdrop-blur-sm rounded-xl p-4 border border-zinc-700/50 ${border} transition-all`}>
                            <div className="flex items-center justify-between">
                                <div><p className="text-gray-400 text-xs mb-0.5">{label}</p><p className="text-xl font-bold text-white">{value}</p></div>
                                <div className={`${bg} p-3 rounded-lg`}><Icon className={`w-6 h-6 ${color}`} /></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Filters toggle */}
                <div className="mb-4">
                    <button onClick={() => setShowFilters(!showFilters)}
                        className="w-full bg-gradient-to-br from-zinc-900/80 to-zinc-800/80 backdrop-blur-sm rounded-xl p-3 border border-zinc-700/50 hover:border-amber-500/50 transition-all flex items-center justify-between">
                        <span className="text-white font-semibold text-sm">{showFilters ? 'إخفاء الفلاتر' : 'إظهار الفلاتر'}</span>
                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                    </button>
                </div>

                {showFilters && (
                    <div className="bg-gradient-to-br from-zinc-900/80 to-zinc-800/80 backdrop-blur-sm rounded-xl p-4 border border-zinc-700/50 mb-6">
                        <div className="flex flex-col md:flex-row gap-3">
                            <div className="relative flex-1">
                                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                                    className="w-full bg-zinc-800/50 border border-zinc-700 text-white text-sm px-4 py-2.5 pr-10 rounded-lg appearance-none cursor-pointer hover:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all"
                                    style={{ direction: 'rtl' }}>
                                    <option value="all">جميع الحالات</option>
                                    <option value="نشط">نشط</option>
                                    <option value="موقوف">موقوف</option>
                                </select>
                                <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                            <div className="relative flex-1">
                                <select value={filterType} onChange={e => setFilterType(e.target.value)}
                                    className="w-full bg-zinc-800/50 border border-zinc-700 text-white text-sm px-4 py-2.5 pr-10 rounded-lg appearance-none cursor-pointer hover:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all"
                                    style={{ direction: 'rtl' }}>
                                    <option value="all">مدفوعة + مجانية</option>
                                    <option value="مدفوعة">مدفوعة</option>
                                    <option value="مجانية">مجانية</option>
                                </select>
                                <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                            <div className="relative flex-1 md:flex-[2]">
                                <input type="text" placeholder="ابحث عن برنامج..." value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    className="w-full bg-zinc-800/50 border border-zinc-700 text-white text-sm px-4 py-2.5 pl-10 rounded-lg hover:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all"
                                    style={{ direction: 'rtl' }} />
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            </div>
                        </div>
                    </div>
                )}

                {/* Cards */}
                {filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 gap-3">
                        <BookOpen className="w-12 h-12 text-zinc-700" />
                        <p className="text-gray-400 text-xl">لا توجد برامج تطابق الفلاتر</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filtered.map(course => {
                            const avail  = getAvail(course);
                            const isFree = !course.price || course.price === 0 || course.type === 'مجانية';
                            const statusCls = STATUS_MAP[avail]?.color || STATUS_MAP['نشط'].color;
                            const levelCls  = LEVEL_COLOR[course.level] || LEVEL_COLOR['مبتدئ'];
                            return (
                                <div key={course._id} className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-2xl overflow-hidden border border-gray-800 hover:border-amber-500 transition-all">
                                    <div className="relative h-48">
                                        <img src={course.image || 'https://images.pexels.com/photos/1047540/pexels-photo-1047540.jpeg'} alt={course.title} className="w-full h-full object-cover" />
                                        <div className="absolute top-4 left-4"><span className={`px-3 py-1 rounded-full text-xs font-semibold ${isFree ? 'bg-green-500/80' : 'bg-amber-500/80'} text-white`}>{isFree ? 'مجاني' : 'مدفوع'}</span></div>
                                        <div className="absolute top-4 right-4"><span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusCls}`}>{avail}</span></div>
                                        {course.hasCertificate && (
                                            <div className="absolute bottom-4 right-4"><span className="bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 text-xs text-amber-400"><Award className="w-3 h-3" /> شهادة</span></div>
                                        )}
                                    </div>
                                    <div className="p-5">
                                        <h3 className="text-lg font-bold mb-1">{course.title}</h3>
                                        {course.category && <span className={`inline-block text-xs px-2 py-0.5 rounded-full mb-2 border ${levelCls}`}>{course.category}</span>}
                                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{course.description}</p>
                                        <div className="space-y-2 mb-4">
                                            <div className="flex items-center gap-2 text-sm text-gray-400"><Layers className="w-4 h-4 text-amber-500" /><span>{course.modules?.length || 0} وحدة</span></div>
                                            <div className="flex items-center gap-2 text-sm text-gray-400"><Sparkles className="w-4 h-4 text-amber-500" /><span>{course.enrolledStudents || 0} متدرب</span></div>
                                            <div className="flex items-center gap-2 text-sm text-gray-400"><Clock className="w-4 h-4 text-amber-500" /><span dir="rtl">{course.duration || '—'}</span></div>
                                            <div className="flex items-center gap-2 text-sm"><DollarSign className="w-4 h-4 text-amber-500" /><span className="text-amber-500 font-bold">{formatPrice(course.price)}</span></div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => openEdit(course)} disabled={avail === 'موقوف'}
                                                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-colors text-sm ${avail === 'موقوف' ? 'bg-zinc-700/40 text-zinc-600 cursor-not-allowed opacity-50' : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-500'}`}>
                                                <Edit className="w-4 h-4" /> تعديل
                                            </button>
                                            <button onClick={() => { if (avail !== 'موقوف') setConfirmCourse(course); }} disabled={avail === 'موقوف'}
                                                className={`flex items-center justify-center px-4 py-2 rounded-lg transition-colors ${avail === 'موقوف' ? 'bg-zinc-700/40 text-zinc-600 cursor-not-allowed opacity-50' : 'bg-red-500/20 hover:bg-red-500/30 text-red-500'}`}>
                                                <XCircle className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>

        {/* Add/Edit Modal */}
        {showModal && (
            <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4">
                <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-2xl p-8 max-w-2xl w-full border border-zinc-700 max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-500 to-yellow-500 bg-clip-text text-transparent">
                            {isEditMode ? 'تعديل البرنامج' : 'إضافة برنامج جديد'}
                        </h2>
                        <button onClick={closeModal} className="text-gray-400 hover:text-white transition-colors"><X className="w-6 h-6" /></button>
                    </div>
                    {modalError && <div className="mb-4 bg-red-500/10 border border-red-500/40 text-red-400 rounded-xl px-4 py-3 text-sm">{modalError}</div>}
                    <div className="space-y-4">
                        {/* Coach */}
                        <div>
                            <label className="block text-sm font-semibold mb-2 text-gray-300">الكوتش المسؤول</label>
                            <select name="coachId" value={form.coachId} onChange={e => setForm(p => ({ ...p, coachId: e.target.value }))}
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-3 px-4 focus:outline-none focus:border-amber-500 transition-colors text-gray-300" style={{ direction: 'rtl' }}>
                                <option value="">— اختر الكوتش —</option>
                                {COACHES.map(c => <option key={c._id} value={c._id}>{c.fullName}</option>)}
                            </select>
                        </div>
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-semibold mb-2 text-gray-300">عنوان البرنامج *</label>
                            <input type="text" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="مثال: برنامج القيادة الفعّالة"
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-3 px-4 focus:outline-none focus:border-amber-500 transition-colors" />
                        </div>
                        {/* Description */}
                        <div>
                            <label className="block text-sm font-semibold mb-2 text-gray-300">الوصف</label>
                            <textarea rows="3" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="وصف تفصيلي..."
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-3 px-4 focus:outline-none focus:border-amber-500 transition-colors resize-none" />
                        </div>
                        {/* Category + Level */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-gray-300">التصنيف *</label>
                                <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-3 px-4 focus:outline-none focus:border-amber-500 transition-colors text-gray-300 cursor-pointer" style={{ direction: 'rtl' }}>
                                    <option value="">— اختر —</option>
                                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-gray-300">المستوى</label>
                                <select value={form.level} onChange={e => setForm(p => ({ ...p, level: e.target.value }))}
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-3 px-4 focus:outline-none focus:border-amber-500 transition-colors text-gray-300 cursor-pointer" style={{ direction: 'rtl' }}>
                                    <option value="مبتدئ">مبتدئ</option>
                                    <option value="متوسط">متوسط</option>
                                    <option value="متقدم">متقدم</option>
                                </select>
                            </div>
                        </div>
                        {/* Type + Price */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-gray-300">النوع</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {['مدفوعة', 'مجانية'].map(t => (
                                        <button key={t} type="button" onClick={() => setForm(p => ({ ...p, type: t }))}
                                            className={`py-3 px-4 rounded-xl border-2 transition-all font-semibold text-sm ${form.type === t ? 'bg-amber-500/20 border-amber-500 text-amber-500' : 'bg-zinc-800 border-zinc-700 text-gray-400'}`}>
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-gray-300">السعر (DA)</label>
                                <input type="number" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} disabled={form.type === 'مجانية'} placeholder="15000"
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-3 px-4 focus:outline-none focus:border-amber-500 transition-colors disabled:opacity-40" />
                            </div>
                        </div>
                        {/* Duration + status */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-gray-300">المدة</label>
                                <input type="text" value={form.duration} onChange={e => setForm(p => ({ ...p, duration: e.target.value }))} placeholder="8 أسابيع"
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-3 px-4 focus:outline-none focus:border-amber-500 transition-colors" />
                            </div>
                            {isEditMode && (
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-gray-300">الحالة</label>
                                    <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}
                                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-3 px-4 focus:outline-none focus:border-amber-500 transition-colors text-gray-300 cursor-pointer" style={{ direction: 'rtl' }}>
                                        <option value="نشط">نشط</option>
                                        <option value="موقوف">موقوف</option>
                                    </select>
                                </div>
                            )}
                        </div>
                        {/* Certificate */}
                        <div className="flex items-center justify-between bg-zinc-800/60 rounded-xl px-4 py-3 border border-zinc-700/50 cursor-pointer"
                            onClick={() => setForm(p => ({ ...p, hasCertificate: !p.hasCertificate }))}>
                            <div>
                                <p className="font-semibold text-white text-sm">شهادة إتمام</p>
                                <p className="text-xs text-gray-400 mt-0.5">منح شهادة عند اجتياز البرنامج</p>
                            </div>
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${form.hasCertificate ? 'bg-amber-500 border-amber-500' : 'border-zinc-600'}`}>
                                {form.hasCertificate && <CheckCircle className="w-3 h-3 text-white" />}
                            </div>
                        </div>
                        {/* Actions */}
                        <div className="flex gap-4 pt-2">
                            <button onClick={handleSubmit} disabled={modalLoading}
                                className="flex-1 bg-gradient-to-r from-amber-500 to-yellow-600 text-white py-3 rounded-xl font-bold hover:from-amber-600 hover:to-yellow-700 transition-all disabled:opacity-50">
                                {modalLoading ? 'جارٍ الحفظ...' : isEditMode ? 'حفظ التعديلات' : 'إضافة البرنامج'}
                            </button>
                            <button onClick={closeModal} disabled={modalLoading}
                                className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white py-3 rounded-xl font-bold transition-all disabled:opacity-50">
                                إلغاء
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* Confirm Delete Modal */}
        {confirmCourse && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                <div className={`bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-2xl p-8 max-w-md w-full shadow-2xl border ${(confirmCourse.enrolledStudents || 0) >= 1 ? 'border-orange-500/30' : 'border-red-500/30'}`}>
                    <div className="flex justify-center mb-5">
                        <div className={`p-4 rounded-full ${(confirmCourse.enrolledStudents || 0) >= 1 ? 'bg-orange-500/15' : 'bg-red-500/15'}`}>
                            <XCircle className={`w-10 h-10 ${(confirmCourse.enrolledStudents || 0) >= 1 ? 'text-orange-500' : 'text-red-500'}`} />
                        </div>
                    </div>
                    {(confirmCourse.enrolledStudents || 0) >= 1 ? (
                        <>
                            <h3 className="text-xl font-bold text-white text-center mb-2">إيقاف البرنامج</h3>
                            <p className="text-gray-400 text-center text-sm mb-6">
                                هذا البرنامج لديه <span className="text-orange-400 font-bold">{confirmCourse.enrolledStudents} متدرب</span>.
                                سيتم تغيير حالته إلى <span className="text-red-400 font-bold">موقوف</span>.
                            </p>
                        </>
                    ) : (
                        <>
                            <h3 className="text-xl font-bold text-white text-center mb-2">حذف البرنامج</h3>
                            <p className="text-gray-400 text-center text-sm mb-6">لا يوجد طلاب مسجلون. سيتم حذف هذا البرنامج نهائياً.</p>
                        </>
                    )}
                    <div className="flex gap-3">
                        <button onClick={() => handleDelete(confirmCourse)} disabled={deleteLoading}
                            className={`flex-1 text-white py-3 rounded-xl font-bold transition-all disabled:opacity-50 ${(confirmCourse.enrolledStudents || 0) >= 1 ? 'bg-orange-600 hover:bg-orange-700' : 'bg-red-600 hover:bg-red-700'}`}>
                            {deleteLoading ? 'جارٍ...' : (confirmCourse.enrolledStudents || 0) >= 1 ? 'إيقاف' : 'حذف'}
                        </button>
                        <button onClick={() => setConfirmCourse(null)} disabled={deleteLoading}
                            className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white py-3 rounded-xl font-bold transition-all disabled:opacity-50">
                            تراجع
                        </button>
                    </div>
                </div>
            </div>
        )}
        </>
    );
};

export default AdminCourses;