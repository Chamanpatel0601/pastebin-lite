export default async function PastePage({ params }) {
  const id = params.id;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_VERCEL_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
      : ""}/api/pastes/${id}`,
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
