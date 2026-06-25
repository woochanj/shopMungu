"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { CategoryId, Product } from "@/lib/types";
import { CATEGORIES, categoryById } from "@/lib/categories";
import { productRepo } from "@/lib/product-repository";
import { placeholderImage } from "@/lib/placeholder";

type FormState = {
  code: string;
  name: string;
  brand: string;
  category: CategoryId;
  sub: string;
  price: string;
  listPrice: string;
  unitCount: string;
  unitLabel: string;
  minOrder: string;
  image: string;
  badges: string;
  soldOut: boolean;
  description: string;
};

function toForm(p?: Product): FormState {
  return {
    code: p?.code ?? "",
    name: p?.name ?? "",
    brand: p?.brand ?? "",
    category: p?.category ?? "writing",
    sub: p?.sub ?? "",
    price: p ? String(p.price) : "",
    listPrice: p ? String(p.listPrice) : "",
    unitCount: p ? String(p.unitCount) : "1",
    unitLabel: p?.unitLabel ?? "낱개",
    minOrder: p ? String(p.minOrder) : "1",
    image: p?.image ?? "",
    badges: p?.badges?.join(", ") ?? "",
    soldOut: p?.soldOut ?? false,
    description: p?.description ?? "",
  };
}

export default function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const editing = !!product;
  const [f, setF] = useState<FormState>(toForm(product));
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const category = categoryById(f.category);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setF((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!f.name.trim() || !f.brand.trim()) {
      setError("상품명과 브랜드는 필수입니다.");
      return;
    }
    const price = Number(f.price);
    if (!price || price <= 0) {
      setError("판매가를 올바르게 입력하세요.");
      return;
    }
    const listPrice = Number(f.listPrice) || price;
    const unitCount = Math.max(1, Number(f.unitCount) || 1);
    const minOrder = Math.max(1, Number(f.minOrder) || 1);

    const badges = f.badges
      .split(",")
      .map((b) => b.trim())
      .filter(Boolean);

    const image =
      f.image.trim() ||
      placeholderImage(f.category, f.name.trim(), f.brand.trim());

    const data: Omit<Product, "id"> = {
      code: f.code.trim() || autoCode(f.category),
      name: f.name.trim(),
      brand: f.brand.trim(),
      category: f.category,
      sub: f.sub.trim() || (category?.subs[0] ?? ""),
      image,
      price,
      listPrice,
      unitCount,
      unitLabel: f.unitLabel.trim() || (unitCount > 1 ? `${unitCount}개입` : "낱개"),
      minOrder,
      rating: product?.rating ?? 4.5,
      reviewCount: product?.reviewCount ?? 0,
      soldOut: f.soldOut,
      badges: badges.length ? badges : undefined,
      description: f.description.trim() || undefined,
    };

    setSaving(true);
    try {
      if (editing && product) {
        await productRepo.update(product.id, data);
      } else {
        await productRepo.create(data);
      }
      router.push("/admin/products");
    } catch (err) {
      setError(err instanceof Error ? err.message : "저장에 실패했습니다.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl">
      {error && (
        <p className="mb-4 rounded-lg bg-[#FEECEC] px-4 py-3 text-sm text-alert">
          {error}
        </p>
      )}

      <Section title="기본 정보">
        <Grid>
          <Field label="상품명" required>
            <input className={inp} value={f.name} onChange={(e) => set("name", e.target.value)} placeholder="예) 모나미 153 볼펜 흑색" />
          </Field>
          <Field label="브랜드" required>
            <input className={inp} value={f.brand} onChange={(e) => set("brand", e.target.value)} placeholder="예) 모나미" />
          </Field>
          <Field label="상품코드">
            <input className={inp} value={f.code} onChange={(e) => set("code", e.target.value)} placeholder="비우면 자동 생성" />
          </Field>
          <Field label="카테고리" required>
            <select className={inp} value={f.category} onChange={(e) => { set("category", e.target.value as CategoryId); set("sub", ""); }}>
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </Field>
          <Field label="소분류">
            <select className={inp} value={f.sub} onChange={(e) => set("sub", e.target.value)}>
              <option value="">선택 안 함</option>
              {category?.subs.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </Field>
        </Grid>
      </Section>

      <Section title="가격 · 단위">
        <Grid>
          <Field label="판매가 (원)" required>
            <input className={inp} inputMode="numeric" value={f.price} onChange={(e) => set("price", e.target.value.replace(/[^\d]/g, ""))} placeholder="3600" />
          </Field>
          <Field label="정가 (원)" hint="할인 없으면 판매가와 동일">
            <input className={inp} inputMode="numeric" value={f.listPrice} onChange={(e) => set("listPrice", e.target.value.replace(/[^\d]/g, ""))} placeholder="비우면 판매가와 동일" />
          </Field>
          <Field label="묶음 입수" hint="낱개면 1">
            <input className={inp} inputMode="numeric" value={f.unitCount} onChange={(e) => set("unitCount", e.target.value.replace(/[^\d]/g, ""))} placeholder="12" />
          </Field>
          <Field label="판매 단위 라벨">
            <input className={inp} value={f.unitLabel} onChange={(e) => set("unitLabel", e.target.value)} placeholder="예) 12자루, 1박스(50개)" />
          </Field>
          <Field label="최소 주문 수량">
            <input className={inp} inputMode="numeric" value={f.minOrder} onChange={(e) => set("minOrder", e.target.value.replace(/[^\d]/g, ""))} placeholder="1" />
          </Field>
        </Grid>
      </Section>

      <Section title="표시 옵션">
        <Grid>
          <Field label="뱃지" hint="쉼표로 구분 (예: 인기, 신상)">
            <input className={inp} value={f.badges} onChange={(e) => set("badges", e.target.value)} placeholder="인기, 신상" />
          </Field>
          <Field label="이미지 URL" hint="비우면 자동 플레이스홀더">
            <input className={inp} value={f.image} onChange={(e) => set("image", e.target.value)} placeholder="https://…" />
          </Field>
        </Grid>
        <label className="mt-3 flex w-fit cursor-pointer items-center gap-2 text-sm text-ink-500">
          <input type="checkbox" checked={f.soldOut} onChange={(e) => set("soldOut", e.target.checked)} className="h-4 w-4 accent-toss-blue" />
          품절 처리
        </label>
        <div className="mt-3">
          <Field label="상세 설명">
            <textarea className={`${inp} h-24 resize-none`} value={f.description} onChange={(e) => set("description", e.target.value)} placeholder="상품 상세 설명" />
          </Field>
        </div>
      </Section>

      <div className="mt-6 flex gap-2">
        <button type="submit" disabled={saving} className="rounded-xl bg-toss-blue px-6 py-3 text-sm font-bold text-white hover:bg-toss-blueDark disabled:bg-ink-300">
          {saving ? "저장 중…" : editing ? "수정 저장" : "상품 등록"}
        </button>
        <button type="button" onClick={() => router.push("/admin/products")} className="rounded-xl border border-line px-6 py-3 text-sm font-semibold text-ink-500 hover:bg-surface">
          취소
        </button>
      </div>
    </form>
  );
}

function autoCode(cat: CategoryId): string {
  return `${cat.slice(0, 2).toUpperCase()}-${Date.now().toString().slice(-6)}`;
}

const inp =
  "w-full rounded-lg border border-line px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-toss-blue";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-6 card-seamless bg-white p-5">
      <h2 className="mb-4 text-base font-bold text-ink-900">{title}</h2>
      {children}
    </section>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2">{children}</div>;
}

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 flex items-center gap-1 text-sm font-medium text-ink-500">
        {label}
        {required && <span className="text-alert">*</span>}
        {hint && <span className="text-xs font-normal text-ink-300">· {hint}</span>}
      </label>
      {children}
    </div>
  );
}
