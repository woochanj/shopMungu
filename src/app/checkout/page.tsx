"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { formatWon } from "@/lib/products";
import { buildOrderSummary } from "@/lib/order";
import {
  PAYMENT_METHODS,
  type PaymentProvider,
  generateOrderId,
  requestPayment,
} from "@/lib/payment";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clear } = useCart();
  const summary = buildOrderSummary(items);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [memo, setMemo] = useState("");
  const [provider, setProvider] = useState<PaymentProvider>("card");
  const [agree, setAgree] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-[1320px] px-4 py-6">
        <h1 className="mb-6 text-2xl font-extrabold text-ink-900">주문/결제</h1>
        <div className="flex flex-col items-center card-seamless py-24 text-center">
          <p className="text-base font-semibold text-ink-700">
            주문할 상품이 없어요
          </p>
          <Link
            href="/"
            className="mt-5 rounded-xl bg-toss-blue px-5 py-3 text-sm font-bold text-white hover:bg-toss-blueDark"
          >
            쇼핑하러 가기
          </Link>
        </div>
      </div>
    );
  }

  const orderName =
    summary.lines.length === 1
      ? summary.lines[0].name
      : `${summary.lines[0].name} 외 ${summary.lines.length - 1}건`;

  async function handlePay() {
    setError("");
    if (!name.trim() || !phone.trim() || !address.trim()) {
      setError("주문자 정보와 배송지를 모두 입력해 주세요.");
      return;
    }
    if (!agree) {
      setError("주문 내용 확인 및 결제 동의가 필요합니다.");
      return;
    }
    setSubmitting(true);
    const orderId = generateOrderId();
    try {
      // ⚠️ 실제 PG 연동 시 이 호출이 PG SDK 결제창을 띄우게 됩니다.
      const result = await requestPayment({
        orderId,
        orderName,
        amount: summary.total,
        customerName: name,
        provider,
      });
      if (result.success) {
        clear();
        router.push(
          `/checkout/complete?orderId=${result.orderId}&provider=${result.provider}`
        );
      } else {
        setError(result.message ?? "결제에 실패했습니다. 다시 시도해 주세요.");
        setSubmitting(false);
      }
    } catch {
      setError("결제 처리 중 오류가 발생했습니다.");
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-[1320px] px-4 py-6">
      <h1 className="mb-6 text-2xl font-extrabold text-ink-900">주문/결제</h1>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          {/* 주문자/배송지 */}
          <Card title="배송 정보">
            <Field label="받는 분">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="이름"
                className={input}
              />
            </Field>
            <Field label="연락처">
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="010-0000-0000"
                inputMode="tel"
                className={input}
              />
            </Field>
            <Field label="배송지">
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="주소를 입력하세요"
                className={input}
              />
            </Field>
            <Field label="배송 메모">
              <input
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder="예) 부재 시 경비실에 맡겨주세요"
                className={input}
              />
            </Field>
          </Card>

          {/* 주문 상품 */}
          <Card title={`주문 상품 ${summary.itemCount}건`}>
            <div className="divide-y divide-line">
              {summary.lines.map((line) => (
                <div key={line.productId} className="flex gap-3 py-3 first:pt-0">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-surface">
                    <Image
                      src={line.image}
                      alt={line.name}
                      fill
                      unoptimized
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-center">
                    <span className="text-sm font-medium text-ink-700">
                      {line.name}
                    </span>
                    <span className="tnum text-xs text-ink-300">
                      {line.unitLabel} · 수량 {line.quantity}
                    </span>
                  </div>
                  <span className="tnum self-center text-sm font-bold text-ink-900">
                    {formatWon(line.lineTotal)}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* 결제수단 */}
          <Card title="결제 수단">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {PAYMENT_METHODS.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setProvider(m.id)}
                  className={`flex flex-col items-start rounded-xl border-2 p-3 text-left transition-colors ${
                    provider === m.id
                      ? "border-toss-blue bg-toss-blueLight"
                      : "border-line hover:border-ink-300"
                  }`}
                >
                  <span className="flex items-center gap-1 text-sm font-bold text-ink-900">
                    {m.name}
                    {m.badge && (
                      <span className="rounded bg-toss-blue px-1 py-0.5 text-[10px] font-bold text-white">
                        {m.badge}
                      </span>
                    )}
                  </span>
                  <span className="mt-1 text-xs text-ink-300">{m.desc}</span>
                </button>
              ))}
            </div>
            <p className="mt-3 text-xs text-ink-300">
              ※ 데모 환경입니다. 실제 결제는 발생하지 않으며, 결제수단 연동은
              추후 PG사 계약 후 활성화됩니다.
            </p>
          </Card>
        </div>

        {/* 결제 요약 */}
        <aside className="h-fit lg:sticky lg:top-44">
          <div className="card-seamless p-5">
            <h2 className="text-base font-bold text-ink-900">결제 금액</h2>
            <div className="mt-4">
              <Row label="상품금액" value={formatWon(summary.subtotal)} />
              <Row
                label="배송비"
                value={
                  summary.shipping === 0 ? "무료" : formatWon(summary.shipping)
                }
              />
            </div>
            <div className="my-3 h-px bg-line" />
            <div className="flex items-end justify-between">
              <span className="text-sm font-bold text-ink-900">
                총 결제금액
              </span>
              <span className="tnum text-2xl font-extrabold text-toss-blue">
                {formatWon(summary.total)}
              </span>
            </div>

            <label className="mt-4 flex cursor-pointer items-start gap-2 text-sm text-ink-500">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="mt-0.5 h-4 w-4 accent-toss-blue"
              />
              주문 내용을 확인했으며, 결제에 동의합니다.
            </label>

            {error && (
              <p className="mt-3 rounded-lg bg-[#FEECEC] px-3 py-2 text-sm text-alert">
                {error}
              </p>
            )}

            <button
              type="button"
              onClick={handlePay}
              disabled={submitting}
              className="mt-4 w-full rounded-xl bg-toss-blue py-3.5 text-base font-bold text-white transition-colors hover:bg-toss-blueDark disabled:bg-ink-300"
            >
              {submitting
                ? "결제 처리 중…"
                : `${formatWon(summary.total)} 결제하기`}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

const input =
  "w-full rounded-lg border border-line px-3 py-2.5 text-sm text-ink-900 outline-none placeholder:text-ink-300 focus:border-toss-blue";

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="card-seamless p-5">
      <h2 className="mb-4 text-base font-bold text-ink-900">{title}</h2>
      {children}
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-3 last:mb-0">
      <label className="mb-1.5 block text-sm font-medium text-ink-500">
        {label}
      </label>
      {children}
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
