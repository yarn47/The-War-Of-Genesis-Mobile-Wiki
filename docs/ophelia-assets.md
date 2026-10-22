# 오필리어 버킹엄 등록

출시일 2024-05-28(사용자 지정: 엘리자베스와 동일), 출현작 템페스트.
원본 스크린샷 10393~10465의 홀수 번호 36장은 `.local-reference/ophelia/`에 보존하며 Git에서는 제외한다.

API 저장소 `data/{characters,classes,buffs,artifacts,weapons}/ophelia.json`에 등록한다.
메이지·매지션·아크메이지·프로스트메이지, 치밀한 준비 및 기존 공용 디버프·집중은 재사용한다.
추가 소속 템페스트 서커스단과 분류 이너브레이크는 현재 데이터 모델에서 지원하지 않으므로 API `data/notes/ophelia.md`에 보존한다.
노발현 필살기 140%/65%는 사용자 요청에 따른 단계 격차 역산이며, 실제 화면 확인값과 구분해 기록했다.

## 원본 크롭

경로는 `public/icons/` 기준, 좌표는 원본 1280×810의 `(left, top, right, bottom)`이다. 무기 UI 제거 외에는 AI 재작화하지 않았다.

| 파일 | 사진 | 좌표 | 결과 |
| --- | --- | --- | --- |
| characters/ophelia_thumb.png | 10395 | 325,80,715,600 | 420×560 |
| characters/ophelia_portrait.png | 10395 | 310,70,730,630 | 600×800 |
| passives/ultimate_one.png | 10405 | 763,547,850,634 | 원본 타일 |
| ultimates/parhelion_ray.png | 10405 | 1068,435,1156,523 | 원본 타일 |
| classes/emblem/fatima.png | 10439 | 415,291,505,381 | 146×146 원형 알파 |
| classes/emblem/fatima_ultimate.png | 10439 | 615,461,705,551 | 146×146 원형 알파 |
| classes/passive/fatima.png | 10441 | 897,230,969,302 | 72×72 |
| classes/passive/fatima_ultimate.png | 10447 | 897,230,969,302 | 72×72 |
| skills/prominence.png | 10441 | 977,230,1049,302 | 72×72 |
| skills/ultimate_meteor.png | 10447 | 977,230,1049,302 | 72×72 |
| artifacts/element_mastery_fire.png | 10423 | 698,96,796,200 | 144×154 외곽 알파 |
| artifacts/element_mastery_ice.png | 10421 | 698,96,796,200 | 144×154 외곽 알파 |
| weapons/sea_of_stars.png | 10453 | 954,186,1166,500 | 세로 카드, UI 제거 |

## 무기 카드 편집

imagegen 스킬의 내장 이미지 편집 도구로 레벨·별·자물쇠만 제거했다. 가려진 지팡이 끝의 복원은 추정이다. 최종 저장 경로: `public/icons/weapons/sea_of_stars.png`.

사용 프롬프트:

> Use case: precise-object-edit. Image 1 is the edit target: a vertical game weapon card. Remove only Lv50 text, bottom rarity stars, and the lock icon with its dark square. Reconstruct those small regions with matching gold-brown background; hidden staff tip detail may be conservatively reconstructed. Preserve the exact staff design, position, proportions, colors, lighting, gold frame and corner ornaments. Do not redesign, rotate, crop, zoom, or globally sharpen. Output one opaque vertical card including all four frame edges. No text or stars.

## 검증

- API 테스트 105개, 프런트엔드 테스트 5개 및 빌드 통과.
- SQL 생성 검사 통과. 운영 DB에는 적용하지 않음.
- 원본 크롭 모음과 무기 카드 결과 육안 검사.
- 로컬 미리보기에서 프로필, 파티마얼티밋, 고유 패시브 발현 6단, 화염·빙한 아티팩트 및 무기 단계별 효과 확인.
- 로컬 ID 99003은 검증용이며 운영 ID가 아님.
- 커밋·푸시·배포는 수행하지 않음.
