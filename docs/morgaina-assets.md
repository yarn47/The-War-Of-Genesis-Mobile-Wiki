# 모르가이나 이미지

기존 image-cropping-guide.md 방식으로 사용자 제공 1280×810 게임 스크린샷을 원본 크롭했다. 기존 공통 클래스·스킬·치밀한 준비 이미지는 변경하지 않았다.

| 대상 | 사진 | 크롭 (left, top, right, bottom) |
| --- | --- | --- |
| 초상화 | 7448 | 292,128,682,648 → 600×800 |
| 썸네일 | 7448 | 300,128,660,608 → 420×560 |
| 달의 양면 | 7346 | 141,570,202,631 |
| 프리스트 / 하이프리스트 | 7422 | 중심 273,336 / 273,505, 반경45 원형 → 146×146 |
| 클래스 패시브 | 7436 / 7424 | 897,230,969,302 |
| 홀리 블로우 | 7436 | 977,230,1049,302 |
| 마력의 공명석 / 그림자의 빛 | 7376 / 7378 | 698,96,796,200, 가이드 외곽 마스크 → 144×154 |
| 크레센트 로드 | 7394 | 955,187,1166,500 → 329×488, 아래 보정 적용 |

무기만 내장 image_gen 도구로 Lv·별·자물쇠 제거. 글자에 가려진 무기 끝 복원은 추정이다. 결과는 public/icons/weapons/crescent_rod.png에 보관.

최종 편집 프롬프트:

> Use case: precise-object-edit. Edit target: supplied Crescent Rod weapon card. Remove only the lower-left Lv 50 text and rarity stars and the lower-right lock icon with its dark square background. Fill these regions with the surrounding gold-brown card background; reconstruct only the small weapon tip obscured by text following its existing straight silver shaft. Preserve the original purple crescent rod design, colors, location, proportions, gold frame and all four corners exactly. Do not redesign, rotate, zoom or sharpen the rest. Output one portrait card with all four borders visible and no added text.
