import { useEffect, useState } from "react";
import API from "../api";
import Card from "../components/Card";

const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === "true";
const DEMO_EVENTS = [
  { id: "d1", title: "Alumni Meet 2025",  date: "2025-12-10", mode: "Offline", location: "Campus Auditorium", description: "Annual alumni networking meet." },
  { id: "d2", title: "Mentorship Webinar",date: "2025-12-15", mode: "Online",  location: "Zoom",               description: "Career guidance by alumni mentors." },
  { id: "d3", title: "Tech Careers AMA",  date: "2026-01-10", mode: "Hybrid",  location: "Seminar Hall / Meet", description: "Open Q&A with senior alumni." }
];

function fmt(d) {
  try { return new Date(d).toISOString().slice(0,10); }
  catch { return d || ""; }
}

export default function Events() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ title:"", date:"", mode:"Online", location:"", description:"" });
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await API.get("/api/events");
      const arr = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      if (arr.length === 0 && DEMO_MODE) setList(DEMO_EVENTS);
      else setList(arr);
    } catch {
      setList(DEMO_MODE ? DEMO_EVENTS : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.date) return alert("Title & Date required");
    setBusy(true);
    try {
      await API.post("/api/events", form);
      await load();                                  // always refresh from server
      setForm({ title:"", date:"", mode:"Online", location:"", description:"" });
    } catch (err) {
      alert(err?.response?.data?.error || "Failed to save");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container py-6 grid lg:grid-cols-2 gap-6">
      <form onSubmit={submit} className="card grid gap-3">
        <h3 className="font-semibold text-lg">Create Event</h3>
        <input className="input" placeholder="Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/>
        <input className="input" type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/>
        <select className="input" value={form.mode} onChange={e=>setForm({...form,mode:e.target.value})}>
          <option>Online</option><option>Offline</option><option>Hybrid</option>
        </select>
        <input className="input" placeholder="Location" value={form.location} onChange={e=>setForm({...form,location:e.target.value})}/>
        <textarea className="input" placeholder="Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/>
        <button className="btn" disabled={busy}>{busy ? "Saving..." : "Save Event"}</button>
      </form>

      {loading ? (
        <div className="grid-cards">
          {Array.from({length:3}).map((_,i)=>(
            <div key={i} className="card h-36 animate-pulse">
              <div className="h-5 w-1/2 bg-slate-700 rounded mb-2"></div>
              <div className="h-4 w-1/3 bg-slate-800 rounded"></div>
              <div className="h-3 w-2/3 bg-slate-800 rounded mt-4"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid-cards">
          {list.map(e => (
            <Card key={e._id || e.id} title={e.title} subtitle={`${fmt(e.date)} • ${e.mode || ""}`}>
              <div className="text-sm text-slate-300">{e.location}</div>
              <p className="mt-1 text-sm">{e.description}</p>
            </Card>
          ))}
          {!list.length && (
            <div className="card">
              <div className="text-slate-300">No events yet. Add one with the form.</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

