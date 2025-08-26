// src/pages/MyAttendance.jsx
import React, { useEffect, useState } from "react";
import api from "../utils/axiosInstance";

export default function MyAttendance() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const fetchData = async (params = {}) => {
    setLoading(true);
    setErr("");
    try {
      const res = await api.get("me/attendance/", { params });
      setRows(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      setErr(e?.response?.data?.detail || "Failed to fetch attendance.");
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  // initial load: last 30 days
  useEffect(() => {
    fetchData({ days: 30 });
  }, []);

  const submitFilter = (e) => {
    e.preventDefault();
    // If both dates provided -> use them; else fallback to days=30
    if (from && to) {
      fetchData({ from, to });
    } else {
      fetchData({ days: 30 });
    }
  };

  const resetFilter = () => {
    setFrom("");
    setTo("");
    fetchData({ days: 30 });
  };

  const datesInvalid = Boolean(from && to && to < from);

  return (
    <div className="w-full min-h-screen bg-gray-100 px-6 py-10">
      <h1 className="text-2xl font-semibold mb-6">My Attendance</h1>

      <form
        onSubmit={submitFilter}
        className="bg-white rounded-xl border p-4 mb-4 flex gap-4 items-end flex-wrap"
      >
        <div>
          <label className="block text-sm text-gray-600 mb-1">From</label>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="border rounded-lg px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">To</label>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="border rounded-lg px-3 py-2"
          />
        </div>

        <button
          className="px-4 py-2 rounded-lg bg-gray-900 text-white disabled:opacity-50"
          disabled={datesInvalid}
        >
          Apply
        </button>
        <button
          type="button"
          onClick={resetFilter}
          className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800"
        >
          Reset
        </button>

        {datesInvalid && (
          <div className="text-sm text-red-600">
            “To” date cannot be before “From” date.
          </div>
        )}
      </form>

      {loading && (
        <div className="mb-4 p-3 rounded bg-gray-50 text-gray-700 border border-gray-200">
          Loading…
        </div>
      )}

      {err && !loading && (
        <div className="mb-4 p-3 rounded bg-red-50 text-red-700 border border-red-200">
          {err}
        </div>
      )}

      <div className="overflow-x-auto bg-white rounded-xl border">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Mode</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const rowKey = r.id ?? `absent-${r.date}`; // unique fallback for null ids
              return (
                <tr key={rowKey} className="border-t">
                  <td className="px-4 py-2">
                    {r.date /* or: new Date(r.date).toLocaleDateString() */}
                  </td>
                  <td className="px-4 py-2">{r.status}</td>
                  <td className="px-4 py-2">{r.mode || "—"}</td>
                </tr>
              );
            })}

            {rows.length === 0 && !loading && (
              <tr>
                <td className="px-4 py-4 text-gray-500" colSpan={3}>
                  No records
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
