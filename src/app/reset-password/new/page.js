"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function NewPassword() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/auth/reset-password/new", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });

    const data = await res.json();
    setMessage(data.message);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900">
      <div className="w-full max-w-md bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
        <h2 className="text-3xl font-bold text-center text-white mb-6">🔑 Set New Password</h2>
        {message && <p className="text-green-400 text-center">{message}</p>}
        <form onSubmit={handleReset} className="space-y-4">
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition duration-200"
          >
            🔒 Change Password
          </button>
        </form>
      </div>
    </div>
  );
}
