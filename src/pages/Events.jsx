import { useEffect, useState } from "react";
import api from "../api";
import Card from "../components/Card";

export default function Events() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ title: "", date: "", venue: "", description: "" });

  async function load() {
    const res = await api.get("/api/events");
    setItems(res.data);
  }

  useEffect(() => { load(); }, []);

  async function create(e) {
    e.preventDefault();
    if (!form.title || !form.date) return alert("Please enter title & date");
    try {
      const res = await api.post("/api/events", form);
      setItems(prev => [...prev, res.data]);
      setForm({ title: "", date: "", venue: "", description: "" });
    } catch {
      alert("Failed to create event");
    }
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold">Events</h1>

      <form className="card mt-4 grid md:grid-cols-4 gap-3" onSubmit={create}>
        <input className="input" placeholder="Title" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} />
        <input className="input" type="date" value={form.date} onChange={e=>setForm({...form, date:e.target.value})} />
        <input className="input" placeholder="Venue" value={form.venue} onChange={e=>setForm({...form, venue:e.target.value})} />
        <button className="btn" type="submit">Create Event</button>
        <textarea className="input md:col-span-4" rows="3" placeholder="Description" value={form.description} onChange={e=>setForm({...form, description:e.target.value})} />
      </form>

      <div className="grid-cards mt-6">
        {items.map(e => (
          <Card key={e.id} title={e.title} subtitle={e.venue || "—"} right={<span className="text-slate-400 text-sm">{e.date}</span>}>
            <p className="text-slate-300 text-sm">{e.description}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
