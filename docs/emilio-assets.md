# 에밀리오 이미지 출처

사용자 ZIP 43장을 `.local-reference/emilio/`에 보관(Git 제외). 좌표는 1972×1248 원본 기준 (left, top, right, bottom).

| 이미지 | 원본 시각 | 영역 |
| --- | --- | --- |
| emilio_thumb | 174519 | 480,100,1155,1000 |
| emilio_portrait | 174519 | 420,90,1170,1090 |
| qi_swordsman 엠블럼 | 174642 | 638,448,778,588 |
| sword_immortal 엠블럼 | 174642 | 638,705,778,845 |
| argen_sentinel 엠블럼 | 174642 | 946,705,1086,845 |
| qi_swordsman 패시브 / falling_sword | 174645 | 1382,353,1494,466 / 1505,353,1617,466 |
| sword_immortal 패시브 / moonlit_trace | 174654 | 위와 동일 |
| argen_sentinel 패시브 / division_control | 174700 | 위와 동일 |
| mysterious_keeper | 174621 | 1176,844,1309,977 |
| moonlight_slash | 174621 | 1647,669,1780,803 |
| time_dagger | 174605 | 1080,152,1225,307 |
| moonlight_sword | 174713 | 1470,285,1796,771 |

인물은 머리 위 여백을 유지하고, 클래스 엠블럼은 원형 투명 처리했다. 무기만 내장 imagegen으로 레벨·별·잠금 표시를 정리했다. 결과: `public/icons/weapons/moonlight_sword.png`.

## 무기 정리 프롬프트

Use case: precise-object-edit. Edit target: supplied vertical fantasy sword card. Remove only lower-left Lv 50 text, bottom rarity stars, lower-right padlock and its dark backing. Reconstruct the small occluded sword-tip region naturally and fill other removed UI regions with matching golden brown background. Preserve the blue silver sword, curled ornate crossguard, engraved blade, exact pose, proportions, placement, lighting, golden backdrop, and all four border edges. No redesign or additions. Output complete vertical card in original aspect ratio.
