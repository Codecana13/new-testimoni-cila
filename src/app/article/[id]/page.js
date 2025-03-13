"use client";  // ✅ Mark as Client Component

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";  // ✅ Use useParams instead of useRouter
import Image from "next/image";
import SuggestedArticle from "@/app/components/SuggestedArticle";
import AboutSection from "@/app/components/AboutSection";
import Footer from "@/app/components/Footer";
import Navbar from "@/app/components/Navbar";

export default function ArticlePage() {
  const { id } = useParams();  // ✅ Get dynamic route parameter
  const [article, setArticle] = useState(null);
  const [suggested, setSuggested] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    setLoading(true);

    // Fetch main article
    fetch(`/api/posts/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setArticle(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    // Fetch suggested articles
    fetch(`/api/posts/suggested?exclude=${id}`)
  .then((res) => res.json())
  .then((data) => {
    console.log("API Response:", data); // ✅ Debugging API response

    if (Array.isArray(data)) {
      setSuggested(data.slice(0, 2));
    } else {
      console.error("Unexpected API response format:", data);
      setSuggested([]);
    }
  })
  .catch((error) => {
    console.error("Fetch error:", error);
    setSuggested([]);
  });
    }, [id]);

  if (loading) return <p className="text-center mt-10 text-white">Loading...</p>;
  if (!article) return <p className="text-center mt-10 text-red-500">Article not found.</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Navbar />  
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Article */}
        <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-gray-900">{article.title}</h1>
          <p className="text-sm text-gray-400 mt-2">📅 Published on {new Date(article.createdAt).toLocaleDateString()}</p>

          {article.imageUrl && (
            <div className="relative w-full h-72 my-4">
              <Image src={article.imageUrl} layout="fill" objectFit="cover" className="rounded-lg" alt={article.title} />
            </div>
          )}

          <div className="mt-4 text-gray-800 leading-relaxed" dangerouslySetInnerHTML={{ __html: article.content }} />
        </div>

        {/* Sidebar (Suggested Articles) */}
        <div className="space-y-4">
          {suggested.map((sArticle) => (
            <SuggestedArticle key={sArticle._id} article={sArticle} />
          ))}
        </div>
      </div>

      {/* About Section */}
      <AboutSection />

      {/* Footer */}
      <Footer />
    </div>
  );
}
