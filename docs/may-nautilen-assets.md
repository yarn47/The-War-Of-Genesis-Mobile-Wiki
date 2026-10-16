# 메이 노틸런 자료 및 이미지

- 출현작: 사용자 지정 그대로 창세기전.
- 출시일: 에리카 마이어스(2024-03-19)에서 2주 뒤, 2024-04-02.
- 원본: 사용자 첨부 8907~8967. 임시 첨부이므로 재작업을 위해 원본 별도 보관 필요.
- API: characters/classes/buffs/weapons 폴더의 may_nautilen.json.
- 공통 클래스 발키리·비프로스트발키리·디바인발키리·스카우트 재사용.
- 아티팩트 칼날 피뢰침·우아한 호흡·최상의 상태 및 제압·도발·통제 영역·사기 저하 재사용.
- 공통 스카우트의 정식 부모 레인저는 변경하지 않음. 기존 표시용 부모 보정으로 메이 트리에서는 발키리에 연결.
- 캐릭터 Lv59 능력치는 기본 능력치로 등록하지 않음.
- 패시브 각성에만 인접 아군 부재 조건 적용. 발현 6단의 설국의 귀감 3은 공격 후 TP 1 회복.
- 셀레스티얼 전용·일반 회복 횟수는 각성 1~4단 턴당 1회, 5~6단 턴당 2회.

## 원본 크롭

결과 경로는 public/icons/ 아래. 좌표는 (left, top, right, bottom).

| 파일 | 사진 | 좌표 | 결과 |
| --- | --- | --- | --- |
| characters/may_nautilen_thumb.png | 8909 | (340,85,700,565) | 420×560 |
| characters/may_nautilen_portrait.png | 8909 | (340,85,700,565) | 600×800 |
| classes/emblem/decurion_valkyrie.png | 8941 | (415,461,505,551) | 146×146 원형 |
| classes/emblem/vanguard.png | 8941 | (615,461,705,551) | 146×146 원형 |
| classes/passive/decurion_valkyrie.png | 8943 | (897,230,969,302) | 72×72 |
| classes/passive/vanguard.png | 8949 | (897,230,969,302) | 72×72 |
| skills/jilpung_gonga.png | 8943 | (977,230,1049,302) | 72×72 |
| skills/yeona_seonpung.png | 8949 | (977,230,1049,302) | 72×72 |
| passives/snowland_exemplar.png | 8911 | (763,548,849,634) | 86×86 |
| ultimates/seolwol_hwageukhon.png | 8911 | (1069,436,1156,523) | 87×87 |
| weapons/celestial.png | 8955 | (954,186,1166,500) | 세로 카드, 아래 보정 |

## 무기 보정

imagegen 스킬의 내장 이미지 편집 도구 사용. 레벨·별·자물쇠만 제거. 가려진 검 끝은 추정 복원이며 원본 디자인·배치·색과 프레임을 비교했다.

최종 저장: public/icons/weapons/celestial.png

프롬프트:

> Use case: precise-object-edit. Edit target: supplied vertical game weapon card. Remove ONLY bottom-left Lv 50 text, bottom stars, and lower-right padlock and its dark square. Reconstruct those small areas with matching gold-brown background and infer only the tiny covered teal sword tip. Preserve the exact sword design, copper/gold/teal colors, position, proportions, orientation, background rays, entire gold border and corner ornaments. No rotation, zoom, redesign, sharpening, or new text. Output one vertical full card with all four edges.

## 검증

- API 테스트 80개, 프런트 테스트 5개 통과.
- SQL 생성 검증 및 프런트 빌드 통과. SQL 실행 없음.
- 신규 이미지 11종 경로 및 검토용 모음 확인.
- DB를 변경하지 않는 임시 응답으로 프로필, 데큐리온발키리·뱅가드 선택, 고유 패시브 발현 6단, 우아한 호흡 확장, 셀레스티얼 능력치와 전용 효과 확장 확인.
- 실제 DB 응답 및 관련 효과 팝업 연결은 미검증.
- 커밋·푸시·배포하지 않음.
