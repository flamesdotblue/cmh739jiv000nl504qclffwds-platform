import Spline from '@splinetool/react-spline';

export default function Hero({ onExplore }) {
  return (
    <section className="relative w-full h-[70vh] md:h-[78vh]">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/zhZFnwyOYLgqlLWk/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/10 via-neutral-950/40 to-neutral-950 pointer-events-none" />
      <div className="relative h-full max-w-7xl mx-auto px-6 flex items-center">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">Learn faster with interactive courses</h1>
          <p className="mt-4 text-neutral-300 text-lg md:text-xl">A seamless grid of knowledge. Minimalist, modern, and hands-on—designed to help you master tech skills.</p>
          <div className="mt-8 flex items-center gap-4">
            <button onClick={onExplore} className="px-5 py-3 rounded-lg bg-white text-neutral-900 font-medium hover:bg-neutral-200 transition">Explore Courses</button>
            <a href="#catalog" onClick={(e)=>{ e.preventDefault(); onExplore?.(); }} className="px-5 py-3 rounded-lg border border-white/20 hover:border-white/40 transition">Browse Catalog</a>
          </div>
        </div>
      </div>
    </section>
  );
}
