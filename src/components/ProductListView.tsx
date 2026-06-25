"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/lib/types";
import { discountRate, unitPrice } from "@/lib/products";
import ProductGrid from "./ProductGrid";

type Sort = "popular" | "priceAsc" | "priceDesc" | "unitAsc" | "discount";

const SORT_LABELS: Record<Sort, string> = {
  popular: "인기순",
  priceAsc: "낮은 가격순",
  priceDesc: "높은 가격순",
  unitAsc: "개당 단가 낮은순",
  discount: "할인율순",
};

export default function ProductListView({
  products,
  subs,
}: {
  products: Product[];
  subs?: string[];
}) {
  const [sort, setSort] = useState<Sort>("popular");
  const [activeSub, setActiveSub] = useState<string | null>(null);
  const [activeBrands, setActiveBrands] = useState<string[]>([]);
  const [priceMax, setPriceMax] = useState<number | null>(null);

  const brands = useMemo(
    () => [...new Set(products.map((p) => p.brand))].sort(),
    [products]
  );

  const priceBuckets = [
    { label: "1만원 이하", max: 10000 },
    { label: "2만원 이하", max: 20000 },
    { label: "3만원 이하", max: 30000 },
  ];

  const filtered = useMemo(() => {
    let list = products;
    if (activeSub) list = list.filter((p) => p.sub === activeSub);
    if (activeBrands.length)
      list = list.filter((p) => activeBrands.includes(p.brand));
    if (priceMax) list = list.filter((p) => p.price <= priceMax);

    const sorted = [...list];
    switch (sort) {
      case "priceAsc":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "priceDesc":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "unitAsc":
        sorted.sort((a, b) => unitPrice(a) - unitPrice(b));
        break;
      case "discount":
        sorted.sort((a, b) => discountRate(b) - discountRate(a));
        break;
      default:
        sorted.sort((a, b) => b.reviewCount - a.reviewCount);
    }
    return sorted;
  }, [products, activeSub, activeBrands, priceMax, sort]);

  function toggleBrand(b: string) {
    setActiveBrands((prev) =>
      prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]
    );
  }

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      {/* Filter sidebar */}
      <aside className="shrink-0 lg:w-56">
        <div className="lg:sticky lg:top-44">
          {subs && subs.length > 0 && (
            <FilterBlock title="소분류">
              <button
                onClick={() => setActiveSub(null)}
                className={chip(activeSub === null)}
              >
                전체
              </button>
              {subs.map((s) => (
                <button
                  key={s}
                  onClick={() => setActiveSub(s)}
                  className={chip(activeSub === s)}
                >
                  {s}
                </button>
              ))}
            </FilterBlock>
          )}

          <FilterBlock title="가격">
            <button
              onClick={() => setPriceMax(null)}
              className={chip(priceMax === null)}
            >
              전체
            </button>
            {priceBuckets.map((b) => (
              <button
                key={b.max}
                onClick={() => setPriceMax(b.max)}
                className={chip(priceMax === b.max)}
              >
                {b.label}
              </button>
            ))}
          </FilterBlock>

          <FilterBlock title="브랜드">
            <div
              className={`flex flex-col gap-1 ${
                brands.length > 10
                  ? "brand-scroll max-h-64 overflow-y-auto pr-3"
                  : ""
              }`}
            >
              {brands.map((b) => (
                <label
                  key={b}
                  className="flex cursor-pointer items-center gap-2 py-1 text-sm text-ink-500"
                >
                  <input
                    type="checkbox"
                    checked={activeBrands.includes(b)}
                    onChange={() => toggleBrand(b)}
                    className="h-4 w-4 accent-toss-blue"
                  />
                  {b}
                </label>
              ))}
            </div>
          </FilterBlock>
        </div>
      </aside>

      {/* Grid + sort bar */}
      <div className="flex-1">
        <div className="mb-5 flex items-center justify-between border-b border-line pb-3">
          <span className="tnum text-sm text-ink-400">
            총{" "}
            <strong className="font-bold text-ink-900">
              {filtered.length.toLocaleString("ko-KR")}
            </strong>
            개
          </span>
          <div className="flex items-center gap-1">
            {(Object.keys(SORT_LABELS) as Sort[]).map((s) => (
              <button
                key={s}
                onClick={() => setSort(s)}
                className={`rounded-lg px-2.5 py-1.5 text-sm transition-colors ${
                  sort === s
                    ? "font-bold text-toss-blue"
                    : "text-ink-400 hover:text-ink-700"
                }`}
              >
                {SORT_LABELS[s]}
              </button>
            ))}
          </div>
        </div>
        <ProductGrid products={filtered} />
      </div>
    </div>
  );
}

function FilterBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-line py-4 first:pt-0">
      <h3 className="mb-2.5 text-sm font-bold text-ink-900">{title}</h3>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function chip(active: boolean) {
  return `rounded-lg px-2.5 py-1.5 text-sm transition-colors ${
    active
      ? "bg-toss-blueLight font-semibold text-toss-blue"
      : "text-ink-500 hover:bg-surface"
  }`;
}
