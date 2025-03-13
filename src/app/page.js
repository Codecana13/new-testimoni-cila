"use client";

import { useState, useEffect } from "react";
import Navbar from "@/app/components/Navbar";
import Marquee from "@/app/components/Marquee";
import ArticleCard from "@/app/components/ArticleCard";
import Pagination from "@/app/components/Pagination";
import AboutSection from "@/app/components/AboutSection";
import Footer from "@/app/components/Footer";

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 16;

  useEffect(() => {
    const fetchArticles = async () => {
      const res = await fetch("/api/posts");
      const data = await res.json();
      setArticles(data);
      setFilteredArticles(data);
    };
    fetchArticles();
  }, []);

  // ✅ Search Function
  const handleSearch = (query) => {
    setFilteredArticles(articles.filter((post) => post.title.toLowerCase().includes(query.toLowerCase())));
  };

  // ✅ Pagination Logic
  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
  const paginatedArticles = filteredArticles.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Navbar onSearch={handleSearch} />
      <div className="bg-gray-800 p-6 rounded-lg text-white text-center mt-10">
        <h2 className="text-2xl font-bold">🔥 Bukti Jackpot Bayar Lunas 🔥 </h2>
        
      </div>
      <Marquee />
      <div className="p-6">
       
        <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-4 gap-2">
          {paginatedArticles.map((article) => (
            <ArticleCard key={article._id} article={article} />
          ))}
        </div>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        <AboutSection />
      </div>
      <Footer />
    </div>
  );
}
