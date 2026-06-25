import type { OrderLine } from "./order";
import type { PaymentProvider } from "./payment";

/**
 * 주문 저장소. 결제 완료 시 주문을 저장하고, 고객 주문내역·관리자 주문관리에서 조회한다.
 * 상품/카테고리와 동일한 localStorage 패턴. 상용 전환 시 이 구현만 API로 교체.
 */

export type OrderStatus =
  | "paid" // 결제완료
  | "preparing" // 상품준비중
  | "shipping" // 배송중
  | "delivered" // 배송완료
  | "cancelled"; // 취소

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  paid: "결제완료",
  preparing: "상품준비중",
  shipping: "배송중",
  delivered: "배송완료",
  cancelled: "취소",
};

/** 다음 단계로 진행 가능한 상태 흐름 (관리자 버튼용) */
export const ORDER_STATUS_FLOW: OrderStatus[] = [
  "paid",
  "preparing",
  "shipping",
  "delivered",
];

export interface Order {
  id: string; // 주문번호
  createdAt: string; // ISO
  status: OrderStatus;
  provider: PaymentProvider;
  // 받는 사람
  customerName: string;
  phone: string;
  address: string;
  memo?: string;
  // 금액
  lines: OrderLine[];
  subtotal: number;
  shipping: number;
  total: number;
}

const KEY = "mungu-orders-v1";
export const ORDER_EVENT = "mungu-orders-changed";

function isBrowser() {
  return typeof window !== "undefined";
}

function load(): Order[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Order[]) : [];
  } catch {
    return [];
  }
}

function persist(list: Order[]) {
  if (!isBrowser()) return;
  localStorage.setItem(KEY, JSON.stringify(list));
  window.dispatchEvent(new Event(ORDER_EVENT));
}

export const orderRepo = {
  list(): Order[] {
    return load().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },
  get(id: string): Order | undefined {
    return load().find((o) => o.id === id);
  },
  create(order: Order): Order {
    const list = load();
    list.push(order);
    persist(list);
    return order;
  },
  updateStatus(id: string, status: OrderStatus): void {
    const list = load();
    const o = list.find((x) => x.id === id);
    if (o) {
      o.status = status;
      persist(list);
    }
  },
};

export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  const date = `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(
    d.getDate()
  ).padStart(2, "0")}`;
  const time = `${String(d.getHours()).padStart(2, "0")}:${String(
    d.getMinutes()
  ).padStart(2, "0")}`;
  return `${date} ${time}`;
}
