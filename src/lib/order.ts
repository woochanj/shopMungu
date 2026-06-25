import type { CartItem } from "./types";

export interface OrderLine {
  productId: string;
  name: string;
  brand: string;
  image: string;
  unitLabel: string;
  price: number;
  quantity: number;
  lineTotal: number;
}

export interface OrderSummary {
  lines: OrderLine[];
  itemCount: number; // 종류 수
  totalQuantity: number;
  subtotal: number;
  shipping: number;
  total: number;
}

/** 5만원 이상 무료배송, 그 외 3,000원 */
export const FREE_SHIPPING_THRESHOLD = 50000;
export const SHIPPING_FEE = 3000;

export function buildOrderSummary(items: CartItem[]): OrderSummary {
  const lines: OrderLine[] = [];
  for (const item of items) {
    const s = item.snapshot;
    lines.push({
      productId: item.productId,
      name: s.name,
      brand: s.brand,
      image: s.image,
      unitLabel: s.unitLabel,
      price: s.price,
      quantity: item.quantity,
      lineTotal: s.price * item.quantity,
    });
  }
  const subtotal = lines.reduce((s, l) => s + l.lineTotal, 0);
  const totalQuantity = lines.reduce((s, l) => s + l.quantity, 0);
  const shipping =
    subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  return {
    lines,
    itemCount: lines.length,
    totalQuantity,
    subtotal,
    shipping,
    total: subtotal + shipping,
  };
}
