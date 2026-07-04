// app/admin/safe/page.tsx

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default function SafePage() {
  return (
    <main style={styles.container}>
      <h1 style={styles.title}>🛡️ Safe Admin Page</h1>

      <p style={styles.text}>
        Trang này chạy hoàn toàn ở chế độ <b>dynamic runtime</b>,
        không bị static generation nên không gây timeout khi deploy Vercel.
      </p>

      <div style={styles.card}>
        <h2>✔ Hệ thống</h2>
        <ul>
          <li>Next.js 14 App Router</li>
          <li>Server-side rendering (SSR)</li>
          <li>No static generation</li>
          <li>No fetch cache</li>
          <li>Deploy-safe structure</li>
        </ul>
      </div>

      <button
        style={styles.button}
        onClick={() => alert("Page hoạt động bình thường 🚀")}
      >
        Test
      </button>
    </main>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: "100vh",
    padding: "40px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "16px",
    fontFamily: "Arial, sans-serif",
    background: "#0b1220",
    color: "white",
  },

  title: {
    fontSize: "30px",
    fontWeight: "bold",
  },

  text: {
    maxWidth: "600px",
    textAlign: "center",
    color: "#cbd5e1",
  },

  card: {
    background: "#1e293b",
    padding: "20px",
    borderRadius: "12px",
    width: "100%",
    maxWidth: "500px",
  },

  button: {
    marginTop: "10px",
    padding: "10px 16px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    backgroundColor: "#3b82f6",
    color: "white",
    fontWeight: "bold",
  },
};