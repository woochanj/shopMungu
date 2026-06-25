import type { Product } from "@/lib/types";
import ProductCard from "./ProductCard";

export default function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-card border border-line py-20 text-center">
        <p className="text-base font-semibold text-ink-700">
          상품이 없습니다
        </p>
        <p className="mt-1 text-sm text-ink-300">
          다른 카테고리나 검색어를 시도해 보세요.
        </p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
