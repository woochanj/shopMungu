"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import ProductListView from "@/components/ProductListView";
import { useProducts } from "@/lib/use-products";

function SearchResults() {
  const sp = useSearchParams();
  const query = (sp.get("q") ?? "").trim();
  const { products, loading } = useProducts(
    (r) => r.search(query),
    [query]
  );

  return (
    <div className="mx-auto max-w-[1320px] px-4 py-6">
      <nav className="flex items-center gap-1.5 text-sm text-ink-300">
        <Link href="/" className="hover:text-toss-blue">
          홈
        </Link>
        <span>›</span>
        <span className="font-medium text-ink-700">검색</span>
      </nav>

      <h1 className="mt-3 mb-6 text-2xl font-extrabold text-ink-900">
        {query ? (
          <>
            <span className="text-toss-blue">‘{query}’</span> 검색 결과
          </>
        ) : (
          "검색어를 입력해 주세요"
        )}
      </h1>

      {!query ? (
        <div className="card-seamless py-20 text-center text-sm text-ink-300">
          상단 검색창에 상품명이나 상품코드를 입력하세요.
        </div>
      ) : loading ? (
        <div className="py-20 text-center text-sm text-ink-300">
          검색 중…
        </div>
      ) : (
        <ProductListView products={products} />
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={null}>
      <SearchResults />
    </Suspense>
  );
}
