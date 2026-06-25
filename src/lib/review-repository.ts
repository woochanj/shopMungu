/**
 * 리뷰 · Q&A 저장소. 상품/카테고리와 동일한 패턴(localStorage + 변경 이벤트).
 * 상용 전환 시 이 구현만 API로 교체하면 화면은 그대로.
 */

export interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number; // 1~5
  content: string;
  createdAt: string; // ISO
}

export interface Question {
  id: string;
  productId: string;
  author: string;
  content: string;
  answer?: string; // 판매자 답변 (없으면 답변대기)
  createdAt: string;
}

const REVIEW_KEY = "mungu-reviews-v1";
const QNA_KEY = "mungu-qna-v1";
export const REVIEW_EVENT = "mungu-reviews-changed";
export const QNA_EVENT = "mungu-qna-changed";

function isBrowser() {
  return typeof window !== "undefined";
}

function load<T>(key: string, seed: T[]): T[] {
  if (!isBrowser()) return seed;
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T[];
    localStorage.setItem(key, JSON.stringify(seed));
    return seed;
  } catch {
    return seed;
  }
}

function save<T>(key: string, list: T[], event: string) {
  if (!isBrowser()) return;
  localStorage.setItem(key, JSON.stringify(list));
  window.dispatchEvent(new Event(event));
}

function uid(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 6)}`;
}

// ─── 시드 데이터 ───────────────────────────────────────────
const SEED_REVIEWS: Review[] = [
  { id: "rv-seed-1", productId: "writing-1", author: "사무실***", rating: 5, content: "대량으로 주문했는데 가격이 정말 좋네요. 필기감도 부드럽습니다.", createdAt: "2026-06-10T09:00:00Z" },
  { id: "rv-seed-2", productId: "writing-1", author: "문구덕***", rating: 4, content: "무난하게 잘 쓰고 있어요. 재구매 의사 있습니다.", createdAt: "2026-06-12T14:30:00Z" },
  { id: "rv-seed-3", productId: "paper-1", author: "학교납***", rating: 5, content: "학교 비품으로 구매했어요. 묶음 단위라 관리가 편합니다.", createdAt: "2026-06-15T11:00:00Z" },
];

const SEED_QNA: Question[] = [
  { id: "qa-seed-1", productId: "writing-1", author: "예비구***", content: "100개 이상 주문 시 추가 할인 가능한가요?", answer: "네, 대량구매 문의로 연락 주시면 별도 견적 안내드립니다.", createdAt: "2026-06-11T10:00:00Z" },
  { id: "qa-seed-2", productId: "writing-1", author: "신규회***", content: "세금계산서 발행되나요?", createdAt: "2026-06-16T16:20:00Z" },
];

// ─── 리뷰 API ───────────────────────────────────────────
export const reviewRepo = {
  byProduct(productId: string): Review[] {
    return load<Review>(REVIEW_KEY, SEED_REVIEWS)
      .filter((r) => r.productId === productId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },
  add(input: Omit<Review, "id" | "createdAt">): Review {
    const list = load<Review>(REVIEW_KEY, SEED_REVIEWS);
    const review: Review = {
      ...input,
      id: uid("rv"),
      createdAt: new Date().toISOString(),
    };
    list.push(review);
    save(REVIEW_KEY, list, REVIEW_EVENT);
    return review;
  },
};

// ─── Q&A API ───────────────────────────────────────────
export const qnaRepo = {
  byProduct(productId: string): Question[] {
    return load<Question>(QNA_KEY, SEED_QNA)
      .filter((q) => q.productId === productId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },
  add(input: Omit<Question, "id" | "createdAt" | "answer">): Question {
    const list = load<Question>(QNA_KEY, SEED_QNA);
    const q: Question = {
      ...input,
      id: uid("qa"),
      createdAt: new Date().toISOString(),
    };
    list.push(q);
    save(QNA_KEY, list, QNA_EVENT);
    return q;
  },
};

/** 날짜를 YYYY.MM.DD로 */
export function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(
    d.getDate()
  ).padStart(2, "0")}`;
}
