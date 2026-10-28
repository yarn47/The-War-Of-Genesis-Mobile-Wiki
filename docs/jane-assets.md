# 제인 쇼어 이미지 출처

사용자 제공 제인쇼어 ZIP 49장 및 추가 화면 11769/11771/11773에서 추출했다. 원본은 Git 제외 `.local-reference/jane/`에 보관한다.

좌표는 원본 기준 (left, top, right, bottom).

| 이미지 | 원본 화면 | 영역 |
| --- | --- | --- |
| jane_thumb | 163730 | 475,100,1075,900 |
| jane_portrait | 163730 | 400,95,1150,1095 |
| agent 엠블럼 | 163934 | 638,448,778,588 |
| specialist 엠블럼 | 163934 | 638,705,778,845 |
| widowmaker 엠블럼 | 163934 | 946,705,1086,845 |
| agent 패시브 | 163941 | 1382,353,1494,466 |
| widowmaker 패시브 | 163950 | 1382,353,1494,466 |
| tactical_maneuver | 163944 | 1505,353,1617,466 |
| ascending_kiss | 163950 | 1505,353,1617,466 |
| deadly_whisper | 163838 | 1176,844,1309,977 |
| reapers_bullet | 163838 | 1647,669,1780,803 |
| chaos_fragment | 164003 | 920,576,1065,732 |
| specters_nightmare | 164003 | 1470,285,1796,771 |
| specialist 패시브 | 11769 | 897,230,969,303 |
| load_tactical_rounds | 11769 | 977,230,1049,303 |

인물은 머리 위 여백을 유지했다. 엠블럼은 원형 투명 처리했다. 무기 카드만 imagegen으로 레벨·별·잠금 UI를 제거했다. 결과는 `public/icons/weapons/specters_nightmare.png`에 저장했다.

## 무기 정리 프롬프트

Use case: precise-object-edit. Input image is edit target, a vertical fantasy weapon card. Remove only lower-left Lv 50 text, bottom rarity stars, lower-right padlock and its dark backing. Fill those small regions with surrounding golden brown background. Preserve the red and black pistol, its spiked silhouette, red markings, original pose, proportions, placement, lighting, backdrop, and all four border edges exactly. Do not redesign or add anything. Output the complete vertical card in original aspect ratio.

운영 배포·푸시는 수행하지 않았다.
