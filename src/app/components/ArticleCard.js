import Link from "next/link";
import Image from "next/image";

export default function ArticleCard({ article }) {
  return (
    <div className="relative bg-yellow-500 p-4 rounded-xl shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-yellow-500/50 hover:ring-4 hover:ring-yellow-400 hover:brightness-110 flex flex-col justify-between min-h-[6
    20px]">
      {/* Top Decorative Gold Line */}
      <div className="bg-black p-1 absolute top-0 left-0 right-0 h-1"></div>

      {/* Image */}
      {article.imageUrl && (
        <div className="relative w-full h-52 flex justify-center">
          <Image
            src={article.imageUrl}
            layout="fill"
            objectFit="cover"
            className="rounded-t-xl"
            alt="Article Thumbnail"
          />
        </div>
      )}

      {/* Article Content */}
      <div className="flex flex-col justify-center items-center text-center p-4 flex-grow">
        <h2 className="text-lg font-bold uppercase">{article.title}</h2>
        <p className="text-sm text-gray-800 font-medium mt-1">{article.date}</p>
        <p className="mt-2 text-gray-900 text-sm leading-relaxed">
          {article.content.replace(/&nbsp;/g, " ").replace(/<\/?[^>]+(>|$)/g, "").slice(0, 90)}...
        </p>
      </div>

      {/* Read More Button */}
      <div className="flex justify-center mt-auto mb-2">
        <Link href={`/article/${article._id}`}>
          <button className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-bold flex items-center transition-all duration-300 hover:bg-blue-700 hover:shadow-md hover:shadow-blue-400">
            🔍 Read More
          </button>
        </Link>
      </div>

      {/* Bottom Decorative Gold Line */}
      <div className="bg-black p-1 absolute bottom-0 left-0 right-0 h-1"></div>
    </div>
  );
}
