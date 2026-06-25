# 문구도매센터 (shopMungu)

모든 문구 상품을 도매가로 판매하는 쇼핑몰 데모.
**토스증권 디자인 톤**(블루/화이트/그레이) + **네이버 브랜드스토어형 레이아웃**.

## 기술 스택

- Next.js 16 (App Router) · React 19 · TypeScript
- Tailwind CSS 3 (토스 팔레트 커스텀 테마)
- 상태: React Context (장바구니, localStorage 영속)
- 데이터: 더미 (`src/lib/products.ts`)

## 실행

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # 프로덕션 빌드
```

## 화면

| 경로 | 설명 |
| --- | --- |
| `/` | 홈 (배너 + 카테고리 바로가기 + 인기/신상 그리드) |
| `/category/[id]` | 카테고리별 목록 (좌측 필터: 소분류·가격·브랜드 + 정렬) |
| `/search?q=` | 검색 결과 (상품명·브랜드·상품코드) |
| `/product/[id]` | 상품 상세 (수량·담기·바로구매, 개당 단가/묶음) |
| `/cart` | 장바구니 (수량 조절, 무료배송 안내, 합계) |
| `/checkout` | 주문/결제 (배송지·결제수단 선택) |
| `/checkout/complete` | 주문 완료 |

## 도매 특화 요소

- 상품 카드에 **개당 단가 + 묶음 단위**(예: `개당 250원 · 12자루`) 표기
- 최소 주문 수량(`minOrder`) 반영
- 시인성 우선의 조밀한 그리드 + 또렷한 정보 위계

## 결제(PG) 연동 자리

현재 결제는 **더미 스텁**입니다. 실제 한국 PG 연동 지점:

- `src/lib/payment.ts` → `requestPayment()` 내부의 `TODO` 주석.
  여기서 provider별 실제 SDK 호출(토스페이먼츠 / 카카오페이 / 네이버페이 /
  무통장입금)로 교체하면 됩니다.
- 결제수단 목록은 같은 파일의 `PAYMENT_METHODS`에서 관리합니다.

## 상품 이미지

외부 의존성 없이 동작하도록 현재는 카테고리 색상 기반 **인라인 SVG
플레이스홀더**(`src/lib/placeholder.ts`)를 사용합니다. 실제 상품 사진으로
교체할 때는 `src/lib/products.ts`의 `image` 필드와
`next.config.ts`의 `images.remotePatterns`를 함께 수정하세요.

> 모든 상품·가격·브랜드는 예시 데이터입니다.
