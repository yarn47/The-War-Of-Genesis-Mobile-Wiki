import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCharacterList } from '../api/characterApi'
import type { CharacterSummaryDto } from '../api/characterApi'

// ─── 캐릭터 목록 ───────────────────────────────────────────
// 검색·정렬 한 줄 + 라벨 붙인 칩 필터(속성/등급/진영) + 카드 그리드

const ELEMENT_COLORS: Record<string, { primary: string; border: string; bg: string; text: string }> = {
    fire:    { primary: '#EF4444', border: 'rgba(239,68,68,0.35)',  bg: 'rgba(239,68,68,0.08)',  text: '#FCA5A5' },
    light:   { primary: '#F59E0B', border: 'rgba(245,158,11,0.35)', bg: 'rgba(245,158,11,0.08)', text: '#FCD34D' },
    crystal: { primary: '#3B82F6', border: 'rgba(59,130,246,0.35)', bg: 'rgba(59,130,246,0.08)', text: '#93C5FD' },
    nature:  { primary: '#10B981', border: 'rgba(16,185,129,0.35)', bg: 'rgba(16,185,129,0.08)', text: '#6EE7B7' },
    dark:    { primary: '#9333EA', border: 'rgba(147,51,234,0.35)', bg: 'rgba(147,51,234,0.08)', text: '#C4B5FD' },
}

const ELEMENT_LABELS: Record<string, string> = {
    fire: '자유의불꽃', light: '신념의빛', crystal: '지성의결정체', nature: '활력의나무', dark: '욕망의그림자'
}

const GRADE_LABELS: Record<string, string> = {
    outer: '아우터원', legend: '전설', hero: '영웅', rare: '희귀'
}

const GRADE_COLORS: Record<string, string> = {
    outer: '#F472B6', legend: '#FCD34D', hero: '#C4B5FD', rare: '#93C5FD'
}

const FACTION_LABELS: Record<string, string> = {
    geysir: '게이시르', pendragon: '팬드래건', independent: '무소속',
    astania: '아스타니아', zephyrfalcon: '제피르팰컨', dagal: '다갈'
}

const GRADE_ORDER = ['outer', 'legend', 'hero', 'rare']

type SortKey = 'recent' | 'name' | 'grade'

const SORTS: { key: SortKey; label: string }[] = [
    { key: 'recent', label: '최신순' },
    { key: 'name', label: '이름순' },
    { key: 'grade', label: '등급순' },
]

// ─── 필터 칩 ───────────────────────────────────────────────

const Chip = ({ label, active, color, onClick }: { label: string; active: boolean; color?: string; onClick: () => void }) => (
    <button
        type="button"
        onClick={onClick}
        className="rounded px-3 py-1 text-xs transition"
        style={{
            border: `1px solid ${active ? (color ?? 'rgba(255,255,255,0.45)') : 'transparent'}`,
            background: active ? `${color ?? '#FFFFFF'}1f` : 'rgba(255,255,255,0.04)',
            color: active ? (color ?? '#FFFFFF') : '#8A8580',
        }}
    >
        {label}
    </button>
)

const FilterRow = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="flex items-start gap-3">
        <span className="w-10 shrink-0 pt-1.5 text-xs text-stone-600">{label}</span>
        <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
)

// ─── 페이지 ────────────────────────────────────────────────

