"use client";

export default function SearchBox() {
  return (
    <div
      style={{
        position: "absolute",
        top: 20,
        right: 20,
        zIndex: 1000,
      }}
    >
      <input
        placeholder="Tìm tỉnh..."
        style={{
          padding: "10px 15px",
          borderRadius: "10px",
          border: "1px solid #ccc",
          width: "250px",
          fontSize: "15px",
        }}
      />
    </div>
  );
}