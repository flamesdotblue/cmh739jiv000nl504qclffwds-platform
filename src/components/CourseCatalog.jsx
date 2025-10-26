import { useMemo, useState } from 'react';
import { BookOpen, Search } from 'lucide-react';

export default function CourseCatalog({ courses, enrolledIds, onEnroll }) {
  const [q, setQ] = useState('');
  const [level, setLevel] = useState('all');

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return courses.filter(c => {
      const matchQ = !query || c.title.toLowerCase().includes(query) || c.description.toLowerCase().includes(query) || c.tags.join(' ').toLowerCase().includes(query);
      const matchL = level === 'all' || c.level === level;
      return matchQ && matchL;
    });
  }, [courses, q, level]);

  return (
    <section id="catalog" className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">Course Catalog</h2>
          <p className="text-neutral-400">Curated, modern courses to level up your skills.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch gap-3 w-full md:w-auto">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search courses" className="w-full pl-9 pr-3 py-2 rounded-md bg-neutral-900 border border-white/10 focus:outline-none focus:border-white/30" />
          </div>
          <select value={level} onChange={(e)=>setLevel(e.target.value)} className="px-3 py-2 rounded-md bg-neutral-900 border border-white/10 focus:outline-none">
            <option value="all">All levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(c => (
          <div key={c.id} className="group rounded-2xl border border-white/10 overflow-hidden bg-gradient-to-b from-white/5 to-transparent">
            <div className="h-36 bg-neutral-800/40 flex items-center justify-center">
              <BookOpen className="text-white/60" size={32} />
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">{c.title}</h3>
                <span className="text-xs px-2 py-1 rounded-full border border-white/10 text-neutral-300 capitalize">{c.level}</span>
              </div>
              <p className="mt-2 text-sm text-neutral-300 line-clamp-3">{c.description}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {c.tags.map(t => (
                  <span key={t} className="text-xs px-2 py-1 rounded-md border border-white/10 text-neutral-300">{t}</span>
                ))}
              </div>
              <div className="mt-5 flex items-center justify-between">
                <div className="text-white font-semibold">{c.free ? 'Free' : `$${c.price}`}</div>
                {enrolledIds.has(c.id) ? (
                  <button disabled className="px-3 py-2 rounded-md bg-green-500/20 text-green-300 text-sm">Enrolled</button>
                ) : (
                  <button onClick={() => onEnroll(c.id)} className="px-3 py-2 rounded-md bg-white text-neutral-900 text-sm hover:bg-neutral-200 transition">Enroll</button>
                )}
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-neutral-400">No courses match your filters.</div>
        )}
      </div>
    </section>
  );
}
