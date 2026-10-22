# 크리스 이미지 및 확인 기록

- 출시일: 2024-07-23 (캐서린 출시 2주 뒤, 사용자 확인)
- 출현작: 서풍의 광시곡
- 제공 원본 70장 보관: 무시된 로컬 자료 폴더 `.local-reference/chris/`.
- 초상화·클래스·스킬·아티팩트는 원본 크롭. 기존 자산 변경 없음.
- 신규 이미지 29개: 초상화 2, 클래스 엠블럼 6, 클래스 패시브 6, 액티브 8, 고유 패시브 1, 필살기 1, 아티팩트 4, 전용무기 1.

## 크롭 근거

| 종류 | 원본 | 좌표/처리 |
| --- | --- | --- |
| 썸네일 | 10807 | (245,105,665,665), 420×560 |
| 초상화 | 10807 | (235,105,685,705), 600×800 |
| 고유 패시브 | 10835 | (763,547,850,634) |
| 필살기 | 10835 | (1068,435,1156,523) |
| 거너 엠블럼 | 10945 | 중심(273,169), 90×90, 원형 알파, 146×146 |
| 나머지 엠블럼 | 10943 | 건슬링어(273,336), 건블레이더(460,336), 에이스(273,506), 스핏파이어(460,506), 레퀴엠(660,506), 동일 처리 |
| 클래스/액티브 타일 | 10943,10887,10899,10945,10905,10911 | 획득 스킬 타일 72×72, P/A 표식 보존 |
| 아티팩트 4개 | 10845,10847,10849,10851 | (698,96,796,200), 외곽 다각형 알파, 144×154 |
| 전용무기 | 10917 | (954,186,1166,500), 전체 세로 카드 |

## 무기 보정

내장 imagegen 편집 도구 사용. `public/icons/weapons/sturmgewitter.png`에 저장.
레벨·별·자물쇠를 제거하며 글자에 가린 손잡이 끝 일부는 추정 복원.
원본과 비교하여 무기 모양·배치·금색 프레임 유지 확인.

사용 프롬프트:

> Use case: precise-object-edit. Input image is the edit target, a portrait game weapon card. Remove only the bottom-left Lv50 text and rarity stars and the bottom-right padlock and its rectangular backing. Fill those small areas with the adjoining golden-brown background. Reconstruct only the tiny weapon grip portion hidden by text, following its existing form. Preserve the entire original weapon design, colors, angle, proportions, placement, background glow, gold border and corner decorations. No redesign, rotation, added details, or global sharpening. Show all four edges of the original portrait card. Output one edited image.

## 검증

- 원본 크롭 모음의 투명 외곽과 P/A/U 표식 확인.
- 로컬 상세: 프로필·클래스 선택·발현 6단의 아티팩트 4개·무기 단계 펼침 확인.
- API 데이터 전체 검증 및 회귀 테스트 137개 통과.
- 프론트 빌드 및 변경 공백 검사 통과.
- 원본 및 검토용 이미지는 배포 파일에 포함하지 않음.
- 커밋·푸시·배포는 별도 요청 시 진행.
