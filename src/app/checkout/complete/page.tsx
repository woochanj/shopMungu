import Link from "next/link";
import { PAYMENT_METHODS, type PaymentProvider } from "@/lib/payment";

export default async function CheckoutCompletePage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string; provider?: string }>;
}) {
  const { orderId, provider } = await searchParams;
  const method = PAYMENT_METHODS.find(
    (m) => m.id === (provider as PaymentProvider)
  );

  return (
    <div className="mx-auto max-w-[640px] px-4 py-16">
      <div className="flex flex-col items-center card-seamless px-6 py-14 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-toss-blueLight">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#3182F6"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <h1 className="mt-5 text-2xl font-extrabold text-ink-900">
          주문이 완료되었어요
        </h1>
        <p className="mt-2 text-sm text-ink-400">
          주문해 주셔서 감사합니다. 배송 준비를 시작할게요.
        </p>

        <div className="mt-7 w-full rounded-card bg-surface p-5 text-left">
          <Row label="주문번호" value={orderId ?? "-"} />
          <Row label="결제수단" value={method?.name ?? "-"} />
          <Row label="주문상태" value="결제 완료" />
        </div>

        <div className="mt-7 flex w-full gap-2">
          <Link
            href="/orders"
            className="flex-1 rounded-xl border border-line py-3.5 text-center text-sm font-bold text-ink-700 hover:border-toss-blue hover:text-toss-blue"
          >
            주문 내역
          </Link>
          <Link
            href="/"
            className="flex-1 rounded-xl bg-toss-blue py-3.5 text-center text-sm font-bold text-white hover:bg-toss-blueDark"
          >
            쇼핑 계속하기
          </Link>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-sm text-ink-400">{label}</span>
      <span className="tnum text-sm font-bold text-ink-900">{value}</span>
    </div>
  );
}
