"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditArticlePage() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [link, setLink] = useState("");
  const [newFile, setNewFile] = useState(null);
  const [comment, setComment] = useState("");

  const [categoryOptions, setCategoryOptions] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const fileInputRef = useRef(null);

  // ==========================================
  // ดึง ENUM ของ category และ type
  // ==========================================
  useEffect(() => {
    const fetchEnums = async () => {
      try {
        const fetchEnum = async (field) => {
          const res = await fetch(
            `/api/myarticle/enum?field=${encodeURIComponent(field)}`,
            {
              method: "GET",
              credentials: "include",
            }
          );

          if (!res.ok) {
            return [];
          }

          const data = await res.json();

          return Array.isArray(data) ? data : [];
        };

        const [categories, types] = await Promise.all([
          fetchEnum("article_category"),
          fetchEnum("article_type"),
        ]);

        setCategoryOptions(categories);
        setTypeOptions(types);
      } catch (error) {
        console.error(error);
      }
    };

    fetchEnums();
  }, []);

  // ==========================================
  // ดึงข้อมูลบทความ
  // ==========================================
  useEffect(() => {
    if (!id) {
      return;
    }

    const fetchArticle = async () => {
      setLoading(true);

      try {
        const res = await fetch(
          `/api/myarticle/${id}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data = await res.json();

        if (!res.ok) {
          alert(
            data.message ||
              data.error ||
              "ไม่สามารถโหลดข้อมูลบทความได้"
          );

          router.push("/myarticle");
          return;
        }

        setTitle(data.article_title || "");
        setCategory(data.article_category || "");
        setType(data.article_type || "");
        setLink(data.article_link || "");
      } catch (error) {
        console.error(error);
        alert("เกิดข้อผิดพลาดในการโหลดข้อมูล");
        router.push("/myarticle");
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id, router]);

  // ==========================================
  // เลือกไฟล์ใหม่
  // ==========================================
  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) {
      setNewFile(null);
      return;
    }

    // ตรวจเบื้องต้นที่ Client
    if (selectedFile.type !== "application/pdf") {
      alert("รองรับเฉพาะไฟล์ PDF");
      e.target.value = "";
      setNewFile(null);
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      alert("ไฟล์ต้องมีขนาดไม่เกิน 5 MB");
      e.target.value = "";
      setNewFile(null);
      return;
    }

    setNewFile(selectedFile);
  };

  // ==========================================
  // บันทึกการแก้ไข
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!id) {
      alert("ไม่พบ Article ID");
      return;
    }

    if (!title.trim()) {
      alert("กรุณาระบุชื่อบทความ");
      return;
    }

    setSaving(true);

    try {
      const formData = new FormData();

      formData.append("title", title.trim());
      formData.append("category", category);
      formData.append("type", type);
      formData.append("comment", comment);

      if (newFile) {
        formData.append("file", newFile);
      }

      const res = await fetch(
        `/api/myarticle/${id}`,
        {
          method: "PUT",
          credentials: "include",
          body: formData,
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert(
          data.message ||
            "อัปเดตบทความเรียบร้อย"
        );

        router.push("/myarticle");
        return;
      }

      alert(
        data.message ||
          data.error ||
          "ไม่สามารถแก้ไขบทความได้"
      );
    } catch (error) {
      console.error(error);
      alert("เกิดข้อผิดพลาดในการแก้ไขบทความ");
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // Loading
  // ==========================================
  if (loading) {
    return (
      <div className="max-w-lg mx-auto p-8">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto p-8 bg-white shadow rounded mt-8">
      <h1 className="text-2xl font-bold mb-6">
        แก้ไขผลงาน
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        {/* Title */}
        <div>
          <label className="block mb-1 font-medium">
            Title
          </label>

          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            placeholder="Title"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block mb-1 font-medium">
            Category
          </label>

          <select
            className="w-full border px-3 py-2 rounded"
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
          >
            <option value="">
              -- เลือก Category --
            </option>

            {categoryOptions.map((c) => (
              <option
                key={c}
                value={c}
              >
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Type */}
        <div>
          <label className="block mb-1 font-medium">
            Type
          </label>

          <select
            className="w-full border px-3 py-2 rounded"
            value={type}
            onChange={(e) =>
              setType(e.target.value)
            }
          >
            <option value="">
              -- เลือก Type --
            </option>

            {typeOptions.map((t) => (
              <option
                key={t}
                value={t}
              >
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* File */}
        <div>
          <label className="block mb-1 font-medium">
            ไฟล์ PDF
          </label>

          <button
            type="button"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() =>
              fileInputRef.current?.click()
            }
          >
            เลือกไฟล์
          </button>

          <input
            type="file"
            ref={fileInputRef}
            accept="application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />

          {newFile ? (
            <div className="text-sm text-gray-700 truncate mt-2">
              ไฟล์ใหม่: {newFile.name}
            </div>
          ) : link ? (
            <div className="text-sm text-gray-700 truncate mt-2">
              ไฟล์เดิม:{" "}
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                {link.split("/").pop()}
              </a>
            </div>
          ) : (
            <div className="text-sm text-gray-500 mt-2">
              ยังไม่มีไฟล์
            </div>
          )}
        </div>

        {/* Comment */}
        <div>
          <label className="block mb-1 font-medium">
            Comment
          </label>

          <textarea
            className="w-full border px-3 py-2 rounded"
            placeholder="Comment"
            value={comment}
            onChange={(e) =>
              setComment(e.target.value)
            }
            rows={4}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={saving}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition disabled:opacity-50"
        >
          {saving
            ? "กำลังบันทึก..."
            : "บันทึกการแก้ไข"}
        </button>
      </form>
    </div>
  );
}