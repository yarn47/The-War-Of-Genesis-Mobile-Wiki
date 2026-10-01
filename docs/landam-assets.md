# 랜담 켈빈스 이미지

원본 게임 스크린샷에서 초상화·아이콘을 크롭했다. 기존 클래스 6종과 팔랑크스 전술서·섬광연격 비전서 이미지는 재사용한다.

| 파일 (public/icons 아래) | 원본 | 좌표 | 결과 |
| --- | --- | --- | --- |
| characters/landam_portrait.png | 7452 | (320,153,710,673) | 600×800 |
| characters/landam_thumb.png | 7452 | (340,155,700,635) | 420×560 |
| passives/one_eyed_mercenary.png | 7450 | (141,570,202,631) | 61×61 |
| ultimates/gyoacham.png | 7502 | (1069,436,1155,522) | 86×86 |
| artifacts/thorn_lords_ring.png | 7482 | (698,96,796,200) | 외곽 알파, 144×154 |
| weapons/gae_bolg.png | 7514 | (955,187,1166,500) | 세로 카드, UI 제거 보정 |

아티팩트 외곽 마스크는 image-cropping-guide.md의 다각형을 사용하고 어두운 배경 위에서 확인했다. 초상화와 아이콘은 AI로 재생성하지 않았다.

## 무기 카드 보정

내장 imagegen 도구로 레벨·별·자물쇠만 제거했다. 가려졌던 창 자루 끝은 추정 복원이다. 생성 결과를 프로젝트의 public/icons/weapons/gae_bolg.png에 저장했다.

최종 프롬프트:

> Use case: precise-object-edit. Edit target: supplied game weapon card. Remove only the bottom-left Lv 50 text, the six bottom stars, and the bottom-right lock with its dark square. Fill those small areas with matching gold-brown background, conservatively reconstruct the small obscured shaft tip. Keep the spear design, red jewel, gold blade, black shaft, position, proportions, colors, background rays, gold border and corner decorations unchanged. No redesign, no new text, no overall sharpening. Return one portrait card including all four edges.
