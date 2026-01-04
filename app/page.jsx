"use client";
import { useState } from "react";
import styles from "./page.module.css";

export default function Home() {
  const [content, setContent] = useState("");
  const [ttl, setTtl] = useState("");
  const [views, setViews] = useState("");
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  async function createPaste() {
    setError("");
    setUrl("");

    const body = {
      content,
      ttl_seconds: ttl ? Number(ttl) : undefined,
      max_views: views ? Number(views) : undefined,
    };

    const res = await fetch("/api/pastes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Something went wrong");
      return;
    }

    setUrl(`${window.location.origin}${data.path}`);
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.heading}>Create Paste</h2>

        <textarea
          rows="6"
          className={styles.textarea}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your paste content here..."
        />

        <div className={styles.row}>
          <div className={styles.box}>
            <label className={styles.label}>TTL (seconds)</label>
            <input
              type="number"
              className={styles.input}
              value={ttl}
              onChange={(e) => setTtl(e.target.value)}
              placeholder="e.g. 60"
            />
          </div>

          <div className={styles.box}>
            <label className={styles.label}>Max Views</label>
            <input
              type="number"
              className={styles.input}
              value={views}
              onChange={(e) => setViews(e.target.value)}
              placeholder="e.g. 5"
            />
          </div>
        </div>

        <button className={styles.button} onClick={createPaste}>
          Create Paste
        </button>

        {error && <p className={styles.error}>{error}</p>}

        {url && (
          <div className={styles.success}>
            <b>✅ Paste created successfully</b>

            <div className={styles.linkBox}>{url}</div>

            <div className={styles.linkActions}>
              <button
                className={styles.openBtn}
                onClick={() => window.open(url, "_blank")}
              >
                Open Paste
              </button>

              <button
                className={styles.copyBtn}
                onClick={() => navigator.clipboard.writeText(url)}
              >
                Copy Link
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
