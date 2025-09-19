import { useEffect, useState } from "react";
import api from "../api";
import Card from "../components/Card";

export default function Mentorship() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: "", skills: "", availability: "", contact: "" });

  async function load() {
    const res = await api.get("/api/mentors");
    setItems(res.data);
  }
  useEffect(() => { load(); }, []);

  async function signup(e) {
    e.preventDefault();
    try {
      const body = {
        name: form.name.trim(),
        skills: form.skills.split(",").map(s=>s.trim()).filter(Boolean),
        availability: form.availability.trim(),
        contact: form.contact.trim()
      };
      const res = await api.post("/api/mentors", body);
      setItems(prev => [...prev, res.data]);
      setForm({ name: "", skills: "", availability: "", contact: "" });
    } catch (e) {
      alert("Invalid details. Please check email and skills.");
    }
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold">Mentorship</h1>

      <form className="card mt-4 grid md:grid-cols-4 gap-3" onSubmit={signup}>
        <input className="input" placeholder="Your Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
        <input className="input" placeholder="Skills (comma separated)" value={form.skills} onChange={e=>setForm({...form, skills:e.target.value})} />
        <input className="input" placeholder="Availability (e.g., Weekends)" value={form.availability} onChange={e=>setForm({...form, availability:e.target.value})} />
        <input className="input" placeholder="Email" value={form.contact} onChange={e=>setForm({...form, contact:e.target.value})} />
        <button className="btn md:col-span-4" type="submit">Become a Mentor</button>
      </form>

      <div className="grid-cards mt-6">
        {items.map(m => (
          <Card key={m.id} title={m.name} subtitle={m.availability} right={<span className="text-sky-300 text-sm">{m.sessions} sessions</span>}>
            <div className="text-sm text-slate-300">{m.contact}</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {m.skills?.map((s, i) => <span key={i} className="text-xs bg-slate-700 px-2 py-1 rounded-md">{s}</span>)}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
