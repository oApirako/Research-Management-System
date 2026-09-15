"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState("1");

  const [errors, setErrors] = useState({
    userName: "",
    email: "",
    password: "",
  });

  const router = useRouter();

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePassword = (password) =>
    /^(?=.*[A-Za-z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(
      password
    );

  const handleRegister = async () => {
    let valid = true;

    const newErrors = {
      userName: "",
      email: "",
      password: "",
    };

    if (!userName.trim()) {
      newErrors.userName = "Username is required";
      valid = false;
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!validateEmail(email)) {
      newErrors.email = "Invalid email format";
      valid = false;
    }

    if (!password) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (!validatePassword(password)) {
      newErrors.password =
        "Password must be at least 8 characters, include letters and special characters";
      valid = false;
    }

    setErrors(newErrors);

    if (!valid) return;

    try {
      const res = await fetch("/api/useredit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          user_name: userName.trim(),
          user_password: password,
          user_email: email.trim(),
          user_type: Number(userType),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/editUser");
      } else {
        alert(data.error || "Failed to create user");
      }
    } catch (err) {
      console.error(err);
      alert("Unable to connect to server");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl mb-4">
        Create New User
      </h1>

      <div className="mb-2">
        <input
          className="border p-2 w-full"
          placeholder="Username"
          value={userName}
          onChange={(e) =>
            setUserName(e.target.value)
          }
        />

        {errors.userName && (
          <p className="text-red-500 text-sm mt-1">
            {errors.userName}
          </p>
        )}
      </div>

      <div className="mb-2">
        <input
          className="border p-2 w-full"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        {errors.email && (
          <p className="text-red-500 text-sm mt-1">
            {errors.email}
          </p>
        )}
      </div>

      <div className="mb-2">
        <input
          className="border p-2 w-full"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        {errors.password && (
          <p className="text-red-500 text-sm mt-1">
            {errors.password}
          </p>
        )}
      </div>

      <select
        className="border p-2 w-full mb-2"
        value={userType}
        onChange={(e) =>
          setUserType(e.target.value)
        }
      >
        <option value="1">Teacher</option>
        <option value="2">Staff</option>
        <option value="3">Admin</option>
      </select>

      <button
        onClick={handleRegister}
        className="bg-blue-500 text-white p-2 w-full mt-2 hover:bg-blue-600"
      >
        Create User
      </button>
    </div>
  );
}