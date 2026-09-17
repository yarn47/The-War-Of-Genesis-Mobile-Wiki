// ─── 효과 텍스트 태그 렌더러 ───────────────────────────────
// "[150%]{red} 물리 피해. [아찔한 회피]{green} 획득" → 색 입힌 글자
//   red    수치 (피해량, %)
//   yellow 턴, 쿨타임, TP, 중첩
//   green  버프 이름
//   orange 디버프 이름
//   blue / purple  용도 미정

const TEXT_TAG_COLORS: Record<string, string> = {
    red: '#F87171',
    yellow: '#FACC15',
    green: '#4ADE80',
    orange: '#FB923C',
    blue: '#60A5FA',
    purple: '#C084FC',
}

// 백엔드 TextTagUtil과 같은 패턴
const TAG_PATTERN = /\[([^\]]+)\]\{(\w+)\}/g

const EffectText = ({ text, className }: { text: string | null | undefined; className?: string }) => {
    if (!text) return null

    const parts: React.ReactNode[] = []
    let last = 0
    for (const match of text.matchAll(TAG_PATTERN)) {
        const [whole, label, color] = match
        const start = match.index
        if (start > last) parts.push(text.slice(last, start))
        const hex = TEXT_TAG_COLORS[color]
        parts.push(hex
            ? <span key={start} className="font-semibold" style={{ color: hex }}>{label}</span>
            : label)
        last = start + whole.length
    }
    if (last < text.length) parts.push(text.slice(last))

    return <span className={className}>{parts}</span>
}

export default EffectText
