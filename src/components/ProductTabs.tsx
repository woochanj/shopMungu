"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/lib/types";
import {
  formatDate,
  qnaRepo,
  reviewRepo,
} from "@/lib/review-repository";
import { useQuestions, useReviews } from "@/lib/use-reviews";
import { formatWon, unitPrice } from "@/lib/products";

type Tab = "detail" | "review" | "qna";

export default function ProductTabs({ product }: { product: Product }) {
  const reviews = useReviews(product.id);
  const questions = useQuestions(product.id);
  const [tab, setTab] = useState<Tab>("detail");

  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: "detail", label: "상세정보" },
    { key: "review", label: "리뷰", count: reviews.length },
    { key: "qna", label: "Q&A", count: questions.length },
  ];

  return (
    <div className="mt-16">
      {/* tab headers — 스크롤 시 헤더 아래 고정 (스마트스토어 방식) */}
      <div className="sticky top-[150px] z-30 flex border-b border-line bg-white/95 backdrop-blur">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`relative -mb-px px-5 py-3 text-sm font-bold transition-all duration-200 ${
              tab === t.key
                ? "text-toss-blue"
                : "text-ink-400 hover:text-ink-700"
            }`}
          >
            {t.label}
            {typeof t.count === "number" && (
              <span className="tnum ml-1 text-xs text-ink-300">{t.count}</span>
            )}
            {/* 밑줄 인디케이터 (부드럽게) */}
            <span
              className={`absolute inset-x-0 -bottom-px h-0.5 origin-center bg-toss-blue transition-transform duration-300 ${
                tab === t.key ? "scale-x-100" : "scale-x-0"
              }`}
            />
          </button>
        ))}
      </div>

      {/* 탭 전환마다 key 변경 → 페이드인 재생 */}
      <div key={tab} className="fade-in-up pt-8">
        {tab === "detail" && <DetailTab product={product} />}
        {tab === "review" && <ReviewTab product={product} />}
        {tab === "qna" && <QnaTab product={product} />}
      </div>
    </div>
  );
}

