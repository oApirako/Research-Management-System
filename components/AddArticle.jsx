// AddArticle.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddArticle() {
  const [title, setTitle] = useState("");
  const [category, setCategory] =
    useState("Computer Science");
  const [type, setType] =
    useState("Research");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("title", title);
      formData.append("category", category);
      formData.append("type", type);

      if (file) {
        formData.append("file", file);
      }

      const res = await fetch(
        "/api/myarticle/add",
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert(data.message);
        router.push("/myarticle");
      } else {
        alert(
          data.message ||
          data.error ||
          "ไม่สามารถเพิ่มบทความได้"
        );
      }
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-8 bg-white shadow rounded mt-8">
      <h1 className="text-2xl font-bold mb-6">
        เพิ่มผลงาน
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <input
          type="text"
          className="w-full border px-3 py-2 rounded"
          placeholder="Title"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
          required
        />

        <select
          className="w-full border px-3 py-2 rounded"
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
        >
          <option>
            Computer Science
          </option>
          <option>
            Engineering
          </option>
        </select>

        <select
          className="w-full border px-3 py-2 rounded"
          value={type}
          onChange={(e) =>
            setType(e.target.value)
          }
        >
          <option>Research</option>
          <option>Review</option>
          <option>อื่นๆ</option>
        </select>

        <div className="flex flex-col">
          <input
            type="file"
            id="fileInput"
            className="hidden"
            accept="application/pdf"
            onChange={(e) =>
              setFile(e.target.files?.[0] || null)
            }
          />

          <button
            type="button"
            onClick={() =>
              document
                .getElementById("fileInput")
                .click()
            }
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            เลือกไฟล์เอกสาร
          </button>

          {file && (
            <span className="mt-2 max-w-xs truncate">
              {file.name}
            </span>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          {loading
            ? "กำลังบันทึก..."
            : "บันทึก"}
        </button>
      </form>
    </div>
  );
}