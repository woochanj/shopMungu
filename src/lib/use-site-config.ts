"use client";

import { useEffect, useState } from "react";
import {
  DEFAULT_CONFIG,
  SITE_CONFIG_EVENT,
  type SiteConfig,
  siteConfigRepo,
} from "./site-config";

/** 홈 구성을 읽는 훅. 관리자가 저장하면 자동 갱신. */
export function useSiteConfig() {
  const [config, setConfig] = useState<SiteConfig>(DEFAULT_CONFIG);

  useEffect(() => {
    let alive = true;
    const load = () => {
      siteConfigRepo.get().then((c) => {
        if (alive) setConfig(c);
      });
    };
    load();
    window.addEventListener(SITE_CONFIG_EVENT, load);
    return () => {
      alive = false;
      window.removeEventListener(SITE_CONFIG_EVENT, load);
    };
  }, []);

  return config;
}
