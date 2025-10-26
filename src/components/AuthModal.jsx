import { useEffect, useState } from 'react';
import { api } from '../services/api';

export default function AuthModal({ open, onClose, onAuthed, mode = 'signin' }) {
  const [authMode, setAuthMode] = useState(mode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { setAuthMode(mode); setError(''); }, [mode, open]);

  const reset = () => { setName(''); setEmail(''); setPassword(''); setError(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (authMode === 'signup') {
        const u = await api.signUp({ name, email, password });
        onAuthed?.(u);
        reset();
      } else {
        const u = await api.signIn({ email, password });
        onAuthed?.(u);
        reset();
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-neutral-900 border border-white/10 rounded-2xl p-6 w-[90vw] max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">{authMode === 'signup' ? 'Create account' : 'Sign in'}</h3>
          <button onClick={onClose} className="text-neutral-400 hover:text-white">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {authMode === 'signup' && (
            <div>
              <label className="block text-sm mb-1">Name</label>
              <input value={name} onChange={(e)=>setName(e.target.value)} className="w-full px-3 py-2 rounded-md bg-neutral-800 border border-white/10 focus:outline-none focus:border-white/30" required />
            </div>
          )}
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full px-3 py-2 rounded-md bg-neutral-800 border border-white/10 focus:outline-none focus:border-white/30" required />
          </div>
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} className="w-full px-3 py-2 rounded-md bg-neutral-800 border border-white/10 focus:outline-none focus:border-white/30" required />
          </div>
          {error && <div className="text-red-400 text-sm">{error}</div>}
          <button type="submit" disabled={loading} className="w-full px-4 py-2 rounded-md bg-white text-neutral-900 font-medium hover:bg-neutral-200 transition disabled:opacity-60">
            {loading ? 'Please wait…' : (authMode === 'signup' ? 'Create account' : 'Sign in')}
          </button>
        </form>
        <div className="mt-4 text-sm text-neutral-400">
          {authMode === 'signup' ? (
            <>Already have an account? <button className="underline" onClick={() => setAuthMode('signin')}>Sign in</button></>
          ) : (
            <>New here? <button className="underline" onClick={() => setAuthMode('signup')}>Create one</button></>
          )}
        </div>
      </div>
    </div>
  );
}
