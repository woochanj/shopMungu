import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-[640px] flex-col items-center px-4 py-24 text-center">
      <span className="text-5xl">🔍</span>
      <h1 className="mt-4 text-2xl font-extrabold text-ink-900">
        페이지를 찾을 수 없어요
      </h1>
      <p className="mt-2 text-sm text-ink-400">
        주소가 바뀌었거나 삭제된 상품일 수 있어요.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-xl bg-toss-blue px-5 py-3 text-sm font-bold text-white hover:bg-toss-blueDark"
      >
        홈으로 가기
      </Link>
    </div>
  );
}
