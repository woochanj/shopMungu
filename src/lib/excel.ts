import * as XLSX from "xlsx";
import type { CategoryId, Product } from "./types";
import type { Quote } from "./quote";
import { CATEGORIES } from "./categories";
import { placeholderImage } from "./placeholder";

/**
 * 엑셀 ↔ 상품 변환 유틸.
 * 관리자 대량등록(.xlsx 업로드)과 내보내기, 양식 템플릿 다운로드를 담당한다.
 */

// 한글 컬럼 헤더 ↔ Product 필드
const COLUMNS = [
  { header: "상품코드", key: "code" },
  { header: "상품명", key: "name" },
  { header: "브랜드", key: "brand" },
  { header: "카테고리", key: "category" },
  { header: "소분류", key: "sub" },
  { header: "판매가", key: "price" },
  { header: "정가", key: "listPrice" },
  { header: "묶음입수", key: "unitCount" },
  { header: "판매단위", key: "unitLabel" },
  { header: "최소주문", key: "minOrder" },
  { header: "뱃지", key: "badges" },
  { header: "품절", key: "soldOut" },
  { header: "상세설명", key: "description" },
] as const;

const CAT_NAME_TO_ID = new Map<string, CategoryId>(
  CATEGORIES.map((c) => [c.name, c.id])
);
const CAT_ID_TO_NAME = new Map<CategoryId, string>(
  CATEGORIES.map((c) => [c.id, c.name])
);

export interface ParseResult {
  rows: Omit<Product, "id">[];
  errors: { row: number; message: string }[];
}

/** 업로드된 엑셀 파일을 파싱해 상품 행 + 오류 목록을 반환 */
export async function parseProductsExcel(file: File): Promise<ParseResult> {
  const buf = await file.arrayBuffer();
  const wb = XLSX.read(buf, { type: "array" });
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const json = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
    defval: "",
  });

  const rows: Omit<Product, "id">[] = [];
  const errors: { row: number; message: string }[] = [];

  json.forEach((raw, i) => {
    const rowNum = i + 2; // 엑셀 1행은 헤더
    const get = (header: string) => String(raw[header] ?? "").trim();

    const name = get("상품명");
    const brand = get("브랜드");
    if (!name && !brand) return; // 빈 줄 스킵

    const catName = get("카테고리");
    const category = CAT_NAME_TO_ID.get(catName);
    if (!category) {
      errors.push({
        row: rowNum,
        message: `카테고리 '${catName}'를 찾을 수 없음 (사용 가능: ${CATEGORIES.map((c) => c.name).join(", ")})`,
      });
      return;
    }
    if (!name) {
      errors.push({ row: rowNum, message: "상품명이 비어 있음" });
      return;
    }
    const price = Number(get("판매가").replace(/[^\d.]/g, ""));
    if (!price || price <= 0) {
      errors.push({ row: rowNum, message: "판매가가 올바르지 않음" });
      return;
    }

    const listPrice =
      Number(get("정가").replace(/[^\d.]/g, "")) || price;
    const unitCount = Math.max(1, Number(get("묶음입수")) || 1);
    const minOrder = Math.max(1, Number(get("최소주문")) || 1);
    const badges = get("뱃지")
      .split(/[,/]/)
      .map((b) => b.trim())
      .filter(Boolean);
    const soldOutRaw = get("품절");
    const soldOut = /^(y|yes|true|o|품절|1)$/i.test(soldOutRaw);

    rows.push({
      code: get("상품코드") || `${category.slice(0, 2).toUpperCase()}-${Date.now()}${i}`,
      name,
      brand: brand || "노브랜드",
      category,
      sub: get("소분류"),
      image: placeholderImage(category, name, brand || ""),
      price,
      listPrice,
      unitCount,
      unitLabel: get("판매단위") || (unitCount > 1 ? `${unitCount}개입` : "낱개"),
      minOrder,
      rating: 4.5,
      reviewCount: 0,
      soldOut: soldOut || undefined,
      badges: badges.length ? badges : undefined,
      description: get("상세설명") || undefined,
    });
  });

  return { rows, errors };
}

/** 상품 배열을 엑셀로 변환해 다운로드 */
export function exportProductsExcel(products: Product[], filename = "상품목록.xlsx") {
  const data = products.map((p) => ({
    상품코드: p.code,
    상품명: p.name,
    브랜드: p.brand,
    카테고리: CAT_ID_TO_NAME.get(p.category) ?? p.category,
    소분류: p.sub,
    판매가: p.price,
    정가: p.listPrice,
    묶음입수: p.unitCount,
    판매단위: p.unitLabel,
    최소주문: p.minOrder,
    뱃지: p.badges?.join(", ") ?? "",
    품절: p.soldOut ? "Y" : "",
    상세설명: p.description ?? "",
  }));
  writeSheet(data, "상품목록", filename);
}

/** 빈 양식 + 예시 1행이 든 템플릿 다운로드 */
export function downloadTemplate(filename = "상품등록_양식.xlsx") {
  const example = {
    상품코드: "WR-1001",
    상품명: "모나미 153 볼펜 흑색",
    브랜드: "모나미",
    카테고리: CATEGORIES[0].name,
    소분류: "볼펜",
    판매가: 3600,
    정가: 3600,
    묶음입수: 12,
    판매단위: "12자루",
    최소주문: 1,
    뱃지: "인기",
    품절: "",
    상세설명: "대량구매 가능",
  };
  writeSheet([example], "상품등록양식", filename);
}

/** 견적서를 엑셀로 다운로드 (헤더 정보 + 품목 표 + 합계) */
export function exportQuoteExcel(
  quote: Quote,
  meta: {
    quoteNo: string;
    date: string;
    customer: string;
    supplier: { company: string; ceo: string; bizNo: string };
  },
  filename = "견적서.xlsx"
) {
  const aoa: (string | number)[][] = [];
  aoa.push(["견 적 서"]);
  aoa.push([]);
  aoa.push(["견적번호", meta.quoteNo, "", "공급자", meta.supplier.company]);
  aoa.push(["견적일자", meta.date, "", "대표자", meta.supplier.ceo]);
  aoa.push(["수신", meta.customer, "", "사업자번호", meta.supplier.bizNo]);
  aoa.push([]);
  aoa.push(["No", "품목코드", "품명", "규격", "수량", "단가", "공급가액", "세액", "합계"]);
  quote.lines.forEach((l) => {
    aoa.push([
      l.no,
      l.code,
      l.name,
      l.spec,
      l.quantity,
      l.unitPrice,
      l.supplyAmount,
      l.taxAmount,
      l.amount,
    ]);
  });
  aoa.push([]);
  aoa.push(["", "", "", "", "합계", "", quote.supplyTotal, quote.taxTotal, quote.grandTotal]);

  const ws = XLSX.utils.aoa_to_sheet(aoa);
  ws["!cols"] = [
    { wch: 5 },
    { wch: 12 },
    { wch: 26 },
    { wch: 12 },
    { wch: 8 },
    { wch: 12 },
    { wch: 12 },
    { wch: 10 },
    { wch: 13 },
  ];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "견적서");
  XLSX.writeFile(wb, filename);
}

function writeSheet(
  data: Record<string, unknown>[],
  sheetName: string,
  filename: string
) {
  const ws = XLSX.utils.json_to_sheet(data, {
    header: COLUMNS.map((c) => c.header),
  });
  // 컬럼 너비 보기 좋게
  ws["!cols"] = COLUMNS.map((c) => ({
    wch: c.header === "상품명" || c.header === "상세설명" ? 24 : 12,
  }));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, filename);
}
