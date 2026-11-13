# 전쟁의 샤크바리 자료 기록

- 사용자 제공 샤크바리 압축파일의 게임 화면 49장을 기준으로 등록했다.
- 출시일: 알바티니(2025-04-29)에서 2주 뒤인 2025-05-13. 출현작: 창세기전2.
- 폭풍검의 발현 1·3·5단 피해는 130·140·150%. 사용자 지시에 따라 노발현은 120%로 계산했다.
- 단계별 효과가 다른 전투 열기·아머드 슈트·전쟁의 권능의 숫자 접미사는 데이터 참조용 단계 구분이며, 게임 원문의 이름에는 숫자가 없다.
- 파이터·글라디에이터와 아티팩트 최상의 상태·전사의 정수·피의 성배는 기존 공용 자료를 재사용했다.

## 이미지

초상화, 클래스 문양, 패시브와 스킬 아이콘은 원본 화면에서 잘랐다. 초상화와 목록 썸네일은 동일한 3:4 영역을 사용한다.

- `public/icons/characters/shakbari_portrait.png`
- `public/icons/characters/shakbari_thumb.png`
- `public/icons/weapons/creation_storm_sword.png`

전용무기 카드만 내장 이미지 편집 도구로 레벨·별·자물쇠 UI를 제거했다. 가려져 있던 작은 파란 무기 끝부분은 추정 복원이다. 원래 무기 디자인과 금색 테두리를 유지하도록 지시하고 결과를 확인했다.

사용 프롬프트:

> Use case: precise-object-edit. Edit target: provided game weapon card crop. Remove ONLY the bottom-left Lv 50 text and six rarity stars and the bottom-right lock and its dark square background. Fill those small areas from adjacent gold-brown card background, reconstructing only the tiny blue weapon tip obscured by the text as necessary. Keep the original weapon design, size, orientation, colors, position, all blue crystals, and the entire gold frame and corner decoration unchanged. Do not redesign or zoom or sharpen globally. Output one portrait card including all four original borders. Preserve original 325:482 aspect ratio as closely as possible. No added text.

## 검증

- API 데이터 테스트 238개, 프런트엔드 테스트 6개 통과.
- SQL 생성 및 프런트엔드 빌드 통과.
- 로컬 모의 API로 목록·상세·클래스·아티팩트·무기 화면 확인. 이미지 로딩 오류 및 브라우저 오류 없음.
- 좁은 모바일 상세 화면에서는 기존 고정 폭 초상화 옆의 긴 이름과 정보가 좁게 표시된다. 이번 자료 등록에서 공통 레이아웃은 변경하지 않았다.
- 커밋·푸시·실서비스 배포는 수행하지 않았다.
