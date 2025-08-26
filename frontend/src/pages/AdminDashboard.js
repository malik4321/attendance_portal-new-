// // src/pages/AdminDashboard.js
// import React, { useEffect, useMemo, useState } from "react";
// import api from "../utils/axiosInstance";
// import {
//   ResponsiveContainer,
//   BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
//   LineChart, Line,
//   PieChart, Pie, Cell,
// } from "recharts";

// const COLORS = ["#8b5cf6", "#06b6d4", "#f43f5e", "#10b981", "#60a5fa", "#f59e0b"];

// export default function AdminDashboard() {
//   const [loading, setLoading] = useState(true);
//   const [err, setErr] = useState("");
//   const [stats, setStats] = useState({
//     total_employees: 0,
//     present_today: 0,
//     absent_today: 0,
//     leave_pending: 0,
//     wfh: 0,
//     onsite: 0,
//     trend: [],
//   });

//   const fetchStats = async () => {
//     setLoading(true);
//     setErr("");
//     try {
//       const res = await api.get("dashboard-stats/");
//       setStats(res.data || {});
//     } catch (e) {
//       setErr(e?.response?.data?.detail || "Failed to load dashboard stats");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchStats();
//   }, []);

//   const {
//     total_employees = 0,
//     present_today = 0,
//     absent_today = 0,
//     leave_pending = 0,
//     wfh = 0,
//     onsite = 0,
//   } = stats;

//   // Normalize trend → array oldest→newest
//   const lineData = useMemo(() => {
//     const raw = Array.isArray(stats.trend)
//       ? stats.trend
//       : Object.entries(stats.trend || {}).map(([date, v]) => ({
//           date,
//           present: Number(v?.present ?? 0),
//           total: Number(v?.total ?? 0),
//         }));
//     return raw
//       .map((d) => ({
//         date: d.date?.slice(5) ?? "",
//         Present: Number(d.present ?? 0),
//         Total: Number(d.total ?? (d.present ?? 0)),
//         Absent: Math.max(0, Number(d.total ?? 0) - Number(d.present ?? 0)),
//         _iso: d.date,
//       }))
//       .sort((a, b) => new Date(a._iso) - new Date(b._iso));
//   }, [stats.trend]);

//   const todayBarData = [
//     { name: "Present", value: Number(present_today) },
//     { name: "Absent", value: Number(absent_today) },
//   ];

//   const modePieData = [
//     { name: "WFH", value: Number(wfh) },
//     { name: "Onsite", value: Number(onsite) },
//   ];

//   return (
//     <div className="w-full min-h-screen bg-gradient-to-b from-gray-50 to-white px-6 py-10">
//       <div className="flex items-center justify-between mb-6">
//         <h1 className="text-3xl font-semibold text-gray-800 tracking-tight">
//           Welcome to the Admin Dashboard
//         </h1>

//         <button
//           onClick={fetchStats}
//           className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:shadow transition-all"
//         >
//           <svg width="16" height="16" viewBox="0 0 24 24" className="opacity-80">
//             <path fill="currentColor" d="M12 6V3L8 7l4 4V8c2.76 0 5 2.24 5 5a5 5 0 0 1-5 5a5 5 0 0 1-4.58-3H6.26A7 7 0 0 0 12 22a7 7 0 0 0 7-7c0-3.87-3.13-7-7-7Z" />
//           </svg>
//           Refresh
//         </button>
//       </div>

//       {/* KPIs */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//         <StatCard title="Total Employees" value={total_employees} accent="from-violet-500/20 to-fuchsia-500/20" icon="users" />
//         <StatCard title="Present Today" value={present_today} accent="from-emerald-500/20 to-teal-500/20" icon="check" />
//         <StatCard title="Absent Today" value={absent_today} accent="from-rose-500/20 to-orange-500/20" icon="x" />
//         <StatCard title="Leave Pending" value={leave_pending} accent="from-sky-500/20 to-indigo-500/20" icon="clock" />
//       </div>

