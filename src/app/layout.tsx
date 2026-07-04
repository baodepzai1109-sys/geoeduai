import type { Metadata } from "next";
import { Inter } from "next/font/google";
import MaintenanceGuard from "@/components/MaintenanceGuard";
import "./globals.css";
const inter = Inter({
  subsets: ["latin", "vietnamese"],
});
export const metadata: Metadata = {
  title: "GeoEdu AI",
  description: "GeoEdu AI",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <MaintenanceGuard />
        {children}
      </body>
    </html>
  );
}