const CharacterList = () => {
    const navigate = useNavigate()
    const [characters, setCharacters] = useState<CharacterSummaryDto[]>([])
    const [loading, setLoading] = useState(true)
    const [element, setElement] = useState('all')
    const [grade, setGrade] = useState('all')
    const [faction, setFaction] = useState('all')
    const [search, setSearch] = useState('')
    const [sort, setSort] = useState<SortKey>('recent')

    useEffect(() => {
        getCharacterList()
            .then(setCharacters)
            .finally(() => setLoading(false))
    }, [])

    // 진영 칩은 실제로 등록된 것만
    const factions = useMemo(
        () => [...new Set(characters.map(c => c.faction))].sort((a, b) =>
            (FACTION_LABELS[a] ?? a).localeCompare(FACTION_LABELS[b] ?? b, 'ko')),
        [characters]
    )

    const filtered = useMemo(() => {
        const rows = characters.filter(c =>
            (element === 'all' || c.element === element) &&
            (grade === 'all' || c.grade === grade) &&
            (faction === 'all' || c.faction === faction) &&
            (!search || c.name.includes(search))
        )
        return rows.sort((a, b) => {
            if (sort === 'name') return a.name.localeCompare(b.name, 'ko')
            if (sort === 'grade') {
                const d = GRADE_ORDER.indexOf(a.grade) - GRADE_ORDER.indexOf(b.grade)
                return d !== 0 ? d : a.name.localeCompare(b.name, 'ko')
            }
            // 최신순: 출시일 없는 캐릭터는 뒤로
            if (!a.releaseDate && !b.releaseDate) return a.name.localeCompare(b.name, 'ko')
            if (!a.releaseDate) return 1
            if (!b.releaseDate) return -1
            return b.releaseDate.localeCompare(a.releaseDate)
        })
    }, [characters, element, grade, faction, search, sort])

    const isFiltered = element !== 'all' || grade !== 'all' || faction !== 'all' || !!search

    return (
        <div className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-screen-xl px-8 py-6">
                {/* 헤더 */}
                <div className="mb-5">
                    <h1 className="mb-1 font-cinzel text-2xl font-bold tracking-widest text-[var(--accent)]">캐릭터</h1>
                    <p className="text-xs text-stone-500">
                        {isFiltered ? `${filtered.length}명 / 전체 ${characters.length}명` : `${characters.length}명 등록`}
                    </p>
                </div>

                {/* 검색 · 정렬 */}
                <div className="mb-3 flex flex-wrap items-center gap-2">
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="이름 검색..."
                        className="rounded border border-[var(--card-border)] bg-black/30 px-3 py-1.5 text-sm text-stone-200 outline-none placeholder:text-stone-600"
                        style={{ minWidth: 180 }}
                    />
                    <div className="ml-auto flex gap-1.5">
                        {SORTS.map(s => (
                            <Chip key={s.key} label={s.label} active={sort === s.key} onClick={() => setSort(s.key)} />
                        ))}
                    </div>
                </div>

                {/* 필터 */}
                <div className="mb-6 space-y-2 rounded p-3"
                     style={{ border: '1px solid var(--card-border)', background: 'rgba(0,0,0,0.25)' }}>
                    <FilterRow label="속성">
                        <Chip label="전체" active={element === 'all'} onClick={() => setElement('all')} />
                        {Object.keys(ELEMENT_LABELS).map(el => (
                            <Chip key={el} label={ELEMENT_LABELS[el]} active={element === el}
                                  color={ELEMENT_COLORS[el].primary} onClick={() => setElement(el)} />
                        ))}
                    </FilterRow>
                    <FilterRow label="등급">
                        <Chip label="전체" active={grade === 'all'} onClick={() => setGrade('all')} />
                        {GRADE_ORDER.map(g => (
                            <Chip key={g} label={GRADE_LABELS[g]} active={grade === g}
                                  color={GRADE_COLORS[g]} onClick={() => setGrade(g)} />
                        ))}
                    </FilterRow>
                    {factions.length > 1 && (
                        <FilterRow label="진영">
                            <Chip label="전체" active={faction === 'all'} onClick={() => setFaction('all')} />
                            {factions.map(f => (
                                <Chip key={f} label={FACTION_LABELS[f] ?? f} active={faction === f}
                                      onClick={() => setFaction(f)} />
                            ))}
                        </FilterRow>
                    )}
                </div>

                {/* 목록 */}
                {loading ? (
                    <div className="py-20 text-center font-cinzel text-sm tracking-widest text-stone-500">LOADING...</div>
                ) : filtered.length === 0 ? (
                    <div className="py-20 text-center text-sm text-stone-600">조건에 맞는 캐릭터가 없습니다</div>
                ) : (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                        {filtered.map(c => {
                            const color = ELEMENT_COLORS[c.element] ?? ELEMENT_COLORS['light']
                            return (
                                <button
                                    key={c.characterId}
                                    type="button"
                                    onClick={() => navigate(`/characters/${c.characterId}`)}
                                    className="group overflow-hidden rounded text-left transition"
                                    style={{ border: `1px solid ${color.border}`, background: 'rgba(0,0,0,0.3)' }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.borderColor = color.primary
                                        e.currentTarget.style.boxShadow = `0 0 14px ${color.bg}`
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.borderColor = color.border
                                        e.currentTarget.style.boxShadow = 'none'
                                    }}
                                >
                                    <div className="aspect-[3/4] overflow-hidden" style={{ background: color.bg }}>
                                        {c.thumbnailUrl
                                            ? <img src={c.thumbnailUrl} alt="" className="h-full w-full object-cover object-top transition duration-200 group-hover:scale-[1.03]" />
                                            : <div className="flex h-full w-full items-center justify-center text-xs text-stone-700">No Image</div>}
                                    </div>
                                    <div className="px-2.5 py-2">
                                        <div className="flex items-center gap-1.5">
                                            <span className="h-2 w-2 shrink-0 rounded-full" title={ELEMENT_LABELS[c.element]}
                                                  style={{ background: color.primary }} />
                                            <span className="truncate text-sm font-medium text-stone-100">{c.name}</span>
                                        </div>
                                        <div className="mt-0.5 truncate text-[11px] text-stone-500">
                                            <span style={{ color: GRADE_COLORS[c.grade] ?? '#A8A29E' }}>{GRADE_LABELS[c.grade] ?? c.grade}</span>
                                            {' · '}{FACTION_LABELS[c.faction] ?? c.faction}
                                        </div>
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}

export default CharacterList
