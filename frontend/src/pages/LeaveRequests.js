// src/pages/AdminLeaveRequests.jsx
import React, { useEffect, useState, useMemo } from "react";
import api from "../utils/axiosInstance";

export default function AdminLeaveRequests() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // --- Admin fetch: all employees' leave requests
  const fetchAll = async () => {
    setLoading(true); setErr("");
    try {
      const res = await api.get("leave-requests/"); // ADMIN endpoint
      setRows(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      setErr(e?.response?.data?.detail || "Failed to load leave requests.");
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  // (Optional) admin can also create a request for someone else? If not, remove this form.
  const submitLeave = async (e) => {
    e.preventDefault();
    setErr("");
    setSubmitting(true);
    try {
      // If admins shouldn’t create requests, delete this function and the form JSX.
      await api.post("me/leaves/", { start_date: start, end_date: end, reason });
      setStart(""); setEnd(""); setReason("");
      fetchAll();
    } catch (e) {
      const data = e?.response?.data || {};
      setErr(
        data.detail ||
          Object.values(data).flat().join(" ") ||
          "Could not submit leave."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`leave-requests/${id}/`, { status }); // ADMIN update
      // Optimistic update:
      setRows(prev =>
        prev.map(r => (r.id === id ? { ...r, status } : r))
      );
    } catch (e) {
      setErr(e?.response?.data?.detail || `Could not ${status} request.`);
    }
  };

  const sortedRows = useMemo(() => {
    // newest first by id; adjust if you prefer by start_date
    const arr = [...rows];
    arr.sort((a, b) => (b.id || 0) - (a.id || 0));
    return arr;
  }, [rows]);

  useEffect(() => { fetchAll(); }, []);

  return (
    <div className="w-full min-h-screen bg-gray-100 px-6 py-10">
      <h1 className="text-2xl font-semibold mb-6">Leave Requests</h1>

      {/* Admin create form (optional). Remove if not needed. */}
      {/* <form
        onSubmit={submitLeave}
        className="bg-white rounded-xl border p-4 mb-4 grid gap-4 sm:grid-cols-2"
      >
        <div>
          <label className="block text-sm text-gray-600 mb-1">Start Date</label>
          <input
            type="date"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">End Date</label>
          <input
            type="date"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full"
            required
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm text-gray-600 mb-1">Reason</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full"
            rows={3}
          />
        </div>
        <div className="sm:col-span-2">
          <button
            disabled={submitting}
            className="px-4 py-2 rounded-lg bg-gray-900 text-white disabled:opacity-50"
          >
            {submitting ? "Submitting…" : "Submit Request"}
          </button>
        </div>
      </form> */}

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
              <th className="px-4 py-2 text-left">Employee</th>
              <th className="px-4 py-2 text-left">Start</th>
              <th className="px-4 py-2 text-left">End</th>
              <th className="px-4 py-2 text-left">Reason</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedRows.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="px-4 py-2">
                  {r.employee_name || r.employee || "—"}
                </td>
                <td className="px-4 py-2">{r.start_date}</td>
                <td className="px-4 py-2">{r.end_date}</td>
                <td className="px-4 py-2">{r.reason || "—"}</td>
                <td className="px-4 py-2 capitalize">{r.status}</td>
                <td className="px-4 py-2">
                  {r.status === "pending" ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateStatus(r.id, "approved")}
                        className="px-3 py-1 rounded bg-emerald-600 text-white hover:bg-emerald-700"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => updateStatus(r.id, "rejected")}
                        className="px-3 py-1 rounded bg-rose-600 text-white hover:bg-rose-700"
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <span className="text-gray-500">—</span>
                  )}
                </td>
              </tr>
            ))}

            {sortedRows.length === 0 && !loading && (
              <tr>
                <td className="px-4 py-4 text-gray-500" colSpan={6}>
                  No leave requests
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
