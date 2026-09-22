import { useState, useEffect, useMemo } from 'react'
import ElementBadge from '../components/common/ElementBadge'
import { getBuffList, getDebuffList } from '../api/buffApi'
import type { BuffDto, DebuffDto, TagDto, EffectOwnerDto } from '../api/buffApi'
import EffectText from '../components/common/EffectText'
import { EffectDictProvider, PERMANENT_DURATION } from '../components/common/EffectDict'
import { getTagColorClass } from '../constants/tagColors'
import EffectOwners from '../components/common/EffectOwners'

// ─── 버프/디버프 목록 ──────────────────────────────────────
// 아이콘이 없어서 펼치는 리스트로. 한 줄에 이름·태그·지속/중첩·사용자, 펼치면 레벨별 효과

type Kind = 'buff' | 'debuff'

// 버프/디버프를 한 모양으로 다룬다
interface EffectRow {
    id: number
    name: string
    description: string | null
    element: string | null
    duration: number | null
    maxStack: number | null
    levels: { level: number; levelName: string | null; effectText: string | null; duration: number | null; maxStack: number | null }[]
    tags: TagDto[]
    usedBy: EffectOwnerDto[]
}

const toRow = (e: BuffDto | DebuffDto): EffectRow => ({
    id: 'buffId' in e ? e.buffId : e.debuffId,
    name: e.name,
    description: e.description,
    element: e.element,
    duration: e.duration,
    maxStack: e.maxStack,
    levels: [...e.levels].sort((a, b) => a.level - b.level),
    tags: e.tags,
    usedBy: e.usedBy,
})

const KIND_COLOR: Record<Kind, string> = { buff: '#4ADE80', debuff: '#FB923C' }

const durationLabel = (duration: number | null) =>
    duration == null ? null : duration === PERMANENT_DURATION ? '영구' : `${duration}턴`

