import { useState, useEffect } from 'react';
import { Search, Plus, Edit, MapPin, Calendar, Sparkles, DollarSign, CheckCircle, XCircle, Clock, ChevronDown, X, Globe, BadgeCheck, ClipboardList } from 'lucide-react';
import { COACHES, SESSIONS as MOCK_WORKSHOPS_RAW, BOOKINGS as MOCK_BOOKINGS_RAW } from '../../utils/mockData';

// ─── ADAPTATION DU MOCK DATA CENTRALISÉ ──────────────────────────────────────

// COACHES → format MOCK_ARTISTS
const MOCK_ARTISTS = COACHES.map(c => ({
    _id: c._id,
    fullname: c.fullName,
    email: c.email ?? `${c._id}@fitora.dz`,
}));

// SESSIONS → format MOCK_WORKSHOPS
const MOCK_WORKSHOPS = MOCK_WORKSHOPS_RAW.map(s => ({
    _id: s._id,
    type: s.type,
    status: s.availableSeats === 0 ? 'Completed' : 'Upcoming',
    description: s.title,
    date: new Date().toISOString(),
    time: '10:00',
    format: s.format,
    location: s.location || '',
    meetingLink: '',
    durationHours: s.durationHours,
    durationMinutes: s.durationMinutes,
    capacity: (s.availableSeats || 0) + 10,
    participants: 10,
    price: s.price,
    pendingBookingsCount: s.availableSeats > 0 ? 2 : 0,
    image: s.image,
    coachId: { _id: s.coachId._id, fullname: s.coachId.fullName },
}));

// BOOKINGS → format MOCK_BOOKINGS (indexé par workshop _id)
const buildBooking = (b, suffix, idx) => ({
    bookingId: `${b._id}_${suffix}_${idx}`,
    status: b.status === 'مكتمل' ? 'Completed' : b.status === 'ملغي' ? 'Canceled' : 'Pending',
    totalPrice: b.unitPrice,
    paymentMethod: b.unitPrice === 0 ? 'Free' : 'CCP',
    ccpReference: b.unitPrice > 0 ? `CCP-2026-0${idx + 1}${suffix}` : null,
    bookingDate: new Date(b.date).toISOString(),
    chequeImage: null,
    candidate: {
        fullname: b.customer ?? 'مجهول',
        email: `user${idx}@example.com`,
        phone: null,
        profileImage: null,
    },
});

const MOCK_BOOKINGS = {
    s1: MOCK_BOOKINGS_RAW.slice(0, 2).map((b, i) => buildBooking(b, 's1', i)),
    s2: MOCK_BOOKINGS_RAW.slice(1, 3).map((b, i) => buildBooking(b, 's2', i)),
    s3: [],
    s4: [],
};

// Pas d'équivalent dans mockData → liste vide
const MOCK_REQUESTS = [];

// ─── HELPERS ──────────────────────────────────────────────────────────────────

const formatDurationDisplay = ({ durationHours, durationMinutes }) => {
    const h = Number(durationHours || 0);
    const m = Number(durationMinutes || 0);
    if (h && m) return `${h} ساعة و ${m} دقيقة`;
    if (h)      return `${h} ساعة`;
    if (m)      return `${m} دقيقة`;
    return '';
};

const EMPTY_FORM = {
    coachId:        '',
    type:            '',
    status:          'نشط',
    description:     '',
    date:            '',
    time:            '',
    format:          'in-person',
    location:        '',
    meetingLink:     '',
    durationHours:   '',
    durationMinutes: '',
    capacity:        '',
    price:           '',
    image:           null,
};

// ─── COMPONENT ────────────────────────────────────────────────────────────────