//       {/* Charts */}
//       <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
//         {/* Bar Chart */}
//         <ChartCard title="Today’s Attendance" subtitle="Present vs Absent">
//           <ChartGradients />
//           <div className="h-64">
//             {todayBarData.every(d => d.value === 0) ? (
//               <EmptyState />
//             ) : (
//               <ResponsiveContainer width="100%" height="100%">
//                 <BarChart data={todayBarData} barSize={38}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//                   <XAxis dataKey="name" tick={{ fill: "#6b7280" }} axisLine={false} tickLine={false} />
//                   <YAxis allowDecimals={false} tick={{ fill: "#6b7280" }} axisLine={false} tickLine={false} />
//                   <Tooltip content={<NiceTooltip />} />
//                   <Legend />
//                   <Bar dataKey="value" name="Count" radius={[10, 10, 0, 0]} fill="url(#barGradient)" />
//                 </BarChart>
//               </ResponsiveContainer>
//             )}
//           </div>
//         </ChartCard>

//         {/* Pie Chart */}
//         <ChartCard title="WFH vs Onsite (Today)" subtitle="Work mode distribution">
//           <div className="h-64">
//             {modePieData.every(d => d.value === 0) ? (
//               <EmptyState />
//             ) : (
//               <ResponsiveContainer width="100%" height="100%">
//                 <PieChart>
//                   <Tooltip content={<NiceTooltip />} />
//                   <Legend />
//                   <Pie
//                     data={modePieData}
//                     dataKey="value"
//                     nameKey="name"
//                     outerRadius={95}
//                     innerRadius={50}
//                     paddingAngle={3}
//                     label
//                   >
//                     {modePieData.map((_, idx) => (
//                       <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
//                     ))}
//                   </Pie>
//                 </PieChart>
//               </ResponsiveContainer>
//             )}
//           </div>
//         </ChartCard>

//         {/* Line Chart */}
//         <ChartCard title="7-Day Attendance Trend" subtitle="Daily totals vs present">
//           <ChartGradients />
//           <div className="h-64">
//             {lineData.length === 0 ? (
//               <EmptyState />
//             ) : (
//               <ResponsiveContainer width="100%" height="100%">
//                 <LineChart data={lineData}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//                   <XAxis dataKey="date" tick={{ fill: "#6b7280" }} axisLine={false} tickLine={false} />
//                   <YAxis allowDecimals={false} tick={{ fill: "#6b7280" }} axisLine={false} tickLine={false} />
//                   <Tooltip content={<NiceTooltip />} />
//                   <Legend />
//                   <Line type="monotone" dataKey="Absent" stroke="url(#lineRed)" strokeWidth={2.5} dot={{ r: 3 }} />
//                   <Line type="monotone" dataKey="Present" stroke="url(#lineGreen)" strokeWidth={2.5} dot={{ r: 3 }} />
//                   <Line type="monotone" dataKey="Total" stroke="url(#lineIndigo)" strokeWidth={2.5} dot={{ r: 3 }} />
//                 </LineChart>
//               </ResponsiveContainer>
//             )}
//           </div>
//         </ChartCard>
//       </div>
//     </div>
//   );
// }

// /* ---------- Small helpers / presentational bits ---------- */

// function StatCard({ title, value, accent = "from-gray-200 to-gray-100", icon = "dot" }) {
//   return (
//     <div className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm hover:shadow-md transition-all">
//       {/* soft top accent */}
//       <div className={`pointer-events-none absolute inset-x-0 -top-1 h-1 bg-gradient-to-r ${accent}`} />
//       <div className="flex items-center gap-4">
//         <Icon kind={icon} className="h-10 w-10 rounded-xl bg-gray-50 p-2 text-gray-700 group-hover:scale-105 transition-transform" />
//         <div>
//           <div className="text-sm text-gray-500">{title}</div>
//           <div className="mt-1 text-3xl font-bold text-gray-900 tabular-nums">{Number(value ?? 0)}</div>
//         </div>
//       </div>
//     </div>
//   );
// }

// function ChartCard({ title, subtitle, children }) {
//   return (
//     <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
//       <div className="mb-3 flex items-center justify-between">
//         <div>
//           <h3 className="font-semibold text-gray-800">{title}</h3>
//           {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
//         </div>
//       </div>
//       {children}
//     </div>
//   );
// }

