"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

export default function EditPost({ params }) {
  const { id } = params;
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [createdAt, setCreatedAt] = useState(""); // ✅ Add date input
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      const res = await fetch(`/api/posts/${id}`);
      const data = await res.json();
      setTitle(data.title);
      setContent(data.content);
      setImageUrl(data.imageUrl);
      setCreatedAt(new Date(data.createdAt).toISOString().split("T")[0]); // ✅ Format date input
    };
    fetchPost();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch(`/api/posts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, imageUrl, createdAt }),
    });

    if (res.ok) {
      router.push("/dashboard");
    } else {
      alert("Failed to update post.");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto py-6">
      <h1 className="text-3xl font-bold text-white text-center">✏️ Edit Article</h1>

      <form onSubmit={handleUpdate} className="mt-6 space-y-4 bg-gray-800 p-6 rounded-lg">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white"
        />

        <input
          type="date" // ✅ Date input field
          value={createdAt}
          onChange={(e) => setCreatedAt(e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white"
        />

        <ReactQuill value={content} onChange={setContent} className="bg-white text-black rounded" />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition duration-200"
        >
          {loading ? "Updating..." : "💾 Save Changes"}
        </button>
      </form>
    </div>
  );
}
