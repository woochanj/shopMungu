import type { CategoryId, Product } from "./types";
import { placeholderImage } from "./placeholder";

/**
 * 더미 상품 데이터. 도매센터이므로 상품 수가 많고,
 * 개당 단가/묶음 단위/최소 주문 수량이 핵심 정보다.
 */

interface Seed {
  name: string;
  brand: string;
  sub: string;
  price: number;
  unitCount: number;
  unitLabel: string;
  minOrder: number;
  badges?: string[];
  discount?: number; // 0~1, 할인율
  soldOut?: boolean;
}

const SEEDS: Record<CategoryId, Seed[]> = {
  writing: [
    { name: "모나미 153 볼펜 흑색", brand: "모나미", sub: "볼펜", price: 3600, unitCount: 12, unitLabel: "12자루", minOrder: 1, badges: ["인기"] },
    { name: "제트스트림 0.5 검정", brand: "유니", sub: "볼펜", price: 13200, unitCount: 12, unitLabel: "12자루", minOrder: 1, badges: ["인기"], discount: 0.15 },
    { name: "하이테크-C 0.4 3색세트", brand: "파이롯트", sub: "수성펜/사인펜", price: 8400, unitCount: 3, unitLabel: "3색세트", minOrder: 2 },
    { name: "스테들러 트리플러스 12색", brand: "스테들러", sub: "수성펜/사인펜", price: 9800, unitCount: 12, unitLabel: "12색", minOrder: 1, badges: ["신상"] },
    { name: "스테들러 노리스 연필 HB", brand: "스테들러", sub: "연필/샤프", price: 7200, unitCount: 12, unitLabel: "12자루", minOrder: 1 },
    { name: "펜텔 그래프기어 0.5 샤프", brand: "펜텔", sub: "연필/샤프", price: 9900, unitCount: 1, unitLabel: "낱개", minOrder: 5 },
    { name: "제브라 마일드라이너 형광펜 5색", brand: "제브라", sub: "형광펜", price: 6500, unitCount: 5, unitLabel: "5색세트", minOrder: 2, badges: ["인기"] },
    { name: "모나미 보드마카 흑색", brand: "모나미", sub: "마커", price: 9000, unitCount: 12, unitLabel: "12개입", minOrder: 1 },
    { name: "동아 유성매직 청색", brand: "동아", sub: "마커", price: 6000, unitCount: 12, unitLabel: "12개입", minOrder: 1, discount: 0.1 },
    { name: "톰보우 모노 지우개 대형", brand: "톰보우", sub: "지우개", price: 4800, unitCount: 12, unitLabel: "12개입", minOrder: 2 },
    { name: "파버카스텔 연필 9000 2B", brand: "파버카스텔", sub: "연필/샤프", price: 11000, unitCount: 12, unitLabel: "12자루", minOrder: 1, badges: ["신상"] },
    { name: "모나미 플러스펜 3000 검정", brand: "모나미", sub: "수성펜/사인펜", price: 3000, unitCount: 12, unitLabel: "12자루", minOrder: 2, badges: ["인기"] },
  ],
  paper: [
    { name: "스프링노트 A5 무지 80매", brand: "양지사", sub: "노트", price: 18000, unitCount: 10, unitLabel: "10권", minOrder: 1, badges: ["인기"] },
    { name: "모닝글로리 무선노트 B5", brand: "모닝글로리", sub: "노트", price: 21000, unitCount: 10, unitLabel: "10권", minOrder: 1, discount: 0.12 },
    { name: "2026 데일리 다이어리 A5", brand: "양지사", sub: "다이어리", price: 9500, unitCount: 1, unitLabel: "낱개", minOrder: 3, badges: ["신상"] },
    { name: "3M 포스트잇 654 노랑", brand: "3M", sub: "메모지/포스트잇", price: 12600, unitCount: 12, unitLabel: "12패드", minOrder: 1, badges: ["인기"] },
    { name: "더블에이 A4 복사용지 80g", brand: "Double A", sub: "복사용지", price: 26500, unitCount: 1, unitLabel: "1박스(2500매)", minOrder: 1, badges: ["인기"] },
    { name: "한솔 A4 복사용지 75g", brand: "한솔", sub: "복사용지", price: 23900, unitCount: 1, unitLabel: "1박스(2500매)", minOrder: 1, discount: 0.08 },
    { name: "문화 스케치북 8절", brand: "문화연필", sub: "스케치북", price: 14000, unitCount: 10, unitLabel: "10권", minOrder: 1 },
    { name: "떡메모지 정사각 100매", brand: "오피스", sub: "메모지/포스트잇", price: 5400, unitCount: 6, unitLabel: "6권", minOrder: 2 },
    { name: "모닝글로리 인덱스 노트 A5", brand: "모닝글로리", sub: "노트", price: 19500, unitCount: 10, unitLabel: "10권", minOrder: 1 },
  ],
  office: [
    { name: "옥스포드 클리어파일 A4 20매", brand: "옥스포드", sub: "파일/바인더", price: 16800, unitCount: 12, unitLabel: "12개", minOrder: 1, badges: ["인기"] },
    { name: "3공 D링 바인더 A4", brand: "오피스", sub: "파일/바인더", price: 22000, unitCount: 10, unitLabel: "10개", minOrder: 1 },
    { name: "더블클립 25mm", brand: "오피스", sub: "클립/집게", price: 4200, unitCount: 24, unitLabel: "24개입", minOrder: 2, badges: ["인기"] },
    { name: "3M 스카치 매직테이프 18mm", brand: "3M", sub: "테이프/풀", price: 13200, unitCount: 12, unitLabel: "12개입", minOrder: 1, discount: 0.1 },
    { name: "딱풀 35g", brand: "아모스", sub: "테이프/풀", price: 9600, unitCount: 12, unitLabel: "12개입", minOrder: 1 },
    { name: "플러스 사무용 가위 175mm", brand: "Plus", sub: "가위/커터", price: 8400, unitCount: 6, unitLabel: "6개", minOrder: 1 },
    { name: "OLFA 커터칼 대형 + 날", brand: "OLFA", sub: "가위/커터", price: 11200, unitCount: 6, unitLabel: "6개", minOrder: 1, badges: ["신상"] },
    { name: "맥스 호치키스 HD-10", brand: "MAX", sub: "스테이플러", price: 15000, unitCount: 5, unitLabel: "5개", minOrder: 1 },
    { name: "형광 점착 라벨 원형 16mm", brand: "오피스", sub: "라벨", price: 6900, unitCount: 10, unitLabel: "10팩", minOrder: 1 },
    { name: "철제 책상용 집게 대", brand: "오피스", sub: "클립/집게", price: 7600, unitCount: 12, unitLabel: "12개입", minOrder: 2, soldOut: true },
  ],
  art: [
    { name: "프리즈마 색연필 24색", brand: "프리즈마", sub: "색연필/크레파스", price: 32000, unitCount: 24, unitLabel: "24색", minOrder: 1, badges: ["인기"] },
    { name: "동아 12색 크레파스", brand: "동아", sub: "색연필/크레파스", price: 8400, unitCount: 12, unitLabel: "12개", minOrder: 1, discount: 0.1 },
    { name: "신한 수채화물감 12색", brand: "신한", sub: "물감/팔레트", price: 14500, unitCount: 12, unitLabel: "12색", minOrder: 1 },
    { name: "화홍 수채화붓 세트 7본", brand: "화홍", sub: "붓", price: 18900, unitCount: 7, unitLabel: "7본세트", minOrder: 1, badges: ["신상"] },
    { name: "캔버스 F4 (5개입)", brand: "오피스", sub: "스케치/캔버스", price: 16000, unitCount: 5, unitLabel: "5개입", minOrder: 1 },
    { name: "아모스 컬러클레이 12색", brand: "아모스", sub: "점토", price: 9900, unitCount: 12, unitLabel: "12색", minOrder: 1 },
    { name: "팔레트 24칸 접이식", brand: "오피스", sub: "물감/팔레트", price: 5600, unitCount: 6, unitLabel: "6개", minOrder: 1 },
  ],
  desk: [
    { name: "메탈 메쉬 연필꽂이", brand: "오피스", sub: "연필꽂이", price: 6400, unitCount: 6, unitLabel: "6개", minOrder: 1, badges: ["인기"] },
    { name: "다용도 데스크 정리 트레이 3단", brand: "오피스", sub: "트레이/정리함", price: 12800, unitCount: 4, unitLabel: "4개", minOrder: 1 },
    { name: "원목 독서대 접이식", brand: "오피스", sub: "독서대", price: 9900, unitCount: 1, unitLabel: "낱개", minOrder: 2, badges: ["신상"] },
    { name: "2026 탁상달력 스탠드형", brand: "양지사", sub: "탁상달력", price: 4200, unitCount: 1, unitLabel: "낱개", minOrder: 5 },
    { name: "아크릴 명함꽂이 2단", brand: "오피스", sub: "명함꽂이", price: 5400, unitCount: 6, unitLabel: "6개", minOrder: 1, discount: 0.1 },
    { name: "A4 서류함 4단 적재형", brand: "오피스", sub: "트레이/정리함", price: 18900, unitCount: 1, unitLabel: "낱개", minOrder: 2 },
  ],
  packing: [
    { name: "택배박스 2호 (200x140x80)", brand: "오피스", sub: "박스", price: 18000, unitCount: 50, unitLabel: "50매", minOrder: 1, badges: ["인기"] },
    { name: "택배박스 4호 (270x180x150)", brand: "오피스", sub: "박스", price: 24000, unitCount: 50, unitLabel: "50매", minOrder: 1 },
    { name: "안전 택배봉투 LDPE 25x35", brand: "오피스", sub: "택배봉투", price: 9900, unitCount: 100, unitLabel: "100매", minOrder: 1, discount: 0.12 },
    { name: "에어캡 뽁뽁이 50cm x 50m", brand: "오피스", sub: "뽁뽁이/완충재", price: 13500, unitCount: 1, unitLabel: "1롤", minOrder: 1, badges: ["인기"] },
    { name: "케이블타이 200mm 흑색", brand: "오피스", sub: "노끈/케이블타이", price: 4800, unitCount: 100, unitLabel: "100개입", minOrder: 2 },
    { name: "감사합니다 원형 스티커 500매", brand: "오피스", sub: "스티커/라벨", price: 6500, unitCount: 1, unitLabel: "500매", minOrder: 1, badges: ["신상"] },
    { name: "박스테이프 투명 48mm", brand: "오피스", sub: "박스", price: 11000, unitCount: 10, unitLabel: "10개입", minOrder: 1 },
  ],
};

