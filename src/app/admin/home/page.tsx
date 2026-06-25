"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  type HomeBanner,
  type HomeSection,
  type SiteConfig,
  siteConfigRepo,
} from "@/lib/site-config";

const SECTION_LABEL: Record<HomeSection["type"], string> = {
  categories: "카테고리 바로가기",
  popular: "인기 상품",
  newArrivals: "신상품",
};

const PRESET_COLORS = [
  { from: "#3182F6", to: "#1B64DA", name: "토스 블루" },
  { from: "#0EA5A5", to: "#0E7C7B", name: "틸" },
  { from: "#7C5CFC", to: "#5B3FD9", name: "퍼플" },
  { from: "#F04452", to: "#C2334D", name: "레드" },
  { from: "#1F2937", to: "#111827", name: "다크" },
];

function emptyBanner(): HomeBanner {
  return {
    eyebrow: "새 배너",
    title: "제목을 입력하세요",
    subtitle: "부제를 입력하세요.",
    buttonLabel: "보러가기 →",
    buttonHref: "/",
    visible: true,
    color: { ...PRESET_COLORS[0] },
  };
}

export default function AdminHomePage() {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [saved, setSaved] = useState(false);
  const [secDrag, setSecDrag] = useState<number | null>(null);
  const [banDrag, setBanDrag] = useState<number | null>(null);

  useEffect(() => {
    siteConfigRepo.get().then(setConfig);
  }, []);

  if (!config) return <p className="text-sm text-ink-300">불러오는 중…</p>;

  function update(patch: Partial<SiteConfig>) {
    setConfig((prev) => (prev ? { ...prev, ...patch } : prev));
    setSaved(false);
  }

  // ── 배너 ──
  function updateBanner(i: number, patch: Partial<HomeBanner>) {
    update({
      banners: config!.banners.map((b, idx) =>
        idx === i ? { ...b, ...patch } : b
      ),
    });
  }
  function addBanner() {
    update({ banners: [...config!.banners, emptyBanner()] });
  }
  function removeBanner(i: number) {
    update({ banners: config!.banners.filter((_, idx) => idx !== i) });
  }
  function reorderBanner(from: number, to: number) {
    if (from === to) return;
    const arr = [...config!.banners];
    const [m] = arr.splice(from, 1);
    arr.splice(to, 0, m);
    update({ banners: arr });
  }

  // ── 섹션 ──
  function updateSection(i: number, patch: Partial<HomeSection>) {
    update({
      sections: config!.sections.map((s, idx) =>
        idx === i ? { ...s, ...patch } : s
      ),
    });
  }
  function reorderSection(from: number, to: number) {
    if (from === to) return;
    const arr = [...config!.sections];
    const [m] = arr.splice(from, 1);
    arr.splice(to, 0, m);
    update({ sections: arr });
  }

  async function handleSave() {
    await siteConfigRepo.save(config!);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }
  async function handleReset() {
    if (!confirm("홈 구성을 기본값으로 되돌릴까요?")) return;
    await siteConfigRepo.reset();
    setConfig(await siteConfigRepo.get());
  }

  return (
    <div className="max-w-3xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-ink-900">홈 화면 구성</h1>
          <p className="mt-1 text-sm text-ink-400">
            배너 슬라이드와 섹션 순서·노출을 편집합니다. 저장하면 홈에 즉시
            반영됩니다.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/"
            target="_blank"
            className="rounded-lg border border-line px-4 py-2.5 text-sm font-semibold text-ink-500 hover:bg-surface"
          >
            홈 미리보기 ↗
          </Link>
          <button
            onClick={handleReset}
            className="rounded-lg border border-line px-4 py-2.5 text-sm font-semibold text-ink-400 hover:text-alert"
          >
            기본값
          </button>
          <button
            onClick={handleSave}
            className="rounded-lg bg-toss-blue px-5 py-2.5 text-sm font-bold text-white hover:bg-toss-blueDark"
          >
            {saved ? "저장됨 ✓" : "저장"}
          </button>
        </div>
      </div>

      {/* 배너 슬라이드 */}
      <section className="mt-6 card-seamless bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-ink-900">
              배너 슬라이드 ({config.banners.length})
            </h2>
            <p className="mt-0.5 text-xs text-ink-400">
              ⠿ 드래그로 순서 변경 · 여러 장이면 홈에서 자동 슬라이드됩니다.
            </p>
          </div>
          <button
            onClick={addBanner}
            className="rounded-lg bg-toss-blueLight px-3 py-2 text-sm font-bold text-toss-blue hover:bg-toss-blue hover:text-white"
          >
            + 슬라이드 추가
          </button>
        </div>

        <div className="space-y-3">
          {config.banners.map((b, i) => (
            <div
              key={i}
              draggable
              onDragStart={() => setBanDrag(i)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (banDrag !== null) reorderBanner(banDrag, i);
                setBanDrag(null);
              }}
              onDragEnd={() => setBanDrag(null)}
              className={`rounded-card border bg-white p-4 transition-colors ${
                banDrag === i ? "border-toss-blue opacity-60" : "border-line"
              }`}
            >
              <div className="mb-3 flex items-center gap-2">
                <span className="cursor-grab select-none text-lg text-ink-300">
                  ⠿
                </span>
                <span className="tnum text-sm font-bold text-ink-300">
                  슬라이드 {i + 1}
                </span>
                <div className="ml-auto flex items-center gap-2">
                  <Toggle
                    checked={b.visible}
                    onChange={(v) => updateBanner(i, { visible: v })}
                  />
                  <button
                    onClick={() => removeBanner(i)}
                    className="rounded-md px-2 py-1 text-xs font-semibold text-ink-400 hover:text-alert"
                  >
                    삭제
                  </button>
                </div>
              </div>

              {/* live preview */}
              <div
                className="mb-3 overflow-hidden rounded-lg px-5 py-6 text-white"
                style={{
                  background: `linear-gradient(to right, ${b.color?.from}, ${b.color?.to})`,
                }}
              >
                <p className="text-xs font-semibold text-white/80">{b.eyebrow}</p>
                <p className="mt-1 whitespace-pre-line text-lg font-extrabold leading-tight">
                  {b.title}
                </p>
                <p className="mt-1 text-xs text-white/80">{b.subtitle}</p>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                <input className={inp} value={b.eyebrow} onChange={(e) => updateBanner(i, { eyebrow: e.target.value })} placeholder="윗줄" />
                <input className={inp} value={b.subtitle} onChange={(e) => updateBanner(i, { subtitle: e.target.value })} placeholder="부제" />
              </div>
              <textarea className={`${inp} mt-2 h-16 resize-none`} value={b.title} onChange={(e) => updateBanner(i, { title: e.target.value })} placeholder="제목 (줄바꿈 Enter)" />
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                <input className={inp} value={b.buttonLabel} onChange={(e) => updateBanner(i, { buttonLabel: e.target.value })} placeholder="버튼 문구" />
                <input className={inp} value={b.buttonHref} onChange={(e) => updateBanner(i, { buttonHref: e.target.value })} placeholder="버튼 링크 (예: /category/paper)" />
              </div>

              {/* color presets */}
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs text-ink-400">배경색</span>
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => updateBanner(i, { color: { from: c.from, to: c.to } })}
                    title={c.name}
                    className={`h-6 w-6 rounded-full border-2 ${
                      b.color?.from === c.from ? "border-ink-900" : "border-white"
                    }`}
                    style={{ background: `linear-gradient(135deg, ${c.from}, ${c.to})` }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 섹션 순서 */}
      <section className="mt-6 card-seamless bg-white p-5">
        <h2 className="text-base font-bold text-ink-900">섹션 순서 · 노출</h2>
        <p className="mt-1 text-xs text-ink-400">
          ⠿ 드래그로 순서를 바꾸고, 토글로 노출을 켜고 끕니다.
        </p>
        <div className="mt-4 space-y-2">
          {config.sections.map((s, i) => (
            <div
              key={s.type}
              draggable
              onDragStart={() => setSecDrag(i)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (secDrag !== null) reorderSection(secDrag, i);
                setSecDrag(null);
              }}
              onDragEnd={() => setSecDrag(null)}
              className={`flex items-center gap-3 rounded-lg border bg-white p-3 transition-colors ${
                secDrag === i ? "border-toss-blue opacity-60" : "border-line"
              }`}
            >
              <span className="cursor-grab select-none text-lg text-ink-300">⠿</span>
              <span className="tnum text-sm font-bold text-ink-300">{i + 1}</span>
              <div className="flex-1">
                <input
                  className="w-full bg-transparent text-sm font-semibold text-ink-900 outline-none"
                  value={s.title}
                  onChange={(e) => updateSection(i, { title: e.target.value })}
                />
                <span className="text-xs text-ink-300">
                  {SECTION_LABEL[s.type]}
                </span>
              </div>
              <Toggle
                checked={s.visible}
                onChange={(v) => updateSection(i, { visible: v })}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

const inp =
  "w-full rounded-lg border border-line px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-toss-blue";

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
        checked ? "bg-toss-blue" : "bg-line"
      }`}
      aria-pressed={checked}
      aria-label="노출 토글"
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
          checked ? "left-[22px]" : "left-0.5"
        }`}
      />
    </button>
  );
}
