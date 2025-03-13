"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Navbar from "../components/Navbar";

export default function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) return;

    const fetchResults = async () => {
      setLoading(true);
      const res = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data);
      setLoading(false);
    };

    fetchResults();
  }, [query]);

  return (
    
    <div className="max-w-6xl mx-auto px-4 py-8 text-white">
      <Navbar/>
      <h1 className="text-3xl font-bold">🔎 Search Results for &quot;{query}&quot;</h1>

      {loading ? (
        <p className="mt-4 text-yellow-400">Loading...</p>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {results.map((post) => (
            <Link key={post._id} href={`/article/${post._id}`} className="group">
              <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:scale-105 transition duration-300">
                <Image
                  src={post.imageUrl || "/default-image.jpg"}
                  alt={post.title}
                  width={300}
                  height={200}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold text-lg group-hover:text-yellow-400">{post.title}</h3>
                  <p className="text-gray-400 text-sm mt-2">{post.content.replace(/<[^>]*>?/gm, "").slice(0, 80)}...</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-red-400">No results found.</p>
      )}
    </div>
  );
}
