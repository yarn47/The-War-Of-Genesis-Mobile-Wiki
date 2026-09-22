// 스킬 속성 배지 — 게임에서 스킬 이름 옆에 붙는 표시 (빙한 ✳ 등)
// 속성은 업데이트로 늘어날 수 있어서, 모르는 값이면 회색으로 그냥 이름만 보여준다.

const ELEMENTS: Record<string, { color: string; glyph: string }> = {
    빙한: { color: '#7DA6E8', glyph: '✳' },
    화염: { color: '#F87171', glyph: '✦' },
    전격: { color: '#FBBF24', glyph: '✧' },
}

const FALLBACK = { color: '#A8A29E', glyph: '✧' }

const ElementBadge = ({ element, size = 'sm' }: { element: string | null | undefined; size?: 'sm' | 'md' }) => {
    if (!element) return null
    const { color, glyph } = ELEMENTS[element] ?? FALLBACK
    const text = size === 'md' ? 'text-sm' : 'text-[11px]'
    return (
        <span
            className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 ${text}`}
            style={{ color, background: `${color}1f`, border: `1px solid ${color}59` }}
            title={`${element} 속성`}
        >
            <span aria-hidden>{glyph}</span>
            {element}
        </span>
    )
}

export default ElementBadge
