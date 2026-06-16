import { useState } from 'react';
import { BookOpen, Award, Tag } from 'lucide-react';
import { COURSES } from '../../../utils/mockData';

const FALLBACK = 'https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg?auto=compress&cs=tinysrgb&w=600';

const levelStyle = {
    'مبتدئ': 'bg-green-500/15 text-green-400',
    'متوسط': 'bg-blue-500/15 text-blue-400',
    'متقدم': 'bg-purple-500/15 text-purple-400',
};

const resolveImg = img => {
    if (!img) return FALLBACK;
    if (img.startsWith('http')) return img;
    return `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${img}`;
};

const NewCourses = ({ onNavigate }) => {
    const [courses] = useState(COURSES);

    return (
        <section className="py-20 bg-[#111113]">
            <div className="container mx-auto px-6">
                <div className="flex items-end justify-between mb-10">
                    <div>
                        <h2 className="text-3xl font-extrabold text-white mb-1">
                            دورات <span className="text-amber-400">تدريبية جديدة</span>
                        </h2>
                        <p className="text-sm text-zinc-500">اكتشف آخر البرامج التدريبية المتاحة</p>
                    </div>
                    <button onClick={() => onNavigate?.('courses')} className="text-amber-500 text-sm font-semibold hover:text-amber-400 transition">
                        عرض المزيد ←
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {courses.map(course => {
                        const isFree = !course.price || course.price === 0;
                        return (
                            <div
                                key={course._id}
                                className="group bg-[#18181B] border border-[#2A2A30] rounded-2xl overflow-hidden hover:border-amber-500 hover:-translate-y-1 transition-all cursor-pointer"
                                onClick={() => onNavigate?.('course-detail', course._id)}
                            >
                                <div className="relative h-44 overflow-hidden">
                                    <img
                                        src={resolveImg(course.image)}
                                        alt={course.title}
                                        onError={e => { e.target.src = FALLBACK; }}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    {course.hasCertificate && (
                                        <div className="absolute top-3 right-3 bg-amber-500/90 text-black text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                                            <Award className="w-3 h-3" /> شهادة معتمدة
                                        </div>
                                    )}
                                </div>

                                <div className="p-4">
                                    <div className="flex gap-2 flex-wrap mb-2">
                                        <span className="bg-zinc-700/40 text-zinc-300 text-[10px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1">
                                            <Tag className="w-2.5 h-2.5" />{course.category}
                                        </span>
                                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${levelStyle[course.level] || 'bg-zinc-700/40 text-zinc-400'}`}>
                                            {course.level}
                                        </span>
                                    </div>

                                    <h3 className="text-sm font-bold text-white leading-snug mb-1">{course.title}</h3>
                                    <p className="text-xs text-zinc-500 mb-2">{course.coachName}</p>

                                    {course.modules?.length > 0 && (
                                        <p className="text-[11px] text-zinc-600 mb-3 flex items-center gap-1">
                                            <BookOpen className="w-3 h-3" />{course.modules.length} وحدة تعليمية
                                        </p>
                                    )}

                                    {isFree
                                        ? <span className="text-lg font-black text-green-400">مجانية</span>
                                        : <span className="text-lg font-black text-amber-400">{course.price?.toLocaleString('ar-DZ')} <span className="text-xs text-zinc-500 font-normal">دج</span></span>
                                    }
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default NewCourses;