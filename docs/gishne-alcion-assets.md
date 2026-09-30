# 기쉬네·알시온 이미지 출처

사용자 제공 게임 스크린샷. 초상화·아이콘은 `image-cropping-guide.md`에 따라 원본 크롭 및 크기 조정만 했으며, AI 재작화하지 않았다.

| 결과 (public/icons 아래) | 사진 | 원본 영역 (left,top,right,bottom) | 출력 |
| --- | --- | --- | --- |
| characters/gishne_portrait.png · gishne_thumb.png | 6551 | 335,185,680,645 | 600×800 · 420×560 |
| characters/alcion_portrait.png · alcion_thumb.png | 6615 | 305,200,650,660 | 600×800 · 420×560 |
| classes/emblem/warlock.png | 6573 | 228,124,318,214 | 146×146, 원형 알파 |
| classes/emblem/occultist.png | 6573 | 228,460,318,550 | 146×146, 원형 알파 |
| classes/passive/warlock.png | 6575 | 817,230,889,302 | 72×72 |
| classes/passive/occultist.png | 6581 | 897,230,969,302 | 72×72 |
| skills/despair_zone.png | 6581 | 977,230,1049,302 | 72×72 |
| passives/knowledge_inheritance.png | 6549 | 141,570,202,631 | 61×61, U 표식 유지 |
| passives/red_whirlwind.png | 6613 | 141,570,202,631 | 61×61, U 표식 유지 |
| ultimates/immovable_king_sword.png | 6617 | 1070,436,1154,521 | 84×85 |
| artifacts/cooperative_attack.png | 6639 | 698,96,796,200 | 144×154, 가이드 장식 외곽 마스크 |
| weapons/time_recorder.png | 6585 | 954,186,1167,501 | 329×488, 아래 별도 보정 |
| weapons/durendal.png | 6645 | 954,186,1167,501 | 329×488, 아래 별도 보정 |

두 문장은 파란 선택 발광이 없는 6573을 사용했다. 기존 공용 클래스·스킬·아티팩트 이미지는 재사용했다.

## 무기 카드 정리

내장 imagegen 편집 모드로 Lv50·희귀도 별·잠금 표시만 제거하도록 요청했다.
표시에 가렸던 무기 끝의 작은 부분은 생성 복원이며 정확한 원본 픽셀은 아니다.
저장 위치는 위 표의 `public/icons/weapons/time_recorder.png`, `public/icons/weapons/durendal.png`이다.
원본 대비 무기 형태·색·방향·카드 프레임을 확인했다.

두 카드에 각각 사용한 최종 프롬프트:

> Use case: precise-object-edit. Image 1 is the edit target, a cropped game weapon card. Produce the same vertical card for a game wiki. Remove ONLY the bottom-left Lv50 text, bottom stars and bottom-right padlock overlay. Reconstruct the tiny underlying weapon tip/background only where hidden by these UI overlays. Keep the weapon design, orientation, scale, colors, gold rays background and thin ornate frame identical. No new text, symbols or redesign. Preserve portrait card aspect ratio.

## 검증

읽기 전용 로컬 JSON 미리보기에서 상세 초상화, 클래스 선택, 효과 팝업, 발현 단계, 아티팩트 및 무기 효과를 확인했다.
이는 운영 DB 또는 배포 검증을 뜻하지 않는다. 빌드 후 배포는 별도 요청으로 진행한다.
