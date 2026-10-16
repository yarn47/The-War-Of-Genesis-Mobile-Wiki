# 디아블로 자료 및 이미지

사용자 제공 게임 화면 8715~8797을 기준으로 등록. 출시일은 사용자 지시대로 사라 랜드그리드의 2024-02-20에서 14일 뒤인 2024-03-05, 출현작은 창세기전2.

## 재사용

- 위치·다크메이지: priest_mage_line.json
- 네크로맨서·리치: sangir.json. 기존 네크로맨서의 부모 워록은 유지하고 캐릭터 화면의 부모 보정으로 디아블로의 위치에 연결.
- 간이 보호 부적·깜빡이는 보주: beradin.json. 세 번째 아티팩트는 사용자가 깜빡이는 보주로 확인.
- 혼란: 기존 공통 디버프.

## 원본 크롭

모든 원본은 1280×810. 경로는 public/icons 기준. 무기 외에는 AI 생성/재도색 없음.

| 출력 | 사진 | 좌표 | 크기 |
| --- | --- | --- | --- |
| characters/diablo_thumb.png | 8715 | (300,145,660,625) | 420×560 |
| characters/diablo_portrait.png | 8715 | (300,145,660,625) | 600×800 |
| passives/harsh_night_mission.png | 8729 | (763,548,849,634) | 원본 |
| ultimates/trinity_destroyer.png | 8729 | (1069,436,1156,523) | 원본 |
| classes/emblem/hell_invoker.png | 8757 | (415,461,505,551) | 146×146 원형 |
| classes/emblem/nightmare.png | 8757 | (615,461,705,551) | 146×146 원형 |
| classes/passive/hell_invoker.png | 8759 | (897,230,969,302) | 원본 |
| classes/passive/nightmare.png | 8769 | (897,230,969,302) | 원본 |
| skills/exhaust_spirit.png | 8759 | (977,230,1049,302) | 원본 |
| skills/phantom_walk.png | 8769 | (977,230,1049,302) | 원본 |
| artifacts/overflowing_insight.png | 8749 | (698,96,796,200) | 144×154 외곽 마스크 |
| weapons/moon_ruler.png | 8771 | (954,186,1166,500) | 전체 세로 카드, 아래 보정 |

아티팩트는 image-cropping-guide.md의 외곽 다각형을 적용하고 내부 음영을 보존했다. 초상화는 3D 전투 모델 대신 인물 정보 화면의 원화로 최종 교체했다.

## 무기 보정

내장 imagegen 사용. 원본 카드의 Lv·별·자물쇠 제거와 가려진 끝부분의 추정 복원만 요청. 원본과 결과를 비교해 프레임·무기 위치·방향을 확인했다.

생성 원본 파일명: exec-96059659-e1cd-4278-b3e2-a05ccf753558.png. 최종 파일은 public/icons/weapons/moon_ruler.png에 복사되어 임시 경로에 의존하지 않는다.

최종 프롬프트:

> Use case: precise-object-edit. Edit target: supplied game weapon card. Remove ONLY the Lv 50 text, bottom rarity stars, and lock icon including its dark rectangular background. Fill those small regions with matching brown-gold background; reconstruct only obscured staff tip if necessary. Preserve the exact staff design, angle, position, proportions, gold colors, glowing background and full rectangular gold frame with all four corners. No redesign, rotation, crop, extra objects or text. Return one portrait card with entire frame visible.

## 중요 수치 및 출처

- 고유 패시브 각성3~6: 8721/8723/8725/8727. 발현2/4/6: 8733/8735/8737 및 하단 전체 8797.
- 필살기 기본35/45/55%, 발현1 40/50/60%, 발현3 45/55/65%, 발현5 50/60/70%: 8731/8739/8741/8743.
- 헬인보커: 8759/8761/8763. 나이트메어: 8765/8767/8769.
- 넘치는 통찰 5/6/8/10% 및 소모 TP 절반 내림 회수: 8749~8755.
- 무기 1~6성: 8771~8795. 영혼 폭발은 1~2성 주변 1칸, 3~4성 주변 1바퀴, 5~6성 주변 2칸이라는 원문 차이를 보존. 내파는 전 단계 주변 1칸.
- 전투 화면의 장착·레벨 적용 능력치는 캐릭터 기본 능력치로 입력하지 않음.

## 검증

- 데이터 테스트 72개, 데이터 SQL 변환(참조 경고 없음), 프런트 빌드 및 클래스 부모 보정 테스트 통과.
- DB를 변경하지 않는 임시 미리보기에서 프로필, 클래스 연결, 나이트메어 선택, 발현6, 넘치는 통찰 펼침, 무기 1~6성 표와 효과 펼침 확인.
- 원본 크롭 모음에서 아이콘 테두리·알파·P/A/U 표식·무기 프레임 확인.
- 커밋·푸시·실제 DB 반영·배포는 수행하지 않음.
