import { useState } from 'react';
import {
    User, Save, Edit2, Lock, Trophy, Activity, Shield
} from 'lucide-react';

const SPORT_LEVELS = [
    { ar: 'مبتدئ',  en: 'Beginner'     },
    { ar: 'متوسط',  en: 'Intermediate' },
    { ar: 'متقدم',  en: 'Advanced'     },
    { ar: 'محترف',  en: 'Pro'          },
];

const SPORT_GOALS = [
    { ar: 'فقدان الوزن',      en: 'Weight Loss'    },
    { ar: 'بناء العضلات',     en: 'Muscle Gain'    },
    { ar: 'تحسين اللياقة',    en: 'Cardio Fitness' },
    { ar: 'إعادة التأهيل',    en: 'Rehabilitation' },
    { ar: 'التحضير للبطولات', en: 'Competition'    },
    { ar: 'الاسترخاء والصحة', en: 'Wellness'       },
];

const SPORT_DISCIPLINES = [
    { ar: 'كمال الأجسام', en: 'Bodybuilding' },
    { ar: 'الجري',         en: 'Running'      },
    { ar: 'السباحة',       en: 'Swimming'     },
    { ar: 'كرة القدم',    en: 'Football'     },
    { ar: 'كرة السلة',    en: 'Basketball'   },
    { ar: 'التايكواندو',  en: 'Taekwondo'    },
    { ar: 'الملاكمة',     en: 'Boxing'       },
    { ar: 'اليوغا',       en: 'Yoga'         },
    { ar: 'CrossFit',      en: 'CrossFit'     },
    { ar: 'الدراجة',      en: 'Cycling'      },
];

const ACHIEVEMENTS = [
    { icon: '🏃', ar: 'أول جلسة',     en: '1st Session',  earned: true  },
    { icon: '💪', ar: '10 جلسات',     en: '10 Sessions',  earned: false },
    { icon: '📅', ar: 'شهر كامل',     en: 'Full Month',   earned: false },
    { icon: '🎯', ar: 'هدف محقق',     en: 'Goal Reached', earned: false },
    { icon: '🌅', ar: 'محارب الصباح', en: 'Morning Hero', earned: false },
    { icon: '🏆', ar: 'بطل الثبات',   en: 'Consistency',  earned: false },
];

const TABS = [
    { id: 'info',         ar: 'معلوماتي', en: 'My Info',  icon: User     },
    { id: 'sport',        ar: 'الرياضة',   en: 'Sport',    icon: Activity },
    { id: 'security',     ar: 'الأمان',     en: 'Security', icon: Shield   },
    { id: 'achievements', ar: 'الإنجازات', en: 'Badges',   icon: Trophy   },
];

/* ── Mock profile ── */
const MOCK_PROFILE = {
    fullName:    'Ahmed Benali',
    email:       'ahmed.benali@email.com',
    phone:       '+213 555 123 456',
    address:     'Blida, Algérie',
    birthDate:   '1998-04-15',
    bio:         'مهتم بالرياضة والصحة، أسعى لتحسين لياقتي البدنية يومياً.',
    level:       'متوسط · Intermediate',
    goal:        'بناء العضلات · Muscle Gain',
    weight:      '78',
    height:      '178',
    disciplines: ['كمال الأجسام · Bodybuilding', 'الجري · Running'],
    memberSince: '2025-09-01',
};

const InputField = ({ label, value, onChange, type = 'text', disabled = false, placeholder = '' }) => (
    <div>
        <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block mb-1.5">{label}</label>
        <input type={type} value={value} onChange={onChange} disabled={disabled} placeholder={placeholder}
               dir="rtl"
               className={`w-full bg-zinc-900/60 border rounded-xl py-2.5 px-3 text-sm transition-colors text-white
                           placeholder-zinc-700 focus:outline-none
                           ${disabled
                               ? 'border-white/[0.04] text-zinc-600 cursor-not-allowed'
                               : 'border-white/[0.09] focus:border-amber-500/40'}`} />
    </div>
);

