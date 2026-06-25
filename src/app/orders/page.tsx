"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { formatWon } from "@/lib/products";
import {
  ORDER_STATUS_LABEL,
  formatDateTime,
  type Order,
  type OrderStatus,
} from "@/lib/order-repository";
import { PAYMENT_METHODS } from "@/lib/payment";
import { useOrders } from "@/lib/use-orders";

export default function OrdersPage() {
  const { orders, loading } = useOrders();

  return (
    <div className="mx-auto max-w-[1320px] px-4 py-6">
      <h1 className="mb-6 text-2xl font-extrabold text-ink-900">주문 내역</h1>

      {loading ? (
        <div className="card-seamless py-24 text-center text-sm text-ink-300">
          불러오는 중…
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center card-seamless py-24 text-center">
          <span className="text-4xl">🧾</span>
          <p className="mt-4 text-base font-semibold text-ink-700">
            아직 주문 내역이 없어요
          </p>
          <p className="mt-1 text-sm text-ink-300">
            마음에 드는 상품을 담고 주문해 보세요.
          </p>
          <Link
            href="/"
            className="mt-5 rounded-xl bg-toss-blue px-5 py-3 text-sm font-bold text-white hover:bg-toss-blueDark"
          >
            쇼핑하러 가기
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}

const STATUS_STYLE: Record<OrderStatus, string> = {
  paid: "bg-toss-blueLight text-toss-blue",
  preparing: "bg-toss-blueLight text-toss-blue",
  shipping: "bg-toss-blueLight text-toss-blue",
  delivered: "bg-surface text-ink-500",
  cancelled: "bg-[#FEECEC] text-alert",
};

function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-bold ${STATUS_STYLE[status]}`}
    >
      {ORDER_STATUS_LABEL[status]}
    </span>
  );
}

function OrderCard({ order }: { order: Order }) {
  const [open, setOpen] = useState(false);
  const method = PAYMENT_METHODS.find((m) => m.id === order.provider);
  const first = order.lines[0];
  const restCount = order.lines.length - 1;

  return (
    <section className="card-seamless overflow-hidden">
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-5 py-4">
        <div className="flex items-center gap-3">
          <StatusBadge status={order.status} />
          <span className="tnum text-sm font-bold text-ink-900">
            {order.id}
          </span>
        </div>
        <span className="tnum text-xs text-ink-300">
          {formatDateTime(order.createdAt)}
        </span>
      </header>

      <div className="flex items-center gap-3 px-5 py-4">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-surface">
          <Image
            src={first.image}
            alt={first.name}
            fill
            unoptimized
            sizes="64px"
            className="object-cover"
          />
        </div>
        <div className="flex flex-1 flex-col justify-center">
          <span className="text-sm font-semibold text-ink-900">
            {first.name}
            {restCount > 0 && (
              <span className="font-normal text-ink-400">
                {" "}
                외 {restCount}건
              </span>
            )}
          </span>
          <span className="tnum text-xs text-ink-300">
            {first.unitLabel} · 수량 {first.quantity}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="tnum text-base font-extrabold text-ink-900">
            {formatWon(order.total)}
          </span>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="mt-1 text-xs font-medium text-ink-400 hover:text-toss-blue"
          >
            {open ? "접기 ▲" : "상세보기 ▼"}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-line bg-surface px-5 py-4">
          <div className="divide-y divide-line">
            {order.lines.map((line) => (
              <div key={line.productId} className="flex gap-3 py-3 first:pt-0">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-white">
                  <Image
                    src={line.image}
                    alt={line.name}
                    fill
                    unoptimized
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-center">
                  <span className="text-sm font-medium text-ink-700">
                    {line.name}
                  </span>
                  <span className="tnum text-xs text-ink-300">
                    {formatWon(line.price)} · 수량 {line.quantity}
                  </span>
                </div>
                <span className="tnum self-center text-sm font-bold text-ink-900">
                  {formatWon(line.lineTotal)}
                </span>
              </div>
            ))}
          </div>

          <dl className="mt-4 space-y-1.5 border-t border-line pt-4">
            <DetailRow label="받는 분" value={order.customerName} />
            <DetailRow label="연락처" value={order.phone} />
            <DetailRow label="배송지" value={order.address} />
            {order.memo && <DetailRow label="배송 메모" value={order.memo} />}
            <DetailRow label="결제수단" value={method?.name ?? order.provider} />
          </dl>

          <dl className="mt-4 space-y-1.5 border-t border-line pt-4">
            <DetailRow label="상품금액" value={formatWon(order.subtotal)} />
            <DetailRow
              label="배송비"
              value={order.shipping === 0 ? "무료" : formatWon(order.shipping)}
            />
            <div className="flex items-center justify-between pt-1.5">
              <span className="text-sm font-bold text-ink-900">총 결제금액</span>
              <span className="tnum text-base font-extrabold text-toss-blue">
                {formatWon(order.total)}
              </span>
            </div>
          </dl>
        </div>
      )}
    </section>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="shrink-0 text-sm text-ink-400">{label}</dt>
      <dd className="text-right text-sm font-medium text-ink-700">{value}</dd>
    </div>
  );
}
