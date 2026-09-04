"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function UsersPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const getUserTypeName = (type) => {
    switch (Number(type)) {
      case 1:
        return "Teacher";
      case 2:
        return "Staff";
      case 3:
        return "Admin";
      case 4:
        return "Pending";
      default:
        return "Unknown";
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile", {
          method: "GET",
          credentials: "include",
        });

        const text = await res.text();

        let data = {};

        try {
          data = text ? JSON.parse(text) : {};
        } catch {
          data = {};
        }

        if (!res.ok) {
          router.push("/login");
          return;
        }

        setUser({
          ...data,
          user_type: Number(data.user_type),
        });
      } catch (error) {
        console.error(error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        router.push("/login");
      } else {
        alert("Logout failed");
      }
    } catch (error) {
      console.error(error);
      alert("เกิดข้อผิดพลาดในการ Logout");
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
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl mb-4">
        My Profile
      </h1>

      <div className="border p-4 rounded shadow bg-white space-y-2">
        <p>
          <strong>ID:</strong>{" "}
          {user.user_id}
        </p>

        <p>
          <strong>Name:</strong>{" "}
          {user.user_name}
        </p>

        <p>
          <strong>Email:</strong>{" "}
          {user.user_email}
        </p>

        <p>
          <strong>Type:</strong>{" "}
          {getUserTypeName(
            user.user_type
          )}
        </p>
      </div>

      <Link
        href="/resetpassword"
        className="block bg-blue-500 text-white p-2 w-full mt-4 text-center rounded hover:bg-blue-600"
      >
        Reset Password / Edit Name
      </Link>

      <button
        onClick={handleLogout}
        className="bg-red-500 text-white p-2 w-full mt-2 hover:bg-red-600 rounded"
      >
        Logout
      </button>
    </div>
  );
}