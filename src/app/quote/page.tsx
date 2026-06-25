"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import {
  SUPPLIER,
  buildQuote,
  formatKoreanAmount,
  generateQuoteNo,
} from "@/lib/quote";
import { exportQuoteExcel } from "@/lib/excel";

const won = (n: number) => n.toLocaleString("ko-KR");

export default function QuotePage() {
  const { items } = useCart();
  const quote = useMemo(() => buildQuote(items), [items]);

  // 견적번호/날짜는 페이지 진입 시 1회 고정
  const [quoteNo] = useState(generateQuoteNo);
  const today = useMemo(
    () => new Date().toLocaleDateString("ko-KR"),
    []
  );

  const [customer, setCustomer] = useState("");
  const [validDays, setValidDays] = useState("15");

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-[1320px] px-4 py-6">
        <h1 className="mb-6 text-2xl font-extrabold text-ink-900">견적서</h1>
        <div className="flex flex-col items-center panel-soft py-24 text-center">
          <p className="text-base font-semibold text-ink-700">
            견적 낼 상품이 없어요
          </p>
          <p className="mt-1 text-sm text-ink-300">
            장바구니에 상품을 담은 뒤 견적서를 만들 수 있어요.
          </p>
          <Link
            href="/"
            className="mt-5 rounded-xl bg-toss-blue px-5 py-3 text-sm font-bold text-white hover:bg-toss-blueDark"
          >
            상품 보러가기
          </Link>
        </div>
      </div>
    );
  }

  function handlePrint() {
    window.print();
  }

  function handleExcel() {
    exportQuoteExcel(
      quote,
      {
        quoteNo,
        date: today,
        customer: customer.trim() || "고객님",
        supplier: {
          company: SUPPLIER.company,
          ceo: SUPPLIER.ceo,
          bizNo: SUPPLIER.bizNo,
        },
      },
      `견적서_${quoteNo}.xlsx`
    );
  }

  return (
    <div className="mx-auto max-w-[900px] px-4 py-6">
      {/* toolbar (인쇄 시 숨김) */}
      <div className="no-print mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-sm text-ink-300">
          <Link href="/cart" className="hover:text-toss-blue">
            장바구니
          </Link>
          <span>›</span>
          <span className="font-medium text-ink-700">견적서</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExcel}
            className="rounded-lg border border-line bg-white px-4 py-2.5 text-sm font-semibold text-ink-700 hover:border-toss-blue hover:text-toss-blue"
          >
            ⬇ 엑셀 다운로드
          </button>
          <button
            onClick={handlePrint}
            className="rounded-lg bg-toss-blue px-4 py-2.5 text-sm font-bold text-white hover:bg-toss-blueDark"
          >
            🖨 인쇄 / PDF 저장
          </button>
        </div>
      </div>

      {/* 수신처 입력 (인쇄 시 숨김) */}
      <div className="no-print mb-5 flex flex-wrap gap-3 panel-soft p-4">
        <label className="flex flex-1 flex-col gap-1">
          <span className="text-xs font-medium text-ink-500">수신 (받는 분/업체)</span>
          <input
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
            placeholder="예) (주)행복문구 귀하"
            className="rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-toss-blue"
          />
        </label>
        <label className="flex w-40 flex-col gap-1">
          <span className="text-xs font-medium text-ink-500">유효기간 (일)</span>
          <input
            value={validDays}
            onChange={(e) => setValidDays(e.target.value.replace(/\D/g, ""))}
            inputMode="numeric"
            className="rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-toss-blue"
          />
        </label>
      </div>

      {/* 견적서 본문 (인쇄 영역) */}
      <div className="print-area rounded-card border border-line bg-white p-8">
        <h1 className="text-center text-3xl font-extrabold tracking-[0.3em] text-ink-900">
          견 적 서
        </h1>

        <div className="mt-6 flex justify-between gap-6 text-sm">
          {/* 수신 */}
          <div className="flex-1">
            <p className="text-lg font-bold text-ink-900">
              {customer.trim() || "고객님"} 귀하
            </p>
            <table className="mt-3 text-ink-500">
              <tbody>
                <Row label="견적번호" value={quoteNo} />
                <Row label="견적일자" value={today} />
                <Row label="유효기간" value={`견적일로부터 ${validDays || "15"}일`} />
              </tbody>
            </table>
            <p className="mt-3 text-ink-500">
              아래와 같이 견적합니다.
            </p>
          </div>

          {/* 공급자 */}
          <div className="w-72 rounded-lg border border-line p-4">
            <p className="mb-2 text-xs font-bold text-ink-300">공급자</p>
            <table className="w-full text-ink-600">
              <tbody>
                <Row label="상호" value={SUPPLIER.company} />
                <Row label="대표자" value={SUPPLIER.ceo} />
                <Row label="사업자번호" value={SUPPLIER.bizNo} />
                <Row label="주소" value={SUPPLIER.address} small />
                <Row label="연락처" value={SUPPLIER.tel} />
              </tbody>
            </table>
          </div>
        </div>

        {/* 합계 강조 */}
        <div className="mt-6 rounded-lg bg-surface px-5 py-4">
          <span className="text-sm text-ink-400">합계금액 (부가세 포함)</span>
          <p className="tnum mt-1 text-2xl font-extrabold text-ink-900">
            {formatKoreanAmount(quote.grandTotal)} (₩{won(quote.grandTotal)})
          </p>
        </div>

        {/* 품목 표 */}
        <table className="mt-6 w-full border-collapse text-sm">
          <thead>
            <tr className="border-y-2 border-ink-900 text-ink-700">
              <Th>No</Th>
              <Th align="left">품명</Th>
              <Th>규격</Th>
              <Th align="right">수량</Th>
              <Th align="right">단가</Th>
              <Th align="right">공급가액</Th>
              <Th align="right">세액</Th>
              <Th align="right">합계</Th>
            </tr>
          </thead>
          <tbody>
            {quote.lines.map((l) => (
              <tr key={l.no} className="border-b border-line">
                <Td>{l.no}</Td>
                <Td align="left">
                  <span className="font-medium text-ink-900">{l.name}</span>
                  <span className="ml-1 text-xs text-ink-300">{l.code}</span>
                </Td>
                <Td>{l.spec}</Td>
                <Td align="right" num>
                  {won(l.quantity)}
                </Td>
                <Td align="right" num>
                  {won(l.unitPrice)}
                </Td>
                <Td align="right" num>
                  {won(l.supplyAmount)}
                </Td>
                <Td align="right" num>
                  {won(l.taxAmount)}
                </Td>
                <Td align="right" num>
                  <span className="font-semibold text-ink-900">
                    {won(l.amount)}
                  </span>
                </Td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-y-2 border-ink-900 font-bold text-ink-900">
              <Td align="left" colSpan={5}>
                합계 (수량 {won(quote.totalQuantity)})
              </Td>
              <Td align="right" num>
                {won(quote.supplyTotal)}
              </Td>
              <Td align="right" num>
                {won(quote.taxTotal)}
              </Td>
              <Td align="right" num>
                {won(quote.grandTotal)}
              </Td>
            </tr>
          </tfoot>
        </table>

        <p className="mt-6 text-xs leading-relaxed text-ink-300">
          ※ 본 견적은 공급가액 + 부가세(10%) 기준이며, 대량 구매 시 별도 협의가
          가능합니다. 단가는 시점에 따라 변동될 수 있습니다.
        </p>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  small,
}: {
  label: string;
  value: string;
  small?: boolean;
}) {
  return (
    <tr>
      <td className="py-0.5 pr-3 align-top text-ink-300">{label}</td>
      <td className={`py-0.5 ${small ? "text-xs" : ""}`}>{value}</td>
    </tr>
  );
}

function Th({
  children,
  align = "center",
}: {
  children: React.ReactNode;
  align?: "left" | "center" | "right";
}) {
  return (
    <th
      className={`px-2 py-2 font-semibold ${
        align === "left"
          ? "text-left"
          : align === "right"
            ? "text-right"
            : "text-center"
      }`}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  align = "center",
  num,
  colSpan,
}: {
  children: React.ReactNode;
  align?: "left" | "center" | "right";
  num?: boolean;
  colSpan?: number;
}) {
  return (
    <td
      colSpan={colSpan}
      className={`px-2 py-2 ${
        align === "left"
          ? "text-left"
          : align === "right"
            ? "text-right"
            : "text-center"
      } ${num ? "tnum" : ""}`}
    >
      {children}
    </td>
  );
}
