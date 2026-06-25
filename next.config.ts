import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 상품 이미지는 현재 인라인 SVG(data-URI) 플레이스홀더를 사용한다.
  // 실제 상품 사진(외부 호스팅)으로 교체할 때 아래 remotePatterns에 호스트를 추가하면 된다.
  images: {
    remotePatterns: [],
  },
};

export default nextConfig;
