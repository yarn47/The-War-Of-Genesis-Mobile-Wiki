import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getWeaponList } from '../api/itemApi'
import type { ExclusiveWeaponDto } from '../api/itemApi'

const GRADE_LABELS: Record<string, string> = { rare: '희귀', hero: '영웅', legend: '전설' }
const GRADE_COLORS: Record<string, string> = { rare: '#93C5FD', hero: '#C4B5FD', legend: '#FCD34D' }

const ItemList = () => {
    const navigate = useNavigate()
    const [weapons, setWeapons] = useState<ExclusiveWeaponDto[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')

    useEffect(() => {
        getWeaponList()
            .then(setWeapons)
            .catch(() => setWeapons([]))
            .finally(() => setLoading(false))
    }, [])

    const filtered = weapons.filter(w => !search || w.name.includes(search))

    return (
        <div className="flex-1 overflow-y-auto">
            <div className="max-w-screen-xl mx-auto px-8 py-6">
                <div className="mb-6">
                    <h1 className="font-cinzel text-2xl font-bold tracking-widest text-[var(--accent)] mb-1">아이템</h1>
                    <p className="text-xs text-stone-500">전용무기 {weapons.length}개</p>
                </div>

                <div className="mb-6">
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="이름 검색..."
                        className="rounded border border-[var(--card-border)] bg-black/30 px-3 py-1.5 text-sm text-stone-200 placeholder:text-stone-600 outline-none"
                        style={{ minWidth: 160 }}
                    />
                </div>

                {loading ? (
                    <div className="py-20 text-center text-stone-500 font-cinzel tracking-widest text-sm">LOADING...</div>
                ) : filtered.length === 0 ? (
                    <div className="py-20 text-center text-stone-600 text-sm">전용무기가 없습니다</div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                        {filtered.map(w => {
                            const gradeColor = GRADE_COLORS[w.grade] ?? '#D6D3D1'
                            return (
                                <button
                                    key={w.weaponId}
                                    onClick={() => navigate(`/items/weapons/${w.weaponId}`)}
                                    className="rounded overflow-hidden text-left"
                                    style={{ border: `1px solid ${gradeColor}59`, background: 'rgba(0,0,0,0.3)' }}
                                >
                                    <div className="aspect-square overflow-hidden" style={{ background: `${gradeColor}14` }}>
                                        {w.iconUrl ? (
                                            <img src={w.iconUrl} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-stone-700 text-xs">No Image</div>
                                        )}
                                    </div>
                                    <div className="px-2 py-2">
                                        <div className="text-xs font-medium text-stone-200 truncate">{w.name}</div>
                                        <div className="text-xs mt-0.5 truncate" style={{ color: gradeColor }}>
                                            {GRADE_LABELS[w.grade] ?? w.grade}{w.weaponType ? ` · ${w.weaponType}` : ''}
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

export default ItemList
