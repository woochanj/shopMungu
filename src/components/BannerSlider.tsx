"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { HomeBanner } from "@/lib/site-config";

const AUTOPLAY_MS = 5000;

export default function BannerSlider({
  banners,
  extraSubtitle,
}: {
  banners: HomeBanner[];
  /** 첫 슬라이드 부제 앞에 붙는 동적 문구 (예: 상품 수) */
  extraSubtitle?: string;
}) {
  const slides = banners.filter((b) => b.visible);
  const [idx, setIdx] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = useCallback(
    (next: number) => {
      const n = slides.length;
      if (n === 0) return;
      setIdx(((next % n) + n) % n);
    },
    [slides.length]
  );

  // autoplay (reduced-motion이면 멈춤)
  useEffect(() => {
    if (slides.length <= 1) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduce) return;
    timer.current = setInterval(() => {
      setIdx((i) => (i + 1) % slides.length);
    }, AUTOPLAY_MS);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [slides.length]);

  function pause() {
    if (timer.current) clearInterval(timer.current);
  }
  function resume() {
    if (slides.length <= 1) return;
    timer.current = setInterval(() => {
      setIdx((i) => (i + 1) % slides.length);
    }, AUTOPLAY_MS);
  }

  if (slides.length === 0) return null;

  return (
    <section
      className="group relative left-1/2 right-1/2 -mx-[50vw] w-screen overflow-hidden"
      onMouseEnter={pause}
      onMouseLeave={resume}
      aria-roledescription="carousel"
    >
      {/* slides track */}
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${idx * 100}%)` }}
      >
        {slides.map((b, i) => (
          <div
            key={i}
            className="w-full shrink-0 py-14 text-white md:py-20"
            style={{
              background: `linear-gradient(to right, ${b.color?.from ?? "#3182F6"}, ${
                b.color?.to ?? "#1B64DA"
              })`,
            }}
            aria-hidden={i !== idx}
          >
            <div className="mx-auto max-w-[1320px] px-8 md:px-4">
              <p className="text-sm font-semibold text-white/80">{b.eyebrow}</p>
              <h2 className="mt-2 whitespace-pre-line text-3xl font-extrabold leading-tight md:text-[44px]">
                {b.title}
              </h2>
              <p className="mt-3 max-w-md text-sm text-white/80 md:text-base">
                {i === 0 && extraSubtitle ? `${extraSubtitle} ` : ""}
                {b.subtitle}
              </p>
              <Link
                href={b.buttonHref}
                className="mt-6 inline-flex items-center gap-1 rounded-xl bg-white px-5 py-3 text-sm font-bold text-toss-blue transition-colors hover:bg-white/90"
              >
                {b.buttonLabel}
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* arrows */}
      {slides.length > 1 && (
        <>
          <SliderButton dir="prev" onClick={() => go(idx - 1)} />
          <SliderButton dir="next" onClick={() => go(idx + 1)} />
        </>
      )}

      {/* dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              aria-label={`${i + 1}번 배너로 이동`}
              aria-current={i === idx}
              className={`h-2 rounded-full transition-all ${
                i === idx ? "w-6 bg-white" : "w-2 bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function SliderButton({
  dir,
  onClick,
}: {
  dir: "prev" | "next";
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={dir === "prev" ? "이전 배너" : "다음 배너"}
      className={`absolute top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-xl bg-white/15 text-xl text-white opacity-0 backdrop-blur transition-all duration-200 hover:bg-white/30 focus-visible:opacity-100 group-hover:opacity-100 ${
        dir === "prev" ? "left-4" : "right-4"
      }`}
    >
      {dir === "prev" ? "‹" : "›"}
    </button>
  );
}
