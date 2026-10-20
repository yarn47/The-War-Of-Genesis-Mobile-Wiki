# 엘리자베스 팬드래건 등록

출시일은 사용자 지정에 따라 청년 라시드에서 2주 뒤인 2024-05-28, 출현작은 템페스트다. 원본은 `.local-reference/elizabeth/9980.jpg`~`10060.jpg`에 보존하며 Git에서는 제외한다.

API 저장소의 `data/{characters,classes,buffs,debuffs,artifacts,weapons}/elizabeth.json`에 데이터를 추가했다. 파이터·나이트·로얄나이트, 속성 과부하·최상의 상태, 치유 감소·치유 불가는 공용 데이터를 재사용한다. 데이터 모델에서 지원하지 않는 추가 소속(템페스트 서커스단)과 분류(이너브레이크)는 API의 `data/notes/elizabeth.md`에 보존했다.

## 원본 크롭

아래 경로는 `public/icons/` 기준, 좌표는 원본 1280×810의 `(left, top, right, bottom)`이다. 초상화·클래스·스킬·아티팩트는 AI로 다시 그리지 않았다.

| 파일 | 원본 | 좌표 | 결과 |
| --- | --- | --- | --- |
| characters/elizabeth_thumb.png | 9982 | 330,90,690,570 | 420×560 |
| characters/elizabeth_portrait.png | 9982 | 315,80,705,600 | 600×800 |
| passives/rose_bride.png | 10006 | 763,547,850,634 | 원본 타일 |
| ultimates/rose_blanche.png | 10006 | 1068,435,1156,523 | 원본 타일 |
| classes/emblem/inheritor.png | 10060 | 415,291,505,381 | 146×146 원형 알파 |
| classes/emblem/crimson_knight.png | 10060 | 415,461,505,551 | 146×146 원형 알파 |
| classes/emblem/princess.png | 10060 | 615,461,705,551 | 146×146 원형 알파 |
| classes/passive/inheritor.png | 10028 | 897,230,969,302 | 72×72 |
| classes/passive/crimson_knight.png | 10034 | 897,230,969,302 | 72×72 |
| classes/passive/princess.png | 10040 | 897,230,969,302 | 72×72 |
| skills/refuse_barrier.png | 10028 | 977,230,1049,302 | 72×72 |
| skills/yeonhong_slash.png | 10034 | 977,230,1049,302 | 72×72 |
| skills/crown_protector.png | 10040 | 977,230,1049,302 | 72×72 |
| artifacts/scorched_heart.png | 10020 | 698,96,796,200 | 144×154 외곽 알파 |
| weapons/moonlight_rose.png | 10046 | 954,186,1166,500 | 세로 카드, UI 제거 |

## 달빛 장미 카드 편집

내장 이미지 편집 도구를 사용해 레벨·별·자물쇠만 제거했다. UI에 가려진 무기 끝의 복원은 추정이며 원본 확인 정보가 아니다. 최종 파일은 `public/icons/weapons/moonlight_rose.png`다.

사용 프롬프트:

> Use case: precise-object-edit. Image 1 is the edit target: a vertical game weapon card. Remove only Lv50 text, bottom rarity stars, and the lock icon with its dark square. Reconstruct those small regions with matching gold-brown background; hidden sword tip detail may be conservatively reconstructed. Preserve the exact sword design, position, proportions, colors, lighting, gold frame and corner ornaments. Do not redesign, rotate, crop, zoom, or globally sharpen. Output one opaque vertical card including all four frame edges. No text or stars.

## 검증

- API 테스트 100개 및 프런트엔드 테스트 5개, 프런트엔드 빌드.
- SQL 생성 검사(운영 DB에는 적용하지 않음).
- 원본 크롭 모음 및 무기 결과 육안 검사.
- 로컬 상세 화면의 초상화, 클래스 선택, 발현 6단, 그을린 심장 4단계, 달빛 장미 단계별 효과 확인.
- 로컬 임시 캐릭터 ID 99002는 운영 ID가 아님.
- 사용자 요청 범위는 등록 및 커밋. 푸시·배포하지 않음.
