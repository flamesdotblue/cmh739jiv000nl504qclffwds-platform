const delay = (ms = 250) => new Promise(r => setTimeout(r, ms));
const DB_KEY = 'vibelearn_db_v1';

function loadDB() {
  const raw = localStorage.getItem(DB_KEY);
  if (raw) return JSON.parse(raw);
  const initial = {
    users: [],
    session: null, // { userId }
    courses: seedCourses(),
    enrollments: [], // { userId, courseId, progress, lessonsCompleted }
  };
  localStorage.setItem(DB_KEY, JSON.stringify(initial));
  return initial;
}

function saveDB(db) { localStorage.setItem(DB_KEY, JSON.stringify(db)); }

function seedCourses() {
  return [
    {
      id: 'react-foundations',
      title: 'React Foundations',
      description: 'Master components, state, and hooks through hands-on projects.',
      level: 'beginner',
      rating: 4.8,
      free: true,
      price: 0,
      tags: ['react', 'frontend', 'javascript'],
      lessons: ['Intro', 'JSX & Props', 'State & Effects', 'Lists & Keys', 'Hooks Overview'],
    },
    {
      id: 'tailwind-mastery',
      title: 'Tailwind CSS Mastery',
      description: 'Build responsive UIs rapidly with utility-first patterns.',
      level: 'intermediate',
      rating: 4.7,
      free: true,
      price: 0,
      tags: ['css', 'design', 'tailwind'],
      lessons: ['Setup', 'Layout', 'Typography', 'Components', 'Dark Mode'],
    },
    {
      id: 'fullstack-node',
      title: 'Full-Stack with Node & Postgres',
      description: 'Design robust APIs with Node.js and PostgreSQL.',
      level: 'advanced',
      rating: 4.6,
      free: false,
      price: 79,
      tags: ['node', 'api', 'database'],
      lessons: ['REST Design', 'Database Modeling', 'Auth', 'Caching', 'Deployments'],
    },
  ];
}

export const api = {
  async bootstrap() {
    loadDB();
    await delay(150);
  },

  async getCurrentUser() {
    await delay(100);
    const db = loadDB();
    if (!db.session) return null;
    const u = db.users.find(x => x.id === db.session.userId);
    if (!u) return null;
    return { id: u.id, name: u.name, email: u.email };
  },

  async signInOrUp({ email, name }) {
    await delay();
    const db = loadDB();
    const lower = email.toLowerCase();
    let u = db.users.find(x => x.email.toLowerCase() === lower);
    if (!u) {
      u = { id: crypto.randomUUID(), name: name || email.split('@')[0], email };
      db.users.push(u);
    }
    db.session = { userId: u.id };
    saveDB(db);
    return { id: u.id, name: u.name, email: u.email };
  },

  async signOut() {
    await delay(150);
    const db = loadDB();
    db.session = null;
    saveDB(db);
  },

  async getCourses() {
    await delay(120);
    const db = loadDB();
    return db.courses;
  },

  async enroll(courseId) {
    await delay(180);
    const db = loadDB();
    if (!db.session) throw new Error('Not authenticated');
    const userId = db.session.userId;
    const exists = db.enrollments.find(e => e.userId === userId && e.courseId === courseId);
    if (exists) return exists;
    const course = db.courses.find(c => c.id === courseId);
    if (!course) throw new Error('Course not found');
    const enrollment = { userId, courseId, progress: 0, lessonsCompleted: 0 };
    db.enrollments.push(enrollment);
    saveDB(db);
    return enrollment;
  },

  async getEnrollments() {
    await delay(120);
    const db = loadDB();
    if (!db.session) return [];
    const userId = db.session.userId;
    return db.enrollments.filter(e => e.userId === userId);
  },

  async updateProgress(courseId, delta = 10) {
    await delay(120);
    const db = loadDB();
    if (!db.session) throw new Error('Not authenticated');
    const userId = db.session.userId;
    const e = db.enrollments.find(x => x.userId === userId && x.courseId === courseId);
    if (!e) throw new Error('Not enrolled');
    const course = db.courses.find(c => c.id === courseId);
    const perLesson = Math.floor(100 / (course.lessons.length || 5)) || 20;
    e.progress = Math.min(100, e.progress + (delta || perLesson));
    e.lessonsCompleted = Math.min(course.lessons.length, Math.round((e.progress / 100) * course.lessons.length));
    saveDB(db);
    return e;
  }
};
