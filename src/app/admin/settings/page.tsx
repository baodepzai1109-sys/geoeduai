// app/page.tsx

export default function HomePage() {
  return (
    <main style={styles.container}>
      <h1 style={styles.title}>Chào mừng bạn 👋</h1>
      <p style={styles.text}>
        Đây là trang web Next.js của bạn đang hoạt động bình thường.
      </p>

      <button
        style={styles.button}
        onClick={() => alert("Hello! Web chạy OK")}
      >
        Test nút
      </button>
    </main>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "16px",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    fontSize: "32px",
    fontWeight: "bold",
  },
  text: {
    fontSize: "16px",
    color: "#555",
  },
  button: {
    padding: "10px 16px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    backgroundColor: "#0070f3",
    color: "white",
  },
};