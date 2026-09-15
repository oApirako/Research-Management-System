"use client";

import { useEffect, useState } from "react";

export default function HistoryArticle({ id }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchHistory = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await fetch(
          `/api/myarticle/${id}/history`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data = await res.json();

        if (!res.ok) {
          setHistory([]);

          setError(
            data.message ||
              data.error ||
              "ไม่สามารถโหลดประวัติได้"
          );

          return;
        }

        setHistory(
          Array.isArray(data)
            ? data
            : []
        );
      } catch (err) {
        console.error(err);

        setHistory([]);
        setError(
          "เกิดข้อผิดพลาดในการโหลดประวัติ"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [id]);

  if (loading) {
    return (
      <p className="text-center py-6">
        Loading...
      </p>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg p-6">
        <p className="text-red-500 text-center">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
          Article History
        </h1>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-3 text-left text-gray-700 font-semibold">
                  วันที่ / เวลา
                </th>

                <th className="border px-4 py-3 text-left text-gray-700 font-semibold">
                  Source
                </th>

                <th className="border px-4 py-3 text-left text-gray-700 font-semibold">
                  Comment
                </th>
              </tr>
            </thead>

            <tbody>
              {history.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="text-center py-6 text-gray-500"
                  >
                    ไม่มีประวัติ
                  </td>
                </tr>
              ) : (
                history.map((item) => (
                  <tr
                    key={`${item.source}-${item.id}`}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="border px-4 py-2">
                      {item.date
                        ? new Date(
                            item.date
                          ).toLocaleString(
                            "th-TH",
                            {
                              dateStyle:
                                "medium",
                              timeStyle:
                                "medium",
                            }
                          )
                        : "-"}
                    </td>

                    <td className="border px-4 py-2">
                      {item.source ===
                      "history"
                        ? "แสดงการแก้ไข"
                        : "การอนุมัติ / คำแนะนำ"}
                    </td>

                    <td className="border px-4 py-2">
                      {item.comment ||
                        "ไม่มีความคิดเห็น"}
                    </td>
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