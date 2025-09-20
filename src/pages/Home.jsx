import { useEffect, useState } from "react";
import API from "../api";
import StatTile from "../components/StatTile";
import { Link } from "react-router-dom";

const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === "true";
const DEMO_STATS = { totalMentors: 2, topAreas: [{ _id: "Cloud" }, { _id: "DevOps" }, { _id: "ML" }] };

export default function Home() {
  const [stats, setStats] = useState({ totalMentors: 0, topAreas: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await API.get("/api/mentors/stats");
        const ok = {
          totalMentors: res.data?.totalMentors ?? 0,
          topAreas: Array.isArray(res.data?.topAreas) ? res.data.topAreas : [],
        };
        if (!mounted) return;
        if (ok.totalMentors === 0 && ok.topAreas.length === 0 && DEMO_MODE) setStats(DEMO_STATS);
        else setStats(ok);
      } catch {
        if (DEMO_MODE) setStats(DEMO_STATS);
        else setStats({ totalMentors: 0, topAreas: [] });
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const topText = (stats.topAreas || []).map(x => x._id || x).slice(0,3).join(", ") || "—";

  return (
    <div className="container py-6">
      {loading ? (
        <div className="grid sm:grid-cols-3 gap-4">
          {Array.from({length:3}).map((_,i)=>(
            <div key={i} className="card h-40 animate-pulse">
              <div className="h-8 w-24 bg-slate-700 rounded mb-2"></div>
              <div className="h-4 w-32 bg-slate-800 rounded"></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-3 gap-4">
            <StatTile label="Mentors" value={stats.totalMentors} />
            <StatTile label="Top Expertise" value={topText} big />
            <StatTile label="Status" value="Live" />
          </div>

          <div className="mt-8 flex gap-3">
            <Link to="/alumni" className="btn">Browse Alumni</Link>
            <Link to="/events" className="btn">Upcoming Events</Link>
            <Link to="/mentorship" className="btn">Find a Mentor</Link>
          </div>
        </>
      )}
    </div>
  );
}
