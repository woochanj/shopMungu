"use client";

import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";
import { useProducts } from "@/lib/use-products";

export default function AdminDashboard() {
  const { products, loading } = useProducts((r) => r.list());

  const total = products.length;
  const soldOut = products.filter((p) => p.soldOut).length;
  const onSale = products.filter((p) => p.listPrice > p.price).length;
  const byCat = CATEGORIES.map((c) => ({
    ...c,
    count: products.filter((p) => p.category === c.id).length,
  }));

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-ink-900">대시보드</h1>
      <p className="mt-1 text-sm text-ink-400">
        문구도매센터 상품 현황 한눈에 보기
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="전체 상품" value={loading ? "…" : total.toLocaleString("ko-KR")} accent />
        <Stat label="할인 중" value={loading ? "…" : onSale.toLocaleString("ko-KR")} />
        <Stat label="품절" value={loading ? "…" : soldOut.toLocaleString("ko-KR")} />
        <Stat label="카테고리" value={CATEGORIES.length.toString()} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="card-seamless bg-white p-5">
          <h2 className="mb-4 text-base font-bold text-ink-900">
            카테고리별 상품 수
          </h2>
          <ul className="space-y-2">
            {byCat.map((c) => (
              <li key={c.id} className="flex items-center justify-between">
                <span className="text-sm text-ink-500">
                  {c.emoji} {c.name}
                </span>
                <span className="tnum text-sm font-bold text-ink-900">
                  {c.count.toLocaleString("ko-KR")}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card-seamless bg-white p-5">
          <h2 className="mb-4 text-base font-bold text-ink-900">빠른 작업</h2>
          <div className="flex flex-col gap-2">
            <Link href="/admin/products/new" className="rounded-lg bg-toss-blue px-4 py-3 text-center text-sm font-bold text-white hover:bg-toss-blueDark">
              + 새 상품 등록
            </Link>
            <Link href="/admin/import" className="rounded-lg border border-line px-4 py-3 text-center text-sm font-semibold text-ink-700 hover:bg-surface">
              엑셀로 대량 등록
            </Link>
            <Link href="/admin/products" className="rounded-lg border border-line px-4 py-3 text-center text-sm font-semibold text-ink-700 hover:bg-surface">
              상품 목록 관리
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="card-seamless bg-white p-5">
      <p className="text-sm text-ink-400">{label}</p>
      <p
        className={`tnum mt-2 text-3xl font-extrabold ${
          accent ? "text-toss-blue" : "text-ink-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
