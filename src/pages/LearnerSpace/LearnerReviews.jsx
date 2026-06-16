import { useState } from 'react';
import { Star, Send, User, ChevronDown, Edit2, Trash2 } from 'lucide-react';
import { REVIEWS as MOCK_REVIEWS, COACHES, SESSIONS } from '../../utils/mockData';

const StarInput = ({ value, onChange, readonly = false }) => (
    <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(n => (
            <button key={n} type="button"
                    onClick={() => !readonly && onChange(n)}
                    className={`transition-all ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}`}>
                <Star className={`w-5 h-5 transition-colors
                                  ${n <= value ? 'text-amber-400 fill-amber-400' : 'text-zinc-700'}`} />
            </button>
        ))}
    </div>
);

const ReviewCard = ({ review, onEdit, onDelete }) => {
    const [expanded, setExpanded] = useState(false);
    return (
        <div className="bg-[#111] border border-white/[0.07] hover:border-white/[0.12]
                        rounded-2xl p-5 transition-all">
            <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500
                                flex items-center justify-center flex-shrink-0 shadow-md shadow-amber-500/20">
                    <User className="w-6 h-6 text-black" />
                </div>
                <div className="flex-1 min-w-0 text-right">
                    <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2">
                            {onEdit && (
                                <button onClick={() => onEdit(review)}
                                        className="text-zinc-700 hover:text-amber-400 transition-colors">
                                    <Edit2 className="w-3.5 h-3.5" />
                                </button>
                            )}
                            {onDelete && (
                                <button onClick={() => onDelete(review._id)}
                                        className="text-zinc-700 hover:text-red-400 transition-colors">
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>
                        <div>
                            <h3 className="font-black text-sm text-white">
                                {review.coachId?.fullName || 'كوتش'}
                            </h3>
                            <p className="text-[11px] text-zinc-600">
                                {review.sessionTitle || 'جلسة تدريبية'}
                                {review.createdAt && (
                                    <span className="text-zinc-700 mr-2">
                                        · {new Date(review.createdAt).toLocaleDateString('ar-DZ')}
                                    </span>
                                )}
                            </p>
                        </div>
                    </div>
                    <StarInput value={review.rating || 0} readonly />
                </div>
            </div>

            {review.comment && (
                <div className="mt-3 text-right">
                    <p className={`text-sm text-zinc-400 leading-relaxed ${!expanded && 'line-clamp-2'}`}>
                        {review.comment}
                    </p>
                    {review.comment.length > 120 && (
                        <button onClick={() => setExpanded(v => !v)}
                                className="text-xs text-amber-500 hover:text-amber-400 font-semibold
                                           mt-1 flex items-center gap-1 mr-auto transition-colors">
                            {expanded ? 'أقل' : 'المزيد'}
                            <ChevronDown className={`w-3 h-3 transition-transform ${expanded ? 'rotate-180' : ''}`} />
                        </button>
                    )}
                </div>
            )}

            {review.coachReply && (
                <div className="mt-3 bg-zinc-900/60 rounded-xl p-3 border-r-2 border-amber-500/40 text-right">
                    <p className="text-[10px] text-amber-500 font-bold mb-1">رد الكوتش</p>
                    <p className="text-xs text-zinc-500">{review.coachReply}</p>
                </div>
            )}
        </div>
    );
};

const LearnerReviews = () => {
    const [reviews,  setReviews]  = useState(MOCK_REVIEWS);
    const [showForm, setShowForm] = useState(false);
    const [editing,  setEditing]  = useState(null);
    const [form, setForm] = useState({ coachId: '', sessionTitle: '', rating: 0, comment: '' });

    const avgRating = reviews.length
        ? (reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length).toFixed(1)
        : '—';

    const handleSubmit = () => {
        if (!form.coachId || form.rating === 0) return;
        const coach = COACHES.find(c => c._id === form.coachId);
        if (editing) {
            setReviews(prev => prev.map(r => r._id === editing._id
                ? { ...r, ...form, coachId: { _id: form.coachId, fullName: coach?.fullName || '' } }
                : r
            ));
        } else {
            const newReview = {
                _id: `r${Date.now()}`,
                coachId: { _id: form.coachId, fullName: coach?.fullName || '' },
                sessionTitle: form.sessionTitle,
                rating: form.rating,
                comment: form.comment,
                createdAt: new Date().toISOString(),
                coachReply: null,
            };
            setReviews(prev => [newReview, ...prev]);
        }
        setShowForm(false);
        setEditing(null);
        setForm({ coachId: '', sessionTitle: '', rating: 0, comment: '' });
    };

    const handleEdit = (review) => {
        setEditing(review);
        setForm({
            coachId:      review.coachId?._id || '',
            sessionTitle: review.sessionTitle  || '',
            rating:       review.rating        || 0,
            comment:      review.comment       || '',
        });
        setShowForm(true);
    };

    const handleDelete = (id) => {
        if (!window.confirm('هل تريد حذف هذا التقييم؟')) return;
        setReviews(prev => prev.filter(r => r._id !== id));
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-6" dir="rtl">
            <div className="max-w-4xl mx-auto">

                {/* Header */}
                <div className="mb-6 flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black bg-gradient-to-l from-violet-400 to-purple-300
                                       bg-clip-text text-transparent mb-1">
                            تقييماتي
                        </h1>
                        <p className="text-zinc-500 text-sm">My Reviews · {reviews.length} تقييم</p>
                    </div>
                    <button onClick={() => {
                                setShowForm(v => !v);
                                setEditing(null);
                                setForm({ coachId: '', sessionTitle: '', rating: 0, comment: '' });
                            }}
                            className="bg-gradient-to-l from-violet-500 to-purple-500 text-white font-black
                                       text-sm px-4 py-2.5 rounded-xl hover:opacity-90 transition-all
                                       flex items-center gap-2 shadow-lg shadow-violet-500/20 flex-shrink-0">
                        {showForm ? '✕ إلغاء' : '+ تقييم جديد'}
                    </button>
                </div>

                {/* Summary */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                    {[
                        { value: reviews.length, label: 'تقييمات',  color: 'text-violet-400' },
                        { value: avgRating,       label: 'متوسط التقييم', color: 'text-amber-400', star: true },
                        { value: reviews.filter(r => r.rating >= 4).length, label: 'تقييمات ممتازة', color: 'text-emerald-400' },
                    ].map((s, i) => (
                        <div key={i} className="bg-[#111] border border-white/[0.07] rounded-2xl p-4 text-center">
                            <div className={`flex items-center justify-center gap-1.5 mb-1 ${s.color}`}>
                                {s.star && <Star className="w-4 h-4 fill-current" />}
                                <p className="text-2xl font-black">{s.value}</p>
                            </div>
                            <p className="text-[10px] text-zinc-600">{s.label}</p>
                        </div>
                    ))}
                </div>

                {/* Form */}
                {showForm && (
                    <div className="bg-[#111] border border-violet-500/25 rounded-2xl p-5 mb-5">
                        <h2 className="font-black text-sm mb-4 text-violet-400">
                            {editing ? 'تعديل التقييم' : 'تقييم جديد'}
                        </h2>
                        <div className="space-y-4">
                            {/* Coach */}
                            <div>
                                <label className="text-xs text-zinc-500 font-semibold block mb-1.5">الكوتش</label>
                                <select value={form.coachId} dir="rtl"
                                        onChange={e => setForm(f => ({ ...f, coachId: e.target.value }))}
                                        className="w-full bg-zinc-900 border border-white/[0.07] rounded-xl py-2.5 px-3
                                                   text-sm focus:outline-none focus:border-violet-500/40 transition-colors text-white">
                                    <option value="">اختر الكوتش</option>
                                    {COACHES.map(c => (
                                        <option key={c._id} value={c._id}>{c.fullName}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Session — select from sessions of chosen coach */}
                            <div>
                                <label className="text-xs text-zinc-500 font-semibold block mb-1.5">الجلسة</label>
                                <select value={form.sessionTitle} dir="rtl"
                                        onChange={e => setForm(f => ({ ...f, sessionTitle: e.target.value }))}
                                        className="w-full bg-zinc-900 border border-white/[0.07] rounded-xl py-2.5 px-3
                                                   text-sm focus:outline-none focus:border-violet-500/40 transition-colors text-white">
                                    <option value="">اختر الجلسة</option>
                                    {SESSIONS
                                        .filter(s => !form.coachId || s.coachId?._id === form.coachId)
                                        .map(s => (
                                            <option key={s._id} value={s.title}>{s.title}</option>
                                        ))
                                    }
                                </select>
                            </div>

                            {/* Rating */}
                            <div>
                                <label className="text-xs text-zinc-500 font-semibold block mb-2">التقييم</label>
                                <StarInput value={form.rating} onChange={r => setForm(f => ({ ...f, rating: r }))} />
                            </div>

                            {/* Comment */}
                            <div>
                                <label className="text-xs text-zinc-500 font-semibold block mb-1.5">تعليقك</label>
                                <textarea rows={3} dir="rtl"
                                          placeholder="شارك تجربتك مع هذا الكوتش..."
                                          value={form.comment}
                                          onChange={e => setForm(f => ({ ...f, comment: e.target.value }))}
                                          className="w-full bg-zinc-900 border border-white/[0.07] rounded-xl py-2.5 px-3
                                                     text-sm focus:outline-none focus:border-violet-500/40 transition-colors
                                                     resize-none text-white placeholder-zinc-600" />
                            </div>

                            <button onClick={handleSubmit}
                                    disabled={!form.coachId || form.rating === 0}
                                    className="w-full bg-gradient-to-l from-violet-500 to-purple-500 text-white
                                               font-black py-3 rounded-xl flex items-center justify-center gap-2
                                               hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed
                                               shadow-lg shadow-violet-500/20">
                                <Send className="w-4 h-4" />
                                {editing ? 'تحديث التقييم' : 'إرسال التقييم'}
                            </button>
                        </div>
                    </div>
                )}

                {/* Reviews list */}
                {reviews.length === 0 ? (
                    <div className="text-center py-20">
                        <Star className="w-14 h-14 text-zinc-800 mx-auto mb-3" />
                        <p className="text-zinc-600 text-sm">لا توجد تقييمات بعد</p>
                        <button onClick={() => setShowForm(true)}
                                className="mt-4 bg-violet-500/10 text-violet-400 border border-violet-500/25
                                           font-bold text-sm px-4 py-2 rounded-xl hover:bg-violet-500/20 transition-all">
                            + أضف أول تقييم
                        </button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {reviews.map(r => (
                            <ReviewCard key={r._id} review={r} onEdit={handleEdit} onDelete={handleDelete} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LearnerReviews;