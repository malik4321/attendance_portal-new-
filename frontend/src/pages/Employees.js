// src/pages/Employees.js (or wherever this component lives)
import React, { useEffect, useState } from "react";
import api from "../utils/axiosInstance";
import { toast } from "react-toastify";

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const fetchEmployees = async () => {
    setLoading(true);
    setErr("");
    try {
      // ✅ relative to baseURL "http://localhost:8000/api/"
      const { data } = await api.get("employees/all/");
      setEmployees(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("❌ Error fetching employees:", error?.response || error);
      setErr(
        error?.response?.data?.detail ||
          error?.message ||
          "Failed to load employees"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const confirmDelete = (id) => {
    setEmployeeToDelete(id);
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (!employeeToDelete) return;
    try {
      // ✅ relative path; backend route: /api/employees/delete/<pk>/
      await api.delete(`employees/delete/${employeeToDelete}/`);
      setEmployees((prev) => prev.filter((e) => e.id !== employeeToDelete));
      toast.success("✅ Employee deleted successfully!");
    } catch (error) {
      console.error("❌ Error deleting employee:", error?.response || error);
      toast.error("❌ Failed to delete employee.");
    } finally {
      setShowModal(false);
      setEmployeeToDelete(null);
    }
  };

  const filteredEmployees = employees.filter((emp) =>
    (emp.username || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h2 className="text-3xl font-semibold mb-6 text-gray-800">Employee List</h2>

      <div className="flex items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by username..."
          className="border px-4 py-2 rounded w-full max-w-sm"
          onChange={(e) => setSearchTerm(e.target.value)}
          value={searchTerm}
        />
        <button
          onClick={fetchEmployees}
          className="px-3 py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm"
        >
          Refresh
        </button>
      </div>

      {loading && <div className="text-gray-600">Loading employees…</div>}
      {err && !loading && (
        <div className="mb-4 p-3 rounded bg-red-50 text-red-700 border border-red-200">
          {err}
        </div>
      )}

      {!loading && filteredEmployees.length === 0 && !err && (
        <div className="text-gray-500">No employees found.</div>
      )}

      {!loading && filteredEmployees.length > 0 && (
        <table className="w-full border-collapse border shadow-sm bg-white rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2 text-left">Username</th>
              <th className="border px-4 py-2 text-left">Designation</th>
              <th className="border px-4 py-2 text-left">Leave Balance</th>
              <th className="border px-4 py-2 text-left">Join Date</th>
              <th className="border px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((emp) => (
              <tr key={emp.id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{emp.username}</td>
                <td className="border px-4 py-2">{emp.designation}</td>
                <td className="border px-4 py-2">{emp.leave_balance}</td>
                <td className="border px-4 py-2">{emp.join_date}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => confirmDelete(emp.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-[90%] max-w-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Delete Employee</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this employee? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm rounded bg-gray-200 hover:bg-gray-300 text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm rounded bg-red-600 hover:bg-red-700 text-white"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmployeeList;
