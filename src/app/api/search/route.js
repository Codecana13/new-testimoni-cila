import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";

export async function GET(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query") || "";

  // Find posts that match the title (case insensitive)
  const results = await Post.find({ title: { $regex: query, $options: "i" } })
    .sort({ createdAt: -1 })
    .limit(20);

  return new Response(JSON.stringify(results), { status: 200 });
}
