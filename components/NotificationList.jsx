"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function NotificationPage() {
  const [articles, setArticles] = useState([]);
  const [types, setTypes] = useState([]);

  const [searchName, setSearchName] =
    useState("");

  const [searchYear, setSearchYear] =
    useState("");

  const [searchType, setSearchType] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const fetchArticles = async () => {
    setLoading(true);

    try {
      const params =
        new URLSearchParams({
          name: searchName,
          year: searchYear,
          type: searchType,
        });

      const res = await fetch(
        `/api/notification?${params.toString()}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const text =
        await res.text();

      let data = {};

      try {
        data = text
          ? JSON.parse(text)
          : {};
      } catch {
        data = {};
      }

      if (!res.ok) {
        setArticles([]);
        setTypes([]);

        alert(
          data.message ||
            data.error ||
            "ไม่สามารถโหลดข้อมูลได้"
        );

        return;
      }

      setArticles(
        Array.isArray(data.articles)
          ? data.articles
          : []
      );

      setTypes(
        Array.isArray(data.types)
          ? data.types
          : []
      );
    } catch (error) {
      console.error(error);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        ตรวจสอบบทความ
      </h1>

      <div className="flex flex-wrap gap-4 mb-6 items-center bg-gray-50 p-4 rounded-lg shadow-sm">
        <input
          type="text"
          placeholder="ค้นหาชื่อผู้สร้าง"
          value={searchName}
          onChange={(e) =>
            setSearchName(e.target.value)
          }
          className="border rounded px-3 py-2"
        />

        <input
          type="number"
          placeholder="ปี"
          value={searchYear}
          onChange={(e) =>
            setSearchYear(e.target.value)
          }
          className="border rounded px-3 py-2"
        />

        <select
          value={searchType}
          onChange={(e) =>
            setSearchType(e.target.value)
          }
          className="border rounded px-3 py-2"
        >
          <option value="">
            ประเภทบทความทั้งหมด
          </option>

          {types.map((type) => (
            <option
              key={type}
              value={type}
            >
              {type}
            </option>
          ))}
        </select>

        <button
          onClick={fetchArticles}
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
        >
          ค้นหา
        </button>
      </div>

      <div className="overflow-x-auto shadow-lg rounded-lg bg-white">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              {[
                "ID",
                "Title",
                "Category",
                "Type",
                "Date",
                "Status",
                "Link",
              ].map((col) => (
                <th
                  key={col}
                  className="border px-4 py-3 text-left font-semibold"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-6"
                >
                  กำลังโหลด...
                </td>
              </tr>
            ) : articles.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-6 text-gray-500"
                >
                  ไม่พบข้อมูล
                </td>
              </tr>
            ) : (
              articles.map(
                (article) => (
                  <tr
                    key={
                      article.article_id
                    }
                    className="hover:bg-gray-50"
                  >
                    <td className="border px-4 py-2">
                      {
                        article.article_id
                      }
                    </td>

                    <td className="border px-4 py-2 font-medium">
                      {
                        article.article_title
                      }
                    </td>

                    <td className="border px-4 py-2">
                      {
                        article.article_category
                      }
                    </td>

                    <td className="border px-4 py-2">
                      {
                        article.article_type
                      }
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
                        className={`px-2 py-1 rounded text-white text-sm font-semibold ${
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

                    <td className="border px-4 py-2">
                      <Link
                        href={`/notification/detail/${article.article_id}`}
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                      >
                        ดูเนื้อหา
                      </Link>
                    </td>
                  </tr>
                )
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}