import { useEffect, useState } from "react";
import API from "../api";
import Card from "../components/Card";

export default function Mentorship() {
  const [mentors, setMentors] = useState([]);           // always an array
  const [form, setForm] = useState({ name:"", email:"", mentorId:"", message:"" });

  useEffect(() => {
    API.get("/api/mentors")
      .then(res => setMentors(Array.isArray(res.data) ? res.data : (res.data?.data || [])))
      .catch(()=> setMentors([]));
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.mentorId) return alert("Fill all required fields");
    try {
      await API.post("/api/mentors/apply", form);
      alert("Applied successfully!");
      setForm({ name:"", email:"", mentorId:"", message:"" });
    } catch (err) {
      alert(err?.response?.data?.error || "Invalid details");
    }
  };

  return (
    <div className="container py-6 grid lg:grid-cols-2 gap-6">
      <div className="grid-cards">
        {mentors.map(m => (
          <Card key={m._id || m.id} title={m.name} subtitle={`Slots: ${m.slots ?? 0}`}>
            <div className="flex flex-wrap gap-2 mt-2">
              {(m.expertise || []).map((x,i)=><span key={i} className="px-2 py-1 text-xs rounded-full bg-sky-900/40 border border-sky-700">{x}</span>)}
            </div>
          </Card>
        ))}
      </div>

      <form onSubmit={submit} className="card grid gap-3">
        <h3 className="font-semibold text-lg">Apply for Mentorship</h3>
        <input className="input" placeholder="Your Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
        <input className="input" placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
        <select className="input" value={form.mentorId} onChange={e=>setForm({...form,mentorId:e.target.value})}>
          <option value="">Select Mentor</option>
          {mentors.map(m => <option key={m._id || m.id} value={m._id || m.id}>{m.name}</option>)}
        </select>
        <textarea className="input" placeholder="Message (optional)" value={form.message} onChange={e=>setForm({...form,message:e.target.value})}/>
        <button className="btn">Apply</button>
      </form>
    </div>
  );
}
