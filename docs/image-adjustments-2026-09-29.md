# 이미지 정리 기록 (2026-09-29)

## 적용 범위

- 한조·카슈타르: 목록 썸네일 및 상세 초상화 여백 조정.
- 칼스: 목록 얼굴 크기 소폭 축소. 이올린: 목록 얼굴 위치를 조금 위로 조정.
- 이루스: 초상화 하단 여백 소폭 축소, 고유 패시브의 밝은 모서리 배경 제거.
- 정적의 그림자·학살의 징표: 사각 배경을 장식 외곽선 기준으로 제거.
- 바람 걸음: 카슈타르 원본 툴팁에서 다시 크롭해 내부 투명 구멍 제거. 공용 이미지이므로 다른 사용 캐릭터에도 적용.
- 킬러·어쌔신·섀도우킬러·나이프마스터·섀도우마스터·스트라이커: 원형 알파 적용. 스트라이커는 카슈타르·이루스 공용.
- 흑영천훼·흑강검: 레벨·별·자물쇠 제거. 명왕검: 같은 보정 후 신규 이미지 연결.
- 번스타인: 검사 결과 수정 불필요, 기존 이미지 유지.

## 원본과 보정 방식

초상화·아이콘은 Pillow 크롭/외곽 마스크만 사용했다. 어두운 내부를 색상 기준으로 제거하지 않는다.
흑강검은 새 원본 6253.jpg의 `(954,186,1166,500)` 전체 카드 사용. 과거 작은 목록 카드 크롭은 채택하지 않았다.
명왕검은 이루스 원본 장비 화면에서 추출한 전체 카드, 흑영천훼는 기존 전체 카드 사용.
무기는 built-in imagegen으로 UI 오버레이를 보정하고 329×486 PNG로 저장했다.
글자·별에 가려진 칼끝 복원은 추정이며, 원본보다 실제 정보량이 늘어나는 것은 아니다.

최종 무기 경로:

- `public/icons/weapons/heugyeongcheonhwe.png`
- `public/icons/weapons/heukgangsword.png`
- `public/icons/weapons/myeongwang_sword.png`

## 사용한 보정 프롬프트

세 무기에 공통 적용한 제약이다. 무기별 색과 단검 두 자루/대검 한 자루를 명시했다.

> Use case: precise-object-edit. Clean this existing game weapon card: remove ONLY bottom-left Lv50 text, entire bottom rarity stars, bottom-right padlock and its dark square. Fill with matching golden radial backdrop and plausibly continue the blade tip under overlays. Preserve exact weapon design and colors, arrangement, angle and scale, full rectangular ornate border and all four card edges. Do not redesign, zoom, rotate, or sharpen. Output a full portrait card without text or UI overlays.

응보의 문장 데이터 검증·수정 근거는 API 저장소 `data/notes/irus-artifact-verification.md`에 별도 기록한다.
