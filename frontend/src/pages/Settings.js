import React from 'react';

function AdminDashboard() {
  return (
    <div className="w-full min-h-screen bg-gray-100 px-6 py-10">
      {/* Header */}
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Welcome to the Admin Dashboard</h1>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-gray-500 text-sm font-medium">Total Employees</h2>
          <p className="mt-2 text-2xl font-bold text-gray-900">--</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-gray-500 text-sm font-medium">Present Today</h2>
          <p className="mt-2 text-2xl font-bold text-gray-900">--</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-gray-500 text-sm font-medium">Absent Today</h2>
          <p className="mt-2 text-2xl font-bold text-gray-900">--</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-gray-500 text-sm font-medium">Leave Pending</h2>
          <p className="mt-2 text-2xl font-bold text-gray-900">--</p>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
