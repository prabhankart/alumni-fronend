import { Link, NavLink } from "react-router-dom";

const linkCls = ({ isActive }) =>
  `px-3 py-2 rounded-xl font-medium transition ${
    isActive ? "bg-sky-600 text-white" : "hover:bg-slate-800 text-slate-200"
  }`;

export default function Navbar() {
  return (
    <header className="border-b border-slate-800 sticky top-0 z-50 bg-slate-900/80 backdrop-blur">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="text-xl font-bold text-sky-400">Infinity Alumni</Link>
        <nav className="flex gap-2">
          <NavLink to="/" className={linkCls}>Home</NavLink>
          <NavLink to="/alumni" className={linkCls}>Alumni</NavLink>
          <NavLink to="/events" className={linkCls}>Events</NavLink>
          <NavLink to="/mentorship" className={linkCls}>Mentorship</NavLink>
          <NavLink to="/fundraising" className={linkCls}>Fundraising</NavLink>
        </nav>
      </div>
    </header>
  );
}
