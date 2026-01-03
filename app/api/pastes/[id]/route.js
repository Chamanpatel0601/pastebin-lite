


import { redis } from "@/lib/redis";

export async function GET(req, context) {
  const params = await context.params; // ✅ FIX
  const id = params.id;

  const key = `paste:${id}`;
  const paste = await redis.get(key);

  if (!paste) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const now =
    process.env.TEST_MODE === "1" && req.headers.get("x-test-now-ms")
      ? Number(req.headers.get("x-test-now-ms"))
      : Date.now();

  // TTL check
  if (paste.expires_at && now >= paste.expires_at) {
    await redis.del(key);
    return Response.json({ error: "Expired" }, { status: 404 });
  }

  // View limit check
  if (paste.max_views !== null && paste.views >= paste.max_views) {
    await redis.del(key);
    return Response.json({ error: "View limit exceeded" }, { status: 404 });
  }

  paste.views += 1;
  await redis.set(key, paste);

  return Response.json({
    content: paste.content,
    remaining_views:
      paste.max_views === null ? null : paste.max_views - paste.views,
    expires_at: paste.expires_at
      ? new Date(paste.expires_at).toISOString()
      : null,
  });
}
