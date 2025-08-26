import React, { useEffect, useState } from "react";
import api from "../utils/axiosInstance";
import { toast } from "react-toastify";

// ---- helper: normalize DRF/SimpleJWT error payloads
function extractApiError(err) {
  if (!err?.response) return "Network error. Is the API running?";
  const { status, data } = err.response;

  if (typeof data === "string") return data;
  if (data?.detail) return data.detail;
  if (Array.isArray(data?.non_field_errors) && data.non_field_errors.length) {
    return data.non_field_errors[0];
  }
  // field errors like { start_date: ["..."], end_date: ["..."] }
  const parts = [];
  for (const [k, v] of Object.entries(data || {})) {
    if (Array.isArray(v)) parts.push(`${k}: ${v.join(" ")}`);
    else if (typeof v === "string") parts.push(`${k}: ${v}`);
  }
  if (parts.length) return parts.join(" | ");
  return `Request failed (${status}).`;
}

export default function EmployeeLeaves() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");

  const [form, setForm] = useState({ start_date: "", end_date: "", reason: "" });
  const onChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const fetchList = async () => {
    setLoading(true); setErr("");
    try {
      // if you have alias, this is fine; otherwise prefer "me/leaves/"
      const res = await api.get("me/leave-requests/");
      setList(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      setErr(extractApiError(e) || "Failed to load leave requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchList(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");

    // ---- client-side guardrails
    if (!form.start_date || !form.end_date) {
      setErr("Start and End dates are required.");
      toast.error("Start and End dates are required.");
      return;
    }
    if (form.end_date < form.start_date) {
      setErr("End date cannot be before start date.");
      toast.error("End date cannot be before start date.");
      return;
    }

    if (submitting) return;
    setSubmitting(true);
    try {
      await api.post("me/leave-requests/", form);
      setForm({ start_date: "", end_date: "", reason: "" });
      await fetchList();
      toast.success("Leave request submitted ✅");
    } catch (e) {
      const msg = extractApiError(e);
      setErr(msg);
      toast.error(msg);
      // optional: console.warn instead of console.error to avoid scary red stack
      console.warn("Submit leave failed:", msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 px-6 py-10">
      <h1 className="text-2xl font-semibold mb-6">My Leave Requests</h1>

      <div className="bg-white rounded-xl border p-4 mb-6 max-w-2xl">
        <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Start Date</label>
            <input type="date" name="start_date" value={form.start_date} onChange={onChange}
                   required className="border rounded-lg px-3 py-2 w-full" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">End Date</label>
            <input type="date" name="end_date" value={form.end_date} onChange={onChange}
                   required className="border rounded-lg px-3 py-2 w-full" />
          </div>
          <div className="sm:col-span-3">
            <label className="block text-sm text-gray-600 mb-1">Reason</label>
            <textarea name="reason" value={form.reason} onChange={onChange}
                      required className="border rounded-lg px-3 py-2 w-full" rows={3} />
          </div>
          <div className="sm:col-span-3 flex justify-end">
            <button
              className="px-4 py-2 rounded-lg bg-gray-900 text-white disabled:opacity-60"
              disabled={submitting}
            >
              {submitting ? "Submitting…" : "Submit Request"}
            </button>
          </div>
        </form>
        <p className="text-xs text-gray-500 mt-2">
          Note: requests will be rejected automatically by admin if leave balance is insufficient.
        </p>
      </div>

      {loading && <div>Loading…</div>}
      {err && !loading && (
        <div className="mb-4 p-3 rounded bg-red-50 text-red-700 border border-red-200">{err}</div>
      )}

      <div className="overflow-x-auto bg-white rounded-xl border">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Start</th>
              <th className="px-4 py-2 text-left">End</th>
              <th className="px-4 py-2 text-left">Reason</th>
              <th className="px-4 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {list.map((r) => (
              <tr key={r.id ?? `req-${r.start_date}-${r.end_date}`} className="border-t">
                <td className="px-4 py-2">{r.start_date}</td>
                <td className="px-4 py-2">{r.end_date}</td>
                <td className="px-4 py-2">{r.reason}</td>
                <td className="px-4 py-2 capitalize">{r.status}</td>
              </tr>
            ))}
            {list.length === 0 && !loading && (
              <tr><td className="px-4 py-4 text-gray-500" colSpan={4}>No leave requests</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
