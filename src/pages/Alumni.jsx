import { useEffect, useMemo, useState } from "react";
import API from "../api";
import Card from "../components/Card";
import SearchBar from "../components/SearchBar";

const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === "true";

const DEMO_ALUMNI = [
  { id: 1, name: "Aarav Sharma", batch: "2016", profession: "Software Engineer", location: "Bengaluru", skills: ["React","Node.js"], linkedin: "#" },
  { id: 2, name: "Neha Gupta", batch: "2018", profession: "Data Scientist", location: "Pune", skills: ["Python","ML"], linkedin: "#" },
  { id: 3, name: "Rahul Verma", batch: "2015", profession: "Product Manager", location: "Gurugram", skills: ["Roadmaps","Analytics"] },
  { id: 4, name: "Priya Singh", batch: "2017", profession: "Cloud Architect", location: "Hyderabad", skills: ["AWS","GCP"] },
  { id: 5, name: "Ishan Patel", batch: "2019", profession: "DevOps Engineer", location: "Ahmedabad", skills: ["Docker","Kubernetes"] },
  { id: 6, name: "Ananya Rao", batch: "2014", profession: "UI/UX Designer", location: "Mumbai", skills: ["Figma","Design Systems"] },
];

export default function Alumni() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usedDemo, setUsedDemo] = useState(false);

  const [q, setQ] = useState("");
  const [batch, setBatch] = useState("");
  const [profession, setProfession] = useState("");
  const [sort, setSort] = useState("");
  const [order, setOrder] = useState("asc");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await API.get("/api/alumni");
        const arr = Array.isArray(res.data) ? res.data : (res.data?.data || []);
        if (!mounted) return;
        if (arr.length === 0 && DEMO_MODE) {
          setItems(DEMO_ALUMNI);
          setUsedDemo(true);
        } else {
          setItems(arr);
        }
      } catch (e) {
        if (DEMO_MODE) {
          setItems(DEMO_ALUMNI);
          setUsedDemo(true);
        } else {
          setItems([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
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
    if (sort === "batch") list.sort((a,b)=> String(a.batch||"").localeCompare(String(b.batch||"")) * (order==="asc"?1:-1));
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

      {loading ? (
        <div className="mt-6 grid-cards">
          {Array.from({length:6}).map((_,i)=>(
            <div key={i} className="card animate-pulse h-36">
              <div className="h-5 w-1/2 bg-slate-700 rounded mb-2"></div>
              <div className="h-4 w-1/3 bg-slate-800 rounded"></div>
              <div className="h-3 w-2/3 bg-slate-800 rounded mt-4"></div>
            </div>
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid-cards mt-6">
          {filtered.map(a => (
            <Card
              key={a._id || a.id || a.name}
              title={a.name}
              subtitle={`${a.profession || "—"} • Batch ${a.batch || "—"}`}
              right={a.linkedin ? <a className="text-sky-400 underline" href={a.linkedin} target="_blank" rel="noreferrer">LinkedIn</a> : null}
            >
              {(a.location || a.skills?.length) && (
                <div className="mt-2 text-sm text-slate-300">
                  {a.location ? <span>{a.location}</span> : null}
                  {(a.skills || []).length ? (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {a.skills.map((s,i)=>(
                        <span key={i} className="px-2 py-1 text-xs rounded-full bg-sky-900/40 border border-sky-700">{s}</span>
                      ))}
                    </div>
                  ) : null}
                </div>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <div className="mt-10 text-center text-slate-400">
          <p className="mb-3">No alumni found.</p>
          {DEMO_MODE ? (
            <p className="text-xs text-slate-500">Showing demo data because your database is empty.</p>
          ) : (
            <p className="text-xs text-slate-500">Add alumni via API or enable demo mode to show sample cards.</p>
          )}
        </div>
      )}

      {usedDemo && (
        <div className="mt-6 text-xs text-slate-400">
          <span className="px-2 py-1 rounded bg-sky-900/40 border border-sky-700">Demo data</span> • Disable by removing <code>VITE_DEMO_MODE</code>.
        </div>
      )}
    </div>
  );
}
