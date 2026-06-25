"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Product } from "@/lib/types";
import { formatWon, unitPrice } from "@/lib/products";
import { useCart } from "@/lib/cart-context";

export default function ProductPurchase({ product }: { product: Product }) {
  const router = useRouter();
  const { add } = useCart();
  const [qty, setQty] = useState(product.minOrder);
  const [added, setAdded] = useState(false);

  const total = product.price * qty;
  const showPerUnit = product.unitCount > 1;

  function changeQty(next: number) {
    setQty(Math.max(product.minOrder, next));
  }

  function handleAdd() {
    add(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  function handleBuyNow() {
    add(product, qty);
    router.push("/checkout");
  }

  return (
    <div className="card-seamless p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-ink-400">판매 단위</span>
        <span className="text-sm font-semibold text-ink-900">
          {product.unitLabel}
        </span>
      </div>
      {showPerUnit && (
        <div className="mt-2 flex items-center justify-between">
          <span className="text-sm text-ink-400">개당 단가</span>
          <span className="tnum text-sm font-semibold text-ink-900">
            {unitPrice(product).toLocaleString("ko-KR")}원
          </span>
        </div>
      )}
      <div className="mt-2 flex items-center justify-between">
        <span className="text-sm text-ink-400">최소 주문</span>
        <span className="tnum text-sm font-semibold text-ink-900">
          {product.minOrder}개
        </span>
      </div>

      <div className="my-4 h-px bg-line" />

      {/* Quantity stepper */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-ink-700">수량</span>
        <div className="flex items-center rounded-lg border border-line">
          <button
            type="button"
            onClick={() => changeQty(qty - 1)}
            disabled={qty <= product.minOrder}
            className="flex h-9 w-9 items-center justify-center text-lg text-ink-500 disabled:opacity-30"
            aria-label="수량 줄이기"
          >
            −
          </button>
          <input
            value={qty}
            onChange={(e) => {
              const n = parseInt(e.target.value.replace(/\D/g, ""), 10);
              changeQty(Number.isNaN(n) ? product.minOrder : n);
            }}
            className="tnum h-9 w-12 border-x border-line text-center text-sm font-semibold text-ink-900 outline-none"
            aria-label="수량"
          />
          <button
            type="button"
            onClick={() => changeQty(qty + 1)}
            className="flex h-9 w-9 items-center justify-center text-lg text-ink-500"
            aria-label="수량 늘리기"
          >
            +
          </button>
        </div>
      </div>

      <div className="mt-5 flex items-end justify-between">
        <span className="text-sm font-semibold text-ink-700">
          총 상품금액
        </span>
        <span className="tnum text-2xl font-extrabold text-toss-blue">
          {formatWon(total)}
        </span>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={handleAdd}
          disabled={product.soldOut}
          className="flex-1 rounded-xl border border-toss-blue bg-white py-3.5 text-base font-bold text-toss-blue transition-colors hover:bg-toss-blueLight disabled:cursor-not-allowed disabled:border-line disabled:text-ink-300"
        >
          {added ? "담았어요 ✓" : "장바구니"}
        </button>
        <button
          type="button"
          onClick={handleBuyNow}
          disabled={product.soldOut}
          className="flex-1 rounded-xl bg-toss-blue py-3.5 text-base font-bold text-white transition-colors hover:bg-toss-blueDark disabled:cursor-not-allowed disabled:bg-ink-300"
        >
          {product.soldOut ? "품절" : "바로구매"}
        </button>
      </div>
    </div>
  );
}
