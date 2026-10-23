# 로베르토 데 메디치 이미지 근거

사용자 제공 원본 46장(10947~10993, 11001~11043 홀수 번호)을 `.local-reference/roberto/`에 보존했다. 이 폴더는 Git 제외 대상이다. 데이터 근거 및 예외는 API 저장소 `data/notes/roberto.md` 참고.

## 원본 크롭

모든 좌표는 1280×810 원본 기준 `(left,top,right,bottom)`. 초상화·클래스·스킬·아티팩트는 AI 재생성하지 않았다.

| 파일 (`public/icons/` 기준) | 원본 | 좌표 | 출력 |
|---|---|---|---|
| characters/roberto_thumb.png | 10949 | 255,120,675,680 | 420×560 |
| characters/roberto_portrait.png | 10949 | 240,110,690,710 | 600×800 |
| passives/prelude_to_revolution.png | 10965 | 763,547,850,634 | 87×87 |
| ultimates/jinmu_heaven_earth.png | 10965 | 1068,435,1156,523 | 88×88 |
| classes/emblem/resistance.png | 10993 | 415,291,505,381 | 원형146×146 |
| classes/emblem/storm_knight.png | 10993 | 415,461,505,551 | 원형146×146 |
| classes/emblem/resist_commander.png | 10993 | 615,461,705,551 | 원형146×146 |
| classes/passive/resistance.png | 11003 | 897,230,969,302 | 72×72 |
| classes/passive/storm_knight.png | 11009 | 897,230,969,302 | 72×72 |
| classes/passive/resist_commander.png | 11015 | 897,230,969,302 | 72×72 |
| skills/nakwoldo.png | 11003 | 977,230,1049,302 | 72×72 |
| skills/thunder_burst_slash.png | 11009 | 977,230,1049,302 | 72×72 |
| skills/advance_shout.png | 11015 | 977,230,1049,302 | 72×72 |
| artifacts/eye_of_storm.png | 10977 | 698,96,796,200 | 외곽 알파144×154 |
| artifacts/valhalla_horn.png | 10979 | 698,96,796,200 | 외곽 알파144×154 |
| weapons/victoria_armada.png | 11019 | 954,186,1166,500 | 세로 카드, UI 제거 보정 |

아티팩트 마스크: `(53,1),(65,9),(77,20),(84,33),(96,38),(90,48),(87,67),(76,77),(68,81),(57,99),(47,93),(32,90),(23,82),(13,69),(5,62),(1,47),(6,33),(14,22),(30,13),(45,9)` (98×104 크롭 내부 좌표). 금속 장식과 내부 음영 보존, 4배 마스크를 축소하여 적용.

파이터·나이트·커맨드나이트 이미지, 공통 스킬, 속성 과부하는 기존 파일 재사용.

## 전용무기 보정

imagegen 스킬의 기본 내장 도구 사용. 카드 크롭만 편집 대상으로 제공. 최종 파일은 `public/icons/weapons/victoria_armada.png`. 원본과 비교하여 색·구도·프레임 유지 및 UI 제거 확인. Lv/별에 가린 검 끝은 추정 복원이며, 원본의 세부 형태를 확정하는 자료가 아니다.

최종 프롬프트:

> Use case: precise-object-edit. Image 1 is the edit target, a game wiki weapon card. Remove ONLY the lower-left Lv 50 text and rarity stars and the lower-right padlock including its dark square background. Fill these small regions with the adjacent golden brown background and minimally reconstruct the covered sword tip. Preserve the exact sword design, silver and blue colors, pose, proportions, lighting, golden rectangular frame and all four card edges. Do not redesign, rotate, enlarge the sword, sharpen globally, add text or add objects. Output one complete portrait weapon card with same framing.

## 검증

- 신규 이미지16개를 원본 및 어두운 배경 모음 이미지로 검토.
- API 데이터 검증 경고 없음, 전체143개 테스트 통과.
- 프론트 빌드 및 양쪽 저장소 diff 검사 통과.
- 로컬 미리보기: 프로필·클래스·발현6단·아티팩트·무기 펼침 확인. 렌더된 이미지42개 중 깨진 이미지 없음.
- 커밋·푸시·배포는 별도 요청 전까지 하지 않음.
