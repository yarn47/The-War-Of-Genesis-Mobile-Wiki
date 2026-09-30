# 듀란 렘브란트 이미지 출처

사용자가 제공한 게임 스크린샷에서 기존 이미지 크롭 가이드에 따라 추출했다.

- 인물: 6387. portrait 600×800, thumb 420×560.
- 클래스 문장: 6435(디펜더·아머나이트), 6459(팔라딘), 6437(포트리스), 6479(센츄리온·크루세이더). 146×146 원형.
- 클래스 패시브: 6437, 6447, 6461, 6455, 6469, 6483. 72×72.
- 스킬: 6437(부동섬·진격섬·이충공파), 6447(도발의 외침), 6461(인챈트 소드), 6455(허공열파), 6469(공파진섬), 6483(썬 라이트). 72×72.
- 강철 수호자: 6385. 재기의 바람: 6407.
- 섬광연격 비전서와 최상의 상태는 기존 공통 이미지를 재사용한다.
- 문장 수정: 포트리스와 센츄리온의 동일한 문장은 6479의 빛나지 않는 포트리스 `(290,342,370,422)`를 사용한다. 크루세이더는 `(610,342,690,422)`로 외곽 테두리를 보존했다.
- 강철 수호자의 발현 트리 표시는 전용 배율 1.10과 오른쪽 1px 이동을 적용한다(기본 1.18, 왼쪽 1px 대비 축소·우측 이동).

## 무기 카드 정리

6421의 오른쪽 카드에서 크롭한 이미지를 builtin imagegen 편집 모드로 정리했다. 숫자·별·자물쇠만 제거하도록 요청했으며 글자에 가려졌던 검 끝의 작은 부분은 생성 복원이다. 최종 파일은 `public/icons/weapons/last_bastion.png`(329×488).

사용 프롬프트:

> Use case: precise-object-edit. Asset type: game wiki equipment card. Image 1 is the edit target. Remove ONLY the bottom-left Lv50 text and rarity stars, and the bottom-right padlock icon and its dark square. Fill removed areas with the matching golden-brown radiant background. Reconstruct only the tiny sword tip obscured by text, following the existing blade. Preserve the sword and shield design, exact blue/white/gold colors, placement, scale, proportions, lighting, background, and the entire gold rectangular frame with all four edges and corner decorations. No redesign, no rotation, no zoom, no added text or objects. Output a single clean portrait card with the original aspect ratio.
