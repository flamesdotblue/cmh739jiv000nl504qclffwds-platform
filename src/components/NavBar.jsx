import { useState } from 'react';
import { BookOpen, User as UserIcon, LogOut, Home } from 'lucide-react';
import AuthModal from './AuthModal';
import { api } from '../services/api';

export default function NavBar({ user, onUserChange, view, onNavigate }) {
  const [authOpen, setAuthOpen] = useState(false);
  const [mode, setMode] = useState('signin');

  const handleSignOut = async () => {
    await api.signOut();
    onUserChange(null);
    onNavigate('home');
  };

  return (
    <header className="sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-neutral-950/50 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-md bg-white flex items-center justify-center text-neutral-900 font-bold">L</div>
          <div className="font-semibold tracking-tight">Learnify</div>
        </div>
        <nav className="hidden md:flex items-center gap-1">
          <NavItem label="Home" active={view==='home'} onClick={() => onNavigate('home')} icon={Home} />
          <NavItem label="Catalog" active={view==='catalog'} onClick={() => onNavigate('catalog')} icon={BookOpen} />
          <NavItem label="Dashboard" active={view==='dashboard'} onClick={() => onNavigate('dashboard')} icon={UserIcon} />
        </nav>
        <div className="flex items-center gap-3">
          {!user ? (
            <>
              <button onClick={() => { setMode('signin'); setAuthOpen(true); }} className="px-3 py-2 rounded-md border border-white/20 hover:border-white/40 transition text-sm">Sign in</button>
              <button onClick={() => { setMode('signup'); setAuthOpen(true); }} className="px-3 py-2 rounded-md bg-white text-neutral-900 hover:bg-neutral-200 transition text-sm">Create account</button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <div className="text-sm text-neutral-300">Hi, {user.name}</div>
              <button onClick={handleSignOut} className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-white/20 hover:border-white/40 transition text-sm">
                <LogOut size={16} /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="md:hidden border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-2 flex items-center gap-2">
          <button onClick={() => onNavigate('home')} className={`px-3 py-2 rounded-md text-sm ${view==='home' ? 'bg-white text-neutral-900' : 'border border-white/20'}`}>Home</button>
          <button onClick={() => onNavigate('catalog')} className={`px-3 py-2 rounded-md text-sm ${view==='catalog' ? 'bg-white text-neutral-900' : 'border border-white/20'}`}>Catalog</button>
          <button onClick={() => onNavigate('dashboard')} className={`px-3 py-2 rounded-md text-sm ${view==='dashboard' ? 'bg-white text-neutral-900' : 'border border-white/20'}`}>Dashboard</button>
        </div>
      </div>

      <AuthModal
        open={authOpen}
        mode={mode}
        onClose={() => setAuthOpen(false)}
        onAuthed={(u) => { onUserChange(u); setAuthOpen(false); }}
      />
    </header>
  );
}

function NavItem({ label, active, onClick, icon: Icon }) {
  return (
    <button onClick={onClick} className={`inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm transition ${active ? 'bg-white text-neutral-900' : 'border border-white/20 hover:border-white/40'}`}>
      {Icon && <Icon size={16} />} {label}
    </button>
  );
}
