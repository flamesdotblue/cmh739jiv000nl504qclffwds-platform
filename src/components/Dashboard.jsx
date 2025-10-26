import { useMemo, useState } from 'react';
import { Play, ChevronRight } from 'lucide-react';

export default function Dashboard({ user, enrollments, courses, onProgress }) {
  const [activeCourseId, setActiveCourseId] = useState(enrollments[0]?.courseId || null);

  const enrolled = useMemo(() => {
    const map = new Map(courses.map(c => [c.id, c]));
    return enrollments.map(e => ({ ...e, course: map.get(e.courseId) })).filter(x => !!x.course);
  }, [enrollments, courses]);

  const active = enrolled.find(e => e.courseId === activeCourseId) || enrolled[0];

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">Your Dashboard</h2>
          <p className="text-neutral-400">Welcome{user ? `, ${user.name}` : ''}. Continue your learning journey.</p>
        </div>
      </div>

      {enrolled.length === 0 ? (
        <div className="border border-white/10 rounded-2xl p-8 text-neutral-300">You have no enrolled courses yet. Enroll from the catalog to get started.</div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {active && (
              <div className="rounded-2xl border border-white/10 overflow-hidden">
                <div className="aspect-video bg-neutral-800/40 flex items-center justify-center">
                  <button onClick={() => onProgress(active.courseId, 10)} className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-white text-neutral-900 hover:bg-neutral-200 transition">
                    <Play size={16} /> Simulate Lesson Progress
                  </button>
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-semibold">{active.course.title}</h3>
                  <p className="text-neutral-300 mt-2">{active.course.description}</p>
                  <div className="mt-4">
                    <Progress value={active.progress} />
                  </div>
                  <div className="mt-4 text-sm text-neutral-400">{active.lessonsCompleted} of {active.course.lessons.length} lessons completed</div>
                </div>
              </div>
            )}
          </div>
          <div className="space-y-3">
            {enrolled.map(e => (
              <button key={e.courseId} onClick={() => setActiveCourseId(e.courseId)} className={`w-full text-left p-4 rounded-xl border transition ${active?.courseId === e.courseId ? 'border-white/40 bg-white/5' : 'border-white/10 hover:border-white/30'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{e.course.title}</div>
                    <div className="text-xs text-neutral-400">{e.progress}% complete</div>
                  </div>
                  <ChevronRight className="text-neutral-400" size={18} />
                </div>
                <div className="mt-3"><Progress value={e.progress} compact /></div>
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function Progress({ value, compact = false }) {
  return (
    <div className={`w-full ${compact ? 'h-2' : 'h-3'} bg-white/10 rounded-full overflow-hidden`}>
      <div className="bg-white h-full" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  );
}
