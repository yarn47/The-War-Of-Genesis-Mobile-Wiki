# 코델리아 이미지 작업 기록

원본 사진 46장은 로컬의 `.local-reference/cordelia/`에 보존했다(버전 관리 제외).
무기 이외 이미지는 원본 크롭이며 새로 그리지 않았다. 좌표는 1280×810 원본 기준이다.

| 대상 | 사진 | 좌표 | 출력 |
| --- | --- | --- | --- |
| 썸네일 | 10547 | (305,145,695,665) | 420×560 |
| 상세 초상화 | 10547 | (290,140,710,700) | 600×800 |
| 천재적인 솜씨 | 10565 | (763,547,850,634) | 87×87 |
| 네이팜 블라썸 | 10565 | (1068,435,1156,523) | 88×88 |
| 메이드새퍼 엠블럼 | 10593 | (415,291,505,381) | 146×146 원형 |
| 플레처 엠블럼 | 10593 | (415,461,505,551) | 146×146 원형 |
| 마스터트래퍼 엠블럼 | 10593 | (615,461,705,551) | 146×146 원형 |
| 메이드새퍼 패시브/스킬 | 10595 | (897,230,969,302) / (977,230,1049,302) | 각각 72×72 |
| 플레처 패시브/스킬 | 10601 | 위와 동일 | 각각 72×72 |
| 마스터트래퍼 패시브/스킬 | 10607 | 위와 동일 | 각각 72×72 |
| 단조의 망치 | 10585 | (698,96,796,200) | 144×154 외곽 마스크 |
| 타라니스 슈터 | 10613 | (954,186,1166,500) | 세로 카드, 아래 보정 적용 |

클래스 선택 광원을 피했으며 원형 알파 마스크와 아티팩트 외곽 마스크는 image-cropping-guide.md 기준을 사용했다.
속성 과부하·질풍의 깃, 아처·막스맨·스나이퍼 이미지는 기존 자산 재사용.

## 무기 카드 보정

내장 imagegen 도구로 Lv50·별·자물쇠만 제거하도록 요청했다. 가려진 영역 복원은 추정이며, 디자인과 프레임은 원본과 비교했다.
최종 파일: `public/icons/weapons/taranis_shooter.png`. 생성 원본은 별도 보존했다.

사용 프롬프트:

```text
Use case: precise-object-edit
Asset type: game wiki weapon card
Input images: Image 1 is the edit target.
Primary request: Remove only the bottom-left Lv 50 text, bottom rarity stars, and bottom-right padlock with its dark square. Fill those small areas with the surrounding golden-brown background. Restore any tiny occluded weapon tip conservatively.
Constraints: Preserve the exact pink/white/cyan crossbow design, strings, angle, size, position, lighting, gold frame and corner ornaments. Keep all four card borders and the full vertical card. No redesign, rotation, zoom, sharpening, extra objects or text. Opaque background.
```

## 검증

- 신규 자산 15개를 검토용 모음 이미지로 확인했다.
- 로컬 상세 화면의 모든 이미지가 정상 로딩되며 신규 클래스 선택과 무기 펼침 표시를 확인했다.
- 프로덕션 빌드와 프론트 테스트 5개 통과.
- 캐릭터 데이터와 테스트는 별도 API 저장소의 cordelia.json/test_cordelia_data.py에서 관리한다.
- 각성 1단 무기 추가 능력치는 사용자 확인으로 공격력 +10%를 확정 반영했다.
