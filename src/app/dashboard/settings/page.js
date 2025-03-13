"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";

// Load Quill only on client side
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

export default function SettingsPage() {
  const { data: session } = useSession();

  const [runningText, setRunningText] = useState("");
  const [aboutTitle, setAboutTitle] = useState(""); // ✅ Editable About Title
  const [aboutContent, setAboutContent] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchSettings = async () => {
      const res = await fetch("/api/settings");
      const data = await res.json();
      setRunningText(data.runningText);
      setAboutTitle(data.aboutTitle || "About This Website"); // ✅ Load About Title
      setAboutContent(data.aboutContent);
    };
    fetchSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ runningText, aboutTitle, aboutContent }),
    });

    const data = await res.json();
    setMessage(data.message);
  };

  if (!session || session.user.role !== "admin") {
    return <p className="text-center text-red-500 mt-10">Access Denied</p>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto bg-gray-900 text-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-4 text-center">⚙️ Edit Website Settings</h1>

      {message && <p className="text-green-400 text-center">{message}</p>}

      <form onSubmit={handleSave} className="space-y-4">
        {/* Running Text */}
        <div>
          <label className="block text-sm font-medium text-gray-400">Running Text</label>
          <input
            type="text"
            value={runningText}
            onChange={(e) => setRunningText(e.target.value)}
            className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-yellow-500"
          />
        </div>

        {/* About Section Title */}
        <div>
          <label className="block text-sm font-medium text-gray-400">About Section Title</label>
          <input
            type="text"
            value={aboutTitle}
            onChange={(e) => setAboutTitle(e.target.value)}
            className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-yellow-500"
          />
        </div>

        {/* About Section (Rich Text) */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">About Section Content</label>
          <ReactQuill
            theme="snow"
            value={aboutContent}
            onChange={setAboutContent}
            className="bg-white text-black rounded"
          />
        </div>

        <button className="w-full bg-yellow-500 text-black py-3 rounded-lg font-semibold hover:bg-yellow-600 transition duration-200">
          💾 Save Changes
        </button>
      </form>
    </div>
  );
}
