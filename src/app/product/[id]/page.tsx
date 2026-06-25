"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { categoryById } from "@/lib/categories";
import { discountRate, formatWon } from "@/lib/products";
import ProductPurchase from "@/components/ProductPurchase";
import ProductGrid from "@/components/ProductGrid";
import { useProduct, useProducts } from "@/lib/use-products";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { product, loading } = useProduct(id);
  const { products: sameCat } = useProducts(
    (r) => (product ? r.byCategory(product.category) : Promise.resolve([])),
    [product?.category]
  );

  if (loading) {
    return (
      <div className="mx-auto max-w-[1320px] px-4 py-20 text-center text-sm text-ink-300">
        상품을 불러오는 중…
      </div>
    );
  }
  if (!product) notFound();

  const category = categoryById(product.category);
  const dc = discountRate(product);
  const related = sameCat.filter((p) => p.id !== product.id).slice(0, 5);

  return (
    <div className="mx-auto max-w-[1320px] px-4 py-6">
      {/* breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-ink-300">
        <Link href="/" className="hover:text-toss-blue">
          홈
        </Link>
        <span>›</span>
        {category && (
          <>
            <Link
              href={`/category/${category.id}`}
              className="hover:text-toss-blue"
            >
              {category.name}
            </Link>
            <span>›</span>
          </>
        )}
        <span className="font-medium text-ink-700">{product.sub}</span>
      </nav>

      <div className="mt-5 grid gap-8 lg:grid-cols-2">
        {/* image */}
        <div className="relative aspect-square overflow-hidden rounded-card bg-surface">
          <Image
            src={product.image}
            alt={product.name}
            fill
            unoptimized
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        </div>

        {/* info */}
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-toss-blue">
            {product.brand}
          </span>
          <h1 className="mt-1 text-2xl font-extrabold leading-snug text-ink-900">
            {product.name}
          </h1>

          <div className="mt-2 flex items-center gap-2 text-sm text-ink-400">
            <span className="tnum font-medium text-ink-500">
              ★ {product.rating.toFixed(1)}
            </span>
            <span className="tnum">
              리뷰 {product.reviewCount.toLocaleString("ko-KR")}
            </span>
            <span className="tnum text-ink-300">상품코드 {product.code}</span>
          </div>

          <div className="mt-5 flex items-baseline gap-2">
            {dc > 0 && (
              <span className="tnum text-2xl font-extrabold text-alert">
                {dc}%
              </span>
            )}
            <span className="tnum text-[32px] font-extrabold text-ink-900">
              {formatWon(product.price)}
            </span>
            {dc > 0 && (
              <span className="tnum text-base text-ink-300 line-through">
                {formatWon(product.listPrice)}
              </span>
            )}
          </div>

          <div className="mt-6">
            <ProductPurchase product={product} />
          </div>

          <div className="mt-5 rounded-card bg-surface p-4 text-sm leading-relaxed text-ink-500">
            {product.description}
          </div>
        </div>
      </div>

      {/* related */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-5 text-xl font-extrabold text-ink-900">
            함께 보면 좋은 상품
          </h2>
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}
