# 에리카 마이어스 자료 및 이미지

- 출현작: 창세기전2. 출시일: 사용자 지정 간격에 따라 디아블로(2024-03-05)에서 2주 뒤인 2024-03-19.
- 원본: 사용자 첨부 8821~8905 사진. 영구 보관본이 아니므로 재작업 시 원본 보관 필요.
- API 자료: 각 characters/classes/buffs/weapons/artifacts 폴더의 erica_myers.json.
- 공통 아처·헌터·이글·보우마스터, 수면 저항·제압, 최상의 상태·질풍의 깃은 기존 자료 재사용.
- 초기 각성의 수면 1턴은 덫 설명에 직접 명시하여 공통 수면 2턴 자료를 변경하지 않음.
- 화면의 캐릭터 레벨 57 능력치는 기본 능력치로 등록하지 않음.

## 원본 크롭

결과는 public/icons 아래에 저장. 좌표는 (left, top, right, bottom).

| 파일 | 사진 | 좌표 | 출력 |
| --- | --- | --- | --- |
| characters/erica_myers_thumb.png | 8821 | (255,170,615,650) | 420×560 |
| characters/erica_myers_portrait.png | 8821 | (255,170,615,650) | 600×800 |
| classes/emblem/light_watcher.png | 8893 | (415,291,505,381) | 146×146 원형 |
| classes/emblem/purifier.png | 8893 | (615,461,705,551) | 146×146 원형 |
| classes/passive/light_watcher.png | 8895 | (897,230,969,302) | 72×72 |
| classes/passive/purifier.png | 8901 | (897,230,969,302) | 72×72 |
| skills/pungwonsa.png | 8895 | (977,230,1049,302) | 72×72 |
| skills/pasa_gwangtan.png | 8901 | (977,230,1049,302) | 72×72 |
| passives/silver_will.png | 8855 | (763,548,849,634) | 86×86 |
| ultimates/hoa_eungjo.png | 8855 | (1069,436,1156,523) | 87×87 |
| artifacts/resolute_bowstring.png | 8869 | (698,96,796,200) | 144×154 외곽 마스크 |
| weapons/oath_of_liberation.png | 8879 | (954,186,1166,500) | 세로 카드, 아래 보정 적용 |

## 무기 보정

imagegen 스킬의 내장 이미지 편집 도구 사용. 레벨·별·자물쇠만 제거하며 가려진 활 끝 복원은 추정이다. 무기와 카드 테두리를 원본과 시각 대조했다.

최종 저장: public/icons/weapons/oath_of_liberation.png

프롬프트:

> Use case: precise-object-edit. Edit target: supplied vertical game weapon card. Remove ONLY bottom-left Lv 50 text, bottom stars, and lower-right padlock and its dark square. Reconstruct those small areas with matching gold-brown background and infer only the tiny covered bow tip. Preserve the exact bow design, silver/gold/teal colors, position, proportions, orientation, background rays, entire gold border and corner ornaments. No rotation, zoom, redesign, sharpening, or new text. Output one vertical full card with all four edges.

## 검증

- API 데이터 테스트 76개 통과, SQL 생성 검증 통과. SQL은 실행하지 않음.
- 프런트 빌드 통과. 클래스 트리 회귀 테스트 통과.
- 이미지 12종 모음에서 초상화·원형 알파·P/A/U 표식·아티팩트 외곽·무기 전체 카드 확인.
- 로컬 임시 응답 서버로 프로필, 퓨리파이어 선택, 고유 패시브 발현 6단, 결단의 시위 확장, 무기 능력치와 전용효과 확장 확인.
- 임시 응답은 실제 DB가 아니며 관련 효과 팝업의 실서버 연결까지 검증한 것은 아님.
- 커밋·푸시·배포 및 실제 DB 변경 없음.