// function EmptyState() {
//   return (
//     <div className="h-full w-full grid place-items-center">
//       <div className="text-sm text-gray-400">No data to display</div>
//     </div>
//   );
// }

// function NiceTooltip({ active, payload, label }) {
//   if (!active || !payload || !payload.length) return null;
//   return (
//     <div className="rounded-xl border border-gray-200 bg-white px-3 py-2 shadow-sm">
//       {label && <div className="mb-1 text-xs font-medium text-gray-500">{label}</div>}
//       {payload.map((p, i) => (
//         <div key={i} className="flex items-center gap-2 text-sm">
//           <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: p.color }} />
//           <span className="text-gray-700">{p.name}</span>
//           <span className="ml-2 font-semibold text-gray-900">{p.value}</span>
//         </div>
//       ))}
//     </div>
//   );
// }

// /* SVG icons (no extra dependency) */
// function Icon({ kind, className }) {
//   switch (kind) {
//     case "users":
//       return (
//         <svg viewBox="0 0 24 24" className={className} fill="currentColor">
//           <path d="M16 11c1.66 0 3-1.34 3-3S17.66 5 16 5s-3 1.34-3 3s1.34 3 3 3m-8 0c1.66 0 3-1.34 3-3S9.66 5 8 5S5 6.34 5 8s1.34 3 3 3m0 2c-2.33 0-7 1.17-7 3.5V20h14v-3.5C15 14.17 10.33 13 8 13m8 0c-.29 0-.62.02-.97.05c1.16.84 1.97 1.94 1.97 3.45V20h6v-3.5c0-2.33-4.67-3.5-7-3.5Z" />
//         </svg>
//       );
//     case "check":
//       return (
//         <svg viewBox="0 0 24 24" className={className} fill="currentColor">
//           <path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z" />
//         </svg>
//       );
//     case "x":
//       return (
//         <svg viewBox="0 0 24 24" className={className} fill="currentColor">
//           <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
//         </svg>
//       );
//     case "clock":
//       return (
//         <svg viewBox="0 0 24 24" className={className} fill="currentColor">
//           <path d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2m1 11h5v-2h-4V6h-2z" />
//         </svg>
//       );
//     default:
//       return <span className={className} />;
//   }
// }

// /* Gradient defs reused by charts */
// function ChartGradients() {
//   return (
//     <svg width="0" height="0">
//       <defs>
//         <linearGradient id="barGradient" x1="0" x2="0" y1="0" y2="1">
//           <stop offset="0%" stopColor="#8b5cf6" />
//           <stop offset="100%" stopColor="#60a5fa" />
//         </linearGradient>
//         <linearGradient id="lineGreen" x1="0" x2="1">
//           <stop offset="0%" stopColor="#10b981" />
//           <stop offset="100%" stopColor="#34d399" />
//         </linearGradient>
//         <linearGradient id="lineIndigo" x1="0" x2="1">
//           <stop offset="0%" stopColor="#6366f1" />
//           <stop offset="100%" stopColor="#60a5fa" />
//         </linearGradient>
//         <linearGradient id="lineRed" x1="0" x2="1">
//           <stop offset="0%" stopColor="#f43f5e" />
//           <stop offset="100%" stopColor="#fb7185" />
//         </linearGradient>
//       </defs>
//     </svg>
//   );
// }



// src/pages/AdminDashboard.js
import React, { useEffect, useMemo, useState } from "react";
import api from "../utils/axiosInstance";
import {
  ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line,
  PieChart, Pie, Cell,
} from "recharts";

const COLORS = ["#8b5cf6", "#06b6d4", "#f43f5e", "#10b981", "#60a5fa", "#f59e0b"];

