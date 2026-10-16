# 낭천 자료 기록

- 사용자 제공 스크린샷 8489~8580 기준. 출시일은 크로우 +14일인 2024-02-06, 출현작은 창세기전2.
- 프로필 8489, 패시브 8493~8515 및 8574, 아티팩트 8517~8521 및 8576~8580, 초필살기 8525~8531, 클래스 8533~8545, 무기 8547~8571.
- 기존 파이터·소드맨·소드마스터·하이마스터, 전사의 정수·응보의 문장을 재사용한다.
- 공용 ‘선제 공격’은 2턴으로 정의되어 있어 낭천의 해제 불가 효과와 다르다. 공용 데이터를 바꾸지 않고 낭천 패시브 본문에 효과를 명시했다.
- 극성/승부 영구 표시는 확인되는 5~7레벨만 입력했다. 1~4레벨 지속 시간을 추정하지 않았다.
- 장비 적용 캐릭터 능력치와 별도 필드가 없는 이너브레이크 분류는 추가하지 않았다.

## 이미지

- 초상화/썸네일: 8489의 (350,192,680,632), 600×800/420×560.
- 패시브/초필살기: 8523의 (763,548,849,634)/(1069,436,1156,523).
- 무사/무신 문장: 8533의 (415,291,505,381)/(615,461,705,551), 원형 마스크 146×146.
- 클래스 패시브: 8535/8541의 (897,230,969,302). 스킬: 8537/8543의 (977,230,1049,302).
- 연쇄의 문장: 8576의 (698,96,796,200), 장식 외곽 마스크 144×154.
- 유성검: 8547의 (954,186,1166,500), 내장 이미지 편집 도구 사용. 가려진 칼끝 복원은 추정이며 AI 편집에 따른 세부 차이가 있을 수 있다.
- 최종 파일: `public/icons/weapons/yuseonggeom.png`.

### 무기 편집 프롬프트

Use case: precise-object-edit. Edit target: supplied game weapon card. Remove ONLY Lv50 text, bottom rarity stars, and lower-right lock with its square background. Inpaint those tiny areas with matching golden brown background. Reconstruct only sword tip hidden by text and stars, following visible blade. Preserve exact sword design, guard, pommel, angle, position, proportions, colors, glow, and complete rectangular ornamental frame. No redesign, no extra ornaments, no cropping, no text. Output one complete portrait card.

## 검증 범위

이미지 모음 검토, 이미지 참조 12개 존재 확인, JSON 6개 파싱, SQL 생성 경고 검사, 프런트 빌드 및 diff 검사. 운영 DB 반영·푸시·배포는 하지 않음. 실제 DB 연결 화면 검증은 별도 필요.
