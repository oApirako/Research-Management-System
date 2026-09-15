"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({
    user_name: "",
    user_email: "",
    user_password: "",
    user_type: "1",
  });
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const fetchUsers = async (query = "") => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `/api/useredit?q=${encodeURIComponent(query)}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Unable to load users");
        setUsers([]);
        return;
      }

      setUsers(data);
    } catch (err) {
      console.error(err);
      setError("Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const mapUserType = (type) => {
    const value = String(type);

    if (value === "1") return "Teacher";
    if (value === "2") return "Staff";
    return "Admin";
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure to delete this user?")) {
      return;
    }

    try {
      const res = await fetch("/api/useredit", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          user_id: id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Delete failed");
        return;
      }

      alert("User deleted");

      fetchUsers(search);
    } catch (err) {
      console.error(err);
      alert("Unable to connect to server");
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user.user_id);

    setForm({
      user_name: user.user_name,
      user_email: user.user_email,
      user_password: "",
      user_type: String(user.user_type),
    });
  };

  const handleSubmit = async () => {
    if (!form.user_name || !form.user_email) {
      alert("Please enter name and email");
      return;
    }

    try {
      const res = await fetch("/api/useredit", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          ...form,
          user_id: editingUser,
          user_type: Number(form.user_type),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Update failed");
        return;
      }

      alert("User updated");

      setEditingUser(null);

      setForm({
        user_name: "",
        user_email: "",
        user_password: "",
        user_type: "1",
      });

      fetchUsers(search);
    } catch (err) {
      console.error(err);
      alert("Unable to connect to server");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">
          Manage Users
        </h1>

        <Link
          href="/register"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Add User
        </Link>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          className="border p-2 flex-1"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          onClick={() => fetchUsers(search)}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Search
        </button>
      </div>

      {editingUser && (
        <div className="mb-4 p-4 border rounded flex flex-wrap gap-2 items-center">
          <input
            type="text"
            className="border p-2 flex-1 min-w-[200px]"
            value={form.user_name}
            onChange={(e) =>
              setForm({
                ...form,
                user_name: e.target.value,
              })
            }
          />

          <input
            type="email"
            className="border p-2 flex-1 min-w-[200px]"
            value={form.user_email}
            onChange={(e) =>
              setForm({
                ...form,
                user_email: e.target.value,
              })
            }
          />

          <input
            type="password"
            className="border p-2 flex-1 min-w-[200px]"
            placeholder="New password (optional)"
            value={form.user_password}
            onChange={(e) =>
              setForm({
                ...form,
                user_password: e.target.value,
              })
            }
          />

          <select
            className="border p-2 min-w-[150px]"
            value={form.user_type}
            onChange={(e) =>
              setForm({
                ...form,
                user_type: e.target.value,
              })
            }
          >
            <option value="1">Teacher</option>
            <option value="2">Staff</option>
            <option value="3">Admin</option>
          </select>

          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Update
          </button>
        </div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2">
                  User ID
                </th>

                <th className="border px-4 py-2">
                  User Name
                </th>

                <th className="border px-4 py-2">
                  Email
                </th>

                <th className="border px-4 py-2">
                  User Type
                </th>

                <th className="border px-4 py-2">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr
                  key={user.user_id}
                  className="hover:bg-gray-50"
                >
                  <td className="border px-4 py-2">
                    {user.user_id}
                  </td>

                  <td className="border px-4 py-2">
                    {user.user_name}
                  </td>

                  <td className="border px-4 py-2">
                    {user.user_email}
                  </td>

                  <td className="border px-4 py-2">
                    {mapUserType(user.user_type)}
                  </td>

                  <td className="border px-4 py-2 flex gap-2">
                    <button
                      className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                      onClick={() =>
                        handleEdit(user)
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      onClick={() =>
                        handleDelete(user.user_id)
                      }
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}