const LearnerProfile = () => {
    const [tab,         setTab]         = useState('info');
    const [editing,     setEditing]     = useState(false);
    const [saving,      setSaving]      = useState(false);
    const [profile,     setProfile]     = useState(MOCK_PROFILE);
    const [origProfile, setOrigProfile] = useState(MOCK_PROFILE);
    const [successMsg,  setSuccessMsg]  = useState('');
    const [pwForm, setPwForm] = useState({ current: '', newPw: '', confirm: '' });
    const [pwMsg,  setPwMsg]  = useState('');

    const handleSave = () => {
        setSaving(true);
        setTimeout(() => {
            setOrigProfile(profile);
            setEditing(false);
            setSuccessMsg('Saved · تم الحفظ ✓');
            setTimeout(() => setSuccessMsg(''), 3000);
            setSaving(false);
        }, 500);
    };

    const toggleDiscipline = (d) => {
        setProfile(p => ({
            ...p,
            disciplines: p.disciplines.includes(d)
                ? p.disciplines.filter(x => x !== d)
                : [...p.disciplines, d],
        }));
    };

    const handleChangePw = () => {
        if (!pwForm.current || !pwForm.newPw || !pwForm.confirm) {
            setPwMsg('يرجى ملء جميع الحقول / Fill all fields');
            return;
        }
        if (pwForm.newPw !== pwForm.confirm) {
            setPwMsg('كلمات المرور غير متطابقة / Passwords do not match');
            return;
        }
        setPwMsg('Password updated · تم التحديث ✓');
        setPwForm({ current: '', newPw: '', confirm: '' });
    };

    const bmi = profile?.weight && profile?.height
        ? (profile.weight / Math.pow(profile.height / 100, 2)).toFixed(1)
        : null;

    const bmiLabel = bmi
        ? bmi < 18.5 ? { text: 'Underweight · نحيف', color: 'text-sky-400'     }
        : bmi < 25   ? { text: 'Normal · طبيعي ✓',    color: 'text-emerald-400' }
        : bmi < 30   ? { text: 'Overweight · زيادة',  color: 'text-amber-400'   }
        :               { text: 'Obese · سمنة',         color: 'text-red-400'     }
        : null;

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-6" dir="rtl">
            <div className="max-w-4xl mx-auto">

                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-black text-white mb-1">ملفي الشخصي</h1>
                    <p className="text-zinc-500 text-sm">My Profile · الملف الشخصي</p>
                </div>

                {/* Profile card */}
                <div className="bg-[#111] border border-white/[0.07] rounded-2xl p-5 mb-5">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500
                                        flex items-center justify-center shadow-lg shadow-amber-500/20 flex-shrink-0">
                            <User className="w-8 h-8 text-black" />
                        </div>
                        <div className="flex-1 text-right">
                            <h2 className="text-xl font-black text-white">{profile.fullName}</h2>
                            <p className="text-zinc-500 text-sm">{profile.email}</p>
                            {profile.memberSince && (
                                <p className="text-[10px] text-zinc-700 mt-0.5 font-semibold">
                                    Member since · عضو منذ {profile.memberSince}
                                </p>
                            )}
                        </div>
                        {bmi && (
                            <div className="bg-zinc-900/60 rounded-xl p-3 text-center flex-shrink-0">
                                <p className="text-xl font-black text-white">{bmi}</p>
                                <p className="text-[9px] text-zinc-600 font-semibold">BMI</p>
                                {bmiLabel && <p className={`text-[9px] font-bold mt-0.5 ${bmiLabel.color}`}>{bmiLabel.text}</p>}
                            </div>
                        )}
                    </div>
                </div>

                {/* Success message */}
                {successMsg && (
                    <div className="mb-4 bg-emerald-500/10 border border-emerald-500/25 rounded-xl px-4 py-2.5
                                    text-emerald-400 text-sm font-bold text-center">
                        {successMsg}
                    </div>
                )}

                {/* Tabs */}
                <div className="flex gap-1 mb-5 bg-zinc-900/60 p-1 rounded-xl border border-white/[0.06] overflow-x-auto">
                    {TABS.map(t => {
                        const Icon = t.icon;
                        return (
                            <button key={t.id} onClick={() => setTab(t.id)}
                                    className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg
                                                text-xs font-bold transition-all min-w-[90px]
                                                ${tab === t.id
                                                    ? 'bg-amber-500 text-black shadow-sm'
                                                    : 'text-zinc-500 hover:text-zinc-300'}`}>
                                <Icon className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">{t.ar}</span>
                                <span className="hidden lg:inline text-[10px] opacity-70">· {t.en}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Tab Content */}
                <div className="bg-[#111] border border-white/[0.07] rounded-2xl p-5">

                    {/* INFO TAB */}
                    {tab === 'info' && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InputField label="Full Name · الاسم"
                                            value={profile.fullName} disabled onChange={() => {}} />
                                <InputField label="Email · البريد"
                                            value={profile.email} disabled onChange={() => {}} type="email" />
                                <InputField label="Phone · الهاتف"
                                            value={profile.phone} disabled onChange={() => {}} />
                                <InputField label="Birth Date · تاريخ الميلاد"
                                            value={profile.birthDate} type="date"
                                            disabled={!editing}
                                            onChange={e => setProfile(p => ({ ...p, birthDate: e.target.value }))} />
                                <InputField label="Address · العنوان"
                                            value={profile.address}
                                            disabled={!editing}
                                            placeholder="أدخل عنوانك / Enter your address"
                                            onChange={e => setProfile(p => ({ ...p, address: e.target.value }))} />
                            </div>

                            {/* Bio */}
                            <div>
                                <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block mb-1.5">
                                    Bio · نبذة عني
                                </label>
                                <textarea rows={3} dir="rtl"
                                          value={profile.bio} disabled={!editing}
                                          placeholder="اكتب نبذة عنك / Write about yourself"
                                          onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))}
                                          className={`w-full bg-zinc-900/60 border rounded-xl py-2.5 px-3 text-sm
                                                      text-white placeholder-zinc-700 resize-none focus:outline-none transition-colors
                                                      ${editing
                                                          ? 'border-white/[0.09] focus:border-amber-500/40'
                                                          : 'border-white/[0.04] text-zinc-600 cursor-not-allowed'}`} />
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-1">
                                {editing ? (
                                    <>
                                        <button onClick={handleSave} disabled={saving}
                                                className="bg-amber-500 hover:bg-amber-400 text-black font-black
                                                           px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all disabled:opacity-60">
                                            <Save className="w-4 h-4" />
                                            {saving ? 'Saving...' : 'Save · حفظ'}
                                        </button>
                                        <button onClick={() => { setEditing(false); setProfile(origProfile); }}
                                                className="bg-zinc-800 text-zinc-400 hover:text-white font-bold px-5 py-2.5 rounded-xl transition-all">
                                            Cancel · إلغاء
                                        </button>
                                    </>
                                ) : (
                                    <button onClick={() => setEditing(true)}
                                            className="flex items-center gap-2 text-sm text-amber-500 hover:text-amber-400
                                                       font-bold transition-colors">
                                        <Edit2 className="w-4 h-4" />
                                        Edit Profile · تعديل
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* SPORT TAB */}
                    {tab === 'sport' && (
                        <div className="space-y-5">
                            {/* Weight / Height / BMI */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {[
                                    { label: 'Weight · الوزن', key: 'weight', color: 'text-amber-400', unit: 'kg' },
                                    { label: 'Height · الطول', key: 'height', color: 'text-sky-400',   unit: 'cm' },
                                ].map((s, i) => (
                                    <div key={i} className="bg-zinc-900/60 rounded-xl p-3 text-center">
                                        <p className="text-[10px] text-zinc-600 mb-1 font-semibold">{s.label}</p>
                                        {editing ? (
                                            <input type="number" value={profile[s.key] || ''}
                                                   onChange={e => setProfile(p => ({ ...p, [s.key]: e.target.value }))}
                                                   className={`w-full bg-transparent text-lg font-black ${s.color} focus:outline-none text-center`} />
                                        ) : (
                                            <p className={`text-lg font-black ${s.color}`}>
                                                {profile[s.key] ? `${profile[s.key]} ${s.unit}` : '—'}
                                            </p>
                                        )}
                                    </div>
                                ))}
                                {bmi && (
                                    <div className="bg-zinc-900/60 rounded-xl p-3 text-center col-span-2">
                                        <p className="text-[10px] text-zinc-600 mb-1 font-semibold">BMI · مؤشر الكتلة</p>
                                        <p className={`text-lg font-black ${bmiLabel?.color || 'text-white'}`}>{bmi}</p>
                                        {bmiLabel && <p className={`text-[10px] ${bmiLabel.color}`}>{bmiLabel.text}</p>}
                                    </div>
                                )}
                            </div>

                            {/* Level */}
                            <div>
                                <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block mb-2">
                                    Level · المستوى
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {SPORT_LEVELS.map(l => {
                                        const val = `${l.ar} · ${l.en}`;
                                        return (
                                            <button key={val}
                                                    onClick={() => editing && setProfile(p => ({ ...p, level: val }))}
                                                    disabled={!editing}
                                                    className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all
                                                                ${profile.level === val
                                                                    ? 'bg-amber-500 text-black'
                                                                    : 'bg-zinc-800/60 text-zinc-500 hover:bg-zinc-700/60 disabled:opacity-50'}`}>
                                                {l.ar} · {l.en}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Goal */}
                            <div>
                                <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block mb-2">
                                    Goal · الهدف
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {SPORT_GOALS.map(g => {
                                        const val = `${g.ar} · ${g.en}`;
                                        return (
                                            <button key={val}
                                                    onClick={() => editing && setProfile(p => ({ ...p, goal: val }))}
                                                    disabled={!editing}
                                                    className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all
                                                                ${profile.goal === val
                                                                    ? 'bg-sky-500 text-white'
                                                                    : 'bg-zinc-800/60 text-zinc-500 hover:bg-zinc-700/60 disabled:opacity-50'}`}>
                                                {g.ar} · {g.en}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Disciplines */}
                            <div>
                                <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block mb-2">
                                    Disciplines · التخصصات
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {SPORT_DISCIPLINES.map(d => {
                                        const val      = `${d.ar} · ${d.en}`;
                                        const selected = (profile.disciplines || []).includes(val);
                                        return (
                                            <button key={val}
                                                    onClick={() => editing && toggleDiscipline(val)}
                                                    disabled={!editing}
                                                    className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all
                                                                ${selected
                                                                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                                                    : 'bg-zinc-800/60 text-zinc-500 hover:bg-zinc-700/60 disabled:opacity-50'}`}>
                                                {d.ar} · {d.en}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Edit button */}
                            <div className="flex gap-3 pt-1">
                                {editing ? (
                                    <>
                                        <button onClick={handleSave} disabled={saving}
                                                className="bg-amber-500 hover:bg-amber-400 text-black font-black
                                                           px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all">
                                            <Save className="w-4 h-4" />
                                            {saving ? 'Saving...' : 'Save · حفظ'}
                                        </button>
                                        <button onClick={() => { setEditing(false); setProfile(origProfile); }}
                                                className="bg-zinc-800 text-zinc-400 hover:text-white font-bold px-5 py-2.5 rounded-xl transition-all">
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <button onClick={() => setEditing(true)}
                                            className="flex items-center gap-2 text-sm text-amber-500 hover:text-amber-400 font-bold transition-colors">
                                        <Edit2 className="w-4 h-4" />
                                        Edit Sport Info · تعديل
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* SECURITY TAB */}
                    {tab === 'security' && (
                        <div className="max-w-sm space-y-4">
                            <h3 className="font-black text-sm text-white mb-3">
                                Change Password · تغيير كلمة المرور
                            </h3>
                            {[
                                { key: 'current', label: 'Current · الحالية', ph: '••••••••' },
                                { key: 'newPw',   label: 'New · الجديدة',     ph: '••••••••' },
                                { key: 'confirm', label: 'Confirm · التأكيد', ph: '••••••••' },
                            ].map(f => (
                                <div key={f.key}>
                                    <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block mb-1.5">
                                        {f.label}
                                    </label>
                                    <input type="password" placeholder={f.ph}
                                           value={pwForm[f.key]}
                                           onChange={e => setPwForm(p => ({ ...p, [f.key]: e.target.value }))}
                                           className="w-full bg-zinc-900/60 border border-white/[0.09] rounded-xl py-2.5 px-3
                                                      text-sm focus:outline-none focus:border-amber-500/40 transition-colors text-white" />
                                </div>
                            ))}
                            {pwMsg && (
                                <p className={`text-xs font-bold rounded-xl px-3 py-2 border
                                              ${pwMsg.includes('✓')
                                                  ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                                                  : 'text-red-400 bg-red-500/10 border-red-500/20'}`}>
                                    {pwMsg}
                                </p>
                            )}
                            <button onClick={handleChangePw}
                                    className="bg-amber-500 hover:bg-amber-400 text-black font-black
                                               px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all w-full justify-center">
                                <Lock className="w-4 h-4" />
                                Update Password · تحديث
                            </button>
                        </div>
                    )}

                    {/* ACHIEVEMENTS TAB */}
                    {tab === 'achievements' && (
                        <div>
                            <p className="text-xs text-zinc-600 mb-4 text-right">
                                Unlock badges as you progress · افتح الإنجازات مع تقدمك!
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {ACHIEVEMENTS.map((a, i) => (
                                    <div key={i}
                                         className={`rounded-2xl border p-4 text-center transition-all
                                                     ${a.earned
                                                         ? 'bg-amber-500/10 border-amber-500/30'
                                                         : 'bg-zinc-900/60 border-white/[0.05] opacity-45'}`}>
                                        <div className="text-3xl mb-2">{a.icon}</div>
                                        <p className={`text-sm font-black ${a.earned ? 'text-amber-400' : 'text-zinc-500'}`}>
                                            {a.ar}
                                        </p>
                                        <p className="text-[10px] text-zinc-600 mt-0.5">{a.en}</p>
                                        <p className={`text-[10px] font-bold mt-2 ${a.earned ? 'text-amber-500' : 'text-zinc-700'}`}>
                                            {a.earned ? '✓ Unlocked · مفتوح' : '🔒 Locked'}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default LearnerProfile;