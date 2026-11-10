import { renderOg } from "@/lib/og";
import { OG_SIZE } from "@/lib/seo";

export const alt = "Кодрум – испитна подготовка за студенти";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderOg({
    kicker: "Скопје",
    title: "Спреми се за испит со Кодрум",
    subtitle:
      "Приватни часови и испитна подготовка за студенти од ФИНКИ, ФЕИТ, МФС и Економски",
    chips: ["Во живо", "Онлајн", "Мали групи"],
  });
}
