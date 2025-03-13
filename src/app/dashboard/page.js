"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Dashboard() {
  const { data: session } = useSession();
  const [articles, setArticles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  useEffect(() => {
    const fetchArticles = async () => {
      const res = await fetch("/api/posts");
      const data = await res.json();
      setArticles(data);
    };
    fetchArticles();
  }, []);

  // ✅ Function to Download Image
  const handleDownloadImage = async (imageUrl) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "article-image.jpg"; // You can customize the filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Failed to download image:", error);
      alert("Error downloading image.");
    }
  };
  // ✅ Tambahkan fungsi handleDelete sebelum return()
const handleDelete = async (id) => {
  if (!confirm("Are you sure you want to delete this article?")) return;

  try {
    const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });

    if (res.ok) {
      setArticles((prevArticles) => prevArticles.filter((article) => article._id !== id));
    } else {
      alert("Failed to delete article.");
    }
  } catch (error) {
    console.error("Error deleting article:", error);
    alert("An error occurred while deleting the article.");
  }
};


  // ✅ Filter & Search Logic
  const filteredArticles = articles
    .filter((post) => post.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => (sortOrder === "newest" ? new Date(b.createdAt) - new Date(a.createdAt) : new Date(a.createdAt) - new Date(b.createdAt)));

  // ✅ Pagination Logic
  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
  const paginatedArticles = filteredArticles.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="p-6 bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">📜 Manage Articles</h1>

      {/* ✅ Search & Filter */}
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="🔎 Search by title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-3 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 w-1/2"
        />
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="px-3 py-2 rounded-lg bg-gray-700 text-white border border-gray-600"
        >
          <option value="newest">📅 Newest First</option>
          <option value="oldest">📅 Oldest First</option>
        </select>
      </div>

      {/* ✅ Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-800 rounded-lg shadow-md">
          <thead className="bg-gray-700 text-left text-white uppercase text-sm">
            <tr>
              <th className="px-6 py-3 w-1/3">📝 Title</th>
              <th className="px-6 py-3 w-1/6 text-center">📷 Image</th>
              <th className="px-6 py-3 w-1/6 text-center">📅 Date</th>
              <th className="px-6 py-3 w-1/6 text-center">⚙️ Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedArticles.length > 0 ? (
              paginatedArticles.map((post) => (
                <tr key={post._id} className="border-t border-gray-600">
                  <td className="px-6 py-4">{post.title}</td>
                  <td className="px-6 py-4 text-center">
                    {post.imageUrl ? (
                      <div className="flex flex-col items-center">
                        <Image src={post.imageUrl} width={50} height={50} alt="Thumbnail" className="rounded-lg mx-auto" />
                        <button
                          onClick={() => handleDownloadImage(post.imageUrl)}
                          className="mt-2 px-3 py-1 bg-green-500 rounded text-xs hover:bg-green-600 transition"
                        >
                          ⬇️ Download
                        </button>
                      </div>
                    ) : (
                      "No Image"
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">{new Date(post.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-center space-x-2">
                    <Link href={`/dashboard/edit/${post._id}`}>
                      <button className="px-3 py-1 bg-blue-500 rounded hover:bg-blue-600 transition">✏️ Edit</button>
                    </Link>
                    {session?.user.role === "admin" && (
                      <button
                        onClick={() => handleDelete(post._id)}
                        className="px-3 py-1 bg-red-500 rounded hover:bg-red-600 transition"
                      >
                        🗑 Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-4">No articles found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition disabled:opacity-50"
          >
            ◀️ Previous
          </button>
          <span className="px-4 py-2 bg-gray-700 rounded">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition disabled:opacity-50"
          >
            Next ▶️
          </button>
        </div>
      )}
    </div>
  );
}
