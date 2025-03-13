import { useEffect, useState } from "react";

export default function Marquee() {
  const [runningText, setRunningText] = useState("Loading...");

  useEffect(() => {
    const fetchSettings = async () => {
      const res = await fetch("/api/settings");
      const data = await res.json();
      setRunningText(data.runningText);
    };
    fetchSettings();
  }, []);

  return (
    <div className="relative bg-gray-900 py-2">
      <div className="absolute inset-x-0 top-0 h-1 bg-yellow-500"></div>
      <marquee className="text-yellow-400 font-bold">{runningText}</marquee>
      <div className="absolute inset-x-0 bottom-0 h-1 bg-yellow-500"></div>
    </div>
  );
}
