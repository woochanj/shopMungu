"use client";

import Link from "next/link";
import ProductGrid from "@/components/ProductGrid";
import BannerSlider from "@/components/BannerSlider";
import { useProducts } from "@/lib/use-products";
import { useCategories } from "@/lib/use-categories";
import { useSiteConfig } from "@/lib/use-site-config";
import type { HomeSection } from "@/lib/site-config";

export default function HomePage() {
  const config = useSiteConfig();
  const categories = useCategories();
  const { products: all } = useProducts((r) => r.list());
  const { products: popular } = useProducts((r) => r.popular());
  const { products: newArrivals } = useProducts((r) => r.newArrivals());

  function renderSection(s: HomeSection) {
    if (!s.visible) return null;
    switch (s.type) {
      case "categories":
        return (
          <section key="categories" className="mt-10">
            <div className="grid grid-cols-3 gap-x-2 gap-y-5 sm:grid-cols-6">
              {categories.map((c) => (
                <Link
                  key={c.id}
                  href={`/category/${c.id}`}
                  className="group flex flex-col items-center gap-2.5"
                >
                  <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-surface text-2xl transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-hover">
                    {c.emoji}
                  </span>
                  <span className="text-sm font-semibold text-ink-700 group-hover:text-toss-blue">
                    {c.name}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        );
      case "popular":
        return (
          <Section key="popular" title={s.title} href="/search?q=인기">
            <ProductGrid products={popular} />
          </Section>
        );
      case "newArrivals":
        return (
          <Section key="newArrivals" title={s.title} href="/search?q=노트">
            <ProductGrid products={newArrivals} />
          </Section>
        );
      default:
        return null;
    }
  }

  return (
    <div className="mx-auto max-w-[1320px] px-4">
      <BannerSlider
        banners={config.banners}
        extraSubtitle={`필기구부터 포장재까지 ${all.length.toLocaleString("ko-KR")}여 종.`}
      />

      {config.sections.map(renderSection)}
    </div>
  );
}

function Section({
  title,
  href,
  children,
}: {
  title: string;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-16">
      <div className="mb-6 flex items-baseline justify-between">
        <h2 className="text-2xl font-extrabold tracking-tight text-ink-900">
          {title}
        </h2>
        <Link
          href={href}
          className="shrink-0 text-sm font-semibold text-ink-400 transition-colors hover:text-toss-blue"
        >
          더보기 →
        </Link>
      </div>
      {children}
    </section>
  );
}
