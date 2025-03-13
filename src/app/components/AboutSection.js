import { useEffect, useState } from "react";

export default function AboutSection() {
  const [aboutTitle, setAboutTitle] = useState("Loading...");
  const [aboutContent, setAboutContent] = useState("Loading...");

  useEffect(() => {
    const fetchSettings = async () => {
      const res = await fetch("/api/settings");
      const data = await res.json();
      setAboutTitle(data.aboutTitle || "About This Website"); // ✅ Ensure About Title is Displayed
      setAboutContent(data.aboutContent || "Welcome to our website!");
    };
    fetchSettings();
  }, []);

  return (
    <div className="bg-gray-800 p-6 mt-10 text-white rounded-lg">
      {/* ✅ Ensure Title is Rendered */}
      <div className="text-2xl font-bold text-yellow-400" dangerouslySetInnerHTML={{ __html: aboutTitle }} />
      
      {/* ✅ Apply Quill Styles Correctly */}
      <div className="mt-2 text-gray-300 leading-relaxed quill-content" dangerouslySetInnerHTML={{ __html: aboutContent }} />
    </div>
  );
}
