import { useEffect, useState } from "react";
import API from "../api";
import Card from "../components/Card";

export default function Events() {
  const [list, setList] = useState([]);                 // always an array
  const [form, setForm] = useState({ title:"", date:"", mode:"Online", location:"", description:"" });
  const [busy, setBusy] = useState(false);

  const load = () =>
    API.get("/api/events")
      .then(res => setList(Array.isArray(res.data) ? res.data : (res.data?.data || [])))
      .catch(()=> setList([]));

  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.date) return alert("Title & Date required");
    setBusy(true);
    try {
      await API.post("/api/events", form);
      await load();                                      // pull fresh list
      setForm({ title:"", date:"", mode:"Online", location:"", description:"" });
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

      <div className="grid-cards">
        {list.map(e => (
          <Card key={e._id || e.id} title={e.title} subtitle={`${(e.date||"").slice(0,10)} • ${e.mode || ""}`}>
            <div className="text-sm text-slate-300">{e.location}</div>
            <p className="mt-1 text-sm">{e.description}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
