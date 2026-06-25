import type { CategoryId, Product } from "./types";
import { SEED_PRODUCTS } from "./products";

/**
 * 상품 저장소 추상화.
 *
 * 지금은 브라우저 localStorage 구현(데모)이지만,
 * 상용 전환 시 이 인터페이스를 그대로 둔 채
 * `ApiProductRepository`(서버 DB + fetch) 구현으로 교체하면
 * 화면 코드는 거의 손대지 않아도 된다.
 *
 * 모든 메서드를 Promise로 둔 이유: localStorage는 동기지만,
 * DB/API 구현은 비동기이므로 미리 비동기 시그니처로 맞춰둔다.
 */
export interface ProductRepository {
  list(): Promise<Product[]>;
  get(id: string): Promise<Product | undefined>;
  byCategory(cat: string): Promise<Product[]>;
  search(query: string): Promise<Product[]>;
  popular(): Promise<Product[]>;
  newArrivals(): Promise<Product[]>;
  create(input: Omit<Product, "id">): Promise<Product>;
  update(id: string, patch: Partial<Product>): Promise<Product>;
  remove(id: string): Promise<void>;
  /** 엑셀 대량 등록: 기존 코드와 같으면 갱신, 없으면 추가 (upsert by code) */
  bulkUpsert(rows: Omit<Product, "id">[]): Promise<{ created: number; updated: number }>;
  /** 시드로 초기화 (관리자 "초기화" 버튼용) */
  reset(): Promise<void>;
}

const STORAGE_KEY = "mungu-products-v1";

function isBrowser() {
  return typeof window !== "undefined";
}

function matchesQuery(p: Product, q: string): boolean {
  return (
    p.name.toLowerCase().includes(q) ||
    p.brand.toLowerCase().includes(q) ||
    p.sub.toLowerCase().includes(q) ||
    p.code.toLowerCase().includes(q)
  );
}

class LocalStorageProductRepository implements ProductRepository {
  private cache: Product[] | null = null;

  private load(): Product[] {
    if (this.cache) return this.cache;
    if (!isBrowser()) return SEED_PRODUCTS;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        this.cache = JSON.parse(raw) as Product[];
      } else {
        this.cache = [...SEED_PRODUCTS];
        this.persist();
      }
    } catch {
      this.cache = [...SEED_PRODUCTS];
    }
    return this.cache;
  }

  private persist() {
    if (!isBrowser() || !this.cache) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.cache));
    // 다른 탭/컴포넌트가 갱신을 감지할 수 있도록 이벤트 발행
    window.dispatchEvent(new Event("mungu-products-changed"));
  }

  async list(): Promise<Product[]> {
    return [...this.load()];
  }

  async get(id: string): Promise<Product | undefined> {
    return this.load().find((p) => p.id === id);
  }

  async byCategory(cat: string): Promise<Product[]> {
    return this.load().filter((p) => p.category === cat);
  }

  async search(query: string): Promise<Product[]> {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return this.load().filter((p) => matchesQuery(p, q));
  }

  async popular(): Promise<Product[]> {
    return this.load().filter((p) => p.badges?.includes("인기"));
  }

  async newArrivals(): Promise<Product[]> {
    return this.load().filter((p) => p.badges?.includes("신상"));
  }

  async create(input: Omit<Product, "id">): Promise<Product> {
    const list = this.load();
    if (input.code && list.some((p) => p.code === input.code)) {
      throw new Error(`이미 사용 중인 품번입니다: ${input.code}`);
    }
    const product: Product = { ...input, id: genId(input.category, list) };
    list.push(product);
    this.persist();
    return product;
  }

  async update(id: string, patch: Partial<Product>): Promise<Product> {
    const list = this.load();
    const idx = list.findIndex((p) => p.id === id);
    if (idx < 0) throw new Error(`상품을 찾을 수 없습니다: ${id}`);
    if (patch.code && list.some((p) => p.code === patch.code && p.id !== id)) {
      throw new Error(`이미 사용 중인 품번입니다: ${patch.code}`);
    }
    list[idx] = { ...list[idx], ...patch, id };
    this.persist();
    return list[idx];
  }

  async remove(id: string): Promise<void> {
    const list = this.load();
    const next = list.filter((p) => p.id !== id);
    this.cache = next;
    this.persist();
  }

  async bulkUpsert(
    rows: Omit<Product, "id">[]
  ): Promise<{ created: number; updated: number }> {
    const list = this.load();
    let created = 0;
    let updated = 0;
    for (const row of rows) {
      const existing = row.code
        ? list.find((p) => p.code === row.code)
        : undefined;
      if (existing) {
        Object.assign(existing, row, { id: existing.id });
        updated++;
      } else {
        list.push({ ...row, id: genId(row.category, list) });
        created++;
      }
    }
    this.persist();
    return { created, updated };
  }

  async reset(): Promise<void> {
    this.cache = [...SEED_PRODUCTS];
    this.persist();
  }
}

function genId(cat: CategoryId, list: Product[]): string {
  // 같은 카테고리 내 최대 번호 + 1, 충돌 시 타임스탬프
  const nums = list
    .filter((p) => p.id.startsWith(`${cat}-`))
    .map((p) => parseInt(p.id.split("-")[1] ?? "0", 10))
    .filter((n) => !Number.isNaN(n));
  const next = (nums.length ? Math.max(...nums) : 0) + 1;
  const id = `${cat}-${next}`;
  return list.some((p) => p.id === id) ? `${cat}-${Date.now()}` : id;
}

// 단일 인스턴스로 공유
export const productRepo: ProductRepository =
  new LocalStorageProductRepository();
