# 클라우제비츠 이미지

원본: 사용자 제공 두 ZIP의 JPG 총 45장. 재작업용 원본은 커밋에서 제외되는 `.local-reference/clausewitz/`에 보관.
원본 해상도 1972×1248, 아래 시간은 Screenshot_20261027_HHMMSS 파일의 HHMMSS.

| 대상 | 시간 | 원본 크롭 (left, top, right, bottom) |
| --- | --- | --- |
| 상세 초상화 | 180241 | 475,100,1195,1060 → 600×800 |
| 목록 썸네일 | 180241 | 575,100,1175,900 → 420×560 |
| 천재 전략가 | 180348 | 1177,844,1308,975 |
| 썬더메어의 낙뢰 | 180348 | 1648,672,1779,803 |
| 택티션 엠블럼 | 183312 | 639,449,779,589 |
| 윈드윌더 엠블럼 | 183312 | 639,707,779,847 |
| 스키머 엠블럼 | 183312 | 947,707,1087,847 |
| 각 클래스 패시브 | 183315/183329/183342 | 1383,354,1494,465 |
| 드래건 스트라이크/서먼 지니/플레인시프트 | 183315/183329/183342 | 1506,354,1617,465 |
| 썬더메어의 편린 | 180414 | 1470,286,1798,772 |

엠블럼은 선택 효과 없는 사진에서 원형 알파를 적용하고 146×146으로 변환. 패시브·액티브·필살기는 원본 P/A/U 표식을 보존. 아티팩트 3종은 기존 아이콘 재사용.

무기만 내장 이미지 편집 도구(imagegen)를 사용. 결과는 `public/icons/weapons/thundermair_fragment.png`. 레벨·별에 가렸던 하단 끝부분은 추정 복원이며 나머지 자산은 생성 이미지가 아님.

편집 프롬프트:

> Use case: precise-object-edit. Image 1 is the edit target: a vertical fantasy weapon card for a wiki. Remove only the lower-left Lv 50 text, bottom rarity stars, and lower-right padlock with its dark square background. Fill these small regions with surrounding gold-brown background, reconstruct only the tiny obscured lower weapon tip consistently. Keep weapon design, colors, position, proportions, turquoise blades, gold details, lighting, backdrop and all four frame edges unchanged. Do not redesign, rotate, sharpen globally or add anything. Output one complete vertical card preserving original aspect ratio.
