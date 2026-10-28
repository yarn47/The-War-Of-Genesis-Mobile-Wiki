# 죠안 카트라이트 이미지

사용자 ZIP의 원본 JPG 38장은 커밋에서 제외되는 `.local-reference/joan/`에 보관한다.
원본 해상도 1972×1248. 아래 시간은 `Screenshot_20261027_HHMMSS`의 HHMMSS.

| 대상 | 시간 | 원본 크롭 (left, top, right, bottom) |
| --- | --- | --- |
| 상세 초상화 | 182129 | 390,110,1110,1070 → 600×800 |
| 목록 썸네일 | 182129 | 510,130,990,770 → 420×560 |
| 엄밀한 집행자 | 182240 | 1177,844,1308,975 |
| 임페리얼발키리 엠블럼 | 182305 | 639,449,779,589 |
| 로얄발키리 엠블럼 | 182305 | 639,707,779,847 |
| 시큐리티발키리 엠블럼 | 182305 | 947,707,1087,847 |
| 각 클래스 패시브 | 182314/182320/182327 | 1383,354,1494,465 |
| 파쇄혼/역돌/크랙 다운 | 182314/182320/182327 | 1506,354,1617,465 |
| 임페리얼 실피드 | 182340 | 1470,286,1798,772 |

엠블럼은 선택 광원이 없는 원본에서 원형 알파를 적용하여 146×146으로 변환했다. 스킬은 P/A/U 표식을 보존했다.
목록 썸네일은 자드와 얼굴 크기·눈높이를 비교해 원본에서 별도로 가까이 잘랐다.
발키리·비프로스트발키리·디바인발키리, 풍아열공참, 아티팩트 3종은 기존 이미지를 재사용한다.

무기 카드만 내장 이미지 편집 도구(imagegen)로 레벨·희귀도 별·자물쇠를 제거했다.
최종 파일은 `public/icons/weapons/imperial_sylphid.png`. 가려진 하단 무기 끝은 추정 복원이다. 나머지 새 이미지는 생성 이미지가 아닌 원본 크롭이다.

편집 프롬프트:

> Use case: precise-object-edit. Image 1 is the edit target: a vertical fantasy weapon card for a wiki. Remove only the lower-left Lv 50 text, bottom rarity stars, and lower-right padlock with its dark square background. Fill these small regions with surrounding gold-brown background, reconstruct only the tiny obscured lower weapon tip consistently. Keep weapon design, colors, position, proportions, red jewel, gold and silver details, lighting, backdrop and all four frame edges unchanged. Do not redesign, rotate, sharpen globally or add anything. Output one complete vertical card preserving original aspect ratio.
