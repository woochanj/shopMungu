"use client";

import { useEffect, useState } from "react";
import { orderRepo, ORDER_EVENT, type Order } from "./order-repository";

/**
 * 저장된 주문을 읽어오는 클라이언트 훅.
 * 결제·관리자 상태변경 시 ORDER_EVENT로 자동 갱신된다.
 * localStorage는 클라이언트에서만 읽을 수 있어, 첫 렌더(SSR/하이드레이션)에는
 * 빈 배열 + loading=true 로 두고 마운트 후 채운다.
 */
export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const refresh = () => {
      setOrders(orderRepo.list());
      setLoading(false);
    };
    refresh();
    window.addEventListener(ORDER_EVENT, refresh);
    return () => window.removeEventListener(ORDER_EVENT, refresh);
  }, []);

  return { orders, loading };
}

/** 단일 주문 조회 훅 */
export function useOrder(id: string) {
  const [order, setOrder] = useState<Order | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const refresh = () => {
      setOrder(orderRepo.get(id));
      setLoading(false);
    };
    refresh();
    window.addEventListener(ORDER_EVENT, refresh);
    return () => window.removeEventListener(ORDER_EVENT, refresh);
  }, [id]);

  return { order, loading };
}
