import React from "react";
import api from "../utils/axiosInstance";

export default function MarkAttendance() {
  const mark = async (mode) => {
    try {
      await api.post("me/attendance/mark/", { mode });
      alert("Marked present.");
    } catch (e) {
      alert(e?.response?.data?.detail || "Could not mark attendance.");
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 px-6 py-10">
      <h1 className="text-2xl font-semibold mb-6">Mark Attendance</h1>
      <div className="bg-white rounded-xl border p-6 max-w-xl">
        <p className="text-gray-600 mb-4">Choose your work mode for today.</p>
        <div className="flex gap-4">
          <button onClick={() => mark("WFH")} className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">
            Mark Present (WFH)
          </button>
          <button onClick={() => mark("Onsite")} className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700">
            Mark Present (Onsite)
          </button>
        </div>
      </div>
    </div>
  );
}