const EffectItem = ({ row, kind }: { row: EffectRow; kind: Kind }) => {
    const [open, setOpen] = useState(false)
    const accent = KIND_COLOR[kind]
    const duration = durationLabel(row.duration)

    return (
        <div className="overflow-hidden rounded" style={{ border: `1px solid ${accent}33`, background: 'rgba(0,0,0,0.3)' }}>
            <button type="button" onClick={() => setOpen(!open)}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left">
                <span className="text-base font-semibold shrink-0" style={{ color: accent }}>{row.name}</span>
                <ElementBadge element={row.element} />

                {row.tags.map(tag => (
                    <span key={tag.tagId} className={`rounded px-1.5 py-0.5 text-[11px] ${getTagColorClass(tag.color)}`}>{tag.name}</span>
                ))}

                <span className="ml-auto flex items-center gap-4 text-xs text-stone-500">
                    {row.levels.length > 0 && <span>{row.levels.length}단계</span>}
                    {duration && <span>지속 <span className="text-stone-300">{duration}</span></span>}
                    {row.maxStack != null && row.maxStack > 1 && <span>중첩 <span className="text-stone-300">{row.maxStack}</span></span>}
                </span>

                <EffectOwners owners={row.usedBy} />
                <span className="text-xs" style={{ color: accent }}>{open ? '▲' : '▼'}</span>
            </button>

            {open && (
                <div className="border-t px-4 py-3" style={{ borderColor: `${accent}26` }}>
                    {row.description && (
                        <div className="mb-2 text-sm text-stone-300 leading-relaxed"><EffectText text={row.description} /></div>
                    )}
                    {row.levels.length > 0 && (
                        <div className="space-y-2">
                            {row.levels.map(lvl => {
                                const lvlDuration = durationLabel(lvl.duration ?? row.duration)
                                const lvlStack = lvl.maxStack ?? row.maxStack
                                return (
                                    <div key={lvl.level} className="flex gap-3 text-sm">
                                        <span className="h-fit shrink-0 rounded px-2 py-0.5 text-xs font-bold"
                                              style={{ background: `${accent}1f`, color: accent }}>
                                            {lvl.level}단계
                                        </span>
                                        <div className="min-w-0">
                                            <EffectText text={lvl.effectText} className="text-stone-300 leading-relaxed" />
                                            <div className="mt-0.5 flex gap-3 text-[11px] text-stone-600">
                                                {lvlDuration && <span>지속 {lvlDuration}</span>}
                                                {lvlStack != null && lvlStack > 1 && <span>중첩 {lvlStack}</span>}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                    {!row.description && row.levels.length === 0 && (
                        <div className="text-sm text-stone-600">설명 없음</div>
                    )}
                </div>
            )}
        </div>
    )
}

const BuffList = () => {
    const [buffs, setBuffs] = useState<EffectRow[]>([])
    const [debuffs, setDebuffs] = useState<EffectRow[]>([])
    const [loading, setLoading] = useState(true)
    const [kind, setKind] = useState<Kind>('buff')
    const [search, setSearch] = useState('')
    const [tagFilter, setTagFilter] = useState<number | null>(null)

    useEffect(() => {
        Promise.all([getBuffList().catch(() => []), getDebuffList().catch(() => [])])
            .then(([b, d]) => {
                setBuffs(b.map(toRow))
                setDebuffs(d.map(toRow))
            })
            .finally(() => setLoading(false))
    }, [])

    const rows = kind === 'buff' ? buffs : debuffs

    const tags = useMemo(() => {
        const map = new Map<number, TagDto>()
        rows.forEach(r => r.tags.forEach(t => map.set(t.tagId, t)))
        return [...map.values()].sort((a, b) => a.tagId - b.tagId)
    }, [rows])

    const filtered = rows.filter(r =>
        (!search || r.name.includes(search)) &&
        (tagFilter == null || r.tags.some(t => t.tagId === tagFilter))
    )

    return (
        <EffectDictProvider>
            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto max-w-screen-lg px-8 py-6">
                    <div className="mb-6">
                        <h1 className="font-cinzel text-2xl font-bold tracking-widest text-[var(--accent)] mb-1">버프 / 디버프</h1>
                        <p className="text-xs text-stone-500">버프 {buffs.length}개 · 디버프 {debuffs.length}개</p>
                    </div>

                    {/* 버프 / 디버프 전환 */}
                    <div className="mb-4 flex gap-2">
                        {(['buff', 'debuff'] as Kind[]).map(k => (
                            <button key={k} type="button"
                                    onClick={() => { setKind(k); setTagFilter(null) }}
                                    className="rounded px-4 py-1.5 text-sm"
                                    style={{
                                        border: `1px solid ${kind === k ? KIND_COLOR[k] : 'var(--card-border)'}`,
                                        color: kind === k ? KIND_COLOR[k] : '#A8A29E',
                                        background: kind === k ? `${KIND_COLOR[k]}14` : 'transparent',
                                    }}>
                                {k === 'buff' ? '버프' : '디버프'}
                            </button>
                        ))}
                    </div>

                    {/* 검색 · 태그 */}
                    <div className="mb-5 flex flex-wrap items-center gap-2">
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="이름 검색..."
                            className="rounded border border-[var(--card-border)] bg-black/30 px-3 py-1.5 text-sm text-stone-200 placeholder:text-stone-600 outline-none"
                            style={{ minWidth: 160 }}
                        />
                        {tags.map(tag => (
                            <button key={tag.tagId} type="button"
                                    onClick={() => setTagFilter(tagFilter === tag.tagId ? null : tag.tagId)}
                                    className={`rounded px-2 py-1 text-xs ${getTagColorClass(tag.color)}`}
                                    style={{ opacity: tagFilter == null || tagFilter === tag.tagId ? 1 : 0.4 }}>
                                {tag.name}
                            </button>
                        ))}
                    </div>

                    {loading ? (
                        <div className="py-20 text-center font-cinzel text-sm tracking-widest text-stone-500">LOADING...</div>
                    ) : filtered.length === 0 ? (
                        <div className="py-20 text-center text-sm text-stone-600">결과가 없습니다</div>
                    ) : (
                        <div className="space-y-2">
                            {filtered.map(row => <EffectItem key={`${kind}_${row.id}`} row={row} kind={kind} />)}
                        </div>
                    )}
                </div>
            </div>
        </EffectDictProvider>
    )
}

export default BuffList