function makeProducts(): Product[] {
  const list: Product[] = [];
  let counter = 1000;
  (Object.keys(SEEDS) as CategoryId[]).forEach((cat) => {
    SEEDS[cat].forEach((s, i) => {
      counter += 1;
      const code = `${cat.slice(0, 2).toUpperCase()}-${counter}`;
      const listPrice = s.price;
      const price = s.discount
        ? Math.round((s.price * (1 - s.discount)) / 10) * 10
        : s.price;
      const id = `${cat}-${i + 1}`;
      list.push({
        id,
        code,
        name: s.name,
        brand: s.brand,
        category: cat,
        sub: s.sub,
        image: placeholderImage(cat, s.name, s.brand),
        price,
        listPrice,
        unitCount: s.unitCount,
        unitLabel: s.unitLabel,
        minOrder: s.minOrder,
        rating: Math.round((4.2 + ((counter % 7) * 0.1)) * 10) / 10,
        reviewCount: 12 + ((counter * 7) % 480),
        soldOut: s.soldOut,
        badges: s.badges,
        description:
          `${s.brand} ${s.name} 도매 상품입니다. 판매 단위는 ${s.unitLabel}이며, ` +
          `대량 구매 시 가격 문의가 가능합니다. 사무실·학교·매장 납품에 적합한 ` +
          `스테디셀러 문구입니다.`,
      });
    });
  });
  return list;
}

/**
 * 초기 시드 상품. 앱 최초 실행 시 저장소(repository)에 채워진다.
 * 이후 모든 조회/수정은 product-repository를 통해 이뤄진다.
 * (직접 이 배열을 화면에서 쓰지 말 것 — 관리자 수정이 반영되지 않는다.)
 */
export const SEED_PRODUCTS: Product[] = makeProducts();

// ─── 순수 계산 헬퍼 (저장소와 무관, 어디서든 사용 가능) ───────────────

/** 개당 단가 (원). 묶음이면 price / unitCount */
export function unitPrice(p: Product): number {
  if (p.unitCount <= 1) return p.price;
  return Math.round(p.price / p.unitCount);
}

export function discountRate(p: Product): number {
  if (p.listPrice <= p.price) return 0;
  return Math.round(((p.listPrice - p.price) / p.listPrice) * 100);
}

export function formatWon(n: number): string {
  return n.toLocaleString("ko-KR") + "원";
}
