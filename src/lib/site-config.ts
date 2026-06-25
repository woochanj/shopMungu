/**
 * 홈 화면 구성 저장소 (site-config).
 *
 * 관리자가 홈 배너와 섹션 순서/노출을 편집하면 여기에 저장되고,
 * 홈 페이지는 이 설정대로 렌더한다. (L1~L2 수준의 화면 오서링)
 *
 * 미래 확장(L3 블록 빌더): sections 배열에 임의 타입의 블록을 추가하고
 * 각 블록의 props를 저장하는 식으로 자연스럽게 넓힐 수 있다.
 */

export type SectionType = "categories" | "popular" | "newArrivals";

export interface HomeSection {
  type: SectionType;
  title: string;
  subtitle: string;
  visible: boolean;
}

export interface HomeBanner {
  eyebrow: string;
  title: string; // 줄바꿈은 \n
  subtitle: string;
  buttonLabel: string;
  buttonHref: string;
  visible: boolean;
  /** 슬라이드 배경 그라데이션 (from, to) */
  color?: { from: string; to: string };
}

export interface SiteConfig {
  /** 메인 배너 슬라이더 (1장 이상이면 자동 슬라이드) */
  banners: HomeBanner[];
  sections: HomeSection[];
}

export const DEFAULT_CONFIG: SiteConfig = {
  banners: [
    {
      eyebrow: "문구 도매 · 대량구매 전문",
      title: "필요한 문구, 전부\n도매가로 한 번에.",
      subtitle: "사무실·학교·매장 납품을 더 합리적으로.",
      buttonLabel: "전체 상품 보기 →",
      buttonHref: "/category/writing",
      visible: true,
      color: { from: "#3182F6", to: "#1B64DA" },
    },
    {
      eyebrow: "이번 주 특가",
      title: "복사용지·노트\n최대 20% 할인",
      subtitle: "대량 구매처를 위한 한정 특가전.",
      buttonLabel: "특가 보러가기 →",
      buttonHref: "/category/paper",
      visible: true,
      color: { from: "#0EA5A5", to: "#0E7C7B" },
    },
    {
      eyebrow: "신규 입점 브랜드",
      title: "미술재료 신상\n지금 입고됐어요",
      subtitle: "프리즈마·화홍·신한까지 한 곳에서.",
      buttonLabel: "미술재료 보기 →",
      buttonHref: "/category/art",
      visible: true,
      color: { from: "#7C5CFC", to: "#5B3FD9" },
    },
  ],
  sections: [
    { type: "categories", title: "카테고리", subtitle: "원하는 분류로 바로가기", visible: true },
    { type: "popular", title: "🔥 인기 상품", subtitle: "지금 가장 많이 찾는 도매 문구", visible: true },
    { type: "newArrivals", title: "🆕 신상품", subtitle: "새로 입고된 문구를 먼저 만나보세요", visible: true },
  ],
};

const STORAGE_KEY = "mungu-siteconfig-v1";
export const SITE_CONFIG_EVENT = "mungu-siteconfig-changed";

function isBrowser() {
  return typeof window !== "undefined";
}

export interface SiteConfigRepository {
  get(): Promise<SiteConfig>;
  save(config: SiteConfig): Promise<void>;
  reset(): Promise<void>;
}

class LocalStorageSiteConfigRepository implements SiteConfigRepository {
  private cache: SiteConfig | null = null;

  private load(): SiteConfig {
    if (this.cache) return this.cache;
    if (!isBrowser()) return DEFAULT_CONFIG;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      this.cache = raw ? (JSON.parse(raw) as SiteConfig) : { ...DEFAULT_CONFIG };
    } catch {
      this.cache = { ...DEFAULT_CONFIG };
    }
    return this.cache;
  }

  private persist() {
    if (!isBrowser() || !this.cache) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.cache));
    window.dispatchEvent(new Event(SITE_CONFIG_EVENT));
  }

  async get(): Promise<SiteConfig> {
    return structuredClone(this.load());
  }

  async save(config: SiteConfig): Promise<void> {
    this.cache = structuredClone(config);
    this.persist();
  }

  async reset(): Promise<void> {
    this.cache = structuredClone(DEFAULT_CONFIG);
    this.persist();
  }
}

export const siteConfigRepo: SiteConfigRepository =
  new LocalStorageSiteConfigRepository();
