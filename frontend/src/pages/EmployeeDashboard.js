// src/pages/EmployeeDashboard.js
import React, { useEffect, useMemo, useState } from "react";
import api from "../utils/axiosInstance";
import {
  ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from "recharts";
// ✅ add:
import { toast } from "react-toastify";

export default function EmployeeDashboard() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [data, setData] = useState({
    profile: { username: "", designation: "", join_date: "", leave_balance: 0 },
    today: { status: "None", mode: null },
    month: { present: 0, absent: 0, leave: 0, wfh: 0, onsite: 0 },
    pending_leaves: 0,
    trend: [],
  });

  const fetchMe = async () => {
    setLoading(true); setErr("");
    try {
      const res = await api.get("me/dashboard/");
      setData(res.data || {});
    } catch (e) {
      setErr(e?.response?.data?.detail || "Failed to load dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMe(); }, []);

  const lineData = useMemo(() => {
    const raw = Array.isArray(data.trend) ? data.trend : [];
    return raw
      .map((d) => ({
        date: d.date?.slice(5) ?? "",
        Present: Number(d.present ?? 0),
        Total: Number(d.total ?? 0),
        Absent: Math.max(0, Number(d.total ?? 0) - Number(d.present ?? 0)),
        _iso: d.date,
      }))
      .sort((a, b) => new Date(a._iso) - new Date(b._iso));
  }, [data.trend]);

  // ✅ use toast instead of alert
  const mark = async (mode) => {
    try {
      await api.post("me/attendance/mark/", { mode });
      await fetchMe();
      toast.success(`Marked present (${mode}).`);
    } catch (e) {
      const msg = e?.response?.data?.detail || "Could not mark attendance.";
      toast.error(msg);
    }
  };

  const { profile, today, month, pending_leaves } = data;

  return (
    <div className="w-full min-h-screen bg-gray-100 px-6 py-10">
      <h1 className="text-2xl font-semibold mb-4">
        Hi, {profile.username || "—"} — {profile.designation || "—"}
      </h1>

      {loading && <div>Loading…</div>}
      {err && !loading && (
        <div className="mb-4 p-3 rounded bg-red-50 text-red-700 border border-red-200">{err}</div>
      )}

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <Card title="Leave Balance" value={profile.leave_balance} />
        <Card title="Today Status"  value={today.status} />
        <Card title="Today Mode"    value={today.mode || "—"} />
        <Card title="Pending Leaves" value={pending_leaves} />
        <Card title="Joined" value={profile.join_date?.slice(0,10)} />
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-xl border p-4 mb-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="text-gray-700 font-semibold">Quick Mark Attendance</div>
            <div className="text-sm text-gray-500">
              If you are working today, mark yourself present.
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => mark("WFH")}
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Mark Present (WFH)
            </button>
            <button
              onClick={() => mark("Onsite")}
              className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
            >
              Mark Present (Onsite)
            </button>
          </div>
        </div>
      </div>

      {/* Month counters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card title="Present (month)" value={month.present} />
        <Card title="Absent (month)"  value={month.absent} />
        <Card title="Leave (month)"   value={month.leave} />
        <Card title="WFH/Onsite"      value={`${month.wfh}/${month.onsite}`} />
      </div>

      {/* Trend chart */}
      <div className="bg-white rounded-xl border p-4">
        <div className="font-semibold text-gray-700 mb-2">Last 7 Days</div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Present" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="Absent"  stroke="#f43f5e" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="Total"   stroke="#6366f1" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="mt-1 text-2xl font-bold tabular-nums text-gray-900">{value ?? "—"}</div>
    </div>
  );
}
