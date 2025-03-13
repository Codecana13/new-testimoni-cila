import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post"; // Make
 
export const dynamic = "force-dynamic";
export async function GET(req) {
    try {
      const { searchParams } = new URL(req.url);
      const excludeId = searchParams.get("exclude");
  
      console.log("Received exclude ID:", excludeId); // ✅ Debugging
  
      if (!excludeId) {
        return new Response(JSON.stringify({ error: "Missing 'exclude' parameter" }), { status: 400 });
      }
  
      await connectDB();
      const suggestedPosts = await Post.find({ _id: { $ne: excludeId } })
        .sort({ createdAt: -1 })
        .limit(2);
  
      return new Response(JSON.stringify(suggestedPosts), { status: 200 });
    } catch (error) {
      console.error("API Error:", error);
      return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
  }
  