"use client";

import { use } from "react";
import Link from "next/link";
import ProductListView from "@/components/ProductListView";
import { useProducts } from "@/lib/use-products";
import { useCategories } from "@/lib/use-categories";

export default function CategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const categories = useCategories();
  const category = categories.find((c) => c.id === id);
  const { products, loading } = useProducts((r) => r.byCategory(id), [id]);

  if (!category) {
    return (
      <div className="mx-auto max-w-[1320px] px-4 py-20 text-center">
        <p className="text-base font-semibold text-ink-700">
          카테고리를 찾을 수 없어요
        </p>
        <Link href="/" className="mt-4 inline-block text-sm text-toss-blue">
          ← 홈으로
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1320px] px-4 py-6">
      <nav className="flex items-center gap-1.5 text-sm text-ink-300">
        <Link href="/" className="hover:text-toss-blue">
          홈
        </Link>
        <span>›</span>
        <span className="font-medium text-ink-700">{category.name}</span>
      </nav>

      <div className="mt-3 mb-6 flex items-center gap-2">
        <span className="text-2xl">{category.emoji}</span>
        <h1 className="text-2xl font-extrabold text-ink-900">
          {category.name}
        </h1>
      </div>

      {loading ? (
        <GridSkeleton />
      ) : (
        <ProductListView products={products} subs={category.subs} />
      )}
    </div>
  );
}

function GridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-square rounded-card bg-surface" />
          <div className="mt-3 h-3 w-1/2 rounded bg-surface" />
          <div className="mt-2 h-4 w-3/4 rounded bg-surface" />
        </div>
      ))}
    </div>
  );
}
