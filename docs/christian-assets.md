# 크리스티앙 이미지 작업

원본: 사용자 ZIP의 47장, 1972×1248. 원본 보관: `.local-reference/christian/`(Git 제외).
아래 사진은 `Screenshot_20261027_<시각>_The War of Genesis Mobile.jpg`.

| 이미지 | 사진 시각 | 원본 크롭 좌표 | 결과 |
| --- | --- | --- | --- |
| christian_thumb | 182820 | (650,100,1100,700) | 420×560 |
| christian_portrait | 182820 | (400,110,1150,1110) | 600×800 |
| iss_pilot 엠블럼 | 183115 | (638,448,778,588) | 원형 알파146×146 |
| ltk 엠블럼 | 183115 | (946,705,1086,845) | 원형 알파146×146 |
| iss_pilot 패시브 | 183138 | (1382,353,1494,466) | 72×72 |
| ltk 패시브 | 183149 | (1382,353,1494,466) | 72×72 |
| covert_maneuver | 183141 | (1505,353,1617,466) | 72×72 |
| indiscriminate_fire | 183149 | (1505,353,1617,466) | 72×72 |
| decisive_shot | 183012 | (1176,844,1309,977) | 133×133 |
| satellite_attack | 183012 | (1647,669,1780,803) | 133×134 |
| mc_valentine 보정 원본 | 183201 | (1470,285,1796,771) | 세로 카드 |

무기 이외 10개 이미지는 원본 크롭. 기존 공용 클래스·아티팩트 이미지 재사용.
엠블럼은 선택 광원 없는 사진 사용, 타일 P/A/U 표식 보존.
목록 썸네일은 자드와 비교하여 얼굴 크기·눈높이를 조정.

## 무기 카드 보정
- imagegen 스킬의 내장 도구 사용. 글자·별·자물쇠 부분만 제거 요청.
- 생성본: exec-83f4315f-aebf-4cb2-8980-613364752abe.png.
- 최종 파일: `public/icons/weapons/mc_valentine.png`.
- 가려진 배경·무기 일부의 복원은 추정이며 게임 원본 자체는 보존.
- 원본과 비교해 붉은 총열·은색 프레임·검은 손잡이·조준경·카드 네 변 보존 확인.

프롬프트:
> Use case: precise-object-edit. Image 1 is the edit target: a vertical fantasy weapon card for a wiki. Remove only the lower-left Lv 50 text, bottom rarity stars, and lower-right padlock with its dark square background. Fill these small regions with surrounding gold-brown background. Keep the red and silver pistol, black curved grip, scope, markings, weapon design, colors, position, proportions, lighting, backdrop and all four frame edges unchanged. Do not redesign, rotate, sharpen globally or add anything. Output one complete vertical card preserving original aspect ratio.

## 검증
어두운 배경의 이미지 모음으로 외곽·타일 확인. 목록/상세 UI를 로컬 미리보기로 확인.
프론트 빌드 성공. 커밋·푸시·배포는 별도 요청 시 진행.
클래스 선택·발현·아티팩트·무기 펼침 화면 확인. 표시 이미지42개 중 깨진 이미지0개.
