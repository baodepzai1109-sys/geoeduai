// app/admin/ai/page.tsx

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function AdminAIPage() {
  return (
    <main style={styles.container}>
      <h1 style={styles.title}>🤖 Admin AI</h1>

      <p style={styles.text}>
        Trang này đang chạy ở chế độ <b>dynamic</b> (không build static),
        tránh lỗi timeout khi deploy Vercel.
      </p>

      <div style={styles.card}>
        <h2>Trạng thái hệ thống</h2>
        <ul>
          <li>✔ Next.js App Router</li>
          <li>✔ Dynamic Rendering</li>
          <li>✔ No Static Generation</li>
          <li>✔ Deploy-safe</li>
        </ul>
      </div>

      <button
        style={styles.button}
        onClick={() => {
          alert("Admin AI hoạt động bình thường 🚀");
        }}
      >
        Test hệ thống
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
    background: "#0f172a",
    color: "white",
  },

  title: {
    fontSize: "32px",
    fontWeight: "bold",
  },

  text: {
    fontSize: "16px",
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
    padding: "10px 16px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    backgroundColor: "#3b82f6",
    color: "white",
    fontWeight: "bold",
  },
};