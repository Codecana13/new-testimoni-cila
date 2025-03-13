import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  await connectDB();
  const posts = await Post.find().sort({ createdAt: -1 });
  return new Response(JSON.stringify(posts), { status: 200 });
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const { title, content, imageUrl } = await req.json();

  if (!title || !content) {
    return new Response(JSON.stringify({ error: "Title and content are required" }), { status: 400 });
  }

  await connectDB();
  const post = await Post.create({
    title,
    content,
    imageUrl,
    author: session.user.email, // Store email instead of ObjectId
  });

  return new Response(JSON.stringify(post), { status: 201 });
}
