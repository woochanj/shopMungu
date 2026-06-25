import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-[400px] px-4 py-16">
      <h1 className="text-center text-2xl font-extrabold text-ink-900">
        문구도매센터
      </h1>
      <p className="mt-1 text-center text-sm text-ink-300">
        도매 회원 로그인
      </p>

      <div className="mt-8 space-y-3">
        <input
          placeholder="아이디 또는 사업자번호"
          className="w-full rounded-lg border border-line px-4 py-3 text-sm outline-none focus:border-toss-blue"
        />
        <input
          type="password"
          placeholder="비밀번호"
          className="w-full rounded-lg border border-line px-4 py-3 text-sm outline-none focus:border-toss-blue"
        />
        <button className="w-full rounded-xl bg-toss-blue py-3.5 text-base font-bold text-white hover:bg-toss-blueDark">
          로그인
        </button>
      </div>

      <p className="mt-6 text-center text-sm text-ink-300">
        데모 화면입니다. 인증 연동은 추후 추가됩니다.
      </p>
      <Link
        href="/"
        className="mt-4 block text-center text-sm text-ink-400 hover:text-toss-blue"
      >
        ← 홈으로
      </Link>
    </div>
  );
}
