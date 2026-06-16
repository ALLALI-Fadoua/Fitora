import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, Calendar, MapPin, Sparkles, DollarSign, X, CheckCircle, AlertCircle, XCircle, Info, Globe, Star, Search, ChevronDown } from 'lucide-react';
import { SESSIONS } from '../../utils/mockData';
// =====================================================

const CoachSessions = () => {
    const [showAddModal, setShowAddModal]           = useState(false);
    const [imagePreview, setImagePreview]           = useState(null);
    const [sessions, setSessions]                   = useState(SESSIONS); 
    const [isEditMode, setIsEditMode]               = useState(false);
    const [editingSessionId, setEditingSessionId]   = useState(null);
    const [showDetailsModal, setShowDetailsModal]   = useState(false);
    const [selectedSession, setSelectedSession]     = useState(null);
    const [showDeleteModal, setShowDeleteModal]     = useState(false);
    const [workshopToDelete, setSessionToDelete]    = useState(null);
    const [showFilters, setShowFilters]             = useState(false);
    const [filterCategory, setFilterCategory]       = useState('all');
    const [filterType, setFilterType]               = useState('all');
    const [searchQuery, setSearchQuery]             = useState('');

    const [notification, setNotification] = useState({ show: false, type: '', message: '' });

    const [newSession, setNewSession] = useState({
        type: '', description: '', date: '', time: '',
        durationHours: '', durationMinutes: '',
        format: 'in-person', location: '', meetingLink: '',
        capacity: '', price: '', image: null, status: 'نشط'
    });

    const showNotification = (type, message) => {
        setNotification({ show: true, type, message });
        setTimeout(() => setNotification({ show: false, type: '', message: '' }), 4000);
    };

    // Lock body scroll when modal is open
    useEffect(() => {
        document.body.style.overflow = showAddModal || showDetailsModal ? 'hidden' : 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [showAddModal, showDetailsModal]);

    const resetForm = () => {
        setNewSession({
            type: '', description: '', date: '', time: '',
            durationHours: '', durationMinutes: '',
            format: 'in-person', location: '', meetingLink: '',
            capacity: '', price: '', image: null, status: 'نشط'
        });
        setImagePreview(null);
        setIsEditMode(false);
        setEditingSessionId(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'durationHours') {
            const n = parseInt(value) || 0;
            if (value.length <= 2 && n <= 23) setNewSession({ ...newSession, [name]: value });
        } else if (name === 'durationMinutes') {
            const n = parseInt(value) || 0;
            if (value.length <= 2 && n <= 59) setNewSession({ ...newSession, [name]: value });
        } else {
            setNewSession({ ...newSession, [name]: value });
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) { showNotification('warning', 'الرجاء اختيار صورة فقط'); return; }
        if (file.size > 5 * 1024 * 1024) { showNotification('warning', 'حجم الصورة يجب أن يكون أقل من 5MB'); return; }
        setNewSession({ ...newSession, image: file });
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
    };

    const formatTime = (t) => {
        if (!t) return '';
        if (t.includes(':')) {
            const [h, m] = t.split(':');
            return `${h.padStart(2, '0')}:${(m || '00').padStart(2, '0')}`;
        }
        return t;
    };

    const formatDate = (d) => new Date(d).toLocaleDateString('ar-DZ');
    const formatPrice = (p) => `DA ${p.toLocaleString()}`;

    const getStatusInArabic = (s) =>
        ({ Upcoming: 'نشط', Completed: 'منتهي', Canceled: 'ملغي' }[s] || s);

    const isSessionExpired = (date, time) => {
        const now = new Date();
        const s = new Date(date);
        if (time) { const [h, m] = time.split(':').map(Number); s.setHours(h, m, 0, 0); }
        else s.setHours(0, 0, 0, 0);
        return s < now;
    };

    const isSessionFull = (s) =>
        s.capacity != null && s.capacity > 0 && Number(s.participants || 0) >= Number(s.capacity);

    const getRealStatus = (s) => {
        if (getStatusInArabic(s.status) === 'ملغي') return 'ملغي';
        if (isSessionExpired(s.date, s.time)) return 'مكتمل';
        if (isSessionFull(s)) return 'مكتمل';
        return 'نشط';
    };

    const formatDurationDisplay = (s) => {
        let hours = 0, minutes = 0;
        if ((s.durationHours && s.durationHours > 0) || (s.durationMinutes && s.durationMinutes > 0)) {
            hours = s.durationHours || 0;
            minutes = s.durationMinutes || 0;
        } else if (s.duration) {
            const hm = s.duration.match(/(\d+)\s*ساع/);
            const mm = s.duration.match(/(\d+)\s*دقيق/);
            hours = hm ? parseInt(hm[1]) : 0;
            minutes = mm ? parseInt(mm[1]) : 0;
        }
        const parts = [];
        if (hours > 0)   parts.push(`${hours} ${hours === 1 ? 'ساعة' : 'ساعات'}`);
        if (minutes > 0) parts.push(`${minutes} ${minutes === 1 ? 'دقيقة' : 'دقائق'}`);
        return parts.length > 0 ? parts.join(' و ') : 'غير محدد';
    };

    // ── MOCK CRUD ──────────────────────────────────────────────────────────────
    const handleAddSession = () => {
        if (!newSession.type || !newSession.date || !newSession.time || !newSession.capacity) {
            showNotification('warning', 'الرجاء ملء جميع الحقول المطلوبة'); return;
        }
        if (newSession.format === 'in-person' && !newSession.location) {
            showNotification('warning', 'الموقع مطلوب للجلسات الحضورية'); return;
        }
        if (newSession.format === 'online' && !newSession.meetingLink) {
            showNotification('warning', 'رابط الاجتماع مطلوب للجلسات عن بعد'); return;
        }
        if (isSessionExpired(newSession.date, newSession.time)) {
            showNotification('error', 'لا يمكن إضافة جلسة بتاريخ منتهي'); return;
        }
        const created = {
            ...newSession,
            _id: Date.now().toString(),
            participants: 0,
            price: Number(newSession.price) || 0,
            capacity: Number(newSession.capacity),
            image: imagePreview || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
            status: 'Upcoming',
        };
        setSessions(prev => [created, ...prev]);
        showNotification('success', 'تم إضافة الجلسة بنجاح');
        setShowAddModal(false);
        resetForm();
    };

    const handleUpdateSession = () => {
        if (!newSession.type || !newSession.date || !newSession.time || !newSession.capacity) {
            showNotification('warning', 'الرجاء ملء جميع الحقول المطلوبة'); return;
        }
        if (newSession.format === 'in-person' && !newSession.location) {
            showNotification('warning', 'الموقع مطلوب للجلسات الحضورية'); return;
        }
        if (newSession.format === 'online' && !newSession.meetingLink) {
            showNotification('warning', 'رابط الاجتماع مطلوب للجلسات عن بعد'); return;
        }
        setSessions(prev => prev.map(s =>
            s._id === editingSessionId
                ? { ...s, ...newSession, price: Number(newSession.price) || 0, capacity: Number(newSession.capacity), image: imagePreview || s.image }
                : s
        ));
        showNotification('success', 'تم تعديل الجلسة بنجاح');
        setShowAddModal(false);
        resetForm();
    };

    const confirmDelete = () => {
        const id = workshopToDelete._id;
        const hasParticipants = (workshopToDelete.participants || 0) >= 1;
        if (hasParticipants) {
            setSessions(prev => prev.map(s => s._id === id ? { ...s, status: 'Canceled' } : s));
            showNotification('success', 'تم إلغاء الجلسة بنجاح');
        } else {
            setSessions(prev => prev.filter(s => s._id !== id));
            showNotification('success', 'تم حذف الجلسة بنجاح');
        }
        setShowDeleteModal(false);
        setSessionToDelete(null);
    };
    // ──────────────────────────────────────────────────────────────────────────

    const handleEditClick = (session) => {
        setIsEditMode(true);
        setEditingSessionId(session._id);
        let hours = '', minutes = '';
        if ((session.durationHours && session.durationHours > 0) || (session.durationMinutes && session.durationMinutes > 0)) {
            hours = session.durationHours || ''; minutes = session.durationMinutes || '';
        } else if (session.duration) {
            const hm = session.duration.match(/(\d+)\s*ساع/);
            const mm = session.duration.match(/(\d+)\s*دق/);
            hours = hm ? hm[1] : ''; minutes = mm ? mm[1] : '';
        }
        setNewSession({
            type: session.type || '', description: session.description || '',
            date: session.date?.slice(0, 10), time: formatTime(session.time || ''),
            durationHours: hours, durationMinutes: minutes,
            format: session.format || 'in-person',
            location: session.location || '', meetingLink: session.meetingLink || '',
            capacity: session.capacity || '', price: session.price || '',
            image: null, status: getStatusInArabic(session.status) || 'نشط'
        });
        setImagePreview(session.image || null);
        setShowAddModal(true);
    };

    const handleViewSession = (id) => {
        const s = sessions.find(s => s._id === id);
        if (s) {
            setSelectedSession({
                ...s,
                isFull: isSessionFull(s),
                availableSeats: Math.max(0, Number(s.capacity) - Number(s.participants || 0)),
            });
            setShowDetailsModal(true);
        }
    };

    const handleDeleteSession = (session) => { setSessionToDelete(session); setShowDeleteModal(true); };

    // Stats & filtering
    const categories = ['all', ...Array.from(new Set(sessions.map(w => w.type).filter(Boolean)))];
    const totalSessions      = sessions.filter(w => getRealStatus(w) === 'نشط').length;
    const totalSeats         = sessions.reduce((sum, w) => sum + Number(w.participants || 0), 0);
    const totalSpecializations = new Set(sessions.map(w => w.type).filter(Boolean)).size;

    const filteredSessions = sessions.filter(w => {
        const matchCategory = filterCategory === 'all' || w.type === filterCategory;
        const matchType = filterType === 'all'
            || (filterType === 'حضوري' && w.format !== 'online')
            || (filterType === 'عن بعد' && w.format === 'online');
        const matchSearch = !searchQuery || w.type?.includes(searchQuery) || w.description?.includes(searchQuery);
        return matchCategory && matchType && matchSearch;
    });

    return (
        <>
            <div className="min-h-screen bg-zinc-950 text-white p-6" dir="rtl">
                <div className="max-w-7xl mx-auto">

                    {/* Header */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div>
                                <h1 className="text-3xl font-bold mb-1 bg-gradient-to-r from-amber-500 to-yellow-500 bg-clip-text text-transparent">
                                    الجلسات
                                </h1>
                                <p className="text-gray-400 text-sm">إدارة الجلسات الفنية الخاصة بك</p>
                            </div>
                            <button
                                onClick={() => { resetForm(); setShowAddModal(true); }}
                                className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-600 text-white px-6 py-3 rounded-xl font-bold hover:from-amber-600 hover:to-yellow-700 transition-all transform hover:scale-105"
                            >
                                <Plus className="w-5 h-5" />
                                إضافة جلسة جديدة
                            </button>
                        </div>
                    </div>

                    {/* Statistics Cards */}
                    {!showAddModal && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="bg-gradient-to-br from-zinc-900/80 to-zinc-800/80 backdrop-blur-sm rounded-xl p-4 border border-zinc-700/50 hover:border-blue-500/50 transition-all">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-400 text-xs mb-0.5">تخصصاتي</p>
                                        <p className="text-xl font-bold text-white">{totalSpecializations}</p>
                                    </div>
                                    <div className="bg-blue-500/20 p-3 rounded-lg"><Star className="w-6 h-6 text-blue-400" /></div>
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-zinc-900/80 to-zinc-800/80 backdrop-blur-sm rounded-xl p-4 border border-zinc-700/50 hover:border-green-500/50 transition-all">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-400 text-xs mb-0.5">طلابي</p>
                                        <p className="text-xl font-bold text-white">{totalSeats}</p>
                                    </div>
                                    <div className="bg-green-500/20 p-3 rounded-lg"><Sparkles className="w-6 h-6 text-green-400" /></div>
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-zinc-900/80 to-zinc-800/80 backdrop-blur-sm rounded-xl p-4 border border-zinc-700/50 hover:border-amber-500/50 transition-all">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-400 text-xs mb-0.5">جلساتي النشطة</p>
                                        <p className="text-xl font-bold text-white">{totalSessions}</p>
                                    </div>
                                    <div className="bg-amber-500/20 p-3 rounded-lg"><Calendar className="w-6 h-6 text-amber-400" /></div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Toggle Filters Button */}
                    {!showAddModal && (
                        <div className="mb-4">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="w-full bg-gradient-to-br from-zinc-900/80 to-zinc-800/80 backdrop-blur-sm rounded-xl p-3 border border-zinc-700/50 hover:border-amber-500/50 transition-all flex items-center justify-between"
                            >
                                <span className="text-white font-semibold">{showFilters ? 'إخفاء الفلاتر' : 'إظهار الفلاتر'}</span>
                                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                            </button>
                        </div>
                    )}

                    {/* Filters Section */}
                    {!showAddModal && showFilters && (
                        <div className="bg-gradient-to-br from-zinc-900/80 to-zinc-800/80 backdrop-blur-sm rounded-xl p-4 border border-zinc-700/50 mb-6">
                            <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
                                <div className="relative flex-1">
                                    <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}
                                        className="w-full bg-zinc-800/50 border border-zinc-700 text-white text-sm px-4 py-2.5 pr-10 rounded-lg appearance-none cursor-pointer hover:border-amber-500/50 transition-all focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                                        style={{ direction: 'rtl' }}>
                                        <option value="all">جميع التخصصات</option>
                                        {categories.filter(c => c !== 'all').map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                </div>
                                <div className="relative flex-1">
                                    <select value={filterType} onChange={(e) => setFilterType(e.target.value)}
                                        className="w-full bg-zinc-800/50 border border-zinc-700 text-white text-sm px-4 py-2.5 pr-10 rounded-lg appearance-none cursor-pointer hover:border-amber-500/50 transition-all focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                                        style={{ direction: 'rtl' }}>
                                        <option value="all">جميع الأنواع</option>
                                        <option value="حضوري">حضوري</option>
                                        <option value="عن بعد">عن بعد</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                </div>
                                <div className="relative flex-1 md:flex-[2]">
                                    <input type="text" placeholder="ابحث عن جلسة..." value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full bg-zinc-800/50 border border-zinc-700 text-white text-sm px-4 py-2.5 pl-10 rounded-lg hover:border-amber-500/50 transition-all focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                                        style={{ direction: 'rtl' }} />
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Sessions Grid */}
                    {filteredSessions.length === 0 ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="text-gray-400 text-xl">لا توجد جلسات حالياً</div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredSessions.map((session) => {
                                const realStatus = getRealStatus(session);
                                return (
                                    <div key={session._id} className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-2xl overflow-hidden border border-gray-800 hover:border-amber-500 transition-all">
                                        <div className="relative h-48">
                                            <img src={session.image} alt={session.type} className="w-full h-full object-cover" />
                                            <div className="absolute top-4 left-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                    realStatus === 'ملغي'   ? 'bg-red-500/80 text-white'
                                                  : realStatus === 'مكتمل' ? 'bg-green-500/80 text-white'
                                                  :                          'bg-blue-500/80 text-white'
                                                }`}>{realStatus}</span>
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <h3 className="text-xl font-bold mb-2">{session.type}</h3>
                                            <p className="text-gray-400 text-sm mb-4 line-clamp-4">{session.description}</p>
                                            <div className="space-y-2 mb-4">
                                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                                    <Calendar className="w-4 h-4 text-amber-500" />
                                                    <span>{formatDate(session.date)} • {formatTime(session.time)}</span>
                                                </div>
                                                {((session.durationHours && session.durationHours > 0) || (session.durationMinutes && session.durationMinutes > 0) || session.duration) && (
                                                    <div className="flex items-center gap-2 text-sm text-gray-400">
                                                        <span className="text-amber-500">⏱</span>
                                                        <span>{formatDurationDisplay(session)}</span>
                                                    </div>
                                                )}
                                                {session.format === 'online' ? (
                                                    <div className="flex items-center gap-2 text-sm text-gray-400">
                                                        <Globe className="w-4 h-4 text-amber-500" /><span>عن بعد</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2 text-sm text-gray-400">
                                                        <MapPin className="w-4 h-4 text-amber-500" /><span>{session.location || 'موقع غير محدد'}</span>
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                                    <Sparkles className="w-4 h-4 text-amber-500" />
                                                    <span>{session.participants}/{session.capacity} متدرب</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <DollarSign className="w-4 h-4 text-amber-500" />
                                                    <span className="text-amber-500 font-bold">{formatPrice(session.price)}</span>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={() => handleViewSession(session._id)}
                                                    className="flex-1 flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 py-2 rounded-lg transition-colors">
                                                    <Eye className="w-4 h-4" /> عرض
                                                </button>
                                                {(() => {
                                                    const blocked = realStatus === 'ملغي' || realStatus === 'مكتمل';
                                                    return (
                                                        <button onClick={() => !blocked && handleEditClick(session)} disabled={blocked}
                                                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-colors ${
                                                                blocked ? 'bg-zinc-700/40 text-zinc-600 cursor-not-allowed opacity-50'
                                                                        : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-500 cursor-pointer'
                                                            }`}>
                                                            <Edit className="w-4 h-4" /> تعديل
                                                        </button>
                                                    );
                                                })()}
                                                {(() => {
                                                    const blocked = realStatus === 'ملغي' || realStatus === 'مكتمل';
                                                    return (
                                                        <button onClick={() => !blocked && handleDeleteSession(session)} disabled={blocked}
                                                            className={`flex items-center justify-center px-4 py-2 rounded-lg transition-colors ${
                                                                blocked ? 'bg-zinc-700/40 text-zinc-600 cursor-not-allowed opacity-50'
                                                                        : 'bg-red-500/20 hover:bg-red-500/30 text-red-500 cursor-pointer'
                                                            }`}>
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    );
                                                })()}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Add / Edit Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-2xl p-8 max-w-2xl w-full border border-gray-800 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold">{isEditMode ? 'تعديل الجلسة' : 'إضافة جلسة جديدة'}</h2>
                            <button onClick={() => { setShowAddModal(false); resetForm(); }} className="text-gray-400 hover:text-white transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            {/* Type */}
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-gray-300">نوع الجلسة</label>
                                <select name="type" value={newSession.type} onChange={handleInputChange}
                                    className="w-full bg-zinc-800 border border-gray-700 rounded-xl py-3 px-4 focus:outline-none focus:border-amber-500 transition-colors text-gray-300">
                                    <option value="" disabled>اختر نوع الجلسة</option>
                                    <option value="خط عربي">خط عربي</option>
                                    <option value="أشغال يدوية متنوعة">أشغال يدوية متنوعة</option>
                                    <option value="سيراميك و فخار">سيراميك و فخار</option>
                                    <option value="رسم و تلوين">رسم و تلوين</option>
                                    <option value="زخرفة و منمنمات">زخرفة و منمنمات</option>
                                    <option value="أخرى">أخرى</option>
                                </select>
                            </div>
                            {/* Status (edit only) */}
                            {isEditMode && (
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-gray-300">حالة الجلسة</label>
                                    <select name="status" value={newSession.status} onChange={handleInputChange}
                                        className="w-full bg-zinc-800 border border-gray-700 rounded-xl py-3 px-4 focus:outline-none focus:border-amber-500 transition-colors text-gray-300">
                                        <option value="نشط">نشط</option>
                                        <option value="ملغي">ملغي</option>
                                    </select>
                                </div>
                            )}
                            {/* Image */}
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-gray-300">صورة الجلسة</label>
                                <div className="flex flex-col gap-3">
                                    <input type="file" accept="image/*" onChange={handleImageChange}
                                        className="w-full bg-zinc-800 border border-gray-700 rounded-xl py-3 px-4 focus:outline-none focus:border-amber-500 transition-colors text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-amber-500 file:text-white file:cursor-pointer hover:file:bg-amber-600" />
                                    {imagePreview && (
                                        <div className="relative w-full h-48 rounded-xl overflow-hidden border border-gray-700">
                                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                            <button type="button" onClick={() => { setNewSession({ ...newSession, image: null }); setImagePreview(null); }}
                                                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors">
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            {/* Description */}
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-gray-300">الوصف</label>
                                <textarea name="description" value={newSession.description} onChange={handleInputChange}
                                    placeholder="اكتب وصفاً تفصيلياً للجلسة..." rows="3"
                                    className="w-full bg-zinc-800 border border-gray-700 rounded-xl py-3 px-4 focus:outline-none focus:border-amber-500 transition-colors" />
                            </div>
                            {/* Date & Time */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-gray-300">التاريخ</label>
                                    <input type="date" name="date" value={newSession.date} onChange={handleInputChange}
                                        min={new Date().toISOString().split('T')[0]}
                                        className="w-full bg-zinc-800 border border-gray-700 rounded-xl py-3 px-4 focus:outline-none focus:border-amber-500 transition-colors" />
                                    <p className="text-xs text-gray-500 mt-1">* لا يمكن اختيار تاريخ منتهي</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-gray-300">الوقت</label>
                                    <input type="time" name="time" value={newSession.time} onChange={handleInputChange}
                                        className="w-full bg-zinc-800 border border-gray-700 rounded-xl py-3 px-4 focus:outline-none focus:border-amber-500 transition-colors" />
                                </div>
                            </div>
                            {/* Format selector */}
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-gray-300">نوع الجلسة</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {[{ val: 'in-person', label: 'حضوري', Icon: MapPin }, { val: 'online', label: 'عن بعد', Icon: Globe }].map(({ val, label }) => (
                                        <button key={val} type="button" onClick={() => setNewSession({ ...newSession, format: val })}
                                            className={`py-3 px-4 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${
                                                newSession.format === val
                                                    ? 'bg-amber-500/20 border-amber-500 text-amber-500'
                                                    : 'bg-zinc-800 border-gray-700 text-gray-400 hover:border-gray-600'
                                            }`}>
                                            <Icon className="w-5 h-5" /><span className="font-semibold">{label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            {/* Location / Meeting link */}
                            {newSession.format === 'in-person' && (
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-gray-300">الموقع</label>
                                    <input type="text" name="location" value={newSession.location} onChange={handleInputChange}
                                        placeholder="مثال: مركز الفنون - الجزائر"
                                        className="w-full bg-zinc-800 border border-gray-700 rounded-xl py-3 px-4 focus:outline-none focus:border-amber-500 transition-colors" />
                                </div>
                            )}
                            {newSession.format === 'online' && (
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-gray-300">رابط الاجتماع</label>
                                    <input type="url" name="meetingLink" value={newSession.meetingLink} onChange={handleInputChange}
                                        placeholder="https://meet.google.com/abc-defg-hij"
                                        className="w-full bg-zinc-800 border border-gray-700 rounded-xl py-3 px-4 focus:outline-none focus:border-amber-500 transition-colors" />
                                    <p className="text-xs text-gray-500 mt-1">* أدخل رابط Google Meet، Zoom، Teams...</p>
                                </div>
                            )}
                            {/* Duration */}
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-gray-300">المدة</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {[{ name: 'durationHours', label: 'ساعات', max: 23 }, { name: 'durationMinutes', label: 'دقائق', max: 59 }].map(({ name, label, max }) => (
                                        <div key={name} className="bg-zinc-800 border border-gray-700 rounded-xl py-3 px-4 flex items-center justify-center gap-1">
                                            <input type="number" name={name} value={newSession[name]} onChange={handleInputChange}
                                                placeholder="0" min="0" max={max} maxLength="2"
                                                className="w-12 bg-transparent text-white text-center focus:outline-none appearance-none"
                                                style={{ MozAppearance: 'textfield' }} />
                                            <span className="text-gray-400 text-sm">{label}</span>
                                        </div>
                                    ))}
                                </div>
                                {(newSession.durationHours || newSession.durationMinutes) && (
                                    <p className="text-xs text-amber-400 mt-2">
                                        المدة الإجمالية: {formatDurationDisplay({ durationHours: newSession.durationHours, durationMinutes: newSession.durationMinutes })}
                                    </p>
                                )}
                            </div>
                            {/* Capacity & Price */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-gray-300">عدد المقاعد</label>
                                    <input type="number" name="capacity" value={newSession.capacity} onChange={handleInputChange}
                                        placeholder="20" min="1" max="25"
                                        className="w-full bg-zinc-800 border border-gray-700 rounded-xl py-3 px-4 focus:outline-none focus:border-amber-500 transition-colors" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-gray-300">السعر (DA)</label>
                                    <input type="number" name="price" value={newSession.price} onChange={handleInputChange}
                                        placeholder="2500"
                                        className="w-full bg-zinc-800 border border-gray-700 rounded-xl py-3 px-4 focus:outline-none focus:border-amber-500 transition-colors" />
                                </div>
                            </div>
                            {/* Actions */}
                            <div className="flex gap-4 pt-4">
                                <button onClick={isEditMode ? handleUpdateSession : handleAddSession}
                                    className="flex-1 bg-gradient-to-r from-amber-500 to-yellow-600 text-white py-3 rounded-xl font-bold hover:from-amber-600 hover:to-yellow-700 transition-all">
                                    {isEditMode ? 'إضافة التعديل' : 'إضافة الجلسة'}
                                </button>
                                <button onClick={() => { setShowAddModal(false); resetForm(); }}
                                    className="flex-1 bg-zinc-800 text-white py-3 rounded-xl font-bold hover:bg-zinc-700 transition-all">
                                    إلغاء
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Details Modal */}
            {showDetailsModal && selectedSession && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-2xl p-8 max-w-3xl w-full border border-gray-800 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold">تفاصيل الجلسة</h2>
                            <button onClick={() => { setShowDetailsModal(false); setSelectedSession(null); }} className="text-gray-400 hover:text-white transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="space-y-6">
                            <div className="w-full h-64 rounded-xl overflow-hidden border border-gray-700">
                                <img src={selectedSession.image} alt={selectedSession.type} className="w-full h-full object-cover" />
                            </div>
                            <h3 className="text-3xl font-bold text-amber-500">{selectedSession.type}</h3>
                            <p className="text-gray-300 leading-relaxed">{selectedSession.description || 'لا يوجد وصف'}</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div className="flex items-center gap-2 text-gray-300">
                                    <Calendar className="w-4 h-4 text-amber-500" />
                                    {formatDate(selectedSession.date)} • {formatTime(selectedSession.time)}
                                </div>
                                {((selectedSession.durationHours && selectedSession.durationHours > 0) || (selectedSession.durationMinutes && selectedSession.durationMinutes > 0) || selectedSession.duration) && (
                                    <div className="flex items-center gap-2 text-gray-300">
                                        <span className="text-amber-500">⏱</span>{formatDurationDisplay(selectedSession)}
                                    </div>
                                )}
                                <div className="flex items-center gap-2 text-gray-300">
                                    {selectedSession.format === 'online'
                                        ? <><Globe className="w-4 h-4 text-amber-500" /><span>عن بعد</span></>
                                        : <><MapPin className="w-4 h-4 text-amber-500" />{selectedSession.location || 'موقع غير محدد'}</>
                                    }
                                </div>
                                {selectedSession.format === 'online' && selectedSession.meetingLink && (
                                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
                                        <p className="text-sm text-gray-400 mb-2">رابط الاجتماع:</p>
                                        <a href={selectedSession.meetingLink} target="_blank" rel="noopener noreferrer"
                                            className="text-amber-500 hover:text-amber-400 transition-colors break-all font-medium">
                                            {selectedSession.meetingLink}
                                        </a>
                                    </div>
                                )}
                                <div className="flex items-center gap-2 text-gray-300">
                                    <Sparkles className="w-4 h-4 text-amber-500" />
                                    {selectedSession.participants} / {selectedSession.capacity} متدرب
                                </div>
                                <div className="flex items-center gap-2 text-gray-300">
                                    <DollarSign className="w-4 h-4 text-amber-500" />{formatPrice(selectedSession.price)}
                                </div>
                            </div>
                            <div className="mt-4">
                                {selectedSession.isFull
                                    ? <span className="inline-block bg-red-500/20 text-red-500 px-4 py-2 rounded-full font-semibold">الجلسة ممتلئة ❌</span>
                                    : <span className="inline-block bg-green-500/20 text-green-500 px-4 py-2 rounded-full font-semibold">المقاعد المتبقية: {selectedSession.availableSeats}</span>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {showDeleteModal && workshopToDelete && (() => {
                const blockedStatus = getRealStatus(workshopToDelete);
                const isBlocked = blockedStatus === 'ملغي' || blockedStatus === 'مكتمل';
                const hasParticipants = (workshopToDelete.participants || 0) >= 1;
                return (
                    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                        <div className={`bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-2xl p-8 max-w-md w-full shadow-2xl border ${
                            isBlocked ? 'border-zinc-600' : hasParticipants ? 'border-orange-500/50' : 'border-red-500/50'
                        }`}>
                            <div className="flex flex-col items-center text-center gap-4">
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                                    isBlocked ? 'bg-zinc-600/20' : hasParticipants ? 'bg-orange-500/20' : 'bg-red-500/20'
                                }`}>
                                    <AlertCircle className={`w-8 h-8 ${isBlocked ? 'text-zinc-400' : hasParticipants ? 'text-orange-500' : 'text-red-500'}`} />
                                </div>
                                {isBlocked ? (
                                    <>
                                        <h3 className="text-2xl font-bold text-white">لا يمكن حذف الجلسة</h3>
                                        <p className="text-gray-300 leading-relaxed" dir="rtl">
                                            هذه الجلسة في حالة <span className="text-zinc-300 font-bold">{blockedStatus}</span>.<br />
                                            <span className="text-zinc-400">لا يمكن حذف أو إلغاء جلسة {blockedStatus === 'ملغي' ? 'ملغية' : 'مكتملة'}.</span>
                                        </p>
                                    </>
                                ) : hasParticipants ? (
                                    <>
                                        <h3 className="text-2xl font-bold text-white">إلغاء الجلسة</h3>
                                        <p className="text-gray-300 leading-relaxed">
                                            هذه الجلسة لديها <span className="text-orange-400 font-bold">{workshopToDelete.participants} متدرب</span>.<br />
                                            سيتم تغيير حالتها إلى <span className="text-red-400 font-semibold">ملغية</span> دون حذفها.<br />
                                            <span className="text-gray-400 text-sm">يرجى إشعار المتدربين يدوياً.</span>
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <h3 className="text-2xl font-bold text-white">تأكيد الحذف</h3>
                                        <p className="text-gray-300 leading-relaxed">
                                            لا يوجد متدربون. سيتم حذف هذه الجلسة نهائياً.<br />
                                            <span className="text-red-400 font-semibold">لا يمكن التراجع عن هذا الإجراء</span>
                                        </p>
                                    </>
                                )}
                                <div className="flex gap-3 w-full mt-4">
                                    {!isBlocked && (
                                        <button onClick={confirmDelete}
                                            className={`flex-1 text-white py-3 rounded-xl font-bold transition-all transform hover:scale-105 ${
                                                hasParticipants ? 'bg-orange-500 hover:bg-orange-600' : 'bg-red-500 hover:bg-red-600'
                                            }`}>
                                            {hasParticipants ? 'نعم، ألغي' : 'نعم، احذف'}
                                        </button>
                                    )}
                                    <button onClick={() => { setShowDeleteModal(false); setSessionToDelete(null); }}
                                        className={`${isBlocked ? 'w-full' : 'flex-1'} bg-zinc-700 hover:bg-zinc-600 text-white py-3 rounded-xl font-bold transition-all`}>
                                        {isBlocked ? 'إغلاق' : 'تراجع'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })()}

            {/* Notification */}
            {notification.show && (
                <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-[100] animate-slide-down">
                    <div className={`flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl border backdrop-blur-sm ${
                        notification.type === 'success' ? 'bg-green-500/90 border-green-400 text-white'
                      : notification.type === 'error'   ? 'bg-red-500/90 border-red-400 text-white'
                      : notification.type === 'warning' ? 'bg-yellow-500/90 border-yellow-400 text-white'
                      :                                   'bg-blue-500/90 border-blue-400 text-white'
                    }`}>
                        {notification.type === 'success' && <CheckCircle className="w-6 h-6" />}
                        {notification.type === 'error'   && <XCircle className="w-6 h-6" />}
                        {notification.type === 'warning' && <AlertCircle className="w-6 h-6" />}
                        {notification.type === 'info'    && <Info className="w-6 h-6" />}
                        <span className="font-semibold text-lg">{notification.message}</span>
                        <button onClick={() => setNotification({ show: false, type: '', message: '' })} className="mr-2 hover:opacity-70 transition-opacity">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default CoachSessions;