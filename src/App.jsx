import { useEffect, useMemo, useState } from 'react';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import CourseCatalog from './components/CourseCatalog.jsx';
import Dashboard from './components/Dashboard.jsx';
import { api } from './services/api.js';

export default function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('home'); // 'home' | 'catalog' | 'dashboard'
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      await api.bootstrap();
      const current = await api.getCurrentUser();
      setUser(current);
      const list = await api.getCourses();
      setCourses(list);
      if (current) {
        const ens = await api.getEnrollments();
        setEnrollments(ens);
      }
      setLoading(false);
    }
    init();
  }, []);

  useEffect(() => {
    async function reloadEnrollments() {
      if (!user) { setEnrollments([]); return; }
      const ens = await api.getEnrollments();
      setEnrollments(ens);
    }
    reloadEnrollments();
  }, [user]);

  const enrolledIds = useMemo(() => new Set(enrollments.map(e => e.courseId)), [enrollments]);

  async function handleSignIn() {
    const email = window.prompt('Enter your email to sign in:');
    if (!email) return;
    const name = window.prompt('Enter your name (optional):') || 'Learner';
    const userData = await api.signInOrUp({ email, name });
    setUser(userData);
  }

  async function handleSignOut() {
    await api.signOut();
    setUser(null);
    setView('home');
  }

  async function handleEnroll(courseId) {
    if (!user) { await handleSignIn(); if (!user) return; }
    await api.enroll(courseId);
    const ens = await api.getEnrollments();
    setEnrollments(ens);
    setView('dashboard');
  }

  async function handleProgress(courseId, delta = 10) {
    await api.updateProgress(courseId, delta);
    const ens = await api.getEnrollments();
    setEnrollments(ens);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-white">
        <div className="animate-pulse">Loading…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <Navbar user={user} onSignIn={handleSignIn} onSignOut={handleSignOut} view={view} onNavigate={setView} />

      {view === 'home' && (
        <>
          <Hero onExplore={() => setView('catalog')} />
          <section className="max-w-7xl mx-auto px-6 py-16">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-3">Learn modern skills</h2>
            <p className="text-neutral-300 max-w-3xl">Build practical expertise with interactive, minimalist courses across frontend, backend, and full‑stack. Track progress locally and pick up where you left off.</p>
          </section>
        </>
      )}

      {view === 'catalog' && (
        <CourseCatalog courses={courses} enrolledIds={enrolledIds} onEnroll={handleEnroll} />
      )}

      {view === 'dashboard' && (
        <Dashboard user={user} enrollments={enrollments} courses={courses} onProgress={handleProgress} />
      )}

      <footer className="border-t border-white/10 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-neutral-400">
          <div>© {new Date().getFullYear()} VibeLearn</div>
          <div className="text-sm">Built with React, Tailwind, and Spline</div>
        </div>
      </footer>
    </div>
  );
}
