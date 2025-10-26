import { Home, BookOpen, LayoutDashboard, LogOut, LogIn } from 'lucide-react';

export default function Navbar({ user, onSignIn, onSignOut, view, onNavigate }) {
  return (
    <header className="sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-neutral-950/60 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-md bg-white text-neutral-900 font-bold grid place-items-center">V</div>
          <div className="font-semibold tracking-tight">VibeLearn</div>
        </div>
        <nav className="hidden md:flex items-center gap-2">
          <NavBtn active={view==='home'} onClick={() => onNavigate('home')} icon={<Home size={16} />}>Home</NavBtn>
          <NavBtn active={view==='catalog'} onClick={() => onNavigate('catalog')} icon={<BookOpen size={16} />}>Catalog</NavBtn>
          <NavBtn active={view==='dashboard'} onClick={() => onNavigate('dashboard')} icon={<LayoutDashboard size={16} />}>Dashboard</NavBtn>
        </nav>
        <div className="flex items-center gap-2">
          {!user ? (
            <button onClick={onSignIn} className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-white/20 hover:border-white/40 transition text-sm">
              <LogIn size={16} /> Sign in
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <div className="text-sm text-neutral-300 hidden sm:block">Hi, {user.name}</div>
              <button onClick={onSignOut} className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-white/20 hover:border-white/40 transition text-sm">
                <LogOut size={16} /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="md:hidden border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-2 flex items-center gap-2">
          <MobileBtn active={view==='home'} onClick={() => onNavigate('home')}>Home</MobileBtn>
          <MobileBtn active={view==='catalog'} onClick={() => onNavigate('catalog')}>Catalog</MobileBtn>
          <MobileBtn active={view==='dashboard'} onClick={() => onNavigate('dashboard')}>Dashboard</MobileBtn>
        </div>
      </div>
    </header>
  );
}

function NavBtn({ active, onClick, icon, children }) {
  return (
    <button onClick={onClick} className={`inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm transition ${active ? 'bg-white text-neutral-900' : 'border border-white/20 hover:border-white/40'}`}>
      {icon} {children}
    </button>
  );
}

function MobileBtn({ active, onClick, children }) {
  return (
    <button onClick={onClick} className={`px-3 py-2 rounded-md text-sm ${active ? 'bg-white text-neutral-900' : 'border border-white/20'}`}>{children}</button>
  );
}
