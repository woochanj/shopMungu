import type { Category } from "./types";
import { CATEGORIES as SEED_CATEGORIES } from "./categories";

/**
 * 카테고리 저장소. 상품 저장소와 동일한 패턴(localStorage + 변경 이벤트).
 * 관리자가 카테고리/소분류를 추가·수정·삭제할 수 있다.
 * 상용 전환 시 이 구현만 API로 교체.
 */
export interface CategoryRepository {
  list(): Promise<Category[]>;
  get(id: string): Promise<Category | undefined>;
  create(input: Omit<Category, "id"> & { id?: string }): Promise<Category>;
  update(id: string, patch: Partial<Category>): Promise<Category>;
  remove(id: string): Promise<void>;
  reset(): Promise<void>;
}

const STORAGE_KEY = "mungu-categories-v1";
const EVENT = "mungu-categories-changed";

function isBrowser() {
  return typeof window !== "undefined";
}

function slugify(name: string): string {
  const base = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return base || `cat-${Date.now().toString(36)}`;
}

class LocalStorageCategoryRepository implements CategoryRepository {
  private cache: Category[] | null = null;

  private load(): Category[] {
    if (this.cache) return this.cache;
    if (!isBrowser()) return SEED_CATEGORIES;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        this.cache = JSON.parse(raw) as Category[];
      } else {
        this.cache = SEED_CATEGORIES.map((c) => ({ ...c }));
        this.persist();
      }
    } catch {
      this.cache = SEED_CATEGORIES.map((c) => ({ ...c }));
    }
    return this.cache;
  }

  private persist() {
    if (!isBrowser() || !this.cache) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.cache));
    window.dispatchEvent(new Event(EVENT));
  }

  async list(): Promise<Category[]> {
    return [...this.load()];
  }

  async get(id: string): Promise<Category | undefined> {
    return this.load().find((c) => c.id === id);
  }

  async create(
    input: Omit<Category, "id"> & { id?: string }
  ): Promise<Category> {
    const list = this.load();
    let id = input.id?.trim() || slugify(input.name);
    if (list.some((c) => c.id === id)) id = `${id}-${Date.now().toString(36)}`;
    const category: Category = {
      id,
      name: input.name,
      emoji: input.emoji || "📦",
      subs: input.subs ?? [],
    };
    list.push(category);
    this.persist();
    return category;
  }

  async update(id: string, patch: Partial<Category>): Promise<Category> {
    const list = this.load();
    const idx = list.findIndex((c) => c.id === id);
    if (idx < 0) throw new Error(`카테고리를 찾을 수 없습니다: ${id}`);
    list[idx] = { ...list[idx], ...patch, id };
    this.persist();
    return list[idx];
  }

  async remove(id: string): Promise<void> {
    this.cache = this.load().filter((c) => c.id !== id);
    this.persist();
  }

  async reset(): Promise<void> {
    this.cache = SEED_CATEGORIES.map((c) => ({ ...c }));
    this.persist();
  }
}

export const categoryRepo: CategoryRepository =
  new LocalStorageCategoryRepository();
export const CATEGORY_EVENT = EVENT;
