"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Image from "next/image";
import "react-quill/dist/quill.snow.css";

// Import ReactQuill dynamically (prevents SSR issues)
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false, loading: () => <p>Loading Editor...</p> });

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image"],
    ["clean"],
  ],
};

export default function NewPost() {
  const { data: session } = useSession();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  
  const [featuredImage, setFeaturedImage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!session || (session.user.role !== "admin" && session.user.role !== "editor")) {
    return <p className="text-red-500">You are not authorized to create posts.</p>;
  }

  // Function to handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    setUploading(true);
    setError("");
  
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
  
      if (!res.ok) {
        throw new Error(`Upload failed: ${res.status} ${res.statusText}`);
      }
  
      const text = await res.text(); // Read response as text first
      if (!text) {
        throw new Error("Empty response from server");
      }
  
      const data = JSON.parse(text); // Convert text to JSON safely
      if (!data.url) {
        throw new Error("Invalid JSON response from server");
      }
  
      setFeaturedImage(data.url);
    } catch (err) {
      setError(err.message || "Image upload failed.");
    } finally {
      setUploading(false);
    }
  };
  
  

  // Function to handle post submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
  
    if (!title.trim()) {
      setError("Title is required");
      setLoading(false);
      return;
    }
  
    if (!content.trim()) {
      setError("Content is required");
      setLoading(false);
      return;
    }
  
    if (!featuredImage) {
      setError("Please wait for the image to finish uploading.");
      setLoading(false);
      return;
    }
  
    const post = { title: title.trim(), content: content.trim(), imageUrl: featuredImage };
  
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(post),
      });
  
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create post");
      }
  
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Create New Article</h1>
        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Title Input */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-white dark:bg-gray-800"
              required
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Featured Image</label>
            <div className="mt-1 flex items-center space-x-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="block w-full text-sm text-gray-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                disabled={uploading}
              />
              {uploading && <p className="text-sm text-yellow-400">Uploading...</p>}
            </div>
            {/* Show uploaded image */}
            {featuredImage && (
              <div className="mt-2">
                <Image src={featuredImage} alt="Featured Image Preview" width={200} height={150} className="rounded-md" />
              </div>
            )}
          </div>

          {/* Content Editor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Content</label>
            <div className="prose max-w-full">
              <ReactQuill value={content} onChange={setContent} modules={modules} className="h-64 mb-12" theme="snow" />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
            >
              {loading ? "Creating..." : "Create Article"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
