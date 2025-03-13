"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LogoSettings() {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload-logo", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setMessage(data.message);
    setUploading(false);

    // ✅ Paksa reload agar navbar memperbarui logo
    setTimeout(() => {
      router.refresh();
    }, 1000);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">⚙️ Ganti Logo</h2>

      <input type="file" onChange={handleImageUpload} disabled={uploading} className="mb-4" />
      {uploading && <p className="text-yellow-500">Uploading...</p>}

      {message && <p className="text-green-500 mt-4">{message}</p>}
    </div>
  );
}
