"use client";

import { useEffect, useState, useCallback } from "react";
import type { Product } from "./types";
import { productRepo } from "./product-repository";

/**
 * 저장소에서 상품을 읽어오는 클라이언트 훅.
 * 관리자가 상품을 바꾸면 "mungu-products-changed" 이벤트로 자동 갱신된다.
 *
 * @param loader 어떤 조회를 할지 결정하는 함수 (repo를 받아 Promise<Product[]> 반환)
 */
export function useProducts(
  loader: (repo: typeof productRepo) => Promise<Product[]>,
  deps: unknown[] = []
) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const run = useCallback(() => {
    let alive = true;
    setLoading(true);
    loader(productRepo).then((res) => {
      if (alive) {
        setProducts(res);
        setLoading(false);
      }
    });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    const cleanup = run();
    const onChange = () => run();
    window.addEventListener("mungu-products-changed", onChange);
    return () => {
      cleanup?.();
      window.removeEventListener("mungu-products-changed", onChange);
    };
  }, [run]);

  return { products, loading };
}

/** 단일 상품 조회 훅 */
export function useProduct(id: string) {
  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    const load = () => {
      setLoading(true);
      productRepo.get(id).then((p) => {
        if (alive) {
          setProduct(p);
          setLoading(false);
        }
      });
    };
    load();
    window.addEventListener("mungu-products-changed", load);
    return () => {
      alive = false;
      window.removeEventListener("mungu-products-changed", load);
    };
  }, [id]);

  return { product, loading };
}
