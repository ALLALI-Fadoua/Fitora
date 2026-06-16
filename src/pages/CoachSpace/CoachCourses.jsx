import { useState, useEffect } from 'react';
import { Plus, CreditCard as Edit, Trash2, Eye, Sparkles, DollarSign, X, CheckCircle, AlertCircle, XCircle, Info, Star, Search, ChevronDown, BookOpen, Video, BarChart2, Upload, Clock, Layers, ChevronLeft, PlusCircle, Trash, Save, ToggleLeft, ToggleRight, Play, Award, Music, Image, FileText, FileDown, Film } from 'lucide-react';
import { COACH_COURSES } from '../../utils/mockData';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const BACKEND_URL = 'http://localhost:5000';
const getMediaUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `${BACKEND_URL}${url}`;
};

const DURATION_UNITS = [
    { value: 'د',   label: 'دقيقة' },
    { value: 'سا',  label: 'ساعة'  },
    { value: 'يوم', label: 'يوم'   },
    { value: 'أ',   label: 'أسبوع' },
    { value: 'ش',   label: 'شهر'   },
];

const parseDuration = (str) => {
    if (!str) return { amount: '', unit: 'سا' };
    const s = String(str).trim();
    for (const u of DURATION_UNITS) {
        const m = s.match(new RegExp(`^([\\d.]+)\\s*${u.value}$`));
        if (m) return { amount: m[1], unit: u.value };
    }
    const colonMatch = s.match(/^(\d+):(\d{2})$/);
    if (colonMatch) {
        const h = parseInt(colonMatch[1], 10);
        const m = parseInt(colonMatch[2], 10);
        if (h > 0 && m > 0) return { amount: `${h * 60 + m}`, unit: 'د' };
        if (h > 0) return { amount: String(h), unit: 'سا' };
        if (m > 0) return { amount: String(m), unit: 'د' };
    }
    return { amount: '', unit: 'سا' };
};

const formatDuration = (raw) => {
    if (!raw) return '';
    const s = String(raw).trim();
    for (const u of DURATION_UNITS) {
        if (new RegExp(`^\\d+\\s*${u.value}$`).test(s)) return s;
    }
    const colonMatch = s.match(/^(\d+):(\d{2})$/);
    if (colonMatch) {
        const h = parseInt(colonMatch[1], 10);
        const m = parseInt(colonMatch[2], 10);
        if (h > 0 && m > 0) return `${h} سا ${m} د`;
        if (h > 0) return `${h} سا`;
        if (m > 0) return `${m} د`;
    }
    return s;
};

