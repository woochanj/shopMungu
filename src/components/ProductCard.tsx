"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { discountRate, formatWon, unitPrice } from "@/lib/products";
import { useCart } from "@/lib/cart-context";

export default function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const dc = discountRate(product);
  const perUnit = unitPrice(product);
  const showPerUnit = product.unitCount > 1;

  return (
    <div className="group relative flex h-full flex-col">
      <Link href={`/product/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-surface transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1 group-hover:shadow-hover">
          <Image
            src={product.image}
            alt={product.name}
            fill
            unoptimized
            sizes="(max-width: 768px) 50vw, 20vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
          {product.soldOut && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/70">
              <span className="rounded-md bg-ink-900 px-3 py-1 text-sm font-semibold text-white">
                품절
              </span>
            </div>
          )}
          {product.badges?.includes("인기") && !product.soldOut && (
            <span className="absolute left-2 top-2 rounded-md bg-toss-blue px-2 py-0.5 text-xs font-bold text-white">
              인기
            </span>
          )}
          {product.badges?.includes("신상") && !product.badges?.includes("인기") && !product.soldOut && (
            <span className="absolute left-2 top-2 rounded-md bg-ink-900 px-2 py-0.5 text-xs font-bold text-white">
              신상
            </span>
          )}
        </div>
      </Link>

      <div className="mt-3 flex flex-1 flex-col">
        <span className="text-xs text-ink-300">{product.brand}</span>
        <Link href={`/product/${product.id}`}>
          <h3 className="clamp-2 mt-0.5 min-h-[2.6em] text-sm leading-snug text-ink-700 hover:text-toss-blue">
            {product.name}
          </h3>
        </Link>

        <div className="mt-1.5 flex items-baseline gap-1.5">
          {dc > 0 && (
            <span className="tnum text-sm font-bold text-alert">{dc}%</span>
          )}
          <span className="tnum text-[17px] font-bold text-ink-900">
            {formatWon(product.price)}
          </span>
        </div>
        {/* 취소선 정가: 할인 유무와 무관하게 같은 높이를 차지해 카드 줄을 맞춘다 */}
        <span className="tnum block min-h-[1.25em] text-xs text-ink-300 line-through" aria-hidden={dc === 0}>
          {dc > 0 ? formatWon(product.listPrice) : ""}
        </span>

        {/* 도매 시그니처: 개당 단가 + 묶음 단위 */}
        <div className="mt-1 text-xs text-ink-400">
          {showPerUnit ? (
            <span className="tnum">
              개당 {perUnit.toLocaleString("ko-KR")}원 · {product.unitLabel}
            </span>
          ) : (
            <span>{product.unitLabel}</span>
          )}
        </div>

        <div className="mt-2 mb-3 flex items-center gap-1 text-xs text-ink-300">
          <span className="tnum font-medium text-ink-500">
            ★ {product.rating.toFixed(1)}
          </span>
          <span className="tnum">리뷰 {product.reviewCount.toLocaleString("ko-KR")}</span>
        </div>

        <button
          type="button"
          disabled={product.soldOut}
          onClick={() => add(product, product.minOrder)}
          className="mt-auto w-full rounded-lg border border-line bg-white py-2.5 text-sm font-semibold text-ink-700 transition-colors hover:border-toss-blue hover:text-toss-blue disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-line disabled:hover:text-ink-700"
        >
          {product.soldOut ? "품절" : "담기"}
        </button>
      </div>
    </div>
  );
}
