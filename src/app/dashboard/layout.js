"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DashboardLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") return <p className="text-center text-white">Loading...</p>;

  if (!session) {
    router.push("/login");
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <aside className="w-64 bg-gray-800 p-6">
        <h2 className="text-2xl font-bold text-center">⚡ Dashboard</h2>
        <nav className="mt-6 space-y-2">
          <Link href="/dashboard">
            <p className="block px-4 py-2 rounded bg-gray-700 hover:bg-blue-500 transition">📜 Articles</p>
          </Link>
          
            <Link href="/dashboard/new">
              <p className="block px-4 py-2 rounded bg-gray-700 hover:bg-green-500 transition">➕ Add Article</p>
            </Link>
          
          {session.user.role === "admin" && (
            <Link href="/dashboard/settings">
              <p className="block px-4 py-2 rounded bg-gray-700 hover:bg-yellow-500 transition">⚙️ Settings</p>
            </Link>
             
          )}
          {session.user.role === "admin" && (
            <Link href="/dashboard/users">
              <p className="block px-4 py-2 rounded bg-gray-700 hover:bg-yellow-500 transition">👥 Manage Users</p>
            </Link>
             
          )}
          {session.user.role === "admin" && (
            <Link href="/dashboard/logo">
              <p className="block px-4 py-2 rounded bg-gray-700 hover:bg-yellow-500 transition">🎯 Logo Update</p>
            </Link>
             
          )}
        </nav>
        <button
          onClick={() => signOut({ callbackUrl: "/cila" })}
          className="mt-6 w-full bg-red-500 py-2 rounded hover:bg-red-600 transition"
        >
          🚪 Logout
        </button>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
