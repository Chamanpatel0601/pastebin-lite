// import { redis } from "@/lib/redis";

// export default async function PastePage(props) {
//   const params = await props.params; // 🔥 IMPORTANT FIX
//   const id = params.id;

//   const paste = await redis.get(`paste:${id}`);

//   if (!paste) {
//     return <h1>404 - Paste Not Found</h1>;
//   }

//   const now = Date.now();

//   // TTL check
//   if (paste.expires_at && now >= paste.expires_at) {
//     await redis.del(`paste:${id}`);
//     return <h1>404 - Paste Expired</h1>;
//   }

//   // View limit check (HTML view does NOT increment views)
//   if (paste.max_views !== null && paste.views >= paste.max_views) {
//     return <h1>404 - Paste Unavailable</h1>;
//   }

//   return (
//     <pre style={{ whiteSpace: "pre-wrap", padding: 20 }}>
//       {paste.content}
//     </pre>
//   );
// }



export default async function PastePage(props) {
  const params = await props.params; // ✅ FIX
  const id = params.id;

  const res = await fetch(
    `${process.env.BASE_URL || "http://localhost:3000"}/api/pastes/${id}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    return <h1>404 - Paste Unavailable</h1>;
  }

  const data = await res.json();

  return (
    <div style={{ padding: 20 }}>
      <pre style={{ whiteSpace: "pre-wrap" }}>{data.content}</pre>

      <hr />

      {data.remaining_views !== null && (
        <p>Remaining views: {data.remaining_views}</p>
      )}

      {data.expires_at && <p>Expires at: {data.expires_at}</p>}
    </div>
  );
}
