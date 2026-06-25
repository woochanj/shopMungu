"use client";

import { useEffect, useState } from "react";
import type { Category } from "@/lib/types";
import { categoryRepo } from "@/lib/category-repository";
import { productRepo } from "@/lib/product-repository";
import { useCategories } from "@/lib/use-categories";

export default function AdminCategoriesPage() {
  const categories = useCategories();
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [editing, setEditing] = useState<Category | null>(null);
  const [creating, setCreating] = useState(false);

  // 카테고리별 상품 수 (삭제 경고용)
  useEffect(() => {
    productRepo.list().then((all) => {
      const c: Record<string, number> = {};
      all.forEach((p) => {
        c[p.category] = (c[p.category] ?? 0) + 1;
      });
      setCounts(c);
    });
  }, [categories]);

  async function handleDelete(cat: Category) {
    const n = counts[cat.id] ?? 0;
    const msg =
      n > 0
        ? `'${cat.name}'에 상품 ${n}개가 있습니다. 카테고리를 삭제해도 상품은 남지만 분류에서 사라집니다. 삭제할까요?`
        : `'${cat.name}' 카테고리를 삭제할까요?`;
    if (!confirm(msg)) return;
    await categoryRepo.remove(cat.id);
  }

  async function handleReset() {
    if (!confirm("카테고리를 초기 6종으로 되돌립니다. 계속할까요?")) return;
    await categoryRepo.reset();
  }

  return (
    <div className="max-w-4xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-ink-900">카테고리 관리</h1>
          <p className="mt-1 text-sm text-ink-400">
            카테고리와 소분류를 추가·수정·삭제합니다. 변경은 즉시 쇼핑몰에
            반영됩니다.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleReset}
            className="rounded-lg border border-line px-4 py-2.5 text-sm font-semibold text-ink-400 hover:text-alert"
          >
            초기화
          </button>
          <button
            onClick={() => {
              setCreating(true);
              setEditing(null);
            }}
            className="rounded-lg bg-toss-blue px-4 py-2.5 text-sm font-bold text-white hover:bg-toss-blueDark"
          >
            + 카테고리 추가
          </button>
        </div>
      </div>

      {(creating || editing) && (
        <CategoryEditor
          category={editing ?? undefined}
          onClose={() => {
            setCreating(false);
            setEditing(null);
          }}
        />
      )}

      <div className="mt-5 space-y-2">
        {categories.map((c) => (
          <div
            key={c.id}
            className="flex items-start justify-between gap-4 card-seamless bg-white p-4"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xl">{c.emoji}</span>
                <span className="font-bold text-ink-900">{c.name}</span>
                <span className="tnum rounded bg-surface px-2 py-0.5 text-xs text-ink-400">
                  상품 {counts[c.id] ?? 0}개
                </span>
                <span className="text-xs text-ink-300">/{c.id}</span>
              </div>
              {c.subs.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {c.subs.map((s) => (
                    <span
                      key={s}
                      className="rounded-md bg-surface px-2 py-1 text-xs text-ink-500"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="flex shrink-0 gap-1">
              <button
                onClick={() => {
                  setEditing(c);
                  setCreating(false);
                }}
                className="rounded-md px-2.5 py-1.5 text-xs font-semibold text-ink-500 hover:text-toss-blue"
              >
                수정
              </button>
              <button
                onClick={() => handleDelete(c)}
                className="rounded-md px-2.5 py-1.5 text-xs font-semibold text-ink-400 hover:text-alert"
              >
                삭제
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CategoryEditor({
  category,
  onClose,
}: {
  category?: Category;
  onClose: () => void;
}) {
  const editing = !!category;
  const [name, setName] = useState(category?.name ?? "");
  const [emoji, setEmoji] = useState(category?.emoji ?? "📦");
  const [subs, setSubs] = useState(category?.subs.join(", ") ?? "");
  const [error, setError] = useState("");

  async function handleSave() {
    setError("");
    if (!name.trim()) {
      setError("카테고리 이름을 입력하세요.");
      return;
    }
    const subList = subs
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    try {
      if (editing && category) {
        await categoryRepo.update(category.id, {
          name: name.trim(),
          emoji: emoji.trim() || "📦",
          subs: subList,
        });
      } else {
        await categoryRepo.create({
          name: name.trim(),
          emoji: emoji.trim() || "📦",
          subs: subList,
        });
      }
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "저장 실패");
    }
  }

  return (
    <div className="mt-4 rounded-card border-2 border-toss-blue bg-white p-5">
      <h2 className="mb-4 text-base font-bold text-ink-900">
        {editing ? "카테고리 수정" : "새 카테고리"}
      </h2>
      {error && (
        <p className="mb-3 rounded-lg bg-[#FEECEC] px-3 py-2 text-sm text-alert">
          {error}
        </p>
      )}
      <div className="grid gap-3 sm:grid-cols-[80px_1fr]">
        <label className="flex flex-col gap-1">
          <span className="text-xs font-medium text-ink-500">아이콘</span>
          <input
            value={emoji}
            onChange={(e) => setEmoji(e.target.value)}
            className="rounded-lg border border-line px-3 py-2.5 text-center text-lg outline-none focus:border-toss-blue"
            maxLength={4}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs font-medium text-ink-500">카테고리 이름</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="예) 전자/디지털"
            className="rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-toss-blue"
          />
        </label>
      </div>
      <label className="mt-3 flex flex-col gap-1">
        <span className="text-xs font-medium text-ink-500">
          소분류 (쉼표로 구분)
        </span>
        <input
          value={subs}
          onChange={(e) => setSubs(e.target.value)}
          placeholder="예) 계산기, USB, 건전지"
          className="rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-toss-blue"
        />
      </label>
      <div className="mt-4 flex gap-2">
        <button
          onClick={handleSave}
          className="rounded-lg bg-toss-blue px-5 py-2.5 text-sm font-bold text-white hover:bg-toss-blueDark"
        >
          {editing ? "수정 저장" : "추가"}
        </button>
        <button
          onClick={onClose}
          className="rounded-lg border border-line px-5 py-2.5 text-sm font-semibold text-ink-500 hover:bg-surface"
        >
          취소
        </button>
      </div>
    </div>
  );
}
