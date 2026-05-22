import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCharacterList } from '../api/characterApi'
import type { CharacterSummaryDto } from '../api/characterApi'

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
    rare: '희귀', hero: '영웅', legend: '전설', outer: '아우터원'
}

const CharacterList = () => {
    const navigate = useNavigate()
    const [characters, setCharacters] = useState<CharacterSummaryDto[]>([])
    const [loading, setLoading] = useState(true)
    const [filterElement, setFilterElement] = useState<string>('all')
    const [filterGrade, setFilterGrade] = useState<string>('all')
    const [search, setSearch] = useState('')

    useEffect(() => {
        getCharacterList()
            .then(setCharacters)
            .finally(() => setLoading(false))
    }, [])

    const filtered = characters.filter(c => {
        if (filterElement !== 'all' && c.element !== filterElement) return false
        if (filterGrade !== 'all' && c.grade !== filterGrade) return false
        if (search && !c.name.includes(search)) return false
        return true
    })

    return (
        <div className="flex-1 overflow-y-auto">
            <div className="max-w-screen-xl mx-auto px-8 py-6">
                {/* 헤더 */}
                <div className="mb-6">
                    <h1 className="font-cinzel text-2xl font-bold tracking-widest text-[var(--accent)] mb-1">캐릭터</h1>
                    <p className="text-xs text-stone-500">{characters.length}명 등록</p>
                </div>

                {/* 필터 */}
                <div className="mb-6 flex flex-wrap gap-3">
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="이름 검색..."
                        className="rounded border border-[var(--card-border)] bg-black/30 px-3 py-1.5 text-sm text-stone-200 placeholder:text-stone-600 outline-none"
                        style={{ minWidth: 160 }}
                    />
                    <div className="flex gap-1">
                        {['all', 'fire', 'light', 'crystal', 'nature', 'dark'].map(el => (
                            <button key={el} onClick={() => setFilterElement(el)}
                                    className="px-3 py-1.5 rounded text-xs font-medium"
                                    style={{
                                        border: `1px solid ${filterElement === el ? (el === 'all' ? 'rgba(255,255,255,0.3)' : ELEMENT_COLORS[el]?.border) : 'rgba(255,255,255,0.1)'}`,
                                        background: filterElement === el ? (el === 'all' ? 'rgba(255,255,255,0.05)' : ELEMENT_COLORS[el]?.bg) : 'transparent',
                                        color: filterElement === el ? (el === 'all' ? '#fff' : ELEMENT_COLORS[el]?.text) : '#6B7280'
                                    }}
                            >
                                {el === 'all' ? '전체' : ELEMENT_LABELS[el]}
                            </button>
                        ))}
                    </div>
                    <div className="flex gap-1">
                        {['all', 'legend', 'hero', 'rare', 'outer'].map(gr => (
                            <button key={gr} onClick={() => setFilterGrade(gr)}
                                    className="px-3 py-1.5 rounded text-xs"
                                    style={{
                                        border: `1px solid ${filterGrade === gr ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)'}`,
                                        background: filterGrade === gr ? 'rgba(255,255,255,0.05)' : 'transparent',
                                        color: filterGrade === gr ? '#fff' : '#6B7280'
                                    }}
                            >
                                {gr === 'all' ? '전체' : GRADE_LABELS[gr]}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 목록 */}
                {loading ? (
                    <div className="py-20 text-center text-stone-500 font-cinzel tracking-widest text-sm">LOADING...</div>
                ) : filtered.length === 0 ? (
                    <div className="py-20 text-center text-stone-600 text-sm">캐릭터가 없습니다</div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                        {filtered.map(c => {
                            const color = ELEMENT_COLORS[c.element] ?? ELEMENT_COLORS['light']
                            return (
                                <button
                                    key={c.characterId}
                                    onClick={() => navigate(`/characters/${c.characterId}`)}
                                    className="group rounded overflow-hidden text-left"
                                    style={{ border: `1px solid ${color.border}`, background: 'rgba(0,0,0,0.3)' }}
                                >
                                    {/* 이미지 */}
                                    <div className="relative aspect-[3/4] overflow-hidden" style={{ background: color.bg }}>
                                        {c.thumbnailUrl ? (
                                            <img src={c.thumbnailUrl} className="w-full h-full object-cover object-top" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-stone-700 text-xs">No Image</div>
                                        )}
                                        {/* 속성 뱃지 */}
                                        <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded text-xs font-bold"
                                             style={{ background: color.primary, color: '#000', fontSize: 9 }}>
                                            {ELEMENT_LABELS[c.element]}
                                        </div>
                                    </div>
                                    {/* 이름 */}
                                    <div className="px-2 py-2">
                                        <div className="text-xs font-medium text-stone-200 truncate">{c.name}</div>
                                        <div className="text-xs mt-0.5" style={{ color: color.text }}>{GRADE_LABELS[c.grade]}</div>
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