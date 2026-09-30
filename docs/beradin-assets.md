# 베라딘 이미지 등록 기록

원본: 사용자 첨부 게임 스크린샷 6257~6383. 좌표는 원본 1280×810 기준 (left, top, right, bottom).
초상화·클래스·스킬·아티팩트는 원본 크롭 및 리사이즈만 사용. 기존 image-cropping-guide.md 규격 적용.

| 대상 | 원본 | 크롭 영역 | 출력 |
|---|---|---|---|
| 상세 초상화 | 6257 | 309,201,603,593 | 600×800 |
| 목록 썸네일 | 6257 | 312,201,594,577 | 420×560 |
| 메이지/매지션/위자드 엠블럼 | 6261 | 228,124,318,214 / 228,291,318,381 / 415,291,505,381 | 원형 146×146 |
| 프로스트/로얄 엠블럼 | 6261 | 228,460,318,550 / 415,460,505,550 | 원형 146×146 |
| 다크위자드 엠블럼 | 6265 | 614,460,704,550 | 원형 146×146 |
| 클래스 패시브 | 메이지6265, 매지션6277, 위자드6289, 프로스트6283, 로얄6295, 다크6261 | y230~302, x897~969 (메이지는817~889) | 72×72 |
| 플레임 볼/아이스 미사일/마나 블레이드 | 6265 | y230~302, x897/977/1137부터72픽셀 | 72×72 |
| 매직 스피어/문 라이트/일렉트릭 웨이브/프로즌 필러/트리플 | 6277/6283/6289/6295/6261 | 977,230,1049,302 | 72×72 |
| 파멸의 고리 | 6259 | 141,570,202,631 | 72×72 |
| 헥스 엘리멘탈 블래스트 | 6307 | 1072,438,1153,519 | 84×84 |
| 아티팩트 3종 | 6321/6323/6325 | 698,96,796,200 | 실루엣 마스크 144×154 |
| 음모의 콘스텔라 | 6327 | 954,186,1166,500 | 329×486 |

## 무기 카드 UI 제거

imagegen 스킬을 무기 카드의 Lv50·별·자물쇠 제거에만 사용했다. 금색 프레임과 스태프 디자인을 유지하도록 지정했고, UI에 가렸던 작은 스태프 끝부분은 생성 보완이다. 최종 결과를 329×486으로 맞췄다.

사용 프롬프트:

> Use case: precise-object-edit. Edit target: the provided fantasy staff equipment card. Remove ONLY the bottom-left Lv50 text, rarity stars at bottom, and bottom-right padlock icon with its dark square. Fill removed areas with matching golden brown radiant background; reconstruct only the tiny obscured staff tip faithfully. Preserve staff design, shape, position, purple/silver colors, lighting, entire golden rectangular frame and all four edges exactly. No new text, no redesign, no zoom or rotation. Output one clean portrait card, same aspect ratio. This is a game wiki asset; do not add decorations.

로컬 상세 화면에서 초상화, 클래스 전환, 아티팩트 펼침, 무기 카드와 주문력·마법 관통 표를 확인했다. 운영 배포는 하지 않았다.
