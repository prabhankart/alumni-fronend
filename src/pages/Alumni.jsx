import { useEffect, useMemo, useState } from "react";
import api from "../api";
import Card from "../components/Card";
import SearchBar from "../components/SearchBar";

export default function Alumni() {
  const [q, setQ] = useState("");
  const [batch, setBatch] = useState("");
  const [profession, setProfession] = useState("");
  const [sort, setSort] = useState("name");
  const [order, setOrder] = useState("asc");
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);

  async function fetchData() {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (batch) params.set("batch", batch);
    if (profession) params.set("profession", profession);
    if (sort) params.set("sort", sort);
    if (order) params.set("order", order);
    const res = await api.get(`/api/alumni?${params.toString()}`);
    setItems(res.data.data);
    setTotal(res.data.total);
  }

  useEffect(() => { fetchData(); }, [q, batch, profession, sort, order]);

  const batches = useMemo(() => {
    const s = new Set(items.map(i => String(i.batch)));
    return Array.from(s).sort();
  }, [items]);

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="text-3xl font-bold">Alumni Directory</h1>
        <div className="text-slate-400">Total: {total}</div>
      </div>

      <div className="mt-4 grid md:grid-cols-4 gap-3">
        <SearchBar value={q} onChange={setQ} placeholder="Search name, skill, location..." />
        <input className="input" placeholder="Batch (e.g., 2018)" value={batch} onChange={e=>setBatch(e.target.value)} />
        <input className="input" placeholder="Profession (e.g., Data)" value={profession} onChange={e=>setProfession(e.target.value)} />
        <div className="flex gap-2">
          <select className="input" value={sort} onChange={e=>setSort(e.target.value)}>
            <option value="name">Sort: Name</option>
            <option value="batch">Sort: Batch</option>
            <option value="profession">Sort: Profession</option>
          </select>
          <select className="input" value={order} onChange={e=>setOrder(e.target.value)}>
            <option value="asc">Asc</option>
            <option value="desc">Desc</option>
          </select>
        </div>
      </div>

      <div className="grid-cards mt-6">
        {items.map(a => (
          <Card key={a.id} title={a.name} subtitle={`${a.profession} • Batch ${a.batch}`} right={
            a.linkedin ? <a className="text-sky-400 underline" href={a.linkedin} target="_blank">LinkedIn</a> : null
          }>
            <div className="text-sm text-slate-300">{a.location}</div>
            {a.skills?.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {a.skills.map((s, i) => (
                  <span key={i} className="text-xs bg-slate-700 px-2 py-1 rounded-md">{s}</span>
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
