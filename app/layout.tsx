import MemberDetailModal from "@/components/MemberDetailModal";
import type { Metadata } from "next";
import { Suspense } from "react";
import config from "./config";
import "./globals.css";

export const metadata: Metadata = {
  title: config.siteName,
  description: config.siteName,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`antialiased relative`}>
        {children}
        <Suspense fallback={null}>
          <MemberDetailModal />
        </Suspense>
      </body>
    </html>
  );
}
