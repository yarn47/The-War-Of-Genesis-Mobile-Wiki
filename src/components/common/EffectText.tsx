import { useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useEffectEntry, useEffectUsers, PERMANENT_DURATION } from './EffectDict'
import type { EffectEntry } from './EffectDict'
import { getTagColorClass } from '../../constants/tagColors'

// ─── 효과 텍스트 태그 렌더러 ───────────────────────────────
// "[150%]{red} 물리 피해. [아찔한 회피]{green} 획득" → 색 입힌 글자
//   red    수치 (피해량, %)
//   yellow 턴, 쿨타임, TP, 중첩
//   green  버프 이름
//   orange 디버프 이름
//   blue / purple  용도 미정
// green/orange 는 버프/디버프 사전에 있으면 호버·클릭 시 툴팁을 띄운다.

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

const TOOLTIP_WIDTH = 300

const durationLabel = (duration: number | null) =>
    duration == null ? null : duration === PERMANENT_DURATION ? '영구' : `${duration}턴`

// ─── 툴팁 카드 ─────────────────────────────────────────────

const EffectTooltip = ({ entry, anchor }: { entry: EffectEntry; anchor: DOMRect }) => {
    const isBuff = entry.kind === 'buff'
    const accent = isBuff ? '#4ADE80' : '#FB923C'
    const users = useEffectUsers(entry.name)

    const half = TOOLTIP_WIDTH / 2
    const left = Math.min(Math.max(anchor.left + anchor.width / 2, half + 8), window.innerWidth - half - 8)
    const above = anchor.top > 220
    const top = above ? anchor.top - 8 : anchor.bottom + 8
    const duration = durationLabel(entry.duration)

    return createPortal(
        <div
            className="pointer-events-none fixed z-50 rounded-lg p-3 shadow-2xl"
            style={{
                width: TOOLTIP_WIDTH,
                left,
                top,
                transform: `translate(-50%, ${above ? '-100%' : '0'})`,
                background: 'rgba(12,10,9,0.97)',
                border: `1px solid ${accent}59`,
                boxShadow: `0 0 24px ${accent}26`,
            }}
        >
            <div className="mb-1.5 flex items-center gap-2">
                {entry.iconUrl && <img src={entry.iconUrl} alt="" className="h-7 w-7 rounded" />}
                <span className="text-sm font-semibold" style={{ color: accent }}>
                    {entry.name}{entry.level != null ? ` ${entry.level}` : ''}
                </span>
                <span className="ml-auto text-[11px] text-stone-500">{isBuff ? '버프' : '디버프'}</span>
            </div>

            {(duration || entry.maxStack != null) && (
                <div className="mb-1.5 flex gap-3 text-[11px] text-stone-500">
                    {duration && <span>지속 <span className="text-stone-300">{duration}</span></span>}
                    {entry.maxStack != null && <span>최대 중첩 <span className="text-stone-300">{entry.maxStack}</span></span>}
                </div>
            )}

            {entry.tags.length > 0 && (
                <div className="mb-1.5 flex flex-wrap gap-1">
                    {entry.tags.map(tag => (
                        <span key={tag.tagId} className={`rounded px-1.5 py-0.5 text-[11px] ${getTagColorClass(tag.color)}`}>{tag.name}</span>
                    ))}
                </div>
            )}

            {entry.effectText
                ? <EffectText text={entry.effectText} className="block text-xs leading-relaxed text-stone-300" nested />
                : <span className="text-xs text-stone-600">설명 없음</span>}

            {users.length > 0 && (
                <div className="mt-2 flex items-center gap-2 border-t border-stone-800 pt-2">
                    <span className="text-[11px] text-stone-500">사용자</span>
                    {users.map(user => (
                        <span key={user.name} className="flex items-center gap-1 text-[11px] text-stone-300">
                            {user.thumbnailUrl && <img src={user.thumbnailUrl} alt="" className="h-6 w-6 rounded-full object-cover" />}
                            {user.name}
                        </span>
                    ))}
                </div>
            )}
        </div>,
        document.body
    )
}

// ─── 버프/디버프 이름 태그 ──────────────────────────────────

const EffectTag = ({ label, hex }: { label: string; hex: string }) => {
    const entry = useEffectEntry(label)
    const ref = useRef<HTMLSpanElement>(null)
    const [anchor, setAnchor] = useState<DOMRect | null>(null)

    if (!entry) return <span className="font-semibold" style={{ color: hex }}>{label}</span>

    return (
        <>
            <span
                ref={ref}
                onMouseEnter={() => setAnchor(ref.current?.getBoundingClientRect() ?? null)}
                onMouseLeave={() => setAnchor(null)}
                className="cursor-help font-semibold underline decoration-dotted underline-offset-2"
                style={{ color: hex }}
            >
                {label}
            </span>
            {anchor && <EffectTooltip entry={entry} anchor={anchor} />}
        </>
    )
}

// ─── 본체 ──────────────────────────────────────────────────

const EffectText = ({ text, className, nested }: { text: string | null | undefined; className?: string; nested?: boolean }) => {
    if (!text) return null

    const parts: React.ReactNode[] = []
    let last = 0
    for (const match of text.matchAll(TAG_PATTERN)) {
        const [whole, label, color] = match
        const start = match.index
        if (start > last) parts.push(text.slice(last, start))
        const hex = TEXT_TAG_COLORS[color]
        if (!hex) parts.push(label)
        else if (!nested && (color === 'green' || color === 'orange'))
            parts.push(<EffectTag key={start} label={label} hex={hex} />)
        else
            parts.push(<span key={start} className="font-semibold" style={{ color: hex }}>{label}</span>)
        last = start + whole.length
    }
    if (last < text.length) parts.push(text.slice(last))

    return <span className={className}>{parts}</span>
}

export default EffectText
