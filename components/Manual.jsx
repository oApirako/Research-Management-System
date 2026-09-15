"use client";

import { useEffect, useState } from "react";

const INSTRUCTIONS = [
  {
    file: "teacher.txt",
    show: (user) => user === "Teacher",
  },
  {
    file: "articles.txt",
    show: () => true,
  },
  {
    file: "staff_conclusion.txt",
    show: (user) => user === "Staff",
  },
  {
    file: "staff_notification.txt",
    show: (user) => user === "Staff",
  },
  {
    file: "admin_useredit.txt",
    show: (user) => user === "Admin",
  },
  {
    file: "admin_history.txt",
    show: (user) => user === "Admin",
  },
];

export default function ManualPage() {
  const [userType, setUserType] = useState("Unknown");
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  const mapUserType = (type) => {
    const value = Number(type);

    if (value === 1) return "Teacher";
    if (value === 2) return "Staff";
    if (value === 3) return "Admin";

    return "Unknown";
  };

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await fetch("/api/me", {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          setUserType("Unknown");
          return;
        }

        const data = await res.json();

        setUserType(
          mapUserType(data.user_type)
        );
      } catch (error) {
        console.error(error);
        setUserType("Unknown");
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchInstructions = async () => {
      setLoading(true);

      try {
        const visibleInstructions =
          INSTRUCTIONS.filter(({ show }) =>
            show(userType)
          );

        const results = await Promise.all(
          visibleInstructions.map(
            async ({ file }) => {
              try {
                const res = await fetch(
                  `/manual/instructions/${file}`
                );

                if (!res.ok) {
                  return null;
                }

                return await res.text();
              } catch (error) {
                console.error(
                  `Cannot load ${file}:`,
                  error
                );

                return null;
              }
            }
          )
        );

        setSections(
          results.filter(Boolean)
        );
      } catch (error) {
        console.error(error);
        setSections([]);
      } finally {
        setLoading(false);
      }
    };

    if (userType) {
      fetchInstructions();
    }
  }, [userType]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-8">
        <p>กำลังโหลด...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">
        คู่มือการใช้งานระบบเผยแพร่บทความ
      </h1>

      <div className="mb-6">
        <label className="font-semibold mr-2">
          ประเภทผู้ใช้:
        </label>

        <span className="border p-2 rounded bg-gray-100">
          {userType}
        </span>
      </div>

      {sections.map((txt, i) => (
        <div key={i} className="mb-8">
          {txt
            .split(/\r?\n/)
            .map((line, idx) => {
              const imgMatch = line.match(
                /^!\[(.*)\]\((.*)\|(\d*\.?\d+)\)$/
              );

              if (imgMatch) {
                const [
                  ,
                  alt,
                  url,
                  sizeStr,
                ] = imgMatch;

                const size =
                  parseFloat(sizeStr) || 1;

                return (
                  <ManualImage
                    key={idx}
                    alt={alt}
                    url={url}
                    size={size}
                  />
                );
              }

              return (
                <pre
                  key={idx}
                  className="whitespace-pre-wrap font-sans text-base mb-1"
                >
                  {line}
                </pre>
              );
            })}

          {i < sections.length - 1 && (
            <hr className="border-t my-4" />
          )}
        </div>
      ))}
    </div>
  );
}

function ManualImage({
  alt,
  url,
  size,
}) {
  const [imgDims, setImgDims] =
    useState({
      width: 0,
      height: 0,
    });

  useEffect(() => {
    const img = new window.Image();

    img.onload = () => {
      setImgDims({
        width: img.width,
        height: img.height,
      });
    };

    img.src = url;

    return () => {
      img.onload = null;
    };
  }, [url]);

  const width = imgDims.width
    ? imgDims.width * size
    : undefined;

  const height = imgDims.height
    ? imgDims.height * size
    : undefined;

  return (
    <div className="my-4 flex justify-center">
      <img
        src={url}
        alt={alt}
        width={width}
        height={height}
        style={{
          maxWidth: "100%",
          height: "auto",
        }}
      />
    </div>
  );
}