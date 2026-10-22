# 캐서린 스펜서 이미지 기록

원본 39장은 로컬 .local-reference/katherine/에 보관(버전 관리 제외). 클래스·스킬·초상화는 원본 크롭이며 AI 재생성하지 않았다.

| 출력 (public/icons/ 기준) | 사진 | 크롭 좌표 |
| --- | --- | --- |
| characters/katherine_thumb.png | 10725 | (280,95,700,655), 420×560 |
| characters/katherine_portrait.png | 10725 | (265,90,715,690), 600×800 |
| passives/unyielding_spirit.png | 10749 | (763,547,850,634) |
| ultimates/plasma_slash.png | 10749 | (1068,435,1156,523) |
| classes/emblem/iron_maiden.png | 10787 | (415,291,505,381), 원형 146×146 |
| classes/emblem/dreadnought.png | 10787 | (615,461,705,551), 원형 146×146 |
| classes/passive/iron_maiden.png | 10789 | (897,230,969,302) |
| skills/thorn_barrier.png | 10789 | (977,230,1049,302) |
| classes/passive/dreadnought.png | 10795 | (897,230,969,302) |
| skills/swaejin_gongpa.png | 10795 | (977,230,1049,302) |
| artifacts/gladiators_resolve.png | 10765 | (698,96,796,200), 장식 외곽 알파 144×154 |
| weapons/warmaid_armada.png | 10773 | (954,186,1166,500), 아래 별도 보정 |

아티팩트 외곽은 image-cropping-guide.md의 98×104 다각형 마스크를 사용했다. 검토 모음에서 장식과 내부 음영을 확인했다.

## 무기 카드 보정

- 사용 방식: 내장 image_gen 편집 모드. CLI/API fallback 사용 안 함.
- 변경: Lv 50·별·자물쇠 제거. 가려진 검 끝 복원은 AI 추정이며 원본의 보이지 않는 부분을 확정한 자료가 아니다.
- 저장: public/icons/weapons/warmaid_armada.png.
- 최종 프롬프트:

> Use case: precise-object-edit. Input image: edit target, a game weapon card. Remove only the Lv 50 text at bottom left, the rarity stars along the bottom, and the lock icon and its dark square at bottom right. Fill those areas seamlessly with the surrounding gold-brown background, reconstructing only the small weapon tip hidden by the text. Preserve the sword's exact design, red jewels, gold details, color, size, angle, position, lighting, the entire gold rectangular frame and corner ornaments. No redesign, zoom, rotation, sharpening or new objects. Keep all four card edges visible. Output one opaque portrait card at the same aspect ratio.

로컬 상세 화면에서 클래스 엠블럼과 스킬, 필살기·패시브·아티팩트·무기 이미지 로딩을 확인했다. 자동 빌드와 데이터 경로 검증을 통과했다. 커밋·푸시·배포는 별도 요청 사항이다.
