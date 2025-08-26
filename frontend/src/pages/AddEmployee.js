// src/pages/AddEmployee.js
import React, { useState } from "react";
import api from "../utils/axiosInstance";

export default function AddEmployee() {
  const [formData, setFormData] = useState({ username: "", password: "", designation: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [msg, setMsg] = useState({ ok: "", err: "" });

  const onChange = (e) => setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg({ ok: "", err: "" });
    try {
      await api.post("employees/", formData); // ✅ relative
      setMsg({ ok: "✅ Employee added successfully!", err: "" });
      setFormData({ username: "", password: "", designation: "" });
    } catch (err) {
      const detail = err?.response?.data
        ? JSON.stringify(err.response.data)
        : err.message;
      setMsg({ ok: "", err: `❌ Failed to add employee. ${detail}` });
    }
  };

  return (
    <div className="min-h-screen px-6 py-10 bg-gray-100">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">Add New Employee</h2>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input name="username" value={formData.username} onChange={onChange}
                   className="w-full border rounded-lg px-4 py-2" required />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} name="password"
                     value={formData.password} onChange={onChange}
                     className="w-full border rounded-lg px-4 py-2 pr-12" required />
              <button type="button" onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-2.5 text-sm text-gray-600">
                {showPassword ? "🙈 Hide" : "👁 Show"}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Designation</label>
            <input name="designation" value={formData.designation} onChange={onChange}
                   className="w-full border rounded-lg px-4 py-2" required />
          </div>

          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg">
            Add Employee
          </button>
        </form>

        {msg.ok && <p className="mt-4 text-green-600">{msg.ok}</p>}
        {msg.err && <p className="mt-4 text-red-600 break-words">{msg.err}</p>}
      </div>
    </div>
  );
}
