# 카림 니디아 자료 및 이미지 기록

- 출현작: 창세기전2. 출시일: 사용자 지정 메이 노틸런 출시 2주 뒤, 2024-04-16.
- 원본: 8969~9055, 보충 9153/9155/9157. 원본은 1280×810이며 첨부 임시 경로는 영구 보관소가 아니다.
- 데이터: API 저장소 `data/{characters,classes,buffs,debuffs,artifacts,weapons}/karim_nidia.json`.
- 메이지·매지션·아크메이지·소서러 및 치밀한 준비는 기존 공용 데이터를 재사용한다.
- 화면의 Lv55 능력치는 캐릭터 기본 능력치로 사용하지 않았다.

## 단계별 확인

- 풍요의 특권: 각성 3~6, 발현 2/4/6. 코인 버스트/에테르 배리어/싸이클링/아케인은 수치별 효과명을 구분해 툴팁이 잘못 연결되지 않도록 했다. 괄호는 위키에서 변형을 구별하는 표기이며 게임 원문에 없는 레벨을 의미하지 않는다.
- 기존 비슈누의 아케인은 보존하고 카림의 변형은 별도 그룹으로 정의했다.
- 엘드 엠파이어: 기본/발현 1/3/5. 보호막 100/110/120/140%, 공격력·주문력 20/20/25/30%. 발현 후 피격 시 시전자 주문력 5/7.5/10%만큼 방어력 증가, 사용 직후 추가 공격 또는 스킬 사용.
- 상상의 벽: 주문력 대비 방어력 및 첫 피격 피해 감소 15/20/25/30%. 9153~9157로 후반 단계 확인.
- 폭풍의 심장: 썬더 스텝 1~4의 수치는 8/12/16/20%. 지속 2턴, 쿨타임 3턴.
- 전격 스킬의 느려짐 1은 사진에서 2턴이다. 기존 공용 느려짐 1(1턴)을 바꾸지 않고 `느려짐 1 (전격 주문)`으로 분리했다.
- 그라나다 석장: 1~6성 전체. 5성부터 코인 2개, 6성은 확정 획득. 체력 116/117/118/120/121/122, 주문력 381/384/388/392/395/399.

## 원본 크롭

경로는 `public/icons/` 기준이며 클래스·초상화·스킬·아티팩트는 AI 재생성 없이 원본을 자른 것이다.

| 경로 | 사진 | 좌표 | 출력 |
|---|---|---|---|
| characters/karim_nidia_thumb.png | 8971 | 340,165,700,645 | 420×560 |
| characters/karim_nidia_portrait.png | 8971 | 340,165,700,645 | 600×800 |
| classes/emblem/spark_mage.png | 9017 | 415,291,505,381 | 146×146 원형 |
| classes/emblem/storm_caller.png | 9017 | 615,461,705,551 | 146×146 원형 |
| classes/passive/spark_mage.png | 9019 | 897,230,969,302 | 72×72 |
| classes/passive/storm_caller.png | 9025 | 897,230,969,302 | 72×72 |
| skills/thunderer.png | 9019 | 977,230,1049,302 | 72×72 |
| skills/energy_storm.png | 9025 | 977,230,1049,302 | 72×72 |
| passives/privilege_of_abundance.png | 8995 | 763,548,849,634 | 86×86 |
| ultimates/eld_empire.png | 8995 | 1069,436,1156,523 | 87×87 |
| artifacts/heart_of_storm.png | 9009 | 698,96,796,200 | 144×154 외곽 알파 |
| artifacts/wall_of_imagination.png | 9007 | 698,96,796,200 | 144×154 외곽 알파 |
| weapons/granada_staff.png | 9031 | 954,186,1166,500 | 세로 카드 전체, 아래 보정 |

## 무기 카드 보정

내장 imagegen 사용. Lv50·별·자물쇠 제거 부분만 보정하며, 글자로 가려진 무기 끝부분은 추정 복원이다. 최종 파일은 `public/icons/weapons/granada_staff.png`에 저장했다.

사용 프롬프트:

> Use case: precise-object-edit. Edit target: supplied game weapon card. Remove ONLY Lv50 text, rarity stars at bottom, and padlock icon and its backing. Fill with adjacent gold-brown background, infer only staff tip hidden by text. Preserve exact staff design, blue jewel, gold ring and ornaments, position, angle, proportions, colors, all four gold frame edges and corners. No redesign, rotation, zoom or overall sharpening. Output one full portrait card without text or UI overlays.

## 검증 범위

원본 크롭 모음과 무기 보정 결과를 육안 확인. 실제 JSON을 읽는 임시 로컬 미리보기에서 클래스 전환, 발현 6단 선택, 아티팩트와 무기 단계 표시를 확인했다. 실제 데이터베이스와 운영 배포는 변경하지 않았다.
