"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const validatePassword = (password) =>
  /^(?=.*[A-Za-z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(
    password
  );

export default function ResetPasswordPage() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");

  const [password1, setPassword1] =
    useState("");

  const [password2, setPassword2] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const router = useRouter();

  // ==========================================
  // โหลดข้อมูล User ปัจจุบัน
  // ==========================================
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(
          "/api/profile",
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
          router.push("/login");
          return;
        }

        setUser(data);
        setName(
          data.user_name || ""
        );
      } catch (error) {
        console.error(error);

        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  // ==========================================
  // Save
  // ==========================================
  const handleSave = async () => {
    setMessage("");

    if (!name.trim()) {
      setMessage(
        "กรุณาระบุชื่อ"
      );
      return;
    }

    // ถ้าใส่ Password ต้องตรวจ Password
    if (
      password1 !== password2
    ) {
      setMessage(
        "รหัสผ่านไม่ตรงกัน"
      );
      return;
    }

    if (
      password1 &&
      !validatePassword(password1)
    ) {
      setMessage(
        "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษรและมีตัวอักษร + สัญลักษณ์พิเศษ"
      );
      return;
    }

    setSaving(true);

    try {
      const res = await fetch(
        "/api/resetpassword",
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            // ไม่ส่ง user_id
            user_name: name.trim(),
            user_password:
              password1 || undefined,
          }),
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

      if (res.ok) {
        alert(
          data.message ||
            "แก้ไขเรียบร้อย"
        );

        router.push("/");
      } else {
        setMessage(
          data.error ||
            data.message ||
            "ไม่สามารถแก้ไขข้อมูลได้"
        );
      }
    } catch (error) {
      console.error(error);

      setMessage(
        "เกิดข้อผิดพลาดในการเชื่อมต่อ"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <p className="p-6">
        Loading...
      </p>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl mb-4">
        Reset Password / Edit Profile
      </h1>

      <div className="space-y-4">
        {/* Name */}
        <div>
          <label className="block font-semibold">
            Name
          </label>

          <input
            className="border p-2 w-full rounded"
            value={name}
            onChange={(e) =>
              setName(
                e.target.value
              )
            }
          />
        </div>

        {/* New Password */}
        <div>
          <label className="block font-semibold">
            New Password
          </label>

          <input
            type="password"
            className="border p-2 w-full rounded"
            placeholder="เว้นว่างถ้าไม่เปลี่ยน"
            value={password1}
            onChange={(e) =>
              setPassword1(
                e.target.value
              )
            }
          />
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block font-semibold">
            Confirm Password
          </label>

          <input
            type="password"
            className="border p-2 w-full rounded"
            placeholder="เว้นว่างถ้าไม่เปลี่ยน"
            value={password2}
            onChange={(e) =>
              setPassword2(
                e.target.value
              )
            }
          />
        </div>

        {message && (
          <p className="text-red-500">
            {message}
          </p>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full disabled:opacity-50"
        >
          {saving
            ? "กำลังบันทึก..."
            : "บันทึก"}
        </button>
      </div>
    </div>
  );
}