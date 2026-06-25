// 결제수단 정의 + PG 어댑터 스텁
//
// ⚠️ 실제 한국 PG 연동 자리입니다.
// 지금은 더미(성공 시뮬레이션)지만, 각 provider의 requestPayment를
// 실제 SDK 호출로 교체하면 바로 연동됩니다. 예:
//   - 토스페이먼츠: @tosspayments/payment-sdk → requestPayment(...)
//   - 카카오페이:   결제 준비 API → redirect URL
//   - 네이버페이:   NaverPay SDK → open()
//   - 무통장입금:   주문 생성 후 가상계좌 안내

export type PaymentProvider =
  | "card"
  | "tosspay"
  | "kakaopay"
  | "naverpay"
  | "vbank";

export interface PaymentMethod {
  id: PaymentProvider;
  name: string;
  desc: string;
  badge?: string;
}

export const PAYMENT_METHODS: PaymentMethod[] = [
  { id: "card", name: "신용·체크카드", desc: "국내 모든 카드 결제" },
  { id: "tosspay", name: "토스페이", desc: "토스 간편결제", badge: "간편" },
  { id: "kakaopay", name: "카카오페이", desc: "카카오 간편결제", badge: "간편" },
  { id: "naverpay", name: "네이버페이", desc: "네이버 간편결제", badge: "간편" },
  { id: "vbank", name: "무통장입금", desc: "가상계좌 발급 (세금계산서 가능)" },
];

export interface PaymentRequest {
  orderId: string;
  orderName: string;
  amount: number;
  customerName: string;
  provider: PaymentProvider;
}

export interface PaymentResult {
  success: boolean;
  orderId: string;
  provider: PaymentProvider;
  paidAt: string;
  message?: string;
}

/**
 * 결제 요청 스텁. 실제 PG SDK 호출로 교체할 진입점.
 * 현재는 0.6초 지연 후 성공을 반환하는 더미.
 */
export async function requestPayment(
  req: PaymentRequest
): Promise<PaymentResult> {
  // TODO: provider별 실제 PG SDK 호출
  // switch (req.provider) {
  //   case "tosspay": return await tossPayments.requestPayment(...)
  //   case "kakaopay": ...
  // }
  await new Promise((r) => setTimeout(r, 600));
  return {
    success: true,
    orderId: req.orderId,
    provider: req.provider,
    paidAt: new Date().toISOString(),
  };
}

export function generateOrderId(): string {
  const d = new Date();
  const ymd =
    d.getFullYear().toString() +
    String(d.getMonth() + 1).padStart(2, "0") +
    String(d.getDate()).padStart(2, "0");
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `ORD-${ymd}-${rand}`;
}