const AdminSessions = () => {
    // list & filter state
    const [searchTerm,    setSearchTerm]    = useState('');
    const [filterStatus,  setFilterStatus]  = useState('all');
    const [showFilters,   setShowFilters]   = useState(false);

    // modal state
    const [showAddModal,       setShowAddModal]       = useState(false);
    const [isEditMode,         setIsEditMode]         = useState(false);
    const [isApproveMode,      setIsApproveMode]      = useState(false);
    const [editingWorkshopId,  setEditingWorkshopId]  = useState(null);
    const [approvingRequestId, setApprovingRequestId] = useState(null);
    const [newWorkshop,        setNewWorkshop]        = useState(EMPTY_FORM);
    const [imagePreview,       setImagePreview]       = useState(null);

    // artists state
    const [artists,        setArtists]        = useState([]);
    const [artistsLoading, setArtistsLoading] = useState(false);

    // submission state
    const [loading,  setLoading]  = useState(false);
    const [error,    setError]    = useState(null);
    const [success,  setSuccess]  = useState(null);

    // workshops list state
    const [workshops,        setWorkshops]        = useState([]);
    const [workshopsLoading, setWorkshopsLoading] = useState(true);
    const [workshopsError] = useState(null);

    // delete state
    const [confirmWorkshop, setConfirmWorkshop] = useState(null);
    const [deleteLoading,   setDeleteLoading]   = useState(false);
    const [deleteError,     setDeleteError]     = useState(null);

    // participants modal state
    const [participantsWorkshop, setParticipantsWorkshop] = useState(null);
    const [participants,         setParticipants]         = useState([]);
    const [participantsLoading,  setParticipantsLoading]  = useState(false);
    const [participantsError,    setParticipantsError]    = useState(null);
    const [chequePreview,        setChequePreview]        = useState(null);
    const [bookingActionLoading, setBookingActionLoading] = useState(null);

    // requested workshops modal state
    const [showRequestedModal, setShowRequestedModal] = useState(false);
    const [requestedWorkshops, setRequestedWorkshops] = useState([]);
    const [requestedLoading,   setRequestedLoading]   = useState(false);

    // ── Load workshops on mount ───────────────────────────────────────────────
    useEffect(() => {
        const t = setTimeout(() => {
            setWorkshops(MOCK_WORKSHOPS);
            setWorkshopsLoading(false);
        }, 600);
        return () => clearTimeout(t);
    }, []);

    // ── Load artists when modal opens ─────────────────────────────────────────
    useEffect(() => {
        if (!showAddModal) return;
        const t = setTimeout(() => {
            setArtists(MOCK_ARTISTS);
            setArtistsLoading(false);
        }, 400);
        return () => clearTimeout(t);
    }, [showAddModal]);

    // ── Form handlers ─────────────────────────────────────────────────────────
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewWorkshop(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setNewWorkshop(prev => ({ ...prev, image: file }));
        setImagePreview(URL.createObjectURL(file));
    };

    const resetModal = () => {
        setNewWorkshop(EMPTY_FORM);
        setImagePreview(null);
        setError(null);
        setSuccess(null);
        setArtists([]);
        setIsEditMode(false);
        setEditingWorkshopId(null);
        setIsApproveMode(false);
        setApprovingRequestId(null);
    };

    // ── Lock scroll when any modal is open ────────────────────────────────────
    useEffect(() => {
        const anyOpen = showAddModal || !!participantsWorkshop || showRequestedModal;
        document.body.style.overflow = anyOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [showAddModal, participantsWorkshop, showRequestedModal]);

    const openModal  = () => { resetModal(); setShowAddModal(true); };
    const closeModal = () => { setShowAddModal(false); resetModal(); };

    // ── Open participants modal ───────────────────────────────────────────────
    const openParticipantsModal = (workshop) => {
        setParticipantsWorkshop(workshop);
        setParticipants([]);
        setParticipantsError(null);
        setParticipantsLoading(true);
        setChequePreview(null);
        setTimeout(() => {
            setParticipants(MOCK_BOOKINGS[workshop._id] || []);
            setParticipantsLoading(false);
        }, 500);
    };

    const closeParticipantsModal = () => {
        setParticipantsWorkshop(null);
        setParticipants([]);
        setParticipantsError(null);
        setChequePreview(null);
        setBookingActionLoading(null);
    };

    // ── Confirm a booking ─────────────────────────────────────────────────────
    const handleConfirmBooking = (bookingId) => {
        setBookingActionLoading(bookingId);
        setTimeout(() => {
            setParticipants(prev => prev.map(b =>
                b.bookingId === bookingId
                    ? { ...b, status: 'Completed', processedAt: new Date().toISOString() }
                    : b
            ));
            setWorkshops(prev => prev.map(w =>
                w._id === participantsWorkshop._id
                    ? { ...w, participants: (w.participants || 0) + 1, pendingBookingsCount: Math.max((w.pendingBookingsCount || 1) - 1, 0) }
                    : w
            ));
            setParticipantsWorkshop(prev => ({
                ...prev,
                participants: (prev.participants || 0) + 1,
                pendingBookingsCount: Math.max((prev.pendingBookingsCount || 1) - 1, 0),
            }));
            setChequePreview(null);
            setBookingActionLoading(null);
        }, 600);
    };

    // ── Reject a booking ──────────────────────────────────────────────────────
    const handleRejectBooking = (bookingId) => {
        if (!window.confirm('هل أنت متأكد من رفض هذا الطلب؟')) return;
        setBookingActionLoading(bookingId);
        setTimeout(() => {
            setParticipants(prev => prev.filter(b => b.bookingId !== bookingId));
            setWorkshops(prev => prev.map(w =>
                w._id === participantsWorkshop._id
                    ? { ...w, pendingBookingsCount: Math.max((w.pendingBookingsCount || 1) - 1, 0) }
                    : w
            ));
            setParticipantsWorkshop(prev => ({
                ...prev,
                pendingBookingsCount: Math.max((prev.pendingBookingsCount || 1) - 1, 0),
            }));
            setChequePreview(null);
            setBookingActionLoading(null);
        }, 600);
    };

    // ── Open edit modal ───────────────────────────────────────────────────────
    const openEditModal = (workshop) => {
        resetModal();
        setIsEditMode(true);
        setEditingWorkshopId(workshop._id);
        const dateStr = workshop.date ? new Date(workshop.date).toISOString().split('T')[0] : '';
        setNewWorkshop({
            coachId:        workshop.coachId?._id || workshop.coachId || '',
            type:            workshop.type            || '',
            status:          workshop.status          || 'نشط',
            description:     workshop.description     || '',
            date:            dateStr,
            time:            workshop.time            || '',
            format:          workshop.format          || 'in-person',
            location:        workshop.location        || '',
            meetingLink:     workshop.meetingLink     || '',
            durationHours:   workshop.durationHours   ?? '',
            durationMinutes: workshop.durationMinutes ?? '',
            capacity:        workshop.capacity        || '',
            price:           workshop.price           || '',
            image:           null,
        });
        if (workshop.image) setImagePreview(workshop.image);
        setShowAddModal(true);
    };

    // ── Open approve modal ────────────────────────────────────────────────────
    const openApproveModal = (requestedWorkshop) => {
        closeRequestedModal();
        resetModal();
        setIsApproveMode(true);
        setApprovingRequestId(requestedWorkshop._id);
        const dateStr = requestedWorkshop.date
            ? new Date(requestedWorkshop.date).toISOString().split('T')[0]
            : '';
        setNewWorkshop({
            coachId:        requestedWorkshop.coachId?._id || requestedWorkshop.coachId || '',
            type:            requestedWorkshop.type            || '',
            status:          'نشط',
            description:     requestedWorkshop.description     || '',
            date:            dateStr,
            time:            requestedWorkshop.time            || '',
            format:          requestedWorkshop.format          || 'in-person',
            location:        requestedWorkshop.location        || '',
            meetingLink:     requestedWorkshop.meetingLink     || '',
            durationHours:   requestedWorkshop.durationHours   ?? '',
            durationMinutes: requestedWorkshop.durationMinutes ?? '',
            capacity:        requestedWorkshop.capacity        || '',
            price:           requestedWorkshop.price           || '',
            image:           null,
        });
        if (requestedWorkshop.image) setImagePreview(requestedWorkshop.image);
        setShowAddModal(true);
    };

    // ── Approve workshop ──────────────────────────────────────────────────────
    const handleApproveWorkshop = () => {
        setError(null);
        setSuccess(null);
        if (!newWorkshop.type)                                              return setError('يرجى اختيار نوع الجلسة');
        if (!newWorkshop.date)                                              return setError('يرجى تحديد التاريخ');
        if (!newWorkshop.time)                                              return setError('يرجى تحديد الوقت');
        if (!newWorkshop.capacity)                                          return setError('يرجى تحديد عدد المقاعد');
        if (newWorkshop.format === 'in-person' && !newWorkshop.location)    return setError('يرجى إدخال موقع الجلسة');
        if (newWorkshop.format === 'online'    && !newWorkshop.meetingLink) return setError('يرجى إدخال رابط الاجتماع');

        setLoading(true);
        setTimeout(() => {
            const newId = `w${Date.now()}`;
            const coach = MOCK_ARTISTS.find(a => a._id === newWorkshop.coachId);
            const created = {
                _id: newId,
                ...newWorkshop,
                status: 'Upcoming',
                participants: 0,
                pendingBookingsCount: 0,
                image: imagePreview || 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=600',
                coachId: coach ? { _id: coach._id, fullname: coach.fullname } : { _id: '', fullname: '—' },
            };
            setWorkshops(prev => [created, ...prev]);
            setRequestedWorkshops(prev => prev.filter(r => r._id !== approvingRequestId));
            setSuccess('تمت الموافقة على الجلسة وإنشاؤها بنجاح ✅');
            setLoading(false);
            setTimeout(() => closeModal(), 1500);
        }, 800);
    };

    // ── Add workshop ──────────────────────────────────────────────────────────
    const handleAddWorkshop = () => {
        setError(null);
        setSuccess(null);
        if (!newWorkshop.coachId)                                           return setError('يرجى اختيار الكوتش المسؤول عن الجلسة');
        if (!newWorkshop.type)                                              return setError('يرجى اختيار نوع الجلسة');
        if (!newWorkshop.date)                                              return setError('يرجى تحديد التاريخ');
        if (!newWorkshop.time)                                              return setError('يرجى تحديد الوقت');
        if (!newWorkshop.capacity)                                          return setError('يرجى تحديد عدد المقاعد');
        if (newWorkshop.format === 'in-person' && !newWorkshop.location)    return setError('يرجى إدخال موقع الجلسة');
        if (newWorkshop.format === 'online'    && !newWorkshop.meetingLink) return setError('يرجى إدخال رابط الاجتماع');

        setLoading(true);
        setTimeout(() => {
            const newId = `w${Date.now()}`;
            const coach = MOCK_ARTISTS.find(a => a._id === newWorkshop.coachId);
            const created = {
                _id: newId,
                ...newWorkshop,
                durationHours:   Number(newWorkshop.durationHours   || 0),
                durationMinutes: Number(newWorkshop.durationMinutes || 0),
                capacity:        Number(newWorkshop.capacity),
                price:           Number(newWorkshop.price || 0),
                participants:    0,
                pendingBookingsCount: 0,
                status: 'Upcoming',
                image: imagePreview || 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=600',
                coachId: coach ? { _id: coach._id, fullname: coach.fullname } : { _id: '', fullname: '—' },
            };
            setWorkshops(prev => [created, ...prev]);
            setSuccess('تمت إضافة الجلسة بنجاح ✅');
            setLoading(false);
            setTimeout(() => closeModal(), 1500);
        }, 800);
    };

    // ── Edit workshop ─────────────────────────────────────────────────────────
    const handleEditWorkshop = () => {
        setError(null);
        setSuccess(null);
        if (!newWorkshop.coachId)                                           return setError('يرجى اختيار الكوتش المسؤول عن الجلسة');
        if (!newWorkshop.type)                                              return setError('يرجى اختيار نوع الجلسة');
        if (!newWorkshop.date)                                              return setError('يرجى تحديد التاريخ');
        if (!newWorkshop.time)                                              return setError('يرجى تحديد الوقت');
        if (!newWorkshop.capacity)                                          return setError('يرجى تحديد عدد المقاعد');
        if (newWorkshop.format === 'in-person' && !newWorkshop.location)    return setError('يرجى إدخال موقع الجلسة');
        if (newWorkshop.format === 'online'    && !newWorkshop.meetingLink) return setError('يرجى إدخال رابط الاجتماع');

        setLoading(true);
        setTimeout(() => {
            const coach = MOCK_ARTISTS.find(a => a._id === newWorkshop.coachId);
            setWorkshops(prev => prev.map(w =>
                w._id === editingWorkshopId
                    ? {
                        ...w,
                        ...newWorkshop,
                        durationHours:   Number(newWorkshop.durationHours   || 0),
                        durationMinutes: Number(newWorkshop.durationMinutes || 0),
                        capacity:        Number(newWorkshop.capacity),
                        price:           Number(newWorkshop.price || 0),
                        image: imagePreview || w.image,
                        coachId: coach ? { _id: coach._id, fullname: coach.fullname } : w.coachId,
                      }
                    : w
            ));
            setSuccess('تم تعديل الجلسة بنجاح ✅');
            setLoading(false);
            setTimeout(() => closeModal(), 1500);
        }, 800);
    };

    // ── Delete / Cancel workshop ──────────────────────────────────────────────
    const handleDeleteWorkshop = (workshop) => {
        setDeleteError(null);
        setDeleteLoading(true);
        const id = workshop._id;
        const hasParticipants = (workshop.participants || 0) >= 1;
        setTimeout(() => {
            if (hasParticipants) {
                setWorkshops(prev => prev.map(w => w._id === id ? { ...w, status: 'Canceled' } : w));
            } else {
                setWorkshops(prev => prev.filter(w => w._id !== id));
            }
            setConfirmWorkshop(null);
            setDeleteLoading(false);
        }, 600);
    };

    // ── Open requested workshops modal ────────────────────────────────────────
    const openRequestedModal = () => {
        setShowRequestedModal(true);
        setRequestedWorkshops([]);
        setRequestedLoading(true);
        setTimeout(() => {
            setRequestedWorkshops(MOCK_REQUESTS);
            setRequestedLoading(false);
        }, 500);
    };

    const closeRequestedModal = () => {
        setShowRequestedModal(false);
        setRequestedWorkshops([]);
    };

    // ── Status helpers ────────────────────────────────────────────────────────
    const STATUS_MAP = {
        'Upcoming':  { label: 'نشط',   color: 'bg-green-500/20 text-green-500 border-green-500' },
        'Completed': { label: 'منتهي', color: 'bg-blue-500/20  text-blue-500  border-blue-500'  },
        'Canceled':  { label: 'ملغي',  color: 'bg-red-500/20   text-red-500   border-red-500'   },
    };
    const getStatusColor = (status) => STATUS_MAP[status]?.color || 'bg-gray-500/20 text-gray-400 border-gray-500';
    const getStatusLabel = (status) => STATUS_MAP[status]?.label || status;

    // ── Filtered workshops ────────────────────────────────────────────────────
    const filteredWorkshops = workshops.filter(w => {
        const matchSearch = searchTerm
            ? w.type?.includes(searchTerm) || w.coachId?.fullname?.includes(searchTerm)
            : true;
        const matchStatus = filterStatus === 'all'
            ? true
            : filterStatus === 'active'    ? w.status === 'Upcoming'
            : filterStatus === 'completed' ? w.status === 'Completed'
            : filterStatus === 'cancelled' ? w.status === 'Canceled'
            : true;
        return matchSearch && matchStatus;
    });

    // ─── RENDER ───────────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-zinc-950 text-white p-6" dir="rtl">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-amber-500 to-yellow-500 bg-clip-text text-transparent">
                            إدارة الجلسات التدريبية
                        </h1>
                        <p className="text-gray-400">إدارة وتنظيم جميع الجلسات الفنية</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={openRequestedModal}
                            className="flex items-center gap-2 bg-gradient-to-r from-zinc-700 to-zinc-600 text-white px-6 py-3 rounded-xl font-bold hover:from-zinc-600 hover:to-zinc-500 transition-all transform hover:scale-105 border border-zinc-500/50"
                        >
                            <ClipboardList className="w-5 h-5" />
                            الجلسات المطلوبة
                        </button>
                        <button
                            onClick={openModal}
                            className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-600 text-white px-6 py-3 rounded-xl font-bold hover:from-amber-600 hover:to-yellow-700 transition-all transform hover:scale-105"
                        >
                            <Plus className="w-5 h-5" />
                            إضافة جلسة جديدة
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-gradient-to-br from-zinc-900/80 to-zinc-800/80 backdrop-blur-sm rounded-xl p-4 border border-zinc-700/50 hover:border-amber-500/50 transition-all">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-xs mb-0.5">إجمالي الجلسات</p>
                                <p className="text-xl font-bold text-white">{workshops.length}</p>
                            </div>
                            <div className="bg-amber-500/20 p-3 rounded-lg">
                                <Calendar className="w-6 h-6 text-amber-400" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-zinc-900/80 to-zinc-800/80 backdrop-blur-sm rounded-xl p-4 border border-zinc-700/50 hover:border-green-500/50 transition-all">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-xs mb-0.5">إجمالي المتدربين</p>
                                <p className="text-xl font-bold text-white">{workshops.reduce((s, w) => s + (w.participants || 0), 0)}</p>
                            </div>
                            <div className="bg-green-500/20 p-3 rounded-lg">
                                <Sparkles className="w-6 h-6 text-green-400" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-zinc-900/80 to-zinc-800/80 backdrop-blur-sm rounded-xl p-4 border border-zinc-700/50 hover:border-blue-500/50 transition-all">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-xs mb-0.5">الجلسات النشطة</p>
                                <p className="text-xl font-bold text-white">{workshops.filter(w => w.status === 'Upcoming').length}</p>
                            </div>
                            <div className="bg-blue-500/20 p-3 rounded-lg">
                                <CheckCircle className="w-6 h-6 text-blue-400" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Toggle Filters */}
                <div className="mb-4">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="w-full bg-gradient-to-br from-zinc-900/80 to-zinc-800/80 backdrop-blur-sm rounded-xl p-3 border border-zinc-700/50 hover:border-amber-500/50 transition-all flex items-center justify-between"
                    >
                        <span className="text-white font-semibold text-sm">
                            {showFilters ? 'إخفاء الفلاتر' : 'إظهار الفلاتر'}
                        </span>
                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} />
                    </button>
                </div>

                {/* Filters */}
                {showFilters && (
                    <div className="bg-gradient-to-br from-zinc-900/80 to-zinc-800/80 backdrop-blur-sm rounded-xl p-4 border border-zinc-700/50 mb-6">
                        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
                            <div className="relative flex-1">
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="w-full bg-zinc-800/50 border border-zinc-700 text-white text-sm px-4 py-2.5 pr-10 rounded-lg appearance-none cursor-pointer hover:border-amber-500/50 transition-all focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                                    style={{ direction: 'rtl' }}
                                >
                                    <option value="all">جميع الحالات</option>
                                    <option value="active">نشط</option>
                                    <option value="completed">مكتمل</option>
                                    <option value="cancelled">ملغي</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                            <div className="relative flex-1 md:flex-[2]">
                                <input
                                    type="text"
                                    placeholder="ابحث عن جلسة..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-zinc-800/50 border border-zinc-700 text-white text-sm px-4 py-2.5 pl-10 rounded-lg hover:border-amber-500/50 transition-all focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                                    style={{ direction: 'rtl' }}
                                />
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            </div>
                        </div>
                    </div>
                )}

                {/* Workshop Cards */}
                {workshopsLoading && (
                    <div className="flex items-center justify-center py-20 gap-3 text-gray-400">
                        <div className="w-6 h-6 border-2 border-amber-500/40 border-t-amber-500 rounded-full animate-spin" />
                        <span>جارٍ تحميل الجلسات...</span>
                    </div>
                )}
                {workshopsError && !workshopsLoading && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-6 py-4 text-sm flex items-center justify-between">
                        <span>{workshopsError}</span>
                        <button onClick={() => window.location.reload()} className="text-amber-400 hover:text-amber-300 text-xs underline">إعادة المحاولة</button>
                    </div>
                )}
                {!workshopsLoading && !workshopsError && filteredWorkshops.length === 0 && (
                    <div className="text-center py-20 text-gray-500">لا توجد جلسات حالياً</div>
                )}
                {!workshopsLoading && !workshopsError && (
                    <div className="space-y-4">
                        {filteredWorkshops.map((workshop) => (
                            <div
                                key={workshop._id}
                                className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-2xl border border-gray-800 hover:border-amber-500 transition-all overflow-hidden h-52"
                            >
                                <div className="flex flex-row h-full">
                                    <div className="w-48 min-w-48 h-full flex-shrink-0">
                                        <img
                                            src={workshop.image}
                                            alt={workshop.type}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 p-4 overflow-hidden flex flex-col justify-between min-w-0">
                                        <div className="flex items-start justify-between mb-1">
                                            <div>
                                                <h3 className="text-lg font-bold mb-0.5 truncate">{workshop.type}</h3>
                                                <p className="text-amber-500 text-sm font-semibold">{workshop.coachId?.fullname || '—'}</p>
                                            </div>
                                            <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(workshop.status)}`}>
                                                {getStatusLabel(workshop.status)}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-4 gap-2 mb-2">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-5 h-5 text-amber-500" />
                                                <div>
                                                    <p className="text-xs text-gray-400">التاريخ</p>
                                                    <p className="font-semibold text-sm">{new Date(workshop.date).toLocaleDateString('fr-DZ', { timeZone: 'Africa/Algiers' })}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-5 h-5 text-amber-500" />
                                                <div>
                                                    <p className="text-xs text-gray-400">الوقت</p>
                                                    <p className="font-semibold text-sm">{workshop.time}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Sparkles className="w-5 h-5 text-amber-500" />
                                                <div>
                                                    <p className="text-xs text-gray-400">المتدربين</p>
                                                    <p className="font-semibold text-sm">{workshop.participants}/{workshop.capacity}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <DollarSign className="w-5 h-5 text-amber-500" />
                                                <div>
                                                    <p className="text-xs text-gray-400">السعر</p>
                                                    <p className="font-semibold text-sm">DA {workshop.price?.toLocaleString()}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 mb-1 text-gray-400 text-xs overflow-hidden">
                                            {workshop.format === 'online' ? (
                                                <>
                                                    <Globe className="w-4 h-4 text-amber-500 flex-shrink-0" />
                                                    <a href={workshop.meetingLink} target="_blank" rel="noopener noreferrer"
                                                        className="truncate max-w-xs text-blue-400 hover:text-blue-300 hover:underline transition-colors"
                                                        onClick={e => e.stopPropagation()}>
                                                        {workshop.meetingLink || '—'}
                                                    </a>
                                                </>
                                            ) : (
                                                <>
                                                    <MapPin className="w-4 h-4 text-amber-500 flex-shrink-0" />
                                                    <span className="truncate max-w-xs">{workshop.location || '—'}</span>
                                                </>
                                            )}
                                            <span className="mx-2">•</span>
                                            <span>
                                                {workshop.durationHours > 0 ? `${workshop.durationHours}س` : ''}
                                                {workshop.durationMinutes > 0 ? ` ${workshop.durationMinutes}د` : ''}
                                            </span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => openParticipantsModal(workshop)} className="relative flex items-center gap-2 bg-amber-500/10 text-amber-500 px-4 py-2 rounded-lg hover:bg-amber-500/20 transition-colors">
                                                <Sparkles className="w-4 h-4" />
                                                إدارة المتدربين
                                                {workshop.pendingBookingsCount > 0 && (
                                                    <span className="absolute -top-2 -left-2 min-w-[20px] h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center px-1 shadow-lg animate-pulse">
                                                        {workshop.pendingBookingsCount}
                                                    </span>
                                                )}
                                            </button>
                                            <button onClick={() => openEditModal(workshop)} className="flex items-center gap-2 bg-blue-500/10 text-blue-500 px-4 py-2 rounded-lg hover:bg-blue-500/20 transition-colors">
                                                <Edit className="w-4 h-4" />
                                                تعديل
                                            </button>
                                            <button
                                                onClick={() => { setDeleteError(null); setConfirmWorkshop(workshop); }}
                                                className="flex items-center gap-2 bg-red-500/10 text-red-500 px-4 py-2 rounded-lg hover:bg-red-500/20 transition-colors"
                                            >
                                                <XCircle className="w-4 h-4" />
                                                حذف
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ── MODAL: إضافة / تعديل / موافقة ── */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-2xl p-8 max-w-2xl w-full border border-gray-800 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold">
                                {isApproveMode ? 'الموافقة على الجلسة' : isEditMode ? 'تعديل الجلسة' : 'إضافة جلسة جديدة'}
                            </h2>
                            <button onClick={closeModal} className="text-gray-400 hover:text-white transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {error && (
                            <div className="mb-4 bg-red-500/10 border border-red-500/50 text-red-400 rounded-xl px-4 py-3 text-sm">{error}</div>
                        )}
                        {success && (
                            <div className="mb-4 bg-green-500/10 border border-green-500/50 text-green-400 rounded-xl px-4 py-3 text-sm">{success}</div>
                        )}

                        <div className="space-y-4">
                            {/* الكوتش */}
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-gray-300">
                                    الكوتش المسؤول عن الجلسة <span className="text-red-400 mr-1">*</span>
                                </label>
                                {artistsLoading && (
                                    <div className="w-full bg-zinc-800 border border-gray-700 rounded-xl py-3 px-4 text-gray-500 text-sm flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-amber-500/40 border-t-amber-500 rounded-full animate-spin" />
                                        جارٍ تحميل قائمة الكوتشين...
                                    </div>
                                )}
                                {!artistsLoading && (
                                    <div className="relative">
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                            <BadgeCheck className="w-4 h-4 text-gray-400" />
                                        </div>
                                        <select
                                            name="coachId"
                                            value={newWorkshop.coachId}
                                            onChange={handleInputChange}
                                            className="w-full bg-zinc-800 border border-gray-700 rounded-xl py-3 px-4 pr-11 focus:outline-none focus:border-amber-500 transition-colors text-gray-300 appearance-none cursor-pointer"
                                            style={{ direction: 'rtl' }}
                                        >
                                            <option value="" disabled>— اختر الكوتش —</option>
                                            {artists.map(artist => (
                                                <option key={artist._id} value={artist._id}>
                                                    {artist.fullname}  •  {artist.email}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                    </div>
                                )}
                                {newWorkshop.coachId && (
                                    <div className="mt-2 flex items-center gap-2">
                                        <div className="bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                                            <CheckCircle className="w-3.5 h-3.5" />
                                            {artists.find(a => a._id === newWorkshop.coachId)?.fullname || 'كوتش محدد'}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* نوع الجلسة */}
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-gray-300">نوع الجلسة</label>
                                <select name="type" value={newWorkshop.type} onChange={handleInputChange}
                                    className="w-full bg-zinc-800 border border-gray-700 rounded-xl py-3 px-4 focus:outline-none focus:border-amber-500 transition-colors text-gray-300">
                                    <option value="" disabled>اختر نوع الجلسة</option>
                                    <option value="تطوير ذاتي">تطوير ذاتي</option>
                                    <option value="تسويق رقمي">تسويق رقمي</option>
                                    <option value="ريادة أعمال">ريادة أعمال</option>
                                    <option value="موارد بشرية">موارد بشرية</option>
                                    <option value="برمجة">برمجة</option>
                                    <option value="مالية">مالية</option>
                                    <option value="أخرى">أخرى</option>
                                </select>
                            </div>

                            {/* حالة الجلسة – edit mode only */}
                            {isEditMode && !isApproveMode && (
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-gray-300">حالة الجلسة</label>
                                    <select name="status" value={newWorkshop.status} onChange={handleInputChange}
                                        className="w-full bg-zinc-800 border border-gray-700 rounded-xl py-3 px-4 focus:outline-none focus:border-amber-500 transition-colors text-gray-300">
                                        <option value="نشط">نشط</option>
                                        <option value="ملغي">ملغي</option>
                                    </select>
                                </div>
                            )}

                            {/* صورة الجلسة */}
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-gray-300">صورة الجلسة</label>
                                <div className="flex flex-col gap-3">
                                    <input type="file" accept="image/*" onChange={handleImageChange}
                                        className="w-full bg-zinc-800 border border-gray-700 rounded-xl py-3 px-4 focus:outline-none focus:border-amber-500 transition-colors text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-amber-500 file:text-white file:cursor-pointer hover:file:bg-amber-600" />
                                    {imagePreview && (
                                        <div className="relative w-full h-48 rounded-xl overflow-hidden border border-gray-700">
                                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                            <button type="button"
                                                onClick={() => { setNewWorkshop(p => ({ ...p, image: null })); setImagePreview(null); }}
                                                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors">
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* الوصف */}
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-gray-300">الوصف</label>
                                <textarea name="description" value={newWorkshop.description} onChange={handleInputChange}
                                    placeholder="اكتب وصفاً تفصيلياً للجلسة..." rows="3"
                                    className="w-full bg-zinc-800 border border-gray-700 rounded-xl py-3 px-4 focus:outline-none focus:border-amber-500 transition-colors" />
                            </div>

                            {/* التاريخ + الوقت */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-gray-300">التاريخ</label>
                                    <input type="date" name="date" value={newWorkshop.date} onChange={handleInputChange}
                                        min={new Date().toISOString().split('T')[0]}
                                        className="w-full bg-zinc-800 border border-gray-700 rounded-xl py-3 px-4 focus:outline-none focus:border-amber-500 transition-colors" />
                                    <p className="text-xs text-gray-500 mt-1">* لا يمكن اختيار تاريخ منتهي</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-gray-300">الوقت</label>
                                    <input type="time" name="time" value={newWorkshop.time} onChange={handleInputChange}
                                        className="w-full bg-zinc-800 border border-gray-700 rounded-xl py-3 px-4 focus:outline-none focus:border-amber-500 transition-colors" />
                                </div>
                            </div>

                            {/* طريقة الجلسة */}
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-gray-300">طريقة الجلسة</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button type="button" onClick={() => setNewWorkshop(p => ({ ...p, format: 'in-person' }))}
                                        className={`py-3 px-4 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${newWorkshop.format === 'in-person' ? 'bg-amber-500/20 border-amber-500 text-amber-500' : 'bg-zinc-800 border-gray-700 text-gray-400 hover:border-gray-600'}`}>
                                        <MapPin className="w-5 h-5" /><span className="font-semibold">حضوري</span>
                                    </button>
                                    <button type="button" onClick={() => setNewWorkshop(p => ({ ...p, format: 'online' }))}
                                        className={`py-3 px-4 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${newWorkshop.format === 'online' ? 'bg-amber-500/20 border-amber-500 text-amber-500' : 'bg-zinc-800 border-gray-700 text-gray-400 hover:border-gray-600'}`}>
                                        <Globe className="w-5 h-5" /><span className="font-semibold">عن بعد</span>
                                    </button>
                                </div>
                            </div>

                            {newWorkshop.format === 'in-person' && (
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-gray-300">الموقع</label>
                                    <input type="text" name="location" value={newWorkshop.location} onChange={handleInputChange}
                                        placeholder="مثال: مركز الفنون - الجزائر"
                                        className="w-full bg-zinc-800 border border-gray-700 rounded-xl py-3 px-4 focus:outline-none focus:border-amber-500 transition-colors" />
                                </div>
                            )}

                            {newWorkshop.format === 'online' && (
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-gray-300">رابط الاجتماع</label>
                                    <input type="url" name="meetingLink" value={newWorkshop.meetingLink} onChange={handleInputChange}
                                        placeholder="https://meet.google.com/abc-defg-hij"
                                        className="w-full bg-zinc-800 border border-gray-700 rounded-xl py-3 px-4 focus:outline-none focus:border-amber-500 transition-colors" />
                                    <p className="text-xs text-gray-500 mt-1">* أدخل رابط Google Meet، Zoom، Teams...</p>
                                </div>
                            )}

                            {/* المدة */}
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-gray-300">المدة</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-zinc-800 border border-gray-700 rounded-xl py-3 px-4 flex items-center justify-center gap-1">
                                        <input type="number" name="durationHours" value={newWorkshop.durationHours} onChange={handleInputChange}
                                            placeholder="0" min="0" max="23"
                                            className="w-12 bg-transparent text-white text-center focus:outline-none appearance-none"
                                            style={{ MozAppearance: 'textfield' }} />
                                        <span className="text-gray-400 text-sm">ساعات</span>
                                    </div>
                                    <div className="bg-zinc-800 border border-gray-700 rounded-xl py-3 px-4 flex items-center justify-center gap-1">
                                        <input type="number" name="durationMinutes" value={newWorkshop.durationMinutes} onChange={handleInputChange}
                                            placeholder="0" min="0" max="59"
                                            className="w-12 bg-transparent text-white text-center focus:outline-none appearance-none"
                                            style={{ MozAppearance: 'textfield' }} />
                                        <span className="text-gray-400 text-sm">دقائق</span>
                                    </div>
                                </div>
                                {(newWorkshop.durationHours || newWorkshop.durationMinutes) && (
                                    <p className="text-xs text-amber-400 mt-2">
                                        المدة الإجمالية: {formatDurationDisplay({ durationHours: newWorkshop.durationHours, durationMinutes: newWorkshop.durationMinutes })}
                                    </p>
                                )}
                            </div>

                            {/* المقاعد + السعر */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-gray-300">عدد المقاعد</label>
                                    <input type="number" name="capacity" value={newWorkshop.capacity} onChange={handleInputChange}
                                        placeholder="20" min="1" max="25"
                                        className="w-full bg-zinc-800 border border-gray-700 rounded-xl py-3 px-4 focus:outline-none focus:border-amber-500 transition-colors" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-gray-300">السعر (DA)</label>
                                    <input type="number" name="price" value={newWorkshop.price} onChange={handleInputChange}
                                        placeholder="2500"
                                        className="w-full bg-zinc-800 border border-gray-700 rounded-xl py-3 px-4 focus:outline-none focus:border-amber-500 transition-colors" />
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-4 pt-4">
                                <button
                                    onClick={isApproveMode ? handleApproveWorkshop : isEditMode ? handleEditWorkshop : handleAddWorkshop}
                                    disabled={loading || artistsLoading}
                                    className="flex-1 bg-gradient-to-r from-amber-500 to-yellow-600 text-white py-3 rounded-xl font-bold hover:from-amber-600 hover:to-yellow-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading
                                        ? (isApproveMode ? 'جارٍ الموافقة...' : isEditMode ? 'جارٍ التعديل...' : 'جارٍ الإضافة...')
                                        : (isApproveMode ? 'موافقة وإنشاء الجلسة' : isEditMode ? 'حفظ التعديلات' : 'إضافة الجلسة')
                                    }
                                </button>
                                <button onClick={closeModal} disabled={loading}
                                    className="flex-1 bg-zinc-800 text-white py-3 rounded-xl font-bold hover:bg-zinc-700 transition-all disabled:opacity-50">
                                    إلغاء
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── MODAL: إدارة المتدربين ── */}
            {participantsWorkshop && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={closeParticipantsModal}>
                    <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-2xl border border-amber-500/30 w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl"
                        onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between p-6 border-b border-zinc-700/50 flex-shrink-0">
                            <div>
                                <h2 className="text-xl font-bold text-white">إدارة المتدربين</h2>
                                <p className="text-amber-500 text-sm mt-0.5">{participantsWorkshop.type} • {participantsWorkshop.coachId?.fullname}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-2 text-center">
                                    <p className="text-amber-400 text-xs">المتدربون</p>
                                    <p className="text-white font-bold text-lg leading-none mt-0.5">
                                        {participantsWorkshop.participants}
                                        <span className="text-gray-500 text-sm font-normal">/{participantsWorkshop.capacity}</span>
                                    </p>
                                </div>
                                <button onClick={closeParticipantsModal} className="text-gray-400 hover:text-white transition-colors p-1">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6">
                            {participantsLoading && (
                                <div className="flex items-center justify-center py-16 gap-3 text-gray-400">
                                    <div className="w-6 h-6 border-2 border-amber-500/40 border-t-amber-500 rounded-full animate-spin" />
                                    <span>جارٍ تحميل المتدربين...</span>
                                </div>
                            )}
                            {participantsError && !participantsLoading && (
                                <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-5 py-4 text-sm">{participantsError}</div>
                            )}
                            {!participantsLoading && !participantsError && participants.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-500">
                                    <div className="bg-zinc-800 p-5 rounded-full"><Sparkles className="w-8 h-8 text-zinc-600" /></div>
                                    <p>لا يوجد متدربون في هذه الجلسة حتى الآن</p>
                                </div>
                            )}
                            {!participantsLoading && !participantsError && participants.length > 0 && (
                                <div className="space-y-3">
                                    {participants.map((booking, idx) => {
                                        const isPending    = booking.status === 'Pending';
                                        const isCompleted  = booking.status === 'Completed';
                                        const isProcessing = bookingActionLoading === booking.bookingId;
                                        return (
                                            <div key={booking.bookingId || idx}
                                                className={`rounded-xl border transition-all p-4 ${isPending ? 'bg-amber-500/5 border-amber-500/30' : isCompleted ? 'bg-green-500/5 border-green-500/30' : 'bg-zinc-800/40 border-zinc-700/40 opacity-60'}`}>
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
                                                        <BadgeCheck className="w-5 h-5 text-amber-500" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-white font-semibold text-sm truncate">{booking.candidate?.fullname || '—'}</p>
                                                        <p className="text-gray-400 text-xs truncate">{booking.candidate?.email || '—'}</p>
                                                        {booking.candidate?.phone && <p className="text-gray-500 text-xs">{booking.candidate.phone}</p>}
                                                    </div>
                                                    <span className={`flex-shrink-0 text-xs font-bold px-3 py-1 rounded-full border ${isPending ? 'bg-amber-500/15 text-amber-400 border-amber-500/40' : isCompleted ? 'bg-green-500/15 text-green-400 border-green-500/40' : 'bg-zinc-700 text-zinc-400 border-zinc-600'}`}>
                                                        {isPending ? 'قيد الانتظار' : isCompleted ? 'مؤكد' : 'ملغي'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3 mb-3 text-xs text-gray-400">
                                                    <span className="flex items-center gap-1">
                                                        <DollarSign className="w-3.5 h-3.5 text-amber-500" />
                                                        {booking.totalPrice ? `${booking.totalPrice?.toLocaleString()} DA` : 'مجاني'}
                                                    </span>
                                                    {booking.paymentMethod && (
                                                        <span className="bg-zinc-700/50 px-2 py-0.5 rounded">
                                                            {booking.paymentMethod === 'Free' ? 'مجاني' : 'CCP'}
                                                        </span>
                                                    )}
                                                    {booking.ccpReference && <span className="text-gray-500">مرجع: {booking.ccpReference}</span>}
                                                    {booking.bookingDate && (
                                                        <span className="text-gray-600 mr-auto">{new Date(booking.bookingDate).toLocaleDateString('ar-DZ')}</span>
                                                    )}
                                                </div>
                                                {isPending && (
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex flex-col gap-2 flex-1">
                                                            <button onClick={() => handleConfirmBooking(booking.bookingId)} disabled={isProcessing}
                                                                className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-xs font-bold py-2 px-4 rounded-lg transition-all">
                                                                {isProcessing ? <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                                                                تأكيد الدفع
                                                            </button>
                                                            <button onClick={() => handleRejectBooking(booking.bookingId)} disabled={isProcessing}
                                                                className="flex items-center justify-center gap-2 bg-red-600/80 hover:bg-red-700 disabled:opacity-50 text-white text-xs font-bold py-2 px-4 rounded-lg transition-all">
                                                                {isProcessing ? <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <XCircle className="w-3.5 h-3.5" />}
                                                                رفض الطلب
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                                {isCompleted && booking.processedAt && (
                                                    <p className="text-xs text-green-500/70 mt-1">✓ تم التأكيد في {new Date(booking.processedAt).toLocaleDateString('ar-DZ')}</p>
                                                )}
                                                {isCompleted && booking.adminNote && (
                                                    <p className="text-xs text-gray-500 mt-0.5">ملاحظة: {booking.adminNote}</p>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        <div className="p-6 border-t border-zinc-700/50 flex-shrink-0">
                            <button onClick={closeParticipantsModal} className="w-full bg-zinc-700 hover:bg-zinc-600 text-white py-3 rounded-xl font-bold transition-all">إغلاق</button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── MODAL: صورة الشيك ── */}
            {chequePreview && (
                <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[60] p-4" onClick={() => setChequePreview(null)}>
                    <div className="relative bg-zinc-900 rounded-2xl border border-zinc-700 max-w-lg w-full p-4 shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-white font-bold">صورة وصل الدفع</h3>
                            <button onClick={() => setChequePreview(null)} className="text-gray-400 hover:text-white transition-colors"><X className="w-6 h-6" /></button>
                        </div>
                        <img src={chequePreview.url} alt="وصل الدفع" className="w-full rounded-xl object-contain max-h-[60vh]" />
                        <div className="flex gap-3 mt-4">
                            <button onClick={() => { handleConfirmBooking(chequePreview.bookingId); setChequePreview(null); }}
                                disabled={bookingActionLoading === chequePreview.bookingId}
                                className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all">
                                <CheckCircle className="w-4 h-4" /> تأكيد الدفع
                            </button>
                            <button onClick={() => { handleRejectBooking(chequePreview.bookingId); setChequePreview(null); }}
                                disabled={bookingActionLoading === chequePreview.bookingId}
                                className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all">
                                <XCircle className="w-4 h-4" /> رفض الطلب
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── MODAL: الجلسات المطلوبة ── */}
            {showRequestedModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={closeRequestedModal}>
                    <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-2xl border border-zinc-600/50 w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl"
                        onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between p-6 border-b border-zinc-700/50">
                            <div>
                                <h2 className="text-xl font-bold text-white">الجلسات المطلوبة</h2>
                                <p className="text-gray-400 text-sm mt-0.5">الجلسات التي طلبها المرشدون</p>
                            </div>
                            <button onClick={closeRequestedModal} className="text-gray-400 hover:text-white transition-colors p-1"><X className="w-6 h-6" /></button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6">
                            {requestedLoading && (
                                <div className="flex items-center justify-center py-16 gap-3 text-gray-400">
                                    <div className="w-6 h-6 border-2 border-amber-500/40 border-t-amber-500 rounded-full animate-spin" />
                                    <span>جارٍ تحميل الجلسات المطلوبة...</span>
                                </div>
                            )}
                            {!requestedLoading && requestedWorkshops.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-500">
                                    <div className="bg-zinc-800 p-5 rounded-full"><ClipboardList className="w-8 h-8 text-zinc-600" /></div>
                                    <p>لا توجد جلسات مطلوبة حتى الآن</p>
                                </div>
                            )}
                            {!requestedLoading && requestedWorkshops.length > 0 && (
                                <div className="space-y-3">
                                    {requestedWorkshops.map((w, idx) => (
                                        <div key={w._id || idx} onClick={() => openApproveModal(w)}
                                            className="flex items-center gap-4 bg-zinc-800/60 border border-zinc-700/50 hover:border-amber-500/50 hover:bg-zinc-800 rounded-xl p-4 transition-all cursor-pointer group">
                                            <div className="flex-shrink-0 bg-zinc-900 border border-zinc-700 group-hover:border-amber-500/50 rounded-lg w-8 h-8 flex items-center justify-center transition-all">
                                                <span className="text-gray-400 text-xs font-bold">{idx + 1}</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-white font-semibold text-sm truncate">{w.type || '—'}</p>
                                                <p className="text-gray-400 text-xs truncate">{w.requestedBy?.fullname || '—'}</p>
                                            </div>
                                            {w.createdAt && (
                                                <div className="flex-shrink-0 text-gray-500 text-xs">{new Date(w.createdAt).toLocaleDateString('ar-DZ')}</div>
                                            )}
                                            <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <div className="bg-amber-500/20 text-amber-400 text-xs px-2 py-1 rounded-lg flex items-center gap-1">
                                                    <Edit className="w-3 h-3" /> تكملة
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="p-6 border-t border-zinc-700/50">
                            <button onClick={closeRequestedModal} className="w-full bg-zinc-700 hover:bg-zinc-600 text-white py-3 rounded-xl font-bold transition-all">إغلاق</button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── MODAL: تأكيد الحذف / الإلغاء ── */}
            {confirmWorkshop && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className={`bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-2xl p-8 max-w-md w-full shadow-2xl border ${(confirmWorkshop.participants || 0) >= 1 ? 'border-orange-500/30' : 'border-red-500/30'}`}>
                        <div className="flex justify-center mb-5">
                            <div className={`p-4 rounded-full ${(confirmWorkshop.participants || 0) >= 1 ? 'bg-orange-500/15' : 'bg-red-500/15'}`}>
                                <XCircle className={`w-10 h-10 ${(confirmWorkshop.participants || 0) >= 1 ? 'text-orange-500' : 'text-red-500'}`} />
                            </div>
                        </div>
                        {(confirmWorkshop.participants || 0) >= 1 ? (
                            <>
                                <h3 className="text-xl font-bold text-white text-center mb-2">إلغاء الجلسة</h3>
                                <p className="text-gray-400 text-center text-sm mb-2">
                                    هذه الجلسة لديها <span className="text-orange-400 font-bold">{confirmWorkshop.participants} متدرب</span>.
                                    سيتم تغيير حالتها إلى <span className="text-red-400 font-bold">ملغية</span>.
                                </p>
                                <p className="text-gray-500 text-center text-xs mb-6">يرجى إشعار المتدربين يدوياً.</p>
                            </>
                        ) : (
                            <>
                                <h3 className="text-xl font-bold text-white text-center mb-2">حذف الجلسة</h3>
                                <p className="text-gray-400 text-center text-sm mb-6">لا يوجد متدربون. سيتم حذف هذه الجلسة نهائياً.</p>
                            </>
                        )}
                        {deleteError && (
                            <div className="mb-4 bg-red-500/10 border border-red-500/40 text-red-400 rounded-xl px-4 py-3 text-sm text-center">{deleteError}</div>
                        )}
                        <div className="flex gap-3">
                            <button onClick={() => handleDeleteWorkshop(confirmWorkshop)} disabled={deleteLoading}
                                className={`flex-1 text-white py-3 rounded-xl font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2 ${(confirmWorkshop.participants || 0) >= 1 ? 'bg-orange-600 hover:bg-orange-700' : 'bg-red-600 hover:bg-red-700'}`}>
                                {deleteLoading
                                    ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />{(confirmWorkshop.participants || 0) >= 1 ? 'جاري الإلغاء...' : 'جاري الحذف...'}</>
                                    : <><XCircle className="w-4 h-4" />{(confirmWorkshop.participants || 0) >= 1 ? 'إلغاء الجلسة' : 'حذف الجلسة'}</>
                                }
                            </button>
                            <button onClick={() => { setConfirmWorkshop(null); setDeleteError(null); }} disabled={deleteLoading}
                                className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white py-3 rounded-xl font-bold transition-all disabled:opacity-50">
                                تراجع
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminSessions;