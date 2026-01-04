import { redis } from "@/lib/redis";
import { nanoid } from "nanoid";

export async function POST(req) {
  let body;

  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { content, ttl_seconds, max_views } = body;

  if (!content || typeof content !== "string") {
    return Response.json({ error: "Invalid content" }, { status: 400 });
  }

  if (ttl_seconds !== undefined && ttl_seconds < 1) {
    return Response.json({ error: "Invalid ttl_seconds" }, { status: 400 });
  }

  if (max_views !== undefined && max_views < 1) {
    return Response.json({ error: "Invalid max_views" }, { status: 400 });
  }

  const id = nanoid(8);
  const now = Date.now();

  const paste = {
    content,
    views: 0,
    max_views: max_views ?? null,
    expires_at: ttl_seconds ? now + ttl_seconds * 1000 : null,
  };

  await redis.set(`paste:${id}`, JSON.stringify(paste));

  return Response.json({
    id,
    path: `/p/${id}`,
  });
}
