# 크로우 자료 기록

- 사용자 제공 게임 스크린샷 8364~8446 기준으로 캐릭터, 발현, 바리사다, 서약의 팬던트, 블레이더/블레이드마스터 및 상태 효과를 등록했다.
- 출시일 2024-01-23, 출현작 창세기전2는 사용자 제공 정보다.
- 캐릭터 이미지는 8364, 패시브/초필살기 아이콘은 8382, 클래스 문장은 8434, 클래스 스킬은 8436~8446에서 원본을 잘라 사용했다.
- 서약의 팬던트 아이콘은 8398에서 잘라 배경을 제거했다. 아티팩트의 금색 별 1~4개는 기존 데이터 규칙에 따라 단계 3~6에 대응한다.
- 바리사다는 8406의 무기 카드를 잘라 내장 이미지 생성 편집 모드로 Lv 50, 별, 잠금 표시를 제거했다. 가려진 칼끝만 복원하고 테두리를 유지했다. 결과: `public/icons/weapons/barisada.png`.
- 무기 편집 프롬프트: “Remove ONLY Lv50, bottom rarity stars, and bottom-right lock including black square. Inpaint matching golden brown background. Reconstruct only blade tip hidden by text/stars from visible blade. Preserve sword design, ornate guard, size, position, angle, colors, glow, entire rectangular ornate border. No redesign, no additional detail, no text, no cropping.”
- 설화난영참 130%/50%는 8384 및 발현 1 완료 화면 8386에 표시된 수치다. 별도의 발현 전 수치 화면은 없으며 기본 표시에도 이 수치를 사용했다.
- 장비가 적용된 캐릭터 능력치는 기본 능력치로 옮기지 않았다. 화면의 이너브레이크 분류는 현재 데이터 구조에 별도 필드가 없어 추가하지 않았다.
- 검증 범위: 프런트엔드 빌드, API SQL 생성, 이미지 경로 및 데이터 참조 확인. 푸시와 배포는 별도 작업이다.
