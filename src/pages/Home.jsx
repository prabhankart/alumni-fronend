import { useEffect, useState } from "react";
import API from "../api";
import StatTile from "../components/StatTile";

export default function Home() {
  const [stats, setStats] = useState({ totalMentors: 0, topAreas: [] });

  useEffect(() => {
    API.get("/api/mentors/stats")
      .then(res => setStats({
        totalMentors: res.data?.totalMentors ?? 0,
        topAreas: Array.isArray(res.data?.topAreas) ? res.data.topAreas : []
      }))
      .catch(()=> setStats({ totalMentors: 0, topAreas: [] }));
  }, []);

  return (
    <div className="container py-6">
      <div className="grid sm:grid-cols-3 gap-4">
        <StatTile label="Mentors" value={stats.totalMentors} />
        <StatTile label="Top Expertise" value={(stats.topAreas || []).slice(0,3).map(x=>x._id || x).join(", ") || "—"} />
        <StatTile label="Status" value="Live" />
      </div>
    </div>
  );
}
