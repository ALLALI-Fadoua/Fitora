import { useState } from 'react';
import { BadgeCheck, Mail, Phone, MapPin, Briefcase, FileText, Save, Instagram, Facebook, Twitter, Globe } from 'lucide-react';
import { COACH_PROFILE } from '../../utils/mockData';

const SPECIALTIES = [
    'تطوير الذات', 'القيادة والإدارة', 'التسويق والمبيعات', 'الصحة والعافية',
    'ريادة الأعمال', 'التقنية والبرمجة', 'المهارات اللغوية',
    'التدريب الرياضي', 'التغذية والعافية', 'أخرى'
];

const SERVICES = [
    'جلسات كوتشينج فردية', 'جلسات جماعية',
    'برامج تطوير مهني', 'ورش عمل تدريبية',
    'دورات أونلاين', 'استشارات مهنية',
    'إعداد الخطط التطويرية', 'متابعة الأداء',
    'التدريب على المهارات الناعمة', 'إعداد السير الذاتية',
    'الإرشاد الأكاديمي', 'التحضير للمقابلات'
];

const CoachProfile = () => {
    const [profileData, setProfileData] = useState(COACH_PROFILE);

    const handleInputChange = (e) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value });
    };

    const handleToggleItem = (field, value) => {
        const current = profileData[field] || [];
        const updated = current.includes(value)
            ? current.filter(v => v !== value)
            : [...current, value];
        setProfileData({ ...profileData, [field]: updated });
    };

    const handleSave = () => {
        alert('تم حفظ التغييرات بنجاح!');
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-white p-6" dir="rtl">
            <div className="max-w-5xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-amber-500 to-yellow-500 bg-clip-text text-transparent">
                        الملف الشخصي
                    </h1>
                    <p className="text-gray-400">إدارة معلوماتك الشخصية والمهنية</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-2xl p-6 border border-gray-800 sticky top-6">
                            <div className="text-center mb-6">
                                <div className={`w-32 h-32 rounded-full bg-gradient-to-br ${profileData.avatarColor || 'from-amber-500 to-yellow-600'} flex items-center justify-center text-4xl font-bold mb-4 mx-auto`}>
                                    {profileData.fullName?.charAt(0) || '؟'}
                                </div>
                                <h2 className="text-2xl font-bold mb-1">{profileData.fullName}</h2>
                                {profileData.artisticName && (
                                    <p className="text-amber-400 text-sm font-medium mb-1">✦ {profileData.artisticName}</p>
                                )}
                                <p className="text-gray-400 mb-2">{profileData.specialty}</p>
                                <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                                    <MapPin className="w-4 h-4 text-amber-500" />
                                    <span>{profileData.location}</span>
                                </div>
                                {/* Rating */}
                                {profileData.rating && (
                                    <div className="mt-3 flex items-center justify-center gap-1.5">
                                        <span className="text-amber-400 text-sm font-bold">{profileData.rating}</span>
                                        <span className="text-amber-400">★</span>
                                        <span className="text-zinc-500 text-xs">({profileData.reviews} تقييم)</span>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-sm">
                                    <Mail className="w-4 h-4 text-amber-500" />
                                    <span className="text-gray-400">{profileData.email}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <Phone className="w-4 h-4 text-amber-500" />
                                    <span className="text-gray-400">{profileData.phoneNumber}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <Briefcase className="w-4 h-4 text-amber-500" />
                                    <span className="text-gray-400">
                                        {profileData.experience === 0 ? 'لا يوجد خبرة'
                                            : profileData.experience === 1 ? '1 سنة خبرة'
                                            : `${profileData.experience} سنوات خبرة`}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-700">
                                <h3 className="font-semibold mb-3">وسائل التواصل</h3>
                                <div className="space-y-2">
                                    {[
                                        { icon: Instagram, key: 'instagram' },
                                        { icon: Facebook,  key: 'facebook'  },
                                        { icon: Twitter,   key: 'twitter'   },
                                        { icon: Globe,     key: 'website'   },
                                    ].map(({ icon: Icon, key }) => profileData[key] && (
                                        <a key={key} href="#" className="flex items-center gap-2 text-sm text-gray-400 hover:text-amber-500 transition-colors">
                                            <Icon className="w-4 h-4" />
                                            <span>{profileData[key]}</span>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Personal Info */}
                        <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-2xl p-6 border border-gray-800">
                            <h2 className="text-2xl font-bold mb-6">المعلومات الشخصية</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-gray-300">الاسم الكامل</label>
                                    <div className="relative">
                                        <BadgeCheck className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input type="text" name="fullName" value={profileData.fullName} onChange={handleInputChange}
                                            className="w-full bg-zinc-800 border border-gray-700 rounded-xl py-3 pr-12 pl-4 focus:outline-none focus:border-amber-500 transition-colors" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-gray-300">الاسم الفني / التجاري</label>
                                    <div className="relative">
                                        <Briefcase className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input type="text" name="artisticName" value={profileData.artisticName || ''} onChange={handleInputChange}
                                            placeholder="الاسم الذي تُعرف به"
                                            className="w-full bg-zinc-800 border border-gray-700 rounded-xl py-3 pr-12 pl-4 focus:outline-none focus:border-amber-500 transition-colors" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-gray-300">البريد الإلكتروني</label>
                                    <div className="relative">
                                        <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input type="email" name="email" value={profileData.email} onChange={handleInputChange}
                                            className="w-full bg-zinc-800 border border-gray-700 rounded-xl py-3 pr-12 pl-4 focus:outline-none focus:border-amber-500 transition-colors" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold mb-2 text-gray-300">رقم الهاتف</label>
                                        <div className="relative">
                                            <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input type="tel" name="phoneNumber" value={profileData.phoneNumber} onChange={handleInputChange}
                                                className="w-full bg-zinc-800 border border-gray-700 rounded-xl py-3 pr-12 pl-4 focus:outline-none focus:border-amber-500 transition-colors" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-2 text-gray-300">الموقع</label>
                                        <div className="relative">
                                            <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input type="text" name="location" value={profileData.location} onChange={handleInputChange}
                                                className="w-full bg-zinc-800 border border-gray-700 rounded-xl py-3 pr-12 pl-4 focus:outline-none focus:border-amber-500 transition-colors" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Professional Info */}
                        <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-2xl p-6 border border-gray-800">
                            <h2 className="text-2xl font-bold mb-6">المعلومات المهنية</h2>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold mb-2 text-gray-300">التخصص</label>
                                        <div className="relative">
                                            <Briefcase className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input type="text" name="specialty" value={profileData.specialty} onChange={handleInputChange}
                                                className="w-full bg-zinc-800 border border-gray-700 rounded-xl py-3 pr-12 pl-4 focus:outline-none focus:border-amber-500 transition-colors" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-2 text-gray-300">سنوات الخبرة</label>
                                        <input type="text" name="experience"
                                            value={profileData.experience > 0 ? `${profileData.experience} ${profileData.experience === 1 ? 'سنة' : 'سنوات'}` : ''}
                                            onChange={e => {
                                                const num = parseInt(e.target.value.replace(/[^\d]/g, ''), 10) || 0;
                                                setProfileData({ ...profileData, experience: num });
                                            }}
                                            placeholder="عدد سنوات الخبرة"
                                            className="w-full text-right bg-zinc-800 border border-gray-700 rounded-xl py-3 px-4 focus:outline-none focus:border-amber-500 transition-colors" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-gray-300">السيرة الذاتية</label>
                                    <div className="relative">
                                        <FileText className="absolute right-4 top-4 w-5 h-5 text-gray-400" />
                                        <textarea name="bio" value={profileData.bio} onChange={handleInputChange} rows="4"
                                            className="w-full bg-zinc-800 border border-gray-700 rounded-xl py-3 pr-12 pl-4 focus:outline-none focus:border-amber-500 transition-colors" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Social Media */}
                        <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-2xl p-6 border border-gray-800">
                            <h2 className="text-2xl font-bold mb-6">وسائل التواصل الاجتماعي</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-gray-300">الموقع الإلكتروني</label>
                                    <div className="relative">
                                        <Globe className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input type="text" name="website" value={profileData.website} onChange={handleInputChange}
                                            className="w-full bg-zinc-800 border border-gray-700 rounded-xl py-3 pr-12 pl-4 focus:outline-none focus:border-amber-500 transition-colors" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {[
                                        { icon: Instagram, name: 'instagram', label: 'Instagram' },
                                        { icon: Facebook,  name: 'facebook',  label: 'Facebook'  },
                                        { icon: Twitter,   name: 'twitter',   label: 'Twitter'   },
                                    ].map(({ icon: Icon, name, label }) => (
                                        <div key={name}>
                                            <label className="block text-sm font-semibold mb-2 text-gray-300">{label}</label>
                                            <div className="relative">
                                                <Icon className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <input type="text" name={name} value={profileData[name]} onChange={handleInputChange}
                                                    className="w-full bg-zinc-800 border border-gray-700 rounded-xl py-3 pr-12 pl-4 focus:outline-none focus:border-amber-500 transition-colors" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Specialties */}
                        <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-2xl p-6 border border-gray-800">
                            <h2 className="text-2xl font-bold mb-2">التخصصات</h2>
                            <p className="text-gray-400 text-sm mb-4">اختر كل مجالات تخصصك</p>
                            <div className="flex flex-wrap gap-2">
                                {SPECIALTIES.map(type => {
                                    const selected = (profileData.artTypes || []).includes(type);
                                    return (
                                        <button key={type} type="button" onClick={() => handleToggleItem('artTypes', type)}
                                            className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                                                selected ? 'bg-amber-500 border-amber-500 text-white'
                                                         : 'bg-zinc-800 border-gray-700 text-gray-300 hover:border-amber-500 hover:text-amber-400'
                                            }`}>
                                            {type}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Services */}
                        <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-2xl p-6 border border-gray-800">
                            <h2 className="text-2xl font-bold mb-2">الخدمات المقدَّمة</h2>
                            <p className="text-gray-400 text-sm mb-4">اختر الخدمات التي تقدمها للعملاء</p>
                            <div className="flex flex-wrap gap-2">
                                {SERVICES.map(service => {
                                    const selected = (profileData.services || []).includes(service);
                                    return (
                                        <button key={service} type="button" onClick={() => handleToggleItem('services', service)}
                                            className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                                                selected ? 'bg-amber-500 border-amber-500 text-white'
                                                         : 'bg-zinc-800 border-gray-700 text-gray-300 hover:border-amber-500 hover:text-amber-400'
                                            }`}>
                                            {service}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Save */}
                        <button onClick={handleSave}
                            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-600 text-white py-4 rounded-xl font-bold hover:from-amber-600 hover:to-yellow-700 transition-all transform hover:scale-105">
                            <Save className="w-5 h-5" />
                            حفظ التغييرات
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CoachProfile;