"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CATEGORIES, categoryById } from "@/lib/categories";
import { formatWon } from "@/lib/products";
import { productRepo } from "@/lib/product-repository";
import { useProducts } from "@/lib/use-products";

export default function AdminProductsPage() {
  const { products, loading } = useProducts((r) => r.list());
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");

  const filtered = useMemo(() => {
    let list = products;
    if (cat) list = list.filter((p) => p.category === cat);
    if (q.trim()) {
      const k = q.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(k) ||
          p.brand.toLowerCase().includes(k) ||
          p.code.toLowerCase().includes(k)
      );
    }
    return list;
  }, [products, q, cat]);

  async function handleDelete(id: string, name: string) {
    if (!confirm(`'${name}' 상품을 삭제할까요?`)) return;
    await productRepo.remove(id);
  }

  async function handleReset() {
    if (!confirm("모든 상품을 초기 시드 데이터로 되돌립니다. 계속할까요?")) return;
    await productRepo.reset();
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-ink-900">상품 관리</h1>
          <p className="mt-1 text-sm text-ink-400">
            총{" "}
            <span className="tnum font-bold text-ink-700">
              {filtered.length.toLocaleString("ko-KR")}
            </span>
            개
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleReset}
            className="rounded-lg border border-line px-4 py-2.5 text-sm font-semibold text-ink-400 hover:text-alert"
          >
            시드로 초기화
          </button>
          <Link
            href="/admin/products/new"
            className="rounded-lg bg-toss-blue px-4 py-2.5 text-sm font-bold text-white hover:bg-toss-blueDark"
          >
            + 상품 등록
          </Link>
        </div>
      </div>

      {/* filters */}
      <div className="mt-5 flex flex-wrap gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="상품명, 브랜드, 코드 검색"
          className="w-64 rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-toss-blue"
        />
        <select
          value={cat}
          onChange={(e) => setCat(e.target.value)}
          className="rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-toss-blue"
        >
          <option value="">전체 카테고리</option>
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* table */}
      <div className="mt-5 overflow-x-auto card-seamless bg-white">
        <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs text-ink-400">
              <th className="px-4 py-3 font-medium">상품</th>
              <th className="px-4 py-3 font-medium">코드</th>
              <th className="px-4 py-3 font-medium">카테고리</th>
              <th className="px-4 py-3 text-right font-medium">판매가</th>
              <th className="px-4 py-3 font-medium">단위</th>
              <th className="px-4 py-3 font-medium">상태</th>
              <th className="px-4 py-3 text-right font-medium">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-16 text-center text-ink-300">
                  불러오는 중…
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-16 text-center text-ink-300">
                  조건에 맞는 상품이 없습니다.
                </td>
              </tr>
            ) : (
              filtered.map((p) => (
                <tr key={p.id} className="hover:bg-surface">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-surface">
                        <Image src={p.image} alt="" fill unoptimized sizes="40px" className="object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-ink-900">{p.name}</p>
                        <p className="text-xs text-ink-300">{p.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="tnum px-4 py-3 text-ink-400">{p.code}</td>
                  <td className="px-4 py-3 text-ink-500">
                    {categoryById(p.category)?.name}
                  </td>
                  <td className="tnum px-4 py-3 text-right font-semibold text-ink-900">
                    {formatWon(p.price)}
                  </td>
                  <td className="px-4 py-3 text-ink-500">{p.unitLabel}</td>
                  <td className="px-4 py-3">
                    {p.soldOut ? (
                      <span className="rounded bg-[#FEECEC] px-2 py-0.5 text-xs font-semibold text-alert">
                        품절
                      </span>
                    ) : (
                      <span className="rounded bg-toss-blueLight px-2 py-0.5 text-xs font-semibold text-toss-blue">
                        판매중
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/products/${p.id}`}
                        className="rounded-md px-2.5 py-1.5 text-xs font-semibold text-ink-500 hover:bg-white hover:text-toss-blue"
                      >
                        수정
                      </Link>
                      <button
                        onClick={() => handleDelete(p.id, p.name)}
                        className="rounded-md px-2.5 py-1.5 text-xs font-semibold text-ink-400 hover:text-alert"
                      >
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
