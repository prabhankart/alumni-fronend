import { useEffect, useState } from "react";
import api from "../api";
import StatTile from "../components/StatTile";

export default function Home() {
  const [stats, setStats] = useState({ alumniCount: 0, eventCount: 0, mentorCount: 0, topMentors: [] });

  useEffect(() => {
    api.get("/api/mentors/stats").then(res => setStats(res.data)).catch(()=>{});
  }, []);

  return (
    <div className="container py-10">
      <section className="text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold">
          Centralized Alumni Management & Engagement
        </h1>
        <p className="mt-3 text-slate-300">
          Connect alumni, power mentorship, boost placements & fundraising — all in one place.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <a href="/alumni" className="btn">Explore Alumni</a>
          <a href="/events" className="btn bg-slate-700 hover:bg-slate-600">View Events</a>
        </div>
      </section>

      <section className="mt-10 grid sm:grid-cols-3 gap-4">
        <StatTile label="Alumni" value={stats.alumniCount} />
        <StatTile label="Mentors" value={stats.mentorCount} />
        <StatTile label="Upcoming Events" value={stats.eventCount} />
      </section>

      {stats.topMentors?.length > 0 && (
        <section className="mt-10">
          <h2 className="text-2xl font-bold mb-4">Top Mentors</h2>
          <div className="grid-cards">
            {stats.topMentors.map(m => (
              <div key={m.id} className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{m.name}</div>
                    <div className="text-slate-400 text-sm">{m.skills?.join(", ")}</div>
                  </div>
                  <div className="text-sm bg-sky-600/20 text-sky-300 px-3 py-1 rounded-full">
                    {m.sessions} sessions
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
