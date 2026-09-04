"use client";

import { useEffect, useState, useRef } from "react";

export default function ConclusionPage() {
  const [data, setData] = useState(null);

  const [filters, setFilters] = useState({
    author: "",
    startYear: "",
    endYear: "",
    type: "",
  });

  const [loading, setLoading] = useState(false);

  const reportRef = useRef(null);

  const fetchData = async () => {
    setLoading(true);

    try {
      const query =
        new URLSearchParams(filters).toString();

      const res = await fetch(
        `/api/conclusion?${query}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const text = await res.text();

      let json = {};

      try {
        json = text ? JSON.parse(text) : {};
      } catch {
        json = {};
      }

      if (!res.ok) {
        setData(null);

        alert(
          json.message ||
            json.error ||
            `Request failed (${res.status})`
        );

        return;
      }

      setData(json);
    } catch (error) {
      console.error(error);
      setData(null);

      alert(
        "เกิดข้อผิดพลาดในการโหลดข้อมูล"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearch = () => {
    fetchData();
  };

  const handlePrintPDF = () => {
    if (!reportRef.current) {
      return;
    }

    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        รายงานสรุปผลงานตีพิมพ์
      </h1>

      <div className="grid grid-cols-5 gap-4 mb-8 bg-gray-50 p-4 rounded-lg shadow">
        <input
          type="text"
          name="author"
          placeholder="ชื่อผู้แต่ง"
          value={filters.author}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <input
          type="number"
          name="startYear"
          placeholder="ปีเริ่มต้น"
          value={filters.startYear}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <input
          type="number"
          name="endYear"
          placeholder="ปีสิ้นสุด"
          value={filters.endYear}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <select
          name="type"
          value={filters.type}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="">
            -- ประเภทงาน --
          </option>

          <option value="Research">
            Research
          </option>

          <option value="Review">
            Review
          </option>

          <option value="อื่นๆ">
            อื่นๆ
          </option>
        </select>

        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          ค้นหา
        </button>
      </div>

      <div className="mb-4">
        <button
          onClick={handlePrintPDF}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          บันทึกเป็น PDF
        </button>
      </div>

      <div ref={reportRef}>
        {loading ? (
          <p className="text-gray-500">
            กำลังโหลด...
          </p>
        ) : data ? (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">
              พบผลงานทั้งหมด{" "}
              {data.total} รายการ
            </h2>

            <div className="bg-green-50 p-4 rounded-lg shadow">
              <h3 className="font-bold text-green-800 mb-2">
                สรุปจำนวนตามประเภท
              </h3>

              <ul className="list-disc list-inside text-gray-700">
                {Object.entries(
                  data.summary || {}
                ).map(
                  ([type, count]) => (
                    <li key={type}>
                      {type}:{" "}
                      <span className="font-semibold">
                        {count}
                      </span>{" "}
                      ชิ้น
                    </li>
                  )
                )}
              </ul>
            </div>

            <div className="overflow-x-auto shadow rounded-lg">
              <table className="min-w-full text-sm text-left border">
                <thead className="bg-gray-200 text-gray-700">
                  <tr>
                    <th className="border px-4 py-2">
                      ID
                    </th>
                    <th className="border px-4 py-2">
                      ชื่อเรื่อง
                    </th>
                    <th className="border px-4 py-2">
                      ประเภท
                    </th>
                    <th className="border px-4 py-2">
                      ปี
                    </th>
                    <th className="border px-4 py-2">
                      ผู้แต่ง
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {(data.results || []).map(
                    (item) => (
                      <tr
                        key={item.article_id}
                        className="hover:bg-gray-50 transition"
                      >
                        <td className="border px-4 py-2">
                          {item.article_id}
                        </td>

                        <td className="border px-4 py-2">
                          {item.article_title}
                        </td>

                        <td className="border px-4 py-2">
                          {item.article_type}
                        </td>

                        <td className="border px-4 py-2">
                          {item.article_date
                            ? new Date(
                                item.article_date
                              ).getFullYear()
                            : "-"}
                        </td>

                        <td className="border px-4 py-2">
                          {item.user_name}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">
            ไม่พบข้อมูล
          </p>
        )}
      </div>
    </div>
  );
}