import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

// ✅ Get a Single Post (GET)
export async function GET(req, { params }) {
  await connectDB();
  const { id } = params;

  try {
    const post = await Post.findById(id);
    if (!post) {
      return new Response(JSON.stringify({ error: "Post not found" }), { status: 404 });
    }
    return new Response(JSON.stringify(post), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Invalid Post ID" }), { status: 400 });
  }
}

// ✅ Update an Article (PATCH)
export async function PATCH(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  await connectDB();

  const { id } = params;
  const { title, content, imageUrl, createdAt } = await req.json(); // ✅ Include date

  const post = await Post.findById(id);
  if (!post) return new Response("Post not found", { status: 404 });

  if (session.user.role !== "admin" && session.user.email !== post.author) {
    return new Response("Forbidden", { status: 403 });
  }

  post.title = title;
  post.content = content;
  post.imageUrl = imageUrl;
  if (createdAt) post.createdAt = new Date(createdAt); // ✅ Allow date editing

  await post.save();
  return new Response(JSON.stringify(post), { status: 200 });
}

// ✅ Delete an Article (DELETE)
export async function DELETE(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  await connectDB();

  const { id } = params;
  const post = await Post.findById(id);
  if (!post) return new Response("Post not found", { status: 404 });

  // ✅ Only Admins can delete posts
  if (session.user.role !== "admin") {
    return new Response("Forbidden", { status: 403 });
  }

  await post.deleteOne();
  return new Response("Post deleted successfully", { status: 200 });
}