// ─── Notification ─────────────────────────────────────────────────────────────
const Notification = ({ notification, onClose }) => {
    if (!notification.show) return null;
    return (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-[100] animate-slide-down">
            <div className={`flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl border backdrop-blur-sm ${
                notification.type === 'success' ? 'bg-green-500/90 border-green-400 text-white'
                : notification.type === 'error'   ? 'bg-red-500/90 border-red-400 text-white'
                : notification.type === 'warning' ? 'bg-yellow-500/90 border-yellow-400 text-white'
                : 'bg-blue-500/90 border-blue-400 text-white'
            }`}>
                {notification.type === 'success' && <CheckCircle className="w-6 h-6" />}
                {notification.type === 'error'   && <XCircle    className="w-6 h-6" />}
                {notification.type === 'warning' && <AlertCircle className="w-6 h-6" />}
                {notification.type === 'info'    && <Info        className="w-6 h-6" />}
                <span className="font-semibold text-lg">{notification.message}</span>
                <button onClick={onClose} className="mr-2 hover:opacity-70 transition-opacity">
                    <X className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

// ─── Course Form Modal ────────────────────────────────────────────────────────
const CourseFormModal = ({ isEdit, courseData, onChange, onImageChange, imagePreview, onSubmit, onClose, examError, onClearExamError, moduleError, onClearModuleError, durationError, onClearDurationError }) => {
    const [_activeTab, setActiveTab] = useState('info');
    const activeTab = examError ? 'exam' : moduleError ? 'content' : durationError ? 'info' : _activeTab;
    const [modules, setModules] = useState(courseData.modules || []);
    const [finalExamQuestions, setFinalExamQuestions] = useState(courseData.finalExamQuestions || []);

    const syncExam = (updated) => { setFinalExamQuestions(updated); onChange({ target: { name: 'finalExamQuestions', value: updated } }); };
    const addFinalQuestion = () => syncExam([...finalExamQuestions, { id: Date.now(), text: '', questionType: 'mcq', answerType: 'mcq', options: ['', '', '', ''], correct: 0, attachmentUrl: null, attachmentType: null, artistNote: '', _attachmentFile: null, _attachmentPreview: null }]);
    const removeFinalQuestion = (qi) => syncExam(finalExamQuestions.filter((_, j) => j !== qi));
    const updateFinalQuestion = (qi, field, value) => syncExam(finalExamQuestions.map((q, j) => j === qi ? { ...q, [field]: value } : q));
    const updateFinalOption = (qi, oi, value) => syncExam(finalExamQuestions.map((q, j) => j === qi ? { ...q, options: q.options.map((o, k) => k === oi ? value : o) } : q));

    const sync = (updated) => { setModules(updated); onChange({ target: { name: 'modules', value: updated } }); };
    const addModule = () => sync([...modules, { id: Date.now(), title: '', lessons: [], quiz: { title: '', questions: [] } }]);
    const removeModule = (i) => sync(modules.filter((_, idx) => idx !== i));
    const updateModule = (i, field, value) => sync(modules.map((m, idx) => idx === i ? { ...m, [field]: value } : m));

    const addLesson = (mi) => sync(modules.map((m, i) => i === mi ? { ...m, lessons: [...m.lessons, { id: Date.now(), title: '', duration: '', content: '', contents: [] }] } : m));
    const removeLesson = (mi, li) => sync(modules.map((m, i) => i === mi ? { ...m, lessons: m.lessons.filter((_, j) => j !== li) } : m));
    const updateLesson = (mi, li, field, value) => sync(modules.map((m, i) => i === mi ? { ...m, lessons: m.lessons.map((l, j) => j === li ? { ...l, [field]: value } : l) } : m));

    const addQuestion = (mi) => sync(modules.map((m, i) => i === mi ? { ...m, quiz: { ...m.quiz, questions: [...(m.quiz?.questions || []), { id: Date.now(), text: '', questionType: 'mcq', answerType: 'mcq', options: ['', '', '', ''], correct: 0, attachmentUrl: null, attachmentType: null, artistNote: '', _attachmentFile: null, _attachmentPreview: null }] } } : m));
    const removeQuestion = (mi, qi) => sync(modules.map((m, i) => i === mi ? { ...m, quiz: { ...m.quiz, questions: m.quiz.questions.filter((_, j) => j !== qi) } } : m));
    const updateQuestion = (mi, qi, field, value) => sync(modules.map((m, i) => i === mi ? { ...m, quiz: { ...m.quiz, questions: m.quiz.questions.map((q, j) => j === qi ? { ...q, [field]: value } : q) } } : m));
    const updateOption = (mi, qi, oi, value) => sync(modules.map((m, i) => i === mi ? { ...m, quiz: { ...m.quiz, questions: m.quiz.questions.map((q, j) => j === qi ? { ...q, options: q.options.map((o, k) => k === oi ? value : o) } : q) } } : m));

    const [certWarning, setCertWarning] = useState(false);
    const handleCertificateToggle = () => {
        const newVal = !courseData.hasCertificate;
        onChange({ target: { name: 'hasCertificate', value: newVal } });
        if (newVal) { setCertWarning(true); setTimeout(() => setCertWarning(false), 5000); setActiveTab('exam'); }
        else { syncExam([]); onChange({ target: { name: 'finalExamTitle', value: '' } }); onChange({ target: { name: 'passMark', value: 60 } }); }
    };

    const tabs = [
        { id: 'info',    label: 'المعلومات العامة', icon: <Info className="w-4 h-4" /> },
        { id: 'content', label: 'الوحدات والمحتوى', icon: <Layers className="w-4 h-4" /> },
        { id: 'exam',    label: 'الامتحان النهائي',  icon: <Award className="w-4 h-4" /> },
    ];

    const CONTENT_TYPES_DEF = [
        { type: 'فيديو',                 icon: <Film     className="w-3.5 h-3.5" />, color: 'text-blue-400',   placeholder: 'رابط الفيديو (YouTube, Vimeo...)' },
        { type: 'صوت',                   icon: <Music    className="w-3.5 h-3.5" />, color: 'text-purple-400', placeholder: 'رابط الصوت' },
        { type: 'صور',                   icon: <Image    className="w-3.5 h-3.5" />, color: 'text-pink-400',   placeholder: 'رابط الصورة' },
        { type: 'PDF',                   icon: <FileText className="w-3.5 h-3.5" />, color: 'text-red-400',    placeholder: 'رابط ملف PDF' },
        { type: 'ملفات قابلة للتحميل', icon: <FileDown className="w-3.5 h-3.5" />, color: 'text-green-400',  placeholder: 'رابط الملف للتحميل' },
    ];

    const acceptMap = { 'فيديو': 'video/*', 'صوت': 'audio/*', 'صور': 'image/*', 'PDF': '.pdf', 'ملفات قابلة للتحميل': '*' };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" dir="rtl">
            <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-2xl w-full max-w-4xl border border-zinc-700 shadow-2xl max-h-[95vh] flex flex-col">

                <div className="flex items-center justify-between p-6 border-b border-zinc-700 flex-shrink-0">
                    <h2 className="text-xl font-bold text-white">{isEdit ? 'تعديل البرنامج التدريبي' : 'إضافة برنامج تدريبي جديد'}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors"><X className="w-6 h-6" /></button>
                </div>

                <div className="flex border-b border-zinc-700 flex-shrink-0 overflow-x-auto">
                    {tabs.map(t => (
                        <button key={t.id} onClick={() => setActiveTab(t.id)}
                            className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${activeTab === t.id ? 'border-amber-500 text-amber-400' : 'border-transparent text-gray-400 hover:text-white'}`}>
                            {t.icon}{t.label}
                        </button>
                    ))}
                </div>

                {durationError && (
                    <div className="flex items-center gap-3 px-5 py-3 bg-red-500/15 border-b border-red-500/40 text-red-300 flex-shrink-0">
                        <XCircle className="w-5 h-5 flex-shrink-0 text-red-400" /><span className="text-sm font-semibold">{durationError}</span>
                        <button onClick={onClearDurationError} className="mr-auto hover:opacity-70"><X className="w-4 h-4" /></button>
                    </div>
                )}
                {examError && (
                    <div className="flex items-center gap-3 px-5 py-3 bg-red-500/15 border-b border-red-500/40 text-red-300 flex-shrink-0">
                        <XCircle className="w-5 h-5 flex-shrink-0 text-red-400" /><span className="text-sm font-semibold">{examError}</span>
                        <button onClick={onClearExamError} className="mr-auto hover:opacity-70"><X className="w-4 h-4" /></button>
                    </div>
                )}
                {moduleError && (
                    <div className="flex items-center gap-3 px-5 py-3 bg-red-500/15 border-b border-red-500/40 text-red-300 flex-shrink-0">
                        <XCircle className="w-5 h-5 flex-shrink-0 text-red-400" /><span className="text-sm font-semibold">{moduleError}</span>
                        <button onClick={onClearModuleError} className="mr-auto hover:opacity-70"><X className="w-4 h-4" /></button>
                    </div>
                )}
                {certWarning && (
                    <div className="flex items-center gap-3 px-5 py-3 bg-amber-500/15 border-b border-amber-500/40 text-amber-300 flex-shrink-0">
                        <AlertCircle className="w-5 h-5 flex-shrink-0 text-amber-400" />
                        <span className="text-sm font-semibold">يجب ملء الامتحان النهائي حتى يتمكن المتدربون من الحصول على الشهادة.</span>
                        <button onClick={() => setCertWarning(false)} className="mr-auto hover:opacity-70"><X className="w-4 h-4" /></button>
                    </div>
                )}

                <div className="overflow-y-auto flex-1 p-6">

                    {/* ── TAB: INFO ── */}
                    {activeTab === 'info' && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-gray-300">صورة البرنامج</label>
                                <div className={`relative border-2 border-dashed rounded-xl overflow-hidden transition-all cursor-pointer ${imagePreview ? 'border-amber-500/50 h-48' : 'border-zinc-700 hover:border-amber-500/50 h-28'}`}>
                                    <input type="file" accept="image/*" onChange={onImageChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                                    {imagePreview ? <img src={imagePreview} alt="preview" className="w-full h-full object-cover" /> :
                                        <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                            <Upload className="w-8 h-8 mb-2" /><span className="text-sm">اضغط لرفع صورة (5MB max)</span>
                                        </div>}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-gray-300">عنوان البرنامج *</label>
                                <input type="text" name="title" value={courseData.title} onChange={onChange} placeholder="مثال: رسم المنمنمات من الصفر"
                                    className="w-full bg-zinc-800/50 border border-zinc-700 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50 hover:border-amber-500/50 transition-all" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-gray-300">الوصف</label>
                                <textarea name="description" value={courseData.description} onChange={onChange} rows="3" placeholder="وصف تفصيلي..."
                                    className="w-full bg-zinc-800/50 border border-zinc-700 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50 hover:border-amber-500/50 transition-all resize-none" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-gray-300">التخصص / الفئة *</label>
                                    <input type="text" name="category" value={courseData.category} onChange={onChange} placeholder="مثال: المنمنمات، الخط..."
                                        className="w-full bg-zinc-800/50 border border-zinc-700 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50 hover:border-amber-500/50 transition-all" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-gray-300">المستوى</label>
                                    <div className="relative">
                                        <select name="level" value={courseData.level} onChange={onChange}
                                            className="w-full bg-zinc-800/50 border border-zinc-700 text-white px-4 py-2.5 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-amber-500/50 hover:border-amber-500/50 transition-all">
                                            <option value="مبتدئ">مبتدئ</option>
                                            <option value="متوسط">متوسط</option>
                                            <option value="متقدم">متقدم</option>
                                        </select>
                                        <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-gray-300">نوع البرنامج</label>
                                    <div className="relative">
                                        <select name="type" value={courseData.type} onChange={onChange}
                                            className="w-full bg-zinc-800/50 border border-zinc-700 text-white px-4 py-2.5 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-amber-500/50 hover:border-amber-500/50 transition-all">
                                            <option value="مدفوعة">مدفوعة</option>
                                            <option value="مجانية">مجانية</option>
                                        </select>
                                        <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>
                                {courseData.type === 'مدفوعة' && (
                                    <div>
                                        <label className="block text-sm font-semibold mb-2 text-gray-300">السعر (DA) *</label>
                                        <input type="number" name="price" value={courseData.price} onChange={onChange} placeholder="15000"
                                            className="w-full bg-zinc-800/50 border border-zinc-700 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50 hover:border-amber-500/50 transition-all" />
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-gray-300">المدة</label>
                                <div className="flex gap-2">
                                    <input type="number" min="0.5" step="0.5" name="durationAmount" value={parseDuration(courseData.duration).amount}
                                        onChange={e => { const unit = parseDuration(courseData.duration).unit || 'سا'; const val = e.target.value; onChange({ target: { name: 'duration', value: val ? `${val} ${unit}` : '' } }); }}
                                        placeholder="مثال: 3"
                                        className="flex-1 bg-zinc-800/50 border border-zinc-700 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50 hover:border-amber-500/50 transition-all" />
                                    <div className="relative">
                                        <select name="durationUnit" value={parseDuration(courseData.duration).unit || 'سا'}
                                            onChange={e => { const amount = parseDuration(courseData.duration).amount || ''; onChange({ target: { name: 'duration', value: amount ? `${amount} ${e.target.value}` : '' } }); }}
                                            className="bg-zinc-800/50 border border-zinc-700 text-white px-4 py-2.5 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-amber-500/50 hover:border-amber-500/50 transition-all pr-8">
                                            {DURATION_UNITS.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
                                        </select>
                                        <ChevronDown className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3">
                                <div>
                                    <p className="font-semibold text-white text-sm">شهادة إتمام</p>
                                    <p className="text-xs text-gray-400 mt-0.5">المتدرب يحصل على شهادة بعد اجتياز الامتحان النهائي</p>
                                </div>
                                <button onClick={handleCertificateToggle} className={`transition-colors ${courseData.hasCertificate ? 'text-amber-400' : 'text-gray-600'}`}>
                                    {courseData.hasCertificate ? <ToggleRight className="w-9 h-9" /> : <ToggleLeft className="w-9 h-9" />}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ── TAB: CONTENT ── */}
                    {activeTab === 'content' && (
                        <div className="space-y-4">
                            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-3 text-blue-400 text-sm flex items-start gap-2">
                                <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                <span>أضف الوحدات التعليمية وحدد نوع المحتوى لكل درس.</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <h3 className="font-bold text-white flex items-center gap-2"><Layers className="w-5 h-5 text-amber-400" /> الوحدات التعليمية</h3>
                                <button onClick={addModule} className="flex items-center gap-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all">
                                    <PlusCircle className="w-4 h-4" /> إضافة وحدة
                                </button>
                            </div>
                            {modules.length === 0 && (
                                <div className="text-center py-12 text-gray-500 border-2 border-dashed border-zinc-700 rounded-xl">
                                    <Layers className="w-10 h-10 mx-auto mb-2 text-zinc-700" /><p className="text-sm">لا توجد وحدات. أضف وحدتك الأولى.</p>
                                </div>
                            )}
                            {modules.map((mod, mi) => (
                                <div key={mod.id || mi} className="bg-zinc-800/50 border border-zinc-700 rounded-xl overflow-hidden">
                                    <div className="flex items-center gap-3 p-4 border-b border-zinc-700">
                                        <div className="w-7 h-7 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 text-sm font-bold flex-shrink-0">{mi + 1}</div>
                                        <input type="text" value={mod.title} onChange={e => updateModule(mi, 'title', e.target.value)} placeholder={`عنوان الوحدة ${mi + 1}`}
                                            className="flex-1 bg-transparent border-none text-white font-semibold focus:outline-none placeholder-gray-600 text-sm" />
                                        <button onClick={() => removeModule(mi)} className="text-red-500/60 hover:text-red-500 transition-colors"><Trash className="w-4 h-4" /></button>
                                    </div>
                                    <div className="p-4 space-y-4">
                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <p className="text-sm font-semibold text-gray-300 flex items-center gap-1.5"><Layers className="w-4 h-4 text-amber-400" /> الدروس والمحتوى</p>
                                                <button onClick={() => addLesson(mi)} className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"><Plus className="w-3 h-3" /> إضافة درس</button>
                                            </div>
                                            {mod.lessons?.length === 0 && <p className="text-xs text-gray-600 text-center py-2 border border-dashed border-zinc-700 rounded-lg">لا توجد دروس</p>}
                                            {mod.lessons?.map((les, li) => {
                                                const contents = les.contents || [];
                                                const addContent = (type) => updateLesson(mi, li, 'contents', [...contents, { id: Date.now(), type, url: '', filename: '', file: null, mode: 'url' }]);
                                                const removeContent = (ci) => updateLesson(mi, li, 'contents', contents.filter((_, j) => j !== ci));
                                                const updateContent = (ci, field, val) => updateLesson(mi, li, 'contents', contents.map((c, j) => j === ci ? { ...c, [field]: val } : c));
                                                const handleFileSelect = (ci, file) => { if (!file) return; updateLesson(mi, li, 'contents', contents.map((c, j) => j === ci ? { ...c, file, filename: file.name, url: '' } : c)); };
                                                return (
                                                    <div key={les.id || li} className="mb-3 bg-zinc-800/60 border border-zinc-700 rounded-xl p-3 flex flex-col gap-3">
                                                        <div className="flex gap-2 items-center">
                                                            <input type="text" value={les.title} onChange={e => updateLesson(mi, li, 'title', e.target.value)} placeholder="عنوان الدرس"
                                                                className="flex-1 bg-zinc-700 border border-zinc-600 text-white px-3 py-1.5 rounded-lg text-xs focus:outline-none focus:border-amber-500/50" />
                                                            <input type="text" value={les.duration} onChange={e => updateLesson(mi, li, 'duration', e.target.value)} dir="rtl" placeholder="15 د"
                                                                className="w-20 bg-zinc-700 border border-zinc-600 text-white px-3 py-1.5 rounded-lg text-xs focus:outline-none focus:border-amber-500/50" />
                                                            <button onClick={() => removeLesson(mi, li)} className="text-red-500/60 hover:text-red-500 flex-shrink-0"><Trash className="w-3.5 h-3.5" /></button>
                                                        </div>
                                                        <div className="flex flex-wrap gap-1.5">
                                                            {CONTENT_TYPES_DEF.map(ct => (
                                                                <button key={ct.type} onClick={() => addContent(ct.type)}
                                                                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs border border-zinc-600 bg-zinc-700/50 hover:border-zinc-500 hover:bg-zinc-700 transition-all ${ct.color}`}>
                                                                    {ct.icon} + {ct.type}
                                                                </button>
                                                            ))}
                                                        </div>
                                                        {contents.length > 0 && (
                                                            <div className="space-y-2">
                                                                {contents.map((c, ci) => {
                                                                    const ct = CONTENT_TYPES_DEF.find(t => t.type === c.type);
                                                                    const isFileMode = c.mode === 'file';
                                                                    const hasFile = !!c.file;
                                                                    return (
                                                                        <div key={c.id || ci} className="bg-zinc-700/40 border border-zinc-600/50 rounded-lg p-2 flex flex-col gap-1.5">
                                                                            <div className="flex items-center gap-2">
                                                                                <span className={`flex items-center gap-1 text-xs flex-shrink-0 font-medium ${ct?.color}`}>{ct?.icon} {c.type}</span>
                                                                                <div className="flex items-center bg-zinc-800 rounded-md border border-zinc-600 overflow-hidden text-xs flex-shrink-0">
                                                                                    <button onClick={() => updateContent(ci, 'mode', 'url')} className={`px-2 py-0.5 transition-colors ${!isFileMode ? 'bg-amber-500 text-white' : 'text-gray-400 hover:text-white'}`}>🔗 رابط</button>
                                                                                    <button onClick={() => updateContent(ci, 'mode', 'file')} className={`px-2 py-0.5 transition-colors ${isFileMode ? 'bg-amber-500 text-white' : 'text-gray-400 hover:text-white'}`}>📁 ملف</button>
                                                                                </div>
                                                                                <div className="flex-1" />
                                                                                <button onClick={() => removeContent(ci)} className="text-red-500/50 hover:text-red-500 flex-shrink-0"><X className="w-3.5 h-3.5" /></button>
                                                                            </div>
                                                                            {!isFileMode ? (
                                                                                <input type="text" value={c.url} onChange={e => updateContent(ci, 'url', e.target.value)} placeholder={ct?.placeholder || 'رابط'}
                                                                                    className="w-full bg-zinc-800 border border-zinc-600 text-white text-xs px-2.5 py-1.5 rounded-lg focus:outline-none focus:border-amber-500/50 placeholder-zinc-500" />
                                                                            ) : (
                                                                                <div className="relative">
                                                                                    <input type="file" accept={acceptMap[c.type] || '*'} onChange={e => handleFileSelect(ci, e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer z-10 w-full" />
                                                                                    <div className={`flex items-center gap-2 border border-dashed rounded-lg px-3 py-2 text-xs transition-colors ${hasFile ? 'border-amber-500/50 bg-amber-500/5' : 'border-zinc-600 bg-zinc-800 hover:border-zinc-500'}`}>
                                                                                        <Upload className={`w-3.5 h-3.5 flex-shrink-0 ${hasFile ? 'text-amber-400' : 'text-zinc-500'}`} />
                                                                                        <span className={`truncate flex-1 ${hasFile ? 'text-amber-300' : 'text-zinc-500'}`}>{hasFile ? c.filename : 'اضغط لاختيار ملف'}</span>
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        )}
                                                        <textarea value={les.content || ''} onChange={e => updateLesson(mi, li, 'content', e.target.value)} placeholder="وصف الدرس أو ملاحظات..." dir="rtl" rows={2}
                                                            className="w-full bg-zinc-700 border border-zinc-600 text-white px-3 py-2 rounded-lg text-xs focus:outline-none focus:border-amber-500/50 resize-none placeholder-zinc-500" />
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        <div className="border-t border-zinc-700/50 pt-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <p className="text-sm font-semibold text-gray-300 flex items-center gap-1.5"><BarChart2 className="w-4 h-4 text-green-400" /> اختبار الوحدة</p>
                                                <button onClick={() => addQuestion(mi)} className="text-xs text-green-400 hover:text-green-300 flex items-center gap-1 transition-colors"><Plus className="w-3 h-3" /> إضافة سؤال</button>
                                            </div>
                                            <input type="text" value={mod.quiz?.title || ''} onChange={e => updateModule(mi, 'quiz', { ...mod.quiz, title: e.target.value })} placeholder="عنوان اختبار الوحدة"
                                                className="w-full bg-zinc-700 border border-zinc-600 text-white px-3 py-1.5 rounded-lg text-xs focus:outline-none focus:border-amber-500/50 mb-3" />
                                            {mod.quiz?.questions?.map((q, qi) => {
                                                const aType = q.answerType || q.questionType || 'mcq';
                                                return (
                                                    <div key={q.id || qi} className="bg-zinc-700/50 rounded-lg p-3 mb-2 space-y-2">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs text-amber-400 font-bold flex-shrink-0">س{qi + 1}</span>
                                                            <input type="text" value={q.text} onChange={e => updateQuestion(mi, qi, 'text', e.target.value)} placeholder="نص السؤال"
                                                                className="flex-1 bg-zinc-600 border border-zinc-500 text-white px-3 py-1 rounded-lg text-xs focus:outline-none" />
                                                            <button onClick={() => removeQuestion(mi, qi)} className="text-red-500/60 hover:text-red-500 flex-shrink-0"><X className="w-4 h-4" /></button>
                                                        </div>
                                                        {aType === 'mcq' && (
                                                            <>
                                                                <div className="grid grid-cols-2 gap-1.5">
                                                                    {(q.options || ['','','','']).map((opt, oi) => (
                                                                        <div key={oi} className="flex items-center gap-1.5">
                                                                            <button onClick={() => updateQuestion(mi, qi, 'correct', oi)} className={`w-4 h-4 rounded-full border-2 flex-shrink-0 transition-all ${q.correct === oi ? 'border-green-500 bg-green-500' : 'border-zinc-500 hover:border-green-500/50'}`} />
                                                                            <input type="text" value={opt} onChange={e => updateOption(mi, qi, oi, e.target.value)} placeholder={`خيار ${oi + 1}`}
                                                                                className="flex-1 bg-zinc-600 border border-zinc-500 text-white px-2 py-1 rounded text-xs focus:outline-none" />
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                                <p className="text-xs text-green-400">● الإجابة الصحيحة: الخيار {(q.correct ?? 0) + 1}</p>
                                                            </>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                            {(!mod.quiz?.questions || mod.quiz.questions.length === 0) && <p className="text-xs text-gray-600 text-center py-2">لا توجد أسئلة في هذه الوحدة</p>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ── TAB: EXAM ── */}
                    {activeTab === 'exam' && (
                        <div className="space-y-4">
                            {!courseData.hasCertificate ? (
                                <div className="flex flex-col items-center justify-center py-16 text-center">
                                    <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mb-4"><Award className="w-8 h-8 text-zinc-600" /></div>
                                    <p className="text-gray-500 font-semibold text-base mb-1">الامتحان النهائي معطّل</p>
                                    <p className="text-gray-600 text-sm">قم بتفعيل <span className="text-amber-400 font-semibold">شهادة الإتمام</span> من تبويب المعلومات العامة.</p>
                                    <button onClick={() => { onChange({ target: { name: 'hasCertificate', value: true } }); setCertWarning(true); setTimeout(() => setCertWarning(false), 5000); }}
                                        className="mt-5 flex items-center gap-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 px-4 py-2 rounded-lg text-sm font-semibold transition-all">
                                        <ToggleRight className="w-5 h-5" /> تفعيل الشهادة
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
                                        <p className="text-amber-400 text-sm font-semibold flex items-center gap-2"><Award className="w-5 h-5" /> الامتحان النهائي التقييمي</p>
                                        <p className="text-gray-400 text-xs mt-1">يظهر للمتدرب بعد إتمام جميع الوحدات. اجتيازه شرط للحصول على الشهادة.</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-2 text-gray-300">عنوان الامتحان النهائي</label>
                                        <input type="text" name="finalExamTitle" value={courseData.finalExamTitle || ''} onChange={onChange} placeholder="الامتحان النهائي للدورة"
                                            className="w-full bg-zinc-800/50 border border-zinc-700 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50 hover:border-amber-500/50 transition-all" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-2 text-gray-300">علامة النجاح (%)</label>
                                        <input type="number" name="passMark" value={courseData.passMark || 60} onChange={onChange} min="1" max="100"
                                            className="w-full bg-zinc-800/50 border border-zinc-700 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50 hover:border-amber-500/50 transition-all" />
                                    </div>
                                    <div>
                                        <div className="flex items-center justify-between mb-3">
                                            <label className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                                                <BookOpen className="w-4 h-4 text-amber-400" /> أسئلة الامتحان النهائي
                                                <span className="bg-amber-500/20 text-amber-400 text-xs px-2 py-0.5 rounded-full">{finalExamQuestions.length} سؤال</span>
                                            </label>
                                            <button onClick={addFinalQuestion} className="flex items-center gap-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all">
                                                <PlusCircle className="w-4 h-4" /> إضافة سؤال
                                            </button>
                                        </div>
                                        {finalExamQuestions.length === 0 ? (
                                            <div className="bg-zinc-800/50 border border-dashed border-zinc-600 rounded-xl p-8 text-center">
                                                <BarChart2 className="w-10 h-10 mx-auto mb-2 text-zinc-600" />
                                                <p className="text-gray-500 text-sm">لا توجد أسئلة بعد.</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                {finalExamQuestions.map((q, qi) => (
                                                    <div key={q.id || qi} className="bg-zinc-800/60 border border-zinc-700 rounded-xl p-4 space-y-3">
                                                        <div className="flex items-center gap-2">
                                                            <span className="bg-amber-500/20 text-amber-400 text-xs font-bold px-2 py-1 rounded-full flex-shrink-0">س {qi + 1}</span>
                                                            <input type="text" value={q.text} onChange={e => updateFinalQuestion(qi, 'text', e.target.value)} placeholder="اكتب نص السؤال هنا..."
                                                                className="flex-1 bg-zinc-700/50 border border-zinc-600 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 hover:border-amber-500/40 transition-all" />
                                                            <button onClick={() => removeFinalQuestion(qi)} className="text-red-500/60 hover:text-red-500 transition-colors flex-shrink-0"><Trash className="w-4 h-4" /></button>
                                                        </div>
                                                        {(q.answerType || 'mcq') === 'mcq' && (
                                                            <>
                                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                                    {(q.options || ['','','','']).map((opt, oi) => (
                                                                        <div key={oi} className="flex items-center gap-2">
                                                                            <button onClick={() => updateFinalQuestion(qi, 'correct', oi)} className={`w-5 h-5 rounded-full border-2 flex-shrink-0 transition-all ${q.correct === oi ? 'border-green-500 bg-green-500' : 'border-zinc-500 hover:border-green-500/50'}`} />
                                                                            <input type="text" value={opt} onChange={e => updateFinalOption(qi, oi, e.target.value)} placeholder={`الخيار ${oi + 1}`}
                                                                                className={`flex-1 bg-zinc-700/50 border text-white px-3 py-1.5 rounded-lg text-xs focus:outline-none transition-all ${q.correct === oi ? 'border-green-500/50' : 'border-zinc-600 hover:border-zinc-500'}`} />
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                                <p className="text-xs text-green-400 flex items-center gap-1">
                                                                    <CheckCircle className="w-3 h-3" /> الإجابة الصحيحة: الخيار {(q.correct ?? 0) + 1}
                                                                    {q.options?.[q.correct] && ` — "${q.options[q.correct]}"`}
                                                                </p>
                                                            </>
                                                        )}
                                                    </div>
                                                ))}
                                                <button onClick={addFinalQuestion} className="w-full flex items-center justify-center gap-2 border border-dashed border-amber-500/30 hover:border-amber-500/60 text-amber-500/60 hover:text-amber-400 py-3 rounded-xl text-sm transition-all hover:bg-amber-500/5">
                                                    <PlusCircle className="w-4 h-4" /> إضافة سؤال آخر
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex gap-3 p-6 border-t border-zinc-700 flex-shrink-0">
                    <button onClick={onSubmit} className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-600 text-white py-3 rounded-xl font-bold hover:from-amber-600 hover:to-yellow-700 transition-all transform hover:scale-105">
                        <Save className="w-5 h-5" />{isEdit ? 'حفظ التعديلات' : 'إضافة البرنامج'}
                    </button>
                    <button onClick={onClose} className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white py-3 rounded-xl font-bold transition-all">إلغاء</button>
                </div>
            </div>
        </div>
    );
};

// ─── Course Details Modal ─────────────────────────────────────────────────────
const CourseDetailsModal = ({ course, onClose }) => {
    const [openModule, setOpenModule] = useState(null);
    const formatPrice = (p) => (!p || p === '0' || p === 0) ? 'مجاني' : `DA ${Number(p).toLocaleString()}`;

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" dir="rtl">
            <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-2xl w-full max-w-3xl border border-zinc-700 shadow-2xl max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between p-6 border-b border-zinc-700 flex-shrink-0">
                    <h2 className="text-xl font-bold text-white">تفاصيل البرنامج</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors"><X className="w-6 h-6" /></button>
                </div>
                {course ? (
                    <div className="overflow-y-auto flex-1 p-6 space-y-5">
                        {course.image && <img src={getMediaUrl(course.image)} alt={course.title} className="w-full h-52 object-cover rounded-xl" />}
                        <div className="flex flex-wrap gap-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${(!course.price || course.price === 0 || course.type === 'مجانية') ? 'bg-green-500/80' : 'bg-amber-500/80'} text-white`}>{(!course.price || course.price === 0 || course.type === 'مجانية') ? 'مجانية' : 'مدفوعة'}</span>
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">{course.level || 'مبتدئ'}</span>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${course.status === 'موقوف' ? 'bg-gray-500/20 text-gray-400' : 'bg-blue-500/20 text-blue-400'}`}>{course.status || 'نشط'}</span>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-1">{course.title}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">{course.description}</p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {[
                                { icon: <Sparkles className="w-4 h-4 text-green-400" />,   label: 'المتدربون',  value: `${course.confirmedStudents ?? course.enrolledStudents ?? 0}` },
                                { icon: <Clock className="w-4 h-4 text-amber-400" />,       label: 'المدة',      value: formatDuration(course.duration) || '—' },
                                { icon: <Layers className="w-4 h-4 text-blue-400" />,       label: 'الوحدات',   value: course.modules?.length || 0 },
                                { icon: <DollarSign className="w-4 h-4 text-amber-400" />, label: 'السعر',      value: formatPrice(course.price) },
                            ].map((s, i) => (
                                <div key={i} className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-3 flex items-center gap-3">
                                    {s.icon}<div><p className="text-xs text-gray-500">{s.label}</p><p className="font-bold text-white text-sm" dir="rtl">{s.value}</p></div>
                                </div>
                            ))}
                        </div>
                        {course.modules?.length > 0 && (
                            <div>
                                <h4 className="font-bold text-white mb-3 flex items-center gap-2"><Layers className="w-4 h-4 text-amber-400" /> محتوى البرنامج</h4>
                                <div className="space-y-2">
                                    {course.modules.map((mod, i) => (
                                        <div key={i} className="bg-zinc-800/50 border border-zinc-700 rounded-xl overflow-hidden">
                                            <button onClick={() => setOpenModule(openModule === i ? null : i)} className="w-full flex items-center justify-between p-4 hover:bg-zinc-700/30 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-7 h-7 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 text-sm font-bold">{i + 1}</div>
                                                    <span className="font-semibold text-white text-sm">{mod.title || `الوحدة ${i + 1}`}</span>
                                                    <span className="text-xs text-gray-500">{mod.lessons?.length || 0} درس</span>
                                                </div>
                                                {openModule === i ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronLeft className="w-4 h-4 text-gray-400" />}
                                            </button>
                                            {openModule === i && (
                                                <div className="border-t border-zinc-700 px-4 pb-4 pt-3 space-y-2">
                                                    {mod.lessons?.map((les, j) => (
                                                        <div key={j} className="flex items-center gap-3 text-sm text-gray-300 py-2 border-b border-zinc-700/40 last:border-0">
                                                            <Play className="w-4 h-4 text-blue-400 flex-shrink-0" />
                                                            <span className="flex-1 font-medium">{les.title}</span>
                                                            {les.duration && <span className="text-xs text-gray-500" dir="rtl">{formatDuration(les.duration)}</span>}
                                                        </div>
                                                    ))}
                                                    {mod.quiz?.questions?.length > 0 && (
                                                        <div className="flex items-center gap-3 text-sm text-green-400 border-t border-zinc-700 pt-2 mt-1">
                                                            <BarChart2 className="w-4 h-4 flex-shrink-0" /><span>اختبار الوحدة – {mod.quiz.questions.length} سؤال</span>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {course.hasCertificate && (
                            <div className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
                                <Award className="w-6 h-6 text-amber-400 flex-shrink-0" />
                                <div>
                                    <p className="font-semibold text-amber-400 text-sm">هذا البرنامج يمنح شهادة إتمام</p>
                                    <p className="text-xs text-gray-400 mt-0.5">بعد اجتياز الامتحان النهائي بنسبة {course.finalExam?.passMark || 60}% أو أكثر</p>
                                </div>
                            </div>
                        )}
                    </div>
                ) : null}
            </div>
        </div>
    );
};

// ─── Delete Modal ─────────────────────────────────────────────────────────────
const DeleteModal = ({ course, onConfirm, onCancel, availability }) => {
    const hasStudents = (course?.enrolledStudents || 0) >= 1;
    const isBlocked = availability === 'موقوف';
    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className={`bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-2xl p-8 max-w-md w-full shadow-2xl border ${isBlocked ? 'border-zinc-600' : hasStudents ? 'border-orange-500/50' : 'border-red-500/50'}`}>
                <div className="flex flex-col items-center text-center gap-4">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${isBlocked ? 'bg-zinc-600/20' : hasStudents ? 'bg-orange-500/20' : 'bg-red-500/20'}`}>
                        <AlertCircle className={`w-8 h-8 ${isBlocked ? 'text-zinc-400' : hasStudents ? 'text-orange-500' : 'text-red-500'}`} />
                    </div>
                    {isBlocked ? (
                        <>
                            <h3 className="text-2xl font-bold text-white">لا يمكن حذف البرنامج</h3>
                            <p className="text-gray-300 leading-relaxed" dir="rtl">هذا البرنامج في حالة <span className="text-zinc-300 font-bold">موقوف</span>. لا يمكن حذفه.</p>
                        </>
                    ) : hasStudents ? (
                        <>
                            <h3 className="text-2xl font-bold text-white">إيقاف البرنامج</h3>
                            <p className="text-gray-300 leading-relaxed" dir="rtl">هذا البرنامج لديه <span className="text-orange-400 font-bold">{course.enrolledStudents} متدرب</span> مسجل. سيتم تغيير حالته إلى <span className="text-red-400 font-semibold">موقوف</span>.</p>
                        </>
                    ) : (
                        <>
                            <h3 className="text-2xl font-bold text-white">تأكيد الحذف</h3>
                            <p className="text-gray-300 leading-relaxed">لا يوجد طلاب مسجلون. سيتم حذف هذا البرنامج نهائياً.<br /><span className="text-red-400 font-semibold">لا يمكن التراجع.</span></p>
                        </>
                    )}
                    <div className="flex gap-3 w-full mt-2">
                        {!isBlocked && (
                            <button onClick={onConfirm} className={`flex-1 text-white py-3 rounded-xl font-bold transition-all transform hover:scale-105 ${hasStudents ? 'bg-orange-500 hover:bg-orange-600' : 'bg-red-500 hover:bg-red-600'}`}>
                                {hasStudents ? 'نعم، أوقف' : 'نعم، احذف'}
                            </button>
                        )}
                        <button onClick={onCancel} className={`${isBlocked ? 'w-full' : 'flex-1'} bg-zinc-700 hover:bg-zinc-600 text-white py-3 rounded-xl font-bold transition-all`}>
                            {isBlocked ? 'إغلاق' : 'تراجع'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const CoachCourses = () => {
    const [notification, setNotification] = useState({ show: false, type: '', message: '' });
    const showNotification = (type, message) => { setNotification({ show: true, type, message }); setTimeout(() => setNotification({ show: false, type: '', message: '' }), 4000); };

    const [courses, setCourses]               = useState(COACH_COURSES);
    const [showAddModal, setShowAddModal]       = useState(false);
    const [isEditMode, setIsEditMode]           = useState(false);
    const [editingCourseId, setEditingCourseId] = useState(null);
    const [imagePreview, setImagePreview]       = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedCourse, setSelectedCourse]     = useState(null);
    const [showDeleteModal, setShowDeleteModal]   = useState(false);
    const [courseToDelete, setCourseToDelete]     = useState(null);
    const [showFilters, setShowFilters]           = useState(false);
    const [filterCategory, setFilterCategory]     = useState('all');
    const [filterType, setFilterType]             = useState('all');
    const [searchQuery, setSearchQuery]           = useState('');

    const defaultCourse = { title: '', description: '', category: '', level: 'مبتدئ', type: 'مدفوعة', price: '', duration: '', contentTypes: [], hasCertificate: true, finalExamTitle: '', passMark: 60, finalExamQuestions: [], modules: [], image: null, status: 'نشط' };
    const [newCourse, setNewCourse] = useState(defaultCourse);
    const [examError, setExamError] = useState('');
    const [moduleError, setModuleError] = useState('');
    const [durationError, setDurationError] = useState('');

    useEffect(() => {
        document.body.style.overflow = (showAddModal || showDetailsModal) ? 'hidden' : 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [showAddModal, showDetailsModal]);

    const validateFinalExam = () => {
        if (!newCourse.hasCertificate) return true;
        if (!newCourse.finalExamTitle?.trim()) { setExamError('يجب إدخال عنوان الامتحان النهائي.'); return false; }
        if (!newCourse.passMark || Number(newCourse.passMark) < 1 || Number(newCourse.passMark) > 100) { setExamError('يجب إدخال علامة النجاح (بين 1 و 100).'); return false; }
        const questions = newCourse.finalExamQuestions || [];
        if (questions.length === 0) { setExamError('يجب إضافة سؤال واحد على الأقل في الامتحان النهائي.'); return false; }
        for (let qi = 0; qi < questions.length; qi++) {
            const q = questions[qi];
            if (!q.text?.trim()) { setExamError(`يجب كتابة نص السؤال ${qi + 1}.`); return false; }
            const aType = q.answerType || 'mcq';
            if (aType === 'mcq') {
                const filledOptions = (q.options || []).filter(o => o?.trim());
                if (filledOptions.length < 2) { setExamError(`السؤال ${qi + 1}: يجب إضافة خيارين على الأقل.`); return false; }
                if (!q.options[q.correct]?.trim()) { setExamError(`السؤال ${qi + 1}: يجب تحديد إجابة صحيحة.`); return false; }
            }
        }
        return true;
    };

    const validateModules = () => {
        const modules = newCourse.modules || [];
        if (modules.length === 0) { setModuleError('يجب إضافة وحدة تعليمية واحدة على الأقل.'); return false; }
        for (let mi = 0; mi < modules.length; mi++) {
            const mod = modules[mi];
            if (!mod.lessons || mod.lessons.length === 0) { setModuleError(`الوحدة ${mi + 1}: يجب إضافة درس واحد على الأقل.`); return false; }
            for (let li = 0; li < mod.lessons.length; li++) {
                const lesson = mod.lessons[li];
                if (!lesson.title?.trim()) { setModuleError(`الوحدة ${mi + 1} — الدرس ${li + 1}: يجب كتابة عنوان الدرس.`); return false; }
                if (!lesson.contents || lesson.contents.length === 0) { setModuleError(`الوحدة ${mi + 1} — الدرس ${li + 1}: يجب إضافة محتوى.`); return false; }
            }
            const questions = mod.quiz?.questions || [];
            if (questions.length === 0) { setModuleError(`الوحدة ${mi + 1}: يجب إضافة سؤال في اختبار الوحدة.`); return false; }
        }
        return true;
    };

    const resetForm = () => { setNewCourse(defaultCourse); setImagePreview(null); setIsEditMode(false); setEditingCourseId(null); setExamError(''); setModuleError(''); setDurationError(''); };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewCourse(prev => ({ ...prev, [name]: value }));
        if (['finalExamTitle', 'passMark', 'finalExamQuestions'].includes(name)) setExamError('');
        if (name === 'modules') setModuleError('');
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) { showNotification('warning', 'الرجاء اختيار صورة فقط'); return; }
        if (file.size > 5 * 1024 * 1024) { showNotification('warning', 'حجم الصورة يجب أن يكون أقل من 5MB'); return; }
        setNewCourse(prev => ({ ...prev, image: file }));
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
    };

    const handleEditClick = (course) => {
        setIsEditMode(true);
        setEditingCourseId(course._id);
        const exam = course.finalExam || {};
        setNewCourse({
            title: course.title || '', description: course.description || '', category: course.category || '',
            level: course.level || 'مبتدئ', type: course.type || 'مدفوعة',
            price: course.price != null ? String(course.price) : '', duration: course.duration || '',
            contentTypes: course.contentTypes || [], hasCertificate: course.hasCertificate !== false,
            status: course.status || 'نشط', finalExamTitle: exam.title || '', passMark: exam.passMark ?? 60,
            finalExamQuestions: (exam.questions || []).map(q => ({ id: q._id || Date.now() + Math.random(), text: q.text || '', questionType: q.questionType || 'mcq', answerType: q.answerType || 'mcq', options: q.options || ['', '', '', ''], correct: q.correct ?? 0, attachmentUrl: null, attachmentType: null, artistNote: q.artistNote || '', _attachmentFile: null, _attachmentPreview: null })),
            modules: (course.modules || []).map(m => ({ ...m, id: m._id || Date.now() + Math.random(), lessons: (m.lessons || []).map(l => ({ ...l, id: l._id || Date.now() + Math.random(), content: l.content || '', contents: l.contents || [] })), quiz: m.quiz ? { title: m.quiz.title || '', questions: (m.quiz.questions || []).map(q => ({ id: q._id || Date.now() + Math.random(), text: q.text || '', questionType: q.questionType || 'mcq', answerType: q.answerType || 'mcq', options: q.options || ['', '', '', ''], correct: q.correct ?? 0, _attachmentFile: null, _attachmentPreview: null })) } : { title: '', questions: [] } })),
            image: null,
        });
        if (course.image) setImagePreview(getMediaUrl(course.image));
        setShowAddModal(true);
    };

    const handleAddCourse = () => {
        if (!newCourse.title || !newCourse.category) { showNotification('warning', 'الرجاء ملء العنوان والتخصص على الأقل'); return; }
        if (newCourse.type === 'مدفوعة' && !newCourse.price) { showNotification('warning', 'السعر مطلوب للبرامج المدفوعة'); return; }
        if (!validateModules()) return;
        if (!validateFinalExam()) return;
        const created = {
            _id: String(Date.now()), ...newCourse,
            price: newCourse.type === 'مجانية' ? 0 : Number(newCourse.price) || 0,
            enrolledStudents: 0, confirmedStudents: 0,
            image: imagePreview || null,
        };
        setCourses(prev => [created, ...prev]);
        showNotification('success', 'تم إضافة البرنامج بنجاح');
        setShowAddModal(false); resetForm();
    };

    const handleUpdateCourse = () => {
        if (!newCourse.title || !newCourse.category) { showNotification('warning', 'الرجاء ملء العنوان والتخصص على الأقل'); return; }
        if (!validateModules()) return;
        if (!validateFinalExam()) return;
        setCourses(prev => prev.map(c => c._id === editingCourseId ? {
            ...c, ...newCourse,
            price: newCourse.type === 'مجانية' ? 0 : Number(newCourse.price) || 0,
            image: imagePreview || c.image,
        } : c));
        showNotification('success', 'تم تعديل البرنامج بنجاح');
        setShowAddModal(false); resetForm();
    };

    const handleViewCourse = (courseId) => {
        const course = courses.find(c => c._id === courseId);
        if (course) { setSelectedCourse(course); setShowDetailsModal(true); }
    };

    const handleDeleteCourse = (course) => { setCourseToDelete(course); setShowDeleteModal(true); };

    const confirmDelete = () => {
        const id = courseToDelete._id;
        const hasStudents = (courseToDelete.enrolledStudents || 0) >= 1;
        if (hasStudents) {
            setCourses(prev => prev.map(c => c._id === id ? { ...c, status: 'موقوف' } : c));
            showNotification('success', 'تم إيقاف البرنامج بنجاح');
        } else {
            setCourses(prev => prev.filter(c => c._id !== id));
            showNotification('success', 'تم حذف البرنامج بنجاح');
        }
        setShowDeleteModal(false); setCourseToDelete(null);
    };

    const getCourseAvailability = (course) => (course.status === 'موقوف' || course.status === 'غير نشط') ? 'موقوف' : 'نشط';
    const formatPrice = (p) => (!p || p === '0' || p === 0) ? 'مجاني' : `DA ${Number(p).toLocaleString()}`;

    const categories = ['all', ...Array.from(new Set(courses.map(c => c.category).filter(Boolean)))];
    const totalActive   = courses.filter(c => getCourseAvailability(c) === 'نشط').length;
    const totalStudents = courses.reduce((s, c) => s + Number(c.enrolledStudents || 0), 0);
    const totalCats     = new Set(courses.map(c => c.category).filter(Boolean)).size;

    const filteredCourses = courses.filter(c => {
        const courseIsFree = !c.price || c.price === 0 || c.type === 'مجانية';
        const effectiveType = courseIsFree ? 'مجانية' : 'مدفوعة';
        return (filterCategory === 'all' || c.category === filterCategory)
            && (filterType === 'all' || effectiveType === filterType)
            && (!searchQuery || c.title?.includes(searchQuery) || c.description?.includes(searchQuery) || c.category?.includes(searchQuery));
    });

    return (
        <>
            <div className="min-h-screen bg-zinc-950 text-white p-6" dir="rtl">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-6">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div>
                                <h1 className="text-3xl font-bold mb-1 bg-gradient-to-r from-amber-500 to-yellow-500 bg-clip-text text-transparent">البرامج التدريبية</h1>
                                <p className="text-gray-400 text-sm">إدارة البرامج التدريبية عن بعد الخاصة بك</p>
                            </div>
                            <button onClick={() => { resetForm(); setShowAddModal(true); }}
                                className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-600 text-white px-6 py-3 rounded-xl font-bold hover:from-amber-600 hover:to-yellow-700 transition-all transform hover:scale-105">
                                <Plus className="w-5 h-5" /> إضافة برنامج جديد
                            </button>
                        </div>
                    </div>

                    {!showAddModal && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            {[
                                { label: 'تخصصاتي',       value: totalCats,     icon: <Star className="w-6 h-6 text-blue-400" />,    bg: 'bg-blue-500/20',   border: 'hover:border-blue-500/50' },
                                { label: 'طلابي',          value: totalStudents, icon: <Sparkles className="w-6 h-6 text-green-400" />, bg: 'bg-green-500/20',  border: 'hover:border-green-500/50' },
                                { label: 'برامجي النشطة', value: totalActive,   icon: <BookOpen className="w-6 h-6 text-amber-400" />, bg: 'bg-amber-500/20',  border: 'hover:border-amber-500/50' },
                            ].map((s, i) => (
                                <div key={i} className={`bg-gradient-to-br from-zinc-900/80 to-zinc-800/80 backdrop-blur-sm rounded-xl p-4 border border-zinc-700/50 ${s.border} transition-all`}>
                                    <div className="flex items-center justify-between">
                                        <div><p className="text-gray-400 text-xs mb-0.5">{s.label}</p><p className="text-xl font-bold text-white">{s.value}</p></div>
                                        <div className={`${s.bg} p-3 rounded-lg`}>{s.icon}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {!showAddModal && (
                        <div className="mb-4">
                            <button onClick={() => setShowFilters(!showFilters)}
                                className="w-full bg-gradient-to-br from-zinc-900/80 to-zinc-800/80 backdrop-blur-sm rounded-xl p-3 border border-zinc-700/50 hover:border-amber-500/50 transition-all flex items-center justify-between">
                                <span className="text-white font-semibold">{showFilters ? 'إخفاء الفلاتر' : 'إظهار الفلاتر'}</span>
                                <ChevronDown className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                            </button>
                        </div>
                    )}

                    {!showAddModal && showFilters && (
                        <div className="bg-gradient-to-br from-zinc-900/80 to-zinc-800/80 backdrop-blur-sm rounded-xl p-4 border border-zinc-700/50 mb-6">
                            <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
                                <div className="relative flex-1">
                                    <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
                                        className="w-full bg-zinc-800/50 border border-zinc-700 text-white text-sm px-4 py-2.5 pr-10 rounded-lg appearance-none cursor-pointer hover:border-amber-500/50 transition-all focus:outline-none focus:ring-2 focus:ring-amber-500/50" style={{ direction: 'rtl' }}>
                                        <option value="all">جميع التخصصات</option>
                                        {categories.filter(c => c !== 'all').map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                </div>
                                <div className="relative flex-1">
                                    <select value={filterType} onChange={e => setFilterType(e.target.value)}
                                        className="w-full bg-zinc-800/50 border border-zinc-700 text-white text-sm px-4 py-2.5 pr-10 rounded-lg appearance-none cursor-pointer hover:border-amber-500/50 transition-all focus:outline-none focus:ring-2 focus:ring-amber-500/50" style={{ direction: 'rtl' }}>
                                        <option value="all">جميع الأنواع</option>
                                        <option value="مدفوعة">مدفوعة</option>
                                        <option value="مجانية">مجانية</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                </div>
                                <div className="relative flex-1 md:flex-[2]">
                                    <input type="text" placeholder="ابحث عن برنامج..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                                        className="w-full bg-zinc-800/50 border border-zinc-700 text-white text-sm px-4 py-2.5 pl-10 rounded-lg hover:border-amber-500/50 transition-all focus:outline-none focus:ring-2 focus:ring-amber-500/50" style={{ direction: 'rtl' }} />
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                </div>
                            </div>
                        </div>
                    )}

                    {filteredCourses.length === 0 ? (
                        <div className="flex flex-col justify-center items-center h-64 gap-3">
                            <BookOpen className="w-12 h-12 text-zinc-700" />
                            <div className="text-gray-400 text-xl">لا توجد برامج تطابق الفلاتر</div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredCourses.map((course) => {
                                const avail = getCourseAvailability(course);
                                const isBlocked = avail === 'موقوف';
                                const isFree = !course.price || course.price === 0 || course.type === 'مجانية';
                                return (
                                    <div key={course._id} className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-2xl overflow-hidden border border-gray-800 hover:border-amber-500 transition-all">
                                        <div className="relative h-48">
                                            <img src={course.image ? (course.image.startsWith('data:') ? course.image : getMediaUrl(course.image)) : 'https://images.pexels.com/photos/1047540/pexels-photo-1047540.jpeg'} alt={course.title} className="w-full h-full object-cover" />
                                            <div className="absolute top-4 left-4"><span className={`px-3 py-1 rounded-full text-xs font-semibold ${isFree ? 'bg-green-500/80' : 'bg-amber-500/80'} text-white`}>{isFree ? 'مجانية' : 'مدفوعة'}</span></div>
                                            <div className="absolute top-4 right-4"><span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${isBlocked ? 'bg-gray-500/80' : 'bg-blue-500/80'}`}>{avail}</span></div>
                                            {course.hasCertificate && <div className="absolute bottom-4 right-4"><span className="bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 text-xs text-amber-400"><Award className="w-3 h-3" /> شهادة</span></div>}
                                        </div>
                                        <div className="p-6">
                                            <h3 className="text-xl font-bold mb-1">{course.title}</h3>
                                            {course.category && <span className="inline-block bg-blue-500/20 text-blue-400 text-xs px-2 py-0.5 rounded-full mb-2">{course.category}</span>}
                                            <p className="text-gray-400 text-sm mb-4 line-clamp-2">{course.description}</p>
                                            <div className="space-y-2 mb-4">
                                                <div className="flex items-center gap-2 text-sm text-gray-400"><Layers className="w-4 h-4 text-amber-500" /><span>{course.modules?.length || 0} وحدة تعليمية</span></div>
                                                <div className="flex items-center gap-2 text-sm text-gray-400"><Sparkles className="w-4 h-4 text-amber-500" /><span>{course.enrolledStudents || 0} متدرب</span></div>
                                                <div className="flex items-center gap-2 text-sm text-gray-400"><Clock className="w-4 h-4 text-amber-500" /><span dir="rtl">{formatDuration(course.duration) || '—'}</span></div>
                                                <div className="flex items-center gap-2 text-sm"><DollarSign className="w-4 h-4 text-amber-500" /><span className="text-amber-500 font-bold">{formatPrice(course.price)}</span></div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={() => handleViewCourse(course._id)} className="flex-1 flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 py-2 rounded-lg transition-colors text-sm"><Eye className="w-4 h-4" /> عرض</button>
                                                <button onClick={() => !isBlocked && handleEditClick(course)} disabled={isBlocked} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-colors text-sm ${isBlocked ? 'bg-zinc-700/40 text-zinc-600 cursor-not-allowed opacity-50' : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-500 cursor-pointer'}`}><Edit className="w-4 h-4" /> تعديل</button>
                                                <button onClick={() => !isBlocked && handleDeleteCourse(course)} disabled={isBlocked} className={`flex items-center justify-center px-4 py-2 rounded-lg transition-colors ${isBlocked ? 'bg-zinc-700/40 text-zinc-600 cursor-not-allowed opacity-50' : 'bg-red-500/20 hover:bg-red-500/30 text-red-500 cursor-pointer'}`}><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {showAddModal && (
                        <CourseFormModal
                            key={editingCourseId || 'new'}
                            isEdit={isEditMode}
                            courseData={newCourse}
                            onChange={handleInputChange}
                            onImageChange={handleImageChange}
                            imagePreview={imagePreview}
                            onSubmit={isEditMode ? handleUpdateCourse : handleAddCourse}
                            onClose={() => { setShowAddModal(false); resetForm(); }}
                            examError={examError}
                            onClearExamError={() => setExamError('')}
                            moduleError={moduleError}
                            onClearModuleError={() => setModuleError('')}
                            durationError={durationError}
                            onClearDurationError={() => setDurationError('')}
                        />
                    )}
                    {showDetailsModal && <CourseDetailsModal course={selectedCourse} onClose={() => { setShowDetailsModal(false); setSelectedCourse(null); }} />}
                    {showDeleteModal && courseToDelete && <DeleteModal course={courseToDelete} availability={getCourseAvailability(courseToDelete)} onConfirm={confirmDelete} onCancel={() => { setShowDeleteModal(false); setCourseToDelete(null); }} />}
                    <Notification notification={notification} onClose={() => setNotification({ show: false, type: '', message: '' })} />
                </div>
            </div>
        </>
    );
};

export default CoachCourses;