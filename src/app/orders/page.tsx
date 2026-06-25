import Link from "next/link";

export default function OrdersPage() {
  return (
    <div className="mx-auto max-w-[1320px] px-4 py-6">
      <h1 className="mb-6 text-2xl font-extrabold text-ink-900">주문 내역</h1>
      <div className="flex flex-col items-center card-seamless py-24 text-center">
        <span className="text-4xl">🧾</span>
        <p className="mt-4 text-base font-semibold text-ink-700">
          아직 주문 내역이 없어요
        </p>
        <p className="mt-1 text-sm text-ink-300">
          주문 내역 조회는 로그인 후 이용할 수 있어요. (데모)
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
