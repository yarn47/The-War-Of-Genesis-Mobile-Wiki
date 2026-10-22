# 리나 맥로레인 등록

출시일 2024-06-04(사용자 최종 정정), 출현작 템페스트.
원본 10467~10543 중 제공된 38장은 `.local-reference/lina/`에 보존하며 Git에서 제외한다.
API 저장소 `data/{characters,classes,buffs,artifacts,weapons}/lina.json`에 등록한다.
시스터·프리스트·클레릭·메이터, 원소통달: 광휘·순례자의 덧신·집중은 공용 데이터를 재사용한다.
추가 소속·분류 및 노발현 역산 근거, 사용자 제공 무기 수치는 API `data/notes/lina.md`에 기록했다.

## 원본 크롭

경로는 `public/icons/` 기준, 좌표는 원본 1280×810의 `(left, top, right, bottom)`이다.
무기 UI 보정 외에는 AI 재작화하지 않았다.

| 파일 | 사진 | 좌표 | 결과 |
| --- | --- | --- | --- |
| characters/lina_thumb.png | 10469 | 325,90,715,610 | 420×560 |
| characters/lina_portrait.png | 10469 | 310,80,730,640 | 600×800 |
| passives/mediating_hand.png | 10487 | 763,547,850,634 | 원본 타일 |
| ultimates/divine_eos.png | 10489 | 1068,435,1156,523 | 원본 타일 |
| classes/emblem/returner.png | 10531 | 228,461,318,551 | 146×146 원형 알파 |
| classes/emblem/oracle.png | 10531 | 615,461,705,551 | 146×146 원형 알파 |
| classes/passive/returner.png | 10533 | 897,230,969,302 | 72×72 |
| classes/passive/oracle.png | 10539 | 897,230,969,302 | 72×72 |
| skills/recall.png | 10533 | 977,230,1049,302 | 72×72 |
| skills/trance.png | 10539 | 977,230,1049,302 | 72×72 |
| artifacts/beacon_of_revelation.png | 10497 | 698,96,796,200 | 144×154 외곽 알파 |
| weapons/divine_guide.png | 10517 | 954,186,1166,500 | 세로 카드, UI 제거 |

## 무기 카드 편집

imagegen 스킬의 내장 이미지 편집 도구로 레벨·희귀도 별·자물쇠만 제거했다.
가려진 로드 끝의 복원은 추정이다. 최종 경로는 `public/icons/weapons/divine_guide.png`.

사용 프롬프트:

> Use case: precise-object-edit. Image 1 is the edit target: a vertical game weapon card. Remove only Lv50 text, bottom rarity stars, and the lock icon with its dark square. Reconstruct those small regions with matching gold-brown background; hidden rod tip detail may be conservatively reconstructed. Preserve the exact winged rod design, position, proportions, colors, lighting, gold frame and corner ornaments. Do not redesign, rotate, crop, zoom, or globally sharpen. Output one opaque vertical card including all four frame edges. No text or rarity stars; preserve the bright star ornament on the rod.

## 검증

- API 테스트 111개(리나 회귀 테스트 6개 포함), 프런트엔드 테스트 5개 및 빌드 통과.
- SQL 생성 검사 및 신규 아이콘 참조 12개 실파일 확인 통과.
- 원본 크롭 모음과 무기 보정 결과 육안 검사.
- 로컬 목록 썸네일, 프로필·출시일, 리터너·오라클 선택, 고유 패시브 발현 6단, 계시의 봉화 4단계, 전용무기 수치표·단계별 효과 확인. 상세 화면 이미지 로딩 오류 없음.
- 로컬 ID 99004는 검증용이며 운영 ID가 아님. 운영 DB에는 적용하지 않음.
- 커밋·푸시·배포는 수행하지 않음.
