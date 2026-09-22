import { useEffect, useRef, useState } from 'react'
import ElementBadge from './ElementBadge'
import { createPortal } from 'react-dom'
import { useEffectEntry, useEffectUsers, PERMANENT_DURATION } from './EffectDict'
import type { EffectEntry } from './EffectDict'
import { getTagColorClass } from '../../constants/tagColors'
import EffectOwners from './EffectOwners'

// ─── 효과 텍스트 태그 렌더러 ───────────────────────────────
// "[150%]{red} 물리 피해. [아찔한 회피]{green} 획득" → 색 입힌 글자
//   red    수치 (피해량, %)
//   yellow 턴, 쿨타임, TP, 중첩
//   green  버프 이름
//   orange 디버프 이름
//   blue / purple  용도 미정
// green/orange 는 버프/디버프 사전에 있으면 호버 시 툴팁을 띄운다.
// 툴팁 안의 버프 이름도 그대로 호버할 수 있게 툴팁이 옆으로 이어진다.

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
const TOOLTIP_GAP = 10
const MAX_TOOLTIP_DEPTH = 3   // 툴팁 → 툴팁 → 툴팁 까지
const CLOSE_DELAY = 150       // 태그와 툴팁 사이를 지나가는 동안 닫히지 않게

const durationLabel = (duration: number | null) =>
    duration == null ? null : duration === PERMANENT_DURATION ? '영구' : `${duration}턴`

// 첫 툴팁은 태그 위(또는 아래), 이어지는 툴팁은 옆에 붙인다
const tooltipPosition = (anchor: DOMRect, depth: number) => {
    if (depth === 0) {
        const half = TOOLTIP_WIDTH / 2
        const above = anchor.top > 220
        return {
            left: Math.min(Math.max(anchor.left + anchor.width / 2, half + 8), window.innerWidth - half - 8),
            top: above ? anchor.top - TOOLTIP_GAP : anchor.bottom + TOOLTIP_GAP,
            transform: `translate(-50%, ${above ? '-100%' : '0'})`,
        }
    }

    const toRight = anchor.right + TOOLTIP_GAP + TOOLTIP_WIDTH < window.innerWidth - 8
    return {
        left: toRight ? anchor.right + TOOLTIP_GAP : Math.max(8, anchor.left - TOOLTIP_GAP - TOOLTIP_WIDTH),
        top: Math.max(8, Math.min(anchor.top - 16, window.innerHeight - 280)),
        transform: 'none',
    }
}

// ─── 툴팁 카드 ─────────────────────────────────────────────

const EffectTooltip = ({ entry, anchor, depth, onMouseEnter, onMouseLeave }: {
    entry: EffectEntry
    anchor: DOMRect
    depth: number
    onMouseEnter: () => void
    onMouseLeave: () => void
}) => {
    const isBuff = entry.kind === 'buff'
    const accent = isBuff ? '#4ADE80' : '#FB923C'
    const users = useEffectUsers(entry.name)
    const duration = durationLabel(entry.duration)
    const pos = tooltipPosition(anchor, depth)

    return createPortal(
        <div
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            className="fixed z-50 rounded-lg p-3 shadow-2xl"
            style={{
                width: TOOLTIP_WIDTH,
                left: pos.left,
                top: pos.top,
                transform: pos.transform,
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
                <ElementBadge element={entry.element} />
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
                ? <EffectText text={entry.effectText} className="block text-xs leading-relaxed text-stone-300" depth={depth + 1} />
                : <span className="text-xs text-stone-600">설명 없음</span>}

            {users.length > 0 && (
                <div className="mt-2 flex items-center gap-2 border-t border-stone-800 pt-2">
                    <span className="text-[11px] text-stone-500">사용자</span>
                    <EffectOwners owners={users} max={4} size={24} />
                    {users.length === 1 && <span className="text-[11px] text-stone-300">{users[0].name}</span>}
                </div>
            )}
        </div>,
        document.body
    )
}

// ─── 버프/디버프 이름 태그 ──────────────────────────────────

const EffectTag = ({ label, hex, depth }: { label: string; hex: string; depth: number }) => {
    const entry = useEffectEntry(label)
    const ref = useRef<HTMLSpanElement>(null)
    const timer = useRef<number | undefined>(undefined)
    const [anchor, setAnchor] = useState<DOMRect | null>(null)

    useEffect(() => () => window.clearTimeout(timer.current), [])

    if (!entry) return <span className="font-semibold" style={{ color: hex }}>{label}</span>

    const open = () => {
        window.clearTimeout(timer.current)
        setAnchor(ref.current?.getBoundingClientRect() ?? null)
    }

    // 태그 → 툴팁으로 마우스를 옮기는 사이에 닫히지 않도록 살짝 늦게 닫는다
    const closeLater = () => {
        window.clearTimeout(timer.current)
        timer.current = window.setTimeout(() => setAnchor(null), CLOSE_DELAY)
    }

    return (
        <>
            <span
                ref={ref}
                onMouseEnter={open}
                onMouseLeave={closeLater}
                className="cursor-help font-semibold underline decoration-dotted underline-offset-2"
                style={{ color: hex }}
            >
                {label}
            </span>
            {anchor && (
                <EffectTooltip
                    entry={entry}
                    anchor={anchor}
                    depth={depth}
                    onMouseEnter={() => window.clearTimeout(timer.current)}
                    onMouseLeave={closeLater}
                />
            )}
        </>
    )
}

// ─── 본체 ──────────────────────────────────────────────────

const EffectText = ({ text, className, depth = 0 }: { text: string | null | undefined; className?: string; depth?: number }) => {
    if (!text) return null

    const parts: React.ReactNode[] = []
    let last = 0
    for (const match of text.matchAll(TAG_PATTERN)) {
        const [whole, label, color] = match
        const start = match.index
        if (start > last) parts.push(text.slice(last, start))
        const hex = TEXT_TAG_COLORS[color]
        if (!hex) parts.push(label)
        else if ((color === 'green' || color === 'orange') && depth < MAX_TOOLTIP_DEPTH)
            parts.push(<EffectTag key={start} label={label} hex={hex} depth={depth} />)
        else
            parts.push(<span key={start} className="font-semibold" style={{ color: hex }}>{label}</span>)
        last = start + whole.length
    }
    if (last < text.length) parts.push(text.slice(last))

    return <span className={className}>{parts}</span>
}

export default EffectText
