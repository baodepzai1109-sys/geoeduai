export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default function SafePage({ title = "Safe Page" }: { title?: string }) {
  return (
    <main style={styles.container}>
      <h1 style={styles.title}>🛡️ {title}</h1>

      <p style={styles.text}>
        Trang này đang chạy chế độ <b>dynamic runtime</b>, không build static,
        nên sẽ không gây timeout khi deploy Vercel.
      </p>

      <div style={styles.card}>
        <h2>✔ Trạng thái</h2>
        <ul>
          <li>Dynamic Rendering (SSR)</li>
          <li>No Static Generation</li>
          <li>No Cache Fetch</li>
          <li>Deploy-safe template</li>
        </ul>
      </div>
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
    fontSize: "28px",
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
};