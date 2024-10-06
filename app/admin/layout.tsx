"use client"
import { useRouter } from "next/navigation";

export default function AdminLayout({ children }) {
  const router = useRouter();
  return (
    <div className="container mx-auto p-4">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <a href="/logout" className="text-red-600">
          Logout
        </a>
      </header>
      <button onClick={router.back} className="text-blue-400">Back</button>
      <main className="mt-4">{children}</main>
    </div>
  );
}
