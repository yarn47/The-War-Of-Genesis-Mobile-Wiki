# 라시드 팬드래건(청년) 등록 자료

## 데이터 기준

사용자 제공 게임 스크린샷을 기준으로 별도 캐릭터 `lacid_young`을 추가했다. 기존 라시드 데이터와 공용 클래스는 보존한다.

- 출현작: 창세기전2
- 출시일: 2024-05-14 (직전 듀나미스 출시일에서 2주 뒤)
- 미발현 설화난영참: 공격력 125%, 냉기 둔화 35%. 피해량은 사용자 지정, 확률은 사용자 지시에 따라 1발현 40%에서 5%p 차감.
- 클래스: 파이터 → 소드맨 → 검성 / 파이터 → 나이트 → 드래곤나이트·커맨드나이트.
- 고유 패시브: 각성 3~6, 발현 2·4·6.
- 필살기: 기본, 발현 1·3·5.
- 아티팩트 3종 및 진 바리사다 각성 1~6의 일반·전용 효과 포함.

데이터는 인접 `Genesis-Wiki-API/data` 저장소의 characters, classes, buffs, debuffs, artifacts, weapons 아래 `lacid_young.json`에 저장한다.

## 원본과 자르기

좌표는 원본 1280×810 기준 `(left, top, right, bottom)`. 원본은 Git에서 제외한 `.local-reference/lacid-young`에 보관한다. 아래 경로는 `public/icons` 기준이다.

| 결과 | 원본 | 좌표 | 처리 |
| --- | --- | --- | --- |
| characters/lacid_young_thumb.png | 9161 | 350,140,680,580 | 420×560 |
| characters/lacid_young_portrait.png | 9161 | 335,130,695,610 | 600×800 |
| passives/kingdom_future.png | 9179 | 763,547,850,634 | 원본 자르기 |
| ultimates/snow_blossom_slash.png | 9179 | 1068,435,1156,523 | 원본 자르기 |
| classes/emblem/sword_saint.png | 9934 | 228,461,318,551 | 원형 투명 배경 |
| classes/emblem/dragon_knight.png | 9934 | 415,461,505,551 | 원형 투명 배경 |
| classes/emblem/command_knight.png | 9934 | 615,461,705,551 | 원형 투명 배경 |
| classes/passive/sword_saint.png | 9936 | 897,230,969,302 | 원본 자르기 |
| classes/passive/dragon_knight.png | 9942 | 897,230,969,302 | 원본 자르기 |
| classes/passive/command_knight.png | 9974 | 897,230,969,302 | 원본 자르기 |
| skills/sword_wind_slash.png | 9936 | 977,230,1049,302 | 원본 자르기 |
| skills/javier_breath.png | 9942 | 977,230,1049,302 | 원본 자르기 |
| skills/battle_shout.png | 9974 | 977,230,1049,302 | 원본 자르기 |
| artifacts/javier_blessing.png | 9193 | 698,96,796,200 | 외곽 투명 처리 |
| weapons/true_barisada.png | 9948 | 954,186,1166,500 | 카드 UI만 이미지 편집 |

## 무기 이미지 편집

무기만 이미지 생성 도구로 레벨·별·자물쇠를 제거했다. 가려진 부분 복원은 원본에서 직접 확인할 수 없는 추정이며, 다른 자산에는 생성형 편집을 적용하지 않았다.

사용 프롬프트:

> Use case: precise-object-edit. Image 1 is the edit target: a vertical game weapon card. Remove only Lv50 text, bottom rarity stars, and the lock icon with its dark square. Reconstruct those small regions with matching gold-brown background; hidden sword tip detail may be conservatively reconstructed. Preserve the exact sword design, position, proportions, colors, lighting, gold frame and corner ornaments. Do not redesign, rotate, crop, zoom, or globally sharpen. Output one opaque vertical card including all four frame edges. No text or stars.

## 확인

- 원본 자르기 결과와 무기 카드를 육안 검사.
- API 테스트 95개 및 프런트엔드 테스트 5개 통과.
- 프런트엔드 빌드 및 공백 오류 검사 통과.
- SQL 생성 검사 완료. 운영 DB에는 적용하지 않음.
- 로컬 상세 화면에서 프로필, 클래스, 필살기 단계, 아티팩트 및 무기 단계 표시 확인.
- 로컬 미리보기 전용 ID 99001 사용. 운영 ID가 아니며 커밋·푸시·배포는 별도 작업.
