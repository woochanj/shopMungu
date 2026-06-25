import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import StoreChrome from "@/components/StoreChrome";

export const metadata: Metadata = {
  title: "문구도매센터 | 모든 문구를 도매가로",
  description:
    "필기구·노트·사무용품·미술재료·포장까지. 모든 문구 상품을 도매가로 한 곳에서. 문구도매센터.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-white">
        <CartProvider>
          <StoreChrome>{children}</StoreChrome>
        </CartProvider>
      </body>
    </html>
  );
}
