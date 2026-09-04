// ArticleList.jsx
"use client";

import { useState, useEffect } from "react";

const ARTICLE_TYPES = ["Research", "Review", "อื่นๆ"];

function getYears() {
  const y = new Date().getFullYear();

  return Array.from(
    { length: 10 },
    (_, i) => String(y - i)
  );
}

export default function ArticlesPage() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [owner, setOwner] = useState("");
  const [type, setType] = useState("");
  const [year, setYear] = useState("");
  const [page, setPage] = useState(1);

  const pageSize = 4;

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);

      try {
        const params = new URLSearchParams();

        if (search) {
          params.set("search", search);
        }

        if (owner) {
          params.set("owner", owner);
        }

        if (type) {
          params.set("type", type);
        }

        if (year) {
          params.set("year", year);
        }

        params.set("page", String(page));

        const res = await fetch(
          `/api/articles?${params.toString()}`,
          {
            method: "GET",
          }
        );

        // อ่านเป็น text ก่อน
        // ป้องกัน Unexpected end of JSON input
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
          setItems([]);
          setTotal(0);

          console.error(
            data.message ||
              data.error ||
              `Request failed (${res.status})`
          );

          return;
        }

        setItems(
          Array.isArray(data.items)
            ? data.items
            : []
        );

        setTotal(
          Number(data.total) || 0
        );
      } catch (error) {
        console.error(
          "Fetch articles error:",
          error
        );

        setItems([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [
    search,
    owner,
    type,
    year,
    page,
  ]);

  const pages = Math.ceil(
    total / pageSize
  );

  const visiblePages = Array.from(
    {
      length: Math.min(5, pages),
    },
    (_, i) => {
      let start = Math.max(
        1,
        page - 2
      );

      if (start + 4 > pages) {
        start = Math.max(
          1,
          pages - 4
        );
      }

      return start + i;
    }
  );

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleOwnerChange = (e) => {
    setOwner(e.target.value);
    setPage(1);
  };

  const handleTypeChange = (e) => {
    setType(e.target.value);
    setPage(1);
  };

  const handleYearChange = (e) => {
    setYear(e.target.value);
    setPage(1);
  };

  return (
    <div className="flex max-w-6xl mx-auto p-6 gap-6">

      {/* =========================
          Sidebar
      ========================== */}
      <aside className="w-64 bg-gray-50 p-4 rounded border h-fit">

        <div className="mb-4">
          <label className="block font-semibold mb-2">
            ค้นหาชื่อเจ้าของ
          </label>

          <input
            type="text"
            className="border p-2 w-full rounded"
            value={owner}
            onChange={handleOwnerChange}
            placeholder="ชื่อเจ้าของผลงาน"
          />
        </div>

        <div className="mb-6">
          <label className="block font-semibold mb-2">
            ประเภทบทความ
          </label>

          <select
            className="border p-2 w-full rounded"
            value={type}
            onChange={handleTypeChange}
          >
            <option value="">
              ทั้งหมด
            </option>

            {ARTICLE_TYPES.map((t) => (
              <option
                key={t}
                value={t}
              >
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-2">
            ปีที่เผยแพร่
          </label>

          <select
            className="border p-2 w-full rounded"
            value={year}
            onChange={handleYearChange}
          >
            <option value="">
              ทั้งหมด
            </option>

            {getYears().map((y) => (
              <option
                key={y}
                value={y}
              >
                {y}
              </option>
            ))}
          </select>
        </div>
      </aside>

      {/* =========================
          Main Content
      ========================== */}
      <main className="flex-1">

        {/* Search */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">
            ค้นหาด้วยชื่อเรื่อง
          </label>

          <input
            className="border p-2 w-full rounded"
            value={search}
            onChange={handleSearchChange}
            placeholder="ค้นหาบทความ..."
          />
        </div>

        <h1 className="text-2xl font-semibold mb-4">
          บทความที่อนุมัติแล้ว

          <span className="ml-2 text-base font-normal text-gray-600">
            ({total} รายการ)
          </span>
        </h1>

        {/* Loading */}
        {loading ? (
          <div>
            กำลังโหลด...
          </div>
        ) : items.length === 0 ? (
          /* Empty */
          <div>
            ไม่พบบทความ
          </div>
        ) : (
          <>
            {/* =========================
                Article Cards
            ========================== */}
            <div className="flex flex-col gap-6 mb-6">
              {items.map((a, i) => (
                <div
                  key={a.article_id}
                  className="flex flex-col border rounded-lg shadow-sm p-4 bg-white w-full"
                >
                  <div className="mb-2 text-sm text-gray-500">
                    #
                    {(
                      (page - 1) *
                        pageSize +
                      i +
                      1
                    )}
                  </div>

                  <div className="font-bold text-lg mb-1">
                    {a.article_title}
                  </div>

                  <div className="mb-1 text-gray-700">
                    ประเภท:{" "}
                    {a.article_type || "-"}
                  </div>

                  <div className="mb-1 text-gray-700">
                    วันที่:{" "}
                    {a.n_dare
                      ? new Date(
                          a.n_dare
                        ).toLocaleDateString(
                          "th-TH"
                        )
                      : "-"}
                  </div>

                  <div className="mb-2 text-gray-700">
                    สถานะ:{" "}
                    {a.article__status || "-"}
                  </div>

                  <div className="mb-2 text-gray-700">
                    เจ้าของ:{" "}
                    {a.owner_name || "-"}
                  </div>

                  {a.article_link && (
                    <div className="mb-2 text-gray-700 break-all">
                      ลิงก์:{" "}
                      <a
                        href={a.article_link}
                        className="text-blue-600 underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {a.article_link}
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* =========================
                Pagination
            ========================== */}
            {pages > 1 && (
              <div className="flex gap-2 justify-center items-center">

                {/* Previous */}
                <button
                  disabled={page === 1}
                  onClick={() =>
                    setPage((p) =>
                      Math.max(1, p - 1)
                    )
                  }
                  className={`px-3 py-1 rounded border ${
                    page === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white hover:bg-gray-100"
                  }`}
                >
                  &lt;
                </button>

                {/* Page numbers */}
                {visiblePages.map((p) => (
                  <button
                    key={p}
                    className={`px-3 py-1 rounded border ${
                      page === p
                        ? "bg-blue-600 text-white"
                        : "bg-white hover:bg-gray-100"
                    }`}
                    onClick={() =>
                      setPage(p)
                    }
                  >
                    {p}
                  </button>
                ))}

                {/* ... */}
                {pages > 5 && (
                  <>
                    {page < pages - 2 && (
                      <span>
                        ...
                      </span>
                    )}

                    <button
                      onClick={() =>
                        setPage(pages)
                      }
                      className={`px-3 py-1 rounded border ${
                        page === pages
                          ? "bg-blue-600 text-white"
                          : "bg-white hover:bg-gray-100"
                      }`}
                    >
                      {pages}
                    </button>
                  </>
                )}

                {/* Next */}
                <button
                  disabled={page === pages}
                  onClick={() =>
                    setPage((p) =>
                      Math.min(
                        pages,
                        p + 1
                      )
                    )
                  }
                  className={`px-3 py-1 rounded border ${
                    page === pages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white hover:bg-gray-100"
                  }`}
                >
                  &gt;
                </button>

              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}