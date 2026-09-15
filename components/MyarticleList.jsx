"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function MyArticleList() {
  const [articles, setArticles] = useState([]);
  const [filters, setFilters] = useState({
    startYear: "",
    endYear: "",
    type: "",
  });

  const [loading, setLoading] = useState(false);

  const fetchArticles = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/myarticle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(filters),
      });

      // อ่านเป็น text ก่อน เพื่อป้องกัน
      // Unexpected end of JSON input
      const text = await res.text();

      let data = {};

      try {
        data = text ? JSON.parse(text) : {};
      } catch (error) {
        console.error(
          "Invalid JSON response:",
          text
        );

        data = {};
      }

      if (!res.ok) {
        setArticles([]);

        alert(
          data.message ||
            data.error ||
            `Request failed (${res.status})`
        );

        return;
      }

      setArticles(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (error) {
      console.error(error);

      setArticles([]);

      alert(
        "เกิดข้อผิดพลาดในการโหลดบทความ"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("ลบผลงานนี้?")) {
      return;
    }

    try {
      const res = await fetch(
        `/api/myarticle?id=${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const text = await res.text();

      let data = {};

      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        data = {};
      }

      if (!res.ok) {
        alert(
          data.message ||
            data.error ||
            `Delete failed (${res.status})`
        );

        return;
      }

      alert(
        data.message ||
          "ลบบทความเรียบร้อย"
      );

      fetchArticles();
    } catch (error) {
      console.error(error);

      alert("เกิดข้อผิดพลาด");
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleFilter = () => {
    fetchArticles();
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        My Articles
      </h1>

      {/* Filter */}
      <div className="flex flex-wrap gap-2 mb-4 items-center">
        <Link
          href="/myarticle/add"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          เพิ่มผลงาน
        </Link>

        <input
          type="number"
          name="startYear"
          placeholder="ปีเริ่มต้น"
          value={filters.startYear}
          onChange={handleFilterChange}
          className="border px-2 py-1 rounded"
        />

        <input
          type="number"
          name="endYear"
          placeholder="ปีสิ้นสุด"
          value={filters.endYear}
          onChange={handleFilterChange}
          className="border px-2 py-1 rounded"
        />

        <select
          name="type"
          value={filters.type}
          onChange={handleFilterChange}
          className="border px-2 py-1 rounded"
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
          onClick={handleFilter}
          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
        >
          ค้นหา
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto shadow rounded border border-gray-300">
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2 text-left">
                  Title
                </th>

                <th className="border px-4 py-2 text-left">
                  Category
                </th>

                <th className="border px-4 py-2 text-left">
                  Type
                </th>

                <th className="border px-4 py-2 text-left">
                  Date
                </th>

                <th className="border px-4 py-2 text-left">
                  Status
                </th>

                <th className="border px-4 py-2 text-left">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {articles.map((article) => (
                <tr
                  key={article.article_id}
                  className="hover:bg-gray-50"
                >
                  <td className="border px-4 py-2">
                    {article.article_title}
                  </td>

                  <td className="border px-4 py-2">
                    {article.article_category}
                  </td>

                  <td className="border px-4 py-2">
                    {article.article_type}
                  </td>

                  <td className="border px-4 py-2">
                    {article.article_date
                      ? new Date(
                          article.article_date
                        ).toLocaleDateString(
                          "th-TH-u-ca-gregory"
                        )
                      : "-"}
                  </td>

                  <td className="border px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded text-white ${
                        article.article__status ===
                        "Pending"
                          ? "bg-yellow-500"
                          : article.article__status ===
                            "Approved"
                          ? "bg-green-500"
                          : article.article__status ===
                            "Revision"
                          ? "bg-blue-500"
                          : "bg-red-500"
                      }`}
                    >
                      {
                        article.article__status
                      }
                    </span>
                  </td>

                  <td className="border px-4 py-2 space-x-2">
                    <Link
                      href={`/myarticle/${article.article_id}/edit`}
                      className="bg-blue-100 text-blue-600 px-3 py-1 rounded hover:bg-blue-200"
                    >
                      แก้ไข
                    </Link>

                    <Link
                      href={`/myarticle/${article.article_id}/history`}
                      className="bg-orange-100 text-gray-600 px-3 py-1 rounded hover:bg-orange-200"
                    >
                      ประวัติ
                    </Link>

                    <button
                      onClick={() =>
                        handleDelete(
                          article.article_id
                        )
                      }
                      className="bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200"
                    >
                      ลบ
                    </button>
                  </td>
                </tr>
              ))}

              {articles.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-4 text-gray-500"
                  >
                    ไม่มีผลงาน
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}