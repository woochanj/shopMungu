"use client";

import Link from "next/link";
import { useCategories } from "@/lib/use-categories";

export default function Footer() {
  const categories = useCategories();
  return (
    <footer className="mt-24 border-t border-line bg-white">
      <div className="mx-auto max-w-[1320px] px-4 py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* brand */}
          <div>
            <Link href="/" className="flex items-center gap-1.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-toss-blue text-base font-black text-white">
                문
              </span>
              <span className="text-lg font-extrabold tracking-tight text-ink-900">
                문구도매센터
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-ink-400">
              필기구부터 포장재까지, 모든 문구를
              <br />
              도매가로 한 곳에서.
            </p>
            <div className="mt-5">
              <p className="text-xs text-ink-300">고객센터</p>
              <p className="tnum mt-1 text-xl font-extrabold text-ink-900">
                1670-0000
              </p>
              <p className="mt-1 text-xs text-ink-300">
                평일 09:00 – 18:00 · 주말·공휴일 휴무
              </p>
            </div>
          </div>

          {/* category */}
          <FooterCol title="카테고리">
            {categories.slice(0, 6).map((c) => (
              <FooterLink key={c.id} href={`/category/${c.id}`}>
                {c.name}
              </FooterLink>
            ))}
          </FooterCol>

          {/* support */}
          <FooterCol title="고객지원">
            <FooterLink href="/orders">주문조회</FooterLink>
            <FooterText>공지사항</FooterText>
            <FooterText>대량구매 문의</FooterText>
            <FooterText>세금계산서 발행</FooterText>
          </FooterCol>

          {/* company */}
          <FooterCol title="회사 정보">
            <FooterText>회사 소개</FooterText>
            <FooterText>이용약관</FooterText>
            <FooterText>개인정보처리방침</FooterText>
            <FooterText>입점 문의</FooterText>
          </FooterCol>
        </div>

        <div className="mt-12 border-t border-line pt-6 text-xs leading-relaxed text-ink-300">
          <p>
            (주)문구도매센터 · 대표 홍길동 · 사업자등록번호 000-00-00000 ·
            통신판매업신고 제2026-서울-0000호
          </p>
          <p className="mt-1">서울특별시 문구로 1길 23, 도매센터빌딩</p>
          <p className="mt-4 text-ink-400">
            © 2026 문구도매센터 · 데모 사이트입니다. 모든 상품·가격은 예시
            데이터입니다.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h4 className="text-sm font-bold text-ink-900">{title}</h4>
      <ul className="mt-4 space-y-2.5">{children}</ul>
    </div>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        className="text-sm text-ink-400 transition-colors hover:text-toss-blue"
      >
        {children}
      </Link>
    </li>
  );
}

function FooterText({ children }: { children: React.ReactNode }) {
  return <li className="text-sm text-ink-400">{children}</li>;
}