// ─── 상세정보 ───────────────────────────────────────────
function DetailTab({ product }: { product: Product }) {
  const rows: [string, string][] = [
    ["상품코드", product.code],
    ["브랜드", product.brand],
    ["판매 단위", product.unitLabel],
    ["최소 주문 수량", `${product.minOrder}개`],
  ];
  if (product.unitCount > 1) {
    rows.push(["개당 단가", `${unitPrice(product).toLocaleString("ko-KR")}원`]);
  }
  rows.push(["판매가", formatWon(product.price)]);

  return (
    <div className="max-w-3xl">
      {product.description && (
        <p className="mb-6 text-sm leading-relaxed text-ink-600">
          {product.description}
        </p>
      )}

      {/* 상세 이미지 (관리자가 등록한 URL들) */}
      {product.detailImages && product.detailImages.length > 0 && (
        <div className="mb-8 space-y-3">
          {product.detailImages.map((src, i) => (
            // 외부 임의 URL이므로 next/image 대신 일반 img 사용
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={src}
              alt={`${product.name} 상세 이미지 ${i + 1}`}
              loading="lazy"
              className="w-full rounded-2xl"
            />
          ))}
        </div>
      )}

      <table className="w-full overflow-hidden rounded-2xl text-sm">
        <tbody>
          {rows.map(([label, value], i) => (
            <tr key={label} className={i % 2 === 0 ? "bg-surface" : ""}>
              <th className="w-36 px-4 py-3 text-left font-medium text-ink-400">
                {label}
              </th>
              <td className="tnum px-4 py-3 font-medium text-ink-900">
                {value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-6 text-xs leading-relaxed text-ink-300">
        ※ 대량 구매 시 별도 견적이 가능합니다. 상품 이미지와 실제 상품은 일부
        차이가 있을 수 있습니다.
      </p>
    </div>
  );
}

// ─── 리뷰 ───────────────────────────────────────────
function ReviewTab({ product }: { product: Product }) {
  const reviews = useReviews(product.id);
  const [author, setAuthor] = useState("");
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  const avg = useMemo(() => {
    if (reviews.length === 0) return 0;
    return reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  }, [reviews]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!content.trim()) {
      setError("리뷰 내용을 입력해 주세요.");
      return;
    }
    reviewRepo.add({
      productId: product.id,
      author: author.trim() || "익명",
      rating,
      content: content.trim(),
    });
    setContent("");
    setAuthor("");
    setRating(5);
  }

  return (
    <div className="max-w-3xl">
      {/* summary */}
      <div className="mb-8 flex items-center gap-4 rounded-2xl bg-surface p-6">
        <div className="text-center">
          <p className="tnum text-4xl font-extrabold text-ink-900">
            {avg.toFixed(1)}
          </p>
          <p className="mt-1 text-sm text-toss-blue">{"★".repeat(Math.round(avg))}</p>
        </div>
        <div className="text-sm text-ink-400">
          <p className="tnum font-bold text-ink-900">
            리뷰 {reviews.length}개
          </p>
          <p className="mt-1">구매하신 분들의 솔직한 후기예요.</p>
        </div>
      </div>

      {/* write form */}
      <form onSubmit={submit} className="mb-8 rounded-2xl bg-surface p-5">
        <p className="mb-3 text-sm font-bold text-ink-900">리뷰 작성</p>
        <div className="mb-2 flex items-center gap-3">
          <input
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="작성자 (선택)"
            className="w-40 rounded-lg border border-line bg-white px-3 py-2 text-sm outline-none focus:border-toss-blue"
          />
          <StarPicker value={rating} onChange={setRating} />
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="상품에 대한 후기를 남겨주세요."
          className="h-20 w-full resize-none rounded-lg border border-line bg-white px-3 py-2 text-sm outline-none focus:border-toss-blue"
        />
        {error && <p className="mt-2 text-sm text-alert">{error}</p>}
        <div className="mt-3 text-right">
          <button
            type="submit"
            className="rounded-lg bg-toss-blue px-5 py-2.5 text-sm font-bold text-white hover:bg-toss-blueDark"
          >
            등록
          </button>
        </div>
      </form>

      {/* list */}
      {reviews.length === 0 ? (
        <p className="py-10 text-center text-sm text-ink-300">
          아직 리뷰가 없어요. 첫 리뷰를 남겨보세요.
        </p>
      ) : (
        <ul className="divide-y divide-line">
          {reviews.map((r) => (
            <li key={r.id} className="py-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-ink-700">
                  {r.author}
                </span>
                <span className="tnum text-xs text-ink-300">
                  {formatDate(r.createdAt)}
                </span>
              </div>
              <p className="mt-0.5 text-sm text-toss-blue">
                {"★".repeat(r.rating)}
                <span className="text-line">{"★".repeat(5 - r.rating)}</span>
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                {r.content}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function StarPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          aria-label={`${n}점`}
          className={`text-lg ${n <= value ? "text-toss-blue" : "text-line"}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

// ─── Q&A ───────────────────────────────────────────
function QnaTab({ product }: { product: Product }) {
  const questions = useQuestions(product.id);
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!content.trim()) {
      setError("문의 내용을 입력해 주세요.");
      return;
    }
    qnaRepo.add({
      productId: product.id,
      author: author.trim() || "익명",
      content: content.trim(),
    });
    setContent("");
    setAuthor("");
  }

  return (
    <div className="max-w-3xl">
      <form onSubmit={submit} className="mb-8 rounded-2xl bg-surface p-5">
        <p className="mb-3 text-sm font-bold text-ink-900">상품 문의</p>
        <input
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="작성자 (선택)"
          className="mb-2 w-40 rounded-lg border border-line bg-white px-3 py-2 text-sm outline-none focus:border-toss-blue"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="배송, 수량, 세금계산서 등 궁금한 점을 물어보세요."
          className="h-20 w-full resize-none rounded-lg border border-line bg-white px-3 py-2 text-sm outline-none focus:border-toss-blue"
        />
        {error && <p className="mt-2 text-sm text-alert">{error}</p>}
        <div className="mt-3 text-right">
          <button
            type="submit"
            className="rounded-lg bg-toss-blue px-5 py-2.5 text-sm font-bold text-white hover:bg-toss-blueDark"
          >
            문의 등록
          </button>
        </div>
      </form>

      {questions.length === 0 ? (
        <p className="py-10 text-center text-sm text-ink-300">
          아직 등록된 문의가 없어요.
        </p>
      ) : (
        <ul className="divide-y divide-line">
          {questions.map((q) => (
            <li key={q.id} className="py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded px-2 py-0.5 text-xs font-bold ${
                      q.answer
                        ? "bg-toss-blueLight text-toss-blue"
                        : "bg-surface text-ink-400"
                    }`}
                  >
                    {q.answer ? "답변완료" : "답변대기"}
                  </span>
                  <span className="text-sm font-semibold text-ink-700">
                    {q.author}
                  </span>
                </div>
                <span className="tnum text-xs text-ink-300">
                  {formatDate(q.createdAt)}
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-ink-700">
                Q. {q.content}
              </p>
              {q.answer && (
                <p className="mt-2 rounded-lg bg-surface px-3 py-2.5 text-sm leading-relaxed text-ink-600">
                  <span className="font-bold text-toss-blue">A.</span> {q.answer}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
