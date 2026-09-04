"use client";

import { useEffect, useState } from "react";

export default function HistoryPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch("/api/history");
        const data = await res.json();
        setLogs(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  const mapUserType = (type) => {
    if (type === "1") return "Teacher";
    if (type === "2") return "Staff";
    if (type === "3") return "Admin";
    return "Unknown";
  };

  if (loading) return <p className="text-center py-6">Loading...</p>;

  return (
    <div>
      <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">User Login History</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-gray-700 font-semibold">ลำดับ</th>
                <th className="px-4 py-3 text-left text-gray-700 font-semibold">User ID</th>
                <th className="px-4 py-3 text-left text-gray-700 font-semibold">User Name</th>
                <th className="px-4 py-3 text-left text-gray-700 font-semibold">User Type</th>
                <th className="px-4 py-3 text-left text-gray-700 font-semibold">Login Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-500">
                    ไม่มีข้อมูล
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.u_id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-2">{log.u_id}</td>
                    <td className="px-4 py-2">{log.user_id}</td>
                    <td className="px-4 py-2">{log.user_name}</td>
                    <td className="px-4 py-2">{mapUserType(log.user_type)}</td>
                    <td className="px-4 py-2">{new Date(log.u_date).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
