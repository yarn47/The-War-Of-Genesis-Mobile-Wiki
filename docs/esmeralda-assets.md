# 에스메랄다 이미지

원본 고유 40장을 커밋 제외 `.local-reference/esmeralda/`에 보관했다. 기존 공용 클래스 및 아티팩트 이미지는 재사용한다.

| 이미지 | 원본 | 크롭 좌표 | 출력 |
| --- | --- | --- | --- |
| 썸네일 | 11189 | 345,125,705,605 | 420×560 |
| 초상화 | 11189 | 325,105,730,645 | 600×800 |
| 자비의 성녀 | 11207 | 763,547,850,634 | 원본 타일 |
| 아비도스의 비상 | 11207 | 1068,435,1156,523 | 원본 타일 |
| 힐러/미니스터/하이기니스트 엠블럼 | 11225 | 중심460,336 / 460,506 / 660,506, 반경45 | 146×146 원형 |
| 각 클래스 패시브 | 11229/11235/11241 | 897,230,969,302 | 72×72 |
| 리커버리/세컨드 윈드/스테럴라이즈 | 11229/11235/11241 | 977,230,1049,302 | 72×72 |
| 리베라 프리토리아 | 11247 | 954,186,1166,500 | 세로 카드 |

무기만 내장 imagegen으로 UI 제거. 나머지는 Pillow 원본 크롭. 무기 출력은 `public/icons/weapons/libera_pretoria.png`. 글자에 가린 끝부분은 추정 복원이다.

검증: 데이터 테스트 147개, SQL 생성, 프론트 빌드 통과. 로컬 목록→상세 진입, 하이기니스트 선택, 무기 단계표 표시 확인. 상세의 이미지40개 로드 성공, 깨진 이미지0개. 발현 선택 및 아티팩트/무기 펼침은 자동 클릭 후 상태 변화가 관측되지 않아 동작 검증 미완료(데이터 단계값은 테스트로 확인).

편집 프롬프트: Use case: precise-object-edit. Input image is the edit target, a vertical game weapon card. Remove ONLY bottom-left Lv50 text and gold rarity stars, bottom-right lock and its square backing. Fill those small areas with matching golden-brown background, reconstruct only the tiny covered rod tip by inference. Preserve the purple rod, silver wing ornaments, purple jewel, blue star, their geometry, placement, scale, colours and original rendering exactly. Preserve all four sides of gold frame and corner ornaments. No redesign, rotation, global enhancement, additional text or decorations. Output one vertical card with the same aspect ratio.
