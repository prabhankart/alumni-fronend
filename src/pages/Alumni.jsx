import { useEffect, useMemo, useState } from "react";
import API from "../api";
import Card from "../components/Card";
import SearchBar from "../components/SearchBar";

export default function Alumni() {
  const [items, setItems] = useState([]);               // always an array
  const [q, setQ] = useState("");
  const [batch, setBatch] = useState("");
  const [profession, setProfession] = useState("");
  const [sort, setSort] = useState("");
  const [order, setOrder] = useState("asc");

  useEffect(() => {
    API.get("/api/alumni")
      .then(res => {
        const arr = Array.isArray(res.data) ? res.data : (res.data?.data || []);
        setItems(arr);
      })
      .catch(() => setItems([]));
  }, []);

  const batches = useMemo(() => [...new Set(items.map(a => a.batch).filter(Boolean))], [items]);
  const professions = useMemo(() => [...new Set(items.map(a => a.profession).filter(Boolean))], [items]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    let list = items.filter(a => {
      const t = [a.name, a.profession, ...(a.skills || [])].join(" ").toLowerCase();
      const okQ = !s || t.includes(s);
      const okB = !batch || a.batch === batch;
      const okP = !profession || a.profession === profession;
      return okQ && okB && okP;
    });
    if (sort === "name") list.sort((a,b)=> (a.name||"").localeCompare(b.name||"") * (order==="asc"?1:-1));
    if (sort === "batch") list.sort((a,b)=> (String(a.batch)||"").localeCompare(String(b.batch)||"") * (order==="asc"?1:-1));
    return list;
  }, [items, q, batch, profession, sort, order]);

  return (
    <div className="container py-6">
      <SearchBar
        q={q} setQ={setQ}
        batch={batch} setBatch={setBatch} batches={batches}
        profession={profession} setProfession={setProfession} professions={professions}
        sort={sort} setSort={setSort} order={order} setOrder={setOrder}
      />

      <div className="grid-cards mt-6">
        {filtered.map(a => (
          <Card
            key={a._id || a.id}
            title={a.name}
            subtitle={`${a.profession || "—"} • Batch ${a.batch || "—"}`}
            right={a.linkedin ? <a className="text-sky-400 underline" href={a.linkedin} target="_blank" rel="noreferrer">LinkedIn</a> : null}
          >
            {(a.skills || []).length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {(a.skills || []).map((s,i)=><span key={i} className="px-2 py-1 text-xs rounded-full bg-sky-900/40 border border-sky-700">{s}</span>)}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
