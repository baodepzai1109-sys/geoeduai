export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-8 py-6">
      <h1 className="text-2xl font-bold text-cyan-400">
        GeoEdu AI
      </h1>

      <div className="flex gap-6">
        <a href="#">Trang chủ</a>
        <a href="#">Tính năng</a>
        <a href="#">Bản đồ</a>
        <a href="#">Liên hệ</a>
      </div>
    </nav>
  );
}