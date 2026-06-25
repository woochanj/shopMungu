"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { useCategories } from "@/lib/use-categories";

export default function Header() {
  const router = useRouter();
  const { count } = useCart();
  const categories = useCategories();
  const [query, setQuery] = useState("");

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur">
      {/* top utility row */}
      <div>
        <div className="mx-auto flex h-9 max-w-[1320px] items-center justify-end gap-4 px-4 text-xs text-ink-300">
          <Link href="/login" className="hover:text-ink-700">
            로그인
          </Link>
          <Link href="/login" className="hover:text-ink-700">
            회원가입
          </Link>
          <Link href="/orders" className="hover:text-ink-700">
            주문조회
          </Link>
          <span className="text-ink-400">고객센터 1670-0000</span>
        </div>
      </div>

      {/* main row: logo + search + cart */}
      <div className="mx-auto flex max-w-[1320px] items-center gap-6 px-4 py-4">
        <Link href="/" className="flex shrink-0 items-center gap-1.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-toss-blue text-base font-black text-white">
            문
          </span>
          <span className="text-xl font-extrabold tracking-tight text-ink-900">
            문구도매센터
          </span>
        </Link>

        <form onSubmit={onSearch} className="flex flex-1 justify-center">
          <div className="flex w-full max-w-[560px] items-center rounded-xl bg-surface px-4 py-3 transition-colors focus-within:bg-white focus-within:ring-2 focus-within:ring-toss-blue">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="찾으시는 상품명, 상품코드를 입력하세요"
              className="flex-1 bg-transparent text-sm text-ink-900 outline-none placeholder:text-ink-300"
              aria-label="상품 검색"
            />
            <button type="submit" aria-label="검색" className="ml-2 text-ink-400">
              <SearchIcon />
            </button>
          </div>
        </form>

        <Link
          href="/cart"
          className="relative flex shrink-0 items-center gap-1.5 text-ink-700 hover:text-toss-blue"
        >
          <CartIcon />
          <span className="text-sm font-semibold">장바구니</span>
          {count > 0 && (
            <span className="tnum absolute -right-2 -top-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-toss-blue px-1 text-[11px] font-bold text-white">
              {count}
            </span>
          )}
        </Link>
      </div>

      {/* category GNB */}
      <nav className="border-b border-line">
        <div className="mx-auto flex max-w-[1320px] items-center gap-1 overflow-x-auto px-4 no-scrollbar">
          <Link
            href="/"
            className="flex items-center gap-1.5 whitespace-nowrap px-3 py-3 text-sm font-bold text-ink-900"
          >
            <MenuIcon /> 전체 카테고리
          </Link>
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/category/${c.id}`}
              className="whitespace-nowrap px-3 py-3 text-sm font-medium text-ink-500 hover:text-toss-blue"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="20" r="1.4" />
      <circle cx="18" cy="20" r="1.4" />
      <path d="M2.5 3h2l2.2 12.4a1.5 1.5 0 0 0 1.5 1.2h8.7a1.5 1.5 0 0 0 1.5-1.2L21 7H6" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M3 6h18M3 12h18M3 18h18" />
    </svg>
  );
}
