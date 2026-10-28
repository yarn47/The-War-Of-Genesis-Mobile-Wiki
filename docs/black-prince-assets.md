# 흑태자 이미지 등록 기록

- 출처: 사용자 제공 `흑태자.zip`, 2026-10-28 촬영 화면 46장.
- 원본은 로컬 `.local-reference/black_prince/`에 보존(커밋 제외).
- 프로필 184550에서 투구 초상화/썸네일 추출. 184741 클래스 트리, 184748/184759 클래스 스킬, 184634 패시브, 184655 필살기/아우터원 스킬에서 아이콘 추출.
- `public/icons/weapons/asura.png`: imagegen 스킬의 내장 이미지 도구로 184825 무기 카드에서 UI만 제거한 후 용량 조정. 원본 디자인과 금색 배경 유지. AI 정리본이며 게임 원본 데이터 추출본이 아님.
- 사용 프롬프트: “Remove only the bottom-left Lv 50 text and six stars, bottom-right padlock, and thin card edge. Reconstruct the tiny covered blade tip faithfully. Preserve the exact sword shape, dark jagged organic black-purple blade, orange-red cores, tilted orientation and golden radial background. No redesign, added ornaments or text. Return clean vertical weapon art.”
- 데이터 누락/추정 기록: API 저장소 `data/notes/black-prince-missing.md`.
- API 마이그레이션 018 적용 전에는 새 API를 배포하지 말 것. 이 작업에서는 커밋만 수행하고 푸시/배포하지 않음.
