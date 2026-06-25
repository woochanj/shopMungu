"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { categoryById } from "@/lib/categories";
import { formatWon } from "@/lib/products";
import { productRepo } from "@/lib/product-repository";
import {
  type ParseResult,
  downloadTemplate,
  exportProductsExcel,
  parseProductsExcel,
} from "@/lib/excel";

export default function ImportPage() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("");
  const [result, setResult] = useState<ParseResult | null>(null);
  const [parsing, setParsing] = useState(false);
  const [done, setDone] = useState<{ created: number; updated: number } | null>(
    null
  );

  async function handleFile(file: File) {
    setParsing(true);
    setDone(null);
    setFileName(file.name);
    try {
      const res = await parseProductsExcel(file);
      setResult(res);
    } catch {
      setResult({
        rows: [],
        errors: [{ row: 0, message: "엑셀 파일을 읽을 수 없습니다." }],
      });
    }
    setParsing(false);
  }

  async function handleImport() {
    if (!result || result.rows.length === 0) return;
    const res = await productRepo.bulkUpsert(result.rows);
    setDone(res);
    setResult(null);
    setFileName("");
    if (fileRef.current) fileRef.current.value = "";
  }

  async function handleExportAll() {
    const all = await productRepo.list();
    exportProductsExcel(all, "문구도매센터_상품목록.xlsx");
  }

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-extrabold text-ink-900">엑셀 대량등록</h1>
      <p className="mt-1 text-sm text-ink-400">
        엑셀(.xlsx) 파일로 상품을 한 번에 등록·수정합니다. 같은 상품코드는 덮어쓰기됩니다.
      </p>

      {/* step guide */}
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <Guide n="1" title="양식 받기" desc="등록 양식을 내려받아 작성하세요." />
        <Guide n="2" title="파일 올리기" desc="작성한 엑셀을 업로드합니다." />
        <Guide n="3" title="확인 후 등록" desc="미리보기를 확인하고 등록합니다." />
      </div>

      {/* actions */}
      <div className="mt-6 flex flex-wrap gap-2">
        <button
          onClick={() => downloadTemplate()}
          className="rounded-lg border border-line bg-white px-4 py-2.5 text-sm font-semibold text-ink-700 hover:border-toss-blue hover:text-toss-blue"
        >
          📄 등록 양식 다운로드
        </button>
        <button
          onClick={handleExportAll}
          className="rounded-lg border border-line bg-white px-4 py-2.5 text-sm font-semibold text-ink-700 hover:border-toss-blue hover:text-toss-blue"
        >
          ⬇ 전체 상품 내보내기
        </button>
      </div>

      {/* dropzone */}
      <label
        className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-card border-2 border-dashed border-line bg-white py-12 text-center transition-colors hover:border-toss-blue"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const f = e.dataTransfer.files?.[0];
          if (f) handleFile(f);
        }}
      >
        <input
          ref={fileRef}
          type="file"
          accept=".xlsx,.xls"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
        />
        <span className="text-3xl">📤</span>
        <span className="mt-2 text-sm font-semibold text-ink-700">
          엑셀 파일을 끌어다 놓거나 클릭해서 선택
        </span>
        <span className="mt-1 text-xs text-ink-300">
          {fileName || ".xlsx / .xls 지원"}
        </span>
      </label>

      {parsing && (
        <p className="mt-4 text-sm text-ink-400">파일을 분석하는 중…</p>
      )}

      {/* success */}
      {done && (
        <div className="mt-4 card-seamless bg-toss-blueLight p-5">
          <p className="text-sm font-bold text-toss-blue">
            등록 완료! 신규 {done.created}건, 수정 {done.updated}건
          </p>
          <Link
            href="/admin/products"
            className="mt-2 inline-block text-sm font-semibold text-toss-blue underline"
          >
            상품 목록에서 확인하기 →
          </Link>
        </div>
      )}

      {/* parse result */}
      {result && (
        <div className="mt-6">
          {result.errors.length > 0 && (
            <div className="mb-4 rounded-card border border-alert/30 bg-[#FEECEC] p-4">
              <p className="text-sm font-bold text-alert">
                건너뛴 행 {result.errors.length}건
              </p>
              <ul className="mt-2 space-y-1 text-xs text-alert">
                {result.errors.slice(0, 10).map((e, i) => (
                  <li key={i}>
                    {e.row > 0 ? `${e.row}행: ` : ""}
                    {e.message}
                  </li>
                ))}
                {result.errors.length > 10 && (
                  <li>…외 {result.errors.length - 10}건</li>
                )}
              </ul>
            </div>
          )}

          <div className="flex items-center justify-between">
            <p className="text-sm text-ink-500">
              등록 가능한 상품{" "}
              <span className="font-bold text-ink-900">
                {result.rows.length}
              </span>
              건 미리보기
            </p>
            <button
              onClick={handleImport}
              disabled={result.rows.length === 0}
              className="rounded-lg bg-toss-blue px-5 py-2.5 text-sm font-bold text-white hover:bg-toss-blueDark disabled:bg-ink-300"
            >
              {result.rows.length}건 등록하기
            </button>
          </div>

          <div className="mt-3 overflow-x-auto card-seamless bg-white">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-line text-left text-xs text-ink-400">
                  <th className="px-4 py-2.5 font-medium">상품명</th>
                  <th className="px-4 py-2.5 font-medium">브랜드</th>
                  <th className="px-4 py-2.5 font-medium">카테고리</th>
                  <th className="px-4 py-2.5 text-right font-medium">판매가</th>
                  <th className="px-4 py-2.5 font-medium">단위</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {result.rows.slice(0, 50).map((r, i) => (
                  <tr key={i}>
                    <td className="px-4 py-2.5 font-medium text-ink-900">
                      {r.name}
                    </td>
                    <td className="px-4 py-2.5 text-ink-500">{r.brand}</td>
                    <td className="px-4 py-2.5 text-ink-500">
                      {categoryById(r.category)?.name}
                    </td>
                    <td className="tnum px-4 py-2.5 text-right font-semibold text-ink-900">
                      {formatWon(r.price)}
                    </td>
                    <td className="px-4 py-2.5 text-ink-500">{r.unitLabel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {result.rows.length > 50 && (
              <p className="border-t border-line px-4 py-2.5 text-xs text-ink-300">
                미리보기는 50건까지만 표시됩니다. 전체 {result.rows.length}건이
                등록됩니다.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Guide({ n, title, desc }: { n: string; title: string; desc: string }) {
  return (
    <div className="card-seamless bg-white p-4">
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-toss-blueLight text-sm font-bold text-toss-blue">
        {n}
      </span>
      <p className="mt-2 text-sm font-bold text-ink-900">{title}</p>
      <p className="mt-0.5 text-xs text-ink-400">{desc}</p>
    </div>
  );
}
