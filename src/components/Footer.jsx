export default function Footer() {
  return (
    <footer className="border-t border-slate-800 mt-10">
      <div className="container py-6 text-sm text-slate-400 flex items-center justify-between">
        <p>© {new Date().getFullYear()} Infinity — Centralized Alumni Platform</p>
        <p>Built for SIH 2025</p>
      </div>
    </footer>
  );
}
