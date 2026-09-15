"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function ArticleDetail() {
  const params = useParams();
  const id = params?.id;

  const router = useRouter();

  const [article, setArticle] =
    useState(null);

  const [statuses, setStatuses] =
    useState([]);

  const [selectedStatus, setSelectedStatus] =
    useState("");

  const [newComment, setNewComment] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const fetchArticle = async () => {
    try {
      const res = await fetch(
        `/api/notification/${id}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data =
        await res.json();

      if (!res.ok) {
        alert(
          data.error ||
            data.message ||
            "ไม่สามารถโหลดบทความได้"
        );

        router.push(
          "/notification"
        );

        return;
      }

      setArticle(data);
      setSelectedStatus(
        data.article__status
      );
    } catch (error) {
      console.error(error);
      alert(
        "เกิดข้อผิดพลาดในการโหลดบทความ"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchStatuses = async () => {
    try {
      const res = await fetch(
        "/api/notification/status",
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data =
        await res.json();

      if (!res.ok) {
        return;
      }

      setStatuses(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleSave = async () => {
    if (!id) {
      return;
    }

    try {
      const res = await fetch(
        `/api/notification/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            article_status:
              selectedStatus,
            n_comment:
              newComment,
          }),
        }
      );

      const data =
        await res.json();

      if (!res.ok) {
        alert(
          data.error ||
            data.message ||
            "ไม่สามารถบันทึกได้"
        );

        return;
      }

      alert(
        data.message ||
          "บันทึกเรียบร้อย"
      );

      router.push(
        "/notification"
      );
    } catch (error) {
      console.error(error);
      alert(
        "เกิดข้อผิดพลาด"
      );
    }
  };

  useEffect(() => {
    if (!id) {
      return;
    }

    fetchStatuses();
    fetchArticle();
  }, [id]);

  if (loading) {
    return (
      <p>Loading...</p>
    );
  }

  if (!article) {
    return null;
  }

  return (
    <div>
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6 space-y-6">
        <h1 className="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">
          รายละเอียดบทความ
        </h1>

        <div className="space-y-2">
          <label className="font-semibold">
            ชื่อผู้สร้าง:
          </label>

          <p>
            {article.user_name}
          </p>
        </div>

        <div className="space-y-2">
          <label className="font-semibold">
            ชื่อบทความ:
          </label>

          <p>
            {article.article_title}
          </p>
        </div>

        <div className="space-y-2">
          <label className="font-semibold">
            Link บทความ:
          </label>

          <a
            href={article.article_link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            ดูเนื้อหา
          </a>
        </div>

        <div className="space-y-2">
          <label className="font-semibold">
            เพิ่ม comment:
          </label>

          <textarea
            value={newComment}
            onChange={(e) =>
              setNewComment(
                e.target.value
              )
            }
            className="border p-3 rounded w-full"
            placeholder="พิมพ์ comment ใหม่"
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <label className="font-semibold">
            สถานะบทความ:
          </label>

          <select
            value={selectedStatus}
            onChange={(e) =>
              setSelectedStatus(
                e.target.value
              )
            }
            className="border p-3 rounded w-full"
          >
            {statuses.map(
              (status) => (
                <option
                  key={status}
                  value={status}
                >
                  {status}
                </option>
              )
            )}
          </select>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            บันทึก
          </button>
        </div>
      </div>
    </div>
  );
}