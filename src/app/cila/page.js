"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await signIn("credentials", { email, password, redirect: false });

    if (result.error) {
      setError("Invalid credentials");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
      <div className="w-full max-w-md bg-gray-800 p-6 rounded-2xl shadow-2xl border border-gray-700">
        <h2 className="text-3xl font-bold text-center text-white mb-6">🔐 Login</h2>
        {error && <p className="text-red-400 text-center">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition duration-200"
          >
            🚀 Sign In
          </button>
        </form>

        {/* Forgot Password Link */}
        <p className="text-center text-white mt-4">
          <a href="/reset-password" className="text-blue-400 hover:underline">
            Forgot Password?
          </a>
        </p>
      </div>
    </div>
  );
}
