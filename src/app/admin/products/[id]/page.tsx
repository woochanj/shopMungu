"use client";

import { use } from "react";
import Link from "next/link";
import ProductForm from "@/components/admin/ProductForm";
import { useProduct } from "@/lib/use-products";

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { product, loading } = useProduct(id);

  if (loading) {
    return <p className="text-sm text-ink-300">불러오는 중…</p>;
  }
  if (!product) {
    return (
      <div>
        <p className="text-sm text-ink-500">상품을 찾을 수 없습니다.</p>
        <Link href="/admin/products" className="mt-3 inline-block text-sm text-toss-blue">
          ← 상품 목록으로
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-1 text-2xl font-extrabold text-ink-900">상품 수정</h1>
      <p className="mb-6 text-sm text-ink-400">
        {product.code} · {product.name}
      </p>
      <ProductForm product={product} />
    </div>
  );
}
