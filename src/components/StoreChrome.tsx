"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";

/**
 * 고객용 헤더/푸터를 감싸는 래퍼.
 * /admin 경로에서는 관리자 자체 레이아웃을 쓰므로 숨긴다.
 */
export default function StoreChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main className="min-h-[60vh]">{children}</main>
      <Footer />
    </>
  );
}
