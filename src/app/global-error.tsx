"use client";

// Last resort: replaces the whole page when the root layout itself fails, so it carries its own <html> and styles.
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="mk">
      <body
        style={{
          margin: 0,
          fontFamily: "system-ui, sans-serif",
          background: "#f4f8f8",
          color: "#1e424a",
        }}
      >
        <div
          style={{
            minHeight: "100vh",
            display: "grid",
            placeItems: "center",
            padding: 24,
            textAlign: "center",
          }}
        >
          <div style={{ maxWidth: 480 }}>
            <h1 style={{ fontSize: 32, margin: "0 0 12px" }}>
              Нешто тргна наопаку
            </h1>
            <p style={{ fontSize: 17, lineHeight: 1.6, color: "#41595f" }}>
              Страницата не можеше да се вчита. Обидете се повторно.
            </p>
            <button
              onClick={() => reset()}
              style={{
                marginTop: 16,
                padding: "14px 28px",
                border: 0,
                borderRadius: 12,
                background: "#facc0b",
                color: "#1e424a",
                fontWeight: 800,
                fontSize: 16,
                cursor: "pointer",
                boxShadow: "0 5px 0 #c99f00",
              }}
            >
              Обиди се повторно
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
