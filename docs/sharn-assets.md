# 샤른호스트 이미지 기록

출시일 2024-06-25, 출현작 템페스트. 원본 41장은 로컬 .local-reference/sharn/에 보관(커밋 제외). 원본 번호와 데이터 판단은 API 저장소 data/notes/sharn.md 참조.

초상화와 아이콘 13개는 원본 크롭이며 AI 재작화하지 않았다. 무기 카드 1개만 내장 image_gen 편집으로 UI를 제거했다. 가려진 검 끝의 복원 부분은 추정이다.

## 원본 크롭

모든 좌표는 1280×810 원본의 (left, top, right, bottom)이다. 저장 경로는 public/icons/ 기준.

| 파일 | 사진 | 좌표 | 출력 |
| --- | --- | --- | --- |
| characters/sharn_thumb.png | 10641 | (335,150,725,670) | 420×560 |
| characters/sharn_portrait.png | 10641 | (320,140,740,700) | 600×800 |
| passives/princes_double_life.png | 10673 | (763,547,850,634) | 87×87 |
| ultimates/asura_pacheonmu.png | 10673 | (1068,435,1156,523) | 88×88 |
| classes/emblem/nightwalker.png | 10643 | (415,291,505,381) | 146×146 원형 알파 |
| classes/emblem/dark_prince.png | 10643 | (415,461,505,551) | 146×146 원형 알파 |
| classes/emblem/joker.png | 10643 | (615,461,705,551) | 146×146 원형 알파 |
| classes/passive/nightwalker.png | 10645 | (897,230,969,302) | 72×72 |
| skills/biyoung_tuhon.png | 10645 | (977,230,1049,302) | 72×72 |
| classes/passive/dark_prince.png | 10653 | (897,230,969,302) | 72×72 |
| skills/muguk_jingwangseom.png | 10653 | (977,230,1049,302) | 72×72 |
| classes/passive/joker.png | 10659 | (897,230,969,302) | 72×72 |
| skills/ingenious.png | 10659 | (977,230,1049,302) | 72×72 |
| weapons/stormbringer.png | 10689 | (954,186,1166,500), 이후 UI 제거 | 세로 카드 |

공용 파이터·소드맨·소드마스터 및 아티팩트 바람 걸음·필살의 의지·전사의 정수의 기존 이미지는 재사용했다.

## 무기 편집

내장 image_gen 도구 사용. 원본 카드 크롭 하나만 편집 대상으로 전달했다. 최종 저장: public/icons/weapons/stormbringer.png. 원본과 비교하여 칼의 방향·디자인·금색 프레임이 유지되고 레벨·별·자물쇠가 제거됐음을 확인했다.

최종 프롬프트:

> Use case: precise-object-edit
> Asset type: game wiki weapon card.
> Input image 1 is the edit target. Remove only the Lv50 text, bottom rarity stars, and lower-right padlock with its small square background. Fill those areas with the adjacent gold-brown background; reconstruct only the small sword tip portion hidden by the text following the original blade. Preserve sword design, proportions, exact position and orientation, blue hilt, colored pommel, colors, original rendering, gold frame and all corner ornaments. No redesign, rotation, zoom, global sharpening, extra text, or other objects. Output one opaque portrait image with all four edges of the card intact.

## 확인

원본 크롭 모음 검토, 상세 페이지 클래스 선택, 발현 6단, 아티팩트/무기 펼침 및 이미지 누락 없음 확인. API 123개 + 프론트 5개 테스트, SQL 생성, 프론트 빌드 통과. 원본·임시 검토 자료는 커밋 대상에 포함하지 않는다.
