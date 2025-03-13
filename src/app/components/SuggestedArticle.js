import Link from "next/link";
import Image from "next/image";

export default function SuggestedArticle({ article }) {
  return (
    <div className="bg-yellow-500 rounded-lg overflow-hidden shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-2xl border border-yellow-700 hover:border-white p-3">
      {article.imageUrl && (
        <div className="relative w-full h-40">
          <Image src={article.imageUrl} layout="fill" objectFit="cover" className="rounded-md" alt="Suggested" />
        </div>
      )}

      <h3 className="text-md font-semibold mt-2">{article.title}</h3>
      <p className="text-xs text-gray-600">{article.date}</p>

      <Link href={`/article/${article._id}`}>
        <button className="mt-2 bg-blue-500 text-white px-4 py-2 text-xs font-bold rounded-md hover:bg-blue-600">
          Read More
        </button>
      </Link>
    </div>
  );
}
