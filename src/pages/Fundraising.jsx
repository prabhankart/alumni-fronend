import { useState } from "react";
import Card from "../components/Card";

export default function Fundraising() {
  const [amount, setAmount] = useState(420000); // demo amount
  const goal = 1000000;

  const pct = Math.min(100, Math.round((amount / goal) * 100));

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold">Fundraising</h1>
      <Card title="Campaign: Alumni Scholarship Fund" subtitle="Goal ₹10,00,000">
        <div className="mt-2 text-slate-300">Raised: ₹{amount.toLocaleString()} / ₹{goal.toLocaleString()}</div>
        <div className="w-full bg-slate-800 rounded-xl h-4 mt-3 overflow-hidden">
          <div className="bg-sky-500 h-4" style={{ width: pct + "%" }} />
        </div>
        <div className="mt-2 text-slate-400 text-sm">{pct}% achieved</div>
        <div className="mt-4 flex gap-2">
          <button className="btn" onClick={()=>setAmount(a=>a+5000)}>Simulate +₹5,000</button>
          <button className="btn bg-slate-700 hover:bg-slate-600" onClick={()=>setAmount(0)}>Reset</button>
        </div>
      </Card>
    </div>
  );
}
