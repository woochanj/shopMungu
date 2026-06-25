// 문구도매센터 도메인 타입

/**
 * 카테고리 ID. 기본 6종은 시드값이지만, 관리자가 카테고리를 추가할 수 있어
 * 런타임에는 임의 문자열이 될 수 있으므로 string 별칭으로 둔다.
 * 기본 시드: writing | paper | office | art | desk | packing
 */
export type CategoryId = string;

export interface Category {
  id: CategoryId;
  name: string;
  emoji: string;
  subs: string[]; // 소분류 이름들
}

export interface Product {
  id: string;
  code: string; // 상품코드 (도매)
  name: string;
  brand: string;
  category: CategoryId;
  sub: string; // 소분류
  image: string;
  /** 판매가 (1 판매단위 기준, 원) */
  price: number;
  /** 정가 (할인 전). price와 같으면 할인 없음 */
  listPrice: number;
  /** 묶음 입수 (예: 12 → 12개입). 1이면 낱개 */
  unitCount: number;
  /** 판매 단위 라벨 (예: "12개입", "1박스(50개)", "낱개") */
  unitLabel: string;
  /** 최소 주문 수량 (도매) */
  minOrder: number;
  rating: number;
  reviewCount: number;
  soldOut?: boolean;
  badges?: string[]; // "인기", "신상", "재입고" 등
  description?: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  /**
   * 담은 시점의 상품 정보 스냅샷.
   * 가격이 나중에 바뀌어도 장바구니/견적은 담은 시점 값을 유지하고,
   * 합계 계산에 비동기 상품 조회가 필요 없게 한다. (상용 표준 패턴)
   */
  snapshot: {
    name: string;
    brand: string;
    image: string;
    price: number;
    listPrice: number;
    unitLabel: string;
    unitCount: number;
    code: string;
  };
}
