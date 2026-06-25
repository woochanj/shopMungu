"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/admin", label: "대시보드", exact: true },
  { href: "/admin/orders", label: "주문 관리" },
  { href: "/admin/products", label: "상품 관리" },
  { href: "/admin/products/new", label: "상품 등록" },
  { href: "/admin/import", label: "엑셀 대량등록" },
  { href: "/admin/categories", label: "카테고리 관리" },
  { href: "/admin/home", label: "홈 화면 구성" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-surface">
      {/* sidebar */}
      <aside className="hidden w-60 shrink-0 border-r border-line bg-white md:block">
        <div className="sticky top-0">
          <Link
            href="/admin"
            className="flex items-center gap-2 border-b border-line px-5 py-5"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink-900 text-sm font-black text-white">
              관
            </span>
            <span className="text-base font-extrabold text-ink-900">
              관리자 콘솔
            </span>
          </Link>
          <nav className="p-3">
            {NAV.map((item) => {
              const active = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`mb-1 block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    active
                      ? "bg-toss-blueLight text-toss-blue"
                      : "text-ink-500 hover:bg-surface"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="border-t border-line p-3">
            <Link
              href="/"
              className="block rounded-lg px-3 py-2.5 text-sm text-ink-400 hover:bg-surface"
            >
              ← 쇼핑몰로 돌아가기
            </Link>
          </div>
        </div>
      </aside>

      {/* main */}
      <div className="flex-1">
        {/* mobile top nav */}
        <div className="flex items-center gap-2 overflow-x-auto border-b border-line bg-white px-4 py-3 no-scrollbar md:hidden">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium text-ink-500"
            >
              {item.label}
            </Link>
          ))}
        </div>
        <main className="mx-auto w-full max-w-5xl p-5 md:p-8">{children}</main>
      </div>
    </div>
  );
}
