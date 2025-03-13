"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function UsersPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch("/api/users");
      const data = await res.json();
      setUsers(data);
    };
    fetchUsers();
  }, []);

  const handleAddEditor = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    setMessage(data.message);

    if (res.ok) {
      setUsers([...users, { _id: data.userId, name, email, role: "editor" }]);
      setName("");
      setEmail("");
      setPassword("");
    }
  };

  const handleDelete = async (userId) => {
    if (!confirm("Are you sure you want to delete this editor?")) return;

    const res = await fetch("/api/users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });

    if (res.ok) {
      setUsers(users.filter((user) => user._id !== userId));
    } else {
      alert("Failed to delete editor.");
    }
  };

  if (!session || session.user.role !== "admin") {
    return <p className="text-center text-red-500 mt-10">Access Denied</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-900 text-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center">👥 Manage Editors</h1>

      {message && <p className="text-green-400 text-center mt-4">{message}</p>}

      {/* Form Tambah Editor */}
      <form onSubmit={handleAddEditor} className="mt-6 space-y-4">
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition duration-200"
        >
          ➕ Add Editor
        </button>
      </form>

      {/* List Editor */}
      <h2 className="text-2xl font-bold mt-10">📜 Registered Editors</h2>
      <div className="mt-4 space-y-3">
        {users.length > 0 ? (
          users.map((user) => (
            <div key={user._id} className="bg-gray-800 p-3 rounded-lg flex justify-between items-center">
              <p>{user.name} - <span className="text-yellow-400">{user.email}</span></p>
              <div className="flex gap-3">
                <span className="px-3 py-1 bg-gray-700 text-white rounded">{user.role}</span>
                <button
                  onClick={() => handleDelete(user._id)}
                  className="px-3 py-1 bg-red-500 rounded hover:bg-red-600 transition"
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-red-400">No editors registered yet.</p>
        )}
      </div>
    </div>
  );
}
