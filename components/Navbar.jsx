"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [userType, setUserType] = useState(null);
  const [mounted, setMounted] = useState(false);

  const Teacher = 1;
  const Staff = 2;
  const Admin = 3;

  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);

    const fetchCurrentUser = async () => {
      try {
        const res = await fetch("/api/me", {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          setUserType(null);
          return;
        }

        const data = await res.json();

        setUserType(Number(data.user_type));
      } catch (err) {
        console.error(err);
        setUserType(null);
      }
    };

    fetchCurrentUser();
  }, []);

  const linkClass = (href) =>
    `hover:text-blue-600 transition-colors relative font-medium ${
      pathname === href
        ? "text-blue-600 after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-blue-600"
        : ""
    }`;

  return (
    <nav className="bg-white shadow-md px-6 py-4">
      <div className="flex flex-wrap justify-between items-center gap-4">

        {/* เมนูด้านซ้าย */}
        <div className="flex flex-wrap gap-4 items-center">

          <Link href="/" className={linkClass("/")}>
            หน้าหลัก
          </Link>

          <Link
            href="/articles"
            className={linkClass("/articles")}
          >
            บทความวิชาการ
          </Link>

          <Link
            href="/manual"
            className={linkClass("/manual")}
          >
            คู่มือ
          </Link>

          {mounted && userType === Teacher && (
            <Link
              href="/myarticle"
              className={linkClass("/myarticle")}
            >
              บทความของฉัน
            </Link>
          )}

          {mounted && userType === Staff && (
            <>
              <Link
                href="/notification"
                className={linkClass("/notification")}
              >
                ตรวจสอบบทความ
              </Link>

              <Link
                href="/conclusion"
                className={linkClass("/conclusion")}
              >
                สรุป
              </Link>
            </>
          )}

          {mounted && userType === Admin && (
            <>
              <Link
                href="/editUser"
                className={linkClass("/editUser")}
              >
                อนุมัติบัญชี
              </Link>

              <Link
                href="/history"
                className={linkClass("/history")}
              >
                ประวัติการใช้งาน
              </Link>
            </>
          )}
        </div>

        {/* Users ด้านขวา */}
        <div className="flex gap-4 items-center">
          <Link
            href="/users"
            className={`bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded transition-colors font-medium ${
              pathname === "/users"
                ? "text-blue-600"
                : ""
            }`}
          >
            Users
          </Link>
        </div>

      </div>
    </nav>
  );
}