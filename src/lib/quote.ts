import type { CartItem } from "./types";

/**
 * 견적서 계산.
 *
 * 한국 B2B 견적 관행: 합계금액 = 공급가액 + 부가세(10%).
 * 우리 판매가(price)는 소비자가(VAT 포함)로 보고,
 * 공급가액 = 판매가 / 1.1, 세액 = 판매가 - 공급가액 으로 역산한다.
 * (관리자/도매 거래에서 흔한 방식)
 */

export interface QuoteLine {
  no: number;
  code: string;
  name: string;
  spec: string; // 규격 = 판매단위
  quantity: number;
  unitPrice: number; // 단가 (VAT 포함, 판매가)
  supplyAmount: number; // 공급가액 (VAT 제외)
  taxAmount: number; // 세액
  amount: number; // 합계 (단가 × 수량, VAT 포함)
}

export interface Quote {
  lines: QuoteLine[];
  totalQuantity: number;
  supplyTotal: number; // 공급가액 합계
  taxTotal: number; // 부가세 합계
  grandTotal: number; // 총 합계금액
}

export const VAT_RATE = 0.1;

export function buildQuote(items: CartItem[]): Quote {
  const lines: QuoteLine[] = items.map((item, idx) => {
    const s = item.snapshot;
    const amount = s.price * item.quantity; // VAT 포함 합계
    const supplyAmount = Math.round(amount / (1 + VAT_RATE));
    const taxAmount = amount - supplyAmount;
    return {
      no: idx + 1,
      code: s.code,
      name: s.name,
      spec: s.unitLabel,
      quantity: item.quantity,
      unitPrice: s.price,
      supplyAmount,
      taxAmount,
      amount,
    };
  });

  const supplyTotal = lines.reduce((a, l) => a + l.supplyAmount, 0);
  const taxTotal = lines.reduce((a, l) => a + l.taxAmount, 0);
  const totalQuantity = lines.reduce((a, l) => a + l.quantity, 0);

  return {
    lines,
    totalQuantity,
    supplyTotal,
    taxTotal,
    grandTotal: supplyTotal + taxTotal,
  };
}

/** 견적번호 생성 (Q-YYYYMMDD-XXXX) */
export function generateQuoteNo(): string {
  const d = new Date();
  const ymd =
    d.getFullYear().toString() +
    String(d.getMonth() + 1).padStart(2, "0") +
    String(d.getDate()).padStart(2, "0");
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `Q-${ymd}-${rand}`;
}

/** 금액을 한글 표기로 (예: 일금 삼만오천원정) — 간단 버전 */
export function formatKoreanAmount(n: number): string {
  return `일금 ${n.toLocaleString("ko-KR")}원정`;
}

/** 공급자(우리 회사) 고정 정보 */
export const SUPPLIER = {
  company: "문구도매센터",
  ceo: "홍길동",
  bizNo: "000-00-00000",
  address: "서울특별시 문구로 1길 23, 도매센터빌딩",
  tel: "1670-0000",
  fax: "02-000-0000",
};
