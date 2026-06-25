import type { CategoryId } from "./types";

// 기본 카테고리별 톤온톤 색상 (토스 블루 계열 + 보조색)
const CAT_COLORS: Record<string, { bg: string; fg: string }> = {
  writing: { bg: "#E8F3FF", fg: "#3182F6" },
  paper: { bg: "#EAF6EF", fg: "#15B86B" },
  office: { bg: "#FFF1E8", fg: "#FF8A3D" },
  art: { bg: "#F3ECFF", fg: "#8B5CF6" },
  desk: { bg: "#FFF0F3", fg: "#F04452" },
  packing: { bg: "#EEF1F5", fg: "#4E5968" },
};

const CAT_EMOJI: Record<string, string> = {
  writing: "✏️",
  paper: "📓",
  office: "📎",
  art: "🎨",
  desk: "🗂️",
  packing: "📦",
};

// 동적으로 추가된 카테고리용 기본값
const FALLBACK_COLOR = { bg: "#F2F4F6", fg: "#3182F6" };
const FALLBACK_EMOJI = "📦";

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * 상품용 SVG 플레이스홀더를 data-URI로 생성.
 * 외부 네트워크 없이 항상 렌더되며, 실제 상품 사진으로 교체할 자리.
 */
export function placeholderImage(
  category: CategoryId,
  name: string,
  brand: string
): string {
  const { bg, fg } = CAT_COLORS[category] ?? FALLBACK_COLOR;
  const emoji = CAT_EMOJI[category] ?? FALLBACK_EMOJI;
  // 상품명을 2줄까지 노출
  const safeName = escapeXml(name.length > 22 ? name.slice(0, 22) + "…" : name);
  const safeBrand = escapeXml(brand);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
  <rect width="600" height="600" fill="${bg}"/>
  <text x="300" y="250" font-size="140" text-anchor="middle" dominant-baseline="central">${emoji}</text>
  <text x="300" y="380" font-size="30" font-weight="700" fill="${fg}" text-anchor="middle" font-family="Pretendard, sans-serif">${safeBrand}</text>
  <text x="300" y="430" font-size="26" fill="#4E5968" text-anchor="middle" font-family="Pretendard, sans-serif">${safeName}</text>
</svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
