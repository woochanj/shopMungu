"use client";

import { useEffect, useState } from "react";
import type { Category } from "./types";
import { CATEGORIES as SEED } from "./categories";
import { CATEGORY_EVENT, categoryRepo } from "./category-repository";

/**
 * 저장소에서 카테고리를 읽는 훅. 관리자가 카테고리를 바꾸면 자동 갱신.
 * 초기값은 시드를 써서 첫 페인트에 깜빡임을 줄인다.
 */
export function useCategories() {
  const [categories, setCategories] = useState<Category[]>(SEED);

  useEffect(() => {
    let alive = true;
    const load = () => {
      categoryRepo.list().then((cs) => {
        if (alive) setCategories(cs);
      });
    };
    load();
    window.addEventListener(CATEGORY_EVENT, load);
    return () => {
      alive = false;
      window.removeEventListener(CATEGORY_EVENT, load);
    };
  }, []);

  return categories;
}
