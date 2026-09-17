// ─── 각성/발현 단계 규칙 (관리자 입력 · 상세 페이지 공통) ────

// 고유 패시브: 각성 3/4/5/6 + 발현 2/4/6 (총 7개)
export const PASSIVE_LEVELS = [
    { type: 'awaken', step: 3, label: '각성 3' }, { type: 'awaken', step: 4, label: '각성 4' },
    { type: 'awaken', step: 5, label: '각성 5' }, { type: 'awaken', step: 6, label: '각성 6' },
    { type: 'manifest', step: 2, label: '발현 2' }, { type: 'manifest', step: 4, label: '발현 4' },
    { type: 'manifest', step: 6, label: '발현 6' },
]

// 필살기: 발현 0/1/3/5단
export const ULTIMATE_STEPS = [0, 1, 3, 5]

// 아티팩트: 발현 3/4/5/6단 (최대 4개)
export const ARTIFACT_STEPS = [3, 4, 5, 6]
export const MAX_ARTIFACTS = 4

export const PASSIVE_MANIFEST_STEPS = PASSIVE_LEVELS.filter(l => l.type === 'manifest').map(l => l.step)

// 발현 트리에 표시할 전체 단계
export const MANIFEST_STEPS = [...new Set([...ULTIMATE_STEPS, ...PASSIVE_MANIFEST_STEPS, ...ARTIFACT_STEPS])].sort((a, b) => a - b)
