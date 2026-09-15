import "./globals.css";
import Navbar from "@/components/Navbar";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">

        <Navbar />

        <main className="flex-1 p-6 md:p-8 lg:p-12">
          {children}
        </main>

        <footer className="bg-white shadow-inner mt-auto py-4 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Your Company. All rights reserved.
        </footer>

      </body>
    </html>
  );
}