/* small date helpers */
const fmt = (d) => d.toISOString().slice(0, 10);
const todayStr = () => fmt(new Date());
const daysAgoStr = (n) => { const d = new Date(); d.setDate(d.getDate() - n); return fmt(d); };

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [stats, setStats] = useState({
    total_employees: 0,
    present_today: 0,
    absent_today: 0,
    leave_pending: 0,
    wfh: 0,
    onsite: 0,
    trend: [],
    range: { from: "", to: "" },
  });

  // Date range UI (default: last 7 days)
  const [from, setFrom] = useState(daysAgoStr(6));
  const [to, setTo] = useState(todayStr());

  const fetchStats = async () => {
  setLoading(true);
  setErr("");
  try {
    const params = {};
    if (from) params.from = from; // from is a state "YYYY-MM-DD"
    if (to) params.to = to;

    const res = await api.get("dashboard-stats/", { params });
    setStats(res.data || {});
//     const res = await api.get("dashboard-stats/", {
//   params: { from, to },  // only include if you have from/to strings
// });
  } catch (e) {
    const msg = e?.response?.data?.detail || "Failed to load dashboard stats";
    setErr(msg);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchStats({ from, to });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    total_employees = 0,
    present_today = 0,
    absent_today = 0,
    leave_pending = 0,
    wfh = 0,
    onsite = 0,
    range = {},
  } = stats;

  // Normalize trend → array oldest→newest
  const lineData = useMemo(() => {
    const raw = Array.isArray(stats.trend) ? stats.trend : [];
    return raw
      .map((d) => ({
        date: d.date?.slice(5) ?? "",
        Present: Number(d.present ?? 0),
        Leave: Number(d.leave ?? 0),
        Total: Number(d.total ?? 0),
        Absent: Math.max(
          0,
          Number(d.total ?? 0) - Number(d.present ?? 0) - Number(d.leave ?? 0)
        ),
        _iso: d.date,
      }))
      .sort((a, b) => new Date(a._iso) - new Date(b._iso));
  }, [stats.trend]);

  const todayBarData = [
    { name: "Present", value: Number(present_today) },
    { name: "Absent", value: Number(absent_today) },
  ];

  const modePieData = [
    { name: "WFH", value: Number(wfh) },
    { name: "Onsite", value: Number(onsite) },
  ];

  const applyRange = (e) => {
    e?.preventDefault?.();
    if (!from || !to) return;
    fetchStats({ from, to });
  };

  const resetRange = () => {
    const f = daysAgoStr(6);
    const t = todayStr();
    setFrom(f);
    setTo(t);
    fetchStats({ from: f, to: t });
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-gray-50 to-white px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold text-gray-800 tracking-tight">
          Admin Dashboard
        </h1>

        {/* Date range filter */}
        <form onSubmit={applyRange} className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Range:</span>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="border rounded-lg px-3 py-1.5 text-sm"
          />
          <span className="text-gray-400">—</span>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="border rounded-lg px-3 py-1.5 text-sm"
          />
          <button
            type="submit"
            className="ml-2 rounded-lg bg-gray-900 text-white px-3 py-1.5 text-sm"
          >
            Apply
          </button>
          <button
            type="button"
            onClick={resetRange}
            className="rounded-lg bg-gray-200 text-gray-800 px-3 py-1.5 text-sm"
          >
            Reset
          </button>
        </form>
      </div>

      {loading && <div>Loading…</div>}
      {err && !loading && (
        <div className="mb-4 p-3 rounded bg-red-50 text-red-700 border border-red-200">
          {err}
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Employees"
          value={total_employees}
          accent="from-violet-500/20 to-fuchsia-500/20"
          icon="users"
        />
        <StatCard
          title={`Present (${range?.to || to})`}
          value={present_today}
          accent="from-emerald-500/20 to-teal-500/20"
          icon="check"
        />
        <StatCard
          title={`Absent (${range?.to || to})`}
          value={absent_today}
          accent="from-rose-500/20 to-orange-500/20"
          icon="x"
        />
        <StatCard
          title="Leave Pending"
          value={leave_pending}
          accent="from-sky-500/20 to-indigo-500/20"
          icon="clock"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Bar Chart */}
        <ChartCard
          title={`Attendance on ${range?.to || to}`}
          subtitle="Present vs Absent"
        >
          <ChartGradients />
          <div className="h-64">
            {todayBarData.every((d) => d.value === 0) ? (
              <EmptyState />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={todayBarData} barSize={38}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "#6b7280" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fill: "#6b7280" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<NiceTooltip />} />
                  <Legend />
                  <Bar
                    dataKey="value"
                    name="Count"
                    radius={[10, 10, 0, 0]}
                    fill="url(#barGradient)"
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </ChartCard>

        {/* Pie Chart */}
        <ChartCard
          title={`WFH vs Onsite (${range?.to || to})`}
          subtitle="Work mode distribution"
        >
          <div className="h-64">
            {modePieData.every((d) => d.value === 0) ? (
              <EmptyState />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip content={<NiceTooltip />} />
                  <Legend />
                  <Pie
                    data={modePieData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={95}
                    innerRadius={50}
                    paddingAngle={3}
                    label
                  >
                    {modePieData.map((_, idx) => (
                      <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </ChartCard>

        {/* Line Chart */}
        <ChartCard
          title="Attendance Trend"
          subtitle={`${range?.from || from} — ${range?.to || to}`}
        >
          <ChartGradients />
          <div className="h-64">
            {lineData.length === 0 ? (
              <EmptyState />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: "#6b7280" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fill: "#6b7280" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<NiceTooltip />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="Absent"
                    stroke="url(#lineRed)"
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Present"
                    stroke="url(#lineGreen)"
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Total"
                    stroke="url(#lineIndigo)"
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </ChartCard>
      </div>
    </div>
  );
}

/* ---------- Small helpers / presentational bits ---------- */

function StatCard({ title, value, accent = "from-gray-200 to-gray-100", icon = "dot" }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm hover:shadow-md transition-all">
      {/* soft top accent */}
      <div className={`pointer-events-none absolute inset-x-0 -top-1 h-1 bg-gradient-to-r ${accent}`} />
      <div className="flex items-center gap-4">
        <Icon kind={icon} className="h-10 w-10 rounded-xl bg-gray-50 p-2 text-gray-700 group-hover:scale-105 transition-transform" />
        <div>
          <div className="text-sm text-gray-500">{title}</div>
          <div className="mt-1 text-3xl font-bold text-gray-900 tabular-nums">{Number(value ?? 0)}</div>
        </div>
      </div>
    </div>
  );
}

function ChartCard({ title, subtitle, children }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-800">{title}</h3>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="h-full w-full grid place-items-center">
      <div className="text-sm text-gray-400">No data to display</div>
    </div>
  );
}

function NiceTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="rounded-xl border border-gray-200 bg-white px-3 py-2 shadow-sm">
      {label && <div className="mb-1 text-xs font-medium text-gray-500">{label}</div>}
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2 text-sm">
          <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: p.color }} />
          <span className="text-gray-700">{p.name}</span>
          <span className="ml-2 font-semibold text-gray-900">{p.value}</span>
        </div>
      ))}
    </div>
  );
}

/* SVG icons (no extra dependency) */
function Icon({ kind, className }) {
  switch (kind) {
    case "users":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
          <path d="M16 11c1.66 0 3-1.34 3-3S17.66 5 16 5s-3 1.34-3 3s1.34 3 3 3m-8 0c1.66 0 3-1.34 3-3S9.66 5 8 5S5 6.34 5 8s1.34 3 3 3m0 2c-2.33 0-7 1.17-7 3.5V20h14v-3.5C15 14.17 10.33 13 8 13m8 0c-.29 0-.62.02-.97.05c1.16.84 1.97 1.94 1.97 3.45V20h6v-3.5c0-2.33-4.67-3.5-7-3.5Z" />
        </svg>
      );
    case "check":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
          <path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z" />
        </svg>
      );
    case "x":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
          <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
        </svg>
      );
    case "clock":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
          <path d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2m1 11h5v-2h-4V6h-2z" />
        </svg>
      );
    default:
      return <span className={className} />;
  }
}

/* Gradient defs reused by charts */
function ChartGradients() {
  return (
    <svg width="0" height="0">
      <defs>
        <linearGradient id="barGradient" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#60a5fa" />
        </linearGradient>
        <linearGradient id="lineGreen" x1="0" x2="1">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#34d399" />
        </linearGradient>
        <linearGradient id="lineIndigo" x1="0" x2="1">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#60a5fa" />
        </linearGradient>
        <linearGradient id="lineRed" x1="0" x2="1">
          <stop offset="0%" stopColor="#f43f5e" />
          <stop offset="100%" stopColor="#fb7185" />
        </linearGradient>
      </defs>
    </svg>
  );
}
