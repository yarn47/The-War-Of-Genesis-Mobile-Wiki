# 메리 팬드래건 이미지

원본 고유 47장은 커밋 제외 `.local-reference/marie/`에 보관. 공용 클래스 및 필살 대응 수호/생명의 맥동 이미지 재사용. 신규 이미지 15개.

| 이미지 | 원본 | 크롭 좌표 | 출력 |
| --- | --- | --- | --- |
| 썸네일 | 11307 | 345,143,675,583 | 420×560 |
| 초상화 | 11307 | 295,90,745,690 | 600×800 |
| 도미넌트/파이썬/쏜즈퀸 엠블럼 | 11351 | 중심460,336 / 460,506 / 660,506, 반경45 | 146×146 원형 |
| 각 클래스 패시브 | 11355/11361/11367 | 897,230,969,302 | 72×72 |
| 편인무/화사랑추/에로틱 스카 | 11355/11361/11367 | 977,230,1049,302 | 72×72 |
| 유린하는 여왕 | 11341 | 763,547,850,634 | 원본 타일 |
| 콜미퀸 | 11341 | 1068,435,1156,523 | 원본 타일 |
| 질투의 가시 | 11325 | 698,96,796,200 | 144×154 외곽 다각형 알파 |
| 르피네 블뢰 | 11371 | 954,186,1166,500 | 세로 카드 |

무기만 내장 imagegen으로 Lv/별/자물쇠 제거. 원본에 가려진 칼끝은 추정 복원. 결과 `public/icons/weapons/lepine_bleue.png`. 나머지는 원본 크롭이며 재생성하지 않았다.

편집 프롬프트: Use case: precise-object-edit. Image 1 is the edit target, a vertical game weapon card for a wiki. Remove ONLY the bottom-left Lv 50 text and rarity stars and the bottom-right padlock and its dark square. Inpaint those regions with the surrounding gold-brown background; reconstruct only the obscured blue blade tip following its visible direction. Preserve the exact blue rose rapier design, colors, proportions, position, lighting, background rays, gold border and all four corners. Do not redesign, rotate, zoom, sharpen globally, add text or extra objects. Output one complete vertical card matching the original aspect ratio.

검증: 크롭 모음 검토, 프론트 빌드 통과. 로컬 JSON 미리보기에서 목록→상세, 파이썬 선택, 고유 패시브 발현6단 선택, 질투의 가시/황홀한 유린 펼침, 무기 단계별 능력치 확인. 상세 이미지 40개 로드 성공, 깨진 이미지0개. 서버 DB에 반영하지 않았으며 실제 API 통합 검증은 별도.

템페스트 서커스단 진영 표시를 목록/상세/관리 화면에 추가. API의 016 마이그레이션·서버 재배포 후 데이터 동기화 필요.
