"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { formatWon } from "@/lib/products";
import {
  FREE_SHIPPING_THRESHOLD,
  buildOrderSummary,
} from "@/lib/order";

export default function CartPage() {
  const { items, setQty, remove, clear } = useCart();
  const summary = buildOrderSummary(items);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-[1320px] px-4 py-6">
        <h1 className="mb-6 text-2xl font-extrabold text-ink-900">장바구니</h1>
        <div className="flex flex-col items-center justify-center card-seamless py-24 text-center">
          <p className="text-base font-semibold text-ink-700">
            장바구니가 비어 있어요
          </p>
          <p className="mt-1 text-sm text-ink-300">
            필요한 문구를 담아보세요.
          </p>
          <Link
            href="/"
            className="mt-5 rounded-xl bg-toss-blue px-5 py-3 text-sm font-bold text-white hover:bg-toss-blueDark"
          >
            쇼핑 계속하기
          </Link>
        </div>
      </div>
    );
  }

  const remainForFree = FREE_SHIPPING_THRESHOLD - summary.subtotal;

  return (
    <div className="mx-auto max-w-[1320px] px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-ink-900">
          장바구니{" "}
          <span className="tnum text-toss-blue">{summary.itemCount}</span>
        </h1>
        <button
          onClick={clear}
          className="text-sm text-ink-300 hover:text-alert"
        >
          전체 삭제
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* line items */}
        <div className="divide-y divide-line card-seamless">
          {summary.lines.map((line) => (
            <div key={line.productId} className="flex gap-4 p-4">
              <Link
                href={`/product/${line.productId}`}
                className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-surface"
              >
                <Image
                  src={line.image}
                  alt={line.name}
                  fill
                  unoptimized
                  sizes="96px"
                  className="object-cover"
                />
              </Link>
              <div className="flex flex-1 flex-col">
                <span className="text-xs text-ink-300">{line.brand}</span>
                <Link
                  href={`/product/${line.productId}`}
                  className="mt-0.5 text-sm font-medium text-ink-700 hover:text-toss-blue"
                >
                  {line.name}
                </Link>
                <span className="mt-0.5 text-xs text-ink-300">
                  {line.unitLabel}
                </span>

                <div className="mt-auto flex items-center justify-between pt-2">
                  <div className="flex items-center rounded-lg border border-line">
                    <button
                      onClick={() => setQty(line.productId, line.quantity - 1)}
                      className="flex h-8 w-8 items-center justify-center text-ink-500"
                      aria-label="수량 줄이기"
                    >
                      −
                    </button>
                    <span className="tnum w-9 text-center text-sm font-semibold">
                      {line.quantity}
                    </span>
                    <button
                      onClick={() => setQty(line.productId, line.quantity + 1)}
                      className="flex h-8 w-8 items-center justify-center text-ink-500"
                      aria-label="수량 늘리기"
                    >
                      +
                    </button>
                  </div>
                  <span className="tnum text-base font-bold text-ink-900">
                    {formatWon(line.lineTotal)}
                  </span>
                </div>
              </div>
              <button
                onClick={() => remove(line.productId)}
                className="self-start text-ink-300 hover:text-alert"
                aria-label="삭제"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* summary */}
        <aside className="h-fit lg:sticky lg:top-44">
          <div className="card-seamless p-5">
            {remainForFree > 0 && (
              <p className="mb-4 rounded-lg bg-toss-blueLight px-3 py-2.5 text-sm text-toss-blue">
                <strong className="tnum font-bold">
                  {formatWon(remainForFree)}
                </strong>{" "}
                더 담으면 무료배송!
              </p>
            )}
            <Row label="상품금액" value={formatWon(summary.subtotal)} />
            <Row
              label="배송비"
              value={summary.shipping === 0 ? "무료" : formatWon(summary.shipping)}
            />
            <div className="my-3 h-px bg-line" />
            <div className="flex items-end justify-between">
              <span className="text-sm font-bold text-ink-900">
                결제 예상금액
              </span>
              <span className="tnum text-2xl font-extrabold text-toss-blue">
                {formatWon(summary.total)}
              </span>
            </div>

            <Link
              href="/checkout"
              className="mt-5 block rounded-xl bg-toss-blue py-3.5 text-center text-base font-bold text-white transition-colors hover:bg-toss-blueDark"
            >
              주문하기
            </Link>
            <Link
              href="/quote"
              className="mt-2 block rounded-xl border border-line py-3 text-center text-sm font-bold text-ink-700 transition-colors hover:border-toss-blue hover:text-toss-blue"
            >
              📄 견적서 만들기
            </Link>
            <Link
              href="/"
              className="mt-2 block py-2 text-center text-sm text-ink-400 hover:text-ink-700"
            >
              쇼핑 계속하기
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-sm text-ink-400">{label}</span>
      <span className="tnum text-sm font-semibold text-ink-900">{value}</span>
    </div>
  );
}
