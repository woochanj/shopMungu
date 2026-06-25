import type { Category } from "./types";

export const CATEGORIES: Category[] = [
  {
    id: "writing",
    name: "필기구",
    emoji: "✏️",
    subs: ["볼펜", "수성펜/사인펜", "연필/샤프", "형광펜", "마커", "지우개"],
  },
  {
    id: "paper",
    name: "노트/지류",
    emoji: "📓",
    subs: ["노트", "다이어리", "메모지/포스트잇", "복사용지", "스케치북"],
  },
  {
    id: "office",
    name: "사무용품",
    emoji: "📎",
    subs: ["파일/바인더", "클립/집게", "테이프/풀", "가위/커터", "스테이플러", "라벨"],
  },
  {
    id: "art",
    name: "미술재료",
    emoji: "🎨",
    subs: ["색연필/크레파스", "물감/팔레트", "붓", "스케치/캔버스", "점토"],
  },
  {
    id: "desk",
    name: "데스크",
    emoji: "🗂️",
    subs: ["연필꽂이", "트레이/정리함", "독서대", "탁상달력", "명함꽂이"],
  },
  {
    id: "packing",
    name: "포장/택배",
    emoji: "📦",
    subs: ["박스", "택배봉투", "뽁뽁이/완충재", "노끈/케이블타이", "스티커/라벨"],
  },
];

export function categoryById(id: string) {
  return CATEGORIES.find((c) => c.id === id);
}
