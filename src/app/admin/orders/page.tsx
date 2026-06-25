"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { formatWon } from "@/lib/products";
import {
  orderRepo,
  ORDER_STATUS_FLOW,
  ORDER_STATUS_LABEL,
  formatDateTime,
  type Order,
  type OrderStatus,
} from "@/lib/order-repository";
import { PAYMENT_METHODS } from "@/lib/payment";
import { useOrders } from "@/lib/use-orders";

type Filter = "all" | OrderStatus;

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "전체" },
  { id: "paid", label: "결제완료" },
  { id: "preparing", label: "상품준비중" },
  { id: "shipping", label: "배송중" },
  { id: "delivered", label: "배송완료" },
  { id: "cancelled", label: "취소" },
];

export default function AdminOrdersPage() {
  const { orders, loading } = useOrders();
  const [filter, setFilter] = useState<Filter>("all");

  const counts = useMemo(() => {
    const c: Record<Filter, number> = {
      all: orders.length,
      paid: 0,
      preparing: 0,
      shipping: 0,
      delivered: 0,
      cancelled: 0,
    };
    for (const o of orders) c[o.status] += 1;
    return c;
  }, [orders]);

  const filtered =
    filter === "all" ? orders : orders.filter((o) => o.status === filter);

  const revenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((s, o) => s + o.total, 0);

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-ink-900">주문 관리</h1>
      <p className="mt-1 text-sm text-ink-400">
        들어온 주문을 확인하고 배송 상태를 변경할 수 있어요.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="전체 주문" value={loading ? "…" : counts.all.toString()} accent />
        <Stat label="처리 대기" value={loading ? "…" : (counts.paid + counts.preparing).toString()} />
        <Stat label="배송중" value={loading ? "…" : counts.shipping.toString()} />
        <Stat label="누적 매출" value={loading ? "…" : formatWon(revenue)} />
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
              filter === f.id
                ? "bg-toss-blue text-white"
                : "bg-white text-ink-500 hover:bg-toss-blueLight"
            }`}
          >
            {f.label}
            <span className="tnum ml-1.5 text-xs opacity-70">
              {counts[f.id]}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-4">
        {loading ? (
          <div className="card-seamless bg-white py-24 text-center text-sm text-ink-300">
            불러오는 중…
          </div>
        ) : filtered.length === 0 ? (
          <div className="card-seamless bg-white py-24 text-center">
            <span className="text-4xl">📭</span>
            <p className="mt-4 text-sm font-semibold text-ink-700">
              {filter === "all"
                ? "아직 들어온 주문이 없어요"
                : "해당 상태의 주문이 없어요"}
            </p>
            {filter === "all" && (
              <Link
                href="/"
                className="mt-4 inline-block text-sm font-medium text-toss-blue hover:underline"
              >
                쇼핑몰에서 주문 만들어 보기 →
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((order) => (
              <AdminOrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
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

/** 현재 상태의 다음 진행 단계 (없으면 종료된 상태) */
function nextStatus(status: OrderStatus): OrderStatus | null {
  const i = ORDER_STATUS_FLOW.indexOf(status);
  if (i === -1 || i === ORDER_STATUS_FLOW.length - 1) return null;
  return ORDER_STATUS_FLOW[i + 1];
}

function AdminOrderCard({ order }: { order: Order }) {
  const method = PAYMENT_METHODS.find((m) => m.id === order.provider);
  const next = nextStatus(order.status);
  const canCancel = order.status !== "delivered" && order.status !== "cancelled";

  return (
    <section className="card-seamless bg-white overflow-hidden">
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-5 py-4">
        <div className="flex items-center gap-3">
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-bold ${STATUS_STYLE[order.status]}`}
          >
            {ORDER_STATUS_LABEL[order.status]}
          </span>
          <span className="tnum text-sm font-bold text-ink-900">{order.id}</span>
        </div>
        <span className="tnum text-xs text-ink-300">
          {formatDateTime(order.createdAt)}
        </span>
      </header>

      <div className="grid gap-5 px-5 py-4 lg:grid-cols-[1fr_280px]">
        {/* 상품 */}
        <div className="divide-y divide-line">
          {order.lines.map((line) => (
            <div key={line.productId} className="flex gap-3 py-3 first:pt-0">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-surface">
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

        {/* 배송지 + 결제 + 액션 */}
        <div className="rounded-card bg-surface p-4">
          <dl className="space-y-1.5">
            <DetailRow label="받는 분" value={order.customerName} />
            <DetailRow label="연락처" value={order.phone} />
            <DetailRow label="배송지" value={order.address} />
            {order.memo && <DetailRow label="메모" value={order.memo} />}
            <DetailRow label="결제수단" value={method?.name ?? order.provider} />
          </dl>
          <div className="mt-3 flex items-center justify-between border-t border-line pt-3">
            <span className="text-sm font-bold text-ink-900">총 결제금액</span>
            <span className="tnum text-base font-extrabold text-toss-blue">
              {formatWon(order.total)}
            </span>
          </div>

          <div className="mt-4 flex flex-col gap-2">
            {next && (
              <button
                type="button"
                onClick={() => orderRepo.updateStatus(order.id, next)}
                className="w-full rounded-lg bg-toss-blue py-2.5 text-sm font-bold text-white hover:bg-toss-blueDark"
              >
                {ORDER_STATUS_LABEL[next]}(으)로 변경
              </button>
            )}
            {canCancel && (
              <button
                type="button"
                onClick={() => {
                  if (confirm(`주문 ${order.id}을(를) 취소할까요?`)) {
                    orderRepo.updateStatus(order.id, "cancelled");
                  }
                }}
                className="w-full rounded-lg border border-line py-2.5 text-sm font-semibold text-ink-500 hover:border-alert hover:text-alert"
              >
                주문 취소
              </button>
            )}
            {!next && !canCancel && (
              <p className="text-center text-xs text-ink-300">
                {order.status === "delivered" ? "배송이 완료된 주문이에요." : "취소된 주문이에요."}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="shrink-0 text-xs text-ink-400">{label}</dt>
      <dd className="text-right text-xs font-medium text-ink-700">{value}</dd>
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
        className={`tnum mt-2 text-2xl font-extrabold ${
          accent ? "text-toss-blue" : "text-ink-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
